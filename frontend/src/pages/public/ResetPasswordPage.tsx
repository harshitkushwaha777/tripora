import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically handles the token in the URL hash/query
    // and sets a session when the user lands on this page from the email link.
    // We listen for the PASSWORD_RECOVERY event or just check the session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setValidSession(true);
        setCheckingSession(false);
      }
    });

    // Also check existing session (in case event already fired)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true);
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage('Please fill in both password fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Failed to reset password. Try requesting a new reset link.');
    } else {
      setSuccessMessage('Password updated successfully! Redirecting to sign in...');
      setTimeout(() => navigate('/auth/sign-in'), 2500);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-ivory-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-800" />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-ivory-50">
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
            Set New Password
          </h2>
          <p className="text-xs text-ink-600">
            Choose a strong password for your Tripora account.
          </p>
        </div>

        {/* Invalid session state */}
        {!validSession && !successMessage && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-center">
            <p className="text-xs font-semibold text-amber-800">Reset link expired or already used</p>
            <p className="text-xs text-amber-700">Reset links are single-use and expire after 1 hour.</p>
            <Link
              to="/auth/forgot-password"
              className="inline-block mt-1 text-xs font-bold text-forest-800 underline hover:text-forest-900"
            >
              Request a new reset link →
            </Link>
          </div>
        )}

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

        {/* Form — only show if valid session */}
        {validSession && !successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                New Password
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

            <div>
              <label className="block text-xs font-semibold text-ink-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
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
              Update Password
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link
            to="/auth/sign-in"
            className="text-xs font-semibold text-forest-800 hover:underline"
          >
            ← Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
