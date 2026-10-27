from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class ActivityBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    time_slot: str = Field(..., pattern="^(morning|afternoon|evening|night)$")
    start_time: Optional[str] = Field(None, pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    end_time: Optional[str] = Field(None, pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")
    duration_minutes: Optional[int] = Field(None, ge=5, le=1440)
    category: str = Field("sightseeing", max_length=50)
    location_name: Optional[str] = Field(None, max_length=200)
    location_address: Optional[str] = Field(None, max_length=300)
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    estimated_cost: float = Field(0.0, ge=0)
    currency: str = Field("USD", min_length=3, max_length=3)
    booking_url: Optional[str] = None
    transport_info: Optional[str] = None
    order_index: int = Field(0, ge=0)

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    time_slot: Optional[str] = Field(None, pattern="^(morning|afternoon|evening|night)$")
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    category: Optional[str] = None
    location_name: Optional[str] = None
    location_address: Optional[str] = None
    estimated_cost: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = None
    booking_url: Optional[str] = None
    transport_info: Optional[str] = None
    order_index: Optional[int] = None

class ActivityResponse(ActivityBase):
    id: str
    day_id: str
    trip_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class DayBase(BaseModel):
    day_number: int = Field(..., ge=1)
    date: str  # YYYY-MM-DD
    title: str = Field(..., min_length=1, max_length=200)
    theme: Optional[str] = Field(None, max_length=200)
    notes: Optional[str] = None
    daily_estimated_cost: float = Field(0.0, ge=0)

class DayCreate(DayBase):
    activities: List[ActivityCreate] = []

class DayResponse(DayBase):
    id: str
    trip_id: str
    activities: List[ActivityResponse] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class TripBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=150)
    destination: str = Field(..., min_length=2, max_length=150)
    origin: Optional[str] = Field(None, max_length=150)
    start_date: str
    end_date: str
    travelers_count: int = Field(1, ge=1, le=50)
    traveler_type: str = Field("solo", pattern="^(solo|couple|family|friends|business)$")
    budget_level: str = Field("moderate", pattern="^(budget|moderate|luxury)$")
    currency: str = Field("USD", min_length=3, max_length=3)
    pace: str = Field("moderate", pattern="^(relaxed|moderate|fast-paced)$")
    interests: List[str] = Field(default_factory=list)
    accommodation_type: Optional[str] = Field("hotel", max_length=50)
    transport_preference: Optional[str] = Field("mixed", max_length=50)
    dietary_requirements: List[str] = Field(default_factory=list)
    accessibility_needs: Optional[str] = None
    notes: Optional[str] = None
    cover_image_url: Optional[str] = None

    @field_validator("end_date")
    @classmethod
    def validate_dates(cls, end_date: str, info) -> str:
        start_date = info.data.get("start_date")
        if start_date and end_date < start_date:
            raise ValueError("end_date must be greater than or equal to start_date")
        return end_date

class TripCreate(TripBase):
    pass

class TripUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=2, max_length=150)
    destination: Optional[str] = None
    origin: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    travelers_count: Optional[int] = Field(None, ge=1, le=50)
    traveler_type: Optional[str] = None
    budget_level: Optional[str] = None
    currency: Optional[str] = None
    pace: Optional[str] = None
    interests: Optional[List[str]] = None
    accommodation_type: Optional[str] = None
    transport_preference: Optional[str] = None
    dietary_requirements: Optional[List[str]] = None
    accessibility_needs: Optional[str] = None
    notes: Optional[str] = None
    cover_image_url: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(planning|confirmed|completed|archived)$")

class TripResponse(TripBase):
    id: str
    user_id: str
    status: str = "planning"
    total_estimated_budget: float = 0.0
    ai_generation_metadata: Dict[str, Any] = {}
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    days: List[DayResponse] = []
    user_role: Optional[str] = "owner"
