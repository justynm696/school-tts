# Data Flow Diagram (DFD)
## V.I.R.A. - CeltechVoice Application

### Overview
This document presents comprehensive Data Flow Diagrams (DFD) for the V.I.R.A. (Virtual Interactive Resource Assistant) text-to-speech application, showing how data flows through the system at different levels of abstraction.

---

## Context Diagram (Level 0 DFD)

The highest-level view showing the system as a single process with external entities.

```
┌──────────────┐
│              │
│     USER     │
│              │
└───────┬──────┘
        │
        │ Voice Commands
        │ Search Queries
        │ UI Interactions
        │ Theme Preferences
        │
        ▼
┌────────────────────────────────────────┐
│                                        │
│    V.I.R.A. CELTECHVOICE SYSTEM       │
│   (Text-to-Speech Application)         │
│                                        │
└───────┬────────────────────────────────┘
        │
        │ Audio Output (TTS)
        │ Visual Content Display
        │ Search Results
        │ Navigation Information
        │
        ▼
┌──────────────┐
│              │
│     USER     │
│              │
└──────────────┘

External Data Sources:
┌──────────────────┐
│  Browser APIs    │──────► Web Speech API (TTS)
│                  │──────► Speech Recognition API
│                  │──────► LocalStorage API
└──────────────────┘

┌──────────────────┐
│  Static Data     │──────► data.js (School Data)
│                  │──────► navigation.js (Map Data)
└──────────────────┘
```

---

## Level 1 DFD - Main System Processes

Shows the major processes within the V.I.R.A. system.

```
                    ┌──────────────┐
                    │     USER     │
                    └───────┬──────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        │ Search Query      │ Category          │ Voice Command
        │                   │ Selection         │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   PROCESS 1   │   │   PROCESS 2   │   │   PROCESS 3   │
│               │   │               │   │               │
│    SEARCH     │   │   CONTENT     │   │     VOICE     │
│    ENGINE     │   │   DISPLAY     │   │   ASSISTANT   │
│               │   │               │   │               │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        │ Filtered Results  │ Content Items     │ Recognized Text
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │   PROCESS 4   │
                    │               │
                    │  TTS ENGINE   │
                    │   (Playback)  │
                    │               │
                    └───────┬───────┘
                            │
                            │ Audio Output
                            ▼
                    ┌───────────────┐
                    │  Web Speech   │
                    │      API      │
                    └───────┬───────┘
                            │
                            ▼
                    ┌──────────────┐
                    │     USER     │
                    │  (Listening) │
                    └──────────────┘

        ┌───────────────────────────────┐
        │   DATA STORE 1: SCHOOL DATA   │
        │  (Events, History, Facilities,│
        │      Campus Guide)            │
        └───────────────┬───────────────┘
                        │
                        │ Read Data
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    PROCESS 1       PROCESS 2       PROCESS 3
    (Search)        (Display)       (Voice)

        ┌───────────────────────────────┐
        │ DATA STORE 2: USER PREFERENCES│
        │  (Theme, Voice, Speed, etc.)  │
        └───────────────┬───────────────┘
                        │
                        │ Read/Write
                        │
                        ▼
                    PROCESS 4
                    (TTS Engine)

        ┌───────────────────────────────┐
        │ DATA STORE 3: NAVIGATION DATA │
        │  (Floor Plans, Locations)     │
        └───────────────┬───────────────┘
                        │
                        │ Read Data
                        │
                        ▼
                    PROCESS 5
                (Interactive Maps)
```

---

## Level 2 DFD - Detailed Process Breakdown

### Process 1: Search Engine (Detailed)

```
┌──────────────┐
│     USER     │
└───────┬──────┘
        │
        │ Search Input
        │ (Text/Voice)
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 1.1                     │
│      INPUT VALIDATION                   │
│  - Sanitize input                       │
│  - Convert to lowercase                 │
│  - Trim whitespace                      │
└───────┬─────────────────────────────────┘
        │
        │ Validated Query
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 1.2                     │
│      SEARCH ALGORITHM                   │
│  - Check special pages                  │
│  - Search content titles                │
│  - Search content text                  │
│  - Search navigation data               │
│  - Rank results by relevance            │
└───────┬─────────────────────────────────┘
        │
        │ Read Data
        ▼
┌─────────────────────────────────────────┐
│      DATA STORE: SCHOOL DATA            │
│  - events[]                             │
│  - history[]                            │
│  - facilities[]                         │
│  - campus_guide[]                       │
└─────────────────────────────────────────┘
        │
        │ Matched Items
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 1.3                     │
│      RESULT FORMATTING                  │
│  - Create result cards                  │
│  - Add highlight to matches             │
│  - Sort by priority                     │
└───────┬─────────────────────────────────┘
        │
        │ Formatted Results
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 1.4                     │
│      DISPLAY RESULTS                    │
│  - Render cards to DOM                  │
│  - Show result count                    │
│  - Handle no results                    │
└───────┬─────────────────────────────────┘
        │
        │ Visual Output
        ▼
┌──────────────┐
│     USER     │
└──────────────┘
```

