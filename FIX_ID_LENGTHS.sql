-- ============================================================================
-- V.I.R.A. — Migration Script: Fix Column Types & Add Missing Columns
-- Purpose: Fix "value too long for type character varying(10)" errors
--          occurring when new items are added from the admin panel.
-- Run this in Supabase SQL Editor (Project → SQL Editor → New Query)
-- ============================================================================

-- ── STEP 1: Expand ID columns to VARCHAR(30) ──────────────────────────────────
ALTER TABLE events           ALTER COLUMN id TYPE VARCHAR(30);
ALTER TABLE history          ALTER COLUMN id TYPE VARCHAR(30);
ALTER TABLE facilities       ALTER COLUMN id TYPE VARCHAR(30);
ALTER TABLE campus_guide     ALTER COLUMN id TYPE VARCHAR(30);
ALTER TABLE content_tags     ALTER COLUMN content_id TYPE VARCHAR(30);
ALTER TABLE tts_usage_logs   ALTER COLUMN content_id TYPE VARCHAR(30);
ALTER TABLE navigation_data  ALTER COLUMN campus_guide_id TYPE VARCHAR(30);
ALTER TABLE navigation_data  ALTER COLUMN facility_id TYPE VARCHAR(30);

-- ── STEP 2: Add event_time column to events table (if not already present) ────
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_time TIME;

-- ── STEP 3: Verify changes (optional — run in SQL editor to confirm) ──────────
-- SELECT table_name, column_name, character_maximum_length, data_type
-- FROM information_schema.columns
-- WHERE table_name IN ('events', 'history', 'facilities', 'campus_guide')
--   AND column_name IN ('id', 'event_time')
-- ORDER BY table_name, column_name;

-- ============================================================================
-- Migration Complete. Run this ONCE in Supabase SQL Editor.
-- ============================================================================
