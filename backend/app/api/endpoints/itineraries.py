from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional

from backend.app.schemas.itinerary import (
    GenerateItineraryRequest,
    GeneratedItineraryResponse,
    GeneratedDay,
    RegenerateDayRequest,
    RegenerateActivityRequest,
)
from backend.app.schemas.trip import ActivityBase
from backend.app.schemas.user import AuthenticatedUser
from backend.app.core.security import get_optional_user, get_current_user
from backend.app.services.ai_planner import (
    generate_itinerary,
    regenerate_day,
    regenerate_activity,
)

router = APIRouter()

@router.post("/generate", response_model=GeneratedItineraryResponse)
async def generate_trip_itinerary(
    request: GenerateItineraryRequest,
    user: Optional[AuthenticatedUser] = Depends(get_optional_user)
):
    """
    Generates a personalized day-by-day travel itinerary.
    Accessible to authenticated users and guest previewers.
    Uses AI model when configured, otherwise uses deterministic fallback.
    """
    try:
        itinerary = await generate_itinerary(request)
        return itinerary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate itinerary: {str(e)}"
        )

@router.post("/regenerate-day", response_model=GeneratedDay)
async def regenerate_single_day(
    request: RegenerateDayRequest,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """Regenerates a single day's activities without modifying the rest of the trip."""
    try:
        return await regenerate_day(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to regenerate day: {str(e)}"
        )

@router.post("/regenerate-activity", response_model=ActivityBase)
async def regenerate_single_activity(
    request: RegenerateActivityRequest,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """Regenerates an individual activity suggestion."""
    try:
        return await regenerate_activity(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to regenerate activity: {str(e)}"
        )