### Process 2: Content Display (Detailed)

```
┌──────────────┐
│     USER     │
└───────┬──────┘
        │
        │ Category Selection
        │ (events/history/facilities/campus_guide)
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 2.1                     │
│      CATEGORY FILTER                    │
│  - Identify selected category           │
│  - Update active tab UI                 │
└───────┬─────────────────────────────────┘
        │
        │ Category Name
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 2.2                     │
│      DATA RETRIEVAL                     │
│  - Fetch data from schoolData object    │
│  - Filter by category                   │
└───────┬─────────────────────────────────┘
        │
        │ Read Data
        ▼
┌─────────────────────────────────────────┐
│      DATA STORE: SCHOOL DATA            │
│  schoolData[category]                   │
└─────────────────────────────────────────┘
        │
        │ Content Items Array
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 2.3                     │
│      CARD GENERATION                    │
│  - Loop through items                   │
│  - Create HTML card elements            │
│  - Add icons and metadata               │
│  - Attach event listeners               │
└───────┬─────────────────────────────────┘
        │
        │ HTML Cards
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 2.4                     │
│      DOM RENDERING                      │
│  - Clear existing content               │
│  - Append new cards                     │
│  - Apply animations                     │
└───────┬─────────────────────────────────┘
        │
        │ Visual Display
        ▼
┌──────────────┐
│     USER     │
└──────────────┘
```

### Process 3: Voice Assistant (Detailed)

```
┌──────────────┐
│     USER     │
└───────┬──────┘
        │
        │ Voice Input
        │ (Microphone)
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 3.1                     │
│      MICROPHONE ACCESS                  │
│  - Request permission                   │
│  - Initialize SpeechRecognition         │
│  - Start listening                      │
└───────┬─────────────────────────────────┘
        │
        │ Audio Stream
        ▼
┌─────────────────────────────────────────┐
│    EXTERNAL: SPEECH RECOGNITION API     │
│  - Convert speech to text               │
│  - Handle language detection            │
└───────┬─────────────────────────────────┘
        │
        │ Recognized Text
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 3.2                     │
│      COMMAND PROCESSING                 │
│  - Parse voice command                  │
│  - Identify intent                      │
│  - Extract keywords                     │
└───────┬─────────────────────────────────┘
        │
        │ Processed Command
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 3.3                     │
│      ACTION EXECUTION                   │
│  - Trigger search (if search command)   │
│  - Navigate to page (if nav command)    │
│  - Read content (if TTS command)        │
└───────┬─────────────────────────────────┘
        │
        │ Action Result
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 3.4                     │
│      FEEDBACK DISPLAY                   │
│  - Show voice feedback UI               │
│  - Display recognized text              │
│  - Indicate processing status           │
└───────┬─────────────────────────────────┘
        │
        │ Visual/Audio Feedback
        ▼
┌──────────────┐
│     USER     │
└──────────────┘
```

### Process 4: TTS Engine (Detailed)

