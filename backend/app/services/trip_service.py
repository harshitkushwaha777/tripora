import httpx
import uuid
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from backend.app.config import settings
from backend.app.schemas.trip import (
    TripCreate,
    TripUpdate,
    TripResponse,
    DayResponse,
    ActivityResponse,
    ActivityCreate,
    ActivityUpdate,
)
from backend.app.schemas.member import MemberResponse, InvitationResponse, MemberInviteRequest
from backend.app.schemas.user import AuthenticatedUser
import logging

logger = logging.getLogger(__name__)

# In-memory store for local preview/development when Supabase tables are not yet migrated or offline
_DEV_STORE: Dict[str, Dict[str, Any]] = {
    "trips": {},
    "days": {},
    "activities": {},
    "members": {},
    "invitations": {}
}

class TripService:
    def __init__(self, user: AuthenticatedUser, user_token: Optional[str] = None):
        self.user = user
        self.user_token = user_token
        self.supabase_url = settings.SUPABASE_URL.rstrip("/")
        self.headers = {
            "apikey": "sb_publishable_0JnnErG6pvFQ1q2fOKAyjg_RMkFb1k-",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        if user_token:
            self.headers["Authorization"] = f"Bearer {user_token}"

    async def list_trips(self, status_filter: Optional[str] = None) -> List[TripResponse]:
        """Lists trips owned by or shared with the authenticated user."""
        # 1. Try Supabase PostgREST API
        if self.user_token and self.user.id != "demo-user-id-00000000-0000-0000-0000-000000000001":
            try:
                url = f"{self.supabase_url}/rest/v1/trips?select=*,itinerary_days(*,itinerary_activities(*))&order=created_at.desc"
                if status_filter:
                    url += f"&status=eq.{status_filter}"
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(url, headers=self.headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        result = []
                        for item in data:
                            days = []
                            for d in item.get("itinerary_days", []):
                                acts = [ActivityResponse(**a) for a in d.get("itinerary_activities", [])]
                                acts.sort(key=lambda x: x.order_index)
                                days.append(DayResponse(
                                    id=d["id"],
                                    trip_id=d["trip_id"],
                                    day_number=d["day_number"],
                                    date=str(d["date"]),
                                    title=d["title"],
                                    theme=d.get("theme"),
                                    notes=d.get("notes"),
                                    daily_estimated_cost=float(d.get("daily_estimated_cost", 0.0)),
                                    activities=acts
                                ))
                            days.sort(key=lambda x: x.day_number)
                            result.append(TripResponse(
                                id=item["id"],
                                user_id=item["user_id"],
                                title=item["title"],
                                destination=item["destination"],
                                origin=item.get("origin"),
                                start_date=str(item["start_date"]),
                                end_date=str(item["end_date"]),
                                travelers_count=item.get("travelers_count", 1),
                                traveler_type=item.get("traveler_type", "solo"),
                                budget_level=item.get("budget_level", "moderate"),
                                currency=item.get("currency", "USD"),
                                pace=item.get("pace", "moderate"),
                                interests=item.get("interests", []),
                                accommodation_type=item.get("accommodation_type", "hotel"),
                                transport_preference=item.get("transport_preference", "mixed"),
                                dietary_requirements=item.get("dietary_requirements", []),
                                accessibility_needs=item.get("accessibility_needs"),
                                notes=item.get("notes"),
                                cover_image_url=item.get("cover_image_url"),
                                status=item.get("status", "planning"),
                                total_estimated_budget=float(item.get("total_estimated_budget", 0.0)),
                                ai_generation_metadata=item.get("ai_generation_metadata", {}),
                                days=days
                            ))
                        return result
            except Exception as e:
                logger.warning(f"Failed to fetch trips from Supabase REST: {e}. Falling back to dev store.")

        # 2. Fallback to local dev store
        trips = [t for t in _DEV_STORE["trips"].values() if t.get("user_id") == self.user.id]
        if status_filter:
            trips = [t for t in trips if t.get("status") == status_filter]
        
        results = []
        for t in trips:
            trip_id = t["id"]
            days = [d for d in _DEV_STORE["days"].values() if d.get("trip_id") == trip_id]
            days_res = []
            for d in days:
                acts = [ActivityResponse(**a) for a in _DEV_STORE["activities"].values() if a.get("day_id") == d["id"]]
                acts.sort(key=lambda x: x.order_index)
                days_res.append(DayResponse(
                    id=d["id"],
                    trip_id=trip_id,
                    day_number=d["day_number"],
                    date=d["date"],
                    title=d["title"],
                    theme=d.get("theme"),
                    notes=d.get("notes"),
                    daily_estimated_cost=float(d.get("daily_estimated_cost", 0.0)),
                    activities=acts
                ))
            days_res.sort(key=lambda x: x.day_number)
            results.append(TripResponse(**t, days=days_res))
        return results

    async def get_trip(self, trip_id: str) -> TripResponse:
        """Retrieves a single trip with its days and activities."""
        # 1. Try Supabase
        if self.user_token and self.user.id != "demo-user-id-00000000-0000-0000-0000-000000000001":
            try:
                url = f"{self.supabase_url}/rest/v1/trips?id=eq.{trip_id}&select=*,itinerary_days(*,itinerary_activities(*))"
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(url, headers=self.headers)
                    if resp.status_code == 200:
                        items = resp.json()
                        if items:
                            item = items[0]
                            days = []
                            for d in item.get("itinerary_days", []):
                                acts = [ActivityResponse(**a) for a in d.get("itinerary_activities", [])]
                                acts.sort(key=lambda x: x.order_index)
                                days.append(DayResponse(
                                    id=d["id"],
                                    trip_id=d["trip_id"],
                                    day_number=d["day_number"],
                                    date=str(d["date"]),
                                    title=d["title"],
                                    theme=d.get("theme"),
                                    notes=d.get("notes"),
                                    daily_estimated_cost=float(d.get("daily_estimated_cost", 0.0)),
                                    activities=acts
                                ))
                            days.sort(key=lambda x: x.day_number)
                            return TripResponse(
                                id=item["id"],
                                user_id=item["user_id"],
                                title=item["title"],
                                destination=item["destination"],
                                origin=item.get("origin"),
                                start_date=str(item["start_date"]),
                                end_date=str(item["end_date"]),
                                travelers_count=item.get("travelers_count", 1),
                                traveler_type=item.get("traveler_type", "solo"),
                                budget_level=item.get("budget_level", "moderate"),
                                currency=item.get("currency", "USD"),
                                pace=item.get("pace", "moderate"),
                                interests=item.get("interests", []),
                                accommodation_type=item.get("accommodation_type", "hotel"),
                                transport_preference=item.get("transport_preference", "mixed"),
                                dietary_requirements=item.get("dietary_requirements", []),
                                accessibility_needs=item.get("accessibility_needs"),
                                notes=item.get("notes"),
                                cover_image_url=item.get("cover_image_url"),
                                status=item.get("status", "planning"),
                                total_estimated_budget=float(item.get("total_estimated_budget", 0.0)),
                                ai_generation_metadata=item.get("ai_generation_metadata", {}),
                                days=days
                            )
            except Exception as e:
                logger.warning(f"Error fetching trip {trip_id} from Supabase: {e}")

        # 2. Local dev store
        t = _DEV_STORE["trips"].get(trip_id)
        if not t:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
        
        # IDOR check
        if t["user_id"] != self.user.id and not any(m.get("trip_id") == trip_id and m.get("user_id") == self.user.id for m in _DEV_STORE["members"].values()):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this trip")

        days = [d for d in _DEV_STORE["days"].values() if d.get("trip_id") == trip_id]
        days_res = []
        for d in days:
            acts = [ActivityResponse(**a) for a in _DEV_STORE["activities"].values() if a.get("day_id") == d["id"]]
            acts.sort(key=lambda x: x.order_index)
            days_res.append(DayResponse(
                id=d["id"],
                trip_id=trip_id,
                day_number=d["day_number"],
                date=d["date"],
                title=d["title"],
                theme=d.get("theme"),
                notes=d.get("notes"),
                daily_estimated_cost=float(d.get("daily_estimated_cost", 0.0)),
                activities=acts
            ))
        days_res.sort(key=lambda x: x.day_number)
        return TripResponse(**t, days=days_res)

    async def create_trip(
        self,
        data: TripCreate,
        days_data: Optional[List[Dict[str, Any]]] = None,
        total_estimated_budget: float = 0.0,
        ai_generation_metadata: Optional[Dict[str, Any]] = None,
    ) -> TripResponse:
        """Creates a new trip (with its days and activities) and persists it."""
        trip_id = str(uuid.uuid4())
        trip_payload = {
            "id": trip_id,
            "user_id": self.user.id,
            **data.model_dump(),
            "status": "planning",
            "total_estimated_budget": total_estimated_budget,
            "ai_generation_metadata": ai_generation_metadata or {}
        }

        # Build day and activity rows first, so Supabase and the dev store share the same ids
        day_rows: List[Dict[str, Any]] = []
        act_rows: List[Dict[str, Any]] = []
        created_days: List[DayResponse] = []
        for d in (days_data or []):
            day_id = str(uuid.uuid4())
            day_rows.append({
                "id": day_id,
                "trip_id": trip_id,
                "day_number": d["day_number"],
                "date": d["date"],
                "title": d["title"],
                "theme": d.get("theme", ""),
                "notes": d.get("notes", ""),
                "daily_estimated_cost": float(d.get("daily_estimated_cost", 0.0))
            })
            acts: List[ActivityResponse] = []
            for idx, a in enumerate(d.get("activities", [])):
                a_dict = a if isinstance(a, dict) else a.model_dump()
                act_record = {
                    "id": str(uuid.uuid4()),
                    "day_id": day_id,
                    "trip_id": trip_id,
                    **a_dict,
                    "order_index": idx
                }
                act_rows.append(act_record)
                acts.append(ActivityResponse(**act_record))
            created_days.append(DayResponse(
                id=day_id,
                trip_id=trip_id,
                day_number=d["day_number"],
                date=d["date"],
                title=d["title"],
                theme=d.get("theme"),
                notes=d.get("notes"),
                daily_estimated_cost=float(d.get("daily_estimated_cost", 0.0)),
                activities=acts
            ))

        # 1. Try Supabase (trip first, then days, then activities)
        if self.user_token and self.user.id != "demo-user-id-00000000-0000-0000-0000-000000000001":
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(f"{self.supabase_url}/rest/v1/trips", json=trip_payload, headers=self.headers)
                    if resp.status_code in (200, 201):
                        logger.info(f"Created trip {trip_id} in Supabase")
                        if day_rows:
                            resp = await client.post(f"{self.supabase_url}/rest/v1/itinerary_days", json=day_rows, headers=self.headers)
                            if resp.status_code not in (200, 201):
                                logger.warning(f"Supabase days insert failed: {resp.status_code} {resp.text[:300]}")
                            elif act_rows:
                                resp = await client.post(f"{self.supabase_url}/rest/v1/itinerary_activities", json=act_rows, headers=self.headers)
                                if resp.status_code not in (200, 201):
                                    logger.warning(f"Supabase activities insert failed: {resp.status_code} {resp.text[:300]}")
                    else:
                        logger.warning(f"Supabase trip insert failed: {resp.status_code} {resp.text[:300]}")
            except Exception as e:
                logger.warning(f"Error persisting trip to Supabase: {e}")

        # Dev store record
        _DEV_STORE["trips"][trip_id] = trip_payload
        _DEV_STORE["members"][str(uuid.uuid4())] = {
            "trip_id": trip_id,
            "user_id": self.user.id,
            "role": "owner",
            "email": self.user.email
        }
        for row in day_rows:
            _DEV_STORE["days"][row["id"]] = row
        for row in act_rows:
            _DEV_STORE["activities"][row["id"]] = row

        return TripResponse(**trip_payload, days=created_days)

    async def update_trip(self, trip_id: str, data: TripUpdate) -> TripResponse:
        """Updates trip details with role check."""
        t = await self.get_trip(trip_id)
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        
        # 1. Try Supabase
        if self.user_token and self.user.id != "demo-user-id-00000000-0000-0000-0000-000000000001":
            try:
                url = f"{self.supabase_url}/rest/v1/trips?id=eq.{trip_id}"
                async with httpx.AsyncClient(timeout=8.0) as client:
                    await client.patch(url, json=update_data, headers=self.headers)
            except Exception as e:
                logger.warning(f"Error updating trip {trip_id} in Supabase: {e}")

        # Update local dev store
        if trip_id in _DEV_STORE["trips"]:
            _DEV_STORE["trips"][trip_id].update(update_data)

        return await self.get_trip(trip_id)

    async def delete_trip(self, trip_id: str) -> bool:
        """Deletes a trip if the user is the owner."""
        t = await self.get_trip(trip_id)
        if t.user_id != self.user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the trip owner can delete this trip")

        # 1. Try Supabase
        if self.user_token and self.user.id != "demo-user-id-00000000-0000-0000-0000-000000000001":
            try:
                url = f"{self.supabase_url}/rest/v1/trips?id=eq.{trip_id}"
                async with httpx.AsyncClient(timeout=8.0) as client:
                    await client.delete(url, headers=self.headers)
            except Exception as e:
                logger.warning(f"Error deleting trip {trip_id} from Supabase: {e}")

        # Remove from local dev store
        _DEV_STORE["trips"].pop(trip_id, None)
        days_to_del = [k for k, v in _DEV_STORE["days"].items() if v.get("trip_id") == trip_id]
        for d in days_to_del:
            _DEV_STORE["days"].pop(d, None)
        acts_to_del = [k for k, v in _DEV_STORE["activities"].items() if v.get("trip_id") == trip_id]
        for a in acts_to_del:
            _DEV_STORE["activities"].pop(a, None)
        return True

    async def duplicate_trip(self, trip_id: str) -> TripResponse:
        """Duplicates an existing trip including days and activities."""
        source_trip = await self.get_trip(trip_id)
        new_trip_create = TripCreate(
            title=f"Copy of {source_trip.title}",
            destination=source_trip.destination,
            origin=source_trip.origin,
            start_date=source_trip.start_date,
            end_date=source_trip.end_date,
            travelers_count=source_trip.travelers_count,
            traveler_type=source_trip.traveler_type,
            budget_level=source_trip.budget_level,
            currency=source_trip.currency,
            pace=source_trip.pace,
            interests=source_trip.interests,
            accommodation_type=source_trip.accommodation_type,
            transport_preference=source_trip.transport_preference,
            dietary_requirements=source_trip.dietary_requirements,
            accessibility_needs=source_trip.accessibility_needs,
            notes=source_trip.notes,
            cover_image_url=source_trip.cover_image_url
        )
        days_payload = [
            {
                "day_number": d.day_number,
                "date": d.date,
                "title": d.title,
                "theme": d.theme,
                "notes": d.notes,
                "daily_estimated_cost": d.daily_estimated_cost,
                "activities": [a.model_dump() for a in d.activities]
            }
            for d in source_trip.days
        ]
        return await self.create_trip(new_trip_create, days_data=days_payload)

    # Activity operations
    async def add_activity(self, trip_id: str, day_id: str, act: ActivityCreate) -> ActivityResponse:
        await self.get_trip(trip_id)
        act_id = str(uuid.uuid4())
        record = {
            "id": act_id,
            "day_id": day_id,
            "trip_id": trip_id,
            **act.model_dump()
        }
        _DEV_STORE["activities"][act_id] = record
        return ActivityResponse(**record)

    async def update_activity(self, trip_id: str, activity_id: str, act: ActivityUpdate) -> ActivityResponse:
        await self.get_trip(trip_id)
        if activity_id not in _DEV_STORE["activities"]:
            raise HTTPException(status_code=404, detail="Activity not found")
        updates = {k: v for k, v in act.model_dump().items() if v is not None}
        _DEV_STORE["activities"][activity_id].update(updates)
        return ActivityResponse(**_DEV_STORE["activities"][activity_id])

    async def delete_activity(self, trip_id: str, activity_id: str) -> bool:
        await self.get_trip(trip_id)
        if activity_id in _DEV_STORE["activities"]:
            _DEV_STORE["activities"].pop(activity_id)
            return True
        return False
