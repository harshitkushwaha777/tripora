-- ==============================================================================
-- Migration: 001_initial_schema.sql
-- Description: Core tables for Tripora Travel Itinerary Planner
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    default_currency VARCHAR(3) DEFAULT 'USD',
    travel_style TEXT DEFAULT 'balanced',
    dietary_preferences TEXT[] DEFAULT '{}',
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to automatically create profile on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. TRIPS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    origin TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers_count INTEGER NOT NULL DEFAULT 1 CHECK (travelers_count >= 1),
    traveler_type VARCHAR(50) NOT NULL DEFAULT 'solo',
    budget_level VARCHAR(50) NOT NULL DEFAULT 'moderate',
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    pace VARCHAR(50) NOT NULL DEFAULT 'moderate',
    interests TEXT[] NOT NULL DEFAULT '{}',
    accommodation_type VARCHAR(50) DEFAULT 'hotel',
    transport_preference VARCHAR(50) DEFAULT 'mixed',
    dietary_requirements TEXT[] NOT NULL DEFAULT '{}',
    accessibility_needs TEXT,
    notes TEXT,
    cover_image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'archived')),
    total_estimated_budget NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    ai_generation_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- ------------------------------------------------------------------------------
-- 3. ITINERARY DAYS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number >= 1),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    theme TEXT,
    notes TEXT,
    daily_estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_trip_day UNIQUE (trip_id, day_number)
);

-- ------------------------------------------------------------------------------
-- 4. ITINERARY ACTIVITIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itinerary_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    time_slot VARCHAR(50) NOT NULL DEFAULT 'morning',
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    duration_minutes INTEGER,
    category VARCHAR(50) NOT NULL DEFAULT 'sightseeing',
    location_name TEXT,
    location_address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    booking_url TEXT,
    transport_info TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. TRIP MEMBERS (Collaboration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    invited_email TEXT,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_trip_user_member UNIQUE (trip_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 6. TRIP INVITATIONS (Pending Invites)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trip_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Automatically make trip creator the 'owner' in trip_members
CREATE OR REPLACE FUNCTION public.handle_new_trip()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.trip_members (trip_id, user_id, role)
    VALUES (new.id, new.user_id, 'owner')
    ON CONFLICT (trip_id, user_id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_trip_created ON public.trips;
CREATE TRIGGER on_trip_created
    AFTER INSERT ON public.trips
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_trip();
