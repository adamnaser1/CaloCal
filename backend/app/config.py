from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_key: str
    
    # Roboflow Inference SDK
    roboflow_api_key: str
    roboflow_model_id: str = "detection-tunisian-food-2025/5"
    roboflow_api_url: str = "https://serverless.roboflow.com"
    
    # Gemini Vision (FREE)
    gemini_api_key: Optional[str] = None
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8001
    
    # n8n Webhooks
    N8N_BADGE_WEBHOOK: str = "https://cooper-uncalculating-parthenia.ngrok-free.dev/webhook/badge-check"
    N8N_CHATBOT_WEBHOOK: str = "https://cooper-uncalculating-parthenia.ngrok-free.dev/webhook/chatbot-action"
    
    # ML
    roboflow_confidence_threshold: float = 0.7
    max_image_size: int = 640
    
    class Config:
        env_file = ".env"

settings = Settings()
