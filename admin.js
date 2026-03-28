/* ============================================================
   V.I.R.A. Admin Panel v2.0 — AI-Powered CMS
   Department Accounts + ChatGPT-like AI + localStorage DB
   ============================================================ */

'use strict';

// ─── CONSTANTS ─────────────────────────────────────────────
const LS_DATA_KEY     = 'vira_data';
const LS_ACCOUNTS_KEY = 'vira_accounts';
const LS_SESSION_KEY  = 'vira_session';

// ─── DEPARTMENT DEFINITIONS ────────────────────────────────
const DEPARTMENTS = [
    {
        id: 'canteen',
        name: 'Canteen',
        icon: '🍽️',
        desc: 'Food & Dining Services',
        color: '#f59e0b',
        pages: ['events', 'facilities', 'accounts'],
        defaultUser: 'canteen_admin',
        defaultPass: 'Canteen@2026'
    },
    {
        id: 'registrar',
        name: 'Registrar',
        icon: '📋',
        desc: 'Records & Enrollment',
        color: '#3b82f6',
        pages: ['events', 'history', 'campus_guide', 'accounts'],
        defaultUser: 'registrar_admin',
        defaultPass: 'Registrar@2026'
    },
    {
        id: 'library',
        name: 'Library',
        icon: '📚',
        desc: 'Books & Media Resources',
        color: '#8b5cf6',
        pages: ['events', 'facilities', 'campus_guide', 'accounts'],
        defaultUser: 'library_admin',
        defaultPass: 'Library@2026'
    },
    {
        id: 'accounting',
        name: 'Accounting',
        icon: '💰',
        desc: 'Finance & Payments',
        color: '#10b981',
        pages: ['events', 'campus_guide', 'accounts'],
        defaultUser: 'accounting_admin',
        defaultPass: 'Accounting@2026'
    },
    {
        id: 'clinic',
        name: 'Clinic',
        icon: '🏥',
        desc: 'Health & Medical Services',
        color: '#ef4444',
        pages: ['events', 'facilities', 'accounts'],
        defaultUser: 'clinic_admin',
        defaultPass: 'Clinic@2026'
    },
    {
        id: 'it_support',
        name: 'IT Support',
        icon: '💻',
        desc: 'Technology & Systems',
        color: '#06b6d4',
        pages: ['events', 'history', 'facilities', 'campus_guide', 'accounts'],
        defaultUser: 'itsupport_admin',
        defaultPass: 'ITSupport@2026'
    }
];

const SUPER_ADMIN = {
    id: 'superadmin',
    name: 'Super Admin',
    icon: '🛡️',
    role: 'Super Administrator',
    defaultUser: 'admin',
    defaultPass: 'Admin@2026',
    pages: ['events', 'history', 'facilities', 'campus_guide', 'accounts', 'settings']
};

// AI tip messages cycling
const AI_TIPS = [
    'Tip: Contact IT Support if you forgot your credentials.',
    'Tip: Use a strong password with letters, numbers and symbols.',
    'Tip: All changes are saved securely in the browser database.',
    'Tip: Super Admin can create and manage all department accounts.',
    'Tip: Export JSON to back up your data at any time.',
];

// AI chat responses
const AI_RESPONSES = {
    greeting: [
        "Hello! I'm V.I.R.A., your intelligent campus assistant. How can I help you today?",
        "Hi there! Ready to help you manage Celtech College's content. What would you like to do?",
        "Welcome! I can help you navigate, add content, or answer questions about the system."
    ],
    events: [
        "You currently have {count} events in the system. You can add new events from the Events section.",
        "Events help keep the community informed about campus activities. Would you like to add one?",
        "To add an event, click on 'Events' in the sidebar and use the '+ Add Event' button."
    ],
    facilities: [
        "Facilities data is up to date with {count} entries. You can manage them in the Facilities section.",
        "The campus map uses facility data to guide students. Keep it updated!",
        "To add a facility, navigate to the Facilities section via the sidebar."
    ],
    help: [
        "I can help you with: managing events, facilities, history, campus guide, and user accounts. What do you need?",
        "Here's what I can do: Add/Edit/Delete content entries, manage department accounts, and export data.",
        "Navigation tip: Use the sidebar to switch between sections. The dashboard gives you an overview."
    ],
    default: [
        "I understand! You can manage all content from the sidebar navigation. Let me know if you need anything specific.",
        "Great question! V.I.R.A. is AI-powered and always ready to assist with Celtech College's information system.",
        "I'm here to help! You can ask about events, facilities, user accounts, or how to use any feature.",
        "V.I.R.A. AI is trained on Celtech College's data. Ask me anything about the campus management system!"
    ]
};

// ─── STATE ─────────────────────────────────────────────────
let adminData    = {};
let accounts     = {};
let currentUser  = null;
let currentPage  = 'dashboard';
let editTarget   = null;
let confirmCb    = null;
let selectedDept = null;
let _formImages  = [];  // temp image store while a content form is open


// ─── BOOT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initAccounts();
    checkSession();
});

// ─── ACCOUNTS INIT ─────────────────────────────────────────
function initAccounts() {
    const saved = localStorage.getItem(LS_ACCOUNTS_KEY);
    if (saved) {
        accounts = JSON.parse(saved);
        // ── Migration: ensure all dept admin accounts have 'accounts' page access ──
        let migrated = false;
        DEPARTMENTS.forEach(dept => {
            const acc = accounts[dept.defaultUser];
            if (acc && !acc.pages.includes('accounts')) {
                acc.pages.push('accounts');
                migrated = true;
            }
        });
        if (migrated) saveAccounts();
    } else {
        // Seed default accounts
        accounts = {};
        // Super admin
        accounts[SUPER_ADMIN.defaultUser] = {
            username: SUPER_ADMIN.defaultUser,
            password: SUPER_ADMIN.defaultPass,
            deptId: 'superadmin',
            name: 'Super Administrator',
            role: 'Super Administrator',
            icon: SUPER_ADMIN.icon,
            pages: SUPER_ADMIN.pages,
            color: '#10a37f',
            active: true
        };
        // Department accounts
        DEPARTMENTS.forEach(dept => {
            accounts[dept.defaultUser] = {
                username: dept.defaultUser,
                password: dept.defaultPass,
                deptId: dept.id,
                name: dept.name + ' Admin',
                role: dept.name + ' Officer',
                icon: dept.icon,
                pages: dept.pages,
                color: dept.color,
                active: true
            };
        });
        saveAccounts();
    }
}

