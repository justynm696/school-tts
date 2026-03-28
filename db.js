// ============================================================================
// V.I.R.A. — Database Access Layer (Supabase ↔ App Bridge)
// ============================================================================
// This file replaces localStorage-based data access with real Supabase calls.
// It provides:
//   - ViraDB.load()           → fetch all content from Supabase
//   - ViraDB.save(section, item)  → upsert a content row
//   - ViraDB.remove(section, id) → delete a content row
//   - ViraDB.getAll()         → return the in-memory cache
//   - ViraDB.logSearch(query, count, type)  → analytics
//   - ViraDB.logTTS(userId, type, id, voice, rate, duration) → TTS analytics
//
// Falls back to localStorage (data.js defaults) if Supabase is unavailable.
// ============================================================================

'use strict';

const ViraDB = (() => {

    // ── Internal cache ──────────────────────────────────────
    let _cache = {
        events:      [],
        history:     [],
        facilities:  [],
        campus_guide: []
    };
    let _departments = [];

    let _ready = false;
    const _listeners = [];

    // ── Table → Supabase table name map ───────────────────
    const TABLE_MAP = {
        events:       'events',
        history:      'history',
        facilities:   'facilities',
        campus_guide: 'campus_guide'
    };

    // ── Normalize a row from Supabase to match app's expected format ──
    function _normalizeRow(section, row) {
        const base = {
            id:       row.id,
            title:    row.title,
            content:  row.content,
            category: row.category,
            priority: row.priority,
            icon:     row.icon || '📄',
            dept_id:  row.dept_id || null,
        };
        if (section === 'events')  base.date = row.event_date;
        if (section === 'history') base.date = row.milestone_date;
        if (section === 'facilities') {
            base.capacity        = row.capacity;
            base.operating_hours = row.operating_hours;
            base.date            = row.created_at ? row.created_at.split('T')[0] : null;
        }
        if (section === 'campus_guide') {
            base.floor_number = row.floor_number;
            base.date         = row.created_at ? row.created_at.split('T')[0] : null;
        }
        return base;
    }

    // ── Normalize app object → Supabase column names ──────
    function _toDbRow(section, item) {
        const row = {
            id:       item.id,
            title:    item.title,
            content:  item.content,
            category: item.category,
            priority: item.priority || 'medium',
            icon:     item.icon || '📄',
            is_active: true,
            dept_id:  item.dept_id || 'general'  // FK → departments.id
        };
        if (section === 'events')       row.event_date      = item.date || null;
        if (section === 'history') {
            row.milestone_date = item.date || null;
            delete row.dept_id;   // history has no dept_id column
        }
        if (section === 'facilities') {
            row.capacity        = item.capacity || null;
            row.operating_hours = item.operating_hours || null;
        }
        if (section === 'campus_guide') {
            row.floor_number = item.floor_number || null;
        }
        return row;
    }

    // ── Fallback: load from localStorage / data.js ─────────
    function _loadFallback() {
        console.warn('[ViraDB] Using localStorage/data.js fallback.');
        const saved = localStorage.getItem('vira_data');
        if (saved) {
            try { _cache = JSON.parse(saved); } catch { _cache = _defaultCache(); }
        } else if (typeof schoolData !== 'undefined') {
            _cache = JSON.parse(JSON.stringify(schoolData));
        } else {
            _cache = _defaultCache();
        }
        _ready = true;
        _notify();
    }

    function _defaultCache() {
        return { events: [], history: [], facilities: [], campus_guide: [] };
    }

    // ── Notify all waiters ────────────────────────────────
    function _notify() {
        window.viRAData = _cache;                      // keep global shim alive
        _listeners.forEach(fn => fn(_cache));
        _listeners.length = 0;
        document.dispatchEvent(new CustomEvent('viradb:ready', { detail: _cache }));
    }

    // ── PUBLIC: load all content from Supabase ────────────
    async function load() {
        if (!window.__supabaseReady) {
            // Supabase not yet loaded — wait briefly or fall back
            await new Promise(resolve => {
                const t = setTimeout(() => resolve(), 5000);
                document.addEventListener('supabase:ready', () => { clearTimeout(t); resolve(); }, { once: true });
            });
        }

        if (!window._supabase) {
            _loadFallback();
            return _cache;
        }

        const db = window._supabase;

        try {
            const results = await Promise.all(
                Object.entries(TABLE_MAP).map(async ([section, table]) => {
                    const { data, error } = await db
                        .from(table)
                        .select('*')
                        .eq('is_active', true)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    return { section, rows: (data || []).map(r => _normalizeRow(section, r)) };
                })
            );

            results.forEach(({ section, rows }) => {
                _cache[section] = rows;
            });

            // Also load departments
            const { data: deptData } = await db
                .from('departments')
                .select('*')
                .eq('is_active', true)
                .order('name');
            _departments = deptData || [];

            // Mirror to localStorage so admin.js / data.js fallback still works
            localStorage.setItem('vira_data', JSON.stringify(_cache));

            _ready = true;
            _notify();
            console.log('[ViraDB] ✅ Data loaded from Supabase:', {
                events:      _cache.events.length,
                history:     _cache.history.length,
                facilities:  _cache.facilities.length,
                campus_guide: _cache.campus_guide.length
            });

        } catch (err) {
            console.error('[ViraDB] ❌ Supabase load failed, using fallback:', err.message);
            _loadFallback();
        }

        return _cache;
    }

    // ── PUBLIC: upsert a content item ─────────────────────
    async function save(section, item) {
        const table = TABLE_MAP[section];
        if (!table) throw new Error('Unknown section: ' + section);

        const row = _toDbRow(section, item);

        if (window._supabase) {
            const { error } = await window._supabase
                .from(table)
                .upsert(row, { onConflict: 'id' });

            if (error) throw error;
        }

        // Update local cache
        const idx = _cache[section].findIndex(x => x.id === item.id);
        const normalized = _normalizeRow(section, row);
        if (idx >= 0) {
            _cache[section][idx] = { ..._cache[section][idx], ...normalized };
        } else {
            _cache[section].unshift(normalized);
        }

        // Sync localStorage
        localStorage.setItem('vira_data', JSON.stringify(_cache));
        window.viRAData = _cache;

        return normalized;
    }

    // ── PUBLIC: delete a content item ─────────────────────
    async function remove(section, id) {
        const table = TABLE_MAP[section];
        if (!table) throw new Error('Unknown section: ' + section);

        if (window._supabase) {
            const { error } = await window._supabase
                .from(table)
                .update({ is_active: false })
                .eq('id', id);

            if (error) throw error;
        }

        // Remove from cache
        _cache[section] = _cache[section].filter(x => x.id !== id);
        localStorage.setItem('vira_data', JSON.stringify(_cache));
        window.viRAData = _cache;
    }

    // ── PUBLIC: get in-memory cache ────────────────────────
    function getAll() { return _cache; }

    // ── PUBLIC: get departments list ──────────────────────
    function getDepartments() { return _departments; }

    // ── PUBLIC: wait for data ready ────────────────────────
    function onReady(fn) {
        if (_ready) { fn(_cache); return; }
        _listeners.push(fn);
    }

    // ── PUBLIC: log a search query ─────────────────────────
    async function logSearch(query, resultsCount = 0, type = 'text') {
        if (!window._supabase || !query) return;
        try {
            await window._supabase.from('search_logs').insert({
                search_query:  query,
                results_count: resultsCount,
                search_type:   type
            });
        } catch { /* analytics failures are silent */ }
    }

    // ── PUBLIC: log TTS usage ──────────────────────────────
    async function logTTS(contentType, contentId, voiceId = null, speechRate = 1.0, duration = 0) {
        if (!window._supabase) return;
        try {
            await window._supabase.from('tts_usage_logs').insert({
                content_type:     contentType,
                content_id:       contentId,
                voice_id:         voiceId,
                speech_rate:      speechRate,
                duration_seconds: Math.round(duration)
            });
        } catch { /* silent */ }
    }

    // ── PUBLIC: Admin — load/save accounts via Supabase ──
    // Accounts are still in localStorage (no user accounts table needed for MVP)
    // This can be extended later with Supabase Auth.

    return { load, save, remove, getAll, getDepartments, onReady, logSearch, logTTS };
})();

// ── Global assignment so legacy code still works ─────────
window.ViraDB = ViraDB;
