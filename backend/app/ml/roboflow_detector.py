import requests
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)

ROBOFLOW_API_KEY = "pGOBLYVDZWdxjksqY8vJ"
ROBOFLOW_MODEL = "detection-tunisian-food-2025/5"
ROBOFLOW_URL = f"https://serverless.roboflow.com/detection-tunisian-food-2025/5"

# Tunisian food database with accurate portions
TUNISIAN_FOODS = {
    "brik": {"name_fr": "Brik", "name_ar": "بريك", "avg_portion_g": 120, "kcal_per_100g": 280},
    "couscous": {"name_fr": "Couscous", "name_ar": "كسكس", "avg_portion_g": 350, "kcal_per_100g": 139},
    "tajine": {"name_fr": "Tajine", "name_ar": "طاجين", "avg_portion_g": 300, "kcal_per_100g": 180},
    "lablabi": {"name_fr": "Lablabi", "name_ar": "لبلابي", "avg_portion_g": 300, "kcal_per_100g": 160},
    "fricasse": {"name_fr": "Fricassé", "name_ar": "فريكاسي", "avg_portion_g": 150, "kcal_per_100g": 220},
    "mloukhiya": {"name_fr": "Mloukhiya", "name_ar": "ملوخية", "avg_portion_g": 350, "kcal_per_100g": 95},
    "ojja": {"name_fr": "Ojja", "name_ar": "عجة", "avg_portion_g": 280, "kcal_per_100g": 240},
    "makroudh": {"name_fr": "Makroudh", "name_ar": "مقروض", "avg_portion_g": 60, "kcal_per_100g": 380},
}

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
