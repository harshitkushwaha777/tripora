import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUpWithEmail, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const { error } = await signUpWithEmail(email, password, fullName);
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Failed to create account.');
    } else {
      setSuccessMessage('Account created successfully! Check your email to verify or continue to your dashboard.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-soft border border-ivory-200">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white">
              <Compass className="w-5 h-5 text-coral-400" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-forest-900">
              Tripora
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-forest-900 pt-2">
            Begin Your Journey
          </h2>
          <p className="text-xs text-ink-600">
            Create an account to save trips, customize daily itineraries, and collaborate with companions.
          </p>
        </div>

        {/* Demo Fast Track */}
        <div className="p-3.5 rounded-2xl bg-coral-50 border border-coral-200 text-center space-y-2">
          <p className="text-xs text-coral-900 font-semibold">
            Want immediate full access without email verification?
          </p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-coral-500 hover:bg-coral-600 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Launch Instant Demo Account</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-ivory-200 w-full" />
          <span className="bg-white px-3 text-xs text-ink-400 uppercase tracking-wider font-medium absolute">
            or sign up with email
          </span>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full text-xs font-semibold py-3"
          >
            Create Your Tripora Account
          </Button>
        </form>

        <p className="text-center text-xs text-ink-600">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="font-semibold text-forest-800 hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};
