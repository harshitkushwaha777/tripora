import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  Clock, 
  Check, 
  AlertCircle,
  Coffee,
  Heart,
  Luggage,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { GenerateTripParams, TravelerType, BudgetLevel, TripPace } from '../../types';
import { Button } from '../../components/ui/Button';

const INTEREST_OPTIONS = [
  'Art & Culture',
  'Food & Gastronomy',
  'History & Heritage',
  'Nature & Outdoors',
  'Relaxation & Wellness',
  'Nightlife & Social',
  'Photography & Vistas',
  'Architecture & Design',
  'Local Markets & Shopping'
];

const DIETARY_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Dairy-Free'
];

export const TripBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form State
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelerType, setTravelerType] = useState<TravelerType>('couple');
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('moderate');
  const [currency, setCurrency] = useState('USD');
  const [pace, setPace] = useState<TripPace>('moderate');
  const [interests, setInterests] = useState<string[]>(['Art & Culture', 'Food & Gastronomy']);
  const [accommodationType, setAccommodationType] = useState('Boutique Hotel');
  const [transportPreference, setTransportPreference] = useState('Public Transit & Walking');
  const [dietaryRequirements, setDietaryRequirements] = useState<string[]>(['None']);
  const [accessibilityNeeds, setAccessibilityNeeds] = useState('');
  const [notes, setNotes] = useState('');

  // Generation Progress State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generationSteps = [
    'Analyzing destination geography & neighborhood layout...',
    'Curating culturally authentic attractions & local gems...',
    'Optimizing transit routes to eliminate backtracking...',
    'Synthesizing meal recommendations & dietary requirements...',
    'Calculating transparent budget estimates & final schedule...'
  ];

  const toggleInterest = (item: string) => {
    setInterests(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleDietary = (item: string) => {
    if (item === 'None') {
      setDietaryRequirements(['None']);
      return;
    }
    setDietaryRequirements(prev => {
      const filtered = prev.filter(i => i !== 'None');
      return filtered.includes(item) 
        ? filtered.filter(i => i !== item) 
        : [...filtered, item];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!destination.trim()) {
      setErrorMessage('Please specify your destination.');
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage('Please select both start and end travel dates.');
      return;
    }
    if (endDate < startDate) {
      setErrorMessage('End date cannot be earlier than start date.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    // Animate progress steps
    const stepInterval = setInterval(() => {
      setGenerationStep(prev => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const params: GenerateTripParams = {
        destination: destination.trim(),
        origin: origin.trim() || undefined,
        start_date: startDate,
        end_date: endDate,
        travelers_count: travelersCount,
        traveler_type: travelerType,
        budget_level: budgetLevel,
        currency,
        pace,
        interests,
        accommodation_type: accommodationType,
        transport_preference: transportPreference,
        dietary_requirements: dietaryRequirements,
        accessibility_needs: accessibilityNeeds.trim() || undefined,
        notes: notes.trim() || undefined,
      };

      // 1. Call AI Itinerary Engine (or deterministic fallback)
      const generated = await api.generateItinerary(params);

      // 2. Persist to Trip Service
      const createdTrip = await api.createTrip(
        {
          title: generated.trip_title,
          destination: generated.destination,
          origin: origin.trim() || undefined,
          start_date: startDate,
          end_date: endDate,
          travelers_count: travelersCount,
          traveler_type: travelerType,
          budget_level: budgetLevel,
          currency,
          pace,
          interests,
          accommodation_type: accommodationType,
          transport_preference: transportPreference,
          dietary_requirements: dietaryRequirements,
          accessibility_needs: accessibilityNeeds.trim() || undefined,
          notes: notes.trim() || undefined,
          cover_image_url: generated.cover_image_url,
          status: 'planning',
          total_estimated_budget: generated.budget_summary.total_estimated,
          ai_generation_metadata: {
            source: generated.generation_source,
            tips: generated.practical_tips,
            accommodations: generated.accommodation_suggestions,
            budget: generated.budget_summary,
            disclaimers: generated.assumptions_and_disclaimers,
          }
        },
        generated.days
      );

      clearInterval(stepInterval);
      navigate(`/trips/${createdTrip.id}`);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Generation error:', err);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Failed to generate itinerary. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-coral-500" />
            <span>AI Itinerary Builder</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
            Design Your Personalized Journey
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 max-w-lg mx-auto">
            Provide your travel dates, travel rhythm, and preferences. Our engine will curate a balanced day-by-day blueprint.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Generation Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft border border-ivory-200 p-6 sm:p-10 space-y-8">
          
          {/* SECTION 1: Destination & Dates */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <MapPin className="w-4 h-4 text-coral-500" />
              <span>1. Where & When</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Destination City / Region <span className="text-coral-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Japan or Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Departing From (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco or London"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Start Date <span className="text-coral-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  End Date <span className="text-coral-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Travel Party & Style */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <Users className="w-4 h-4 text-coral-500" />
              <span>2. Travelers & Rhythm</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Travelers Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Traveler Group Type
                </label>
                <select
                  value={travelerType}
                  onChange={(e) => setTravelerType(e.target.value as TravelerType)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 capitalize"
                >
                  <option value="solo">Solo Traveler</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family with Kids</option>
                  <option value="friends">Group of Friends</option>
                  <option value="business">Business & Leisure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Daily Pacing
                </label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value as TripPace)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 capitalize"
                >
                  <option value="relaxed">Relaxed (2 activities/day)</option>
                  <option value="moderate">Moderate (3 activities/day)</option>
                  <option value="fast-paced">Fast-paced (4 activities/day)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Budget Standard
                </label>
                <select
                  value={budgetLevel}
                  onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 capitalize"
                >
                  <option value="budget">Budget (Hostels & Local transit)</option>
                  <option value="moderate">Moderate (Boutique hotels & bistros)</option>
                  <option value="luxury">Luxury (5-Star & Private transfers)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Display Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="USD">USD ($) United States Dollar</option>
                  <option value="EUR">EUR (€) Euro</option>
                  <option value="GBP">GBP (£) British Pound</option>
                  <option value="JPY">JPY (¥) Japanese Yen</option>
                  <option value="CAD">CAD ($) Canadian Dollar</option>
                  <option value="AUD">AUD ($) Australian Dollar</option>
                  <option value="INR">INR (₹) Indian Rupee</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: Passions & Interests */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <Heart className="w-4 h-4 text-coral-500" />
              <span>3. Passions & Interests</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((item) => {
                const selected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInterest(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selected
                        ? 'bg-forest-800 text-white shadow-soft'
                        : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200 border border-ivory-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Logistics & Dietary */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2 border-b border-ivory-200 pb-2">
              <Coffee className="w-4 h-4 text-coral-500" />
              <span>4. Accommodation & Dining</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Accommodation Preference
                </label>
                <select
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="Boutique Hotel">Boutique Hotel</option>
                  <option value="Luxury Resort">Luxury Resort</option>
                  <option value="Vacation Apartment / Airbnb">Vacation Apartment / Airbnb</option>
                  <option value="Eco-Lodge">Eco-Lodge</option>
                  <option value="Social Hostel">Social Hostel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Transport Preference
                </label>
                <select
                  value={transportPreference}
                  onChange={(e) => setTransportPreference(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="Public Transit & Walking">Public Transit & Walking</option>
                  <option value="Rental Car / Road Trip">Rental Car / Road Trip</option>
                  <option value="Private Taxis / Rideshare">Private Taxis / Rideshare</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Dietary Requirements
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((item) => {
                  const selected = dietaryRequirements.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDietary(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selected
                          ? 'bg-coral-500 text-white shadow-soft'
                          : 'bg-ivory-100 text-ink-700 hover:bg-ivory-200 border border-ivory-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Accessibility or Mobility Needs (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Wheelchair accessible paths, minimal stairs, elevator required"
                value={accessibilityNeeds}
                onChange={(e) => setAccessibilityNeeds(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Custom Traveler Notes & Specific Wishes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. We love specialty third-wave coffee, want to visit a cooking class, and celebrate a birthday on Day 3."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
            <span className="text-xs text-ink-500">
              ⚡ Powered by Tripora's verified itinerary model
            </span>
            <Button
              type="submit"
              size="lg"
              className="gap-2 shadow-elevated"
            >
              <Sparkles className="w-4 h-4 text-coral-400" />
              <span>Generate My Itinerary</span>
            </Button>
          </div>

        </form>

      </div>

      {/* Generation Progress Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-modal border border-ivory-200 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-forest-800 text-white mx-auto flex items-center justify-center shadow-elevated">
              <Compass className="w-8 h-8 text-coral-400 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-forest-900">
                Crafting Your Itinerary
              </h3>
              <p className="text-xs text-ink-600">
                Synthesizing realistic schedules for {destination}...
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-200 text-xs font-medium text-forest-800 transition-all">
              {generationSteps[generationStep]}
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-1.5">
              {generationSteps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i <= generationStep ? 'w-6 bg-coral-500' : 'w-2 bg-ivory-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-[11px] text-ink-400">
              Please keep this tab open while our engine computes transit feasibility and budget models.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
