# TRIPORA — AI-Powered Personalized Travel Itinerary Planner

> **"Your Journey, Your Way."**
> A production-grade full-stack travel SaaS application engineered for solo travelers, couples, families, and groups.

---

## 🧭 Architecture Overview

Tripora is architected with clear boundaries between user experience, business logic, security policies, and AI itinerary generation:

```
├── frontend/                     # React 18, TypeScript, Vite, Tailwind CSS, TanStack Query
│   ├── src/
│   │   ├── components/           # Reusable UI (Button, Modal, Badge, Skeleton) & Layout (Navbar, Footer)
│   │   ├── context/              # AuthContext (Supabase Auth & Instant Demo Mode)
│   │   ├── lib/                  # Centralized Config, Supabase Client, Typed API Client
│   │   ├── pages/
│   │   │   ├── public/           # LandingPage, SampleTripPage, SignIn, SignUp, ForgotPassword, NotFound
│   │   │   └── dashboard/        # DashboardPage, TripBuilderPage, ItineraryViewPage, ProfilePage
│   │   └── types/                # Domain TypeScript models
│   ├── .env.example              # Frontend environment placeholders
│   └── package.json
│
├── backend/                      # Python 3, FastAPI, Pydantic v2, Uvicorn
│   ├── app/
│   │   ├── api/                  # Modular endpoints (/health, /itineraries, /trips, /collaborators)
│   │   ├── core/                 # Supabase Bearer token security & role validation
│   │   ├── schemas/              # Pydantic schemas (Trip, Day, Activity, Budget, Members)
│   │   ├── services/             # AI Planner & High-Fidelity Deterministic Fallback Engine
│   │   ├── config.py             # Settings reading from .env
│   │   └── main.py               # FastAPI entry point & CORS configuration
│   ├── tests/                    # Pytest test suite (13 unit & integration tests)
│   ├── requirements.txt          # Production dependencies
│   └── .env.example              # Backend environment placeholders
│
└── migrations/                   # Supabase PostgreSQL SQL Migrations
    ├── 001_initial_schema.sql    # Tables (profiles, trips, days, activities, members, invites)
    ├── 002_rls_policies.sql      # Row Level Security (RLS) for all tables
    ├── 003_indexes.sql           # Performance B-Tree indexes
    └── README.md                 # Migration application guide
```

---

## 🎨 Design System

Tripora adheres to a bespoke, travel-editorial design language:
- **Base Canvas:** Warm Ivory (`#FAF8F5`, `#F5F1EB`, `#EDE6DC`)
- **Primary Surfaces:** Deep Midnight Forest Green (`#0D1F18`, `#132B22`, `#1B3B2F`)
- **Accents:** Restrained Terracotta / Coral (`#E06343`, `#C95233`, `#FDEAE4`)
- **Typography:** Playfair Display (Editorial Serif for Headings) & Plus Jakarta Sans (Clean Modern Body)
- **Visuals:** Authentic destination photography from verified sources with graceful fallback.

---

## ⚡ Key Capabilities

1. **AI Itinerary Engine with Deterministic Fallback:**
   - Evaluates travel party type (solo, couple, family, friends), exact dates, pace (relaxed, moderate, fast-paced), budget tier, dietary constraints, and interests.
   - Generates realistic schedules clustered by geographic proximity to prevent impossible transit backtracking.
   - **Deterministic Fallback:** If no AI key is configured or external APIs time out, Tripora automatically uses a built-in deterministic travel engine. It generates full itineraries and clearly labels the source as `fallback_engine` in metadata. Never pretends fallback was AI.

2. **Granular Day & Activity Editing:**
   - **Targeted Day Regeneration:** Regenerate any individual day with custom refinement prompts without modifying or erasing other days.
   - **Activity CRUD & Reordering:** Add, edit, remove, and reorder activities up/down.
   - Real-time autosave status indicators.