function saveAccounts() {
    localStorage.setItem(LS_ACCOUNTS_KEY, JSON.stringify(accounts));
}

// ─── SESSION CHECK ─────────────────────────────────────────
function checkSession() {
    const sessionStr = sessionStorage.getItem(LS_SESSION_KEY);
    if (sessionStr) {
        try {
            currentUser = JSON.parse(sessionStr);
            // Verify user still exists
            if (accounts[currentUser.username]) {
                showApp();
                return;
            }
        } catch (e) { /* ignore */ }
    }
    showLoginStep1();
}

// ─── LOGIN FLOW ─────────────────────────────────────────────
function showLoginStep1() {
    const step1 = document.getElementById('loginStep1');
    const step2 = document.getElementById('loginStep2');
    step1.classList.add('active');
    step2.classList.remove('active');

    renderDeptGrid();

    document.getElementById('superAdminBtn').addEventListener('click', () => {
        selectedDept = { ...SUPER_ADMIN, deptId: 'superadmin' };
        showLoginStep2();
    });
}

function renderDeptGrid() {
    const grid = document.getElementById('deptGrid');
    grid.innerHTML = DEPARTMENTS.map(dept => `
        <div class="dept-card" style="--dept-color:${dept.color}" data-dept="${dept.id}">
            <div class="dept-icon">${dept.icon}</div>
            <div>
                <div class="dept-name">${dept.name}</div>
                <div class="dept-desc">${dept.desc}</div>
            </div>
            <div class="dept-arrow">›</div>
        </div>
    `).join('');

    grid.querySelectorAll('.dept-card').forEach(card => {
        card.addEventListener('click', () => {
            const deptId = card.dataset.dept;
            selectedDept = DEPARTMENTS.find(d => d.id === deptId);
            showLoginStep2();
        });
    });
}

function showLoginStep2() {
    const step1 = document.getElementById('loginStep1');
    const step2 = document.getElementById('loginStep2');
    step1.classList.remove('active');
    step2.classList.add('active');

    document.getElementById('loginDeptIcon').textContent = selectedDept.icon;
    document.getElementById('loginDeptName').textContent = selectedDept.name;

    // Cycle AI tips
    let tipIdx = 0;
    const tipEl = document.getElementById('aiTipText');
    tipEl.textContent = AI_TIPS[tipIdx];
    const tipInterval = setInterval(() => {
        tipIdx = (tipIdx + 1) % AI_TIPS.length;
        tipEl.style.opacity = '0';
        setTimeout(() => { tipEl.textContent = AI_TIPS[tipIdx]; tipEl.style.opacity = '1'; }, 200);
    }, 3000);
    tipEl.style.transition = 'opacity 0.2s ease';

    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const loginBtn      = document.getElementById('loginBtn');
    const errorEl       = document.getElementById('loginError');
    const togglePw      = document.getElementById('togglePw');
    const backBtn       = document.getElementById('loginBackBtn');

    usernameInput.value = '';
    passwordInput.value = '';
    errorEl.textContent = '';
    usernameInput.focus();

    // Back button
    backBtn.onclick = () => {
        clearInterval(tipInterval);
        step2.classList.remove('active');
        step1.classList.add('active');
    };

    // Toggle password visibility
    togglePw.onclick = () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePw.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            togglePw.textContent = '👁';
        }
    };

    // Login action
    const doLogin = () => {
        const uname = usernameInput.value.trim();
        const pw    = passwordInput.value;
        errorEl.textContent = '';

        if (!uname || !pw) {
            errorEl.textContent = '⚠️ Please enter both username and password.';
            return;
        }

        // Show AI loading spinner
        document.getElementById('loginBtnText').style.display = 'none';
        document.getElementById('loginBtnSpinner').classList.remove('hidden');
        loginBtn.disabled = true;

        setTimeout(() => {
            const account = accounts[uname];
            if (account && account.password === pw &&
                (account.deptId === selectedDept.id || account.deptId === (selectedDept.deptId || selectedDept.id)) &&
                account.active) {

                currentUser = { ...account };
                sessionStorage.setItem(LS_SESSION_KEY, JSON.stringify(currentUser));
                clearInterval(tipInterval);
                showApp();
            } else {
                document.getElementById('loginBtnText').style.display = 'inline';
                document.getElementById('loginBtnSpinner').classList.add('hidden');
                loginBtn.disabled = false;
                errorEl.textContent = '❌ Invalid username or password.';
                usernameInput.focus();
            }
        }, 900); // AI "thinking" effect
    };

    loginBtn.onclick = doLogin;
    [usernameInput, passwordInput].forEach(el => {
        el.onkeydown = e => { if (e.key === 'Enter') doLogin(); };
    });
}

// ─── SHOW APP ──────────────────────────────────────────────
function showApp() {
    const overlay = document.getElementById('loginOverlay');
    overlay.classList.add('hidden');
    setTimeout(() => { overlay.style.display = 'none'; }, 500);

    document.getElementById('adminApp').style.display = 'flex';

    loadData();
    buildSidebar();
    setupHamburger();
    setupTopbar();
    setupSearches();
    setupAddButtons();
    setupModalButtons();
    setupConfirmButtons();
    setupSettings();
    setupLogout();
    setupAIChat();
    renderAll();
    updateUserUI();
    updateWelcomeBanner();
    goToPage('dashboard');
}

