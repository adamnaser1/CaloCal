from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import io
import tempfile
import os
import logging
from ..ml.gemini_vision import gemini_vision
from ..ml.roboflow_detector import detect_tunisian_food
from ..utils.image import preprocess_image

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["analysis"])

@router.post("/analyze-meal")
async def analyze_meal(image: UploadFile = File(...)):
    """
    Analyze meal photo using Gemini Vision AI (100% FREE)
    """
    temp_file = None
    pil_image = None
    
    try:
        logger.info("=== Starting Gemini Analysis ===")
        
        # Read uploaded image
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes))
        logger.info(f"Image loaded: {pil_image.size}")
        
        # Preprocess (resize if needed)
        pil_image = preprocess_image(pil_image)
        logger.info(f"Preprocessed: {pil_image.size}")
        
        # Save to temp file (Gemini needs file path)
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix='.jpg',
            mode='wb'
        ) as temp:
            pil_image.save(temp, format='JPEG', quality=85)
            temp_file = temp.name
        
        logger.info(f"Temp file created: {temp_file}")
        
        # CRITICAL: Close PIL image to release file lock
        pil_image.close()
        pil_image = None
        
        # Analyze with Gemini
        logger.info("Calling Gemini Vision API...")
        gemini_result = gemini_vision.analyze_image(temp_file)
        
        logger.info(f"Gemini response: {gemini_result.get('dish_name')}")
        logger.info(f"Items detected: {len(gemini_result.get('items', []))}")
        
        # Clean up temp file
        try:
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)
                logger.info("Temp file deleted")
        except Exception as e:
            logger.warning(f"Could not delete temp file: {e}")
        
        # Format response for frontend
        items = gemini_result.get('items', [])
        
        total_proteins = sum(item.get('proteins', 0) for item in items)
        total_carbs = sum(item.get('carbs', 0) for item in items)
        total_fats = sum(item.get('fats', 0) for item in items)
        total_portion = sum(item.get('quantity_g', 0) for item in items)
        
        response = {
            'success': True,
            'meal_name': gemini_result.get('dish_name', 'Analyzed Meal'),
            'confidence': gemini_result.get('confidence', 0.85),
            'source': 'gemini_vision_free',
            'total_calories': gemini_result.get('total_calories', 0),
            'total_proteins': round(total_proteins, 1),
            'total_carbs': round(total_carbs, 1),
            'total_fats': round(total_fats, 1),
            'portion_g': int(total_portion),
            'items': [
                {
                    'name': item.get('name', 'Unknown'),
                    'quantity_g': item.get('quantity_g', 0),
                    'calories': item.get('calories', 0),
                    'proteins': round(item.get('proteins', 0), 1),
                    'carbs': round(item.get('carbs', 0), 1),
                    'fats': round(item.get('fats', 0), 1),
                    'confidence': item.get('confidence', 0.8),
                    'estimated': False
                }
                for item in items
            ]
        }
        
        logger.info("=== Analysis Complete ===")
        return response
        
    except Exception as e:
        # Error handling
        logger.error("=" * 60)
        logger.error("GEMINI ANALYSIS FAILED")
        logger.error(f"Error: {str(e)}")
        logger.error("=" * 60)
        
        # Clean up
        if pil_image:
            try:
                pil_image.close()
            except:
                pass
        
        if temp_file:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            except:
                pass
        
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "message": "Gemini analysis failed - check backend logs"
            }
        )

