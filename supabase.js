// Set these to the Project URL and public anon/publishable key from Supabase.
// Never put a service-role key in browser code.
window.CAMPUSCASH_SUPABASE_URL = window.CAMPUSCASH_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
window.CAMPUSCASH_SUPABASE_ANON_KEY = window.CAMPUSCASH_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY';

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
