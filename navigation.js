// Room data for each floor
const floorData = {
    1: [
        { room: "Lobby", description: "Main entrance and waiting area" },
        { room: "Registrar Office", description: "Student enrollment, records, and transcripts" },
        { room: "Finance Office", description: "Tuition payments and financial services" },
        { room: "CESO Office", description: "Community extension services" },
        { room: "Faculty Lounge", description: "Faculty rest and meeting area" },
        { room: "Tourism Lab", description: "Hospitality and tourism training" },
        { room: "OSSAA Office", description: "Student affairs and activities" },
        { room: "Academics Research Office", description: "Research support and resources" },
        { room: "Asset Management Office", description: "Inventory and asset tracking" },
        { room: "Guidance Office", description: "Student counseling and support" },
        { room: "Clinic", description: "Medical services and first aid" },
        { room: "HRS Office", description: "Human resources and staffing" },
        { room: "Onboard Training Office", description: "Maritime training coordination" },
        { room: "Maritime Faculty Room", description: "Maritime instructors office" },
        { room: "CTTHM Storage", description: "Storage for hospitality equipment" },
        { room: "Canteen", description: "Student and faculty dining area" },
        { room: "Kitchen Lab", description: "Culinary arts training kitchen" },
        { room: "Function Room", description: "Events and gatherings" },
        { room: "Chemistry Lab", description: "Chemistry experiments and practicals" },
        { room: "Food & Beverage Lab", description: "F&B service training" },
        { room: "Electrical Lab", description: "Electrical engineering practicals" },
        { room: "Solas Lab", description: "Safety of Life at Sea training" },
        { room: "Mechanical Area", description: "Mechanical workshop" },
        { room: "Refrigeration & Air Conditioning Lab", description: "HVAC training facility" },
        { room: "Basement", description: "Storage and utilities" }
    ],
    2: [
        { room: "School Library & Information Center", description: "Main library with books, journals, computers, and study areas" },
        { room: "Room 201 - Moot Court", description: "Legal studies and mock trials" },
        { room: "Room 202", description: "General classroom" },
        { room: "Room 203", description: "General classroom" },
        { room: "Room 204", description: "General classroom" },
        { room: "Room 205", description: "General classroom" },
        { room: "Room 206", description: "General classroom" },
        { room: "Room 208 - Speech Lab", description: "Communication and public speaking training" },
        { room: "Room 209 - Computer Lab", description: "Modern computers and software for IT courses" },
        { room: "Room 210", description: "General classroom" },
        { room: "Room 211 - Crime Lab", description: "Criminology students, forensic training" },
        { room: "Room 212 - Physics Lab", description: "Physics experiments and practicals" }
    ],
    3: [
        { room: "Skills Lab", description: "Hands-on technical training facility" },
        { room: "Room 301", description: "General classroom for technical courses" },
        { room: "Room 302", description: "General classroom for engineering programs" },
        { room: "Room 303", description: "General classroom for skills training" },
        { room: "Room 304", description: "General classroom for technical instruction" },
        { room: "Room 305", description: "General classroom for vocational courses" },
        { room: "Room 306", description: "General classroom for specialized training" },
        { room: "Room 307", description: "General classroom for technical education" },
        { room: "Room 310", description: "General classroom for academic programs" },
        { room: "Room 311", description: "General classroom" },
        { room: "Room 312", description: "General classroom" },
        { room: "Room 313", description: "General classroom" },
        { room: "Room 314", description: "General classroom" },
        { room: "Room 315", description: "General classroom" },
        { room: "Room 316", description: "General classroom" }
    ],
    4: [
        { room: "MOLA Auditorium", description: "Large multipurpose auditorium for events and assemblies" },
        { room: "Room 404 - Plotting Room", description: "Maritime navigation and chart work" },
        { room: "Room 405", description: "General classroom for maritime courses" },
        { room: "Room 406 - Mock Bridge", description: "Ship bridge simulations and maritime training" },
        { room: "Room 408", description: "General classroom" },
        { room: "Room 409", description: "General classroom" },
        { room: "Room 410", description: "General classroom" },
        { room: "Room 411", description: "General classroom" },
        { room: "Room 412 - GMDSS Room", description: "Global Maritime Distress and Safety System training" },
        { room: "Engineering Simulator", description: "Advanced engineering simulation facility" },
        { room: "Bridge Simulator", description: "Ship bridge simulator for navigation training" }
    ]
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    loadTheme();
    populateRoomLists();

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Enter key for search
    document.getElementById('roomSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchRoom();
        }
    });

    // Initialize voice search
    initVoiceSearchNav();
});

