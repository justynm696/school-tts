# V.I.R.A. — Supabase Backend Setup Guide

## Step 1: Run the Database Schema

1. Open your Supabase project → **SQL Editor**
2. Paste the full contents of `DATABASE_SCHEMA.sql`
3. Click **Run** — all tables, views, functions, and triggers will be created

---

## Step 2: Configure Row Level Security (RLS)

Run this in the **SQL Editor** to secure your tables:

```sql
-- Enable RLS on all content tables
ALTER TABLE events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE history      ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities   ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) READ access to active content
CREATE POLICY "Public read events"       ON events       FOR SELECT USING (is_active = true);
CREATE POLICY "Public read history"      ON history      FOR SELECT USING (is_active = true);
CREATE POLICY "Public read facilities"   ON facilities   FOR SELECT USING (is_active = true);
CREATE POLICY "Public read campus_guide" ON campus_guide FOR SELECT USING (is_active = true);
CREATE POLICY "Public read navigation"   ON navigation_data FOR SELECT USING (is_active = true);

-- Allow anon to INSERT into analytics tables (search logs, TTS logs)
CREATE POLICY "Anon insert search_logs"    ON search_logs    FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert tts_usage_logs" ON tts_usage_logs FOR INSERT WITH CHECK (true);

-- Allow anon to INSERT/UPDATE/DELETE content (admin panel uses anon key)
-- If you want to restrict writes to authenticated users only, remove these:
CREATE POLICY "Anon write events"       ON events       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write history"      ON history      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write facilities"   ON facilities   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write campus_guide" ON campus_guide FOR ALL USING (true) WITH CHECK (true);
```

---

## Step 3: Set Your Supabase Credentials

Open `supabase-client.js` and set:

```js
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key-here';
```

Find these at: **Supabase Dashboard → Settings → API**

---

## Step 4: Test the Connection

1. Open `index.html` in a browser (via live server or deployed URL)
2. Open **DevTools → Console**
3. You should see:
   ```
   [V.I.R.A.] ✅ Supabase connected: https://...supabase.co
   [ViraDB] ✅ Data loaded from Supabase: { events: 4, history: 15, ... }
   ```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Frontend)                    │
│                                                          │
│  index.html / admin.html                                 │
│       │                                                  │
│  supabase-client.js  ──── loads Supabase JS from CDN    │
│       │                   creates window._supabase       │
│       ▼                                                  │
│  db.js (ViraDB)      ──── data access layer             │
│       │               ├── ViraDB.load()   → SELECT       │
│       │               ├── ViraDB.save()   → UPSERT       │
│       │               ├── ViraDB.remove() → soft-DELETE  │
│       │               └── ViraDB.logSearch/TTS → INSERT  │
│       ▼                                                  │
│  data.js             ──── hardcoded fallback data        │
│  app.js              ──── main UI (reads window.viRAData)│
│  admin.js            ──── CMS UI (reads/writes adminData)│
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / REST API
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Supabase (PostgreSQL)                    │
│                                                          │
│  Tables: events, history, facilities, campus_guide       │
│          navigation_data, search_logs, tts_usage_logs    │
│  Views:  active_events, popular_facilities, etc.         │
│  Functions: search_content(), get_floor_navigation()     │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

| Action | What happens |
|--------|-------------|
| App loads | `ViraDB.load()` fetches all tables from Supabase → stores in `window.viRAData` |
| User searches | App reads from `window.viRAData` (in-memory, instant) |
| Admin adds item | `admin.js` → `ViraDB.save()` → Supabase `UPSERT` |
| Admin deletes item | `admin.js` → `ViraDB.remove()` → sets `is_active = false` in Supabase |
| User clicks Listen | TTS plays; `ViraDB.logTTS()` records usage analytics |
| User searches | `ViraDB.logSearch()` records query analytics |
| Supabase offline | Falls back to `localStorage` → then to hardcoded `data.js` |

---

## File Summary

| File | Purpose |
|------|---------|
| `DATABASE_SCHEMA.sql` | PostgreSQL schema for Supabase |
| `supabase-client.js` | Supabase connection config & CDN loader |
| `db.js` | ViraDB — data access layer (load/save/remove/analytics) |
| `data.js` | Hardcoded fallback data + `window.viRAData` shim |
| `app.js` | Main frontend UI |
| `admin.js` | Admin CMS panel |
