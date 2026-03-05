import requests
from pathlib import Path

API_URL = "http://localhost:8000"

def test_health():
    print("Testing /health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"
        print("✅ Health check passed")
    except Exception as e:
        print(f"❌ Health check failed: {e}")

def test_analyze_meal():
    print("\nTesting /api/analyze-meal endpoint...")
    # Look for any images in the tests/images folder
    image_dir = Path(__file__).parent / "images"
    test_images = list(image_dir.glob("*.jpg"))
    
    if not test_images:
        print(f"⚠️ Skip analyze-meal test: No images found in {image_dir}")
        return
    
    image_path = test_images[0]
    print(f"Using test image: {image_path.name}")

    with open(image_path, 'rb') as f:
        response = requests.post(
            f"{API_URL}/api/analyze-meal",
            files={"image": f}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert "meal_name" in data
    assert "total_calories" in data
    print(f"✅ Recognized: {data['meal_name']}")
    print(f"✅ Calories: {data['total_calories']}")

if __name__ == "__main__":
    # Note: The server must be running for these tests to work
    test_health()
    test_analyze_meal()
