import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Menu, X, PlusCircle, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, isDemoUser, signOut, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoLaunch = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isAuthPage = location.pathname.startsWith('/auth');

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/90 backdrop-blur-md border-b border-ivory-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-soft group-hover:bg-forest-700 transition-colors">
              <Compass className="w-5 h-5 text-coral-400 transform group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-forest-900 leading-none">
                Tripora
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-coral-600 mt-1">
                Your Journey, Your Way
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
              <Link to="/sample" className="hover:text-forest-800 transition-colors">
                Sample Itinerary
              </Link>
              <a href="/#how-it-works" className="hover:text-forest-800 transition-colors">
                How It Works
              </a>
              <a href="/#features" className="hover:text-forest-800 transition-colors">
                Features
              </a>
              <a href="/#faq" className="hover:text-forest-800 transition-colors">
                FAQ
              </a>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/builder">
                  <Button variant="primary" size="sm" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    <span>Plan New Trip</span>
                  </Button>
                </Link>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-ivory-300 hover:border-ivory-400 bg-white transition-all text-xs font-semibold text-forest-900"
                  >
                    <div className="w-7 h-7 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                    {isDemoUser && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-coral-100 text-coral-800 font-bold">
                        DEMO
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-ink-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-elevated border border-ivory-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 py-2 border-b border-ivory-100">
                        <p className="text-xs text-ink-500">Signed in as</p>
                        <p className="text-xs font-semibold text-ink-900 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-ink-700 hover:bg-ivory-100 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Settings & Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleDemoLaunch}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-coral-700 bg-coral-50 border border-coral-200 hover:bg-coral-100 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                  <span>Interactive Demo</span>
                </button>
                <Link to="/auth/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button variant="primary" size="sm">
                    Start Planning
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-ink-700 hover:bg-ivory-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-ivory-200 bg-ivory-50 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/sample"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-ink-800 hover:bg-ivory-100"
          >
            Sample Itinerary
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-ink-800 hover:bg-ivory-100"
          >
            How It Works
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-medium text-ink-800 hover:bg-ivory-100"
          >
            Features
          </a>
          <div className="pt-3 border-t border-ivory-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-forest-800 hover:bg-ivory-100 rounded-xl"
                >
                  Dashboard
                </Link>
                <Link
                  to="/builder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-forest-800 hover:bg-ivory-100 rounded-xl"
                >
                  Plan New Trip
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ivory-100 rounded-xl"
                >
                  Profile & Settings
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDemoLaunch();
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-coral-700 bg-coral-50 border border-coral-200"
                >
                  Try Interactive Demo
                </button>
                <Link
                  to="/auth/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-ink-800 border border-ivory-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-forest-800"
                >
                  Start Planning
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