@router.post("/analyze-meal-hybrid")
async def analyze_meal_hybrid(image: UploadFile = File(...)):
    """
    Hybrid analysis:
    1. Try Roboflow for Tunisian food detection
    2. If detected, use Gemini for macro calculation
    3. If not detected, use full Gemini analysis
    """
    temp_file = None
    pil_image = None
    
    try:
        # Save image temporarily
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image = preprocess_image(pil_image)
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg', mode='wb') as temp:
            pil_image.save(temp, format='JPEG', quality=85)
            temp_file = temp.name
        
        pil_image.close()
        pil_image = None
        
        # STEP 1: Try Roboflow detection
        logger.info("=== Trying Roboflow detection ===")
        roboflow_result = detect_tunisian_food(temp_file)
        
        if roboflow_result and roboflow_result.get('confidence', 0) > 0.6:
            # Tunisian food detected!
            dish_name = roboflow_result.get('dish_name')
            logger.info(f"✅ Roboflow detected: {dish_name}")
            
            # STEP 2: Ask Gemini to calculate macros for this specific dish
            gemini_result = gemini_vision.calculate_macros_for_dish(
                image_path=temp_file,
                dish_name=dish_name,
                portion_g=roboflow_result.get('portion_g', 250)
            )
            
            # Combine results
            result = {
                'success': True,
                'meal_name': dish_name,
                'confidence': roboflow_result.get('confidence'),
                'source': 'roboflow_gemini_hybrid',
                'total_calories': gemini_result.get('total_calories'),
                'total_proteins': gemini_result.get('total_proteins'),
                'total_carbs': gemini_result.get('total_carbs'),
                'total_fats': gemini_result.get('total_fats'),
                'portion_g': roboflow_result.get('portion_g'),
                'items': gemini_result.get('items', [])
            }
        else:
            # Not Tunisian food, use full Gemini
            logger.info("⚠️ Roboflow confidence low, using full Gemini")
            gemini_result = gemini_vision.analyze_image(temp_file)
            
            result = {
                'success': True,
                'meal_name': gemini_result.get('dish_name'),
                'confidence': gemini_result.get('confidence'),
                'source': 'gemini_full',
                'total_calories': gemini_result.get('total_calories'),
                'total_proteins': sum(i.get('proteins', 0) for i in gemini_result.get('items', [])),
                'total_carbs': sum(i.get('carbs', 0) for i in gemini_result.get('items', [])),
                'total_fats': sum(i.get('fats', 0) for i in gemini_result.get('items', [])),
                'portion_g': sum(i.get('quantity_g', 0) for i in gemini_result.get('items', [])),
                'items': gemini_result.get('items', [])
            }
        
        # Cleanup
        try:
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)
        except:
            pass
        
        return result
        
    except Exception as e:
        logger.error(f"Hybrid analysis failed: {e}")
        if pil_image:
            try: pil_image.close()
            except: pass
        if temp_file:
            try: os.remove(temp_file)
            except: pass
        raise HTTPException(500, detail=str(e))

@router.get("/test")
async def test_api():
    """Test if Gemini is ready"""
    return {
        "status": "ok",
        "gemini_available": gemini_vision.model is not None,
        "model": "gemini-1.5-flash-latest",
        "free_tier": "1500 requests/day"
    }

@router.post("/test-gemini")
async def test_gemini(image: UploadFile = File(...)):
    """
    Test Gemini Vision directly to see raw output
    """
    temp_file = None
    pil_image = None
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image = preprocess_image(pil_image)
        
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix='.jpg',
            mode='wb'
        ) as temp:
            pil_image.save(temp, format='JPEG')
            temp_file = temp.name
        
        # Close PIL image to release Windows file lock
        pil_image.close()
        pil_image = None
        
        # Call Gemini directly
        result = gemini_vision.analyze_image(temp_file)
        
        # Clean up
        try:
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)
        except Exception as e:
            logger.warning(f"Could not clean temp file: {e}")
        
        return {
            "raw_gemini_output": result,
            "items_count": len(result.get('items', [])),
            "all_items": result.get('items', [])
        }
        
    except Exception as e:
        if pil_image:
            try:
                pil_image.close()
            except:
                pass
        if temp_file:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            except:
                pass
        raise HTTPException(500, detail=str(e))

@router.post("/test-claude")
async def test_claude(image: UploadFile = File(...)):
    """
    Test Gemini Vision directly (Gemini replaces Claude).
    Usage: curl -F "image=@test.jpg" http://localhost:8001/api/test-claude
    """
    temp_file = None
    pil_image = None
    try:
        image_bytes = await image.read()
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image = preprocess_image(pil_image)
        
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix='.jpg',
            mode='wb'
        ) as temp:
            pil_image.save(temp, format='JPEG')
            temp_file = temp.name
        
        # Close PIL image to release Windows file lock
        pil_image.close()
        pil_image = None
        
        # Call Gemini directly
        result = gemini_vision.analyze_image(temp_file)
        
        # Clean up
        try:
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)
        except Exception as e:
            logger.warning(f"Could not clean temp file: {e}")
        
        return {
            "raw_gemini_output": result,
            "items_count": len(result.get('items', [])),
            "all_items": result.get('items', [])
        }
        
    except Exception as e:
        if pil_image:
            try:
                pil_image.close()
            except:
                pass
        if temp_file:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            except:
                pass
        raise HTTPException(500, detail=str(e))
