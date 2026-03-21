from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import google.generativeai as genai
from datetime import datetime, date
import json
import logging
import httpx
from supabase import create_client, Client
from ..config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Configure Gemini
try:
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
except Exception as e:
    logger.warning(f"Gemini API key not configured: {e}")

# Configure Supabase
try:
    supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
except Exception as e:
    logger.warning(f"Supabase not configured: {e}")
    supabase = None

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    user_id: str
    language: Optional[str] = 'en'
    access_token: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    action: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

async def get_user_context(user_id: str, access_token: str = None) -> Dict:
    """Get user data from Supabase"""
    try:
        headers = {
            "apikey": settings.supabase_key,
            "Authorization": f"Bearer {access_token}" if access_token else f"Bearer {settings.supabase_key}"
        }
        
        async with httpx.AsyncClient() as client:
            # Get user profile
            profile_resp = await client.get(
                f"{settings.supabase_url}/rest/v1/profiles?id=eq.{user_id}&select=*&limit=1",
                headers=headers
            )
            profile_data = profile_resp.json()
            if not profile_data or not isinstance(profile_data, list):
                profile = {}
            else:
                profile = profile_data[0]
            
            # Get today's meals
            today = date.today().isoformat()
            meals_resp = await client.get(
                f"{settings.supabase_url}/rest/v1/meal_logs?user_id=eq.{user_id}&logged_at=gte.{today}&select=*",
                headers=headers
            )
            meals_data = meals_resp.json()
            if not isinstance(meals_data, list):
                meals_data = []
        
        # Calculate today's totals
        today_calories = sum(meal.get('total_calories', 0) or 0 for meal in meals_data)
        today_proteins = sum(meal.get('total_proteins', 0) or 0 for meal in meals_data)
        today_carbs = sum(meal.get('total_carbs', 0) or 0 for meal in meals_data)
        today_fats = sum(meal.get('total_fats', 0) or 0 for meal in meals_data)
        
        return {
            'daily_calorie_goal': profile.get('daily_calorie_goal', 2000),
            'preferred_language': profile.get('preferred_language', 'en'),
            'today_calories': today_calories,
            'today_proteins': today_proteins,
            'today_carbs': today_carbs,
            'today_fats': today_fats,
            'meals_today': len(meals_data),
            'remaining_calories': max(0, profile.get('daily_calorie_goal', 2000) - today_calories)
        }
    except Exception as e:
        logger.error(f"Error getting user context: {e}")
        return {}

SYSTEM_PROMPT = """You are Calo Cal AI Assistant, a helpful nutrition chatbot for a Tunisian food tracking app.

CAPABILITIES:
1. Answer nutrition questions
2. Add meals via natural language ("I ate a brik for breakfast")
3. Get user stats ("How am I doing today?")
4. Provide personalized nutrition advice
5. Support English, French, and Tunisian Arabic

RULES:
- Be friendly and use emojis appropriately
- For Tunisian dishes, use local names (brik, couscous, lablabi, mloukhiya, ojja, etc.)
- When user wants to log a meal, respond with an action
- Always respond in the user's language
- Use the user's actual data from their profile

ACTION FORMAT:
When you need to perform an action, respond with JSON:
{
  "action": {
    "type": "add_meal" | "get_stats",
    "params": {
      "meal_name": "dish name",
      "meal_type": "breakfast|lunch|dinner|snack"
    }
  },
  "response": "Your friendly message to user"
}

EXAMPLES:

User: "I ate a brik for breakfast"
Assistant:
{
  "action": {
    "type": "add_meal",
    "params": {
      "meal_name": "Brik",
      "meal_type": "breakfast"
    }
  },
  "response": "Got it! Logging a brik for breakfast 🥟 A typical brik has around 280 kcal with 12g protein. You have {remaining_calories} kcal left for today!"
}

User: "كليت كسكس نهار"
Assistant:
{
  "action": {
    "type": "add_meal",
    "params": {
      "meal_name": "Couscous",
      "meal_type": "lunch"
    }
  },
  "response": "باهي! نسجل الكسكس متاع الغذاء 🍲 فيه تقريبا 500 كالوري."
}

User: "How am I doing today?"
Assistant: Based on your progress today, you've consumed {today_calories} out of {daily_goal} kcal! You have {remaining_calories} kcal remaining. You're doing great! 💪

Be conversational, encouraging, and use the REAL user data provided!
"""

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Main chatbot endpoint with real data access"""
    try:
        # Get user context from Supabase
        user_context = await get_user_context(request.user_id, request.access_token)
        
        # Build conversation with Gemini
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Add user context to prompt
        context = SYSTEM_PROMPT + f"""

