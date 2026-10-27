-- ==============================================================================
-- Migration: 002_rls_policies.sql
-- Description: Comprehensive Row Level Security (RLS) for Tripora
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_invitations ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Helper Security Function: Check if auth.uid() has one of the allowed roles
-- Defined with SECURITY DEFINER and explicit search_path to prevent recursion
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_trip_access(check_trip_id UUID, allowed_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.trip_members
        WHERE trip_id = check_trip_id
          AND user_id = auth.uid()
          AND role = ANY(allowed_roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ------------------------------------------------------------------------------
-- TRIPS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view trips they own or are members of" ON public.trips;
CREATE POLICY "Users can view trips they own or are members of"
    ON public.trips FOR SELECT
    USING (
        user_id = auth.uid() OR
        public.check_trip_access(id, ARRAY['owner', 'editor', 'viewer'])
    );

DROP POLICY IF EXISTS "Users can insert trips as owner" ON public.trips;
CREATE POLICY "Users can insert trips as owner"
    ON public.trips FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners and editors can update trips" ON public.trips;
CREATE POLICY "Owners and editors can update trips"
    ON public.trips FOR UPDATE
    USING (
        user_id = auth.uid() OR
        public.check_trip_access(id, ARRAY['owner', 'editor'])
    )
    WITH CHECK (
        -- User cannot alter user_id ownership via UPDATE
        user_id = (SELECT user_id FROM public.trips WHERE id = trips.id)
    );

DROP POLICY IF EXISTS "Only trip owner can delete trip" ON public.trips;
CREATE POLICY "Only trip owner can delete trip"
    ON public.trips FOR DELETE
    USING (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- ITINERARY DAYS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Members can view itinerary days" ON public.itinerary_days;
CREATE POLICY "Members can view itinerary days"
    ON public.itinerary_days FOR SELECT
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor', 'viewer']));

DROP POLICY IF EXISTS "Owners and editors can insert itinerary days" ON public.itinerary_days;
CREATE POLICY "Owners and editors can insert itinerary days"
    ON public.itinerary_days FOR INSERT
    WITH CHECK (public.check_trip_access(trip_id, ARRAY['owner', 'editor']));

DROP POLICY IF EXISTS "Owners and editors can update itinerary days" ON public.itinerary_days;
CREATE POLICY "Owners and editors can update itinerary days"
    ON public.itinerary_days FOR UPDATE
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor']))
    WITH CHECK (public.check_trip_access(trip_id, ARRAY['owner', 'editor']));

DROP POLICY IF EXISTS "Owners and editors can delete itinerary days" ON public.itinerary_days;
CREATE POLICY "Owners and editors can delete itinerary days"
    ON public.itinerary_days FOR DELETE
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor']));

-- ------------------------------------------------------------------------------
-- ITINERARY ACTIVITIES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Members can view activities" ON public.itinerary_activities;
CREATE POLICY "Members can view activities"
    ON public.itinerary_activities FOR SELECT
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor', 'viewer']));

DROP POLICY IF EXISTS "Owners and editors can insert activities" ON public.itinerary_activities;
CREATE POLICY "Owners and editors can insert activities"
    ON public.itinerary_activities FOR INSERT
    WITH CHECK (public.check_trip_access(trip_id, ARRAY['owner', 'editor']));

DROP POLICY IF EXISTS "Owners and editors can update activities" ON public.itinerary_activities;
CREATE POLICY "Owners and editors can update activities"
    ON public.itinerary_activities FOR UPDATE
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor']))
    WITH CHECK (public.check_trip_access(trip_id, ARRAY['owner', 'editor']));

DROP POLICY IF EXISTS "Owners and editors can delete activities" ON public.itinerary_activities;
CREATE POLICY "Owners and editors can delete activities"
    ON public.itinerary_activities FOR DELETE
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor']));

-- ------------------------------------------------------------------------------
-- TRIP MEMBERS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Members can view collaborator list" ON public.trip_members;
CREATE POLICY "Members can view collaborator list"
    ON public.trip_members FOR SELECT
    USING (public.check_trip_access(trip_id, ARRAY['owner', 'editor', 'viewer']));

DROP POLICY IF EXISTS "Owners can add members" ON public.trip_members;
CREATE POLICY "Owners can add members"
    ON public.trip_members FOR INSERT
    WITH CHECK (public.check_trip_access(trip_id, ARRAY['owner']));

DROP POLICY IF EXISTS "Owners can modify members" ON public.trip_members;
CREATE POLICY "Owners can modify members"
    ON public.trip_members FOR UPDATE
    USING (public.check_trip_access(trip_id, ARRAY['owner']))
    WITH CHECK (public.check_trip_access(trip_id, ARRAY['owner']));

DROP POLICY IF EXISTS "Owners can remove members or members can leave" ON public.trip_members;
CREATE POLICY "Owners can remove members or members can leave"
    ON public.trip_members FOR DELETE
    USING (
        public.check_trip_access(trip_id, ARRAY['owner']) OR
        user_id = auth.uid()
    );

-- ------------------------------------------------------------------------------
-- TRIP INVITATIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trip managers and invitees can view invitations" ON public.trip_invitations;
CREATE POLICY "Trip managers and invitees can view invitations"
    ON public.trip_invitations FOR SELECT
    USING (
        public.check_trip_access(trip_id, ARRAY['owner', 'editor']) OR
        email = (auth.jwt() ->> 'email')
    );

DROP POLICY IF EXISTS "Owners can create invitations" ON public.trip_invitations;
CREATE POLICY "Owners can create invitations"
    ON public.trip_invitations FOR INSERT
    WITH CHECK (
        invited_by = auth.uid() AND
        public.check_trip_access(trip_id, ARRAY['owner'])
    );

DROP POLICY IF EXISTS "Invitees or owners can update invitations (e.g. accept)" ON public.trip_invitations;
CREATE POLICY "Invitees or owners can update invitations (e.g. accept)"
    ON public.trip_invitations FOR UPDATE
    USING (
        public.check_trip_access(trip_id, ARRAY['owner']) OR
        email = (auth.jwt() ->> 'email')
    );

DROP POLICY IF EXISTS "Owners can revoke invitations" ON public.trip_invitations;
CREATE POLICY "Owners can revoke invitations"
    ON public.trip_invitations FOR DELETE
    USING (public.check_trip_access(trip_id, ARRAY['owner']));
