import { config } from './config';
import { supabase } from './supabase';
import {
  Trip,
  ItineraryDay,
  Activity,
  GenerateTripParams,
  GeneratedItineraryResponse,
} from '../types';

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }
  // If guest or preview, send demo token
  return {
    'Authorization': 'Bearer demo-token-preview',
    'Content-Type': 'application/json',
  };
}

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${config.api.baseUrl}/api/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  // Itinerary Generation
  async generateItinerary(params: GenerateTripParams): Promise<GeneratedItineraryResponse> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/itineraries/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate itinerary');
    }
    return res.json();
  },

  // Regenerate Single Day
  async regenerateDay(params: {
    destination: string;
    day_number: number;
    date: string;
    travelers_count?: number;
    traveler_type?: string;
    budget_level?: string;
    currency?: string;
    pace?: string;
    interests?: string[];
    refinement_instruction?: string;
  }): Promise<ItineraryDay> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/itineraries/regenerate-day`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to regenerate day');
    }
    return res.json();
  },

  // Regenerate Activity
  async regenerateActivity(params: {
    destination: string;
    activity_category: string;
    time_slot: string;
    current_activity_title: string;
    budget_level?: string;
    currency?: string;
  }): Promise<Activity> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/itineraries/regenerate-activity`, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to regenerate activity');
    }
    return res.json();
  },

  // Trips CRUD
  async listTrips(status?: string): Promise<Trip[]> {
    const headers = await getAuthHeader();
    const url = status 
      ? `${config.api.baseUrl}/api/trips?status=${status}` 
      : `${config.api.baseUrl}/api/trips`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch trips');
    return res.json();
  },

  async getTrip(tripId: string): Promise<Trip> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch trip details');
    return res.json();
  },

  async createTrip(data: Partial<Trip>, days?: ItineraryDay[]): Promise<Trip> {
    const headers = await getAuthHeader();
    // We can save via backend
    const res = await fetch(`${config.api.baseUrl}/api/trips`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...data, days: days ?? [] }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create trip');
    }
    const createdTrip = await res.json();
    return createdTrip;
  },

  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update trip');
    return res.json();
  },

  async deleteTrip(tripId: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete trip');
  },

  async duplicateTrip(tripId: string): Promise<Trip> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}/duplicate`, {
      method: 'POST',
      headers,
    });
    if (!res.ok) throw new Error('Failed to duplicate trip');
    return res.json();
  },

  // Activities
  async addActivity(tripId: string, dayId: string, activity: Partial<Activity>): Promise<Activity> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}/days/${dayId}/activities`, {
      method: 'POST',
      headers,
      body: JSON.stringify(activity),
    });
    if (!res.ok) throw new Error('Failed to add activity');
    return res.json();
  },

  async updateActivity(tripId: string, activityId: string, updates: Partial<Activity>): Promise<Activity> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}/activities/${activityId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update activity');
    return res.json();
  },

  async deleteActivity(tripId: string, activityId: string): Promise<void> {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}/activities/${activityId}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete activity');
  },

  // Invitations
  async inviteMember(tripId: string, email: string, role: string) {
    const headers = await getAuthHeader();
    const res = await fetch(`${config.api.baseUrl}/api/trips/${tripId}/invitations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to send invitation');
    }
    return res.json();
  }
};
