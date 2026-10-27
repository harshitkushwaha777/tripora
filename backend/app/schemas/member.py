from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class MemberBase(BaseModel):
    role: str = Field("viewer", pattern="^(owner|editor|viewer)$")

class MemberInviteRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    role: str = Field("viewer", pattern="^(editor|viewer)$")

class MemberResponse(MemberBase):
    id: str
    trip_id: str
    user_id: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    joined_at: Optional[datetime] = None

class InvitationResponse(BaseModel):
    id: str
    trip_id: str
    email: str
    role: str
    expires_at: datetime
    accepted_at: Optional[datetime] = None
    created_at: datetime

class AcceptInvitationRequest(BaseModel):
    invitation_token: str