// ─── USER UI ───────────────────────────────────────────────
function updateUserUI() {
    const u = currentUser;
    document.getElementById('userName').textContent = u.name || u.username;
    document.getElementById('userRole').textContent = u.role || 'Officer';
    document.getElementById('sidebarDeptLabel').textContent =
        u.deptId === 'superadmin' ? 'Celtech College' : (u.name || 'Department');
    const initial = (u.name || u.username || 'A').charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = initial;
}

function updateWelcomeBanner() {
    const hour = new Date().getHours();
    let greeting = 'Good morning';
    if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
    else if (hour >= 17) greeting = 'Good evening';

    document.getElementById('aiGreeting').textContent =
        `${greeting}, ${currentUser.name || currentUser.username}! 👋`;

    const msgs = [
        "Welcome back to V.I.R.A. Admin Panel. Here's your system overview for today.",
        "Your content management dashboard is ready. All systems operational.",
        "V.I.R.A. AI is active and monitoring campus data in real-time."
    ];
    document.getElementById('aiWelcomeMsg').textContent = msgs[Math.floor(Math.random() * msgs.length)];

    // Live clock
    const timeEl = document.getElementById('aiWelcomeTime');
    const tick = () => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
}

// ─── BUILD SIDEBAR ─────────────────────────────────────────
function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    const pages = currentUser.pages || [];
    const pageConfig = {
        dashboard:    { icon: '📊', label: 'Dashboard' },
        events:       { icon: '📅', label: 'Events',       badge: true },
        history:      { icon: '🏛️', label: 'History',      badge: true },
        facilities:   { icon: '🏢', label: 'Facilities',   badge: true },
        campus_guide: { icon: '🗺️', label: 'Campus Guide', badge: true },
        accounts:     { icon: '👥', label: 'Accounts',     badge: true },
        settings:     { icon: '⚙️', label: 'Settings' }
    };

    const allPages = ['dashboard', ...pages.filter(p => p !== 'dashboard')];
    const hasSettings = pages.includes('settings');

    let overviewHtml = `<div class="sidebar-section-label">Overview</div>`;
    overviewHtml += buildNavItem('dashboard', pageConfig.dashboard);

    let contentHtml = '';
    const contentPages = ['events','history','facilities','campus_guide'];
    const userContentPages = contentPages.filter(p => pages.includes(p));
    if (userContentPages.length) {
        contentHtml = `<div class="sidebar-section-label">Content</div>`;
        userContentPages.forEach(p => {
            contentHtml += buildNavItem(p, pageConfig[p]);
        });
    }

    let adminHtml = '';
    const adminPages = ['accounts'];
    const userAdminPages = adminPages.filter(p => pages.includes(p));
    if (userAdminPages.length) {
        adminHtml = `<div class="sidebar-section-label">Administration</div>`;
        userAdminPages.forEach(p => {
            adminHtml += buildNavItem(p, pageConfig[p]);
        });
    }

    let toolsHtml = '';
    if (hasSettings) {
        toolsHtml = `<div class="sidebar-section-label">Tools</div>`;
        toolsHtml += buildNavItem('settings', pageConfig.settings);
    }

    nav.innerHTML = overviewHtml + contentHtml + adminHtml + toolsHtml;

    nav.querySelectorAll('.nav-item[data-page]').forEach(btn => {
        btn.addEventListener('click', () => goToPage(btn.dataset.page));
    });
}

function buildNavItem(page, cfg) {
    const badgeHtml = cfg.badge
        ? `<span class="nav-badge" id="badge-${page}">0</span>` : '';
    return `
        <button class="nav-item" data-page="${page}" id="nav-${page}">
            <span class="nav-icon">${cfg.icon}</span>
            ${cfg.label}
            ${badgeHtml}
        </button>`;
}

// ─── LOGOUT ────────────────────────────────────────────────
function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        openConfirm('Sign Out', 'Are you sure you want to sign out?', '⏻ Sign Out', () => {
            sessionStorage.removeItem(LS_SESSION_KEY);
            location.reload();
        }, 'danger');
    });
}

// ─── DATA LOAD / SAVE ──────────────────────────────────────
function loadData() {
    const saved = localStorage.getItem(LS_DATA_KEY);
    if (saved) {
        adminData = JSON.parse(saved);
        ['events','history','facilities','campus_guide'].forEach(s => {
            if (!adminData[s]) adminData[s] = [];
        });
    } else {
        adminData = JSON.parse(JSON.stringify(typeof schoolData !== 'undefined' ? schoolData : {
            events: [], history: [], facilities: [], campus_guide: []
        }));
        ['events','history','facilities','campus_guide'].forEach(s => {
            if (!adminData[s]) adminData[s] = [];
        });
    }
}

function saveData() {
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(adminData));
    // Also sync to ViraDB / Supabase cache
    if (window.ViraDB) {
        const cache = ViraDB.getAll();
        Object.keys(adminData).forEach(section => { cache[section] = adminData[section]; });
        window.viRAData = adminData;
    }
}

function getSection(section) {
    return adminData[section] || [];
}

// ─── NAVIGATION ────────────────────────────────────────────
function goToPage(page) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item[data-page]').forEach(b => b.classList.remove('active'));

    currentPage = page;
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');
    const navEl = document.getElementById('nav-' + page);
    if (navEl) navEl.classList.add('active');

    const titles = {
        dashboard:    'Dashboard',
        events:       'Events',
        history:      'History',
        facilities:   'Facilities',
        campus_guide: 'Campus Guide',
        accounts:     'Department Accounts',
        settings:     'Settings'
    };
    document.getElementById('topbarTitle').textContent = titles[page] || page;

    const contentPages = ['events','history','facilities','campus_guide'];
    const addBtn = document.getElementById('topbarAddBtn');
    addBtn.style.display = contentPages.includes(page) ? 'inline-flex' : 'none';

    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 960) sidebar.classList.remove('open');

    if (page === 'dashboard') renderDashboard();
    else if (contentPages.includes(page)) renderSection(page);
    else if (page === 'accounts') renderAccounts();
}

