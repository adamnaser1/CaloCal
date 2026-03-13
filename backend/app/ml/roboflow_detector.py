import requests
import json
import os
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

ROBOFLOW_API_KEY = "pGOBLYVDZWdxjksqY8vJ"
ROBOFLOW_MODEL = "detection-tunisian-food-2025/5"
ROBOFLOW_URL = f"https://serverless.roboflow.com/detection-tunisian-food-2025/5"

# Load Tunisian food database from JSON
DB_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'tunisian_foods.json')

def load_tunisian_foods():
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            foods_map = {}
            for dish in data.get('dishes', []):
                dish_info = {
                    'name_fr': dish.get('names', [''])[0],
                    'name_ar': dish.get('names', [''])[1] if len(dish.get('names', [])) > 1 else dish.get('names', [''])[0],
                    'avg_portion_g': dish.get('typical_portion_g', 200),
                    'kcal_per_100g': dish.get('nutrition_per_100g', {}).get('calories', 100)
                }
                for label in dish.get('roboflow_labels', []):
                    foods_map[label.lower()] = dish_info
                
                # Also add id as fallback
                if dish.get('id'):
                    foods_map[dish.get('id').lower()] = dish_info
                
            return foods_map
    except Exception as e:
        logger.error(f"Could not load tunisian_foods.json: {e}")
        return {}

TUNISIAN_FOODS = load_tunisian_foods()

def detect_tunisian_food(image_path: str) -> Optional[Dict]:
    """
    Detect Tunisian food using Roboflow model
    Returns dish name and confidence
    """
    try:
        with open(image_path, 'rb') as img_file:
            response = requests.post(
                ROBOFLOW_URL,
                params={
                    "api_key": ROBOFLOW_API_KEY,
                    "confidence": 40,
                    "overlap": 30
                },
                files={"file": img_file}
            )
        
        if response.status_code == 200:
            data = response.json()
            predictions = data.get('predictions', [])
            
            if predictions:
                # Get highest confidence prediction
                best_pred = max(predictions, key=lambda x: x.get('confidence', 0))
                dish_class = best_pred.get('class', '').lower()
                confidence = best_pred.get('confidence', 0)
                
                # Map to Tunisian food database
                if dish_class in TUNISIAN_FOODS:
                    food_info = TUNISIAN_FOODS[dish_class]
                    
                    logger.info(f"✅ Roboflow detected: {food_info['name_fr']} ({confidence:.2%})")
                    
                    return {
                        'dish_name': food_info['name_fr'],
                        'dish_name_ar': food_info['name_ar'],
                        'confidence': confidence,
                        'portion_g': food_info['avg_portion_g'],
                        'kcal_per_100g': food_info['kcal_per_100g']
                    }
        
        return None
        
    except Exception as e:
        logger.error(f"Roboflow detection failed: {e}")
        return None
