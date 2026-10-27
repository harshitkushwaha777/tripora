-- ==============================================================================
-- Migration: 003_indexes.sql
-- Description: Indexes for optimal query performance on Tripora tables
-- ==============================================================================

-- Index profiles lookup
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Indexes for trips query by user, status, and dates
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON public.trips(created_at DESC);

-- Indexes for itinerary days by trip and day_number
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_day ON public.itinerary_days(trip_id, day_number);

-- Indexes for itinerary activities by day, trip, and order
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_day_id ON public.itinerary_activities(day_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_trip_id ON public.itinerary_activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_order ON public.itinerary_activities(day_id, order_index);

-- Indexes for trip members and invitations
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON public.trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON public.trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_role ON public.trip_members(trip_id, user_id, role);

CREATE INDEX IF NOT EXISTS idx_trip_invitations_trip_id ON public.trip_invitations(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_invitations_email ON public.trip_invitations(email);
CREATE INDEX IF NOT EXISTS idx_trip_invitations_token_hash ON public.trip_invitations(token_hash);
