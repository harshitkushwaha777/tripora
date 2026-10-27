import math
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from backend.app.schemas.itinerary import (
    GenerateItineraryRequest,
    GeneratedItineraryResponse,
    GeneratedDay,
    BudgetBreakdown,
    BudgetBreakdownCategory,
    PracticalTip,
    AccommodationRecommendation,
    RegenerateDayRequest,
    RegenerateActivityRequest,
)
from backend.app.schemas.trip import ActivityBase

# Curated knowledge base for top worldwide destinations with authentic landmarks, coordinates, and local tips
DESTINATION_KNOWLEDGE: Dict[str, Dict[str, Any]] = {
    "tokyo": {
        "title": "Tokyo Explorer: Neon Skylines & Historic Sanctuaries",
        "currency": "JPY",
        "default_image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80",
        "accommodations": [
            {"name": "Hotel Ryumeikan Tokyo", "neighborhood": "Chuo / Tokyo Station", "style": "Modern Japanese Boutique", "price_tier": "moderate", "cost": 160.0, "why": "Central hub access with peaceful traditional Japanese hospitality touches."},
            {"name": "Trunk Hotel Yoyogi Park", "neighborhood": "Shibuya", "style": "Eco-Chic Luxury", "price_tier": "luxury", "cost": 420.0, "why": "Boutique oasis overlooking tranquil greenery minutes from vibrant Shibuya."},
            {"name": "Nui. Hostel & Bar Lounge", "neighborhood": "Kuramae / Asakusa", "style": "Artisan Budget", "price_tier": "budget", "cost": 55.0, "why": "Warm timber lounge, artisan coffee, and relaxed local neighborhood vibe."}
        ],
        "activities_pool": [
            {"title": "Meiji Jingu Shrine & Forest Walk", "cat": "culture", "slot": "morning", "dur": 120, "cost": 0, "loc": "Meiji Jingu, Shibuya", "desc": "Wander through the tranquil 170-acre forested path leading to Tokyo's grandest Shinto shrine.", "trans": "Short stroll from Harajuku Station on JR Yamanote Line"},
            {"title": "Tsukiji Outer Market Tasting Tour", "cat": "food", "slot": "morning", "dur": 150, "cost": 35, "loc": "Tsukiji Outer Market, Chuo", "desc": "Sample freshly rolled tamagoyaki, grilled scallops, seasonal fruit skewers, and green tea.", "trans": "Toei Oedo Line to Tsukiji-shijo Station"},
            {"title": "Asakusa Senso-ji & Nakamise-dori", "cat": "history", "slot": "morning", "dur": 120, "cost": 0, "loc": "Senso-ji, Taito", "desc": "Explore Tokyo's oldest temple, founded in 628 AD, passing through the grand Kaminarimon Gate.", "trans": "Ginza Subway Line to Asakusa Station"},
            {"title": "teamLab Planets Immersive Digital Art", "cat": "activity", "slot": "afternoon", "dur": 120, "cost": 32, "loc": "Toyosu, Koto City", "desc": "Walk through water and dynamic kaleidoscopic projection rooms designed for sensory exploration.", "trans": "Yurikamome Line to Shin-Toyosu Station"},
            {"title": "Shibuya Crossing & Hachiko Memorial", "cat": "sightseeing", "slot": "afternoon", "dur": 60, "cost": 0, "loc": "Shibuya Station Hachiko Exit", "desc": "Experience the world's most choreographed pedestrian intersection and viewpoint cafes.", "trans": "Direct access at Shibuya Station"},
            {"title": "Roppongi Hills Mori Art Museum & Sky Deck", "cat": "culture", "slot": "afternoon", "dur": 120, "cost": 20, "loc": "Roppongi Hills Mori Tower", "desc": "Contemporary art exhibitions coupled with panoramic 360-degree views of Tokyo Tower and skyline.", "trans": "Hibiya Line to Roppongi Station"},
            {"title": "Dinner at Omoide Yokocho (Memory Lane)", "cat": "food", "slot": "evening", "dur": 90, "cost": 28, "loc": "Nishi-Shinjuku", "desc": "Intimate lantern-lit alleyway featuring traditional charcoal yakitori and local seasonal fare.", "trans": "3 min walk from Shinjuku Station West Exit"},
            {"title": "Shinjuku Golden Gai Evening Discovery", "cat": "nightlife", "slot": "night", "dur": 120, "cost": 30, "loc": "Kabukicho, Shinjuku", "desc": "Cozy micro-bars nestled in six narrow post-war wooden alleys, steeped in literary and cinematic history.", "trans": "East exit from Shinjuku Station"}
        ],
        "tips": [
            {"category": "transport", "title": "Suica / Pasmo IC Card", "content": "Add a digital Suica card to your mobile wallet for seamless tap-and-go travel across trains, subways, and convenience stores."},
            {"category": "etiquette", "title": "Quiet Public Transit", "content": "Trains are whisper-quiet in Tokyo. Keep phones on manner mode and refrain from phone calls during transit."},
            {"category": "currency", "title": "Cash Remains Essential", "content": "While cards are widely accepted at convenience stores and malls, small ramen shops and temple stalls often remain cash-only."}
        ]
    },
    "paris": {
        "title": "Parisian Essence: Iconic Boulevards & Bohemian Ateliers",
        "currency": "EUR",
        "default_image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80",
        "accommodations": [
            {"name": "Hôtel Caron de Beaumarchais", "neighborhood": "Le Marais (4th Arr.)", "style": "18th-Century Romantic", "price_tier": "moderate", "cost": 210.0, "why": "Charming antique French decor right in the heart of Paris's most vibrant gallery district."},
            {"name": "Saint James Paris", "neighborhood": "16th Arrondissement", "style": "Neoclassical Chateau Luxury", "price_tier": "luxury", "cost": 650.0, "why": "The only chateau-hotel in Paris, surrounded by private gardens and Michelin dining."},
            {"name": "The People Paris Marais", "neighborhood": "Bastille / Sully-Morland", "style": "Design Hostel & Hub", "price_tier": "budget", "cost": 65.0, "why": "Rooftop terrace with panoramic river views, social cafe, and pod-style privacy."}
        ],
        "activities_pool": [
            {"title": "Morning Stroll through Jardin du Luxembourg", "cat": "relaxation", "slot": "morning", "dur": 90, "cost": 0, "loc": "6th Arrondissement", "desc": "Watch wooden model sailboats on the grand basin among chestnut trees and Medici fountain sculptures.", "trans": "RER B to Luxembourg"},
            {"title": "Musée d'Orsay Impressionist Masterpieces", "cat": "culture", "slot": "morning", "dur": 150, "cost": 16, "loc": "Esplanade Valéry Giscard d'Estaing", "desc": "Admire works by Monet, Van Gogh, Degas, and Renoir inside a restored Beaux-Arts railway terminal.", "trans": "Solférino Metro Line 12"},
            {"title": "Sainte-Chapelle Stained Glass Marvel", "cat": "history", "slot": "morning", "dur": 75, "cost": 13, "loc": "Île de la Cité", "desc": "13th-century Gothic royal chapel illuminated by 1,113 luminous stained-glass panels.", "trans": "Cité Metro Line 4"},
            {"title": "Wandering Historic Le Marais & Place des Vosges", "cat": "sightseeing", "slot": "afternoon", "dur": 120, "cost": 0, "loc": "4th Arrondissement", "desc": "Explore quiet courtyards, independent perfumeries, falafel bakeries on Rue des Rosiers, and Victor Hugo's square.", "trans": "Saint-Paul Metro Line 1"},
            {"title": "Louvre Courtyard & Tuileries Garden Sculpture Walk", "cat": "sightseeing", "slot": "afternoon", "dur": 120, "cost": 0, "loc": "Palais Royal / 1st Arr.", "desc": "Admire I.M. Pei's glass pyramid and stroll through royal landscaped gardens toward Concorde.", "trans": "Palais-Royal Musée du Louvre Metro"},
            {"title": "Bistrot Dinner in Saint-Germain-des-Prés", "cat": "food", "slot": "evening", "dur": 120, "cost": 45, "loc": "Rue de Seine, 6th Arr.", "desc": "Savor authentic steak frites, duck confit, or vegetarian ratatouille with regional French wine pairings.", "trans": "Mabillon or Odéon Metro"},
            {"title": "Seine River Sunset Illumination Cruise", "cat": "activity", "slot": "night", "dur": 75, "cost": 17, "loc": "Pont Neuf / Port de la Bourdonnais", "desc": "Gliding past illuminated monuments as the Eiffel Tower sparkles on the hour.", "trans": "Pont Neuf Metro Line 7"}
        ],
        "tips": [
            {"category": "etiquette", "title": "The Golden Greeting: 'Bonjour'", "content": "Always greet shopkeepers, cafe staff, and waiters with a warm 'Bonjour, Madame/Monsieur' upon entering."},
            {"category": "transport", "title": "Navigo Easy & Metro T+ Passes", "content": "Load digital metro passes onto your phone or purchase a reloadable Navigo card at any station."},
            {"category": "dining", "title": "Lunch Formula (Menu du Jour)", "content": "Opt for the 'formule du midi' during lunchtime for multi-course meals at half the dinner price."}
        ]
    },
    "rome": {
        "title": "Eternal Rome: Classical Antiquity & Trastevere Flavors",
        "currency": "EUR",
        "default_image": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80",
        "accommodations": [
            {"name": "Hotel Santa Maria", "neighborhood": "Trastevere", "style": "Authentic Cloistered Courtyard", "price_tier": "moderate", "cost": 185.0, "why": "Peaceful former 16th-century convent garden filled with orange trees in lively Trastevere."},
            {"name": "Hotel de Russie", "neighborhood": "Piazza del Popolo", "style": "Timeless Grand Luxury", "price_tier": "luxury", "cost": 750.0, "why": "Legendary terraced gardens, neoclassical architecture, and celebrated martini bar."},
            {"name": "The RomeHello Hostel", "neighborhood": "Repubblica", "style": "Artistic Social Stay", "price_tier": "budget", "cost": 50.0, "why": "Vibrant street art murals, clean modern dorms and private rooms near Termini."}
        ],
        "activities_pool": [
            {"title": "Colosseum & Roman Forum Archaeological Walk", "cat": "history", "slot": "morning", "dur": 180, "cost": 18, "loc": "Piazza del Colosseo", "desc": "Walk in the footsteps of gladiators and emperors through the epic ruins of the Roman Empire.", "trans": "Colosseo Metro Line B"},
            {"title": "Pantheon & Piazza Navona Discovery", "cat": "sightseeing", "slot": "afternoon", "dur": 90, "cost": 5, "loc": "Piazza della Rotonda", "desc": "Marvel at the world's largest unreinforced concrete dome and Bernini's Fountain of the Four Rivers.", "trans": "Pleasant 10 min walk through historic center"},
            {"title": "Trevi Fountain Coin Tradition & Gelato", "cat": "relaxation", "slot": "afternoon", "dur": 45, "cost": 4, "loc": "Piazza di Trevi", "desc": "Toss a coin over your left shoulder to ensure your return to Rome, then enjoy artisanal pistachio gelato.", "trans": "Barberini Metro Line A"},
            {"title": "Trastevere Cobblestones & Authentic Trattoria", "cat": "food", "slot": "evening", "dur": 120, "cost": 32, "loc": "Trastevere", "desc": "Dine on handmade cacio e pepe, amatriciana, and Roman carciofi in ivy-covered alleyways.", "trans": "Tram 8 to Piazza Sonnino"}
        ],
        "tips": [
            {"category": "water", "title": "Drink from Nasone Fountains", "content": "Rome has over 2,500 historic iron fountains ('nasoni') providing cold, drinkable spring water."},
            {"category": "tickets", "title": "Advance Tickets Mandatory", "content": "Colosseum and Vatican entries sell out weeks ahead; reserve timed tickets through authorized channels."}
        ]
    }
}

