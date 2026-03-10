/* ============================================================
   V.I.R.A. Admin Panel — admin.js
   Full CRUD + localStorage persistence + Dashboard
   ============================================================ */

'use strict';

// ─── CONSTANTS ─────────────────────────────────────────────
const LS_DATA_KEY  = 'vira_data';
const LS_PIN_KEY   = 'vira_admin_pin';
const DEFAULT_PIN  = '1234';

// ─── STATE ─────────────────────────────────────────────────
let adminData   = {};   // working copy of all data
let currentPage = 'dashboard';
let editTarget  = null; // { section, id } or null
let confirmCb   = null; // callback for confirm dialog

// ─── BOOT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
});

// ─── LOGIN ─────────────────────────────────────────────────
function setupLogin() {
    const overlay  = document.getElementById('loginOverlay');
    const pinInput = document.getElementById('pinInput');
    const loginBtn = document.getElementById('loginBtn');
    const errEl    = document.getElementById('loginError');

    // Auto-focus
    pinInput.focus();
    pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });
    loginBtn.addEventListener('click', attemptLogin);

    function attemptLogin() {
        const pin = pinInput.value.trim();
        const savedPin = localStorage.getItem(LS_PIN_KEY) || DEFAULT_PIN;
        if (pin === savedPin) {
            overlay.classList.add('hidden');
            setTimeout(() => { overlay.style.display = 'none'; }, 400);
            initAdmin();
        } else {
            errEl.textContent = 'Incorrect PIN. Try again.';
            pinInput.value = '';
            pinInput.focus();
            setTimeout(() => { errEl.textContent = ''; }, 2500);
        }
    }
}

// ─── INIT ──────────────────────────────────────────────────
function initAdmin() {
    loadData();
    setupNav();
    setupHamburger();
    setupTopbar();
    setupSearches();
    setupAddButtons();
    setupModalButtons();
    setupConfirmButtons();
    setupSettings();
    renderAll();
    goToPage('dashboard');
}

// ─── DATA LOAD / SAVE ──────────────────────────────────────
function loadData() {
    const saved = localStorage.getItem(LS_DATA_KEY);
    if (saved) {
        adminData = JSON.parse(saved);
        // Ensure all sections exist
        ['events', 'history', 'facilities', 'campus_guide'].forEach(s => {
            if (!adminData[s]) adminData[s] = [];
        });
    } else {
        // Deep-clone the default schoolData from data.js
        adminData = JSON.parse(JSON.stringify(schoolData));
    }
}

function saveData() {
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(adminData));
}

function getSection(section) {
    return adminData[section] || [];
}

// ─── NAVIGATION ────────────────────────────────────────────
function setupNav() {
    document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
        btn.addEventListener('click', () => goToPage(btn.dataset.page));
    });
}

function goToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.remove('active'));

    currentPage = page;
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');

    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');

    // Update topbar title
    const titles = {
        dashboard:    'Dashboard',
        events:       'Events',
        history:      'History',
        facilities:   'Facilities',
        campus_guide: 'Campus Guide',
        settings:     'Settings'
    };
    document.getElementById('topbarTitle').textContent = titles[page] || page;

    // Show/hide add button in topbar
    const addBtn = document.getElementById('topbarAddBtn');
    const contentPages = ['events','history','facilities','campus_guide'];
    addBtn.style.display = contentPages.includes(page) ? 'inline-flex' : 'none';

    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 900) sidebar.classList.remove('open');

    // Render current section
    if (page === 'dashboard') renderDashboard();
    else if (contentPages.includes(page)) renderSection(page);
}

// ─── HAMBURGER ─────────────────────────────────────────────
function setupHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    // Close on outside click
    document.addEventListener('click', e => {
        if (window.innerWidth < 900 &&
            sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            e.target !== btn) {
            sidebar.classList.remove('open');
        }
    });
}