// ==================== Voice Search ====================
let recognitionNav = null;
let isListeningNav = false;

function initVoiceSearchNav() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported');
        document.getElementById('voiceSearchBtnNav').style.display = 'none';
        return;
    }

    recognitionNav = new SpeechRecognition();
    recognitionNav.continuous = false;
    recognitionNav.interimResults = false;
    recognitionNav.lang = 'en-US';

    recognitionNav.onstart = () => {
        isListeningNav = true;
        document.getElementById('voiceSearchBtnNav').classList.add('listening');
        document.getElementById('voiceFeedbackNav').classList.add('active');
    };

    recognitionNav.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('roomSearch').value = transcript;
        searchRoom();
    };

    recognitionNav.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopVoiceSearchNav();

        if (event.error === 'no-speech') {
            showVoiceFeedbackNav('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
            showVoiceFeedbackNav('Microphone access denied.');
        }
    };

    recognitionNav.onend = () => {
        stopVoiceSearchNav();
    };

    // Add click event
    document.getElementById('voiceSearchBtnNav').addEventListener('click', startVoiceSearchNav);
}

function startVoiceSearchNav() {
    if (!recognitionNav) {
        alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
        return;
    }

    if (isListeningNav) {
        stopVoiceSearchNav();
        return;
    }

    try {
        recognitionNav.start();
    } catch (error) {
        console.error('Error starting voice recognition:', error);
    }
}

function stopVoiceSearchNav() {
    isListeningNav = false;
    document.getElementById('voiceSearchBtnNav').classList.remove('listening');
    document.getElementById('voiceFeedbackNav').classList.remove('active');

    if (recognitionNav) {
        try {
            recognitionNav.stop();
        } catch (error) {
            // Ignore errors when stopping
        }
    }
}

function showVoiceFeedbackNav(message) {
    const feedbackEl = document.getElementById('voiceFeedbackNav');
    const textEl = feedbackEl.querySelector('.listening-text-nav');
    const originalText = textEl.textContent;

    textEl.textContent = message;
    feedbackEl.classList.add('active');

    setTimeout(() => {
        textEl.textContent = originalText;
        feedbackEl.classList.remove('active');
    }, 3000);
}

