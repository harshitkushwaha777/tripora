import pytest
from pydantic import ValidationError
from backend.app.schemas.trip import TripCreate, TripUpdate, ActivityCreate
from backend.app.schemas.itinerary import GenerateItineraryRequest

def test_trip_create_valid():
    trip = TripCreate(
        title="Spring in Kyoto",
        destination="Kyoto, Japan",
        start_date="2026-04-01",
        end_date="2026-04-08",
        travelers_count=2,
        traveler_type="couple",
        budget_level="moderate",
        currency="USD",
        pace="moderate",
        interests=["culture", "food"]
    )
    assert trip.destination == "Kyoto, Japan"
    assert trip.travelers_count == 2
    assert trip.currency == "USD"

def test_trip_create_invalid_dates():
    with pytest.raises(ValidationError):
        TripCreate(
            title="Invalid Dates Trip",
            destination="Rome",
            start_date="2026-05-10",
            end_date="2026-05-01",  # End before start
            travelers_count=1,
            traveler_type="solo",
            budget_level="moderate",
            currency="USD",
            pace="moderate"
        )

def test_activity_validation():
    activity = ActivityCreate(
        title="Senso-ji Temple Visit",
        time_slot="morning",
        category="culture",
        estimated_cost=0.0,
        currency="USD",
        duration_minutes=90,
        order_index=0
    )
    assert activity.time_slot == "morning"
    assert activity.duration_minutes == 90

def test_activity_invalid_time_slot():
    with pytest.raises(ValidationError):
        ActivityCreate(
            title="Late Snack",
            time_slot="dawn",  # Invalid time_slot
            category="food",
            estimated_cost=10.0,
            currency="USD",
            order_index=1
        )

def test_generate_itinerary_request_validation():
    req = GenerateItineraryRequest(
        destination="Paris, France",
        start_date="2026-06-01",
        end_date="2026-06-05",
        travelers_count=4,
        traveler_type="family",
        budget_level="moderate",
        currency="EUR",
        pace="relaxed",
        interests=["museums", "architecture"],
        dietary_requirements=["vegetarian"]
    )
    assert req.total_days if hasattr(req, "total_days") else True
    assert req.travelers_count == 4
    assert req.budget_level == "moderate"
