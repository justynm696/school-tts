// ==================== Application State ====================
let currentCategory = 'events';
let currentText = '';
let currentTitle = '';
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let voices = [];
let isPlaying = false;
let searchQuery = '';
let isListening = false;
let recognition = null;

// ==================== DOM Elements ====================
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    categoryTabs: document.querySelectorAll('.tab-btn'),
    contentSection: document.getElementById('contentSection'),
    ttsPanel: document.getElementById('ttsPanel'),
    ttsTitle: document.getElementById('ttsTitle'),
    ttsText: document.getElementById('ttsText'),
    playBtn: document.getElementById('playBtn'),
    stopBtn: document.getElementById('stopBtn'),
    closeBtn: document.getElementById('closeBtn'),
    fabBtn: document.getElementById('fabBtn'),
    speedSlider: document.getElementById('speedSlider'),
    speedValue: document.getElementById('speedValue'),
    voiceSelector: document.getElementById('voiceSelector'),
    progressFill: document.getElementById('progressFill'),
    searchInput: document.getElementById('searchInput'),
    voiceSearchBtn: document.getElementById('voiceSearchBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    voiceFeedback: document.getElementById('voiceFeedback')
};

// ==================== Initialization ====================
function init() {
    loadTheme();
    loadVoices();
    renderIdleState();   // Show welcome screen instead of content
    attachEventListeners();
    initVoiceSearch();
    animateSearchBar();

    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
}

// ==================== Theme Management ====================
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ==================== Voice Management ====================
function loadVoices() {
    voices = speechSynthesis.getVoices();

    if (voices.length > 0) {
        elements.voiceSelector.innerHTML = '';

        // Display ALL voices without filtering - all languages are functional
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;

            // Format: "Voice Name (Language) - [Online/Offline]"
            const onlineStatus = voice.localService ? '' : ' 🌐';
            option.textContent = `${voice.name} (${voice.lang})${onlineStatus}`;

            // Set default voice (prefer English if available, but any voice works)
            if (voice.default || (index === 0 && !elements.voiceSelector.value)) {
                option.selected = true;
            }

            elements.voiceSelector.appendChild(option);
        });
    }
}

// ==================== Idle / Welcome State ====================
function renderIdleState() {
    // Hide category tabs in idle state
    const tabs = document.querySelector('.category-tabs');
    if (tabs) tabs.classList.add('tabs-hidden');

    elements.contentSection.innerHTML = `
        <div class="idle-screen" id="idleScreen">
            <div class="idle-ai-orb">
                <div class="orb-ring"></div>
                <div class="orb-ring orb-ring-2"></div>
                <div class="orb-ring orb-ring-3"></div>
                <div class="orb-icon"><img src="vira_logo.png" alt="V.I.R.A."></div>
            </div>
            <h2 class="idle-title">Ask V.I.R.A. anything</h2>
            <p class="idle-subtitle">Search or speak a topic to explore Celtech College</p>

            <div class="idle-hint">
                <span class="idle-hint-icon">💡</span>
                Try: <em>"1st Floor"</em>, <em>"Library"</em>, <em>"Auditorium"</em>, or speak into the mic 🎙️
            </div>
        </div>
    `;
}


// ==================== Category Match Detection ====================
// Maps search queries to exact category keys
const CATEGORY_MAP = {
    'events': 'events',
    'event': 'events',
    'history': 'history',
    'histories': 'history',
    'school history': 'history',
    'campus history': 'history',
    'facilities': 'facilities',
    'facility': 'facilities',
    'campus guide': 'campus_guide',
    'guide': 'campus_guide',
    'campus_guide': 'campus_guide',
};

// ── Office / Floor keyword shortcuts (search-to-reveal) ──────────
// Maps a typed/spoken phrase to a specific campus_guide item ID
const ITEM_SHORTCUT_MAP = {
    // Office accounts
    'registrar': 'office-registrar',
    'registrar office': 'office-registrar',
    'canteen': 'office-canteen',
    'cafeteria': 'office-canteen',
    'food': 'office-canteen',
    'it support': 'office-it-support',
    'it': 'office-it-support',
    'tech support': 'office-it-support',
    'technical support': 'office-it-support',
    'accounting': 'office-accounting',
    'finance': 'office-accounting',
    'finance office': 'office-accounting',
    'accounting office': 'office-accounting',
    'payment': 'office-accounting',
    'tuition': 'office-accounting',
    // Floor directories
    '1st floor': 'floor-1st',
    'first floor': 'floor-1st',
    'ground floor': 'floor-1st',
    '2nd floor': 'floor-2nd',
    'second floor': 'floor-2nd',
    '3rd floor': 'floor-3rd',
    'third floor': 'floor-3rd',
    '4th floor': 'floor-4th',
    'fourth floor': 'floor-4th',
};

const INTERACTIVE_MAPS_QUERIES = ['interactive maps', 'interactive map', 'maps', 'map', 'navigation', 'navigate', 'floor map', 'floor plan'];

function detectCategoryQuery(query) {
    const q = query.trim().toLowerCase();
    if (CATEGORY_MAP[q]) return { type: 'category', key: CATEGORY_MAP[q] };
    if (ITEM_SHORTCUT_MAP[q]) return { type: 'item', id: ITEM_SHORTCUT_MAP[q] };
    if (INTERACTIVE_MAPS_QUERIES.some(k => k === q || q === k)) return { type: 'maps' };
    return null;
}