// ─── HAMBURGER ─────────────────────────────────────────────
function setupHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    btn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
        if (window.innerWidth < 960 &&
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
    document.getElementById('topbarAddBtn').addEventListener('click', () => openAddModal(currentPage));
}

// ─── SEARCH ────────────────────────────────────────────────
function setupSearches() {
    ['events','history','facilities','campus_guide'].forEach(sec => {
        const el = document.getElementById('search-' + sec);
        if (el) el.addEventListener('input', () => renderSection(sec));
    });
    const accSearch = document.getElementById('search-accounts');
    if (accSearch) accSearch.addEventListener('input', renderAccounts);
}

// ─── ADD BUTTONS ───────────────────────────────────────────
function setupAddButtons() {
    ['events','history','facilities','campus_guide'].forEach(sec => {
        const id = 'add' + sec.split('_').map(capitalize).join('') + 'Btn';
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => openAddModal(sec));
    });
    const addAccBtn = document.getElementById('addAccountBtn');
    if (addAccBtn) addAccBtn.addEventListener('click', openAddAccountModal);
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
    initMediaForm(null);
}

function openEditModal(section, id) {
    const item = getSection(section).find(x => x.id === id);
    if (!item) return;
    editTarget = { section, id };
    document.getElementById('modalTitle').textContent = `Edit ${sectionLabel(section)}`;
    document.getElementById('modalBody').innerHTML = buildForm(section, item);
    document.getElementById('modalSaveBtn').textContent = '💾 Update';
    document.getElementById('modalOverlay').classList.add('open');
    initMediaForm(item);
}

function handleModalSave() {
    if (!editTarget) return;
    const { section, id } = editTarget;

    // Account save?
    if (section === '__account__') {
        saveAccountModal();
        return;
    }

    const formData = readForm(section);
    if (!formData.title || !formData.title.trim()) {
        showToast('⚠️ Title is required.', 'error');
        return;
    }

    if (id === null) {
        formData.id = section.substring(0,3) + Date.now();
        adminData[section].push(formData);
        showToast(`✅ New ${sectionLabel(section)} added!`, 'success');
    } else {
        const idx = adminData[section].findIndex(x => x.id === id);
        if (idx >= 0) adminData[section][idx] = { ...adminData[section][idx], ...formData };
        showToast(`✏️ ${sectionLabel(section)} updated!`, 'success');
    }

    saveData();

    // Persist to Supabase asynchronously
    if (window.ViraDB) {
        const item = adminData[section].find(x => x.id === formData.id);
        ViraDB.save(section, item || formData).catch(err => {
            console.error('[Admin] Supabase save error:', err);
            showToast('⚠️ Saved locally. Supabase sync failed: ' + err.message, 'warning');
        });
    }
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
        `Delete "${item ? item.title : id}"? This cannot be undone.`,
        '🗑️ Delete',
        () => {
            adminData[section] = adminData[section].filter(x => x.id !== id);
            saveData();
            // Soft-delete in Supabase (sets is_active = false)
            if (window.ViraDB) {
                ViraDB.remove(section, id).catch(err => {
                    console.error('[Admin] Supabase delete error:', err);
                    showToast('⚠️ Deleted locally. Supabase sync failed.', 'warning');
                });
            }
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
    const accBadge = document.getElementById('badge-accounts');
    if (accBadge) accBadge.textContent = Object.keys(accounts).length;
}

// ─── DASHBOARD ─────────────────────────────────────────────
function renderDashboard() {
    const ev  = getSection('events');
    const hi  = getSection('history');
    const fa  = getSection('facilities');
    const cg  = getSection('campus_guide');
    const isSuperAdmin = currentUser.deptId === 'superadmin';

    const statsGrid = document.getElementById('statsGrid');
    const stats = [];

    if (currentUser.pages.includes('events'))
        stats.push({ cls: 'stat-events', icon: '📅', value: ev.length, label: 'Events', page: 'events' });
    if (currentUser.pages.includes('history'))
        stats.push({ cls: 'stat-history', icon: '🏛️', value: hi.length, label: 'History', page: 'history' });
    if (currentUser.pages.includes('facilities'))
        stats.push({ cls: 'stat-fac', icon: '🏢', value: fa.length, label: 'Facilities', page: 'facilities' });
    if (currentUser.pages.includes('campus_guide'))
        stats.push({ cls: 'stat-guide', icon: '🗺️', value: cg.length, label: 'Campus Guide', page: 'campus_guide' });
    if (isSuperAdmin)
        stats.push({ cls: 'stat-users', icon: '👥', value: Object.keys(accounts).length, label: 'Accounts', page: 'accounts' });
    stats.push({
        cls: 'stat-total', icon: '✅',
        value: ev.length + hi.length + fa.length + cg.length,
        label: 'Total Content', page: null,
        style: 'cursor:default'
    });

    statsGrid.innerHTML = stats.map(s => `
        <div class="stat-card ${s.cls}"
            ${s.page ? `style="cursor:pointer" onclick="goToPage('${s.page}')"` : `style="${s.style || ''}"`}>
            <div class="stat-icon">${s.icon}</div>
            <div class="stat-value">${s.value}</div>
            <div class="stat-label">${s.label}</div>
        </div>
    `).join('');

    document.getElementById('dashEventsCount').textContent = ev.length;
    document.getElementById('dashFacsCount').textContent = fa.length;
    renderMiniList('dashEventsList', ev, 'events');
    renderMiniList('dashFacsList', fa, 'facilities');
}

function renderMiniList(containerId, items, section) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!items.length) {
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No items yet.</p></div>`;
        return;
    }
    el.innerHTML = items.slice(0, 6).map(item => `
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
        const thumb = item.images && item.images.length
            ? `<img src="${item.images[0]}" class="item-thumb" alt="" onerror="this.style.display='none'">` : '';
        const mediaBadge = (item.images?.length || item.video)
            ? `<span class="media-badge" title="Has media">${item.images?.length ? '🖼️' : ''} ${item.video ? '🎥' : ''}</span>` : '';
        return `
        <tr>
            <td class="item-icon">${esc(item.icon || '📄')}</td>
            <td>
                <div style="display:flex;align-items:center;gap:8px">
                    ${thumb}
                    <div>
                        <div class="item-title">${esc(item.title)}</div>
                        <div class="item-preview">${esc(item.content || '')} ${mediaBadge}</div>
                    </div>
                </div>
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
    const v   = k => item ? esc(item[k] || '') : '';
    const sel = (k, opts) => opts.map(o =>
        `<option value="${o}" ${(item && item[k] === o) ? 'selected' : ''}>${capitalize(o)}</option>`
    ).join('');
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
                <select id="f-priority">${sel('priority', priorityOptions)}</select>
            </div>
        </div>
        <div class="form-group">
            <label>Content / Description</label>
            <textarea id="f-content" rows="4" placeholder="Full description…">${v('content')}</textarea>
        </div>

        <div class="media-divider"><span>📎 Media (Optional)</span></div>

        <div class="form-group">
            <label>🖼️ Images</label>
            <div class="media-upload-area">
                <div class="image-previews-grid" id="imagePreviews"></div>
                <div class="media-add-row">
                    <input type="file" id="imageFileInput" accept="image/*" multiple style="display:none">
                    <button type="button" class="btn" style="padding:7px 12px;font-size:0.8rem"
                        onclick="document.getElementById('imageFileInput').click()">📁 Upload</button>
                    <span style="color:var(--text-muted);font-size:0.78rem;flex-shrink:0">or URL:</span>
                    <input type="text" id="imageUrlInput"
                        placeholder="https://example.com/photo.jpg"
                        style="flex:1;min-width:0"
                        onkeydown="if(event.key==='Enter'){event.preventDefault();addFormImageUrl();}">
                    <button type="button" class="btn" style="padding:7px 12px;font-size:0.8rem"
                        onclick="addFormImageUrl()">＋ Add</button>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label>🎥 Video URL</label>
            <input type="text" id="f-video" value="${esc(item && item.video ? item.video : '')}"
                placeholder="YouTube link or direct .mp4 / .webm URL…"
                oninput="updateVideoPreview()">
            <div id="videoPreview" style="margin-top:8px"></div>
        </div>
    `;

    const dateExtra = `
        <div class="form-group">
            <label>${section === 'events' ? 'Event Date' : 'Milestone Date'}</label>
            <input type="date" id="f-date" value="${v('date')}">
        </div>`;

    return (section === 'events' || section === 'history')
        ? commonFields + dateExtra
        : commonFields;
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
        images:   [..._formImages],
        video:    get('f-video') || ''
    };
    if (section === 'events' || section === 'history') base.date = get('f-date');
    return base;
}