// ==================== Quick Find ====================
function quickFind(query) {
    document.getElementById('roomSearch').value = query;
    searchRoom();

    // Scroll to results
    setTimeout(() => {
        const resultEl = document.getElementById('searchResult');
        if (resultEl.classList.contains('active')) {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
}

// Theme management
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Populate room lists for each floor
function populateRoomLists() {
    for (let floor = 1; floor <= 4; floor++) {
        const container = document.getElementById(`floor${floor}Rooms`);
        const rooms = floorData[floor];

        container.innerHTML = rooms.map(room => `
            <div class="room-item">
                <strong>${room.room}</strong>
                <span>${room.description}</span>
            </div>
        `).join('');
    }
}

// Show specific floor
function showFloor(floorNumber) {
    // Update buttons
    document.querySelectorAll('.floor-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index + 1 === floorNumber);
    });

    // Update floor maps
    document.querySelectorAll('.floor-map').forEach((map, index) => {
        map.classList.toggle('active', index + 1 === floorNumber);
    });
}

// Search for a room
function searchRoom() {
    const query = document.getElementById('roomSearch').value.trim().toLowerCase();
    const resultDiv = document.getElementById('searchResult');

    if (!query) {
        resultDiv.classList.remove('active');
        return;
    }

    let found = false;
    let resultHTML = '';

    // Search through all floors
    for (let floor = 1; floor <= 4; floor++) {
        const rooms = floorData[floor];
        const matches = rooms.filter(room =>
            room.room.toLowerCase().includes(query) ||
            room.description.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            found = true;
            matches.forEach(room => {
                resultHTML += `
                    <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border);">
                        <strong style="color: var(--color-primary); font-size: 1.1rem;">${room.room}</strong>
                        <p style="margin: 0.5rem 0; color: var(--color-text-secondary);">${room.description}</p>
                        <button onclick="showFloor(${floor})" style="padding: 0.5rem 1rem; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600;">
                            📍 View on ${getOrdinal(floor)} Floor Map
                        </button>
                    </div>
                `;
            });
        }
    }

    if (found) {
        resultDiv.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: var(--color-text-primary);">Search Results for "${query}":</h3>
            ${resultHTML}
        `;
        resultDiv.classList.add('active');
    } else {
        resultDiv.innerHTML = `
            <p style="color: var(--color-text-secondary);">
                ❌ No rooms found matching "${query}". Try searching for:
                <br>• Room numbers (e.g., "201", "408")
                <br>• Facilities (e.g., "library", "lab", "canteen")
                <br>• Offices (e.g., "registrar", "clinic", "guidance")
            </p>
        `;
        resultDiv.classList.add('active');
    }
}

// Helper function to get ordinal numbers
function getOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Modal functions
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
}

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==================== Text-to-Speech Functionality ====================
let synth = window.speechSynthesis;
let currentUtterance = null;
let voices = [];
let currentSpeed = 1.0;
let isPaused = false;

// TTS Panel Elements
const ttsPanel = document.getElementById('ttsPanel');
const ttsTitle = document.getElementById('ttsTitle');
const ttsText = document.getElementById('ttsText');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const closeBtn = document.getElementById('closeBtn');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');
const voiceSelector = document.getElementById('voiceSelector');
const progressFill = document.getElementById('progressFill');
const fabBtn = document.getElementById('fabBtn');

// Load available voices
function loadVoices() {
    voices = synth.getVoices();
    voiceSelector.innerHTML = '';

    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.default) {
            option.selected = true;
        }
        voiceSelector.appendChild(option);
    });
}

// Initialize voices
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}
loadVoices();

// Open TTS panel with content
function openTTSPanel(title, content) {
    ttsTitle.textContent = title;
    ttsText.innerHTML = `<p>${content}</p>`;
    ttsPanel.classList.add('active');
    stopSpeech();
}

// Close TTS panel
function closeTTSPanel() {
    ttsPanel.classList.remove('active');
    stopSpeech();
}

// Play/Pause speech
function toggleSpeech() {
    if (!currentUtterance) {
        playText();
    } else if (isPaused) {
        synth.resume();
        isPaused = false;
        playBtn.classList.add('playing');
    } else {
        synth.pause();
        isPaused = true;
        playBtn.classList.remove('playing');
    }
}

// Play text
function playText() {
    const text = ttsText.textContent;

    if (!text) return;

    // Stop any current speech
    stopSpeech();

    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(text);

    // Set voice
    const selectedVoiceIndex = voiceSelector.value;
    if (voices[selectedVoiceIndex]) {
        currentUtterance.voice = voices[selectedVoiceIndex];
    }

    // Set speed
    currentUtterance.rate = currentSpeed;

    // Event handlers
    currentUtterance.onstart = function () {
        playBtn.classList.add('playing');
        isPaused = false;
    };

    currentUtterance.onend = function () {
        playBtn.classList.remove('playing');
        progressFill.style.width = '0%';
        currentUtterance = null;
    };

    currentUtterance.onerror = function (event) {
        console.error('Speech synthesis error:', event);
        playBtn.classList.remove('playing');
        currentUtterance = null;
    };

    // Progress simulation
    currentUtterance.onboundary = function (event) {
        if (event.charIndex !== undefined && text.length > 0) {
            const progress = (event.charIndex / text.length) * 100;
            progressFill.style.width = progress + '%';
        }
    };

    // Speak
    synth.speak(currentUtterance);
}

// Stop speech
function stopSpeech() {
    synth.cancel();
    playBtn.classList.remove('playing');
    progressFill.style.width = '0%';
    currentUtterance = null;
    isPaused = false;
}

// Speed control
speedSlider.addEventListener('input', function () {
    currentSpeed = parseFloat(this.value);
    speedValue.textContent = currentSpeed.toFixed(1);

    // Update current speech if playing
    if (currentUtterance && !isPaused) {
        const wasPlaying = synth.speaking;
        if (wasPlaying) {
            const currentText = ttsText.textContent;
            stopSpeech();
            setTimeout(() => playText(), 100);
        }
    }
});

// Voice selector change
voiceSelector.addEventListener('change', function () {
    // If currently playing, restart with new voice
    if (currentUtterance && !isPaused) {
        const wasPlaying = synth.speaking;
        if (wasPlaying) {
            stopSpeech();
            setTimeout(() => playText(), 100);
        }
    }
});

// Event listeners
playBtn.addEventListener('click', toggleSpeech);
stopBtn.addEventListener('click', stopSpeech);
closeBtn.addEventListener('click', closeTTSPanel);

// FAB button - show welcome message
fabBtn.addEventListener('click', function () {
    const welcomeMessage = `Welcome to V.I.R.A. Campus Navigation! 
    
    I can help you find any location on campus. Use the voice search button to speak your query, 
    or click the Quick Find buttons for popular locations like the Registrar, Library, Canteen, 
    Clinic, Computer Lab, or Auditorium.
    
    You can also browse all rooms by floor using the floor selector buttons. Click on any room 
    to hear its description. The interactive maps can be clicked to zoom in for better detail.
    
    How can I help you navigate Celtech College Olongapo today?`;

    openTTSPanel('V.I.R.A. Navigation Assistant', welcomeMessage);
    playText();
});

// Add listen buttons to room items
function addListenButtons() {
    const roomItems = document.querySelectorAll('.room-item');

    roomItems.forEach(item => {
        // Check if listen button already exists
        if (item.querySelector('.listen-btn')) return;

        const roomName = item.querySelector('strong').textContent;
        const roomDesc = item.querySelector('span').textContent;

        const listenBtn = document.createElement('button');
        listenBtn.className = 'listen-btn';
        listenBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
            </svg>
            Listen
        `;

        listenBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const fullText = `${roomName}. ${roomDesc}`;
            openTTSPanel(roomName, fullText);
            playText();
        });

        item.appendChild(listenBtn);
    });
}

