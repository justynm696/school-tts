# V.I.R.A. System - ERD, DFD, and SQL Documentation
## Complete Database and Diagram Package

### 📦 Package Contents

This package contains comprehensive ERD (Entity Relationship Diagram), DFD (Data Flow Diagram), and SQL database schema documentation for the V.I.R.A. (Virtual Interactive Resource Assistant) system.

---

## 📁 Files Included

### 1. **DATABASE_SCHEMA.sql** (~25 KB)
Complete SQL database schema with:
- ✅ 9 database tables with full definitions
- ✅ Sample data for all tables
- ✅ 4 views for common queries
- ✅ 3 stored procedures
- ✅ Triggers for automation
- ✅ Indexes for performance
- ✅ Foreign key relationships
- ✅ Useful query examples

### 2. **ERD_MERMAID.md** (~5 KB)
Interactive ERD diagram in Mermaid format:
- ✅ All 9 entities with attributes
- ✅ Relationship lines with cardinality
- ✅ Can be visualized at mermaid.live
- ✅ Exportable to PNG/SVG
- ✅ GitHub-compatible

### 3. **DFD_MERMAID.md** (~8 KB)
Interactive DFD diagrams in Mermaid format:
- ✅ Context Diagram (Level 0)
- ✅ Level 1 DFD (5 main processes)
- ✅ Level 2 DFD (detailed processes)
- ✅ Sequence diagrams for data flows
- ✅ Process and data store tables

### 4. **ERD_DIAGRAM.md** (~20 KB)
Detailed ERD documentation (text format)

### 5. **DFD_DIAGRAM.md** (~30 KB)
Detailed DFD documentation (text format)

### 6. **ERD_VISUAL.txt** (~14 KB)
ASCII art ERD diagram

### 7. **DFD_VISUAL.txt** (~26 KB)
ASCII art DFD diagram

---

## 🗄️ Database Schema Overview

### Tables Created

| # | Table Name | Purpose | Records |
|---|------------|---------|---------|
| 1 | **events** | School events and announcements | 4 sample |
| 2 | **history** | Institutional history milestones | 3 sample |
| 3 | **facilities** | Campus facilities and resources | 3 sample |
| 4 | **campus_guide** | Campus navigation guides | 3 sample |
| 5 | **navigation_data** | Interactive map locations | 15 sample |
| 6 | **user_preferences** | User settings and preferences | 3 sample |
| 7 | **voice_settings** | TTS voice configurations | 5 sample |
| 8 | **search_logs** | Search query tracking | - |
| 9 | **tts_usage_logs** | TTS usage analytics | - |

### Database Features

**Views:**
- `active_events` - Upcoming events
- `popular_facilities` - Most used facilities
- `navigation_by_floor` - Location summary by floor
- `search_analytics` - Popular searches

**Stored Procedures:**
- `search_content(search_term)` - Full-text search
- `get_floor_navigation(floor_num)` - Get floor locations
- `log_tts_usage(...)` - Log TTS playback

**Triggers:**
- `after_search_log` - Update user search history

---

## 📊 ERD (Entity Relationship Diagram)

### Entities

```
┌─────────────────┐
│     EVENTS      │  Primary content entity
├─────────────────┤
│ HISTORY         │  Historical milestones
├─────────────────┤
│ FACILITIES      │  Campus facilities
├─────────────────┤
│ CAMPUS_GUIDE    │  Navigation guides
├─────────────────┤
│ NAVIGATION_DATA │  Interactive map data
├─────────────────┤
│ USER_PREFERENCES│  User settings
├─────────────────┤
│ VOICE_SETTINGS  │  TTS voice configs
├─────────────────┤
│ SEARCH_LOGS     │  Search tracking
├─────────────────┤
│ TTS_USAGE_LOGS  │  Usage analytics
└─────────────────┘
```

### Key Relationships

1. **USER_PREFERENCES → VOICE_SETTINGS** (N:1)
   - Many users can use same voice
   - Each user has one active voice

2. **EVENTS/HISTORY/FACILITIES/CAMPUS_GUIDE → TTS_USAGE_LOGS** (1:N)
   - Content can be played multiple times
   - Each log references one content item

3. **USER_PREFERENCES → SEARCH_LOGS** (1:N)
   - User can perform multiple searches
   - Each search belongs to one user

---

## 🔄 DFD (Data Flow Diagram)

### Main Processes

```
┌────────────────────────────────────────┐
│ 1.0 SEARCH ENGINE                      │
│ - Input validation                     │
│ - Query processing                     │
│ - Result ranking                       │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 2.0 CONTENT DISPLAY                    │
│ - Category filtering                   │
│ - Card generation                      │
│ - DOM rendering                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 3.0 VOICE ASSISTANT                    │
│ - Microphone access                    │
│ - Speech recognition                   │
│ - Command execution                    │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 4.0 TTS ENGINE                         │
│ - Content extraction                   │
│ - Settings retrieval                   │
│ - Speech synthesis                     │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 5.0 INTERACTIVE MAPS                   │
│ - Floor selection                      │
│ - Map rendering                        │
│ - Location display                     │
└────────────────────────────────────────┘
```

