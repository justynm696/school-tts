# V.I.R.A. System — ERD Diagram (Mermaid Format)
## Entity Relationship Diagram — v3.0 (Fully Relational)

Visualize at: https://mermaid.live/

```mermaid
erDiagram

    %% ── CORE: Department is the root anchor ──────────────────
    DEPARTMENTS {
        varchar  id         PK
        varchar  name
        varchar  icon
        text     description
        varchar  color
        boolean  is_active
        timestamp created_at
        timestamp updated_at
    }

    %% ── ADMIN USERS ──────────────────────────────────────────
    ADMIN_USERS {
        int      id         PK
        varchar  username   UK
        varchar  password
        varchar  name
        varchar  role
        varchar  icon
        varchar  color
        varchar  dept_id    FK
        jsonb    pages
        boolean  is_active
        timestamp created_at
        timestamp updated_at
    }

    %% ── CONTENT TABLES ───────────────────────────────────────
    EVENTS {
        varchar  id         PK
        varchar  dept_id    FK
        varchar  title
        text     content
        date     event_date
        varchar  category
        varchar  priority
        varchar  icon
        boolean  is_active
        int      created_by FK
        timestamp created_at
        timestamp updated_at
    }

    HISTORY {
        varchar  id         PK
        varchar  title
        text     content
        date     milestone_date
        varchar  category
        varchar  priority
        varchar  icon
        boolean  is_active
        int      created_by FK
        timestamp created_at
        timestamp updated_at
    }

    FACILITIES {
        varchar  id         PK
        varchar  dept_id    FK
        varchar  title
        text     content
        varchar  category
        varchar  priority
        varchar  icon
        int      capacity
        varchar  operating_hours
        boolean  is_active
        int      created_by FK
        timestamp created_at
        timestamp updated_at
    }

    CAMPUS_GUIDE {
        varchar  id         PK
        varchar  dept_id    FK
        varchar  title
        text     content
        varchar  category
        varchar  priority
        varchar  icon
        int      floor_number
        boolean  is_active
        int      created_by FK
        timestamp created_at
        timestamp updated_at
    }

    %% ── NAVIGATION (linked to guide + facilities) ────────────
    NAVIGATION_DATA {
        int      id              PK
        int      floor
        varchar  campus_guide_id FK
        varchar  facility_id     FK
        varchar  name
        varchar  type
        text     description
        text     keywords
        int      coordinate_x
        int      coordinate_y
        varchar  icon
        boolean  is_active
        timestamp created_at
        timestamp updated_at
    }

    %% ── TAGS (M:N junction) ──────────────────────────────────
    TAGS {
        int     id   PK
        varchar name UK
        timestamp created_at
    }

    CONTENT_TAGS {
        int     id           PK
        int     tag_id        FK
        varchar content_type
        varchar content_id
        timestamp created_at
    }

    %% ── USER + VOICE ─────────────────────────────────────────
    VOICE_SETTINGS {
        varchar  voice_id      PK
        varchar  name
        varchar  lang
        varchar  gender
        boolean  local_service
        boolean  is_active
        timestamp created_at
    }

    USER_PREFERENCES {
        varchar  user_id       PK
        varchar  theme
        varchar  voice_id      FK
        decimal  speech_rate
        varchar  last_category
        jsonb    search_history
        timestamp created_at
        timestamp updated_at
        timestamp last_login
    }

    %% ── ANALYTICS LOGS ───────────────────────────────────────
    SEARCH_LOGS {
        int     id            PK
        varchar user_id       FK
        varchar search_query
        int     results_count
        varchar search_type
        timestamp created_at
    }

    TTS_USAGE_LOGS {
        int     id               PK
        varchar user_id          FK
        varchar content_type
        varchar content_id
        varchar voice_id         FK
        decimal speech_rate
        int     duration_seconds
        timestamp created_at
    }

    %% ── RELATIONSHIPS ────────────────────────────────────────

    %% Department → Admin Users (1:N)
    DEPARTMENTS      ||--o{ ADMIN_USERS      : "manages"

    %% Department → Content (1:N)
    DEPARTMENTS      ||--o{ EVENTS           : "owns"
    DEPARTMENTS      ||--o{ FACILITIES       : "owns"
    DEPARTMENTS      ||--o{ CAMPUS_GUIDE     : "owns"

    %% Admin Users → Content (1:N) — who created it
    ADMIN_USERS      ||--o{ EVENTS           : "created"
    ADMIN_USERS      ||--o{ HISTORY          : "created"
    ADMIN_USERS      ||--o{ FACILITIES       : "created"
    ADMIN_USERS      ||--o{ CAMPUS_GUIDE     : "created"

    %% Campus Guide → Navigation Data (1:N)
    CAMPUS_GUIDE     ||--o{ NAVIGATION_DATA  : "mapped to"

    %% Facilities → Navigation Data (1:N)
    FACILITIES       ||--o{ NAVIGATION_DATA  : "located at"

    %% Tags M:N via CONTENT_TAGS junction
    TAGS             ||--o{ CONTENT_TAGS     : "labels"

    %% Voice Settings → User & TTS logs
    VOICE_SETTINGS   ||--o{ USER_PREFERENCES : "preferred by"
    VOICE_SETTINGS   ||--o{ TTS_USAGE_LOGS   : "used in"

    %% User → Analytics
    USER_PREFERENCES ||--o{ SEARCH_LOGS      : "performs"
    USER_PREFERENCES ||--o{ TTS_USAGE_LOGS   : "generates"
```