// Update populateRoomLists to add listen buttons
const originalPopulateRoomLists = populateRoomLists;
populateRoomLists = function () {
    originalPopulateRoomLists();
    // Add listen buttons after a short delay to ensure DOM is ready
    setTimeout(addListenButtons, 100);
};

// Update showFloor to add listen buttons
const originalShowFloor = showFloor;
showFloor = function (floorNumber) {
    originalShowFloor(floorNumber);
    // Add listen buttons after showing floor
    setTimeout(addListenButtons, 100);
};

// Update searchRoom to add listen buttons to results
const originalSearchRoom = searchRoom;
searchRoom = function () {
    originalSearchRoom();
    // Add listen buttons to search results
    setTimeout(addListenButtons, 100);
};

// Initialize listen buttons on page load
setTimeout(addListenButtons, 500);

// ==================== You Are Here — Location & Direction System ====================

// Approximate pin positions (as % of image width/height) for known rooms per floor
// These are reference coords; the pin drops at 50% x (center) by default if not found
const ROOM_POSITIONS = {
    1: {
        'Lobby': { x: 50, y: 20 },
        'Registrar Office': { x: 30, y: 35 },
        'Finance Office': { x: 45, y: 35 },
        'CESO Office': { x: 60, y: 35 },
        'Faculty Lounge': { x: 75, y: 45 },
        'Tourism Lab': { x: 25, y: 55 },
        'OSSAA Office': { x: 40, y: 55 },
        'Academics Research Office': { x: 55, y: 55 },
        'Asset Management Office': { x: 70, y: 55 },
        'Guidance Office': { x: 30, y: 65 },
        'Clinic': { x: 50, y: 65 },
        'HRS Office': { x: 70, y: 65 },
        'Canteen': { x: 50, y: 80 },
        'Kitchen Lab': { x: 65, y: 80 },
        'Function Room': { x: 80, y: 80 },
        'Chemistry Lab': { x: 25, y: 80 },
        'Basement': { x: 50, y: 92 }
    },
    2: {
        'School Library & Information Center': { x: 35, y: 30 },
        'Room 201 - Moot Court': { x: 55, y: 30 },
        'Room 202': { x: 25, y: 50 },
        'Room 203': { x: 35, y: 50 },
        'Room 204': { x: 45, y: 50 },
        'Room 205': { x: 55, y: 50 },
        'Room 206': { x: 65, y: 50 },
        'Room 208 - Speech Lab': { x: 75, y: 50 },
        'Room 209 - Computer Lab': { x: 40, y: 70 },
        'Room 210': { x: 55, y: 70 },
        'Room 211 - Crime Lab': { x: 65, y: 70 },
        'Room 212 - Physics Lab': { x: 75, y: 70 }
    },
    3: {
        'Skills Lab': { x: 30, y: 30 },
        'Room 301': { x: 25, y: 50 },
        'Room 302': { x: 35, y: 50 },
        'Room 303': { x: 45, y: 50 },
        'Room 304': { x: 55, y: 50 },
        'Room 305': { x: 65, y: 50 },
        'Room 306': { x: 75, y: 50 },
        'Room 307': { x: 30, y: 70 },
        'Room 310': { x: 45, y: 70 },
        'Room 311': { x: 55, y: 70 },
        'Room 312': { x: 65, y: 70 },
        'Room 313': { x: 75, y: 70 },
        'Room 314': { x: 30, y: 85 },
        'Room 315': { x: 50, y: 85 },
        'Room 316': { x: 70, y: 85 }
    },
    4: {
        'MOLA Auditorium': { x: 40, y: 30 },
        'Room 404 - Plotting Room': { x: 30, y: 55 },
        'Room 405': { x: 45, y: 55 },
        'Room 406 - Mock Bridge': { x: 60, y: 55 },
        'Room 408': { x: 30, y: 70 },
        'Room 409': { x: 45, y: 70 },
        'Room 410': { x: 60, y: 70 },
        'Room 411': { x: 35, y: 82 },
        'Room 412 - GMDSS Room': { x: 55, y: 82 },
        'Engineering Simulator': { x: 70, y: 70 },
        'Bridge Simulator': { x: 75, y: 55 }
    }
};

