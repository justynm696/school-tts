import { writable, get } from 'svelte/store';
import { supabase } from './supabase';
import { schoolData } from './data';

// ── Shared Stores ─────────────────────────────────────────
export const viraData = writable({
    events: [],
    history: [],
    facilities: [],
    campus_guide: []
});

export const departments = writable([]);
export const isReady = writable(false);

const TABLE_MAP = {
    events:       'events',
    history:      'history',
    facilities:   'facilities',
    campus_guide: 'campus_guide'
};

// ── Private Helpers ────────────────────────────────────────
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

function _toDbRow(section, item) {
    const row = {
        id:       item.id,
        title:    item.title,
        content:  item.content,
        category: item.category,
        priority: item.priority || 'medium',
        icon:     item.icon || '📄',
        is_active: true,
        dept_id:  item.dept_id || 'general'
    };
    if (section === 'events')       row.event_date      = item.date || null;
    if (section === 'history') {
        row.milestone_date = item.date || null;
        delete row.dept_id;
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

function _loadFallback() {
    console.warn('[ViraDB] Using localStorage/data.js fallback.');
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('vira_data');
        if (saved) {
            try { viraData.set(JSON.parse(saved)); } 
            catch { viraData.set(JSON.parse(JSON.stringify(schoolData))); }
        } else {
            viraData.set(JSON.parse(JSON.stringify(schoolData)));
        }
    } else {
        viraData.set(JSON.parse(JSON.stringify(schoolData)));
    }
    isReady.set(true);
}

// ── Public API ────────────────────────────────────────────

/**
 * Load all data from Supabase with fallback to local defaults
 */
export async function loadData() {
    try {
        const results = await Promise.all(
            Object.entries(TABLE_MAP).map(async ([section, table]) => {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                return { section, rows: (data || []).map(r => _normalizeRow(section, r)) };
            })
        );

        const newCache = {};
        results.forEach(({ section, rows }) => {
            newCache[section] = rows;
        });
        viraData.set(newCache);

        // Load departments
        const { data: deptData } = await supabase
            .from('departments')
            .select('*')
            .eq('is_active', true)
            .order('name');
        departments.set(deptData || []);

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('vira_data', JSON.stringify(newCache));
        }

        isReady.set(true);
        console.log('[ViraDB] ✅ Data loaded from Supabase');
        return newCache;

    } catch (err) {
        console.error('[ViraDB] ❌ Supabase load failed:', err.message);
        _loadFallback();
        return get(viraData);
    }
}

/**
 * Upsert content to Supabase
 */
export async function saveData(section, item) {
    const table = TABLE_MAP[section];
    const row = _toDbRow(section, item);

    const { error } = await supabase
        .from(table)
        .upsert(row, { onConflict: 'id' });

    if (error) throw error;

    // Update local cache
    const currentData = get(viraData);
    const idx = currentData[section].findIndex(x => x.id === item.id);
    const normalized = _normalizeRow(section, row);
    
    if (idx >= 0) {
        currentData[section][idx] = { ...currentData[section][idx], ...normalized };
    } else {
        currentData[section].unshift(normalized);
    }
    viraData.set(currentData);
    
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vira_data', JSON.stringify(currentData));
    }
    
    return normalized;
}

/**
 * Soft delete content in Supabase
 */
export async function removeData(section, id) {
    const table = TABLE_MAP[section];
    
    const { error } = await supabase
        .from(table)
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;

    const currentData = get(viraData);
    currentData[section] = currentData[section].filter(x => x.id !== id);
    viraData.set(currentData);
    
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vira_data', JSON.stringify(currentData));
    }
}

export async function logSearch(query, resultsCount = 0, type = 'text') {
    if (!query) return;
    try {
        await supabase.from('search_logs').insert({
            search_query:  query,
            results_count: resultsCount,
            search_type:   type
        });
    } catch { /* silent */ }
}

export async function logTTS(contentType, contentId, voiceId = null, speechRate = 1.0, duration = 0) {
    try {
        await supabase.from('tts_usage_logs').insert({
            content_type:     contentType,
            content_id:       contentId,
            voice_id:         voiceId,
            speech_rate:      speechRate,
            duration_seconds: Math.round(duration)
        });
    } catch { /* silent */ }
}
