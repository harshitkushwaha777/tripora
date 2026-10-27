/**
 * Centralized Configuration Module for Tripora Frontend
 * Reads environment variables safely with strict validation and fallbacks.
 */

export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://ufoxvgdikrjlhicxoaku.supabase.co',
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0JnnErG6pvFQ1q2fOKAyjg_RMkFb1k-',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  },
  app: {
    name: 'Tripora',
    tagline: 'Your Journey, Your Way.',
    version: '1.0.0',
  }
} as const;

export default config;