// My location state
let myLocation = null;   // { floor: 1, room: 'Canteen' }
let locModalFloor = 1;
let locModalSelectedRoom = null;

// ── Location Modal ──────────────────────────────────────────
function openLocationModal() {
    locModalFloor = myLocation ? myLocation.floor : 1;
    locModalSelectedRoom = myLocation ? myLocation.room : null;
    renderLocFloorBtns();
    renderLocRoomList();
    document.getElementById('locRoomSearch').value = '';
    const clearBtn = document.getElementById('locClearBtn');
    if (clearBtn) clearBtn.style.display = myLocation ? 'inline-block' : 'none';
    document.getElementById('locModalOverlay').classList.add('active');
}

function closeLocationModal() {
    document.getElementById('locModalOverlay').classList.remove('active');
}

function selectLocFloor(floor) {
    locModalFloor = floor;
    locModalSelectedRoom = null;
    document.getElementById('locRoomSearch').value = '';
    renderLocFloorBtns();
    renderLocRoomList();
}

function renderLocFloorBtns() {
    document.querySelectorAll('#locFloorSelect .loc-floor-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.floor) === locModalFloor);
    });
}

function filterLocRooms() {
    renderLocRoomList(document.getElementById('locRoomSearch').value);
}

function renderLocRoomList(filter = '') {
    const container = document.getElementById('locRoomList');
    const rooms = floorData[locModalFloor] || [];
    const filtered = filter
        ? rooms.filter(r => r.room.toLowerCase().includes(filter.toLowerCase()))
        : rooms;

    container.innerHTML = filtered.map(r => `
        <div class="loc-room-opt ${locModalSelectedRoom === r.room ? 'selected' : ''}"
             onclick="selectLocRoom('${r.room.replace(/'/g, "\\'")}')">
            ${r.room}
        </div>
    `).join('');
}

function selectLocRoom(roomName) {
    locModalSelectedRoom = roomName;
    renderLocRoomList(document.getElementById('locRoomSearch').value);
}

