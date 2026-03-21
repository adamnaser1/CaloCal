# Calo Cal Backend Setup

## 1. Install Dependencies
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# OR
.venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

## 2. API Key Already Configured

The Roboflow API key is already set in `.env`:
ROBOFLOW_API_KEY=pGOBLYVDZWdxjksqY8vJ
No need to get a new key!

## 3. Get Gemini API Key (FREE)

FREE TIER:
- 1,500 requests per day
- No credit card required
- Gemini 2.0 Flash (fastest model)

## 4. Run Backend
```bash
python -m app.main
```

Should see:
✅ Roboflow Inference client initialized
Model: detection-tunisian-food-2025/5
INFO: Uvicorn running on http://0.0.0.0:8001

## 5. Test
```bash
curl http://localhost:8001/api/test
```
