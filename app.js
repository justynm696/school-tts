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
    renderContent(currentCategory);
    attachEventListeners();
    initVoiceSearch();

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

// ==================== Content Rendering ====================
function renderContent(category) {
    elements.contentSection.innerHTML = '';

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
        Object.keys(schoolData).forEach(categoryKey => {
            const categoryData = schoolData[categoryKey];
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
        const data = schoolData[category] || [];
        filteredData = data.map(item => ({
            ...item,
            sourceCategory: category
        }));
    }

    const totalResults = filteredData.length + specialPages.length;

    if (totalResults === 0) {
        const message = searchQuery.trim()
            ? `No results found for "${searchQuery}"`
            : `No ${category} available at the moment.`;
        elements.contentSection.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--color-text-tertiary);">
                <p style="font-size: 1.125rem;">${message}</p>
            </div>
        `;
        return;
    }

    // Show search results count if searching
    if (searchQuery.trim()) {
        const resultsHeader = document.createElement('div');
        resultsHeader.style.cssText = 'padding: 1rem 0; color: var(--color-text-secondary); font-size: 0.95rem;';
        resultsHeader.innerHTML = `<strong>${totalResults}</strong> result${totalResults !== 1 ? 's' : ''} found for "<strong>${searchQuery}</strong>"`;
        elements.contentSection.appendChild(resultsHeader);
    }

    // Render special pages first
    specialPages.forEach((item, index) => {
        const card = createSpecialPageCard(item, index);
        elements.contentSection.appendChild(card);
    });

    // Then render regular content
    filteredData.forEach((item, index) => {
        const card = item.isLocation ? createLocationCard(item, index + specialPages.length) : createContentCard(item, index + specialPages.length);
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
    currentUtterance.onstart = () => {
        isPlaying = true;
        elements.playBtn.classList.add('playing');
        animateProgress();
    };

    currentUtterance.onend = () => {
        isPlaying = false;
        elements.playBtn.classList.remove('playing');
        elements.progressFill.style.width = '0%';
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
}

function clearSearch() {
    searchQuery = '';
    elements.searchInput.value = '';
    handleSearch();
}

function updateClearButton() {
    if (searchQuery.trim()) {
        elements.clearSearchBtn.classList.add('visible');
    } else {
        elements.clearSearchBtn.classList.remove('visible');
    }
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
    elements.fabBtn.addEventListener('click', () => {
        if (currentText) {
            openTTSPanel(currentTitle, currentText);
        } else {
            // Open with default message
            openTTSPanel(
                'Welcome to V.I.R.A. - Virtual Interactive Resource Assistant',
                'Hello! I am V.I.R.A., your Virtual Interactive Resource Assistant for Celtech College Olongapo. Select any announcement, event, schedule, or news item to have it read aloud to you. You can adjust the speech speed and choose different voices from the controls below. Try using voice search to find what you need!'
            );
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