---

## Relationship Summary

### 🔗 Foreign Key Constraints (Enforced)

| # | Child Table | FK Column | Parent Table | Parent Column | On Delete |
|---|-------------|-----------|--------------|---------------|-----------|
| 1 | `admin_users`    | `dept_id`          | `departments`      | `id`       | SET NULL  |
| 2 | `events`         | `dept_id`          | `departments`      | `id`       | RESTRICT  |
| 3 | `events`         | `created_by`       | `admin_users`      | `id`       | SET NULL  |
| 4 | `history`        | `created_by`       | `admin_users`      | `id`       | SET NULL  |
| 5 | `facilities`     | `dept_id`          | `departments`      | `id`       | RESTRICT  |
| 6 | `facilities`     | `created_by`       | `admin_users`      | `id`       | SET NULL  |
| 7 | `campus_guide`   | `dept_id`          | `departments`      | `id`       | SET NULL  |
| 8 | `campus_guide`   | `created_by`       | `admin_users`      | `id`       | SET NULL  |
| 9 | `navigation_data`| `campus_guide_id`  | `campus_guide`     | `id`       | SET NULL  |
|10 | `navigation_data`| `facility_id`      | `facilities`       | `id`       | SET NULL  |
|11 | `content_tags`   | `tag_id`           | `tags`             | `id`       | CASCADE   |
|12 | `user_preferences`| `voice_id`        | `voice_settings`   | `voice_id` | SET NULL  |
|13 | `search_logs`    | `user_id`          | `user_preferences` | `user_id`  | SET NULL  |
|14 | `tts_usage_logs` | `user_id`          | `user_preferences` | `user_id`  | SET NULL  |
|15 | `tts_usage_logs` | `voice_id`         | `voice_settings`   | `voice_id` | SET NULL  |

---

## Relationship Types

| Type | Description | Example |
|------|-------------|---------|
| `1:N` (One-to-Many) | One department owns many events | `DEPARTMENTS → EVENTS` |
| `N:1` (Many-to-One) | Many events belong to one dept | `EVENTS → DEPARTMENTS` |
| `M:N` (Many-to-Many) | Content can have many tags; tags apply to many content | `CONTENT ↔ TAGS` via `CONTENT_TAGS` |
| Polymorphic | `content_tags.content_id` references different tables depending on `content_type` | `CONTENT_TAGS → EVENTS \| HISTORY \| FACILITIES \| CAMPUS_GUIDE` |

---

## Database Statistics

| Category | Tables | Description |
|----------|--------|-------------|
| **Root** | 1 | `departments` |
| **Auth** | 1 | `admin_users` |
| **Content** | 4 | `events`, `history`, `facilities`, `campus_guide` |
| **Navigation** | 1 | `navigation_data` |
| **Taxonomy** | 2 | `tags`, `content_tags` |
| **User** | 2 | `user_preferences`, `voice_settings` |
| **Analytics** | 2 | `search_logs`, `tts_usage_logs` |
| **Total** | **13** | — |

---

## Views

| View | Description |
|------|-------------|
| `active_events` | Upcoming events **joined** with department name + creator |
| `popular_facilities` | Facilities ranked by TTS play count, **joined** with department |
| `navigation_by_floor` | Floor map summary **joined** with linked guide titles |
| `search_analytics` | Top searches ranked by frequency + unique user count |
| `dept_content_summary` | How many events/facilities/guides each department published |
| `tts_analytics` | TTS play counts per content type and voice used |

---

## Functions

| Function | Description |
|----------|-------------|
| `search_content(text)` | Full-text ILIKE search across all 4 content tables, returns dept info |
| `get_floor_navigation(int)` | Returns navigation map points for a floor **with guide + facility links** |
| `get_department_content(dept_id)` | Returns all content (events + facilities + guides) for a department |
| `log_tts_usage(...)` | Convenience wrapper to insert a TTS analytics record |

---

**Version:** 3.0 — Fully Relational  
**Updated:** March 24, 2026
