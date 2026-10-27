import React from 'react';
import { Compass, Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-900 text-ivory-100 border-t border-forest-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-800 border border-forest-700 flex items-center justify-center">
                <Compass className="w-5 h-5 text-coral-400" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Tripora
              </span>
            </div>
            <p className="text-xs text-ink-400 leading-relaxed">
              Your Journey, Your Way. Intelligent, personalized itinerary planning tailored for modern travelers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forest-800/60 border border-forest-700/60 text-[11px] text-coral-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Augmented & Deterministic Fallback</span>
            </div>
          </div>

          {/* Destination Ideas */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Featured Itineraries
            </h4>
            <ul className="space-y-2.5 text-xs text-ink-300">
              <li>
                <Link to="/sample" className="hover:text-coral-300 transition-colors">
                  Kyoto & Tokyo Cultural Exploration (7 Days)
                </Link>
              </li>
              <li>
                <span className="hover:text-coral-300 transition-colors cursor-pointer">
                  Amalfi Coast Gastronomy & Vistas (5 Days)
                </span>
              </li>
              <li>
                <span className="hover:text-coral-300 transition-colors cursor-pointer">
                  Parisian Hidden Ateliers & Cafes (4 Days)
                </span>
              </li>
              <li>
                <span className="hover:text-coral-300 transition-colors cursor-pointer">
                  Eternal Rome Antiquity & Trastevere (5 Days)
                </span>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-ink-300">
              <li>
                <Link to="/builder" className="hover:text-coral-300 transition-colors">
                  AI Trip Builder
                </Link>
              </li>
              <li>
                <Link to="/sample" className="hover:text-coral-300 transition-colors">
                  Sample Demonstration
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-coral-300 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-coral-300 transition-colors">
                  Travel Planning FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Reliability */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Trust & Transparency
            </h4>
            <p className="text-xs text-ink-400 leading-relaxed mb-3">
              Tripora estimates travel costs and transit durations based on regional averages. We clearly label AI suggestions and never fabricate live reservations.
            </p>
            <div className="flex items-center gap-2 text-xs text-ink-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Row Level Security (RLS) Protected</span>
            </div>
          </div>

        </div>

        <div className="pt-10 mt-10 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-400 gap-4">
          <p>© {new Date().getFullYear()} Tripora SaaS. All rights reserved.</p>
          <div className="flex items-center gap-1 text-ink-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
            <span>for explorers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
