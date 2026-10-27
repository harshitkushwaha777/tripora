import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  Info,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface SampleActivity {
  title: string;
  slot: string;
  time: string;
  duration: string;
  category: 'sightseeing' | 'food' | 'transport' | 'culture' | 'relaxation';
  location: string;
  desc: string;
  cost: string;
  transit: string;
  officialUrl?: string;
}

interface SampleDay {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  estimatedCost: string;
  notes: string;
  activities: SampleActivity[];
}

const SAMPLE_DAYS: SampleDay[] = [
  {
    dayNumber: 1,
    date: 'Day 1',
    title: 'Arrival, Shibuya Neon & Omoide Yokocho',
    theme: 'Tokyo Skyline & Izakaya Alleyways',
    estimatedCost: '$65 USD',
    notes: 'Pick up your digital Suica card at the airport terminal train station.',
    activities: [
      {
        title: 'Arrive at Narita / Haneda & Check-in',
        slot: 'afternoon',
        time: '14:30',
        duration: '90 mins',
        category: 'transport',
        location: 'Hotel Ryumeikan Tokyo (Chuo City)',
        desc: 'Settle into your central hotel, freshen up after the flight, and prepare for an evening stroll.',
        cost: '$0 (Transit ticket ~$22)',
        transit: 'Direct Keisei Skyliner or Tokyo Monorail express train',
        officialUrl: 'https://www.japan.travel'
      },
      {
        title: 'Shibuya Crossing & Hachiko Memorial',
        slot: 'evening',
        time: '17:30',
        duration: '60 mins',
        category: 'sightseeing',
        location: 'Shibuya Station Hachiko Exit',
        desc: 'Experience the world-famous pedestrian scramble crossing and enjoy views from the Shibuya Sky observation deck.',
        cost: '$18 USD (Sky Deck entry)',
        transit: 'JR Yamanote Line to Shibuya Station',
        officialUrl: 'https://www.shibuya-scramble-square.com/sky/'
      },
      {
        title: 'Dinner at Omoide Yokocho (Memory Lane)',
        slot: 'night',
        time: '19:30',
        duration: '90 mins',
        category: 'food',
        location: 'Nishi-Shinjuku 1-Chome',
        desc: 'Atmospheric post-war lantern-lit alley with open charcoal grills serving freshly grilled yakitori and local craft beer.',
        cost: '$25 USD',
        transit: '3 min walk from Shinjuku Station West Exit',
        officialUrl: 'https://www.gotokyo.org'
      }
    ]
  },
  {
    dayNumber: 2,
    date: 'Day 2',
    title: 'Historic Asakusa & Digital Art Experience',
    theme: 'Ancient Shinto Meets Futuristic Technology',
    estimatedCost: '$78 USD',
    notes: 'Advance booking required for teamLab Planets to avoid multi-hour queues.',
    activities: [
      {
        title: 'Senso-ji Temple & Nakamise-dori Market',
        slot: 'morning',
        time: '08:30',
        duration: '120 mins',
        category: 'culture',
        location: 'Asakusa, Taito City',
        desc: 'Beat the main crowds to explore Tokyo’s oldest Buddhist temple founded in 628 AD and sample fresh ningyo-yaki sweets.',
        cost: '$0 USD (Temple entry free)',
        transit: 'Tokyo Metro Ginza Line to Asakusa Station',
        officialUrl: 'https://www.senso-ji.jp'
      },
      {
        title: 'Tsukiji Outer Market Seafood Lunch',
        slot: 'afternoon',
        time: '12:00',
        duration: '90 mins',
        category: 'food',
        location: 'Tsukiji 4-Chome, Chuo',
        desc: 'Walk vibrant market stalls tasting flame-torched scallops, fresh sea urchin, and rolled Japanese omelets (tamagoyaki).',
        cost: '$28 USD',
        transit: 'Toei Oedo Line to Tsukiji-shijo Station'
      },
      {
        title: 'teamLab Planets Immersive Digital Art',
        slot: 'afternoon',
        time: '14:30',
        duration: '120 mins',
        category: 'sightseeing',
        location: 'Toyosu, Koto City',
        desc: 'Wander barefoot through crystalline water pools and infinity mirror gardens interacting with projection art.',
        cost: '$32 USD',
        transit: 'Yurikamome monorail to Shin-Toyosu Station',
        officialUrl: 'https://planets.teamlab.art'
      },
      {
        title: 'Ramen Dinner & Evening Walk in Ginza',
        slot: 'evening',
        time: '18:30',
        duration: '90 mins',
        category: 'food',
        location: 'Ginza 6-Chome',
        desc: 'Savor rich tori paitan (creamy chicken broth) ramen at Michelin Bib Gourmand Kagari Ginza.',
        cost: '$18 USD',
        transit: 'Tokyo Metro Ginza Line'
      }
    ]
  },
  {
    dayNumber: 3,
    date: 'Day 3',
    title: 'Meiji Jingu Shrine & Harajuku Fashion Alley',
    theme: 'Forest Serenity & Pop Culture Energy',
    estimatedCost: '$52 USD',
    notes: 'Walk slowly through the Meiji forested gravel path to soak in the morning cedar aroma.',
    activities: [
      {
        title: 'Meiji Jingu Forest Sanctuary',
        slot: 'morning',
        time: '09:00',
        duration: '120 mins',
        category: 'culture',
        location: 'Yoyogikamizonocho, Shibuya',
        desc: 'Grand wooden torii gates leading through 170 acres of evergreen forest dedicated to Emperor Meiji.',
        cost: '$0 USD',
        transit: 'JR Yamanote Line to Harajuku Station'
      },
      {
        title: 'Takeshita Street & Cat Street Vintage Cafes',
        slot: 'afternoon',
        time: '12:00',
        duration: '120 mins',
        category: 'sightseeing',
        location: 'Jingumae, Shibuya',
        desc: 'Contrast vibrant colorful crepe stalls with relaxed boutique artisan coffee roasters along Cat Street.',
        cost: '$22 USD',
        transit: 'Short walking path directly from Meiji Jingu'
      },
      {
        title: 'Shinjuku Gyoen National Garden Picnic',
        slot: 'afternoon',
        time: '15:00',
        duration: '90 mins',
        category: 'relaxation',
        location: 'Naitomachi, Shinjuku',
        desc: 'Peaceful stroll across traditional Japanese landscape gardens, English lawns, and French formal rose gardens.',
        cost: '$4 USD (Entry 500 JPY)',
        transit: 'Tokyo Metro Marunouchi Line to Shinjuku-gyoemmae'
      },
      {
        title: 'Dinner at Shinjuku Tonkatsu Wako',
        slot: 'evening',
        time: '18:30',
        duration: '75 mins',
        category: 'food',
        location: 'Subnad Underground, Shinjuku',
        desc: 'Crispy panko-breaded Kurobuta pork cutlet served with shredded cabbage and steaming rice.',
        cost: '$26 USD',
        transit: 'Walking distance from Shinjuku Gyoen'
      }
    ]
  },
  {
    dayNumber: 4,
    date: 'Day 4',
    title: 'Shinkansen Bullet Train to Kyoto & Gion',
    theme: 'High-Speed Transit & Historic Geisha District',
    estimatedCost: '$165 USD',
    notes: 'Book seat E on the Shinkansen (right side facing Kyoto) for views of Mt. Fuji.',
    activities: [
      {
        title: 'Tokaido Shinkansen (Bullet Train) to Kyoto',
        slot: 'morning',
        time: '09:30',
        duration: '135 mins',
        category: 'transport',
        location: 'Tokyo Station to Kyoto Station',
        desc: 'Glide smoothly at 285 km/h across the Japanese countryside with an Ekiben bento box lunch.',
        cost: '$98 USD (Standard Reserved Car)',
        transit: 'JR Tokaido Shinkansen Nozomi Service'
      },
      {
        title: 'Check-in & Stroll Shirakawa Canal',
        slot: 'afternoon',
        time: '14:00',
        duration: '90 mins',
        category: 'relaxation',
        location: 'Gion-Shirakawa, Higashiyama',
        desc: 'Willow-lined stone canal with traditional wooden machiya merchant townhouses and tranquil footbridges.',
        cost: '$0 USD',
        transit: 'Keihan Main Line to Gion-Shijo'
      },
      {
        title: 'Traditional Kaiseki Multi-Course Dinner',
        slot: 'evening',
        time: '18:00',
        duration: '120 mins',
        category: 'food',
        location: 'Gion, Kyoto',
        desc: 'Seasonal multi-course dining featuring Kyoto tofu, local mountain vegetables, dashi broth, and matcha desserts.',
        cost: '$67 USD',
        transit: 'Walking distance in Gion'
      }
    ]
  },
  {
    dayNumber: 5,
    date: 'Day 5',
    title: 'Fushimi Inari Torii Shrine & Kiyomizu-dera',
    theme: 'Vermilion Mountain Gates & Clifftop Temples',
    estimatedCost: '$45 USD',
    notes: 'Early 07:30 start avoids the midday tour bus peak on the mountain hike.',
    activities: [
      {
        title: 'Fushimi Inari 10,000 Torii Hike',
        slot: 'morning',
        time: '07:30',
        duration: '150 mins',
        category: 'culture',
        location: 'Fushimi-ku, Kyoto',
        desc: 'Climb through the iconic tunnel of vibrant red-orange torii gates winding up sacred Mount Inari.',
        cost: '$0 USD',
        transit: 'JR Nara Line from Kyoto Station to Inari Station (5 mins)'
      },
      {
        title: 'Kiyomizu-dera Wooden Stage & Otowa Waterfall',
        slot: 'afternoon',
        time: '12:30',
        duration: '120 mins',
        category: 'culture',
        location: 'Higashiyama Ward, Kyoto',
        desc: 'UNESCO World Heritage temple built on a massive wooden veranda over the cliff without using a single nail.',
        cost: '$3 USD (Entry 400 JPY)',
        transit: 'Kyoto City Bus 206 to Gojo-zaka'
      },
      {
        title: 'Sannenzaka & Ninenzaka Traditional Teahouses',
        slot: 'afternoon',
        time: '15:00',
        duration: '90 mins',
        category: 'food',
        location: 'Higashiyama, Kyoto',
        desc: 'Historic stone pedestrian alleys lined with preserved Edo-era machiya shops, tea houses, and matcha parfaits.',
        cost: '$12 USD',
        transit: 'Stroll directly down from Kiyomizu-dera'
      },
      {
        title: 'Kyoto Yobana Duck Ramen Dinner',
        slot: 'evening',
        time: '18:30',
        duration: '75 mins',
        category: 'food',
        location: 'Karasuma / Shijo',
        desc: 'Savor celebrated Kyoto duck broth noodles with tender chashu and locally harvested scallions.',
        cost: '$18 USD',
        transit: 'Subway Karasuma Line to Shijo'
      }
    ]
  },
  {
    dayNumber: 6,
    date: 'Day 6',
    title: 'Arashiyama Bamboo Forest & Golden Pavilion',
    theme: 'Zen Rock Gardens & Golden Reflections',
    estimatedCost: '$58 USD',
    notes: 'Tenryu-ji garden pond dates back to the 14th century.',
    activities: [
      {
        title: 'Arashiyama Bamboo Grove & Tenryu-ji Temple',
        slot: 'morning',
        time: '08:30',
        duration: '120 mins',
        category: 'relaxation',
        location: 'Ukyo Ward, Kyoto',
        desc: 'Walk among towering green bamboo stalks swaying with the wind, followed by meditation at Tenryu-ji Zen temple.',
        cost: '$4 USD (Zen Garden Entry)',
        transit: 'JR San-in Line from Kyoto Station to Saga-Arashiyama'
      },
      {
        title: 'Kinkaku-ji (The Golden Pavilion)',
        slot: 'afternoon',
        time: '13:00',
        duration: '90 mins',
        category: 'culture',
        location: 'Kita Ward, Kyoto',
        desc: 'Awe-inspiring Zen temple covered in pure gold leaf reflecting perfectly over the mirror pond.',
        cost: '$4 USD (Entry 500 JPY)',
        transit: 'Kyoto City Bus 205'
      },
      {
        title: 'Ryoan-ji Zen Dry Rock Garden',
        slot: 'afternoon',
        time: '15:00',
        duration: '75 mins',
        category: 'culture',
        location: 'Ryoanji Goryonoshitacho',
        desc: 'Contemplate Japan’s most famous karesansui rock garden featuring 15 rocks arranged so only 14 can be seen at any angle.',
        cost: '$4 USD',
        transit: '15 min walk from Kinkaku-ji'
      },
      {
        title: 'Dinner at Pontocho Alley Overlooking Kamogawa',
        slot: 'evening',
        time: '18:30',
        duration: '105 mins',
        category: 'food',
        location: 'Pontocho Alley, Nakagyo Ward',
        desc: 'Dine on summer kawayuka riverside platforms or cozy winter izakayas tasting Kyoto-style hot pot (nabe).',
        cost: '$46 USD',
        transit: 'Keihan Line to Sanjo Station'
      }
    ]
  },
  {
    dayNumber: 7,
    date: 'Day 7',
    title: 'Nishiki Market Culinary Tour & Departure',
    theme: 'Kyoto’s Kitchen & Journey Farewell',
    estimatedCost: '$40 USD',
    notes: 'Last-minute souvenirs like Uji matcha powder and Kyoto ceramic pottery.',
    activities: [
      {
        title: 'Nishiki Market ("Kyoto’s Kitchen")',
        slot: 'morning',
        time: '09:30',
        duration: '120 mins',
        category: 'food',
        location: 'Nakagyo Ward, Kyoto',
        desc: 'Five-block covered shopping street packed with over 100 stalls selling tsukemono pickles, wagashi, and grilled skewers.',
        cost: '$24 USD',
        transit: 'Subway to Karasuma or Shijo'
      },
      {
        title: 'Kyoto Station Skyway & Souvenir Shopping',
        slot: 'afternoon',
        time: '12:30',
        duration: '90 mins',
        category: 'sightseeing',
        location: 'Kyoto Station Complex',
        desc: 'Walk the futuristic steel-and-glass Skyway bridge 45 meters above the station concourse with city views.',
        cost: '$0 USD',
        transit: 'Kyoto Station main building'
      },
      {
        title: 'Haruka Express Train to Kansai Airport (KIX)',
        slot: 'afternoon',
        time: '14:30',
        duration: '75 mins',
        category: 'transport',
        location: 'Kyoto Station Track 30',
        desc: 'Direct airport express train connecting Kyoto Station to Osaka Kansai International Airport.',
        cost: '$16 USD (With ICOCA & Haruka discount)',
        transit: 'JR Haruka Express Train'
      }
    ]
  }
];

