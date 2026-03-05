import requests

API_URL = "http://localhost:8000"

def test_api_health():
    """Test API is running"""
    r = requests.get(f"{API_URL}/health")
    assert r.status_code == 200
    print("✅ API is running")

def test_model_endpoint():
    """Test model test endpoint"""
    r = requests.get(f"{API_URL}/api/test")
    data = r.json()
    
    print(f"✅ Model test: {data}")
    assert data.get("status") == "ok"

def test_analyze_image():
    """Test image analysis"""
    # Use a test image from Roboflow dataset
    # Or download one locally
    
    test_image = "test_couscous.jpg"
    
    try:
        with open(test_image, 'rb') as f:
            r = requests.post(
                f"{API_URL}/api/analyze-meal",
                files={"image": ("test.jpg", f, "image/jpeg")}
            )
        
        assert r.status_code == 200
        data = r.json()
        
        print(f"✅ Analysis result:")
        print(f"   Success: {data.get('success')}")
        print(f"   Dish: {data.get('meal_name')}")
        print(f"   Confidence: {data.get('confidence'):.2%}")
        print(f"   Calories: {data.get('total_calories')} kcal")
        
        assert data["success"] == True
        
    except FileNotFoundError:
        print("⚠️  No test image found, skipping image test")

if __name__ == "__main__":
    test_api_health()
    test_model_endpoint()
    test_analyze_image()
    print("\n✅ ALL TESTS PASSED")
