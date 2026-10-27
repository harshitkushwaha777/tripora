from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from typing import List, Optional, Dict, Any

from backend.app.schemas.trip import (
    TripCreate,
    TripCreateWithItinerary,
    TripUpdate,
    TripResponse,
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
)
from backend.app.schemas.user import AuthenticatedUser
from backend.app.core.security import get_current_user
from backend.app.services.trip_service import TripService

router = APIRouter()

def get_trip_service(
    user: AuthenticatedUser = Depends(get_current_user),
    authorization: Optional[str] = Header(None)
) -> TripService:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
    return TripService(user=user, user_token=token)

@router.get("", response_model=List[TripResponse])
async def list_trips(
    status: Optional[str] = Query(None, pattern="^(planning|confirmed|completed|archived)$"),
    service: TripService = Depends(get_trip_service)
):
    """Lists all trips accessible to the authenticated user."""
    return await service.list_trips(status_filter=status)

@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    data: TripCreateWithItinerary,
    service: TripService = Depends(get_trip_service)
):
    """Creates a new trip, including its generated days, activities and budget."""
    trip = TripCreate(**data.model_dump(exclude={"days", "total_estimated_budget", "ai_generation_metadata"}))
    return await service.create_trip(
        trip,
        days_data=[d.model_dump() for d in data.days],
        total_estimated_budget=data.total_estimated_budget,
        ai_generation_metadata=data.ai_generation_metadata,
    )

@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: str,
    service: TripService = Depends(get_trip_service)
):
    """Gets trip details by ID."""
    return await service.get_trip(trip_id)

@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: str,
    data: TripUpdate,
    service: TripService = Depends(get_trip_service)
):
    """Updates trip details."""
    return await service.update_trip(trip_id, data)

@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    trip_id: str,
    service: TripService = Depends(get_trip_service)
):
    """Deletes a trip if owner."""
    await service.delete_trip(trip_id)
    return None

@router.post("/{trip_id}/duplicate", response_model=TripResponse)
async def duplicate_trip(
    trip_id: str,
    service: TripService = Depends(get_trip_service)
):
    """Duplicates a trip and all its itinerary schedule."""
    return await service.duplicate_trip(trip_id)

@router.post("/{trip_id}/days/{day_id}/activities", response_model=ActivityResponse)
async def add_activity(
    trip_id: str,
    day_id: str,
    data: ActivityCreate,
    service: TripService = Depends(get_trip_service)
):
    return await service.add_activity(trip_id, day_id, data)

@router.patch("/{trip_id}/activities/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    trip_id: str,
    activity_id: str,
    data: ActivityUpdate,
    service: TripService = Depends(get_trip_service)
):
    return await service.update_activity(trip_id, activity_id, data)

@router.delete("/{trip_id}/activities/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_activity(
    trip_id: str,
    activity_id: str,
    service: TripService = Depends(get_trip_service)
):
    await service.delete_activity(trip_id, activity_id)
    return None