// ─── MEDIA FORM HELPERS ───────────────────────────────────
function initMediaForm(item) {
    _formImages = Array.isArray(item?.images) ? [...item.images] : [];
    renderImagePreviews();

    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', e => {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = ev => {
                    _formImages.push(ev.target.result);
                    renderImagePreviews();
                    showToast('🖼️ Image uploaded!', 'success');
                };
                reader.readAsDataURL(file);
            });
            fileInput.value = '';
        });
    }
    if (item?.video) updateVideoPreview();
}

function renderImagePreviews() {
    const container = document.getElementById('imagePreviews');
    if (!container) return;
    if (!_formImages.length) {
        container.innerHTML = `<div class="media-empty-hint">📂 No images added yet. Upload a file or paste a URL below.</div>`;
        return;
    }
    container.innerHTML = _formImages.map((src, idx) => `
        <div class="img-preview-item">
            <img src="${src}" alt="Image ${idx + 1}" onerror="this.parentElement.classList.add('img-error')">
            <button type="button" class="img-remove-btn" onclick="removeFormImage(${idx})" title="Remove">✕</button>
        </div>
    `).join('');
}

function addFormImageUrl() {
    const input = document.getElementById('imageUrlInput');
    if (!input) return;
    const url = input.value.trim();
    if (!url) { showToast('⚠️ Please enter an image URL.', 'error'); return; }
    _formImages.push(url);
    input.value = '';
    renderImagePreviews();
    showToast('🖼️ Image added!', 'success');
}

function removeFormImage(idx) {
    _formImages.splice(idx, 1);
    renderImagePreviews();
}

function updateVideoPreview() {
    const input   = document.getElementById('f-video');
    const preview = document.getElementById('videoPreview');
    if (!input || !preview) return;
    const url = input.value.trim();
    if (!url) { preview.innerHTML = ''; return; }

    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
        preview.innerHTML = `<iframe
            src="https://www.youtube.com/embed/${ytMatch[1]}"
            class="video-preview-frame" allowfullscreen loading="lazy"></iframe>`;
        return;
    }
    if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
        preview.innerHTML = `<video src="${esc(url)}" controls class="video-preview-frame"></video>`;
        return;
    }
    preview.innerHTML = `<div class="video-preview-hint">🔗 URL saved. Preview only available for YouTube or direct video files.</div>`;
}

// ─── ACCOUNTS MANAGEMENT ───────────────────────────────────
const isSuperAdmin = () => currentUser.deptId === 'superadmin';