```
┌──────────────┐
│     USER     │
└───────┬──────┘
        │
        │ Content Selection
        │ (Click on card)
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 4.1                     │
│      CONTENT EXTRACTION                 │
│  - Get title and content text           │
│  - Store in currentText variable        │
│  - Open TTS panel                       │
└───────┬─────────────────────────────────┘
        │
        │ Text Content
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 4.2                     │
│      SETTINGS RETRIEVAL                 │
│  - Get voice preference                 │
│  - Get speech rate                      │
│  - Get volume level                     │
└───────┬─────────────────────────────────┘
        │
        │ Read Settings
        ▼
┌─────────────────────────────────────────┐
│   DATA STORE: USER PREFERENCES          │
│  - voiceId                              │
│  - speechRate                           │
│  - volume                               │
└─────────────────────────────────────────┘
        │
        │ Settings Data
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 4.3                     │
│      UTTERANCE CREATION                 │
│  - Create SpeechSynthesisUtterance      │
│  - Set voice, rate, volume              │
│  - Attach event handlers                │
└───────┬─────────────────────────────────┘
        │
        │ Utterance Object
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 4.4                     │
│      SPEECH SYNTHESIS                   │
│  - Call speechSynthesis.speak()         │
│  - Monitor playback progress            │
│  - Update progress bar                  │
└───────┬─────────────────────────────────┘
        │
        │ Audio Output
        ▼
┌─────────────────────────────────────────┐
│    EXTERNAL: WEB SPEECH API             │
│  - Generate audio from text             │
│  - Apply voice characteristics          │
└───────┬─────────────────────────────────┘
        │
        │ Audio Stream
        ▼
┌──────────────┐
│     USER     │
│  (Listening) │
└──────────────┘

        ┌─────────────────────────┐
        │   PROCESS 4.5           │
        │   PLAYBACK CONTROLS     │
        │  - Play/Pause           │
        │  - Stop                 │
        │  - Speed adjustment     │
        └───────┬─────────────────┘
                │
                │ Control Commands
                │
        ┌───────┴─────────┐
        │                 │
        ▼                 ▼
    Resume/Pause      Cancel
    Synthesis         Synthesis
```

### Process 5: Interactive Maps (Detailed)

```
┌──────────────┐
│     USER     │
└───────┬──────┘
        │
        │ Navigate to Maps Page
        │
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 5.1                     │
│      PAGE INITIALIZATION                │
│  - Load navigation.html                 │
│  - Initialize floor selector            │
│  - Set default floor (1)                │
└───────┬─────────────────────────────────┘
        │
        │ Floor Selection
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 5.2                     │
│      FLOOR DATA RETRIEVAL               │
│  - Get floor number                     │
│  - Fetch locations for floor            │
└───────┬─────────────────────────────────┘
        │
        │ Read Data
        ▼
┌─────────────────────────────────────────┐
│   DATA STORE: NAVIGATION DATA           │
│  navigationData.floors[floorNumber]     │
└─────────────────────────────────────────┘
        │
        │ Location Data Array
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 5.3                     │
│      MAP RENDERING                      │
│  - Display floor plan image             │
│  - Plot location markers                │
│  - Add interactive hotspots             │
└───────┬─────────────────────────────────┘
        │
        │ Interactive Map
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 5.4                     │
│      LOCATION SEARCH                    │
│  - Accept search query                  │
│  - Filter locations                     │
│  - Highlight matching rooms             │
└───────┬─────────────────────────────────┘
        │
        │ Search Results
        ▼
┌─────────────────────────────────────────┐
│         PROCESS 5.5                     │
│      LOCATION DETAILS                   │
│  - Show room information                │
│  - Display description                  │
│  - Provide directions                   │
└───────┬─────────────────────────────────┘
        │
        │ Location Info
        ▼
┌──────────────┐
│     USER     │
└──────────────┘
```

---

## Data Flow Details

### 1. Search Flow

```
User Input → Input Validation → Search Algorithm → Data Store Query → 
Result Ranking → Result Formatting → DOM Rendering → User Display
```

**Data Transformations:**
1. Raw input: `"library"`
2. Validated: `"library"` (lowercase, trimmed)
3. Search results: `[{id: 'fac8', title: 'School Library...', ...}]`
4. Formatted HTML: `<div class="content-card">...</div>`
5. Rendered: Visual card in browser

### 2. TTS Playback Flow

```
Content Selection → Text Extraction → Settings Retrieval → 
Utterance Creation → Speech Synthesis → Audio Output → 
Progress Monitoring → Completion Handling
```

**Data Transformations:**
1. Content object: `{id: 'evt1', title: '...', content: '...'}`
2. Text string: `"Annual Science Fair 2026. Get ready for..."`
3. Utterance object: `SpeechSynthesisUtterance {text: '...', voice: '...', rate: 1.0}`
4. Audio stream: Binary audio data
5. Progress: `0% → 25% → 50% → 75% → 100%`

### 3. Voice Command Flow

```
Voice Input → Speech Recognition → Text Conversion → 
Command Parsing → Intent Identification → Action Execution → 
Feedback Display
```

**Data Transformations:**
1. Audio input: Binary audio stream
2. Recognized text: `"search for library"`
3. Parsed command: `{action: 'search', query: 'library'}`
4. Execution: Trigger search process
5. Feedback: `"Searching for library..."`

### 4. Theme Toggle Flow

```
User Click → Theme State Check → Theme Switch → 
LocalStorage Update → CSS Class Update → Visual Change
```

