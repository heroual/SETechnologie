// This file is kept for reference but no longer used
// The application now uses Firebase instead of Supabase

console.warn('Supabase is no longer used in this project. Please use Firebase services instead.');

// Mock client to prevent errors
export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    signInWithPassword: async () => ({ error: new Error('Supabase is not configured') }),
    signOut: async () => ({ error: null })
  }
};