export const SampleTripPage: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const currentDay = SAMPLE_DAYS[activeDayIndex];

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      
      {/* 1. Header Banner */}
      <div className="relative bg-forest-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80"
            alt="Kyoto Arashiyama bamboo path"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800/80 border border-forest-700 text-xs font-semibold text-coral-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Sample Itinerary (No Account Required)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Kyoto & Tokyo Discovery: 7 Days of Culture & Cuisine
          </h1>

          <p className="text-sm sm:text-base text-ink-300 max-w-2xl leading-relaxed mb-6">
            A comprehensive, field-tested travel schedule balancing iconic historic shrines, cutting-edge digital exhibitions, bullet train transit, and authentic food neighborhoods.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Badge variant="coral">7 Days / 6 Nights</Badge>
            <Badge variant="forest">2 Travelers (Couple)</Badge>
            <Badge variant="ivory">Moderate Pace</Badge>
            <Badge variant="outline">Est. $1,420 USD / traveler</Badge>
            <span className="text-ink-400 pl-2">Created by Tripora Travel Engine</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Notification Callout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="p-4 rounded-2xl bg-coral-50 border border-coral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-coral-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-coral-950">
              <span className="font-bold">Want to customize this for your own dates and group?</span>
              <p className="text-coral-800 mt-0.5">You can build your own custom travel plan in under 60 seconds using our AI builder.</p>
            </div>
          </div>
          <Link to="/builder">
            <Button size="sm" variant="secondary" className="whitespace-nowrap shadow-soft">
              Plan My Custom Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Main Itinerary Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Day Navigation & Activities (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Day Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {SAMPLE_DAYS.map((d, idx) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
                    activeDayIndex === idx
                      ? 'bg-forest-800 text-white shadow-soft font-semibold'
                      : 'bg-white text-ink-700 hover:bg-ivory-100 border border-ivory-200'
                  }`}
                >
                  <span>Day {d.dayNumber}</span>
                  <span className="hidden sm:inline text-[11px] opacity-75 ml-1.5">• {d.title.split('&')[0].trim()}</span>
                </button>
              ))}
            </div>

            {/* Current Day Header Card */}
            <div className="tripora-card p-6 border-forest-600/20 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ivory-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-coral-600">
                    Day {currentDay.dayNumber} of 7
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-forest-900 mt-0.5">
                    {currentDay.title}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-ink-500">Day Estimated Spend</span>
                  <p className="font-bold text-forest-800 text-sm">{currentDay.estimatedCost}</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-ink-600">
                <span className="italic">{currentDay.theme}</span>
                {currentDay.notes && (
                  <span className="text-coral-700 bg-coral-50 px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-coral-200">
                    💡 {currentDay.notes}
                  </span>
                )}
              </div>
            </div>

            {/* Activities Timeline */}
            <div className="space-y-4">
              {currentDay.activities.map((act, i) => (
                <div
                  key={i}
                  className="tripora-card p-6 bg-white hover:border-ivory-300 transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-forest-800 bg-ivory-100 px-2.5 py-1 rounded-lg">
                          {act.time}
                        </span>
                        <Badge variant={act.category === 'food' ? 'coral' : 'forest'}>
                          {act.category.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-ink-400">• {act.duration}</span>
                      </div>
                      <h3 className="font-serif font-bold text-lg text-forest-900 pt-1">
                        {act.title}
                      </h3>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-ink-900">{act.cost}</span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-700 leading-relaxed">
                    {act.desc}
                  </p>

                  <div className="pt-3 border-t border-ivory-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-ink-500 gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>

                    {act.transit && (
                      <div className="flex items-center gap-1 text-[11px] text-ink-500 bg-ivory-50 px-2 py-1 rounded">
                        <Navigation className="w-3 h-3 text-coral-500" />
                        <span>{act.transit}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Trip Overview & Budget Breakdown (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Budget Breakdown Card */}
            <div className="tripora-card p-6 bg-white space-y-5">
              <div>
                <h3 className="font-serif font-bold text-lg text-forest-900">
                  Estimated Trip Budget
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Based on moderate travel tier for 2 travelers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-ivory-100/70 border border-ivory-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-ink-600">Total Group Estimate</span>
                  <span className="font-serif text-2xl font-bold text-forest-900">$2,840 USD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-500 mt-1">
                  <span>Per Person</span>
                  <span className="font-semibold text-ink-800">$1,420 USD</span>
                </div>
              </div>

              {/* Category bars */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-ink-700">Accommodation (6 Nights)</span>
                    <span className="text-ink-900">$1,080 (38%)</span>
                  </div>
                  <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-forest-800 h-full rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-ink-700">Food & Dining</span>
                    <span className="text-ink-900">$840 (30%)</span>
                  </div>
                  <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-coral-500 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-ink-700">Local Transit & Shinkansen</span>
                    <span className="text-ink-900">$520 (18%)</span>
                  </div>
                  <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-ink-700">Sightseeing & Entry Passes</span>
                    <span className="text-ink-900">$400 (14%)</span>
                  </div>
                  <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-[11px] text-ink-500 leading-relaxed">
                * Note: Estimates are calculated based on regional hospitality averages and do not represent live flight or hotel bookings.
              </div>
            </div>

            {/* Accommodation Recommendations Card */}
            <div className="tripora-card p-6 bg-white space-y-4">
              <h3 className="font-serif font-bold text-lg text-forest-900">
                Recommended Stays
              </h3>
              
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-ivory-200 bg-ivory-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-forest-900">Hotel Ryumeikan Tokyo</h4>
                    <span className="text-xs font-semibold text-coral-600">~$160 / night</span>
                  </div>
                  <p className="text-[11px] text-ink-500">Chuo / Tokyo Station • Modern Japanese Boutique</p>
                  <p className="text-[11px] text-ink-600 leading-snug">
                    Prime bullet train connection with traditional tatami lounge corners.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-ivory-200 bg-ivory-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-forest-900">Kyoto Machiya Villa Stay</h4>
                    <span className="text-xs font-semibold text-coral-600">~$190 / night</span>
                  </div>
                  <p className="text-[11px] text-ink-500">Gion / Higashiyama • Heritage Timber Townhouse</p>
                  <p className="text-[11px] text-ink-600 leading-snug">
                    Restored historic merchant home with serene inner courtyard bamboo garden.
                  </p>
                </div>
              </div>
            </div>

            {/* Practical Travel Tips Card */}
            <div className="tripora-card p-6 bg-white space-y-3">
              <h3 className="font-serif font-bold text-lg text-forest-900">
                Practical Kyoto & Tokyo Tips
              </h3>
              <ul className="space-y-2.5 text-xs text-ink-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Suica / Pasmo IC card:</strong> Add digitally to Apple or Google Wallet for instantaneous metro taps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Coin locker storage:</strong> Major stations like Kyoto and Shinjuku have ample electronic lockers for day luggage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Early temple visits:</strong> Iconic sites like Fushimi Inari and Arashiyama are best visited before 08:30 AM for quiet contemplation.</span>
                </li>
              </ul>
            </div>

            {/* Start Planning Callout */}
            <div className="p-6 rounded-3xl bg-forest-900 text-white space-y-4">
              <h3 className="font-serif font-bold text-xl text-white">
                Create Your Own Blueprint
              </h3>
              <p className="text-xs text-ink-300 leading-relaxed">
                Whether traveling to Paris, Rome, Bali, or Tokyo, Tripora crafts an itinerary made just for you.
              </p>
              <Link to="/builder">
                <Button size="md" variant="secondary" className="w-full shadow-soft gap-2">
                  <span>Start Customizing</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