# Generic fallback templates for any world destination
GENERIC_ACTIVITIES: List[Dict[str, Any]] = [
    {"slot": "morning", "cat": "sightseeing", "title": "Historic City Center & Architectural Highlights", "dur": 120, "cost_pct": 0.05, "desc": "A guided walking tour covering key historical monuments, ancient squares, and central heritage sites."},
    {"slot": "morning", "cat": "food", "dur": 90, "title": "Local Market Exploration & Morning Coffee", "cost_pct": 0.08, "desc": "Immerse in the sights, smells, and authentic tastes of the central fresh food market, trying local breakfast specialties."},
    {"slot": "afternoon", "cat": "culture", "dur": 150, "title": "Premier Art & Cultural Heritage Museum", "cost_pct": 0.12, "desc": "Explore world-renowned exhibitions, indigenous artifacts, or landmark regional fine art collections."},
    {"slot": "afternoon", "cat": "relaxation", "dur": 90, "title": "Botanical Gardens or Waterfront Promenade", "cost_pct": 0.02, "desc": "Relax in serene landscaped gardens or stroll scenic waterfront paths with panoramic skyline vistas."},
    {"slot": "evening", "cat": "food", "dur": 120, "title": "Authentic Regional Dinner at Local Favorite", "cost_pct": 0.18, "desc": "Indulge in time-honored dishes prepared with seasonal farm-to-table ingredients and regional beverages."},
    {"slot": "night", "cat": "sightseeing", "dur": 90, "title": "Sunset Viewpoint & Nighttime Illumination", "cost_pct": 0.04, "desc": "Catch the golden hour glow over the cityscape followed by illuminated bridges and landmarks."}
]

