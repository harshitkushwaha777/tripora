from fastapi import APIRouter
from backend.app.api.endpoints import health, itineraries, trips, collaborators

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(itineraries.router, prefix="/itineraries", tags=["Itineraries"])
api_router.include_router(trips.router, prefix="/trips", tags=["Trips"])
api_router.include_router(collaborators.router, prefix="/trips", tags=["Collaborators"])
