# Entity Relationship Diagram (ERD)
## V.I.R.A. - CeltechVoice Application

### Overview
This ERD represents the data structure and relationships within the V.I.R.A. (Virtual Interactive Resource Assistant) text-to-speech application for Celtech College Olongapo.

---

## Entities and Attributes

### 1. **EVENTS**
Primary entity for school events and announcements.

**Attributes:**
- `id` (PK) - Unique identifier (e.g., 'evt1', 'evt2')
- `title` - Event name/title
- `content` - Detailed event description
- `date` - Event date (YYYY-MM-DD format)
- `category` - Event classification (Competition, Sports, Cultural, Academic)
- `priority` - Importance level (high, medium, low)
- `icon` - Emoji/icon representation

**Sample Data:**
```
evt1 | Annual Science Fair 2026 | 2026-02-15 | Competition | high | 🔬
evt2 | Basketball Tournament | 2026-01-25 | Sports | medium | 🏀
```

---

### 2. **HISTORY**
Entity for institutional history and milestones.

**Attributes:**
- `id` (PK) - Unique identifier (e.g., 'hist1', 'hist2')
- `title` - Historical milestone title
- `content` - Detailed historical information
- `date` - Date of milestone (YYYY-MM-DD format)
- `category` - Classification (Foundation, Expansion, Modernization, Leadership, etc.)
- `priority` - Importance level (high, medium, low)
- `icon` - Emoji/icon representation

**Sample Data:**
```
hist1 | Phase 1: Founding (1959) | 1959-09-24 | Foundation | high | 🏛️
hist2 | Expansion to Olongapo | 1975-01-01 | Expansion | medium | 📈
```

---

### 3. **FACILITIES**
Entity for campus facilities and resources.

**Attributes:**
- `id` (PK) - Unique identifier (e.g., 'fac1', 'fac2')
- `title` - Facility name
- `content` - Detailed facility description, equipment, and services
- `date` - Last updated date
- `category` - Facility type (Technology, Maritime, Healthcare, etc.)
- `priority` - Importance level (high, medium, low)
- `icon` - Emoji/icon representation

**Sample Data:**
```
fac1 | Computer Laboratories | 2026-01-24 | Technology | high | 💻
fac2 | Maritime Training Facilities | 2026-01-24 | Maritime | high | ⚓
```

---

### 4. **CAMPUS_GUIDE**
Entity for campus navigation and location information.

**Attributes:**
- `id` (PK) - Unique identifier (e.g., 'guide1', 'guide2')
- `title` - Location/floor description
- `content` - Detailed navigation information and room listings
- `date` - Last updated date
- `category` - Guide type (Navigation, Rooms, Services)
- `priority` - Importance level (high, medium, low)
- `icon` - Emoji/icon representation

**Sample Data:**
```
guide1 | 1st Floor - Main Entrance | 2026-01-23 | Navigation | high | 🏢
guide2 | 1st Floor - Room Directory | 2026-01-23 | Rooms | high | 🚪
```

---

### 5. **NAVIGATION_DATA**
Entity for interactive campus navigation system.

**Attributes:**
- `id` (PK) - Unique identifier
- `floor` - Floor number (1, 2, 3, 4)
- `name` - Room/location name
- `type` - Location type (office, lab, classroom, facility)
- `description` - Detailed location description
- `keywords` - Search keywords array
- `coordinates` - X, Y coordinates for floor plan
- `icon` - Emoji/icon representation

**Sample Data:**
```
Floor 1 | Registrar Office | office | Student enrollment and records | [registrar, enrollment] | {x: 150, y: 200} | 📋
Floor 2 | Library | facility | School Library and Information Center | [library, books, study] | {x: 100, y: 150} | 📚
```

---

### 6. **USER_PREFERENCES**
Entity for storing user settings (stored in browser localStorage).

**Attributes:**
- `userId` (PK) - Browser session identifier
- `theme` - UI theme preference (light/dark)
- `voiceId` - Selected TTS voice
- `speechRate` - Speech speed (0.5 - 2.0)
- `lastCategory` - Last viewed category
- `searchHistory` - Array of recent searches

**Sample Data:**
```
user_001 | dark | Google US English | 1.0 | events | [library, canteen, registrar]
```

---

### 7. **VOICE_SETTINGS**
Entity for text-to-speech configuration.

**Attributes:**
- `voiceId` (PK) - Voice identifier
- `name` - Voice name
- `lang` - Language code (en-US, en-GB, etc.)
- `gender` - Voice gender (male/female)
- `localService` - Boolean (local/remote voice)