def calculate_trip_days(start_date_str: str, end_date_str: str) -> int:
    try:
        d1 = datetime.strptime(start_date_str, "%Y-%m-%d")
        d2 = datetime.strptime(end_date_str, "%Y-%m-%d")
        diff = (d2 - d1).days + 1
        return max(1, min(diff, 30))
    except Exception:
        return 3

def get_budget_multiplier(budget_level: str) -> float:
    if budget_level == "budget":
        return 0.6
    elif budget_level == "luxury":
        return 2.5
    return 1.0  # moderate

def generate_fallback_itinerary(req: GenerateItineraryRequest) -> GeneratedItineraryResponse:
    """
    Generates a deterministic, realistic, destination-aware travel itinerary.
    Accurately identifies source as 'fallback_engine'.
    """
    dest_key = req.destination.strip().lower()
    matched_dest = None
    for k, v in DESTINATION_KNOWLEDGE.items():
        if k in dest_key or dest_key in k:
            matched_dest = v
            break

    total_days = calculate_trip_days(req.start_date, req.end_date)
    start_dt = datetime.strptime(req.start_date, "%Y-%m-%d")
    currency = req.currency or (matched_dest["currency"] if matched_dest else "USD")
    multiplier = get_budget_multiplier(req.budget_level)

    # Base daily cost estimate per traveler
    base_daily_cost = 110.0 * multiplier
    if matched_dest and currency == "JPY":
        base_daily_cost = 16000.0 * multiplier
    elif matched_dest and currency == "EUR":
        base_daily_cost = 95.0 * multiplier

    trip_days: List[GeneratedDay] = []
    total_activities_cost = 0.0

    # Determine activities count per day based on pace
    activities_per_day = 3
    if req.pace == "relaxed":
        activities_per_day = 2
    elif req.pace == "fast-paced":
        activities_per_day = 4

    # Build days
    pool = matched_dest["activities_pool"] if matched_dest else None
    
    for day_idx in range(total_days):
        day_date = (start_dt + timedelta(days=day_idx)).strftime("%Y-%m-%d")
        day_num = day_idx + 1
        
        day_title = f"Day {day_num}: Exploring {req.destination}"
        day_theme = "Highlights & Local Culture"
        if day_num == 1:
            day_title = f"Day 1: Arrival & Heart of {req.destination}"
            day_theme = "Orientation, Landmark Sightseeing & Welcome Dinner"
        elif day_num == total_days:
            day_title = f"Day {day_num}: Grand Finale & Memorable Keepsakes"
            day_theme = "Scenic Overlooks, Artisan Markets & Farewell Evening"

        day_activities: List[ActivityBase] = []
        day_cost = 0.0

        for act_idx in range(activities_per_day):
            slot = ["morning", "afternoon", "evening", "night"][act_idx % 4]
            
            if pool:
                item = pool[(day_idx * activities_per_day + act_idx) % len(pool)]
                cost = round(item["cost"] * multiplier, 2)
                day_activities.append(ActivityBase(
                    title=item["title"],
                    description=item["desc"],
                    time_slot=slot,
                    duration_minutes=item["dur"],
                    category=item["cat"],
                    location_name=item["loc"],
                    estimated_cost=cost,
                    currency=currency,
                    transport_info=item.get("trans"),
                    order_index=act_idx
                ))
                day_cost += cost
            else:
                tmpl = GENERIC_ACTIVITIES[(day_idx * activities_per_day + act_idx) % len(GENERIC_ACTIVITIES)]
                cost = round(base_daily_cost * tmpl["cost_pct"] * multiplier, 2)
                day_activities.append(ActivityBase(
                    title=f"{tmpl['title']} in {req.destination}",
                    description=f"{tmpl['desc']} tailored for your {req.traveler_type} trip.",
                    time_slot=slot,
                    duration_minutes=tmpl["dur"],
                    category=tmpl["cat"],
                    location_name=f"{req.destination} City Center",
                    estimated_cost=cost,
                    currency=currency,
                    transport_info=f"Recommended: {req.transport_preference} transit",
                    order_index=act_idx
                ))
                day_cost += cost

        total_activities_cost += day_cost
        trip_days.append(GeneratedDay(
            day_number=day_num,
            date=day_date,
            title=day_title,
            theme=day_theme,
            notes=f"Pace: {req.pace.capitalize()}. Keep comfortable walking shoes handy.",
            daily_estimated_cost=round(day_cost, 2),
            activities=day_activities
        ))

    # Accommodation recommendations
    accommodations: List[AccommodationRecommendation] = []
    if matched_dest:
        for acc in matched_dest["accommodations"]:
            accommodations.append(AccommodationRecommendation(
                name=acc["name"],
                neighborhood=acc["neighborhood"],
                style=acc["style"],
                price_tier=acc["price_tier"],
                estimated_nightly_cost=round(acc["cost"] * multiplier, 2),
                why_recommended=acc["why"]
            ))
    else:
        accommodations = [
            AccommodationRecommendation(
                name=f"The Grand {req.destination} Boutique",
                neighborhood=f"Central {req.destination}",
                style="Boutique Heritage",
                price_tier=req.budget_level,
                estimated_nightly_cost=round(120.0 * multiplier, 2),
                why_recommended=f"Centrally positioned with easy walking access to top cultural landmarks and public transit."
            ),
            AccommodationRecommendation(
                name=f"{req.destination} Eco Haven",
                neighborhood="Historic Quarter",
                style="Modern Sustainable",
                price_tier=req.budget_level,
                estimated_nightly_cost=round(95.0 * multiplier, 2),
                why_recommended="Peaceful courtyard rooms, localized breakfast, and high sustainability rating."
            )
        ]

    # Budget breakdown calculations
    total_travelers = req.travelers_count
    lodging_total = accommodations[0].estimated_nightly_cost * max(1, total_days - 1)
    dining_total = (base_daily_cost * 0.4) * total_days * total_travelers
    transport_total = (base_daily_cost * 0.2) * total_days * total_travelers
    activities_total = total_activities_cost * total_travelers
    grand_total = lodging_total + dining_total + transport_total + activities_total

    categories = [
        BudgetBreakdownCategory(
            category="Accommodation",
            estimated_amount=round(lodging_total, 2),
            percentage=round((lodging_total / grand_total) * 100, 1) if grand_total else 25.0,
            description=f"Estimated {total_days - 1} nights at {req.budget_level} standard tier."
        ),
        BudgetBreakdownCategory(
            category="Food & Dining",
            estimated_amount=round(dining_total, 2),
            percentage=round((dining_total / grand_total) * 100, 1) if grand_total else 30.0,
            description="Breakfast, cafe lunches, authentic dinners, and local specialty snacks."
        ),
        BudgetBreakdownCategory(
            category="Local Transport",
            estimated_amount=round(transport_total, 2),
            percentage=round((transport_total / grand_total) * 100, 1) if grand_total else 20.0,
            description=f"Local {req.transport_preference} transit passes, rail fares, or ride hails."
        ),
        BudgetBreakdownCategory(
            category="Activities & Sightseeing",
            estimated_amount=round(activities_total, 2),
            percentage=round((activities_total / grand_total) * 100, 1) if grand_total else 25.0,
            description="Entry tickets, museum passes, historic monuments, and guided cultural tours."
        )
    ]

    budget_summary = BudgetBreakdown(
        total_estimated=round(grand_total, 2),
        per_person_estimated=round(grand_total / total_travelers, 2),
        daily_average=round(grand_total / (total_days * total_travelers), 2),
        currency=currency,
        is_live_estimate=False,
        disclaimer="Estimates are algorithmic approximations based on travel style, regional hospitality averages, and group size. Actual prices fluctuate by season.",
        categories=categories
    )

    # Practical tips
    tips = matched_dest["tips"] if matched_dest else [
        {"category": "transport", "title": "Local Public Transit Pass", "content": "Pick up a multi-day unlimited transit pass at arrival for convenient and economical travel."},
        {"category": "culture", "title": "Respectful Etiquette", "content": "Observe local customs at places of worship, including modest shoulder and knee dress."},
        {"category": "currency", "title": "Payment Preferences", "content": "Carry a mix of local currency notes for street stalls and a no-foreign-transaction-fee credit card."}
    ]
    practical_tips = [PracticalTip(category=t["category"], title=t["title"], content=t["content"]) for t in tips]

    cover_img = matched_dest.get("default_image", "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80") if matched_dest else "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
    trip_title = matched_dest["title"] if matched_dest else f"{req.destination} Adventure: {total_days} Days of Discovery"

    return GeneratedItineraryResponse(
        trip_title=trip_title,
        destination=req.destination,
        summary=f"A carefully tailored {total_days}-day itinerary through {req.destination} designed for {total_travelers} {req.traveler_type} traveler(s) at a {req.pace} pace.",
        start_date=req.start_date,
        end_date=req.end_date,
        total_days=total_days,
        currency=currency,
        cover_image_url=cover_img,
        days=trip_days,
        budget_summary=budget_summary,
        practical_tips=practical_tips,
        accommodation_suggestions=accommodations,
        assumptions_and_disclaimers=[
            "Activities and estimated times are structured to minimize transit backtracking.",
            "Opening hours, exhibition schedules, and seasonal closures should be verified directly with venues prior to departure.",
            "Pricing reflects estimated averages; reservations are not booked."
        ],
        generation_source="fallback_engine",
        provider_details={
            "engine": "Tripora High-Fidelity Deterministic Engine",
            "active_mode": "Deterministic Fallback",
            "reason": "Server AI key not configured or fallback invoked explicitly"
        }
    )

