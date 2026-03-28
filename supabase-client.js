// ============================================================================
// V.I.R.A. — Supabase Client Configuration
// ============================================================================
// SETUP INSTRUCTIONS:
//   1. Go to https://supabase.com/dashboard → Your Project → Settings → API
//   2. Copy your "Project URL" and paste it as SUPABASE_URL below
//   3. Copy your "anon / public" key and paste it as SUPABASE_ANON_KEY below
//   4. Make sure you ran DATABASE_SCHEMA.sql in the SQL Editor first
// ============================================================================

const SUPABASE_URL      = 'https://hqcsvrtpetlxceyxtgmn.supabase.co';  // ← your project URL
const SUPABASE_ANON_KEY = 'sb_publishable_AzmKL4Ia44oBDqprjXrpPQ_G72beZHm'; // ← publishable key

// ============================================================================
// DO NOT EDIT BELOW THIS LINE
// ============================================================================

// Load Supabase JS client from CDN (ESM shim for non-module HTML pages)
(function () {
    if (typeof window.__supabaseReady !== 'undefined') return;
    window.__supabaseReady = false;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
    script.onload = () => {
        window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.__supabaseReady = true;
        document.dispatchEvent(new Event('supabase:ready'));
        console.log('[V.I.R.A.] ✅ Supabase connected:', SUPABASE_URL);
    };
    script.onerror = () => {
        console.error('[V.I.R.A.] ❌ Failed to load Supabase JS. Check your internet connection.');
    };
    document.head.appendChild(script);
})();

/**
 * Wait for Supabase to be ready, then call the callback.
 * @param {Function} cb
 */
function onSupabaseReady(cb) {
    if (window.__supabaseReady) { cb(); return; }
    document.addEventListener('supabase:ready', cb, { once: true });
}
