from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import routes
# from .api import chatbot  # ← Comment this out for now
from .config import settings
import logging

logger = logging.getLogger(__name__)

import contextlib

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    """Check AI models on startup"""
    logger.info("=" * 60)
    logger.info("CALO CAL BACKEND STARTING")
    logger.info("=" * 60)
    
    # Check Gemini
    try:
        from .ml.gemini_vision import gemini_vision
        if gemini_vision.model:
            logger.info("✅ Gemini Vision: Ready (FREE tier)")
            logger.info("   Model: gemini-2.5-flash")
            logger.info("   Limit: 15 req/min, 1500/day")
        else:
            logger.warning("⚠️  Gemini: No API key - add to .env")
    except Exception as e:
        logger.error(f"❌ Gemini failed: {e}")
    
    logger.info("=" * 60)
    yield

app = FastAPI(
    title="Calo Cal API",
    description="Backend API for Calo Cal food tracking app",
    version="1.0.0",
    lifespan=lifespan
)
origins = [
    "https://https://calocal-self.vercel.app",
    "http://localhost:8001"
]

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(routes.router)
# app.include_router(chatbot.router, prefix="/api/chat", tags=["chatbot"])  # ← Comment out

@app.get("/")
async def root():
    return {
        "message": "Calo Cal API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True
    )