def regenerate_fallback_day(req: RegenerateDayRequest) -> GeneratedDay:
    """Regenerates a single day with alternative activities without touching other days."""
    multiplier = get_budget_multiplier(req.budget_level)
    day_activities: List[ActivityBase] = [
        ActivityBase(
            title=f"Architectural Discovery & Hidden Courtyards in {req.destination}",
            description="Explore off-the-beaten-path squares, artisan studios, and quiet residential lanes.",
            time_slot="morning",
            duration_minutes=120,
            category="sightseeing",
            location_name=f"{req.destination} Historic District",
            estimated_cost=round(15.0 * multiplier, 2),
            currency=req.currency,
            order_index=0
        ),
        ActivityBase(
            title=f"Local Gastronomy & Market Tasting",
            description="Sample regional delicacies, artisan cheeses/pastries, and chat with local vendors.",
            time_slot="afternoon",
            duration_minutes=105,
            category="food",
            location_name=f"{req.destination} Central Market",
            estimated_cost=round(25.0 * multiplier, 2),
            currency=req.currency,
            order_index=1
        ),
        ActivityBase(
            title=f"Sunset Panorama & Atmospheric Evening Dining",
            description="Enjoy sweeping skyline views followed by an unhurried dinner featuring authentic local recipes.",
            time_slot="evening",
            duration_minutes=120,
            category="food",
            location_name=f"{req.destination} Scenic Overlook",
            estimated_cost=round(35.0 * multiplier, 2),
            currency=req.currency,
            order_index=2
        )
    ]
    total_cost = sum(a.estimated_cost for a in day_activities)
    return GeneratedDay(
        day_number=req.day_number,
        date=req.date,
        title=f"Day {req.day_number}: Curated {req.destination} Experience",
        theme="Artisan Discoveries & Elevated Dining",
        notes=req.refinement_instruction or "Refreshed day plan with alternative pacing and localized spots.",
        daily_estimated_cost=round(total_cost, 2),
        activities=day_activities
    )
