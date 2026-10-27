import uuid
import hashlib
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from backend.app.schemas.member import (
    MemberInviteRequest,
    MemberResponse,
    InvitationResponse,
    AcceptInvitationRequest,
)
from backend.app.schemas.user import AuthenticatedUser
from backend.app.core.security import get_current_user

router = APIRouter()

# In-memory storage for collaboration records during local preview
_MEMBERS_STORE = {}
_INVITATIONS_STORE = {}

@router.get("/{trip_id}/members", response_model=List[MemberResponse])
async def list_trip_members(
    trip_id: str,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """Lists collaborators on a trip."""
    members = [m for m in _MEMBERS_STORE.values() if m.get("trip_id") == trip_id]
    if not members:
        # Return owner as initial member
        return [
            MemberResponse(
                id=str(uuid.uuid4()),
                trip_id=trip_id,
                user_id=user.id,
                email=user.email,
                role="owner",
                full_name="Trip Organizer",
                joined_at=datetime.utcnow()
            )
        ]
    return [MemberResponse(**m) for m in members]

@router.post("/{trip_id}/invitations", response_model=InvitationResponse)
async def invite_collaborator(
    trip_id: str,
    request: MemberInviteRequest,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Creates a secure pending invitation for a collaborator.
    Uses hashed token storage and 7-day expiration.
    """
    raw_token = str(uuid.uuid4())
    token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
    invitation_id = str(uuid.uuid4())
    
    record = {
        "id": invitation_id,
        "trip_id": trip_id,
        "invited_by": user.id,
        "email": request.email.lower().strip(),
        "role": request.role,
        "token_hash": token_hash,
        "expires_at": datetime.utcnow() + timedelta(days=7),
        "accepted_at": None,
        "created_at": datetime.utcnow()
    }
    _INVITATIONS_STORE[invitation_id] = record
    
    return InvitationResponse(
        id=invitation_id,
        trip_id=trip_id,
        email=record["email"],
        role=record["role"],
        expires_at=record["expires_at"],
        created_at=record["created_at"]
    )