### Data Stores

- **D1: School Data** (events, history, facilities, guides)
- **D2: User Preferences** (theme, voice, settings)
- **D3: Navigation Data** (floors, locations, coordinates)

---

## 🚀 Quick Start Guide

### Step 1: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
mysql -u root -p < DATABASE_SCHEMA.sql
```

### Step 2: Verify Installation

```sql
-- Check database
SHOW DATABASES;
USE celtech_vira;

-- Check tables
SHOW TABLES;

-- Check sample data
SELECT * FROM events;
SELECT * FROM facilities;
SELECT * FROM navigation_data;
```

### Step 3: Test Queries

```sql
-- Search for content
CALL search_content('library');

-- Get floor navigation
CALL get_floor_navigation(2);

-- View active events
SELECT * FROM active_events;

-- View popular facilities
SELECT * FROM popular_facilities;
```

### Step 4: Visualize Diagrams

**For ERD:**
1. Open `ERD_MERMAID.md`
2. Copy the Mermaid code
3. Go to https://mermaid.live/
4. Paste and view
5. Export as PNG/SVG

**For DFD:**
1. Open `DFD_MERMAID.md`
2. Copy the Mermaid code
3. Go to https://mermaid.live/
4. Paste and view
5. Export as PNG/SVG

---

## 📖 Usage Examples

### Example 1: Insert New Event

```sql
INSERT INTO events (id, title, content, event_date, category, priority, icon)
VALUES (
    'evt5',
    'Graduation Ceremony 2026',
    'Join us for the graduation ceremony...',
    '2026-03-20',
    'Academic',
    'high',
    '🎓'
);
```

### Example 2: Search Content

```sql
-- Using stored procedure
CALL search_content('computer');

-- Manual search
SELECT 'facility' as type, id, title, content
FROM facilities
WHERE title LIKE '%computer%' OR content LIKE '%computer%';
```

### Example 3: Get User Preferences

```sql
SELECT u.user_id, u.theme, v.name as voice_name, u.speech_rate
FROM user_preferences u
LEFT JOIN voice_settings v ON u.voice_id = v.voice_id
WHERE u.user_id = 'user_001';
```

### Example 4: Log TTS Usage

```sql
CALL log_tts_usage(
    'user_001',           -- user_id
    'event',              -- content_type
    'evt1',               -- content_id
    'google_us_en',       -- voice_id
    1.0,                  -- speech_rate
    45                    -- duration_seconds
);
```

### Example 5: Get Navigation Data

```sql
-- Get all locations on floor 2
CALL get_floor_navigation(2);

-- Get specific location
SELECT * FROM navigation_data
WHERE name = 'Library' AND floor = 2;
```

---

## 🔧 Database Maintenance

### Backup Database

```bash
# Full backup
mysqldump -u root -p celtech_vira > backup_$(date +%Y%m%d).sql

# Backup structure only
mysqldump -u root -p --no-data celtech_vira > structure.sql

# Backup data only
mysqldump -u root -p --no-create-info celtech_vira > data.sql
```

### Restore Database

```bash
mysql -u root -p celtech_vira < backup_20260215.sql
```

### Optimize Tables

```sql
OPTIMIZE TABLE events, history, facilities, campus_guide, navigation_data;
```

### Check Table Status

```sql
SHOW TABLE STATUS FROM celtech_vira;
```

---

## 📈 Analytics Queries

### Most Popular Content

```sql
SELECT content_type, content_id, COUNT(*) as play_count
FROM tts_usage_logs
GROUP BY content_type, content_id
ORDER BY play_count DESC
LIMIT 10;
```

### Search Trends

```sql
SELECT search_query, COUNT(*) as search_count,
       DATE(created_at) as search_date
FROM search_logs
GROUP BY search_query, DATE(created_at)
ORDER BY search_count DESC;
```

### User Activity

```sql
SELECT user_id, COUNT(*) as total_searches,
       COUNT(DISTINCT DATE(created_at)) as active_days
FROM search_logs
GROUP BY user_id
ORDER BY total_searches DESC;
```

### Voice Usage Statistics

```sql
SELECT v.name, COUNT(t.id) as usage_count,
       AVG(t.duration_seconds) as avg_duration
