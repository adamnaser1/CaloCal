# Calo Cal Backend

AI-powered food recognition API for Tunisian cuisine. This project uses CLIP and BLIP models to analyze food images and map them to a comprehensive database of Tunisian dishes.

## Setup

1.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Create `.env`**:
    Use `.env.example` as a template.

3.  **Run server**:
    ```bash
    python -m app.main
    ```

The API will be available at `http://localhost:8000`.

## Endpoints

- `POST /api/analyze-meal` - Analyze a meal photo and return nutritional information.
- `GET /health` - Health check endpoint.
- `GET /` - Root endpoint with API info.

## Models Used

- **CLIP** (`openai/clip-vit-base-patch32`) - Used for zero-shot classification against the Tunisian food database.
- **BLIP** (`Salesforce/blip-image-captioning-base`) - Used for generating descriptive captions of the food images.

All models run on CPU; no GPU is required for standard inference.

## Project Structure

- `app/`: Core FastAPI application logic.
- `data/`: Tunisian food database (JSON).
- `ml/`: Machine Learning model integration.
- `db/`: Database connection utilities.
- `utils/`: Helper functions for image processing and database queries.
- `tests/`: API testing suite.
