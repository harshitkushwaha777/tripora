import httpx
from typing import Optional
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.config import settings
from backend.app.schemas.user import AuthenticatedUser
import logging

logger = logging.getLogger(__name__)

security_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme)
) -> AuthenticatedUser:
    """
    Validates Supabase Bearer token against Supabase Auth API.
    Does not trust unverified user_ids sent by the client.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    # Check for demo/sample mode bypass during local preview if needed
    if settings.ENVIRONMENT == "development" and token == "demo-token-preview":
        return AuthenticatedUser(
            id="demo-user-id-00000000-0000-0000-0000-000000000001",
            email="traveler@tripora.example.com",
            role="authenticated"
        )
        
    # Verify token with Supabase Auth
    supabase_url = settings.SUPABASE_URL.rstrip("/")
    verify_url = f"{supabase_url}/auth/v1/user"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": "sb_publishable_0JnnErG6pvFQ1q2fOKAyjg_RMkFb1k-"  # Client publishable key used for auth headers
    }
    
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(verify_url, headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                return AuthenticatedUser(
                    id=user_data.get("id"),
                    email=user_data.get("email"),
                    role=user_data.get("role", "authenticated")
                )
            else:
                logger.warning(f"Supabase auth check failed with status {response.status_code}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired access token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
    except httpx.RequestError as exc:
        logger.error(f"Error reaching Supabase auth endpoint: {exc}")
        # If in development or network glitch, provide friendly error
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to verify credentials with authentication server",
        )

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme)
) -> Optional[AuthenticatedUser]:
    """Allows anonymous or demo requests while recognizing authenticated users."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
