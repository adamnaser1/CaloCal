import json
from pathlib import Path
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class TunisianFoodDB:
    """Interface to query Tunisian food database"""
    
    def __init__(self):
        # Correctly resolve path relative to this file
        data_path = Path(__file__).parent.parent.parent / "data" / "tunisian_foods.json"
        
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            self.dishes = self.data['dishes']
            logger.info(f"Loaded {len(self.dishes)} Tunisian dishes")
        except Exception as e:
            logger.error(f"Failed to load food database at {data_path}: {e}")
            self.dishes = []
    
    def search_by_name(self, query: str) -> Optional[Dict]:
        """
        Find dish by any name variation (FR/AR/phonetic)
        
        Args:
            query: Search term (case insensitive)
            
        Returns:
            Dish dict if found, None otherwise
        """
        if not query:
            return None
            
        query_lower = query.lower().strip()
        
        # Priority 1: Exact match on any name
        for dish in self.dishes:
            if any(query_lower == name.lower() for name in dish['names']):
                return dish
        
        # Priority 2: Query is contained in a name or name is contained in query
        for dish in self.dishes:
            for name in dish['names']:
                name_lower = name.lower()
                if query_lower in name_lower or name_lower in query_lower:
                    return dish
        return None
    
    def search_by_roboflow_label(self, label: str) -> Optional[Dict]:
        """
        Find dish by Roboflow class label
        
        Args:
            label: Class name from Roboflow prediction
            
        Returns:
            Dish dict if found
        """
        label_lower = label.lower().strip()
        
        for dish in self.dishes:
            # Check roboflow_labels field
            roboflow_labels = dish.get('roboflow_labels', [])
            if any(label_lower in rl.lower() for rl in roboflow_labels):
                return dish
            
            # Fallback to name search
            if any(label_lower in name.lower() for name in dish['names']):
                return dish
        
        return None
    
    def search_by_visual_cues(self, cues: List[str]) -> List[Dict]:
        """
        Find dishes matching visual characteristics
        
        Args:
            cues: List of visual descriptors from image analysis
            
        Returns:
            List of dishes sorted by match score
        """
        if not cues:
            return []
            
        matches = []
        
        for dish in self.dishes:
            score = 0
            
            # Count how many visual cues match
            for cue in cues:
                cue_lower = cue.lower()
                for visual in dish['visual_cues']:
                    if cue_lower in visual.lower():
                        score += 1
                        break
            
            if score > 0:
                matches.append({
                    'dish': dish,
                    'score': score,
                    'confidence': score / len(dish['visual_cues']) if dish['visual_cues'] else 0
                })
        
        # Sort by score (highest first)
        return sorted(matches, key=lambda x: x['score'], reverse=True)
    
    def get_canonical_names(self) -> List[str]:
        """
        Get only the primary name for each dish (to avoid label dilution)
        
        Returns:
            Flat list of canonical name variations
        """
        return [dish['names'][0] for dish in self.dishes]

    def get_all_names(self) -> List[str]:
        """
        Get all possible dish names for classification
        
        Returns:
            Flat list of all name variations
        """
        names = []
        for dish in self.dishes:
            names.extend(dish['names'])
        return names
    
    def get_by_category(self, category: str) -> List[Dict]:
        """
        Get all dishes in a category
        
        Args:
            category: Category name (e.g., 'plat_principal', 'patisserie')
            
        Returns:
            List of dishes in that category
        """
        return [d for d in self.dishes if d['category'] == category]
    
    def get_all_categories(self) -> List[str]:
        """Get unique list of all categories"""
        return list(set(d['category'] for d in self.dishes))
    
    def calculate_nutrition(self, dish_id: str, portion_g: int) -> Optional[Dict]:
        """
        Calculate nutrition for a specific portion
        
        Args:
            dish_id: Dish identifier
            portion_g: Portion size in grams
            
        Returns:
            Nutrition dict with calories, macros
        """
        dish = next((d for d in self.dishes if d['id'] == dish_id), None)
        
        if not dish:
            return None
        
        multiplier = portion_g / 100
        nutrition = dish['nutrition_per_100g']
        
        return {
            'calories': round(nutrition['calories'] * multiplier),
            'proteins': round(nutrition['proteins'] * multiplier, 1),
            'carbs': round(nutrition['carbs'] * multiplier, 1),
            'fats': round(nutrition['fats'] * multiplier, 1),
            'fiber': round(nutrition.get('fiber', 0) * multiplier, 1)
        }

# Global singleton instance
tunisian_db = TunisianFoodDB()