**Data Transformations:**
1. Current theme: `"light"`
2. New theme: `"dark"`
3. LocalStorage: `{theme: "dark"}`
4. DOM update: `<body class="dark-theme">`
5. Visual: Dark color scheme applied

---

## Data Stores

### Data Store 1: School Data (data.js)

**Structure:**
```javascript
{
  events: Array<Event>,
  history: Array<History>,
  facilities: Array<Facility>,
  campus_guide: Array<Guide>
}
```

**Access Pattern:**
- Read-only
- Accessed by: Search Engine, Content Display, Voice Assistant
- Update frequency: Manual (developer updates file)

### Data Store 2: User Preferences (LocalStorage)

**Structure:**
```javascript
{
  theme: "light" | "dark",
  voiceId: string,
  speechRate: number,
  lastCategory: string,
  searchHistory: string[]
}
```

**Access Pattern:**
- Read/Write
- Accessed by: TTS Engine, Theme Manager, Search Engine
- Update frequency: On user action

### Data Store 3: Navigation Data (navigation.js)

**Structure:**
```javascript
{
  floors: {
    1: Array<Location>,
    2: Array<Location>,
    3: Array<Location>,
    4: Array<Location>
  }
}
```

**Access Pattern:**
- Read-only
- Accessed by: Interactive Maps, Search Engine
- Update frequency: Manual (developer updates file)

### Data Store 4: Session State (In-Memory)

**Structure:**
```javascript
{
  currentCategory: string,
  currentText: string,
  currentTitle: string,
  isPlaying: boolean,
  currentUtterance: SpeechSynthesisUtterance,
  voices: Array<SpeechSynthesisVoice>
}
```

**Access Pattern:**
- Read/Write
- Accessed by: All processes
- Update frequency: Continuous during session
- Persistence: Lost on page reload

---

## External Interfaces

### 1. Web Speech API (Speech Synthesis)

**Input:** Text string, voice settings
**Output:** Audio stream
**Data Flow:** TTS Engine → Web Speech API → Audio Output

### 2. Web Speech API (Speech Recognition)

**Input:** Audio stream from microphone
**Output:** Recognized text
**Data Flow:** Microphone → Speech Recognition API → Voice Assistant

### 3. LocalStorage API

**Input:** Key-value pairs
**Output:** Stored data retrieval
**Data Flow:** Bidirectional (Read/Write)

### 4. Service Worker

**Input:** Network requests, cache strategies
**Output:** Cached resources, offline functionality
**Data Flow:** Browser → Service Worker → Cache → Browser

---

## Error Handling Flows

### Search Error Flow
```
Invalid Input → Validation Error → Error Message Display → 
User Notification → Clear Input → Ready for New Input
```

### TTS Error Flow
```
Synthesis Error → Error Event Handler → Stop Playback → 
Reset UI State → Error Message Display → Ready for Retry
```

### Voice Recognition Error Flow
```
Recognition Error → Error Handler → Stop Listening → 
Feedback Display → Microphone Reset → Ready for Retry
```

---

## Performance Optimization Flows

### 1. Lazy Loading Flow
```
Page Load → Load Critical Resources → User Interaction → 
Load Additional Resources → Cache for Future Use
```

### 2. Debounced Search Flow
```
User Typing → Wait for Pause (300ms) → Execute Search → 
Display Results → Cache Results
```

### 3. Progressive Web App Flow
```
First Visit → Cache Static Assets → Subsequent Visits → 
Load from Cache → Background Update → Update Cache
```

---

## Security and Privacy Flows

### 1. Microphone Permission Flow
```
User Clicks Voice Button → Request Permission → 
User Grants/Denies → Store Decision → Enable/Disable Feature
```

### 2. Data Privacy Flow
```
User Data → LocalStorage Only → No Server Transmission → 
User Control → Clear Data Option
```

---

## Summary

The V.I.R.A. system employs a **client-side architecture** with the following key characteristics:

1. **Unidirectional Data Flow:** User → Process → Data Store → Display
2. **Event-Driven:** User interactions trigger processes
3. **Stateless Operations:** Most processes are stateless, relying on data stores
4. **Asynchronous Processing:** TTS and voice recognition operate asynchronously
5. **Offline-First:** PWA architecture enables offline functionality

**Key Data Flows:**
- **Search:** Input → Validation → Query → Results → Display
- **TTS:** Selection → Settings → Synthesis → Audio → Progress
- **Voice:** Audio → Recognition → Command → Action → Feedback
- **Navigation:** Selection → Data → Rendering → Interaction

---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Author:** V.I.R.A. Development Team