function setActiveTab(categoryKey) {
    const tabMap = { events: 'events', history: 'history', facilities: 'facilities', campus_guide: 'campus_guide' };
    document.querySelectorAll('.tab-btn[data-category]').forEach(t => t.classList.remove('active'));
    const target = document.querySelector(`.tab-btn[data-category="${tabMap[categoryKey]}"]`);
    if (target) target.classList.add('active');
    currentCategory = categoryKey;
}

// ==================== Content Rendering ====================
function renderContent(category) {
    elements.contentSection.innerHTML = '';

    // Show tabs when searching
    const tabs = document.querySelector('.category-tabs');
    if (searchQuery.trim()) {
        if (tabs) tabs.classList.remove('tabs-hidden');
    } else {
        if (tabs) tabs.classList.add('tabs-hidden');
        renderIdleState();
        return;
    }

    const query = searchQuery.trim().toLowerCase();

    // ── CATEGORY-NAME SHORTCUT ──────────────────────────────────────
    const detected = detectCategoryQuery(query);

    if (detected && detected.type === 'maps') {
        // Show the Interactive Maps special card only
        renderInteractiveMapsResult();
        return;
    }

    if (detected && detected.type === 'category') {
        renderFullCategory(detected.key);
        return;
    }

    if (detected && detected.type === 'item') {
        renderSingleItem(detected.id);
        return;
    }
    // ────────────────────────────────────────────────────────────────

    let filteredData = [];
    let specialPages = [];

    // If there's a search query, search across ALL categories
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();

        // Check for special pages first
        const specialPagesData = [
            {
                id: 'interactive-maps',
                title: 'Interactive Campus Maps',
                content: 'Navigate through Celtech College Olongapo with our interactive floor-by-floor maps. Find classrooms, offices, labs, and facilities easily.',
                category: 'Navigation',
                icon: '🗺️',
                priority: 'high',
                date: new Date().toISOString(),
                isSpecialPage: true,
                link: 'navigation.html',
                keywords: ['interactive maps', 'navigation', 'campus map', 'floor map', 'directions', 'find room', 'locate']
            }
        ];

        // Campus locations database from navigation.js
        const campusLocations = {
            1: [
                { room: "Lobby", description: "Main entrance and waiting area", floor: "1st Floor" },
                { room: "Registrar Office", description: "Student enrollment, records, and transcripts", floor: "1st Floor" },
                { room: "Finance Office", description: "Tuition payments and financial services", floor: "1st Floor" },
                { room: "CESO Office", description: "Community extension services", floor: "1st Floor" },
                { room: "Faculty Lounge", description: "Faculty rest and meeting area", floor: "1st Floor" },
                { room: "Tourism Lab", description: "Hospitality and tourism training", floor: "1st Floor" },
                { room: "OSSAA Office", description: "Student affairs and activities", floor: "1st Floor" },
                { room: "Academics Research Office", description: "Research support and resources", floor: "1st Floor" },
                { room: "Asset Management Office", description: "Inventory and asset tracking", floor: "1st Floor" },
                { room: "Guidance Office", description: "Student counseling and support", floor: "1st Floor" },
                { room: "Clinic", description: "Medical services and first aid", floor: "1st Floor" },
                { room: "HRS Office", description: "Human resources and staffing", floor: "1st Floor" },
                { room: "Onboard Training Office", description: "Maritime training coordination", floor: "1st Floor" },
                { room: "Maritime Faculty Room", description: "Maritime instructors office", floor: "1st Floor" },
                { room: "CTTHM Storage", description: "Storage for hospitality equipment", floor: "1st Floor" },
                { room: "Canteen", description: "Student and faculty dining area", floor: "1st Floor" },
                { room: "Kitchen Lab", description: "Culinary arts training kitchen", floor: "1st Floor" },
                { room: "Function Room", description: "Events and gatherings", floor: "1st Floor" },
                { room: "Chemistry Lab", description: "Chemistry experiments and practicals", floor: "1st Floor" },
                { room: "Food & Beverage Lab", description: "F&B service training", floor: "1st Floor" },
                { room: "Electrical Lab", description: "Electrical engineering practicals", floor: "1st Floor" },
                { room: "Solas Lab", description: "Safety of Life at Sea training", floor: "1st Floor" },
                { room: "Mechanical Area", description: "Mechanical workshop", floor: "1st Floor" },
                { room: "Refrigeration & Air Conditioning Lab", description: "HVAC training facility", floor: "1st Floor" },
                { room: "Basement", description: "Storage and utilities", floor: "1st Floor" }
            ],
            2: [
                { room: "School Library & Information Center", description: "Main library with books, journals, computers, and study areas", floor: "2nd Floor" },
                { room: "Room 201 - Moot Court", description: "Legal studies and mock trials", floor: "2nd Floor" },
                { room: "Room 202", description: "General classroom", floor: "2nd Floor" },
                { room: "Room 203", description: "General classroom", floor: "2nd Floor" },
                { room: "Room 204", description: "General classroom", floor: "2nd Floor" },
                { room: "Room 205", description: "General classroom", floor: "2nd Floor" },
                { room: "Room 206", description: "General classroom", floor: "2nd Floor" },
                { room: "Room 208 - Speech Lab", description: "Communication and public speaking training", floor: "2nd Floor" },
                { room: "Room 209 - Computer Lab", description: "Modern computers and software for IT courses", floor: "2nd Floor" },
                { room: "Room 210", description: "General classroom", floor: "2nd Floor" },
                { room: "Room 211 - Crime Lab", description: "Criminology students, forensic training", floor: "2nd Floor" },
                { room: "Room 212 - Physics Lab", description: "Physics experiments and practicals", floor: "2nd Floor" }
            ],
            3: [
                { room: "Skills Lab", description: "Hands-on technical training facility", floor: "3rd Floor" },
                { room: "Room 301", description: "General classroom for technical courses", floor: "3rd Floor" },
                { room: "Room 302", description: "General classroom for engineering programs", floor: "3rd Floor" },
                { room: "Room 303", description: "General classroom for skills training", floor: "3rd Floor" },
                { room: "Room 304", description: "General classroom for technical instruction", floor: "3rd Floor" },
                { room: "Room 305", description: "General classroom for vocational courses", floor: "3rd Floor" },
                { room: "Room 306", description: "General classroom for specialized training", floor: "3rd Floor" },
                { room: "Room 307", description: "General classroom for technical education", floor: "3rd Floor" },
                { room: "Room 310", description: "General classroom for academic programs", floor: "3rd Floor" },
                { room: "Room 311", description: "General classroom", floor: "3rd Floor" },
                { room: "Room 312", description: "General classroom", floor: "3rd Floor" },
                { room: "Room 313", description: "General classroom", floor: "3rd Floor" },
                { room: "Room 314", description: "General classroom", floor: "3rd Floor" },
                { room: "Room 315", description: "General classroom", floor: "3rd Floor" },
                { room: "Room 316", description: "General classroom", floor: "3rd Floor" }
            ],
            4: [
                { room: "MOLA Auditorium", description: "Large multipurpose auditorium for events and assemblies", floor: "4th Floor" },
                { room: "Room 404 - Plotting Room", description: "Maritime navigation and chart work", floor: "4th Floor" },
                { room: "Room 405", description: "General classroom for maritime courses", floor: "4th Floor" },
                { room: "Room 406 - Mock Bridge", description: "Ship bridge simulations and maritime training", floor: "4th Floor" },
                { room: "Room 408", description: "General classroom", floor: "4th Floor" },
                { room: "Room 409", description: "General classroom", floor: "4th Floor" },
                { room: "Room 410", description: "General classroom", floor: "4th Floor" },
                { room: "Room 411", description: "General classroom", floor: "4th Floor" },
                { room: "Room 412 - GMDSS Room", description: "Global Maritime Distress and Safety System training", floor: "4th Floor" },
                { room: "Engineering Simulator", description: "Advanced engineering simulation facility", floor: "4th Floor" },
                { room: "Bridge Simulator", description: "Ship bridge simulator for navigation training", floor: "4th Floor" }
            ]
        };

        // Search campus locations
        let locationMatches = [];
        Object.keys(campusLocations).forEach(floor => {
            const locations = campusLocations[floor];
            const matches = locations.filter(loc =>
                loc.room.toLowerCase().includes(query) ||
                loc.description.toLowerCase().includes(query) ||
                loc.floor.toLowerCase().includes(query)
            );

            matches.forEach(loc => {
                locationMatches.push({
                    id: `location-${floor}-${loc.room.replace(/\s+/g, '-').toLowerCase()}`,
                    title: loc.room,
                    content: `${loc.description} - Located on the ${loc.floor}`,
                    category: 'Campus Location',
                    icon: '📍',
                    priority: 'medium',
                    date: new Date().toISOString(),
                    isLocation: true,
                    floor: floor,
                    link: `navigation.html#floor${floor}`
                });
            });
        });

        // Check if query matches any special page
        specialPages = specialPagesData.filter(page =>
            page.title.toLowerCase().includes(query) ||
            page.content.toLowerCase().includes(query) ||
            page.category.toLowerCase().includes(query) ||
            page.keywords.some(keyword => keyword.includes(query) || query.includes(keyword))
        );

        // Search through all categories
        Object.keys(viRAData).forEach(categoryKey => {
            const categoryData = viRAData[categoryKey];
            // Convert category key to readable format (e.g., "campus_guide" -> "campus guide")
            const categoryName = categoryKey.replace(/_/g, ' ').toLowerCase();

            const matches = categoryData.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.content.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                categoryName.includes(query)
            );

            // Add category source to each item for display
            matches.forEach(item => {
                filteredData.push({
                    ...item,
                    sourceCategory: categoryKey
                });
            });
        });

        // Add location matches to filtered data
        filteredData = [...filteredData, ...locationMatches];
    } else {
        // No search query, show current category only
        const data = viRAData[category] || [];
        filteredData = data.map(item => ({
            ...item,
            sourceCategory: category
        }));
    }

    renderResultsList(filteredData, specialPages);
}