// ─── TOPBAR ────────────────────────────────────────────────
function setupTopbar() {
    document.getElementById('exportBtn').addEventListener('click', exportJSON);
    document.getElementById('topbarAddBtn').addEventListener('click', () => {
        openAddModal(currentPage);
    });
}

// ─── SEARCH ────────────────────────────────────────────────
function setupSearches() {
    ['events','history','facilities','campus_guide'].forEach(sec => {
        const el = document.getElementById('search-' + sec);
        if (el) el.addEventListener('input', () => renderSection(sec));
    });
}

// ─── ADD BUTTONS ───────────────────────────────────────────
function setupAddButtons() {
    ['events','history','facilities','campus_guide'].forEach(sec => {
        const btn = document.getElementById('add' + sec.split('_').map(capitalize).join('') + 'Btn');
        if (btn) btn.addEventListener('click', () => openAddModal(sec));
    });
}

// ─── MODAL ─────────────────────────────────────────────────
function setupModalButtons() {
    const overlay   = document.getElementById('modalOverlay');
    const closeBtn  = document.getElementById('modalCloseBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const saveBtn   = document.getElementById('modalSaveBtn');

    const close = () => overlay.classList.remove('open');
    closeBtn.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    saveBtn.addEventListener('click', handleModalSave);
}

function openAddModal(section) {
    editTarget = { section, id: null };
    document.getElementById('modalTitle').textContent = `Add ${sectionLabel(section)}`;
    document.getElementById('modalBody').innerHTML = buildForm(section, null);
    document.getElementById('modalSaveBtn').textContent = '💾 Save';
    document.getElementById('modalOverlay').classList.add('open');
}

function openEditModal(section, id) {
    const item = getSection(section).find(x => x.id === id);
    if (!item) return;
    editTarget = { section, id };
    document.getElementById('modalTitle').textContent = `Edit ${sectionLabel(section)}`;
    document.getElementById('modalBody').innerHTML = buildForm(section, item);
    document.getElementById('modalSaveBtn').textContent = '💾 Update';
    document.getElementById('modalOverlay').classList.add('open');
}

function handleModalSave() {
    if (!editTarget) return;
    const { section, id } = editTarget;
    const formData = readForm(section);

    if (!formData.title || !formData.title.trim()) {
        showToast('Title is required.', 'error');
        return;
    }

    if (id === null) {
        // Add new
        formData.id = section.substring(0,3) + Date.now();
        adminData[section].push(formData);
        showToast(`✅ New ${sectionLabel(section)} added!`, 'success');
    } else {
        // Edit existing
        const idx = adminData[section].findIndex(x => x.id === id);
        if (idx >= 0) adminData[section][idx] = { ...adminData[section][idx], ...formData };
        showToast(`✏️ ${sectionLabel(section)} updated!`, 'success');
    }

    saveData();
    document.getElementById('modalOverlay').classList.remove('open');
    renderAll();
    renderSection(section);
    renderDashboard();
}

// ─── CONFIRM DIALOG ────────────────────────────────────────
function setupConfirmButtons() {
    document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirm);
    document.getElementById('confirmOkBtn').addEventListener('click', () => {
        if (confirmCb) confirmCb();
        closeConfirm();
    });
}

function openConfirm(title, msg, okLabel, cb, btnClass = 'danger') {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMsg').textContent = msg;
    const okBtn = document.getElementById('confirmOkBtn');
    okBtn.textContent = okLabel;
    okBtn.className = 'btn ' + btnClass;
    confirmCb = cb;
    document.getElementById('confirmOverlay').classList.add('open');
}

function closeConfirm() {
    document.getElementById('confirmOverlay').classList.remove('open');
    confirmCb = null;
}

// ─── DELETE ────────────────────────────────────────────────
function deleteItem(section, id) {
    const item = getSection(section).find(x => x.id === id);
    openConfirm(
        'Delete Item',
        `Delete "${item ? item.title : id}" from ${sectionLabel(section)}? This cannot be undone.`,
        '🗑️ Delete',
        () => {
            adminData[section] = adminData[section].filter(x => x.id !== id);
            saveData();
            renderAll();
            renderSection(section);
            renderDashboard();
            showToast('🗑️ Item deleted.', 'error');
        }
    );
}