function renderAccounts() {
    const grid = document.getElementById('accountsGrid');
    if (!grid) return;

    const search = (document.getElementById('search-accounts')?.value || '').toLowerCase();
    let accs = Object.values(accounts);

    // Dept admins only see accounts within their own department
    if (!isSuperAdmin()) {
        accs = accs.filter(a => a.deptId === currentUser.deptId);
    }

    if (search) {
        accs = accs.filter(a =>
            (a.username || '').toLowerCase().includes(search) ||
            (a.name || '').toLowerCase().includes(search) ||
            (a.deptId || '').toLowerCase().includes(search)
        );
    }

    if (!accs.length) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">👥</div><p>No accounts found. Click "+ Add Account" to create one for your department.</p></div>`;
        return;
    }

    grid.innerHTML = accs.map(acc => {
        const dept = DEPARTMENTS.find(d => d.id === acc.deptId) || {};
        const color = acc.color || dept.color || '#10a37f';
        const isSelf = acc.username === currentUser.username;
        // Dept admins cannot modify the default/primary account of a dept (only super admin can)
        const isDefaultAcc = DEPARTMENTS.some(d => d.defaultUser === acc.username) && !isSuperAdmin() && acc.username !== currentUser.username;
        const canManage = isSuperAdmin() || (!isSelf && !isDefaultAcc && acc.deptId === currentUser.deptId);
        return `
        <div class="account-card" style="--dept-color:${color}">
            <div class="account-card-header">
                <div class="account-dept-icon">${acc.icon || dept.icon || '👤'}</div>
                <div>
                    <div class="account-dept-name">${esc(acc.name || acc.username)}</div>
                    <div class="account-dept-label">${esc(acc.role || acc.deptId || '')}</div>
                </div>
                <span class="badge ${acc.active ? 'badge-active' : 'badge-inactive'}" style="margin-left:auto">
                    ${acc.active ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div class="account-info">
                <div class="account-info-row">
                    <span class="info-label">Username</span>
                    <span class="info-val">🔑 ${esc(acc.username)}</span>
                </div>
                <div class="account-info-row">
                    <span class="info-label">Password</span>
                    <span class="info-val">●●●●●●●●</span>
                </div>
                <div class="account-info-row">
                    <span class="info-label">Access</span>
                    <span class="info-val">${(acc.pages || []).map(p => `<span class="badge badge-cat" style="font-size:0.62rem;padding:2px 6px">${p}</span>`).join(' ')}</span>
                </div>
            </div>
            <div class="account-actions">
                ${isSelf ? `
                    <button class="btn" style="flex:1;justify-content:center" onclick="openEditAccountModal('${esc(acc.username)}')">
                        ✏️ Edit
                    </button>
                    <span class="badge badge-type" style="margin-left:auto">You</span>
                ` : canManage ? `
                    <button class="btn" style="flex:1;justify-content:center" onclick="openEditAccountModal('${esc(acc.username)}')">
                        ✏️ Edit
                    </button>
                    <button class="btn" style="flex:1;justify-content:center" onclick="toggleAccountStatus('${esc(acc.username)}')">
                        ${acc.active ? '🔒 Disable' : '🔓 Enable'}
                    </button>
                    <button class="btn danger" onclick="deleteAccount('${esc(acc.username)}')">🗑️</button>
                ` : `
                    <span class="badge badge-type" style="margin:auto">Protected</span>
                `}
            </div>
        </div>`;
    }).join('');
}

function openAddAccountModal() {
    editTarget = { section: '__account__', id: null };
    const lockedDept = isSuperAdmin() ? null : currentUser.deptId;
    document.getElementById('modalTitle').textContent = 'Add Department Account';
    document.getElementById('modalBody').innerHTML = buildAccountForm(null, lockedDept);
    document.getElementById('modalSaveBtn').textContent = '💾 Create Account';
    document.getElementById('modalOverlay').classList.add('open');
}

function openEditAccountModal(username) {
    const acc = accounts[username];
    if (!acc) return;
    // Dept admins can only edit accounts in their dept
    if (!isSuperAdmin() && acc.deptId !== currentUser.deptId && acc.username !== currentUser.username) {
        showToast('❌ You can only edit accounts in your department.', 'error');
        return;
    }
    const lockedDept = isSuperAdmin() ? null : currentUser.deptId;
    editTarget = { section: '__account__', id: username };
    document.getElementById('modalTitle').textContent = 'Edit Account — ' + acc.name;
    document.getElementById('modalBody').innerHTML = buildAccountForm(acc, lockedDept);
    document.getElementById('modalSaveBtn').textContent = '💾 Update Account';
    document.getElementById('modalOverlay').classList.add('open');
}

