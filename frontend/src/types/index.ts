export type TravelerType = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type BudgetLevel = 'budget' | 'moderate' | 'luxury';
export type TripPace = 'relaxed' | 'moderate' | 'fast-paced';
export type TripStatus = 'planning' | 'confirmed' | 'completed' | 'archived';
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';
export type ActivityCategory = 
  | 'sightseeing' 
  | 'food' 
  | 'transport' 
  | 'activity' 
  | 'relaxation' 
  | 'nightlife' 
  | 'lodging';

export interface Activity {
  id?: string;
  day_id?: string;
  trip_id?: string;
  title: string;
  description?: string;
  time_slot: TimeSlot;
  start_time?: string;
  end_time?: string;
  duration_minutes?: number;
  category: ActivityCategory;
  location_name?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  estimated_cost: number;
  currency: string;
  booking_url?: string;
  transport_info?: string;
  order_index: number;
}

export interface ItineraryDay {
  id?: string;
  trip_id?: string;
  day_number: number;
  date: string;
  title: string;
  theme?: string;
  notes?: string;
  daily_estimated_cost: number;
  activities: Activity[];
}

export interface BudgetBreakdownCategory {
  category: string;
  estimated_amount: number;
  percentage: number;
  description: string;
}

export interface BudgetSummary {
  total_estimated: number;
  per_person_estimated: number;
  daily_average: number;
  currency: string;
  is_live_estimate: boolean;
  disclaimer: string;
  categories: BudgetBreakdownCategory[];
}

export interface PracticalTip {
  category: string;
  title: string;
  content: string;
}

export interface AccommodationRecommendation {
  name: string;
  neighborhood: string;
  style: string;
  price_tier: string;
  estimated_nightly_cost: number;
  why_recommended: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  origin?: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  traveler_type: TravelerType;
  budget_level: BudgetLevel;
  currency: string;
  pace: TripPace;
  interests: string[];
  accommodation_type?: string;
  transport_preference?: string;
  dietary_requirements: string[];
  accessibility_needs?: string;
  notes?: string;
  cover_image_url?: string;
  status: TripStatus;
  total_estimated_budget: number;
  ai_generation_metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  days?: ItineraryDay[];
  user_role?: 'owner' | 'editor' | 'viewer';
}

export interface GeneratedItineraryResponse {
  trip_title: string;
  destination: string;
  summary: string;
  start_date: string;
  end_date: string;
  total_days: number;
  currency: string;
  cover_image_url?: string;
  days: ItineraryDay[];
  budget_summary: BudgetSummary;
  practical_tips: PracticalTip[];
  accommodation_suggestions: AccommodationRecommendation[];
  assumptions_and_disclaimers: string[];
  generation_source: 'ai_model' | 'fallback_engine';
  provider_details?: Record<string, any>;
}

export interface GenerateTripParams {
  destination: string;
  origin?: string;
  start_date: string;
  end_date: string;
  travelers_count: number;
  traveler_type: TravelerType;
  budget_level: BudgetLevel;
  currency: string;
  pace: TripPace;
  interests: string[];
  accommodation_type?: string;
  transport_preference?: string;
  dietary_requirements: string[];
  accessibility_needs?: string;
  notes?: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  email?: string;
  full_name?: string;
  avatar_url?: string;
  joined_at?: string;
}

export interface UserProfile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  default_currency: string;
  travel_style: string;
  dietary_preferences: string[];
  bio?: string;
}
