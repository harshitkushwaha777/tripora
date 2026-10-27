# Tripora Database Migrations

This directory contains version-controlled, idempotent SQL migrations for the Tripora travel planning platform.

## Architecture & Schema Overview

1. **`001_initial_schema.sql`**:
   - `public.profiles`: Extends Supabase `auth.users` with travel preferences, display names, avatar URLs, and default currency. Includes trigger on new user signup.
   - `public.trips`: Trip details (destination, start/end dates, group size, travel style, budget tier, currency, custom notes, status, and AI generation metadata). Includes trigger to automatically assign trip creator as the owner.
   - `public.itinerary_days`: Day-by-day plan linked to trips.
   - `public.itinerary_activities`: Granular activities per day (time slots, durations, categories, location data, transport notes, estimated costs).
   - `public.trip_members`: Multi-user collaboration with roles (`owner`, `editor`, `viewer`).
   - `public.trip_invitations`: Secure pending invitations with hashed tokens and expiration dates.

2. **`002_rls_policies.sql`**:
   - Enables Row Level Security on all 6 tables.
   - Enforces strict role-based access for SELECT, INSERT, UPDATE, and DELETE.
   - Ensures child records (`itinerary_days`, `itinerary_activities`) cannot be manipulated by non-members or to bypass trip ownership.
   - Prevents unauthorized role escalation or ownership hijacking.

3. **`003_indexes.sql`**:
   - Creates targeted B-Tree indexes on foreign keys, lookup fields, status, and ordering columns.

## How to Apply Migrations to Supabase

### Option 1: Supabase Dashboard SQL Editor (Recommended)
1. Open your Supabase project dashboard: [https://supabase.com/dashboard/project/ufoxvgdikrjlhicxoaku](https://supabase.com/dashboard/project/ufoxvgdikrjlhicxoaku)
2. Navigate to **SQL Editor** in the left sidebar.
3. Open and run the migration files in numeric order:
   - Run `001_initial_schema.sql`
   - Run `002_rls_policies.sql`
   - Run `003_indexes.sql`
4. Confirm successful execution with no errors.

### Option 2: Supabase CLI
```bash
# Link to project
supabase link --project-ref ufoxvgdikrjlhicxoaku

# Apply migrations
supabase db push
```