// ── Show a single campus_guide item by ID (office/floor shortcut) ──
function renderSingleItem(itemId) {
    // Search all categories for the item
    let foundItem = null;
    Object.keys(viRAData).forEach(key => {
        const hit = viRAData[key].find(i => i.id === itemId);
        if (hit) foundItem = { ...hit, sourceCategory: key };
    });

    if (!foundItem) {
        // Fallback to regular search if not found
        renderContent(currentCategory);
        return;
    }

    // Highlight corresponding tab
    setActiveTab('campus_guide');

    // Build icon labels for the category
    const isOffice = foundItem.category === 'Office Account';
    const isFloor = ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'].includes(foundItem.category);
    const bannerIcon = isOffice ? '🏢' : (isFloor ? '🏗️' : '📄');
    const bannerLabel = isOffice ? `<strong>Office Account</strong> &mdash; ${foundItem.title}` :
        isFloor ? `<strong>Floor Directory</strong> &mdash; ${foundItem.title}` :
            `<strong>${foundItem.title}</strong>`;

    const banner = document.createElement('div');
    banner.className = 'search-results-banner category-full-banner';
    banner.innerHTML = `<span>${bannerIcon}</span><span>${bannerLabel}</span>`;
    elements.contentSection.appendChild(banner);

    elements.contentSection.appendChild(createContentCard(foundItem, 0));
}