// ─── RENDER ALL BADGES ─────────────────────────────────────
function renderAll() {
    ['events','history','facilities','campus_guide'].forEach(sec => {
        const el = document.getElementById('badge-' + sec);
        if (el) el.textContent = getSection(sec).length;
    });
}

// ─── DASHBOARD ─────────────────────────────────────────────
function renderDashboard() {
    const ev   = getSection('events');
    const hi   = getSection('history');
    const fa   = getSection('facilities');
    const cg   = getSection('campus_guide');
    const total = ev.length + hi.length + fa.length + cg.length;

    setText('dash-events-count', ev.length);
    setText('dash-history-count', hi.length);
    setText('dash-fac-count',    fa.length);
    setText('dash-guide-count',  cg.length);
    setText('dash-total-count',  total);

    const src = localStorage.getItem(LS_DATA_KEY) ? 'localStorage' : 'Default';
    setText('dash-modified', src);

    // Recent Events
    renderMiniList('dashEventsList', ev, 'events');
    // Facilities
    renderMiniList('dashFacsList', fa, 'facilities');
}

function renderMiniList(containerId, items, section) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!items.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No items yet.</p></div>`;
        return;
    }
    el.innerHTML = items.map(item => `
        <div class="activity-row">
            <span class="act-icon">${esc(item.icon || '📄')}</span>
            <span class="act-label" title="${esc(item.title)}">${esc(item.title)}</span>
            <span class="act-section">${esc(item.category || '')}</span>
        </div>
    `).join('');
}

// ─── SECTION TABLE RENDER ──────────────────────────────────
function renderSection(section) {
    const tbody = document.getElementById(section + '-tbody');
    if (!tbody) return;

    const searchVal = (document.getElementById('search-' + section)?.value || '').toLowerCase();
    let items = getSection(section);
    if (searchVal) {
        items = items.filter(item =>
            (item.title  || '').toLowerCase().includes(searchVal) ||
            (item.category || '').toLowerCase().includes(searchVal) ||
            (item.content  || '').toLowerCase().includes(searchVal)
        );
    }

    if (!items.length) {
        const cols = section === 'events' ? 6 : 5;
        tbody.innerHTML = `<tr><td colspan="${cols}">
            <div class="empty-state">
                <div class="empty-icon">${sectionIcon(section)}</div>
                <p>${searchVal ? 'No results found.' : 'No items yet. Click "+ Add" to get started.'}</p>
            </div>
        </td></tr>`;
        return;
    }

    tbody.innerHTML = items.map(item => {
        const dateCell = section === 'events'
            ? `<td>${esc(item.date || '')}</td>` : '';
        return `
        <tr>
            <td class="item-icon">${esc(item.icon || '📄')}</td>
            <td>
                <div class="item-title">${esc(item.title)}</div>
                <div class="item-preview">${esc(item.content || '')}</div>
            </td>
            ${dateCell}
            <td><span class="badge badge-cat">${esc(item.category || '—')}</span></td>
            <td><span class="badge badge-${item.priority || 'medium'}">${capitalize(item.priority || 'medium')}</span></td>
            <td>
                <div class="row-actions">
                    <button class="btn-action" onclick="openEditModal('${section}','${item.id}')">✏️ Edit</button>
                    <button class="btn-action danger" onclick="deleteItem('${section}','${item.id}')">🗑️ Delete</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// ─── FORM BUILDER ──────────────────────────────────────────