USER CONTEXT (Use this real data in your responses):
- Daily Goal: {user_context.get('daily_calorie_goal', 2000)} kcal
- Today's Calories: {user_context.get('today_calories', 0)} kcal
- Today's Protein: {user_context.get('today_proteins', 0)}g
- Today's Carbs: {user_context.get('today_carbs', 0)}g
- Today's Fats: {user_context.get('today_fats', 0)}g
- Meals Today: {user_context.get('meals_today', 0)}
- Remaining Calories: {user_context.get('remaining_calories', 2000)} kcal
- Language: {request.language}
"""
        
        chat_session = model.start_chat(history=[
            {"role": "user", "parts": [context]},
            {"role": "model", "parts": ["I understand. I have access to the user's real data and will use it in my responses. Ready to help!"]}
        ])
        
        response = chat_session.send_message(request.message)
        response_text = response.text
        
        # Try to parse action
        action = None
        try:
            if "{" in response_text and "action" in response_text:
                json_start = response_text.find("{")
                json_end = response_text.rfind("}") + 1
                action_data = json.loads(response_text[json_start:json_end])
                
                if "action" in action_data:
                    action = action_data["action"]
                    response_text = action_data.get("response", response_text)
                    
                    # Replace placeholders with real data
                    response_text = response_text.replace('{remaining_calories}', str(user_context.get('remaining_calories', 0)))
                    response_text = response_text.replace('{today_calories}', str(user_context.get('today_calories', 0)))
                    response_text = response_text.replace('{daily_goal}', str(user_context.get('daily_calorie_goal', 2000)))
        except Exception as e:
            logger.warning(f"Could not parse action: {e}")
        
        # Execute action if present
        action_result = None
        if action:
            action_result = await execute_action(action, request.user_id, request.access_token)
            
            # Append result to response
            if action_result and action_result.get("success"):
                if action["type"] == "add_meal":
                    response_text += f"\n\n✅ Meal saved successfully!"
        
        conversation_id = request.conversation_id or f"conv_{datetime.utcnow().timestamp()}"
        
        return ChatResponse(
            conversation_id=conversation_id,
            response=response_text,
            action=action,
            metadata={
                "user_id": request.user_id,
                "timestamp": datetime.utcnow().isoformat(),
                "action_executed": action_result is not None,
                "user_context": user_context
            }
        )
        
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        # Fallback response
        fallback = {
            'en': "Hi! I'm your Calo Cal assistant 🤖 How can I help you today?",
            'fr': "Salut! Je suis ton assistant Calo Cal 🤖 Comment puis-je t'aider?",
            'ar': "أهلا! أنا مساعدك Calo Cal 🤖 كيف نجمك اليوم؟"
        }
        
        return ChatResponse(
            conversation_id=f"conv_{datetime.utcnow().timestamp()}",
            response=fallback.get(request.language, fallback['en']),
            action=None,
            metadata={
                "error": str(e),
                "fallback": True
            }
        )

async def execute_action(action: Dict, user_id: str, access_token: str = None) -> Optional[Dict]:
    """Execute chatbot action via n8n webhook"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.N8N_CHATBOT_WEBHOOK,
                json={
                    "type": action["type"],
                    "user_id": user_id,
                    "access_token": access_token,
                    "params": action.get("params", {})
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"n8n webhook failed: {response.status_code}")
                return {"success": False, "error": "Webhook failed"}
                
    except Exception as e:
        logger.error(f"Action execution failed: {e}")
        return {"success": False, "error": str(e)}