// ── Show ALL items in a named category ──────────────────────────
function renderFullCategory(categoryKey) {
    setActiveTab(categoryKey);
    const categoryLabels = {
        events: 'Events', history: 'History',
        facilities: 'Facilities', campus_guide: 'Campus Guide'
    };
    const categoryIcons = { events: '📅', history: '🏛️', facilities: '🏢', campus_guide: '🗺️' };
    const label = categoryLabels[categoryKey] || categoryKey;
    const icon = categoryIcons[categoryKey] || '📄';
    const items = (viRAData[categoryKey] || []).map(item => ({ ...item, sourceCategory: categoryKey }));

    // Category header banner
    const banner = document.createElement('div');
    banner.className = 'search-results-banner category-full-banner';
    banner.innerHTML = `
        <span>${icon}</span>
        <span>Showing all <strong>${items.length}</strong> ${label} item${items.length !== 1 ? 's' : ''}</span>
    `;
    elements.contentSection.appendChild(banner);

    if (!items.length) {
        elements.contentSection.innerHTML += `
            <div style="text-align:center;padding:3rem;color:var(--color-text-tertiary)">
                <p style="font-size:1.1rem">No ${label} entries yet.</p>
            </div>`;
        return;
    }
    items.forEach((item, i) => {
        elements.contentSection.appendChild(createContentCard(item, i));
    });
}

// ── Show Interactive Maps result card ───────────────────────────
function renderInteractiveMapsResult() {
    // Deselect all tabs, highlight the maps link
    document.querySelectorAll('.tab-btn[data-category]').forEach(t => t.classList.remove('active'));
    const mapsTab = document.querySelector('.tab-btn.external-link');
    if (mapsTab) mapsTab.classList.add('active');

    const banner = document.createElement('div');
    banner.className = 'search-results-banner';
    banner.innerHTML = `<span>🧭</span><span>Showing <strong>Interactive Maps</strong></span>`;
    elements.contentSection.appendChild(banner);

    const card = createSpecialPageCard({
        id: 'interactive-maps',
        title: 'Interactive Campus Maps',
        content: 'Navigate through Celtech College Olongapo with our interactive floor-by-floor maps. Find classrooms, offices, labs, and facilities easily. Tap below to open the full map.',
        category: 'Navigation',
        icon: '🗺️',
        priority: 'high',
        date: new Date().toISOString(),
        isSpecialPage: true,
        link: 'navigation.html',
        keywords: []
    }, 0);
    elements.contentSection.appendChild(card);
}

// ── Shared renderer for regular mixed search results ─────────────
function renderResultsList(filteredData, specialPages) {
    const totalResults = filteredData.length + specialPages.length;

    if (totalResults === 0) {
        elements.contentSection.innerHTML = `
            <div style="text-align:center;padding:3rem;color:var(--color-text-tertiary)">
                <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
                <p style="font-size:1.1rem">No results found for "<strong>${searchQuery}</strong>"</p>
                <p style="font-size:0.9rem;margin-top:0.5rem">Try: Events, History, Facilities, Campus Guide, or Interactive Maps</p>
            </div>`;
        return;
    }

    // Results count banner
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'search-results-banner';
    resultsHeader.innerHTML = `
        <span>🔍</span>
        <span><strong>${totalResults}</strong> result${totalResults !== 1 ? 's' : ''} found for "<strong>${searchQuery}</strong>"</span>
    `;
    elements.contentSection.appendChild(resultsHeader);

    specialPages.forEach((item, i) => elements.contentSection.appendChild(createSpecialPageCard(item, i)));
    filteredData.forEach((item, i) => {
        const card = item.isLocation
            ? createLocationCard(item, i + specialPages.length)
            : createContentCard(item, i + specialPages.length);
        elements.contentSection.appendChild(card);
    });
}