function buildAccountForm(acc, lockedDept = null) {
    const v = k => acc ? esc(acc[k] || '') : '';

    // If dept is locked, only show pages the dept is allowed (minus 'accounts' for sub-accounts)
    let pageList;
    if (lockedDept) {
        const deptDef = DEPARTMENTS.find(d => d.id === lockedDept);
        // Sub-accounts within a dept get all dept pages except 'accounts' (no recursive account management)
        pageList = (deptDef ? deptDef.pages : []).filter(p => p !== 'accounts');
    } else {
        pageList = ['events','history','facilities','campus_guide','settings'];
    }

    // Department selector — locked for dept admins, full dropdown for super admin
    let deptField;
    if (lockedDept) {
        const deptDef = DEPARTMENTS.find(d => d.id === lockedDept);
        deptField = `
            <div class="form-group">
                <label>Department</label>
                <div style="padding:10px 12px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-md);display:flex;align-items:center;gap:8px;opacity:0.8">
                    <span>${deptDef ? deptDef.icon : '🏢'}</span>
                    <span style="font-weight:600">${deptDef ? deptDef.name : lockedDept}</span>
                    <span style="margin-left:auto;font-size:0.75rem;color:var(--text-muted)">Locked to your department</span>
                </div>
                <input type="hidden" id="acc-dept" value="${lockedDept}">
            </div>`;
    } else {
        const deptOptions = [
            { id: 'superadmin', name: 'Super Admin', icon: '🛡️' },
            ...DEPARTMENTS
        ].map(d =>
            `<option value="${d.id}" ${acc && acc.deptId === d.id ? 'selected' : ''}>${d.icon} ${d.name}</option>`
        ).join('');
        deptField = `
            <div class="form-group">
                <label>Department</label>
                <select id="acc-dept">${deptOptions}</select>
            </div>`;
    }

    const pageChecks = pageList.map(p => `
        <label style="display:flex;align-items:center;gap:6px;font-size:0.84rem;font-weight:500;color:var(--text-primary);cursor:pointer">
            <input type="checkbox" value="${p}" ${acc && (acc.pages||[]).includes(p) ? 'checked' : ''}
                style="width:auto;accent-color:var(--accent)">
            ${p.replace('_',' ')}
        </label>
    `).join('');

    return `
    <div class="form-row">
        <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="acc-name" value="${v('name')}" placeholder="e.g. Canteen Staff">
        </div>
        ${deptField}
    </div>
    <div class="form-row">
        <div class="form-group">
            <label>Username *</label>
            <input type="text" id="acc-username" value="${v('username')}" placeholder="username" ${acc ? 'readonly style="opacity:0.6"' : ''}>
        </div>
        <div class="form-group">
            <label>Role / Title</label>
            <input type="text" id="acc-role" value="${v('role')}" placeholder="e.g. Canteen Staff">
        </div>
    </div>
    <div class="form-row">
        <div class="form-group">
            <label>${acc ? 'New Password (leave blank to keep)' : 'Password *'}</label>
            <input type="password" id="acc-password" placeholder="${acc ? 'New password' : 'Password'}">
        </div>
        <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="acc-confirm" placeholder="Confirm password">
        </div>
    </div>
    <div class="form-group">
        <label>Icon Emoji</label>
        <input type="text" id="acc-icon" value="${v('icon')}" placeholder="🏢" maxlength="4">
    </div>
    ${pageList.length ? `
    <div class="form-group">
        <label>Page Access</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px;background:var(--bg-input);border-radius:var(--radius-md);border:1px solid var(--border);">
            ${pageChecks}
        </div>
    </div>` : ''}`;
}

function saveAccountModal() {
    const username = document.getElementById('acc-username')?.value.trim();
    const name     = document.getElementById('acc-name')?.value.trim();
    const role     = document.getElementById('acc-role')?.value.trim();
    const icon     = document.getElementById('acc-icon')?.value.trim() || '👤';
    const pw       = document.getElementById('acc-password')?.value;
    const confirm  = document.getElementById('acc-confirm')?.value;

    // For dept admins, always use their own dept; for super admin, read from select
    const deptId = isSuperAdmin()
        ? (document.getElementById('acc-dept')?.value || currentUser.deptId)
        : currentUser.deptId;

    const pages = [];
    document.querySelectorAll('#modalBody input[type="checkbox"]').forEach(cb => {
        if (cb.checked) pages.push(cb.value);
    });
    if (!pages.includes('dashboard')) pages.unshift('dashboard');

    const isEdit = !!editTarget.id;

    if (!username) { showToast('⚠️ Username is required.', 'error'); return; }
    if (!name) { showToast('⚠️ Full name is required.', 'error'); return; }
    if (!isEdit && accounts[username]) { showToast('⚠️ Username already exists.', 'error'); return; }
    if (pw && pw !== confirm) { showToast('❌ Passwords do not match.', 'error'); return; }
    if (!isEdit && !pw) { showToast('⚠️ Password is required for new accounts.', 'error'); return; }
    if (pw && pw.length < 6) { showToast('⚠️ Password must be at least 6 characters.', 'error'); return; }

    // Security: dept admins cannot create accounts in other departments
    if (!isSuperAdmin() && deptId !== currentUser.deptId) {
        showToast('❌ You can only create accounts for your own department.', 'error');
        return;
    }

    const dept = DEPARTMENTS.find(d => d.id === deptId) || {};
    if (isEdit) {
        const existing = accounts[editTarget.id];
        // Dept admins cannot change the dept of an account
        const finalDeptId = isSuperAdmin() ? deptId : existing.deptId;
        accounts[editTarget.id] = {
            ...existing,
            name: name || existing.name,
            role: role || existing.role,
            deptId: finalDeptId,
            icon,
            pages,
            color: dept.color || existing.color,
            ...(pw ? { password: pw } : {})
        };
        showToast('✅ Account updated!', 'success');
    } else {
        accounts[username] = {
            username, name, role, deptId, icon, pages,
            password: pw,
            color: dept.color || '#10a37f',
            active: true
        };
        showToast(`✅ Account "${username}" created for ${dept.name || deptId}!`, 'success');
    }

    saveAccounts();
    renderAccounts();
    renderAll();
    document.getElementById('modalOverlay').classList.remove('open');
}

function toggleAccountStatus(username) {
    if (accounts[username]) {
        accounts[username].active = !accounts[username].active;
        saveAccounts();
        renderAccounts();
        showToast(accounts[username].active ? '🔓 Account enabled.' : '🔒 Account disabled.', 'info');
    }
}

function deleteAccount(username) {
    if (username === currentUser.username) {
        showToast('❌ You cannot delete your own account.', 'error');
        return;
    }
    const target = accounts[username];
    // Dept admins can only delete accounts in their own department,
    // and cannot delete the default dept account
    if (!isSuperAdmin()) {
        if (!target || target.deptId !== currentUser.deptId) {
            showToast('❌ You can only delete accounts in your department.', 'error');
            return;
        }
        if (DEPARTMENTS.some(d => d.defaultUser === username)) {
            showToast('❌ The primary department account cannot be deleted.', 'error');
            return;
        }
    }
    openConfirm(
        'Delete Account',
        `Delete account "${username}"? This cannot be undone.`,
        '🗑️ Delete',
        () => {
            delete accounts[username];
            saveAccounts();
            renderAccounts();
            renderAll();
            showToast('🗑️ Account deleted.', 'error');
        }
    );
}

