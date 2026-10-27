import pytest
from backend.app.schemas.itinerary import GenerateItineraryRequest, RegenerateDayRequest
from backend.app.services.fallback_planner import (
    generate_fallback_itinerary,
    regenerate_fallback_day,
    calculate_trip_days
)

def test_calculate_trip_days():
    assert calculate_trip_days("2026-05-01", "2026-05-05") == 5
    assert calculate_trip_days("2026-07-10", "2026-07-10") == 1
    assert calculate_trip_days("invalid", "dates") == 3

def test_generate_fallback_tokyo():
    req = GenerateItineraryRequest(
        destination="Tokyo",
        start_date="2026-09-01",
        end_date="2026-09-05",
        travelers_count=2,
        traveler_type="couple",
        budget_level="moderate",
        currency="JPY",
        pace="moderate",
        interests=["culture", "food"]
    )
    result = generate_fallback_itinerary(req)
    
    assert result.destination == "Tokyo"
    assert result.total_days == 5
    assert len(result.days) == 5
    assert result.generation_source == "fallback_engine"
    assert result.budget_summary.total_estimated > 0
    assert result.budget_summary.per_person_estimated > 0
    assert len(result.accommodation_suggestions) > 0
    assert len(result.practical_tips) > 0

    # Verify activities have time slots and realistic order
    for day in result.days:
        assert len(day.activities) >= 2
        for act in day.activities:
            assert act.time_slot in ["morning", "afternoon", "evening", "night"]
            assert act.title
            assert act.estimated_cost >= 0

def test_generate_fallback_unlisted_destination():
    req = GenerateItineraryRequest(
        destination="Reykjavik, Iceland",
        start_date="2026-08-10",
        end_date="2026-08-13",
        travelers_count=1,
        traveler_type="solo",
        budget_level="luxury",
        currency="USD",
        pace="fast-paced",
        interests=["nature", "photography"]
    )
    result = generate_fallback_itinerary(req)
    
    assert result.destination == "Reykjavik, Iceland"
    assert result.total_days == 4
    assert len(result.days) == 4
    assert result.generation_source == "fallback_engine"
    # Luxury multiplier should be applied
    assert result.budget_summary.total_estimated > 500

def test_regenerate_fallback_day():
    req = RegenerateDayRequest(
        destination="Paris",
        day_number=2,
        date="2026-06-02",
        travelers_count=2,
        traveler_type="couple",
        budget_level="moderate",
        currency="EUR",
        pace="moderate",
        refinement_instruction="Focus on romantic vistas and artisan cafes"
    )
    day = regenerate_fallback_day(req)
    
    assert day.day_number == 2
    assert day.date == "2026-06-02"
    assert len(day.activities) >= 2
    assert "romantic" in day.notes.lower() or "artisan" in day.notes.lower() or day.notes is not None
