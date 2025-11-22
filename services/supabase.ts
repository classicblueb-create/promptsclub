
import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars without crashing if process is undefined
const getEnv = (key: string, fallback: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }
  } catch (e) {
    // Ignore error
  }
  return fallback;
};

// Default to placeholder if not set. This ensures the app doesn't crash on boot,
// but will fail gracefully to Mock Data if these are invalid.
const supabaseUrl = getEnv('SUPABASE_URL', 'https://olwlqimwtroudvwmyyny.supabase.co');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sd2xxaW13dHJvdWR2d215eW55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MjUwODksImV4cCI6MjA3OTEwMTA4OX0.zT26CI_AcOjLWNr96S-_hKk4UjtkSx7JZVc3Qonh-bg');

console.log(`Initializing Supabase client...`);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