function createContentCard(item, index) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.style.animationDelay = `${index * 50}ms`;

    const priorityClass = `priority-${item.priority}`;
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format event_time to 12h display
    const fmtTime = (t) => {
        if (!t) return '';
        try {
            const [h, m] = t.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
        } catch { return t; }
    };
    const timeTag = item.event_time
        ? `<span class="card-date">🕐 ${fmtTime(item.event_time)}</span>`
        : '';

    // Get category display name
    const categoryDisplayNames = {
        'events': 'Events',
        'history': 'History',
        'facilities': 'Facilities',
        'campus_guide': 'Campus Guide'
    };

    const categoryBadge = searchQuery.trim() && item.sourceCategory
        ? `<span class="category-badge" style="background: var(--color-primary); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; margin-left: 0.5rem;">${categoryDisplayNames[item.sourceCategory] || item.sourceCategory}</span>`
        : '';

    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon">${item.icon}</div>
            <div class="card-title-section">
                <h3 class="card-title">${item.title}${categoryBadge}</h3>
                <div class="card-meta">
                    <span class="card-date">📅 ${formattedDate}</span>
                    ${timeTag}
                    <span class="card-category">🏷️ ${item.category}</span>
                </div>
            </div>
        </div>
        <div class="card-body">
            <p>${item.content}</p>
        </div>
        <div class="card-footer">
            <span class="card-priority ${priorityClass}">
                ${item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
                ${item.priority}
            </span>
            <button class="listen-btn" data-id="${item.id}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                </svg>
                Listen
            </button>
        </div>
    `;

    // Add click event to the entire card
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.listen-btn')) {
            openTTSPanel(item.title, item.content);
        }
    });

    // Add click event to the listen button
    const listenBtn = card.querySelector('.listen-btn');
    listenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openTTSPanel(item.title, item.content);
        playText();
    });

    return card;
}

function createSpecialPageCard(item, index) {
    const card = document.createElement('div');
    card.className = 'content-card special-page-card';
    card.style.animationDelay = `${index * 50}ms`;
    card.style.borderLeft = '4px solid var(--color-accent)';
    card.style.background = 'linear-gradient(135deg, rgba(30, 90, 142, 0.05), rgba(237, 139, 0, 0.05))';

    const priorityClass = `priority-${item.priority}`;
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon" style="font-size: 2rem;">${item.icon}</div>
            <div class="card-title-section">
                <h3 class="card-title">
                    ${item.title}
                    <span class="category-badge" style="background: var(--color-accent); color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; margin-left: 0.5rem;">Special Page</span>
                </h3>
                <div class="card-meta">
                    <span class="card-date">📅 ${formattedDate}</span>
                    <span class="card-category">🏷️ ${item.category}</span>
                </div>
            </div>
        </div>
        <div class="card-body">
            <p>${item.content}</p>
        </div>
        <div class="card-footer">
            <span class="card-priority ${priorityClass}">
                ${item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
                ${item.priority}
            </span>
            <button class="listen-btn navigate-btn" data-link="${item.link}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 7L18 12L13 17M6 12H18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Open Page
            </button>
        </div>
    `;

    // Add click event to navigate to the page
    const navigateBtn = card.querySelector('.navigate-btn');
    navigateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.link && item.link !== '#') {
            window.location.href = item.link;
        }
    });

    // Add click event to the entire card
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.navigate-btn')) {
            openTTSPanel(item.title, item.content);
        }
    });

    return card;
}

