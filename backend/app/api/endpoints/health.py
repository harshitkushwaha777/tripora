from fastapi import APIRouter
from backend.app.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "tripora-backend",
        "environment": settings.ENVIRONMENT,
        "ai_provider": settings.AI_PROVIDER,
        "ai_model": settings.AI_MODEL,
        "ai_key_configured": bool(settings.AI_API_KEY),
        "fallback_engine": "available"
    }