// ─── AI CHAT ───────────────────────────────────────────────
function setupAIChat() {
    const input = document.getElementById('aiChatInput');
    const btn   = document.getElementById('aiSendBtn');
    if (!input || !btn) return;

    const send = () => {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        addUserMsg(text);
        showAITyping();
        setTimeout(() => {
            hideAITyping();
            addAIMsg(getAIResponse(text));
        }, 800 + Math.random() * 700);
    };

    btn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

function addUserMsg(text) {
    const container = document.getElementById('aiMessages');
    const msg = document.createElement('div');
    msg.className = 'ai-msg user';
    msg.innerHTML = `
        <div class="ai-msg-avatar">👤</div>
        <div class="ai-msg-bubble">${esc(text)}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function addAIMsg(text) {
    const container = document.getElementById('aiMessages');
    const msg = document.createElement('div');
    msg.className = 'ai-msg ai';
    msg.innerHTML = `
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble">${text}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function showAITyping() {
    const container = document.getElementById('aiMessages');
    const typing = document.createElement('div');
    typing.className = 'ai-msg ai';
    typing.id = 'aiTypingIndicator';
    typing.innerHTML = `
        <div class="ai-msg-avatar">🤖</div>
        <div class="ai-msg-bubble ai-typing"><span></span><span></span><span></span></div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function hideAITyping() {
    const el = document.getElementById('aiTypingIndicator');
    if (el) el.remove();
}

function getAIResponse(input) {
    const lower = input.toLowerCase();
    const ev = getSection('events');
    const fa = getSection('facilities');
    const hi = getSection('history');
    const cg = getSection('campus_guide');

    if (lower.match(/hello|hi|hey|good|mornin|afternoo|evenin/)) {
        return pick(AI_RESPONSES.greeting);
    }
    if (lower.match(/event/)) {
        return pick(AI_RESPONSES.events).replace('{count}', ev.length);
    }
    if (lower.match(/facil/)) {
        return pick(AI_RESPONSES.facilities).replace('{count}', fa.length);
    }
    if (lower.match(/help|how|what|use|guide/)) {
        return pick(AI_RESPONSES.help);
    }
    if (lower.match(/how many|count|total/)) {
        return `📊 Current data: <strong>${ev.length}</strong> Events, <strong>${hi.length}</strong> History entries, <strong>${fa.length}</strong> Facilities, <strong>${cg.length}</strong> Campus Guide entries. Total: <strong>${ev.length+hi.length+fa.length+cg.length}</strong> items.`;
    }
    if (lower.match(/account|user|password|login/)) {
        return `👥 You can manage department accounts from the Accounts section in the sidebar. There are currently <strong>${Object.keys(accounts).length}</strong> accounts registered.`;
    }
    if (lower.match(/celtech|college|school/)) {
        return `🏫 Celtech College Olongapo is served by V.I.R.A. (Virtual Interactive Resource Assistant). I'm your AI-powered campus management tool!`;
    }
    if (lower.match(/export|backup|download/)) {
        return `📤 You can export all data as JSON using the Export button in the topbar, or via Settings → Download JSON.`;
    }
    return pick(AI_RESPONSES.default);
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ─── SETTINGS ──────────────────────────────────────────────
function setupSettings() {
    const resetBtn = document.getElementById('resetDataBtn');
    const exportBtn = document.getElementById('exportBtnSettings');
    const changePwBtn = document.getElementById('changePwBtn');

    if (resetBtn) resetBtn.addEventListener('click', () => {
        openConfirm(
            'Reset to Defaults',
            'This will permanently erase all edits and restore original data.js defaults. Are you sure?',
            '⚠️ Yes, Reset',
            () => {
                localStorage.removeItem(LS_DATA_KEY);
                loadData();
                renderAll();
                renderDashboard();
                showToast('🔄 Data reset to defaults.', 'info');
            }
        );
    });

    if (exportBtn) exportBtn.addEventListener('click', exportJSON);

    if (changePwBtn) changePwBtn.addEventListener('click', () => {
        const cur  = document.getElementById('currentPw')?.value;
        const newP = document.getElementById('newPw')?.value;
        const conf = document.getElementById('confirmPw')?.value;
        const acct = accounts[currentUser.username];

        if (!acct || cur !== acct.password) {
            showToast('❌ Current password is incorrect.', 'error'); return;
        }
        if (!newP || newP.length < 6) {
            showToast('❌ New password must be at least 6 characters.', 'error'); return;
        }
        if (newP !== conf) {
            showToast('❌ Passwords do not match.', 'error'); return;
        }
        accounts[currentUser.username].password = newP;
        currentUser.password = newP;
        sessionStorage.setItem(LS_SESSION_KEY, JSON.stringify(currentUser));
        saveAccounts();
        document.getElementById('currentPw').value = '';
        document.getElementById('newPw').value = '';
        document.getElementById('confirmPw').value = '';
        showToast('✅ Password updated successfully!', 'success');
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
    }, 3500);
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

// ─── HIDDEN UTIL ───────────────────────────────────────────
class hidden {
    static add(el) { if (el) el.classList.add('hidden'); }
    static remove(el) { if (el) el.classList.remove('hidden'); }
}

// ─── GLOBAL EXPOSE ─────────────────────────────────────────
window.goToPage             = goToPage;
window.openEditModal        = openEditModal;
window.deleteItem           = deleteItem;
window.openEditAccountModal = openEditAccountModal;
window.toggleAccountStatus  = toggleAccountStatus;
window.deleteAccount        = deleteAccount;
window.addFormImageUrl      = addFormImageUrl;
window.removeFormImage      = removeFormImage;
window.updateVideoPreview   = updateVideoPreview;
