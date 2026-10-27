import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Shuffle, 
  Share2, 
  ShieldCheck, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const handleLaunchDemo = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  const destinations = [
    {
      name: 'Kyoto & Tokyo, Japan',
      tagline: 'Neon Skylines & Ancient Shrines',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      days: '7 Days',
      style: 'Cultural & Culinary',
    },
    {
      name: 'Amalfi Coast, Italy',
      tagline: 'Cliffside Pastel Vistas & Limoncello Groves',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      days: '5 Days',
      style: 'Coastal & Leisure',
    },
    {
      name: 'Paris, France',
      tagline: 'Bohemian Ateliers & Haussmannian Cafes',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      days: '4 Days',
      style: 'Art & Gastronomy',
    },
  ];

  const faqs = [
    {
      q: 'How does Tripora create personalized itineraries?',
      a: 'Tripora pairs advanced AI itinerary generation with verified regional travel models. It analyzes your travel group (solo, couple, family, friends), exact dates, pace preference, dietary requirements, and budget tier to sequence realistic, geographically coherent daily schedules.'
    },
    {
      q: 'Are the cost estimates live booking prices?',
      a: 'No. Tripora provides transparent, realistic algorithmic estimates for activities, meals, transport, and lodging based on current regional averages. We clearly label all financial figures as estimates and never fabricate live hotel reservations or flight bookings.'
    },
    {
      q: 'Can I customize or regenerate only specific days?',
      a: 'Yes! Unlike rigid tools that force you to re-generate the entire vacation, Tripora lets you regenerate a single day, swap individual activities, edit time slots, reorder events, and add custom notes with precision.'
    },
    {
      q: 'How does group trip collaboration work?',
      a: 'Trip owners can invite companions via a secure invitation workflow. You can assign Editor permissions (allowing friends to add/modify activities) or Viewer permissions (read-only itinerary access) with secure Row Level Security.'
    },
    {
      q: 'What happens if the AI provider experiences an outage?',
      a: 'Tripora features a built-in deterministic travel engine that automatically activates if external AI services are unavailable. Your travel planning remains 100% operational, and the generated plan is clearly labeled with its provenance.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-ivory-50 border-b border-ivory-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold tracking-wide border border-forest-200/60">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>Next-Gen AI Travel Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-forest-900 tracking-tight leading-[1.12]">
                Your Journey, <br />
                <span className="text-coral-500 italic font-serif">Your Way.</span>
              </h1>

              <p className="text-base sm:text-lg text-ink-700 max-w-xl font-normal leading-relaxed">
                Hyper-personalized day-by-day itineraries crafted around your pace, travel companions, dietary preferences, and budget tier. Say goodbye to generic cookie-cutter templates.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link to="/builder">
                  <Button size="lg" className="w-full sm:w-auto shadow-elevated gap-2 text-base">
                    <span>Plan Your Trip</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link to="/sample">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                    <span>Explore Sample Itinerary</span>
                  </Button>
                </Link>

                <button
                  onClick={handleLaunchDemo}
                  className="sm:hidden w-full text-center py-2.5 text-xs font-semibold text-coral-700 bg-coral-50 rounded-xl border border-coral-200"
                >
                  Launch 1-Click Interactive Demo
                </button>
              </div>

              {/* Trust checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-ivory-200/70 text-xs text-ink-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>Geographic Realism</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>Granular Day Editing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0" />
                  <span>Multi-Traveler Group Sync</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative Backdrops */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-coral-100/50 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-6 -right-6 w-80 h-80 bg-forest-100/70 rounded-full blur-3xl -z-10" />

                {/* Main Visual Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-modal border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80"
                    alt="Tokyo cityscape at dusk"
                    className="w-full h-80 object-cover"
                  />
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 left-4 bg-forest-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-coral-400" />
                    <span>Curated by Tripora Engine</span>
                  </div>

                  {/* Overlaid preview summary card */}
                  <div className="p-6 bg-white space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-forest-900">
                          Tokyo & Kyoto Explorer
                        </h3>
                        <p className="text-xs text-ink-500">7 Days • 2 Travelers • Moderate Pace</p>
                      </div>
                      <Badge variant="coral">Est. $1,420 / person</Badge>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-ivory-200">
                      <div className="flex items-start gap-3 text-xs">
                        <span className="font-bold text-forest-800 bg-ivory-100 px-2 py-0.5 rounded">09:00</span>
                        <div>
                          <p className="font-semibold text-ink-900">Meiji Jingu Shrine & Forest Walk</p>
                          <p className="text-ink-500">Tranquil Shinto sanctuary surrounded by 170 acres of sacred forest.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 text-xs">
                        <span className="font-bold text-forest-800 bg-ivory-100 px-2 py-0.5 rounded">13:30</span>
                        <div>
                          <p className="font-semibold text-ink-900">Tsukiji Market Street Food Tasting</p>
                          <p className="text-ink-500">Fresh tamagoyaki, grilled seafood, and artisan matcha tea.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Effortless Intelligence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
              Crafted in Three Simple Steps
            </h2>
            <p className="text-sm text-ink-600">
              Tell Tripora how you like to travel, and our system synthesizes a comprehensive schedule in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="tripora-card p-8 relative flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-coral-100 text-coral-700 flex items-center justify-center font-serif text-xl font-bold shadow-soft">
                1
              </div>
              <h3 className="font-serif font-bold text-lg text-forest-900">Define Your Rhythm</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Specify destination, dates, budget tier, travel companions (solo, couple, family, friends), pace, and dietary constraints.
              </p>
            </div>

            {/* Step 2 */}
            <div className="tripora-card p-8 relative flex flex-col items-center text-center space-y-4 border-forest-600/30">
              <div className="w-14 h-14 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-serif text-xl font-bold shadow-soft">
                2
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-lg">AI Synthesizes Itinerary</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Our engine groups activities by geographic proximity, calculates realistic transit, curates local cuisine, and projects transparent costs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="tripora-card p-8 relative flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-ivory-200 text-forest-900 flex items-center justify-center font-serif text-xl font-bold shadow-soft">
                3
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-lg">Fine-Tune & Collaborate</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Regenerate single days, drag activities, add custom bookings, invite travel buddies, and take your plan offline or to print.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section className="py-20 bg-ivory-50 border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
                Inspiration
              </span>
              <h2 className="font-serif text-3xl font-bold text-forest-900 mt-1">
                Explore Popular Blueprints
              </h2>
            </div>
            <Link to="/sample" className="mt-4 md:mt-0 text-sm font-semibold text-coral-600 hover:text-coral-700 flex items-center gap-1.5">
              <span>View full Kyoto & Tokyo sample</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <div key={i} className="tripora-card overflow-hidden group">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
                      {dest.days} • {dest.style}
                    </span>
                    <h3 className="font-serif font-bold text-lg mt-1">{dest.name}</h3>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <p className="text-xs text-ink-600 font-medium">{dest.tagline}</p>
                  <Link to="/builder">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-forest-800">
                      Plan Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM CAPABILITIES */}
      <section id="features" className="py-20 bg-white border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Why Tripora Excels
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
              Designed for Realistic Exploration
            </h2>
            <p className="text-sm text-ink-600">
              Built specifically to avoid the common pitfalls of standard AI chatbots and rigid travel templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                <Clock className="w-5 h-5 text-coral-400" />
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-base">Geographic Coherence</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Activities are sequenced in nearby clusters, eliminating chaotic zig-zagging across large metropolitan areas and lost transit hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-coral-500 text-white flex items-center justify-center">
                <Shuffle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-base">Targeted Day Regeneration</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Change your mind about Day 3? Regenerate that single day with alternative themes or specific instructions without wiping out the rest of your trip.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-700 text-white flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-300" />
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-base">Realistic Budget Estimates</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Clear category breakdowns for activities, meals, transport, and lodging in your chosen currency. Estimates are transparently identified.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-white flex items-center justify-center">
                <Share2 className="w-5 h-5 text-coral-400" />
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-base">Group Collaboration</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Invite companions with Owner, Editor, or Viewer roles. Protect your plans with Supabase Row Level Security (RLS) policies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-base">High-Fidelity Fallback</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                If external AI APIs are unconfigured or fail, our rich deterministic engine smoothly generates authentic itineraries without interruption.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5 text-coral-300" />
              </div>
              <h3 className="font-serif font-bold text-forest-900 text-base">Traveler Persona Tuning</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Tailored for solo wanderers, romantic couple escapes, family journeys with children, and lively friend reunions with custom pacing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ILLUSTRATIVE TESTIMONIALS */}
      <section className="py-20 bg-ivory-100 border-b border-ivory-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500 bg-ivory-200 px-3 py-1 rounded-full">
              Illustrative Traveler Stories
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest-900 mt-3">
              Loved by Explorers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-2xl shadow-soft border border-ivory-200 space-y-4">
              <p className="text-xs text-ink-700 leading-relaxed italic">
                "Planning our family trip to Japan felt overwhelming with two kids. Tripora spaced out the temple walks with interactive museums and parks perfectly. The daily pacing saved our trip!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-ivory-100">
                <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs">
                  SK
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-900">Sarah & Keith M.</p>
                  <p className="text-[11px] text-ink-500">Family trip to Tokyo & Kyoto</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl shadow-soft border border-ivory-200 space-y-4">
              <p className="text-xs text-ink-700 leading-relaxed italic">
                "As a solo traveler, I wanted authentic food spots and historic walking routes without being locked into strict tour buses. The single-day regeneration let me adapt on the fly when it rained."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-ivory-100">
                <div className="w-9 h-9 rounded-full bg-coral-100 text-coral-800 flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-900">Arjun R.</p>
                  <p className="text-[11px] text-ink-500">Solo discovery across Rome & Florence</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl shadow-soft border border-ivory-200 space-y-4">
              <p className="text-xs text-ink-700 leading-relaxed italic">
                "Coordinating a trip for six friends usually ends in endless WhatsApp debates. Sharing the Tripora itinerary with editor permissions gave everyone visibility and kept our budget clear."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-ivory-100">
                <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-xs">
                  DL
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-900">Diana L.</p>
                  <p className="text-[11px] text-ink-500">Group vacation in Amalfi Coast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
              Common Questions
            </span>
            <h2 className="font-serif text-3xl font-bold text-forest-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-ivory-50 border border-ivory-200 space-y-2">
                <h4 className="text-sm font-bold text-forest-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-coral-500 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-ink-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-16 bg-forest-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Ready to Experience Your Next Destination?
          </h2>
          <p className="text-sm sm:text-base text-ink-300 max-w-xl mx-auto leading-relaxed">
            Create your custom travel blueprint in seconds. No credit card required.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/builder">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-elevated gap-2">
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/sample">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-forest-700 bg-forest-800 hover:bg-forest-700">
                <span>View Sample Trip</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
