from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import io
import tempfile
import os
import logging
from ..ml.gemini_vision import gemini_vision
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