function confirmLocation() {
    if (!locModalSelectedRoom) {
        const rooms = floorData[locModalFloor];
        if (rooms && rooms.length) locModalSelectedRoom = rooms[0].room;
    }
    myLocation = { floor: locModalFloor, room: locModalSelectedRoom };
    closeLocationModal();
    updateLocationBar();
    placeYouAreHerePin();
    updateDirectionPanelIfActive();
}

function clearMyLocation() {
    myLocation = null;
    closeLocationModal();
    updateLocationBar();
    removeAllPins('you-are-here-pin');
    document.getElementById('directionPanel').classList.remove('active');
}

function updateLocationBar() {
    const bar = document.getElementById('setLocationBar');
    const title = document.getElementById('slbTitle');
    const sub = document.getElementById('slbSub');
    const btn = document.getElementById('slbBtn');

    if (myLocation) {
        bar.classList.add('has-location');
        title.textContent = `📍 You are at: ${myLocation.room}`;
        sub.textContent = `${getOrdinal(myLocation.floor)} Floor — Tap to change your location`;
        btn.textContent = '✏️ Change';
        btn.className = 'slb-btn';
    } else {
        bar.classList.remove('has-location');
        title.textContent = 'Set Your Location';
        sub.textContent = 'Tap to mark where you are on the map for guided directions';
        btn.textContent = '📍 Set Location';
        btn.className = 'slb-btn';
    }
}

// ── Pin Rendering ───────────────────────────────────────────
function buildPinHTML(label, isDestination = false) {
    const cls = isDestination ? 'you-are-here-pin destination-pin' : 'you-are-here-pin';
    return `
    <div class="${cls}">
        <div class="pin-marker"><div class="pin-marker-inner"></div></div>
        <div class="pin-label">${label}</div>
    </div>`;
}

function placePin(floor, room, isDestination = false) {
    const wrapperId = `mapWrapper${floor}`;
    const wrapper = document.getElementById(wrapperId);
    const img = document.getElementById(`mapImg${floor}`);
    if (!wrapper || !img) return;

    // Remove existing pins of same type
    const cls = isDestination ? 'destination-pin' : 'you-are-here-pin:not(.destination-pin)';
    wrapper.querySelectorAll(isDestination ? '.destination-pin' : '.you-are-here-pin:not(.destination-pin)').forEach(p => p.remove());

    const pos = (ROOM_POSITIONS[floor] && ROOM_POSITIONS[floor][room])
        ? ROOM_POSITIONS[floor][room]
        : { x: 50, y: 50 };

    const label = isDestination ? `📍 ${room}` : '📍 You Are Here';
    const pin = document.createElement('div');
    pin.className = isDestination ? 'you-are-here-pin destination-pin' : 'you-are-here-pin';
    pin.innerHTML = `<div class="pin-marker"><div class="pin-marker-inner"></div></div><div class="pin-label">${label}</div>`;
    pin.style.left = pos.x + '%';
    pin.style.top = pos.y + '%';
    wrapper.appendChild(pin);
}

function placeYouAreHerePin() {
    if (!myLocation) return;
    showFloor(myLocation.floor);
    placePin(myLocation.floor, myLocation.room, false);
}

function removeAllPins(className) {
    document.querySelectorAll('.' + className).forEach(p => p.remove());
}

// ── Direction Generation ────────────────────────────────────
function generateDirections(fromFloor, fromRoom, toFloor, toRoom) {
    const steps = [];

    if (fromFloor === toFloor) {
        steps.push(`You are currently at <strong>${fromRoom}</strong> on the <strong>${getOrdinal(fromFloor)} Floor</strong>.`);
        steps.push(`Head to <strong>${toRoom}</strong> — it is on the same floor as you.`);
        steps.push(`Look for the room signs along the corridor. You should arrive shortly.`);
    } else {
        steps.push(`Start at <strong>${fromRoom}</strong> on the <strong>${getOrdinal(fromFloor)} Floor</strong>.`);

        if (toFloor > fromFloor) {
            steps.push(`Head to the <strong>staircase or elevator</strong> and go <strong>UP</strong> ${toFloor - fromFloor} floor${toFloor - fromFloor > 1 ? 's' : ''}.`);
        } else {
            steps.push(`Head to the <strong>staircase or elevator</strong> and go <strong>DOWN</strong> ${fromFloor - toFloor} floor${fromFloor - toFloor > 1 ? 's' : ''}.`);
        }

        steps.push(`You will arrive at the <strong>${getOrdinal(toFloor)} Floor</strong>.`);
        steps.push(`Follow the corridor signs to find <strong>${toRoom}</strong>.`);
    }

    steps.push(`🎉 You have arrived at <strong>${toRoom}</strong>!`);
    return steps;
}