**Sample Data:**
```
Google US English | en-US | female | true
Microsoft David | en-US | male | true
```

---

## Entity Relationships

### Relationship Diagram

```
┌─────────────────┐
│     EVENTS      │
│  (id, title,    │
│   content...)   │
└────────┬────────┘
         │
         │ 1:N (displayed in)
         │
         ▼
┌─────────────────────────┐
│   USER_PREFERENCES      │
│  (userId, theme,        │
│   lastCategory...)      │
└────────┬────────────────┘
         │
         │ 1:1 (uses)
         │
         ▼
┌─────────────────┐
│ VOICE_SETTINGS  │
│  (voiceId,      │
│   name, lang)   │
└─────────────────┘

┌─────────────────┐
│    HISTORY      │
│  (id, title,    │
│   content...)   │
└────────┬────────┘
         │
         │ 1:N (displayed in)
         │
         ▼
┌─────────────────────────┐
│   CONTENT_SECTION       │
│  (category filter)      │
└─────────────────────────┘

┌─────────────────┐
│   FACILITIES    │
│  (id, title,    │
│   content...)   │
└────────┬────────┘
         │
         │ 1:N (displayed in)
         │
         ▼
┌─────────────────────────┐
│   CONTENT_SECTION       │
│  (category filter)      │
└─────────────────────────┘

┌─────────────────┐
│  CAMPUS_GUIDE   │
│  (id, title,    │
│   content...)   │
└────────┬────────┘
         │
         │ 1:N (displayed in)
         │
         ▼
┌─────────────────────────┐
│   CONTENT_SECTION       │
│  (category filter)      │
└─────────────────────────┘

┌─────────────────┐
│ NAVIGATION_DATA │
│  (floor, name,  │
│   coordinates)  │
└────────┬────────┘
         │
         │ 1:N (linked to)
         │
         ▼
┌─────────────────────────┐
│  INTERACTIVE_MAPS       │
│  (floor plans)          │
└─────────────────────────┘
```

---

## Relationship Descriptions

### 1. **CONTENT → USER_PREFERENCES**
- **Type:** Many-to-One
- **Description:** Multiple content items (events, history, facilities, campus guide) can be viewed by one user session
- **Cardinality:** N:1
- **Business Rule:** User preferences persist across sessions via localStorage

### 2. **USER_PREFERENCES → VOICE_SETTINGS**
- **Type:** One-to-One
- **Description:** Each user session has one active voice setting
- **Cardinality:** 1:1
- **Business Rule:** User can change voice settings, which updates the relationship

### 3. **CONTENT_ITEMS → SEARCH_INDEX**
- **Type:** Many-to-Many
- **Description:** Content items can match multiple search queries, and searches can return multiple items
- **Cardinality:** N:M
- **Business Rule:** Search functionality indexes all content fields (title, content, category)

### 4. **NAVIGATION_DATA → FLOOR_PLANS**
- **Type:** Many-to-One
- **Description:** Multiple navigation points belong to one floor plan
- **Cardinality:** N:1
- **Business Rule:** Each floor (1-4) has its own floor plan image and navigation data

### 5. **CONTENT_ITEMS → TTS_PANEL**
- **Type:** One-to-One (Active)
- **Description:** Only one content item can be actively playing in TTS panel at a time
- **Cardinality:** 1:1
- **Business Rule:** Selecting new content stops current playback

---

## Data Storage Architecture

### Client-Side Storage (Browser)

#### **1. LocalStorage**
```javascript
{
  "theme": "dark" | "light",
  "lastCategory": "events" | "history" | "facilities" | "campus_guide",
  "voicePreference": "voiceId",
  "speechRate": 0.5 - 2.0
}
```

#### **2. SessionStorage**
```javascript
{
  "currentText": "text being read",
  "currentTitle": "title of current item",
  "isPlaying": true | false,
  "searchQuery": "user search input"
}
```

#### **3. In-Memory (JavaScript Objects)**
```javascript
const schoolData = {
  events: [...],
  history: [...],
  facilities: [...],
  campus_guide: [...]
}

const navigationData = {
  floors: {
    1: [...locations],
    2: [...locations],
    3: [...locations],
    4: [...locations]
  }
}
```

---

## Database Schema (If Implemented)

### Recommended Schema for Future Database Integration

