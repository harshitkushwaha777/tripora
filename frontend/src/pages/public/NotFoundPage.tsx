import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-ivory-50 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-forest-100 text-forest-800 mx-auto flex items-center justify-center">
          <Compass className="w-8 h-8 text-coral-500" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900">
            Off the Map
          </h1>
          <p className="text-sm text-ink-600 leading-relaxed">
            The page you're searching for doesn't exist or has moved to a new route. Let's guide you back to your itinerary.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/">
            <Button size="md" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
