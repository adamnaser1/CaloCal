from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import google.generativeai as genai
from datetime import datetime
import json
import logging
import httpx

router = APIRouter()
logger = logging.getLogger(__name__)

from ..config import settings

# Configure Gemini
try:
    if settings.gemini_api_key:
        genai.configure(api_key=settings.gemini_api_key)
    else:
        logger.warning("Gemini API key not configured in settings")
except Exception as e:
    logger.warning(f"Gemini API key configuration failed: {e}")

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    user_id: str
    language: Optional[str] = 'en'

class ChatResponse(BaseModel):
    conversation_id: str
    response: str
    action: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

# System prompt
SYSTEM_PROMPT = """You are Calo Cal AI Assistant, a helpful nutrition chatbot for a Tunisian food tracking app.

CAPABILITIES:
1. Answer nutrition questions
2. Add meals via natural language ("I ate a brik for breakfast")
3. Get user stats ("How am I doing today?")
4. Provide personalized nutrition advice
5. Support English, French, and Tunisian Arabic

RULES:
- Be friendly and use emojis appropriately
- For Tunisian dishes, use local names (brik, couscous, lablabi, mloukhiya, etc.)
- When user wants to log a meal, respond with an action
- Always respond in the user's language

ACTION FORMAT:
When you need to perform an action, respond with JSON:
{
  "action": {
    "type": "add_meal" | "get_stats" | "modify_meal",
    "params": {
      "meal_name": "dish name",
      "meal_type": "breakfast|lunch|dinner|snack",
      "portion": "optional portion size"
    }
  },
  "response": "Your friendly message"
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
  "response": "Got it! Logging a brik for breakfast 🥟 A typical brik has around 280 kcal with 12g protein. Let me save that for you!"
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
  "response": "باهي! نسجل الكسكس متاع الغذاء 🍲 الكسكس العادي فيه تقريبا 500 كالوري. باهي هكذا؟"
}

User: "How am I doing today?"
Assistant:
{
  "action": {
    "type": "get_stats"
  },
  "response": "Let me check your progress for today! 📊"
}

Be conversational and helpful!
"""

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chatbot endpoint
    """
    try:
        # Build conversation with Gemini
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Add user context
        context = f"{SYSTEM_PROMPT}\n\nUSER_ID: {request.user_id}\nLANGUAGE: {request.language}\n\n"
        
        chat_session = model.start_chat(history=[
            {"role": "user", "parts": [context]},
            {"role": "model", "parts": ["I understand. Ready to help!"]}
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
        except Exception as e:
            logger.warning(f"Could not parse action: {e}")
        
        # Execute action if present
        action_result = None
        if action:
            action_result = await execute_action(action, request.user_id)
            
            # Append result to response
            if action_result and action_result.get("success"):
                if action["type"] == "add_meal":
                    response_text += f"\n\n✅ Meal saved successfully!"
                elif action["type"] == "get_stats":
                    stats = action_result.get("stats", {})
                    response_text += f"\n\n📊 Today's stats:\n"
                    response_text += f"🔥 {stats.get('today_calories', 0)} / {stats.get('daily_goal', 2000)} kcal\n"
                    response_text += f"💪 Protein: {stats.get('today_proteins', 0)}g\n"
                    response_text += f"🍽️ Meals logged: {stats.get('meals_today', 0)}\n"
                    response_text += f"🔥 Streak: {stats.get('current_streak', 0)} days"
        
        conversation_id = request.conversation_id or f"conv_{datetime.utcnow().timestamp()}"
        
        return ChatResponse(
            conversation_id=conversation_id,
            response=response_text,
            action=action,
            metadata={
                "user_id": request.user_id,
                "timestamp": datetime.utcnow().isoformat(),
                "action_executed": action_result is not None
            }
        )
        
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def execute_action(action: Dict, user_id: str) -> Optional[Dict]:
    """
    Execute chatbot action via n8n webhook
    """
    N8N_CHATBOT_WEBHOOK = "https://cooper-uncalculating-parthenia.ngrok-free.dev/webhook/chatbot-action"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                N8N_CHATBOT_WEBHOOK,
                json={
                    "type": action["type"],
                    "user_id": user_id,
                    "params": action.get("params", {})
                },
                timeout=30.0
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"n8n webhook failed: {response.status_code}")
                return None
                
    except Exception as e:
        logger.error(f"Action execution failed: {e}")
        return None