function createLocationCard(item, index) {
    const card = document.createElement('div');
    card.className = 'content-card location-card';
    card.style.animationDelay = `${index * 50}ms`;
    card.style.borderLeft = '4px solid #f5a623';
    card.style.background = 'linear-gradient(135deg, rgba(245, 166, 35, 0.05), rgba(30, 90, 142, 0.05))';

    const priorityClass = `priority-${item.priority}`;
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon" style="font-size: 2rem;">${item.icon}</div>
            <div class="card-title-section">
                <h3 class="card-title">
                    ${item.title}
                    <span class="category-badge" style="background: #f5a623; color: white; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; margin-left: 0.5rem;">Campus Location</span>
                </h3>
                <div class="card-meta">
                    <span class="card-date">📅 ${formattedDate}</span>
                    <span class="card-category">🏷️ ${item.category}</span>
                </div>
            </div>
        </div>
        <div class="card-body">
            <p>${item.content}</p>
        </div>
        <div class="card-footer">
            <span class="card-priority ${priorityClass}">
                ${item.priority === 'high' ? '🔴' : item.priority === 'medium' ? '🟡' : '🟢'}
                ${item.priority}
            </span>
            <button class="listen-btn navigate-btn" data-link="${item.link}">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                View on Map
            </button>
        </div>
    `;

    // Add click event to navigate to the location on map
    const navigateBtn = card.querySelector('.navigate-btn');
    navigateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (item.link) {
            window.location.href = item.link;
        }
    });

    // Add click event to the entire card to read location info
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.navigate-btn')) {
            openTTSPanel(item.title, item.content);
        }
    });

    return card;
}

// ==================== TTS Panel Management ====================
function openTTSPanel(title, text) {
    currentTitle = title;
    currentText = text;

    elements.ttsTitle.textContent = title;
    elements.ttsText.innerHTML = `<p>${text}</p>`;
    elements.ttsPanel.classList.add('active');
    elements.fabBtn.classList.add('hidden');

    stopSpeech();
}

function closeTTSPanel() {
    elements.ttsPanel.classList.remove('active');
    elements.fabBtn.classList.remove('hidden');
    stopSpeech();
}

// ==================== Speech Synthesis ====================
function playText() {
    if (!currentText) return;

    // If already playing, pause instead
    if (isPlaying) {
        pauseSpeech();
        return;
    }

    // Stop any ongoing speech
    stopSpeech();

    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(currentText);

    // Set voice
    const selectedVoiceIndex = elements.voiceSelector.value;
    if (voices[selectedVoiceIndex]) {
        currentUtterance.voice = voices[selectedVoiceIndex];
    }

    // Set rate
    currentUtterance.rate = parseFloat(elements.speedSlider.value);

    // Set pitch
    currentUtterance.pitch = 1;

    // Set volume
    currentUtterance.volume = 1;

    // Event handlers
    let _ttsStartTime = 0;
    currentUtterance.onstart = () => {
        isPlaying = true;
        _ttsStartTime = Date.now();
        elements.playBtn.classList.add('playing');
        animateProgress();
    };

    currentUtterance.onend = () => {
        isPlaying = false;
        elements.playBtn.classList.remove('playing');
        elements.progressFill.style.width = '0%';

        // Log TTS usage to Supabase
        if (window.ViraDB && currentTitle) {
            const duration = Math.round((Date.now() - _ttsStartTime) / 1000);
            const voiceEl = elements.voiceSelector;
            const voiceName = voices[voiceEl?.value]?.name || null;
            const rate = parseFloat(elements.speedSlider?.value || '1.0');
            // Derive content type from active tab
            const activeTab = document.querySelector('.tab-btn.active[data-category]');
            const contentType = activeTab ? activeTab.dataset.category.replace('campus_guide', 'campus_guide') : 'event';
            ViraDB.logTTS(contentType, 'tts-' + Date.now(), voiceName, rate, duration);
        }
    };

    currentUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        isPlaying = false;
        elements.playBtn.classList.remove('playing');
        elements.progressFill.style.width = '0%';
    };

    // Start speaking
    speechSynthesis.speak(currentUtterance);
}

function pauseSpeech() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        isPlaying = false;
        elements.playBtn.classList.remove('playing');
    } else if (speechSynthesis.paused) {
        speechSynthesis.resume();
        isPlaying = true;
        elements.playBtn.classList.add('playing');
    }
}

function stopSpeech() {
    speechSynthesis.cancel();
    isPlaying = false;
    elements.playBtn.classList.remove('playing');
    elements.progressFill.style.width = '0%';
}

function animateProgress() {
    if (!isPlaying) return;

    // Estimate progress based on time
    const words = currentText.split(' ').length;
    const rate = parseFloat(elements.speedSlider.value);
    const estimatedDuration = (words / (rate * 2.5)) * 1000; // Rough estimate

    let startTime = Date.now();

    function updateProgress() {
        if (!isPlaying) {
            return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / estimatedDuration) * 100, 100);
        elements.progressFill.style.width = `${progress}%`;

        if (progress < 100 && isPlaying) {
            requestAnimationFrame(updateProgress);
        }
    }

    updateProgress();
}

// ==================== Voice Search ====================
function initVoiceSearch() {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        elements.voiceSearchBtn.style.display = 'none';
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        isListening = true;
        elements.voiceSearchBtn.classList.add('listening');
        elements.voiceFeedback.classList.add('active');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        elements.searchInput.value = transcript;
        searchQuery = transcript;
        handleSearch();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopVoiceSearch();

        if (event.error === 'no-speech') {
            showVoiceFeedback('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
            showVoiceFeedback('Microphone access denied. Please enable it in your browser settings.');
        }
    };

    recognition.onend = () => {
        stopVoiceSearch();
    };
}

function startVoiceSearch() {
    if (!recognition) {
        alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }

    if (isListening) {
        stopVoiceSearch();
        return;
    }

    try {
        recognition.start();
    } catch (error) {
        console.error('Error starting voice recognition:', error);
    }
}

function stopVoiceSearch() {
    isListening = false;
    elements.voiceSearchBtn.classList.remove('listening');
    elements.voiceFeedback.classList.remove('active');

    if (recognition) {
        try {
            recognition.stop();
        } catch (error) {
            // Ignore errors when stopping
        }
    }
}

function showVoiceFeedback(message) {
    const feedbackText = elements.voiceFeedback.querySelector('.listening-text');
    const originalText = feedbackText.textContent;
    feedbackText.textContent = message;
    elements.voiceFeedback.classList.add('active');

    setTimeout(() => {
        feedbackText.textContent = originalText;
        elements.voiceFeedback.classList.remove('active');
    }, 3000);
}

function handleSearch() {
    renderContent(currentCategory);
    updateClearButton();
    updateSearchBarState();

    // Log search analytics to Supabase (debounced to avoid logging every keystroke)
    if (window.ViraDB && searchQuery.trim().length >= 3) {
        clearTimeout(window._searchLogTimer);
        window._searchLogTimer = setTimeout(() => {
            const resultCount = document.querySelectorAll('.content-card').length;
            ViraDB.logSearch(searchQuery.trim(), resultCount, isListening ? 'voice' : 'text');
        }, 1500);
    }
}

function clearSearch() {
    searchQuery = '';
    elements.searchInput.value = '';
    handleSearch();
    elements.searchInput.focus();
}

function updateClearButton() {
    if (searchQuery.trim()) {
        elements.clearSearchBtn.classList.add('visible');
    } else {
        elements.clearSearchBtn.classList.remove('visible');
    }
}

function updateSearchBarState() {
    const bar = document.querySelector('.search-bar');
    if (!bar) return;
    if (searchQuery.trim()) {
        bar.classList.add('search-active');
    } else {
        bar.classList.remove('search-active');
    }
}

function animateSearchBar() {
    // Pulse the search bar once on load to draw attention
    const bar = document.querySelector('.search-bar');
    if (!bar) return;
    setTimeout(() => {
        bar.classList.add('search-pulse');
        setTimeout(() => bar.classList.remove('search-pulse'), 1800);
    }, 600);
}

// ==================== Event Listeners ====================
function attachEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Voice search
    elements.voiceSearchBtn.addEventListener('click', startVoiceSearch);

    // Text search
    elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        handleSearch();
    });

    // Clear search
    elements.clearSearchBtn.addEventListener('click', clearSearch);

    // Search on Enter key
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Category tabs
    elements.categoryTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Ignore if it's an external link
            if (tab.classList.contains('external-link')) {
                return;
            }

            // Update active tab
            elements.categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update category and render content
            currentCategory = tab.dataset.category;
            renderContent(currentCategory);

            // Close TTS panel if open
            closeTTSPanel();
        });
    });

    // TTS controls
    elements.playBtn.addEventListener('click', playText);
    elements.stopBtn.addEventListener('click', stopSpeech);
    elements.closeBtn.addEventListener('click', closeTTSPanel);
    // ── V.I.R.A. JARVIS MODE ─────────────────────────────────────────
    const viraOverlay  = document.getElementById('viraAssistantOverlay');
    const viraCloseBtn = document.getElementById('viraCloseBtn');
    const viraOrbWrap  = document.getElementById('viraOrbWrap');
    const viraStatus   = document.getElementById('viraStatus');
    const viraWave     = document.getElementById('viraWave');
    const viraTranscript = document.getElementById('viraTranscript');
    const viraMicBtn   = document.getElementById('viraMicBtn');

    let viraRecognition = null;
    let viraIsListening = false;
    let viraIsOpen = false;

    // ── State helpers ──────────────────────────────────────────────
    function viraSetState(state) {
        // state: 'idle' | 'listening' | 'speaking'
        viraOrbWrap.classList.remove('vira-listening', 'vira-speaking');
        viraWave.classList.remove('vira-wave-active', 'vira-wave-speaking');
        viraStatus.classList.remove('listening', 'speaking');
        viraMicBtn.classList.remove('listening');

        if (state === 'listening') {
            viraOrbWrap.classList.add('vira-listening');
            viraWave.classList.add('vira-wave-active');
            viraStatus.classList.add('listening');
            viraMicBtn.classList.add('listening');
            viraStatus.textContent = 'Listening…';
            viraMicBtn.textContent = '🛑';
        } else if (state === 'speaking') {
            viraOrbWrap.classList.add('vira-speaking');
            viraWave.classList.add('vira-wave-speaking');
            viraWave.querySelectorAll('.vira-wave-bar').forEach(b => b.style.animation = 'waveAnim 0.5s ease-in-out infinite alternate');
            viraStatus.classList.add('speaking');
            viraStatus.textContent = 'V.I.R.A. Speaking…';
            viraMicBtn.textContent = '🎤';
        } else {
            viraWave.querySelectorAll('.vira-wave-bar').forEach(b => b.style.animation = '');
            viraStatus.textContent = 'V.I.R.A. Ready';
            viraMicBtn.textContent = '🎤';
        }
    }

    // ── Add transcript bubble ──────────────────────────────────────
    function viraAddMsg(text, who) {
        const msg = document.createElement('div');
        msg.className = `vira-msg ${who}`;
        msg.textContent = text;
        viraTranscript.appendChild(msg);
        viraTranscript.scrollTop = viraTranscript.scrollHeight;
    }

    // ── Speak a response ──────────────────────────────────────────
    function viraSpeak(text, onDone) {
        window.speechSynthesis.cancel();
        viraSetState('speaking');
        viraAddMsg(text, 'vira');

        const utt = new SpeechSynthesisUtterance(text);
        utt.rate  = 0.95;
        utt.pitch = 1.05;
        // Prefer a clear English voice
        const allVoices = window.speechSynthesis.getVoices();
        const preferred = allVoices.find(v => /google us english|zira|david|samantha/i.test(v.name))
                       || allVoices.find(v => v.lang.startsWith('en'));
        if (preferred) utt.voice = preferred;

        utt.onend = () => {
            viraSetState('idle');
            if (onDone) onDone();
        };
        utt.onerror = () => {
            viraSetState('idle');
            if (onDone) onDone();
        };
        window.speechSynthesis.speak(utt);
    }

    // ── Build a spoken reply from search results & AI (JARVIS MODE) ───
    async function viraBuildReply(query) {
        const q = query.trim().toLowerCase();
        const apiKey = localStorage.getItem('vira_gemini_key') || 'AIzaSyBMnnFhFFYL_CuAwd-XkIXpfKtRAUJB82E';

        // 1. Gather context from our local database
        let contextItems = [];
        const catMap = { events:'events', history:'history', facilities:'facilities', 'campus guide':'campus_guide', guide:'campus_guide' };
        
        if (catMap[q]) {
            const items = (viRAData[catMap[q]] || []).slice(0, 3);
            if (items.length) {
                contextItems = items.map(i => `${i.title}: ${i.content.slice(0, 200)}`);
            }
        } else if (['map','maps','navigation','interactive maps'].includes(q)) {
            contextItems = ['Interactive Campus Maps page shows every floor of Celtech College. You can find classrooms, offices, and labs there.'];
        } else {
            Object.values(viRAData).flat().forEach(item => {
                if (item.title.toLowerCase().includes(q) ||
                    item.content.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q)) {
                    contextItems.push(`${item.title}: ${item.content.slice(0, 200)}`);
                }
            });
        }

        const contextText = contextItems.slice(0, 3).join("\n");

        // 2. If no API key, fallback to basic offline mode
        if (!apiKey) {
            if (contextItems.length > 0) {
                return `Here is what I found: ${contextItems[0]}. To enable full Jarvis conversational mode, please add your Google Gemini API key in the admin settings.`;
            }
            return `I'm sorry, I couldn't find information about "${query}" right now. To make me smarter like Jarvis, please add a Gemini API key in settings.`;
        }

        // 3. Jarvis Mode AI Call (Gemini)
        try {
            const systemPrompt = `You are V.I.R.A. (Virtual Interactive Resource Assistant), the AI voice system for Celtech College Olongapo.
Your persona is a mix of J.A.R.V.I.S. from Iron Man and Alexa — highly intelligent, polite, conversational, and concise.
Always refer to yourself as V.I.R.A. if asked. Refer to the user as "sir" or "ma'am" occasionally.
Use the following context from the college database to answer the user's query if relevant. If not relevant, answer conversationally but keep it brief.
CRITICAL: Keep your response under 3 sentences as it will be read aloud by a Text-to-Speech engine.

Context from database:
${contextText || "No specific database matches found for this query."}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: systemPrompt }]
                    },
                    contents: [{
                        role: 'user',
                        parts: [{ text: query }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 150,
                        temperature: 0.7
                    }
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.error("V.I.R.A. AI Error details:", errData);
                throw new Error(errData.error?.message || 'Gemini API Error');
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text.trim();
        } catch (error) {
            console.error("V.I.R.A. AI Error:", error);
            if (contextItems.length > 0) {
                return `I apologize, but I am having trouble connecting to my neural network. However, I found this in our records: ${contextItems[0]}`;
            }
            return "I'm having trouble connecting to my neural network right now. Please check your internet connection or ensure your Gemini API key is valid.";
        }
    }

    // ── Init voice recognition for VIRA mode ─────────────────────
    function viraInitRecognition() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return null;
        const rec = new SR();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onstart  = () => viraSetState('listening');
        rec.onresult = async (e) => {
            const transcript = e.results[0][0].transcript.trim();
            viraAddMsg(transcript, 'user');
            viraIsListening = false;

            // mirror query to main search bar too
            elements.searchInput.value = transcript;
            searchQuery = transcript;
            handleSearch();

            viraSetState('speaking');
            viraStatus.textContent = 'V.I.R.A. Processing...';
            
            const reply = await viraBuildReply(transcript);
            
            // slight pause before speaking
            setTimeout(() => viraSpeak(reply, () => {
                // auto-listen again after reply
                if (viraIsOpen) setTimeout(() => viraStartListen(), 600);
            }), 300);
        };
        rec.onerror  = (e) => {
            viraIsListening = false;
            viraSetState('idle');
            if (e.error !== 'no-speech' && e.error !== 'aborted') {
                viraAddMsg(`Oops — ${e.error}. Tap the mic to try again.`, 'vira');
            }
        };
        rec.onend    = () => { viraIsListening = false; };
        return rec;
    }

    function viraStartListen() {
        if (viraIsListening || !viraIsOpen) return;
        if (!viraRecognition) viraRecognition = viraInitRecognition();
        if (!viraRecognition) {
            viraAddMsg('Speech recognition is not supported in this browser. Try Chrome or Edge.', 'vira');
            return;
        }
        try {
            viraRecognition.start();
            viraIsListening = true;
        } catch(_) {}
    }

    function viraStopListen() {
        viraIsListening = false;
        if (viraRecognition) { try { viraRecognition.stop(); } catch(_){} }
        viraSetState('idle');
    }

    // ── Open / close overlay ──────────────────────────────────────
    function openViraMode() {
        viraIsOpen = true;
        viraOverlay.classList.add('vira-active');
        viraTranscript.innerHTML = '';
        viraSetState('idle');
        document.body.style.overflow = 'hidden';

        // Greet the user
        const hour = new Date().getHours();
        const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
        const greeting = `${greet}. I'm V.I.R.A., your Virtual Interactive Resource Assistant at Celtech College. How may I assist you today?`;
        setTimeout(() => viraSpeak(greeting, () => {
            if (viraIsOpen) setTimeout(() => viraStartListen(), 500);
        }), 400);
    }

    function closeViraMode() {
        viraIsOpen = false;
        viraStopListen();
        window.speechSynthesis.cancel();
        viraOverlay.classList.remove('vira-active');
        document.body.style.overflow = '';
        viraSetState('idle');
    }

    // ── Wire up buttons ───────────────────────────────────────────
    elements.fabBtn.addEventListener('click', openViraMode);

    viraCloseBtn.addEventListener('click', closeViraMode);

    // Esc key closes
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && viraIsOpen) closeViraMode();
    });

    // Mic button toggles listen
    viraMicBtn.addEventListener('click', () => {
        if (viraIsListening) {
            viraStopListen();
        } else {
            window.speechSynthesis.cancel();
            viraSetState('idle');
            setTimeout(() => viraStartListen(), 200);
        }
    });

    // Speed slider
    elements.speedSlider.addEventListener('input', (e) => {
        const speed = parseFloat(e.target.value);
        elements.speedValue.textContent = speed.toFixed(1);

        // Update current utterance if speaking
        if (isPlaying && currentUtterance) {
            const wasPlaying = isPlaying;
            const currentText = elements.ttsText.textContent;
            stopSpeech();
            if (wasPlaying) {
                setTimeout(() => playText(), 100);
            }
        }
    });

    // Voice selector
    elements.voiceSelector.addEventListener('change', () => {
        // Update current utterance if speaking
        if (isPlaying) {
            const wasPlaying = isPlaying;
            stopSpeech();
            if (wasPlaying) {
                setTimeout(() => playText(), 100);
            }
        }
    });

    // Close panel when clicking outside
    elements.ttsPanel.addEventListener('click', (e) => {
        if (e.target === elements.ttsPanel) {
            closeTTSPanel();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Space to play/pause
        if (e.code === 'Space' && elements.ttsPanel.classList.contains('active')) {
            e.preventDefault();
            playText();
        }

        // Escape to close panel
        if (e.code === 'Escape' && elements.ttsPanel.classList.contains('active')) {
            closeTTSPanel();
        }
    });
}

// ==================== Start Application ====================
document.addEventListener('DOMContentLoaded', init);

// ==================== Service Worker Registration ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}
