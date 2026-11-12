// Set these to the Project URL and public anon/publishable key from Supabase.
// Never put a service-role key in browser code.
window.CAMPUSCASH_SUPABASE_URL = window.CAMPUSCASH_SUPABASE_URL || 'https://jphbjbspmifkxcgudquv.supabase.co';
window.CAMPUSCASH_SUPABASE_ANON_KEY = window.CAMPUSCASH_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwaGJqYnNwbWlma3hjZ3VkcXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyODM0MzAsImV4cCI6MjEwOTg1OTQzMH0.WXwoEKJgs9QUcyyPIe5pXUOanFngc-iw1R4reDdgVPQ';

window.createCampusCashClient = function (storageName) {
  const url = window.CAMPUSCASH_SUPABASE_URL;
  const key = window.CAMPUSCASH_SUPABASE_ANON_KEY;
  if (!url || url.includes('YOUR_PROJECT_ID') || !key || key.includes('YOUR_SUPABASE')) {
    throw new Error('Supabase is not configured. Add your project URL and public anon/publishable key in supabase.js.');
  }
  const storage = storageName === 'sessionStorage' ? window.sessionStorage : window.localStorage;
  return window.supabase.createClient(url, key, {
    auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, storage }
  });
};
