import pytest
from backend.app.schemas.itinerary import (
    GenerateItineraryRequest,
    GeneratedItineraryResponse,
    BudgetBreakdown,
    RegenerateDayRequest,
)
from backend.app.schemas.trip import (
    TripCreate,
    TripUpdate,
    TripResponse,
    ActivityCreate,
    ActivityUpdate,
    DayResponse,
    ActivityResponse,
)
from backend.app.schemas.user import AuthenticatedUser
from backend.app.services.fallback_planner import (
    generate_fallback_itinerary,
    regenerate_fallback_day,
)

def test_api_itinerary_generation_contract():
    req = GenerateItineraryRequest(
        destination="Rome, Italy",
        start_date="2026-09-15",
        end_date="2026-09-18",
        travelers_count=2,
        traveler_type="couple",
        budget_level="moderate",
        currency="EUR",
        pace="moderate",
        interests=["history", "food"],
        accommodation_type="Boutique Hotel",
        transport_preference="Public Transit & Walking",
        dietary_requirements=["None"]
    )
    result = generate_fallback_itinerary(req)
    assert isinstance(result, GeneratedItineraryResponse)
    assert result.destination == "Rome, Italy"
    assert len(result.days) == 4
    assert result.generation_source == "fallback_engine"
    assert result.budget_summary.total_estimated > 0

    # Test serialization to dict/json as API would do
    data = result.model_dump()
    assert "trip_title" in data
    assert "budget_summary" in data
    assert "practical_tips" in data
    assert "days" in data

def test_trip_crud_models_and_authorization():
    owner = AuthenticatedUser(id="owner-uuid-001", email="owner@tripora.example.com")
    intruder = AuthenticatedUser(id="intruder-uuid-999", email="intruder@tripora.example.com")

    trip_create = TripCreate(
        title="Spring in Amsterdam",
        destination="Amsterdam, Netherlands",
        start_date="2026-04-10",
        end_date="2026-04-14",
        travelers_count=2,
        traveler_type="couple",
        budget_level="moderate",
        currency="EUR",
        pace="relaxed",
        interests=["museums", "cycling"]
    )

    # Validate TripResponse initialization
    trip_resp = TripResponse(
        id="test-trip-id",
        user_id=owner.id,
        **trip_create.model_dump(),
        status="planning",
        total_estimated_budget=1600.0,
        days=[
            DayResponse(
                id="day-1",
                trip_id="test-trip-id",
                day_number=1,
                date="2026-04-10",
                title="Arrival & Canal Walk",
                daily_estimated_cost=60.0,
                activities=[
                    ActivityResponse(
                        id="act-1",
                        day_id="day-1",
                        trip_id="test-trip-id",
                        title="Canal Cruise",
                        time_slot="afternoon",
                        category="sightseeing",
                        estimated_cost=25.0,
                        currency="EUR",
                        order_index=0
                    )
                ]
            )
        ]
    )

    assert trip_resp.user_id == owner.id
    assert trip_resp.user_id != intruder.id
    assert trip_resp.days[0].activities[0].title == "Canal Cruise"
    assert trip_resp.total_estimated_budget == 1600.0

def test_trip_update_status_transitions():
    update_conf = TripUpdate(status="confirmed")
    assert update_conf.status == "confirmed"

    update_arch = TripUpdate(status="archived")
    assert update_arch.status == "archived"

    with pytest.raises(Exception):
        TripUpdate(status="invalid_status")

def test_activity_mutation_contract():
    act_create = ActivityCreate(
        title="Visit Van Gogh Museum",
        time_slot="morning",
        category="culture",
        estimated_cost=22.0,
        currency="EUR",
        duration_minutes=120,
        location_name="Museumplein 6",
        order_index=0
    )
    assert act_create.estimated_cost == 22.0

    act_update = ActivityUpdate(estimated_cost=25.0, duration_minutes=150)
    assert act_update.estimated_cost == 25.0
    assert act_update.duration_minutes == 150