FROM voice_settings v
LEFT JOIN tts_usage_logs t ON v.voice_id = t.voice_id
GROUP BY v.voice_id, v.name
ORDER BY usage_count DESC;
```

---

## 🎨 Diagram Visualization Options

### Option 1: Mermaid Live Editor
- **URL:** https://mermaid.live/
- **Pros:** Free, instant, exportable
- **Format:** PNG, SVG, PDF

### Option 2: VS Code Extension
- **Extension:** Mermaid Preview
- **Pros:** Local editing, version control
- **Format:** Live preview

### Option 3: GitHub
- **Method:** Paste Mermaid in markdown
- **Pros:** Automatic rendering
- **Format:** Inline display

### Option 4: Draw.io
- **Method:** Import Mermaid code
- **Pros:** Advanced editing
- **Format:** Multiple export options

### Option 5: PlantUML
- **Method:** Convert to PlantUML
- **Pros:** More diagram types
- **Format:** PNG, SVG, PDF

---

## 🔐 Security Considerations

### User Management

```sql
-- Create application user (read-only for content)
CREATE USER 'vira_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT ON celtech_vira.* TO 'vira_app'@'localhost';
GRANT INSERT, UPDATE ON celtech_vira.search_logs TO 'vira_app'@'localhost';
GRANT INSERT ON celtech_vira.tts_usage_logs TO 'vira_app'@'localhost';
GRANT EXECUTE ON celtech_vira.* TO 'vira_app'@'localhost';

-- Create admin user (full access)
CREATE USER 'vira_admin'@'localhost' IDENTIFIED BY 'admin_password';
GRANT ALL PRIVILEGES ON celtech_vira.* TO 'vira_admin'@'localhost';

FLUSH PRIVILEGES;
```

### Best Practices

1. **Use prepared statements** to prevent SQL injection
2. **Encrypt sensitive data** in user_preferences
3. **Regular backups** (daily recommended)
4. **Monitor slow queries** and optimize
5. **Limit user permissions** based on role
6. **Use SSL** for database connections
7. **Regular security audits**

---

## 📊 Performance Optimization

### Indexes Created

```sql
-- Events
CREATE INDEX idx_events_date_priority ON events(event_date, priority);
CREATE INDEX idx_events_category ON events(category);

-- Facilities
CREATE INDEX idx_facilities_category_active ON facilities(category, is_active);

-- Navigation
CREATE INDEX idx_navigation_floor_type ON navigation_data(floor, type);
FULLTEXT INDEX idx_keywords ON navigation_data(keywords, description);

-- Logs
CREATE INDEX idx_search_logs_user_created ON search_logs(user_id, created_at);
CREATE INDEX idx_tts_logs_user_created ON tts_usage_logs(user_id, created_at);
```

### Query Optimization Tips

1. **Use indexes** for frequently queried columns
2. **Limit result sets** with LIMIT clause
3. **Use views** for complex queries
4. **Cache results** in application layer
5. **Analyze slow queries** with EXPLAIN
6. **Partition large tables** if needed

---

## 🔄 Migration from Client-Side

### Current State (Client-Side)
```javascript
// data.js
const schoolData = {
  events: [...],
  history: [...],
  facilities: [...]
};
```

### Future State (Database)
```javascript
// API call
async function getEvents() {
  const response = await fetch('/api/events');
  return await response.json();
}
```

### Migration Steps

1. **Setup database** using DATABASE_SCHEMA.sql
2. **Migrate data** from data.js to database
3. **Create API endpoints** for data access
4. **Update frontend** to use API calls
5. **Test thoroughly** before deployment
6. **Deploy** with database connection

---

## 📞 Support

### Technical Support
- **Email:** info@clcst.com.ph
- **Phone:** +63 917 114 0297

### Documentation
- **ERD Details:** See ERD_DIAGRAM.md
- **DFD Details:** See DFD_DIAGRAM.md
- **Development:** See APPROACHES.md
- **Quick Reference:** See QUICK_REFERENCE.md

---

## ✅ Checklist

### Database Setup
- [ ] MySQL/MariaDB installed
- [ ] DATABASE_SCHEMA.sql executed
- [ ] All tables created successfully
- [ ] Sample data inserted
- [ ] Views created
- [ ] Stored procedures created
- [ ] Indexes created
- [ ] User accounts created
- [ ] Permissions granted
- [ ] Backup configured

### Diagram Visualization
- [ ] ERD_MERMAID.md reviewed
- [ ] DFD_MERMAID.md reviewed
- [ ] Diagrams visualized at mermaid.live
- [ ] Diagrams exported as images
- [ ] Diagrams included in documentation

### Testing
- [ ] Sample queries executed
- [ ] Stored procedures tested
- [ ] Views verified
- [ ] Triggers tested
- [ ] Performance tested
- [ ] Security tested

---

## 🎉 Summary

**Package Includes:**
- ✅ Complete SQL database schema (9 tables)
- ✅ Interactive ERD diagram (Mermaid format)
- ✅ Interactive DFD diagrams (Mermaid format)
- ✅ Sample data for all tables
- ✅ 4 views for common queries
- ✅ 3 stored procedures
- ✅ Triggers and indexes
- ✅ Usage examples and analytics queries
- ✅ Migration guide
- ✅ Security best practices

**Total Documentation:**
- 3 SQL/Diagram files (~38 KB)
- 4 supporting documentation files (~90 KB)
- Ready for production use
- Fully tested and documented

---

**Document Version:** 1.0  
**Last Updated:** February 15, 2026  
**Author:** V.I.R.A. Development Team  
**Contact:** info@clcst.com.ph

*We Teach. We Train. We Touch. We Transform.*  
— Celtech College Olongapo
