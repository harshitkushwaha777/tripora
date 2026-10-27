import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) {
      setErrorMessage(error.message || 'Failed to sign in. Please verify your credentials.');
    } else {
      navigate('/dashboard');
    }
  };

  const handleDemoSignIn = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory-50">
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
            Welcome Back
          </h2>
          <p className="text-xs text-ink-600">
            Sign in to access your customized itineraries and travel blueprints.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div className="p-3.5 rounded-2xl bg-coral-50 border border-coral-200 text-center space-y-2">
          <p className="text-xs text-coral-900 font-semibold">
            Want to test without creating an account?
          </p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-coral-500 hover:bg-coral-600 active:bg-coral-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Instant Demo Access (Elena Rostova)</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-ivory-200 w-full" />
          <span className="bg-white px-3 text-xs text-ink-400 uppercase tracking-wider font-medium absolute">
            or sign in with email
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-ink-700">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-coral-600 hover:text-coral-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-ivory-50 border border-ivory-200 rounded-xl text-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full text-xs font-semibold py-3"
          >
            Sign In to Tripora
          </Button>
        </form>

        <p className="text-center text-xs text-ink-600">
          Don't have an account yet?{' '}
          <Link to="/auth/sign-up" className="font-semibold text-forest-800 hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};
