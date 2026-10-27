import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Edit3, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Trip, TripStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Modal } from '../../components/ui/Modal';

// Pre-seeded starter trips for demonstration if user has 0 trips
const SAMPLE_STARTER_TRIP: Partial<Trip> = {
  id: 'starter-kyoto-tokyo-demo',
  user_id: 'demo-user-id-00000000-0000-0000-0000-000000000001',
  title: 'Tokyo & Kyoto Cultural Odyssey',
  destination: 'Tokyo & Kyoto, Japan',
  start_date: '2026-11-10',
  end_date: '2026-11-17',
  travelers_count: 2,
  traveler_type: 'couple',
  budget_level: 'moderate',
  currency: 'USD',
  pace: 'moderate',
  interests: ['culture', 'food', 'history', 'photography'],
  status: 'planning',
  total_estimated_budget: 2840.0,
  cover_image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
};

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Delete Confirmation State
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Active Dropdown Menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadUserTrips();
  }, []);

  const loadUserTrips = async () => {
    setLoading(true);
    try {
      const data = await api.listTrips();
      if (data && data.length > 0) {
        setTrips(data);
      } else {
        // Provide starter trip for seamless out-of-the-box exploration
        setTrips([SAMPLE_STARTER_TRIP as Trip]);
      }
    } catch (err) {
      console.warn('Failed to fetch from backend, showing fallback list:', err);
      setTrips([SAMPLE_STARTER_TRIP as Trip]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteTrip(tripToDelete.id);
      setTrips(prev => prev.filter(t => t.id !== tripToDelete.id));
      setTripToDelete(null);
    } catch (err) {
      console.error('Failed to delete trip:', err);
      // Still update UI in case of preview mode
      setTrips(prev => prev.filter(t => t.id !== tripToDelete.id));
      setTripToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateTrip = async (trip: Trip) => {
    try {
      const dup = await api.duplicateTrip(trip.id);
      setTrips(prev => [dup, ...prev]);
      setActiveMenuId(null);
    } catch (err) {
      console.error('Failed to duplicate:', err);
      const fakeDup: Trip = {
        ...trip,
        id: `dup-${Date.now()}`,
        title: `Copy of ${trip.title}`,
      };
      setTrips(prev => [fakeDup, ...prev]);
      setActiveMenuId(null);
    }
  };

  // Filtered trips
  const filteredTrips = trips.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TripStatus) => {
    switch (status) {
      case 'planning':
        return <Badge variant="coral">Planning</Badge>;
      case 'confirmed':
        return <Badge variant="forest">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="ivory">Completed</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="ivory">{status}</Badge>;
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-ivory-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header / Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-ivory-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-coral-500" />
              <span>Traveler Portal</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 mt-1">
              Manage your upcoming adventures, review daily schedules, or generate a new journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/builder">
              <Button size="md" className="gap-2 shadow-soft">
                <PlusCircle className="w-4 h-4" />
                <span>Create New Trip</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Quick Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="tripora-card p-5 bg-white">
            <span className="text-xs text-ink-500 font-medium">Total Trips</span>
            <p className="font-serif text-2xl font-bold text-forest-900 mt-1">{trips.length}</p>
          </div>
          <div className="tripora-card p-5 bg-white">
            <span className="text-xs text-ink-500 font-medium">In Planning</span>
            <p className="font-serif text-2xl font-bold text-coral-600 mt-1">
              {trips.filter(t => t.status === 'planning').length}
            </p>
          </div>
          <div className="tripora-card p-5 bg-white">
            <span className="text-xs text-ink-500 font-medium">Confirmed Stays</span>
            <p className="font-serif text-2xl font-bold text-forest-700 mt-1">
              {trips.filter(t => t.status === 'confirmed').length}
            </p>
          </div>
          <div className="tripora-card p-5 bg-white">
            <span className="text-xs text-ink-500 font-medium">Preferred Style</span>
            <p className="font-serif text-lg font-bold text-forest-900 mt-1 capitalize">
              {profile?.travel_style || 'Balanced'}
            </p>
          </div>
        </div>

        {/* 3. Search and Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by destination or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-ivory-200 rounded-xl text-ink-900 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-soft"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {['all', 'planning', 'confirmed', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-forest-800 text-white shadow-soft'
                    : 'bg-white text-ink-600 hover:bg-ivory-100 border border-ivory-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Trips Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="tripora-card p-4 space-y-3 bg-white">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          /* Empty State */
          <div className="tripora-card p-12 text-center bg-white border-dashed border-2 border-ivory-300 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-800 mx-auto flex items-center justify-center">
              <Compass className="w-7 h-7 text-coral-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-forest-900">
                No Itineraries Found
              </h3>
              <p className="text-xs text-ink-600 max-w-sm mx-auto">
                {searchQuery
                  ? "No trips matched your search filter. Try clearing the filter or searching for another city."
                  : "You haven't built any travel itineraries yet. Start planning your personalized trip in seconds!"}
              </p>
            </div>
            <div className="pt-2">
              <Link to="/builder">
                <Button size="md" className="gap-2 shadow-soft">
                  <Sparkles className="w-4 h-4" />
                  <span>Build Your First Trip</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="tripora-card overflow-hidden bg-white hover:border-ivory-300 hover:shadow-elevated transition-all flex flex-col group"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-forest-900">
                  <img
                    src={
                      trip.cover_image_url ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(trip.status)}
                  </div>

                  {/* Menu Options */}
                  <div className="absolute top-3 right-3 relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === trip.id ? null : trip.id)}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === trip.id && (
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-elevated border border-ivory-200 py-1.5 z-20 text-xs">
                        <button
                          onClick={() => handleDuplicateTrip(trip)}
                          className="w-full text-left px-3 py-1.5 hover:bg-ivory-100 flex items-center gap-2 text-ink-700"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplicate</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setTripToDelete(trip);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-red-50 flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Destination Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-white/90">
                      <MapPin className="w-3.5 h-3.5 text-coral-400" />
                      <span className="font-medium">{trip.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {trip.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-ink-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{trip.start_date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{trip.travelers_count} {trip.traveler_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-ivory-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-ink-400 block">Est. Budget</span>
                      <span className="text-xs font-bold text-forest-900">
                        ${trip.total_estimated_budget.toLocaleString()} {trip.currency}
                      </span>
                    </div>

                    <Link to={`/trips/${trip.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs font-semibold text-forest-800">
                        <span>View Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(tripToDelete)}
        onClose={() => setTripToDelete(null)}
        title="Delete Itinerary"
        description="Are you sure you want to remove this trip? This action is permanent and cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-700">
            Deleting <strong>{tripToDelete?.title}</strong> will remove all scheduled days, activities, and collaboration links.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTripToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteTrip}
              isLoading={isDeleting}
            >
              Yes, Delete Trip
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
