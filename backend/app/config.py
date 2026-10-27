import os
from pydantic_settings import BaseSettings
from typing import Optional, List

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Supabase credentials (read via env, never hardcoded)
    SUPABASE_URL: str = "https://ufoxvgdikrjlhicxoaku.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    SUPABASE_JWT_SECRET: Optional[str] = None
    
    # Frontend Origin for CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    ADDITIONAL_ALLOWED_ORIGINS: List[str] = ["http://127.0.0.1:5173", "http://localhost:3000"]
    
    # AI Engine Configuration
    AI_PROVIDER: str = "gemini"  # 'gemini', 'openai', 'anthropic', 'none'
    AI_API_KEY: Optional[str] = None
    AI_MODEL: str = "gemini-1.5-flash"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