function showDirectionPanel(toFloor, toRoom) {
    const panel = document.getElementById('directionPanel');
    const titleEl = document.getElementById('dirTitle');
    const subtitleEl = document.getElementById('dirSubtitle');
    const stepsEl = document.getElementById('directionSteps');

    titleEl.textContent = `Directions to ${toRoom}`;

    if (myLocation) {
        subtitleEl.innerHTML = `From <strong>${myLocation.room}</strong> (${getOrdinal(myLocation.floor)} Floor)
            <span class="dir-floor-badge">${getOrdinal(toFloor)} Floor</span>`;
        const steps = generateDirections(myLocation.floor, myLocation.room, toFloor, toRoom);
        stepsEl.innerHTML = steps.map((s, i) => `
            <div class="dir-step">
                <div class="dir-step-num">${i + 1}</div>
                <div class="dir-step-text">${s}</div>
            </div>
        `).join('');
    } else {
        subtitleEl.innerHTML = `<strong>${toRoom}</strong> is on the <span class="dir-floor-badge">${getOrdinal(toFloor)} Floor</span>
            — <a href="javascript:openLocationModal()" style="color:#10b981;font-weight:600">Set your location</a> for step-by-step directions`;
        stepsEl.innerHTML = `
            <div class="dir-step">
                <div class="dir-step-num">ℹ️</div>
                <div class="dir-step-text"><strong>${toRoom}</strong> is located on the <strong>${getOrdinal(toFloor)} Floor</strong>. ${floorData[toFloor].find(r=>r.room===toRoom)?.description || ''}</div>
            </div>
            <div class="dir-step">
                <div class="dir-step-num">📍</div>
                <div class="dir-step-text">Tap <strong>"Set Location"</strong> above to get personalised step-by-step directions from your current position.</div>
            </div>`;
    }

    panel.classList.add('active');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateDirectionPanelIfActive() {
    // If the direction panel is open, refresh it with current "my location"
    const panel = document.getElementById('directionPanel');
    if (panel && panel.classList.contains('active')) {
        const titleEl = document.getElementById('dirTitle');
        const titleText = titleEl ? titleEl.textContent : '';
        // Identify destination from title "Directions to <room>"
        const match = titleText.match(/^Directions to (.+)$/);
        if (match) {
            const destRoom = match[1];
            for (let f = 1; f <= 4; f++) {
                const found = floorData[f].find(r => r.room === destRoom);
                if (found) { showDirectionPanel(f, destRoom); break; }
            }
        }
    }
}

// ── Override quickFind and searchRoom to show directions + pins ──
const _origQuickFind = quickFind;
quickFind = function(query) {
    _origQuickFind(query);
    // Find where this room is and show directions
    setTimeout(() => {
        for (let f = 1; f <= 4; f++) {
            const found = floorData[f].find(r =>
                r.room.toLowerCase().includes(query.toLowerCase()) ||
                r.description.toLowerCase().includes(query.toLowerCase())
            );
            if (found) {
                showDirectionPanel(f, found.room);
                placePin(f, found.room, true); // destination pin
                if (myLocation) placeYouAreHerePin();
                break;
            }
        }
    }, 150);
};

// Override searchRoom to add direction & destination pin on first result
const _origSearchRoomDir = searchRoom;
searchRoom = function() {
    _origSearchRoomDir();
    setTimeout(() => {
        const query = document.getElementById('roomSearch').value.trim().toLowerCase();
        if (!query) {
            document.getElementById('directionPanel').classList.remove('active');
            return;
        }
        for (let f = 1; f <= 4; f++) {
            const found = floorData[f].find(r =>
                r.room.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query)
            );
            if (found) {
                showDirectionPanel(f, found.room);
                placePin(f, found.room, true);
                if (myLocation) placeYouAreHerePin();
                break;
            }
        }
    }, 150);
};

// ==================== Service Worker Registration ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}