3. **Transparent Budget Breakdown:**
   - Algorithmic cost estimates categorized into Accommodation, Food & Dining, Local Transit, and Activities.
   - Currency-aware (USD, EUR, GBP, JPY, CAD, AUD, INR).
   - Clearly disclaimed as estimates rather than live flight or hotel reservations.

4. **Multi-User Group Collaboration:**
   - Trip owners can invite companions by email with `owner`, `editor`, or `viewer` roles.
   - Protected by Supabase Row Level Security (RLS) policies.

5. **Useful Demo Showcase:**
   - Dedicated `/sample` route showcasing a full 7-day Kyoto & Tokyo itinerary for non-authenticated exploration.
   - 1-Click Instant Demo Login for immediate authenticated evaluation.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+ or v20+)
- Python (v3.10+)
- npm or pnpm

### 1. Database Setup (Supabase)
1. Open your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open the **SQL Editor** and run the migration files in `migrations/` in order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_indexes.sql`

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env configuration
copy .env.example .env

# Start FastAPI server
python -m uvicorn app.main:app --port 8000 --reload
```
API Docs available at: [http://localhost:8000/docs](http://localhost:8000/docs)  
Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔒 Security & Row Level Security (RLS)

- **Input Validation:** Pydantic v2 schemas on backend; Zod and React Hook Form on frontend.
- **Token Verification:** Supabase Bearer tokens verified server-side against Supabase Auth API.
- **IDOR Prevention:** Backend services verify that the requesting user owns the trip or is an authorized member before any read, update, or delete operation.
- **Row Level Security:** Separate policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on all 6 tables (`profiles`, `trips`, `itinerary_days`, `itinerary_activities`, `trip_members`, `trip_invitations`).
- **Prompt Injection Defense:** Traveler input strings are treated strictly as untrusted parameters within system-defined schema boundaries.

---

## 🧪 Testing & Verification

### Run Backend Tests (13 passed in 0.59s)
```bash
python -m pytest backend/tests/ -v
```
Test suite covers:
- Trip creation & date range validation
- Activity categories & duration constraints
- Deterministic fallback engine across Tokyo, Paris, Rome, and unlisted world destinations
- Day-level regeneration
- Budget summary calculations & multipliers
- API schemas & IDOR authorization checks

### Run Frontend Typecheck & Build
```bash
# Run TypeScript lint check
npm --prefix frontend run lint

# Run Production Build
npm --prefix frontend run build
```
Build output:
`✓ built in 22.71s` → generates optimized HTML, CSS, and JS chunks in `frontend/dist/`.

---

## 📋 Manual Verification Checklist

| Scenario | Steps to Verify | Expected Outcome |
| :--- | :--- | :--- |
| **1. Public Showcase** | Visit `/sample` | Interactive 7-day Kyoto & Tokyo itinerary renders with day tabs, activity cards, and budget estimates. |
| **2. Demo Fast-Track** | Click "Instant Demo Access" on Sign In | Logs in as demo user Elena Rostova, redirects to `/dashboard` with seeded trips. |
| **3. Plan New Trip** | Visit `/builder`, fill destination, dates, preferences, click "Generate" | AI progress modal displays 5 steps, creates itinerary, and navigates to `/trips/{id}`. |
| **4. Regenerate Day** | On `/trips/{id}`, click "Regenerate Day", enter note, click confirm | Only the current day is updated with fresh activities; other days remain untouched. |
| **5. Activity CRUD** | Click "Add Activity", fill form, save. Click Reorder Up/Down. Click Delete. | Activity is added, reordered in real-time, or removed with autosave confirmation. |
| **6. Collaboration** | Click "Collaborate", enter email, select "Editor", click Send | Secure pending invitation record is created with expiration and role. |
| **7. Unauthorized Access** | Request `GET /api/trips` without Bearer token | Backend returns `401 Unauthorized`. |
| **8. Profile Settings** | Visit `/profile`, change currency to EUR, save | Profile updates, currency preference persists across session. |
