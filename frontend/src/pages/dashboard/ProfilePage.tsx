import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  DollarSign, 
  Compass, 
  Coffee, 
  CheckCircle2, 
  Shield, 
  LogOut,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProfilePage: React.FC = () => {
  const { user, profile, isDemoUser, updateProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [travelStyle, setTravelStyle] = useState('balanced');
  const [bio, setBio] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setDefaultCurrency(profile.default_currency || 'USD');
      setTravelStyle(profile.travel_style || 'balanced');
      setBio(profile.bio || '');
    } else if (user) {
      setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
    }
  }, [profile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    await updateProfile({
      full_name: fullName,
      default_currency: defaultCurrency,
      travel_style: travelStyle,
      bio,
    });

    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-ivory-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-ivory-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5 text-coral-500" />
            <span>Account Settings</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-forest-900">
            Profile & Travel Preferences
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-1">
            Customize your default currencies, travel styles, and traveler bio used by Tripora's AI engine.
          </p>
        </div>

        {/* Save confirmation */}
        {isSaved && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Preferences updated successfully!</span>
          </div>
        )}

        {/* Main Settings Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-ivory-200 space-y-6">
          
          <div className="flex items-center gap-4 pb-6 border-b border-ivory-200">
            <div className="w-16 h-16 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-serif text-2xl font-bold">
              {fullName ? fullName.charAt(0).toUpperCase() : 'T'}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-forest-900">
                {fullName || 'Explorer'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-ink-500 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'traveler@tripora.example.com'}</span>
                {isDemoUser && (
                  <Badge variant="coral" size="sm">Demo Session</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Default Currency
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
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

              <div>
                <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                  Preferred Travel Style
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 capitalize"
                >
                  <option value="balanced">Balanced Culture & Rest</option>
                  <option value="outdoor">Active Outdoors & Nature</option>
                  <option value="gastronomy">Food & Wine Focus</option>
                  <option value="luxury">Luxury & Serene Wellness</option>
                  <option value="fast">High Paced Landmark Explorer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Traveler Bio & Favorite Regions
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your favorite travel memories or personal explorer ethos..."
                className="w-full px-3.5 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-ivory-200 flex items-center justify-between">
            <span className="text-xs text-ink-400">
              Settings persist across trip builds.
            </span>
            <Button
              type="submit"
              size="md"
              isLoading={isSaving}
              className="gap-2 shadow-soft"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </Button>
          </div>

        </form>

        {/* Account Security Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-ivory-200 space-y-4">
          <h3 className="font-serif text-lg font-bold text-forest-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Account Security & Session</span>
          </h3>
          <p className="text-xs text-ink-600 leading-relaxed">
            Your itineraries are secured with Supabase Row Level Security (RLS). Only you and companions you explicitly invite can access private trip records.
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-ink-500 font-mono">
              UID: {user?.id.slice(0, 18)}...
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="text-red-600 hover:bg-red-50 border-red-200 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
