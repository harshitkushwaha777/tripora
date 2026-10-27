from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class UserProfileBase(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    default_currency: str = Field("USD", min_length=3, max_length=3)
    travel_style: str = Field("balanced", max_length=50)
    dietary_preferences: List[str] = Field(default_factory=list)
    bio: Optional[str] = Field(None, max_length=500)

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    default_currency: Optional[str] = None
    travel_style: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None
    bio: Optional[str] = None

class UserProfileResponse(UserProfileBase):
    id: str
    email: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class AuthenticatedUser(BaseModel):
    id: str
    email: Optional[str] = None
    role: Optional[str] = "authenticated"
