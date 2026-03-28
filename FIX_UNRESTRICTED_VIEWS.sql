-- ============================================================================
-- FIX: UNRESTRICTED warnings in Supabase Table Editor
-- Run this in the Supabase SQL Editor (not the full schema reset)
-- ============================================================================
-- Root cause: Views default to SECURITY DEFINER mode (run as owner, bypass RLS).
-- Fix: Recreate all views with security_invoker = true so they respect
--      the calling user's RLS policies on the underlying tables.
-- ============================================================================

-- Step 1: Drop the old views (order matters for dependencies)
DROP VIEW IF EXISTS active_events       CASCADE;
DROP VIEW IF EXISTS popular_facilities  CASCADE;
DROP VIEW IF EXISTS navigation_by_floor CASCADE;
DROP VIEW IF EXISTS search_analytics    CASCADE;
DROP VIEW IF EXISTS dept_content_summary CASCADE;
DROP VIEW IF EXISTS tts_analytics       CASCADE;

-- Step 2: Ensure search_logs table RLS is active (in case it was missed)
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Step 3: Recreate views with security_invoker = true
-- This makes the view run under the CALLER's permissions, so Supabase RLS
-- policies on the underlying tables are respected, clearing UNRESTRICTED.

-- View 1: Upcoming active events with department info
CREATE VIEW active_events WITH (security_invoker = true) AS
SELECT
    e.id, e.title, e.content, e.event_date,
    e.category, e.priority, e.icon,
    d.name  AS department_name,
    d.icon  AS department_icon,
    d.color AS department_color,
    u.name  AS created_by_name
FROM events e
JOIN departments d ON e.dept_id = d.id
LEFT JOIN admin_users u ON e.created_by = u.id
WHERE e.is_active = TRUE AND e.event_date >= CURRENT_DATE
ORDER BY e.event_date ASC, e.priority DESC;

-- View 2: Facilities with usage count and department info
CREATE VIEW popular_facilities WITH (security_invoker = true) AS
SELECT
    f.id, f.title, f.category, f.icon,
    d.name  AS department_name,
    d.color AS department_color,
    COUNT(t.id) AS tts_play_count
FROM facilities f
JOIN departments d ON f.dept_id = d.id
LEFT JOIN tts_usage_logs t ON f.id = t.content_id AND t.content_type = 'facility'
WHERE f.is_active = TRUE
GROUP BY f.id, f.title, f.category, f.icon, d.name, d.color
ORDER BY tts_play_count DESC;

-- View 3: Navigation summary per floor with linked guide info
CREATE VIEW navigation_by_floor WITH (security_invoker = true) AS
SELECT
    nd.floor,
    COUNT(nd.id)                                AS location_count,
    STRING_AGG(DISTINCT nd.type, ', ' ORDER BY nd.type) AS types,
    STRING_AGG(DISTINCT cg.title, ' | ')        AS linked_guide_titles
FROM navigation_data nd
LEFT JOIN campus_guide cg ON nd.campus_guide_id = cg.id
WHERE nd.is_active = TRUE
GROUP BY nd.floor
ORDER BY nd.floor;

-- View 4: Search analytics ranked by frequency
CREATE VIEW search_analytics WITH (security_invoker = true) AS
SELECT
    search_query,
    COUNT(*)           AS search_count,
    AVG(results_count) AS avg_results,
    MAX(created_at)    AS last_searched,
    COUNT(DISTINCT user_id) AS unique_users
FROM search_logs
GROUP BY search_query
ORDER BY search_count DESC;

-- View 5: Department content summary
CREATE VIEW dept_content_summary WITH (security_invoker = true) AS
SELECT
    d.id AS dept_id, d.name, d.icon, d.color,
    COUNT(DISTINCT e.id)  AS event_count,
    COUNT(DISTINCT f.id)  AS facility_count,
    COUNT(DISTINCT cg.id) AS guide_count
FROM departments d
LEFT JOIN events        e  ON e.dept_id  = d.id AND e.is_active  = TRUE
LEFT JOIN facilities    f  ON f.dept_id  = d.id AND f.is_active  = TRUE
LEFT JOIN campus_guide  cg ON cg.dept_id = d.id AND cg.is_active = TRUE
GROUP BY d.id, d.name, d.icon, d.color
ORDER BY d.name;

-- View 6: TTS analytics by content type
CREATE VIEW tts_analytics WITH (security_invoker = true) AS
SELECT
    content_type,
    COUNT(*)                        AS play_count,
    AVG(duration_seconds)           AS avg_duration_sec,
    COUNT(DISTINCT user_id)         AS unique_listeners,
    vs.name                         AS most_used_voice
FROM tts_usage_logs t
LEFT JOIN voice_settings vs ON t.voice_id = vs.voice_id
GROUP BY content_type, vs.name
ORDER BY play_count DESC;

-- ============================================================================
-- Done! Refresh the Supabase Table Editor — UNRESTRICTED badges should be gone.
-- ============================================================================
