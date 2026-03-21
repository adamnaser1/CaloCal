import google.generativeai as genai
from PIL import Image
from typing import Dict
import json
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class GeminiVisionAnalyzer:
    """
    gemini-2.5-flash for food analysis
    FREE: 15 requests/minute, 1500/day
    """
    
    def __init__(self):
        try:
            if not settings.gemini_api_key:
                logger.warning("⚠️  GEMINI_API_KEY not set")
                self.model = None
                return
            
            # Configure Gemini
            genai.configure(api_key=settings.gemini_api_key)
            
            # gemini-2.5-flash (STABLE, not beta)
            self.model = genai.GenerativeModel(
                model_name='gemini-2.5-flash'
            )
            
            logger.info("✅ gemini-2.5-flash ready (FREE tier)")
            
        except Exception as e:
            logger.error(f"Gemini init failed: {e}")
            self.model = None
    
    def analyze_image(self, image_path: str) -> Dict:
        """
        Analyze food image with Gemini
        """
        if self.model is None:
            raise RuntimeError("Gemini not available - check API key")
        
        img = None
        response_text = ""
        
        try:
            # Load image
            img = Image.open(image_path)
            
            # Prepare prompt
            prompt = """You are a nutrition expert. Analyze this food photo.

Identify:
1. Main dish name (give real name for tunisian meals)
2. ALL visible ingredients
3. Portion size for EACH ingredient in grams
4. Calories and macros for EACH ingredient

IMPORTANT: Give DIFFERENT portions for each ingredient.
Don't use the same portion for everything.

Examples:
- Rice: 200g
- Chicken: 120g  
- Vegetables: 80g
- Sauce: 30g

Respond with ONLY valid JSON (no markdown):
{
  "dish_name": "name or 'Mixed meal'",
  "confidence": 0.85,
  "total_calories": 500,
  "items": [
    {
      "name": "ingredient",
      "quantity_g": 150,
      "calories": 200,
      "proteins": 10,
      "carbs": 30,
      "fats": 5,
      "confidence": 0.9
    }
  ]
}"""
            
            # Generate content
            response = self.model.generate_content(
                [prompt, img],
                generation_config=genai.types.GenerationConfig(
                    temperature=0.4,
                )
            )
            
            # Close image immediately
            img.close()
            img = None
            
            # Get text response
            response_text = response.text
            
            logger.info(f"Gemini raw response: {response_text[:200]}...")
            
            # Clean markdown if present
            if "```json" in response_text:
                response_text = response_text.split("```json")[1]
                response_text = response_text.split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1]
                response_text = response_text.split("```")[0]
            
            # Parse JSON
            result = json.loads(response_text.strip())
            
            # Validate
            if not result.get('items'):
                logger.warning("Gemini returned no items")
                result['items'] = []
            
            logger.info(f"✅ Gemini: {result.get('dish_name')}")
            logger.info(f"   Items: {len(result.get('items', []))}")
            
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON from Gemini")
            logger.error(f"Response was: {response_text}")
            
            # Return fallback
            return {
                "dish_name": "Analyzed Meal",
                "confidence": 0.5,
                "total_calories": 400,
                "items": [
                    {
                        "name": "Main dish",
                        "quantity_g": 250,
                        "calories": 400,
                        "proteins": 20,
                        "carbs": 50,
                        "fats": 12,
                        "confidence": 0.5
                    }
                ]
            }
            
        except Exception as e:
            logger.error(f"Gemini failed: {e}")
            raise
            
        finally:
            # Ensure image is closed
            if img:
                try:
                    img.close()
                except:
                    pass

    def calculate_macros_for_dish(self, image_path: str, dish_name: str, portion_g: int) -> Dict:
        """
        Calculate macros for a specific Tunisian dish
        """
        if self.model is None:
            raise RuntimeError("Gemini not available")
        
        img = None
        try:
            img = Image.open(image_path)
            
            prompt = f"""You are a nutrition expert. I have detected this dish: "{dish_name}"

The portion size is approximately {portion_g}g.

Calculate the detailed nutritional breakdown for this SPECIFIC dish.

Respond with ONLY valid JSON:
{{
  "total_calories": number,
  "total_proteins": number,
  "total_carbs": number,
  "total_fats": number,
  "items": [
    {{
      "name": "ingredient name",
      "quantity_g": grams,
      "calories": kcal,
      "proteins": g,
      "carbs": g,
      "fats": g
    }}
  ]
}}"""
            
            response = self.model.generate_content([prompt, img])
            img.close()
            img = None
            
            response_text = response.text
            
            # Clean markdown
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            result = json.loads(response_text.strip())
            
            logger.info(f"✅ Gemini calculated macros for {dish_name}")
            
            return result
            
        except Exception as e:
            logger.error(f"Gemini macro calculation failed: {e}")
            raise
        finally:
            if img:
                try: img.close()
                except: pass

    def analyze_voice_meal(self, audio_path: str) -> Dict:
        """
        Analyze meal from voice input (multilingual)
        """
        if self.model is None:
            raise RuntimeError("Gemini not available")
        
        try:
            # Read audio file
            with open(audio_path, 'rb') as audio_file:
                audio_data = audio_file.read()
            
            # Use Gemini with audio input
            prompt = """You are a multilingual nutrition assistant. The user is describing a meal they ate.

Listen to the audio and:
1. Transcribe what they said
2. Detect the language (English, French, or Tunisian Arabic)
3. Identify the dish name
4. Estimate portion size and nutritional values

Respond with ONLY valid JSON:
{
  "transcription": "what the user said",
  "language": "en/fr/ar",
  "dish_name": "name of the dish",
  "total_calories": number,
  "total_proteins": number,
  "total_carbs": number,
  "total_fats": number,
  "portion_g": estimated grams,
  "items": [
    {
      "name": "ingredient",
      "quantity_g": grams,
      "calories": kcal,
      "proteins": g,
      "carbs": g,
      "fats": g
    }
  ]
}

If the user said they ate a Tunisian dish (brik, couscous, lablabi, etc.), use Tunisian names."""
            
            # Create file-like object for Gemini
            audio_part = {
                "mime_type": "audio/webm",
                "data": audio_data
            }
            
            response = self.model.generate_content([prompt, audio_part])
            
            response_text = response.text
            
            # Clean markdown
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            result = json.loads(response_text.strip())
            
            logger.info(f"✅ Voice analyzed: {result.get('dish_name')} ({result.get('language')})")
            
            return result
            
        except Exception as e:
            logger.error(f"Voice analysis failed: {e}")
            raise

# Global instance
gemini_vision = GeminiVisionAnalyzer()