```sql
-- Events Table
CREATE TABLE events (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    event_date DATE NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(10),
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- History Table
CREATE TABLE history (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    milestone_date DATE,
    category VARCHAR(50),
    priority VARCHAR(10),
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Facilities Table
CREATE TABLE facilities (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(10),
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Campus Guide Table
CREATE TABLE campus_guide (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(10),
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Navigation Data Table
CREATE TABLE navigation_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    floor INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    description TEXT,
    keywords JSON,
    coordinate_x INT,
    coordinate_y INT,
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Preferences Table (for multi-user system)
CREATE TABLE user_preferences (
    user_id VARCHAR(50) PRIMARY KEY,
    theme VARCHAR(10) DEFAULT 'light',
    voice_id VARCHAR(100),
    speech_rate DECIMAL(2,1) DEFAULT 1.0,
    last_category VARCHAR(50),
    search_history JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_history_category ON history(category);
CREATE INDEX idx_facilities_category ON facilities(category);
CREATE INDEX idx_navigation_floor ON navigation_data(floor);
CREATE INDEX idx_navigation_type ON navigation_data(type);
```

---

## ERD Visual Representation

```
┌──────────────────────────────────────────────────────────────┐
│                     V.I.R.A. SYSTEM ERD                      │
└──────────────────────────────────────────────────────────────┘

┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   EVENTS    │         │   HISTORY   │         │ FACILITIES  │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ PK id       │         │ PK id       │         │ PK id       │
│    title    │         │    title    │         │    title    │
│    content  │         │    content  │         │    content  │
│    date     │         │    date     │         │    date     │
│    category │         │    category │         │    category │
│    priority │         │    priority │         │    priority │
│    icon     │         │    icon     │         │    icon     │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       └───────────┬───────────┴───────────┬───────────┘
                   │                       │
                   ▼                       ▼
         ┌─────────────────────────────────────┐
         │       CONTENT DISPLAY LAYER         │
         │    (Category-based filtering)       │
         └─────────────┬───────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────────┐
         │         SEARCH ENGINE               │
         │  (Full-text search + Voice search)  │
         └─────────────┬───────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────────┐
         │          TTS PANEL                  │
         │   (Text-to-Speech playback)         │
         └─────────────┬───────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────────┐
         │      VOICE_SETTINGS                 │
         ├─────────────────────────────────────┤
         │ PK voiceId                          │
         │    name                             │
         │    lang                             │
         │    gender                           │
         │    localService                     │
         └─────────────┬───────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────────┐
         │     USER_PREFERENCES                │
         ├─────────────────────────────────────┤
         │ PK userId                           │
         │    theme                            │
         │ FK voiceId                          │
         │    speechRate                       │
         │    lastCategory                     │
         │    searchHistory                    │
         └─────────────────────────────────────┘

┌─────────────┐         ┌──────────────────┐
│CAMPUS_GUIDE │         │ NAVIGATION_DATA  │
├─────────────┤         ├──────────────────┤
│ PK id       │         │ PK id            │
│    title    │         │    floor         │
│    content  │         │    name          │
│    category │         │    type          │
│    priority │         │    description   │
│    icon     │         │    keywords[]    │
└──────┬──────┘         │    coordinates   │
       │                │    icon          │
       │                └────────┬─────────┘
       │                         │
       └─────────┬───────────────┘
                 │
                 ▼
       ┌──────────────────────┐
       │  INTERACTIVE MAPS    │
       │  (Floor Plans 1-4)   │
       └──────────────────────┘
```

---

## Key Insights

### 1. **Flat Data Structure**
- Current implementation uses JavaScript objects (no relational database)
- Data stored in `data.js` file
- Simple and efficient for read-heavy operations

### 2. **Client-Side Architecture**
- All data processing happens in browser
- No backend server required
- Fast performance, offline capability via PWA

### 3. **Scalability Considerations**
- Current structure supports up to ~1000 content items efficiently
- For larger datasets, consider database migration
- Recommended: Firebase, Supabase, or MongoDB for future scaling

### 4. **Data Integrity**
- No foreign key constraints (client-side)
- Data validation handled in JavaScript
- Manual data consistency management required

---

## Future Enhancements

1. **Database Integration**
   - Migrate to cloud database (Firebase/Supabase)
   - Implement real-time updates
   - Add user authentication

2. **Advanced Relationships**
   - Link facilities to specific campus guide locations
   - Connect events to specific facilities
   - Create tags/categories for cross-referencing

3. **Analytics Entity**
   - Track popular content
   - Monitor search queries
   - User engagement metrics

4. **Multi-language Support**
   - Add language entity
   - Translate content dynamically
   - Support multiple TTS languages

---

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Author:** V.I.R.A. Development Team