function buildForm(section, item) {
    const v = k => item ? esc(item[k] || '') : '';
    const sel = (k, options, current) => options.map(o => `
        <option value="${o}" ${(item && item[k] === o) ? 'selected' : ''}>${capitalize(o)}</option>
    `).join('');

    const priorityOptions = ['high','medium','low'];
    const commonFields = `
        <div class="form-row">
            <div class="form-group">
                <label>Title *</label>
                <input type="text" id="f-title" value="${v('title')}" placeholder="Item title">
            </div>
            <div class="form-group">
                <label>Icon (Emoji)</label>
                <input type="text" id="f-icon" value="${v('icon')}" placeholder="📅" maxlength="4">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Category</label>
                <input type="text" id="f-category" value="${v('category')}" placeholder="e.g. Sports, Academic…">
            </div>
            <div class="form-group">
                <label>Priority</label>
                <select id="f-priority">
                    ${sel('priority', priorityOptions)}
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Content</label>
            <textarea id="f-content" rows="5" placeholder="Full description…">${v('content')}</textarea>
        </div>
    `;

    if (section === 'events') {
        return commonFields + `
        <div class="form-group">
            <label>Event Date</label>
            <input type="date" id="f-date" value="${v('date')}">
        </div>`;
    }

    if (section === 'history') {
        return commonFields + `
        <div class="form-group">
            <label>Milestone Date</label>
            <input type="date" id="f-date" value="${v('date')}">
        </div>`;
    }

    return commonFields; // facilities & campus_guide
}

function readForm(section) {
    const get = id => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };

    const base = {
        title:    get('f-title'),
        icon:     get('f-icon') || '📄',
        category: get('f-category'),
        priority: get('f-priority') || 'medium',
        content:  get('f-content'),
    };

    if (section === 'events' || section === 'history') {
        base.date = get('f-date');
    }

    return base;
}

// ─── SETTINGS ──────────────────────────────────────────────
function setupSettings() {
    document.getElementById('resetDataBtn').addEventListener('click', () => {
        openConfirm(
            'Reset to Defaults',
            'This will permanently erase all your edits and restore the original data from data.js. Are you absolutely sure?',
            '⚠️ Yes, Reset',
            () => {
                localStorage.removeItem(LS_DATA_KEY);
                loadData();
                renderAll();
                renderDashboard();
                showToast('🔄 Data reset to defaults.', 'info');
            },
            'danger'
        );
    });

    document.getElementById('exportBtnSettings').addEventListener('click', exportJSON);

    document.getElementById('changePinBtn').addEventListener('click', () => {
        const current = document.getElementById('currentPin').value;
        const newP    = document.getElementById('newPin').value;
        const confirm = document.getElementById('confirmPin').value;
        const savedPin = localStorage.getItem(LS_PIN_KEY) || DEFAULT_PIN;

        if (current !== savedPin) {
            showToast('❌ Current PIN is incorrect.', 'error'); return;
        }
        if (!newP || newP.length < 4) {
            showToast('❌ New PIN must be 4–6 digits.', 'error'); return;
        }
        if (newP !== confirm) {
            showToast('❌ PINs do not match.', 'error'); return;
        }
        localStorage.setItem(LS_PIN_KEY, newP);
        document.getElementById('currentPin').value = '';
        document.getElementById('newPin').value = '';
        document.getElementById('confirmPin').value = '';
        showToast('✅ PIN updated successfully!', 'success');
    });
}

// ─── EXPORT ────────────────────────────────────────────────
function exportJSON() {
    const blob = new Blob([JSON.stringify(adminData, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'vira_data_export.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📤 Exported vira_data_export.json', 'success');
}

// ─── TOAST ─────────────────────────────────────────────────
function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── HELPERS ───────────────────────────────────────────────
function esc(str) {
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function sectionLabel(section) {
    const map = {
        events: 'Event',
        history: 'History Entry',
        facilities: 'Facility',
        campus_guide: 'Campus Guide Entry'
    };
    return map[section] || section;
}

function sectionIcon(section) {
    const map = {
        events: '📅', history: '🏛️', facilities: '🏢', campus_guide: '🗺️'
    };
    return map[section] || '📄';
}

// Expose goToPage globally for onclick usage in dash stat cards
window.goToPage = goToPage;
window.openEditModal = openEditModal;
window.deleteItem = deleteItem;
