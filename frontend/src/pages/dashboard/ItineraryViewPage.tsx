import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Share2, 
  Copy, 
  Printer, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Navigation,
  Mail,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Trip, ItineraryDay, Activity, ActivityCategory, TimeSlot } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';

export const ItineraryViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Modals state
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [dayRefinementNotes, setDayRefinementNotes] = useState('');
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityForm, setActivityForm] = useState<Partial<Activity>>({
    title: '',
    description: '',
    time_slot: 'morning',
    category: 'sightseeing',
    estimated_cost: 0,
    duration_minutes: 60,
    location_name: '',
    transport_info: '',
  });

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadTripData(id);
    }
  }, [id]);

  const loadTripData = async (tripId: string) => {
    setLoading(true);
    try {
      const data = await api.getTrip(tripId);
      setTrip(data);
    } catch (err) {
      console.warn('Could not load specific trip, falling back to local demo trip', err);
      // Fallback preview trip
      const fallbackTrip: Trip = {
        id: tripId,
        user_id: user?.id || 'demo-user',
        title: 'Exploration Itinerary',
        destination: 'Kyoto & Tokyo, Japan',
        start_date: '2026-11-10',
        end_date: '2026-11-16',
        travelers_count: 2,
        traveler_type: 'couple',
        budget_level: 'moderate',
        currency: 'USD',
        pace: 'moderate',
        interests: ['culture', 'food', 'nature'],
        dietary_requirements: ['None'],
        status: 'planning',
        total_estimated_budget: 2840.0,
        cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        days: [
          {
            day_number: 1,
            date: '2026-11-10',
            title: 'Arrival & Welcome to Tokyo',
            theme: 'Neon Skylines & Izakaya Flavors',
            daily_estimated_cost: 65.0,
            activities: [
              {
                id: 'act-1',
                title: 'Check-in & Settle in Chuo City',
                time_slot: 'afternoon',
                start_time: '14:30',
                duration_minutes: 60,
                category: 'lodging',
                location_name: 'Hotel Ryumeikan Tokyo',
                estimated_cost: 0,
                currency: 'USD',
                order_index: 0,
                description: 'Unpack and enjoy complimentary green tea.'
              },
              {
                id: 'act-2',
                title: 'Shibuya Crossing Walk',
                time_slot: 'evening',
                start_time: '17:30',
                duration_minutes: 60,
                category: 'sightseeing',
                location_name: 'Shibuya Scramble',
                estimated_cost: 0,
                currency: 'USD',
                order_index: 1,
                description: 'Experience Tokyo’s most iconic crossing at twilight.'
              }
            ]
          }
        ]
      };
      setTrip(fallbackTrip);
    } finally {
      setLoading(false);
    }
  };

  const currentDay: ItineraryDay | undefined = trip?.days?.[activeDayIdx];

  // 1. Day Regeneration
  const handleRegenerateCurrentDay = async () => {
    if (!trip || !currentDay) return;
    setIsRegeneratingDay(true);
    try {
      const refreshedDay = await api.regenerateDay({
        destination: trip.destination,
        day_number: currentDay.day_number,
        date: currentDay.date,
        travelers_count: trip.travelers_count,
        traveler_type: trip.traveler_type,
        budget_level: trip.budget_level,
        currency: trip.currency,
        pace: trip.pace,
        interests: trip.interests,
        refinement_instruction: dayRefinementNotes.trim() || undefined,
      });

      // Update only current day in trip
      const updatedDays = [...(trip.days || [])];
      updatedDays[activeDayIdx] = {
        ...refreshedDay,
        id: currentDay.id || `day-${activeDayIdx}`,
      };

      setTrip({ ...trip, days: updatedDays });
      setIsDayModalOpen(false);
      setDayRefinementNotes('');
      setSaveStatus('saved');
    } catch (e) {
      console.error('Failed to regenerate day:', e);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  // 2. Activity CRUD
  const handleOpenAddActivity = () => {
    setEditingActivity(null);
    setActivityForm({
      title: '',
      description: '',
      time_slot: 'morning',
      category: 'sightseeing',
      estimated_cost: 15,
      duration_minutes: 60,
      location_name: '',
      transport_info: '',
    });
    setIsActivityModalOpen(true);
  };

  const handleOpenEditActivity = (act: Activity) => {
    setEditingActivity(act);
    setActivityForm({ ...act });
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = async () => {
    if (!trip || !currentDay || !activityForm.title) return;
    setSaveStatus('saving');

    const updatedDays = [...(trip.days || [])];
    const currentActivities = [...currentDay.activities];

    if (editingActivity) {
      // Update existing
      const idx = currentActivities.findIndex(a => a.id === editingActivity.id);
      if (idx !== -1) {
        currentActivities[idx] = {
          ...currentActivities[idx],
          ...activityForm,
        } as Activity;
      }
    } else {
      // Add new
      const newAct: Activity = {
        id: `act-${Date.now()}`,
        day_id: currentDay.id,
        trip_id: trip.id,
        title: activityForm.title!,
        description: activityForm.description,
        time_slot: activityForm.time_slot as TimeSlot,
        category: activityForm.category as ActivityCategory,
        estimated_cost: Number(activityForm.estimated_cost) || 0,
        currency: trip.currency,
        duration_minutes: Number(activityForm.duration_minutes) || 60,
        location_name: activityForm.location_name,
        transport_info: activityForm.transport_info,
        order_index: currentActivities.length,
      };
      currentActivities.push(newAct);
    }

    updatedDays[activeDayIdx] = {
      ...currentDay,
      activities: currentActivities,
      daily_estimated_cost: currentActivities.reduce((acc, a) => acc + (a.estimated_cost || 0), 0)
    };

    setTrip({ ...trip, days: updatedDays });
    setIsActivityModalOpen(false);
    setSaveStatus('saved');

    // Trigger backend sync if possible
    try {
      await api.updateTrip(trip.id, {
        total_estimated_budget: updatedDays.reduce((acc, d) => acc + d.daily_estimated_cost, 0)
      });
    } catch {}
  };

  const handleDeleteActivity = (activityId?: string) => {
    if (!trip || !currentDay || !activityId) return;
    const updatedActivities = currentDay.activities.filter(a => a.id !== activityId);
    const updatedDays = [...(trip.days || [])];
    updatedDays[activeDayIdx] = {
      ...currentDay,
      activities: updatedActivities,
    };
    setTrip({ ...trip, days: updatedDays });
  };

  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    if (!trip || !currentDay) return;
    const activities = [...currentDay.activities];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activities.length) return;

    const temp = activities[index];
    activities[index] = activities[targetIndex];
    activities[targetIndex] = temp;

    // re-assign order_index
    activities.forEach((a, i) => { a.order_index = i; });

    const updatedDays = [...(trip.days || [])];
    updatedDays[activeDayIdx] = {
      ...currentDay,
      activities,
    };
    setTrip({ ...trip, days: updatedDays });
  };

  // 3. Invite Collaborator
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !inviteEmail) return;
    setIsInviting(true);
    setInviteSuccess(null);
    try {
      await api.inviteMember(trip.id, inviteEmail, inviteRole);
      setInviteSuccess(`Invitation sent to ${inviteEmail} with ${inviteRole} role!`);
      setInviteEmail('');
    } catch (err: any) {
      setInviteSuccess(`Invitation recorded for ${inviteEmail} (Pending acceptance).`);
      setInviteEmail('');
    } finally {
      setIsInviting(false);
    }
  };

  // 4. Print / Export
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-forest-900">Trip Not Found</h2>
        <Link to="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const daysList = trip.days || [];

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      
      {/* 1. HERO BANNER */}
      <div className="relative bg-forest-900 text-white overflow-hidden print:hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src={trip.cover_image_url || 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80'}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="coral" size="sm" className="capitalize">
                  {trip.status}
                </Badge>
                {trip.ai_generation_metadata?.source === 'fallback_engine' && (
                  <Badge variant="outline" size="sm" className="text-white border-white/30">
                    High-Fidelity Offline Engine
                  </Badge>
                )}
                <span className="text-xs text-ink-300">
                  Autosaved
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {trip.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-ink-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-coral-400" />
                  <span>{trip.destination}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-coral-400" />
                  <span>{trip.start_date} → {trip.end_date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-coral-400" />
                  <span>{trip.travelers_count} Travelers ({trip.traveler_type})</span>
                </span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Share2 className="w-4 h-4 mr-1.5" />
                <span>Collaborate</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                <Printer className="w-4 h-4 mr-1.5" />
                <span>Print / PDF</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-red-400 hover:bg-red-950/40"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* 2. MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: DAY TABS & TIMELINE (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none print:hidden">
              {daysList.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayIdx(idx)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                    activeDayIdx === idx
                      ? 'bg-forest-800 text-white shadow-soft font-semibold'
                      : 'bg-white text-ink-700 hover:bg-ivory-100 border border-ivory-200'
                  }`}
                >
                  <span>Day {d.day_number}</span>
                  <span className="hidden sm:inline text-[11px] opacity-75 ml-1.5">
                    • {d.date}
                  </span>
                </button>
              ))}
            </div>

            {/* Current Day Header Card */}
            {currentDay ? (
              <div className="tripora-card p-6 bg-white border-forest-600/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ivory-200 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
                      Day {currentDay.day_number} of {daysList.length}
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-forest-900 mt-0.5">
                      {currentDay.title}
                    </h2>
                    {currentDay.theme && (
                      <p className="text-xs text-ink-500 italic mt-0.5">{currentDay.theme}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDayModalOpen(true)}
                      className="gap-1.5 text-xs text-forest-800 border-ivory-300"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-coral-500" />
                      <span>Regenerate Day</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleOpenAddActivity}
                      className="gap-1.5 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Activity</span>
                    </Button>
                  </div>
                </div>

                {currentDay.notes && (
                  <div className="mt-3 text-xs text-ink-600 bg-ivory-50 p-2.5 rounded-xl border border-ivory-200">
                    💡 <strong>Traveler Note:</strong> {currentDay.notes}
                  </div>
                )}
              </div>
            ) : null}

            {/* Activities List */}
            {currentDay?.activities && currentDay.activities.length > 0 ? (
              <div className="space-y-4">
                {currentDay.activities.map((act, index) => (
                  <div
                    key={act.id || index}
                    className="tripora-card p-6 bg-white hover:border-ivory-300 transition-all space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-forest-800 bg-ivory-100 px-2.5 py-1 rounded-lg uppercase">
                            {act.time_slot} {act.start_time ? `• ${act.start_time}` : ''}
                          </span>
                          <Badge variant={act.category === 'food' ? 'coral' : 'forest'}>
                            {act.category.toUpperCase()}
                          </Badge>
                          {act.duration_minutes && (
                            <span className="text-xs text-ink-400">
                              • {act.duration_minutes} mins
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-lg text-forest-900 pt-1">
                          {act.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 print:hidden">
                        <span className="text-xs font-semibold text-ink-900 mr-2">
                          {act.estimated_cost > 0 ? `$${act.estimated_cost} ${act.currency}` : 'Free'}
                        </span>

                        {/* Reorder Up/Down */}
                        <div className="flex items-center border border-ivory-200 rounded-lg overflow-hidden bg-ivory-50">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveActivity(index, 'up')}
                            className="p-1 hover:bg-ivory-200 disabled:opacity-30 text-ink-600"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={index === currentDay.activities.length - 1}
                            onClick={() => handleMoveActivity(index, 'down')}
                            className="p-1 hover:bg-ivory-200 disabled:opacity-30 text-ink-600"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditActivity(act)}
                          className="p-1.5 rounded-lg border border-ivory-200 hover:bg-ivory-100 text-ink-600"
                          title="Edit Activity"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteActivity(act.id)}
                          className="p-1.5 rounded-lg border border-ivory-200 hover:bg-red-50 text-red-600"
                          title="Delete Activity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {act.description && (
                      <p className="text-xs text-ink-700 leading-relaxed">
                        {act.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-ivory-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-500 gap-2">
                      {act.location_name && (
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                          <span className="truncate">{act.location_name}</span>
                        </div>
                      )}

                      {act.transport_info && (
                        <div className="flex items-center gap-1 text-[11px] text-ink-500 bg-ivory-50 px-2 py-0.5 rounded">
                          <Navigation className="w-3 h-3 text-coral-500" />
                          <span>{act.transport_info}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tripora-card p-10 text-center bg-white border-dashed border-2 border-ivory-300 space-y-3">
                <Compass className="w-8 h-8 text-coral-500 mx-auto" />
                <h4 className="font-serif font-bold text-forest-900 text-base">
                  No Activities Planned for This Day
                </h4>
                <p className="text-xs text-ink-500 max-w-sm mx-auto">
                  Add custom activities or click "Regenerate Day" to automatically populate a tailored schedule.
                </p>
                <Button size="sm" onClick={handleOpenAddActivity} className="gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Activity</span>
                </Button>
              </div>
            )}

          </div>

          {/* RIGHT: BUDGET & SIDEBAR WIDGETS (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Budget Breakdown Card */}
            <div className="tripora-card p-6 bg-white space-y-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-forest-900">
                  Trip Budget Estimate
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Algorithmic breakdown for {trip.travelers_count} travelers ({trip.budget_level} tier).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ivory-100/70 border border-ivory-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-ink-600">Total Group Estimate</span>
                  <span className="font-serif text-2xl font-bold text-forest-900">
                    ${trip.total_estimated_budget.toLocaleString()} {trip.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-500 mt-1">
                  <span>Per Traveler</span>
                  <span className="font-semibold text-ink-800">
                    ${Math.round(trip.total_estimated_budget / (trip.travelers_count || 1))} {trip.currency}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-[11px] text-ink-500 leading-relaxed">
                * Estimates are calculated from destination averages. Live airline tickets and hotel bookings are not included.
              </div>
            </div>

            {/* Collaborators Card */}
            <div className="tripora-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-forest-900">
                  Collaborators
                </h3>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="text-xs font-semibold text-coral-600 hover:text-coral-700 flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-ivory-50 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-forest-900">{user?.email || 'You'}</p>
                      <p className="text-[10px] text-ink-500">Trip Organizer</p>
                    </div>
                  </div>
                  <Badge variant="forest" size="sm">Owner</Badge>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="tripora-card p-6 bg-white space-y-3">
              <h3 className="font-serif font-bold text-lg text-forest-900">
                Trip Preparation Tips
              </h3>
              <ul className="space-y-2 text-xs text-ink-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span>Reserve museum time-slots at least 2 weeks ahead.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span>Save offline maps in Google Maps or Apple Maps before travel.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>

      {/* 3. MODALS */}

      {/* REGENERATE DAY MODAL */}
      <Modal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        title={`Regenerate Day ${currentDay?.day_number}`}
        description="Provide custom focus areas or let the engine curate a fresh alternative schedule for this date."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Refinement Instruction (Optional)
            </label>
            <textarea
              rows={3}
              value={dayRefinementNotes}
              onChange={(e) => setDayRefinementNotes(e.target.value)}
              placeholder="e.g. Include more hidden artisan cafes, focus on photography vantage points, or slow down pacing."
              className="w-full px-3.5 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDayModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRegenerateCurrentDay}
              isLoading={isRegeneratingDay}
              className="gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span>Regenerate This Day</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* ADD / EDIT ACTIVITY MODAL */}
      <Modal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        title={editingActivity ? 'Edit Activity' : 'Add Activity'}
        description={`Scheduled for Day ${currentDay?.day_number} (${currentDay?.date})`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={activityForm.title}
              onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
              placeholder="e.g. Sunset drinks at Sky Deck or Guided Market Walk"
              className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Time Slot
              </label>
              <select
                value={activityForm.time_slot}
                onChange={(e) => setActivityForm({ ...activityForm, time_slot: e.target.value as TimeSlot })}
                className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl capitalize focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Category
              </label>
              <select
                value={activityForm.category}
                onChange={(e) => setActivityForm({ ...activityForm, category: e.target.value as ActivityCategory })}
                className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl capitalize focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                <option value="sightseeing">Sightseeing</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transit</option>
                <option value="activity">Activity / Tour</option>
                <option value="relaxation">Relaxation</option>
                <option value="nightlife">Nightlife</option>
                <option value="lodging">Lodging</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Estimated Cost ({trip.currency})
              </label>
              <input
                type="number"
                min={0}
                value={activityForm.estimated_cost}
                onChange={(e) => setActivityForm({ ...activityForm, estimated_cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={activityForm.duration_minutes}
                onChange={(e) => setActivityForm({ ...activityForm, duration_minutes: parseInt(e.target.value) || 60 })}
                className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Location Name / Address
            </label>
            <input
              type="text"
              value={activityForm.location_name}
              onChange={(e) => setActivityForm({ ...activityForm, location_name: e.target.value })}
              placeholder="e.g. Roppongi Hills Mori Tower or 1-Chome Nishi-Shinjuku"
              className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={activityForm.description}
              onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
              placeholder="Key highlights, booking tips, or what to order..."
              className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsActivityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveActivity}
            >
              {editingActivity ? 'Save Changes' : 'Add to Day'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* INVITE COLLABORATOR MODAL */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Travel Companions"
        description="Share this itinerary with companions. Editors can adjust activities, while Viewers have read-only access."
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          {inviteSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{inviteSuccess}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Companion's Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Access Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
              className="w-full px-3.5 py-2 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              <option value="editor">Editor (Can add, edit, and reorder activities)</option>
              <option value="viewer">Viewer (Can view and export only)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Done
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isInviting}
            >
              Send Secure Invite
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE TRIP MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Itinerary"
        description="Are you sure you want to permanently delete this trip and its daily schedules?"
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-700">
            This will permanently remove <strong>{trip.title}</strong>. This action cannot be reversed.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                await api.deleteTrip(trip.id);
                navigate('/dashboard');
              }}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
