-- ============================================================================
-- V.I.R.A. (Virtual Interactive Resource Assistant)
-- Complete Relational Database Schema - PostgreSQL / Supabase Compatible
-- Celtech College Olongapo
-- ============================================================================
-- Version:  3.0 (Relational — fully normalised with FK constraints)
-- Updated:  March 24, 2026
-- ============================================================================

-- ============================================================================
-- DROP EXISTING OBJECTS  (safe re-run)
-- ============================================================================

DO $$ BEGIN
    DROP TRIGGER IF EXISTS trg_after_search_log          ON search_logs;
    DROP TRIGGER IF EXISTS trg_events_updated_at         ON events;
    DROP TRIGGER IF EXISTS trg_history_updated_at        ON history;
    DROP TRIGGER IF EXISTS trg_facilities_updated_at     ON facilities;
    DROP TRIGGER IF EXISTS trg_campus_guide_updated_at   ON campus_guide;
    DROP TRIGGER IF EXISTS trg_navigation_data_updated_at ON navigation_data;
    DROP TRIGGER IF EXISTS trg_user_preferences_updated_at ON user_preferences;
    DROP TRIGGER IF EXISTS trg_admin_users_updated_at    ON admin_users;
    DROP TRIGGER IF EXISTS trg_departments_updated_at    ON departments;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

DROP FUNCTION IF EXISTS fn_after_search_log()   CASCADE;
DROP FUNCTION IF EXISTS fn_set_updated_at()     CASCADE;
DROP FUNCTION IF EXISTS search_content(TEXT)    CASCADE;
DROP FUNCTION IF EXISTS get_floor_navigation(INT) CASCADE;
DROP FUNCTION IF EXISTS log_tts_usage(TEXT,TEXT,TEXT,TEXT,NUMERIC,INT) CASCADE;
DROP FUNCTION IF EXISTS get_department_content(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_campus_guide_with_map(INT)  CASCADE;

DROP VIEW IF EXISTS active_events       CASCADE;
DROP VIEW IF EXISTS popular_facilities  CASCADE;
DROP VIEW IF EXISTS navigation_by_floor CASCADE;
DROP VIEW IF EXISTS search_analytics    CASCADE;
DROP VIEW IF EXISTS dept_content_summary CASCADE;
DROP VIEW IF EXISTS tts_analytics       CASCADE;

-- Drop tables in strict reverse-dependency order
DROP TABLE IF EXISTS content_tags       CASCADE;
DROP TABLE IF EXISTS tts_usage_logs     CASCADE;
DROP TABLE IF EXISTS search_logs        CASCADE;
DROP TABLE IF EXISTS user_preferences   CASCADE;
DROP TABLE IF EXISTS voice_settings     CASCADE;
DROP TABLE IF EXISTS navigation_data    CASCADE;
DROP TABLE IF EXISTS campus_guide       CASCADE;
DROP TABLE IF EXISTS facilities         CASCADE;
DROP TABLE IF EXISTS history            CASCADE;
DROP TABLE IF EXISTS events             CASCADE;
DROP TABLE IF EXISTS admin_users        CASCADE;
DROP TABLE IF EXISTS departments        CASCADE;
DROP TABLE IF EXISTS tags               CASCADE;


-- ============================================================================
-- TABLE 1: DEPARTMENTS
-- Purpose: Root entity — every piece of content belongs to a department
-- Relationships:
--   departments (1) ──< admin_users     (N)
--   departments (1) ──< events          (N)
--   departments (1) ──< facilities      (N)
--   departments (1) ──< campus_guide    (N)
-- ============================================================================

CREATE TABLE departments (
    id          VARCHAR(20)  PRIMARY KEY,      -- 'registrar', 'canteen', etc.
    name        VARCHAR(100) NOT NULL UNIQUE,
    icon        VARCHAR(10),
    description TEXT,
    color       VARCHAR(10),                   -- hex color for UI display
    is_active   BOOLEAN      DEFAULT TRUE,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO departments (id, name, icon, description, color) VALUES
('registrar',   'Registrar',    '📋', 'Records & Enrollment Services',     '#3b82f6'),
('canteen',     'Canteen',      '🍽️', 'Food & Dining Services',            '#f59e0b'),
('library',     'Library',      '📚', 'Books & Media Resources',           '#8b5cf6'),
('accounting',  'Accounting',   '💰', 'Finance & Payment Services',        '#10b981'),
('clinic',      'Clinic',       '🏥', 'Health & Medical Services',         '#ef4444'),
('it_support',  'IT Support',   '💻', 'Technology & Systems Support',      '#06b6d4'),
('general',     'General',      '🏫', 'School-wide / Cross-department',    '#6b7280');


-- ============================================================================
-- TABLE 2: ADMIN_USERS
-- Purpose: Admin panel accounts (department officers + super admin)
-- Relationships:
--   admin_users (N) ──> departments (1)   [ FK: dept_id → departments.id ]
--   admin_users (1) ──< events      (N)   [ FK: created_by → admin_users.id ]
--   admin_users (1) ──< facilities  (N)   [ FK: created_by → admin_users.id ]
--   admin_users (1) ──< campus_guide(N)   [ FK: created_by → admin_users.id ]
--   admin_users (1) ──< history     (N)   [ FK: created_by → admin_users.id ]
-- ============================================================================

CREATE TABLE admin_users (
    id          SERIAL       PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,            -- store hashed in production
    name        VARCHAR(100) NOT NULL,
    role        VARCHAR(100),
    icon        VARCHAR(10)  DEFAULT '👤',
    color       VARCHAR(10),
    dept_id     VARCHAR(20)  REFERENCES departments(id) ON DELETE SET NULL,
    pages       JSONB        DEFAULT '[]'::JSONB, -- allowed admin pages
    is_active   BOOLEAN      DEFAULT TRUE,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_admin_dept   ON admin_users(dept_id);
CREATE INDEX idx_admin_active ON admin_users(is_active);

-- Seed default accounts (passwords should be hashed in production)
INSERT INTO admin_users (username, password, name, role, icon, color, dept_id, pages) VALUES
('admin',            'Admin@2026',         'Super Administrator', 'Super Administrator', '🛡️', '#10a37f', 'general',    '["events","history","facilities","campus_guide","accounts","settings"]'),
('registrar_admin',  'Registrar@2026',     'Registrar Admin',     'Registrar Officer',   '📋', '#3b82f6', 'registrar',  '["events","history","campus_guide"]'),
('canteen_admin',    'Canteen@2026',       'Canteen Admin',       'Canteen Officer',      '🍽️', '#f59e0b', 'canteen',    '["events","facilities"]'),
('library_admin',    'Library@2026',       'Library Admin',       'Library Officer',      '📚', '#8b5cf6', 'library',    '["events","facilities","campus_guide"]'),
('accounting_admin', 'Accounting@2026',    'Accounting Admin',    'Accounting Officer',   '💰', '#10b981', 'accounting', '["events","campus_guide"]'),
('clinic_admin',     'Clinic@2026',        'Clinic Admin',        'Clinic Officer',       '🏥', '#ef4444', 'clinic',     '["events","facilities"]'),
('itsupport_admin',  'ITSupport@2026',     'IT Support Admin',    'IT Officer',           '💻', '#06b6d4', 'it_support', '["events","history","facilities","campus_guide"]');


-- ============================================================================
-- TABLE 3: EVENTS
-- Purpose: School events and announcements
-- Relationships:
--   events (N) ──> departments (1)   [ FK: dept_id → departments.id ]
--   events (N) ──> admin_users (1)   [ FK: created_by → admin_users.id ]
--   events (1) ──< tts_usage_logs(N) [ via content_type='event', content_id ]
--   events (N) ──< content_tags (N)  [ junction table ]
-- ============================================================================

CREATE TABLE events (
    id          VARCHAR(10)  PRIMARY KEY,
    dept_id     VARCHAR(20)  NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    title       VARCHAR(255) NOT NULL,
    content     TEXT         NOT NULL,
    event_date  DATE         NOT NULL,
    category    VARCHAR(50)  NOT NULL,
    priority    VARCHAR(10)  NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    icon        VARCHAR(20),
    is_active   BOOLEAN      DEFAULT TRUE,
    created_by  INT          REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_events_dept      ON events(dept_id);
CREATE INDEX idx_events_date      ON events(event_date);
CREATE INDEX idx_events_category  ON events(category);
CREATE INDEX idx_events_priority  ON events(priority);
CREATE INDEX idx_events_active    ON events(is_active);
CREATE INDEX idx_events_date_prio ON events(event_date, priority);

INSERT INTO events (id, dept_id, title, content, event_date, category, priority, icon, created_by) VALUES
('evt1', 'general',    'Annual Science Fair 2026',        'Get ready for our biggest science fair yet! Students from all grades are invited to participate and showcase their innovative science projects. The fair will be held on February 15th in the school gymnasium. Registration deadline is February 1st.',         '2026-02-15', 'Competition', 'high',   '🔬', 1),
('evt2', 'general',    'Inter-School Basketball Tournament','Our school basketball team will be competing in the regional inter-school tournament from January 25th to 27th. All students are encouraged to come and support our team. The matches will be held at the City Sports Complex.',                         '2026-01-25', 'Sports',      'medium', '🏀', 1),
('evt3', 'general',    'Cultural Diversity Week',          'Join us for Cultural Diversity Week from February 5th to 9th! Students will have the opportunity to learn about different cultures through food, music, dance, and art.',                                                                                 '2026-02-05', 'Cultural',    'medium', '🌍', 1),
('evt4', 'registrar',  'Career Guidance Workshop',         'High school students are invited to attend a career guidance workshop on January 30th. Industry professionals from various fields will share their experiences and provide valuable insights into different career paths.',                               '2026-01-30', 'Academic',    'high',   '💼', 2);


-- ============================================================================
-- TABLE 4: HISTORY
-- Purpose: Institutional history and milestones
-- Relationships:
--   history (N) ──> admin_users (1)   [ FK: created_by → admin_users.id ]
--   history (1) ──< tts_usage_logs(N) [ via content_type='history' ]
--   history (N) ──< content_tags (N)  [ junction table ]
-- (History is school-wide, so no dept_id — belongs to 'general')
-- ============================================================================

CREATE TABLE history (
    id             VARCHAR(10)  PRIMARY KEY,
    title          VARCHAR(255) NOT NULL,
    content        TEXT         NOT NULL,
    milestone_date DATE,
    category       VARCHAR(50)  NOT NULL,
    priority       VARCHAR(10)  NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    icon           VARCHAR(20),
    is_active      BOOLEAN      DEFAULT TRUE,
    created_by     INT          REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_history_milestone ON history(milestone_date);
CREATE INDEX idx_history_category  ON history(category);
CREATE INDEX idx_history_priority  ON history(priority);
CREATE INDEX idx_history_active    ON history(is_active);

INSERT INTO history (id, title, content, milestone_date, category, priority, icon, created_by) VALUES
('hist1', 'Founding and Early History (1959)',         'Central Luzon College of Science and Technology (CELTECH College) was conceptualized on May 20, 1959, by Doña Helen P. Legaspi. It officially opened on September 24, 1959, in San Fernando, Pampanga, as the Artistic Vocational School (AVS).', '1959-09-24', 'Foundation',    'high',   '🏛️', 1),
('hist2', 'Expansion to Olongapo (1970s–1980s)',      'During the 1970s and 1980s, the college established its presence in Olongapo City. The Olongapo campus became a primary education hub for Amerasians—children of U.S. servicemen stationed at the nearby naval bases.',                                '1975-01-01', 'Expansion',     'medium', '📈', 1),
('hist3', 'Evolution into CELTECH — A Model Institution', 'The school evolved from a small vocational center into a "model institution of higher learning," adopting the name Central Luzon College of Science and Technology to reflect its broader academic offerings.',                                      '2000-01-01', 'Modernization', 'high',   '🎓', 1);


-- ============================================================================
-- TABLE 5: FACILITIES
-- Purpose: Campus facilities and resources
-- Relationships:
--   facilities (N) ──> departments (1)      [ FK: dept_id → departments.id ]
--   facilities (N) ──> admin_users (1)      [ FK: created_by → admin_users.id ]
--   facilities (1) ──< navigation_data (N)  [ FK: facility_id → facilities.id ]
--   facilities (1) ──< tts_usage_logs (N)   [ via content_type='facility' ]
--   facilities (N) ──< content_tags (N)     [ junction table ]
-- ============================================================================

CREATE TABLE facilities (
    id              VARCHAR(10)  PRIMARY KEY,
    dept_id         VARCHAR(20)  NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    title           VARCHAR(255) NOT NULL,
    content         TEXT         NOT NULL,
    category        VARCHAR(50)  NOT NULL,
    priority        VARCHAR(10)  NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    icon            VARCHAR(20),
    capacity        INT,
    operating_hours VARCHAR(100),
    is_active       BOOLEAN      DEFAULT TRUE,
    created_by      INT          REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_facilities_dept    ON facilities(dept_id);
CREATE INDEX idx_facilities_cat     ON facilities(category);
CREATE INDEX idx_facilities_priority ON facilities(priority);
CREATE INDEX idx_facilities_active  ON facilities(is_active);

INSERT INTO facilities (id, dept_id, title, content, category, priority, icon, capacity, operating_hours, created_by) VALUES
('fac1',  'it_support', 'Computer Laboratories — Five State-of-the-Art Labs', 'CELTECH College boasts five state-of-the-art computer laboratories equipped with over 200 modern computers running the latest software for programming, design, and engineering applications.',          'Technology', 'high',   '💻', 200, '7:00 AM - 8:00 PM (Mon-Fri), 8:00 AM - 5:00 PM (Sat)', 1),
('fac2',  'general',    'Maritime Training Facilities — World-Class Simulators', 'CELTECH''s maritime training facilities are among the best in the region, featuring state-of-the-art ship bridge simulators, engine room simulators, and GMDSS training rooms.',           'Maritime',   'high',   '⚓',  50, '8:00 AM - 6:00 PM (Mon-Sat)', 1),
('fac8',  'library',    'School Library and Information Center — 200-Seat Capacity', 'The CELTECH School Library and Information Center on the 2nd floor is a comprehensive learning resource hub housing over 15,000 books, journals, and academic publications.', 'Academic',   'high',   '📚', 200, '7:00 AM - 7:00 PM (Mon-Fri), 8:00 AM - 4:00 PM (Sat)', 7),
('fac9',  'canteen',    'School Canteen', 'The CELTECH Canteen is located on the Ground Floor and serves affordable, nutritious meals for students and faculty. Open during school hours.', 'Dining', 'medium', '🍽️', 150, '7:00 AM - 5:00 PM (Mon-Sat)', 3),
('fac10', 'clinic',     'School Clinic',  'The CELTECH Clinic provides basic health services to students and faculty. Medical staff are available during school hours for consultations and first aid.', 'Health', 'high', '🏥', 20, '7:00 AM - 5:00 PM (Mon-Fri)', 6);


-- ============================================================================
-- TABLE 6: CAMPUS_GUIDE
-- Purpose: Campus navigation and office-level location info
-- Relationships:
--   campus_guide (N) ──> departments (1)      [ FK: dept_id → departments.id ]
--   campus_guide (N) ──> admin_users (1)      [ FK: created_by → admin_users.id ]
--   campus_guide (1) ──< navigation_data (N)  [ FK: campus_guide_id → campus_guide.id ]
--   campus_guide (1) ──< tts_usage_logs (N)   [ via content_type='campus_guide' ]
-- ============================================================================

CREATE TABLE campus_guide (
    id           VARCHAR(10)  PRIMARY KEY,
    dept_id      VARCHAR(20)  REFERENCES departments(id) ON DELETE SET NULL,
    title        VARCHAR(255) NOT NULL,
    content      TEXT         NOT NULL,
    category     VARCHAR(50)  NOT NULL,
    priority     VARCHAR(10)  NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    icon         VARCHAR(20),
    floor_number INT,
    is_active    BOOLEAN      DEFAULT TRUE,
    created_by   INT          REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ  DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_campus_dept     ON campus_guide(dept_id);
CREATE INDEX idx_campus_category ON campus_guide(category);
CREATE INDEX idx_campus_floor    ON campus_guide(floor_number);
CREATE INDEX idx_campus_priority ON campus_guide(priority);
CREATE INDEX idx_campus_active   ON campus_guide(is_active);

INSERT INTO campus_guide (id, dept_id, title, content, category, priority, icon, floor_number, created_by) VALUES
('guide1', 'general',    '1st Floor — Main Entrance & Administrative Offices', 'Welcome to the 1st Floor, the main entry point to Celtech College. Upon entering through the main entrance, you will find the spacious Lobby and Waiting Area directly ahead.',                      'Navigation', 'high', '🏢', 1, 1),
('guide2', 'registrar',  '1st Floor — Registrar Office',  'The Registrar Office is located on the 1st Floor. Services include enrollment, records, transcript requests, and grade inquiries. Open Monday–Friday, 8:00 AM – 5:00 PM.',                                           'Offices',    'high', '📋', 1, 2),
('guide3', 'accounting', '1st Floor — Accounting/Finance Office', 'The Accounting Office handles tuition payments, billing, and financial records. Located near the main entrance on the 1st Floor. Please bring your payment slip.',                                         'Offices',    'high', '💰', 1, 4),
('guide4', 'canteen',    '1st Floor — Canteen',            'The school canteen is on the Ground Floor. Offers affordable meals for students and faculty. Various food stalls available.',                                                                                        'Amenities',  'medium', '🍽️', 1, 3),
('guide5', 'library',    '2nd Floor — Library & Computer Facilities', 'The 2nd Floor is the academic heart of Celtech College, featuring the School Library and Information Center on the left side and Computer Laboratories on the right.',                                 'Navigation', 'high', '📚', 2, 7),
('guide6', 'it_support', '2nd Floor — Computer Laboratories', 'CELTECH''s five Computer Labs are located on the 2nd Floor. Students can access computers for programming, design, and research.',                                                                               'Facilities', 'high', '💻', 2, 7),
('guide7', 'clinic',     '1st Floor — School Clinic',      'The School Clinic is located near the main entrance on the 1st Floor. Basic medical consultations and first aid are available during school hours.',                                                                'Offices',    'high', '🏥', 1, 6),
('guide8', 'general',    '3rd Floor — Classrooms & Skills Lab', 'The 3rd Floor houses general classrooms (Rooms 301–310) and the Skills Lab for technical training.',                                                                                                       'Navigation', 'medium', '🚪', 3, 1),
('guide9', 'general',    '4th Floor — MOLA Auditorium & Maritime Labs', 'The 4th Floor features the MOLA Auditorium (large multipurpose hall) and the Maritime training facilities including Mock Bridge and GMDSS Room.',                                                    'Navigation', 'high', '🎭', 4, 1);


-- ============================================================================
-- TABLE 7: NAVIGATION_DATA
-- Purpose: Interactive map points — linked to campus_guide entries
-- Relationships:
--   navigation_data (N) ──> campus_guide (1)  [ FK: campus_guide_id → campus_guide.id ]
--   navigation_data (N) ──> facilities (1)    [ FK: facility_id → facilities.id ]
-- ============================================================================

CREATE TABLE navigation_data (
    id              SERIAL       PRIMARY KEY,
    floor           INT          NOT NULL,
    campus_guide_id VARCHAR(10)  REFERENCES campus_guide(id) ON DELETE SET NULL,
    facility_id     VARCHAR(10)  REFERENCES facilities(id)   ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    type            VARCHAR(20)  NOT NULL CHECK (type IN ('office', 'lab', 'classroom', 'facility', 'amenity')),
    description     TEXT,
    keywords        TEXT,
    coordinate_x    INT,
    coordinate_y    INT,
    icon            VARCHAR(20),
    is_active       BOOLEAN      DEFAULT TRUE,
    created_at      TIMESTAMPTZ  DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_nav_floor        ON navigation_data(floor);
CREATE INDEX idx_nav_type         ON navigation_data(type);
CREATE INDEX idx_nav_name         ON navigation_data(name);
CREATE INDEX idx_nav_active       ON navigation_data(is_active);
CREATE INDEX idx_nav_campus_guide ON navigation_data(campus_guide_id);
CREATE INDEX idx_nav_facility     ON navigation_data(facility_id);
CREATE INDEX idx_nav_floor_type   ON navigation_data(floor, type);
CREATE INDEX idx_nav_fts ON navigation_data
    USING GIN (to_tsvector('english', COALESCE(keywords, '') || ' ' || COALESCE(description, '')));

INSERT INTO navigation_data (floor, campus_guide_id, facility_id, name, type, description, keywords, coordinate_x, coordinate_y, icon) VALUES
-- Floor 1
(1, 'guide2', NULL,   'Registrar Office', 'office',   'Student enrollment, records, and transcripts',  'registrar,enrollment,records,transcript,grades', 150, 200, '📋'),
(1, 'guide3', NULL,   'Finance Office',   'office',   'Tuition payments and financial services',        'finance,payment,tuition,cashier,billing',         250, 200, '💰'),
(1, 'guide4', 'fac9', 'Canteen',          'amenity',  'Student and faculty dining area',                'canteen,food,dining,cafeteria,lunch',             300, 350, '🍽️'),
(1, 'guide7', 'fac10','Clinic',           'facility', 'Basic health services and first aid',            'clinic,health,medical,nurse,first aid',           100, 320, '🏥'),
(1, NULL,     NULL,   'Chemistry Lab',    'lab',      'Chemistry experiments and practicals',           'chemistry,lab,science,experiment',                400, 250, '🧪'),
-- Floor 2
(2, 'guide5', 'fac8', 'School Library',   'facility', 'Main library with books, journals, and study areas', 'library,books,study,research,reading,journals',100, 150, '📚'),
(2, 'guide6', 'fac1', 'Computer Lab',     'lab',      'Modern computers and software for IT courses',  'computer,lab,IT,programming,software',            300, 200, '💻'),
(2, NULL,     NULL,   'Crime Lab',        'lab',      'Criminology forensic training',                 'crime,lab,criminology,forensic,investigation',    350, 250, '🔬'),
(2, NULL,     NULL,   'Physics Lab',      'lab',      'Physics experiments and demonstrations',        'physics,lab,science,experiment',                  400, 300, '⚛️'),
(2, NULL,     NULL,   'Speech Lab',       'lab',      'Communication and public speaking training',    'speech,communication,public speaking,language',   200, 180, '🎤'),
-- Floor 3
(3, 'guide8', NULL,   'Skills Lab',       'lab',      'Hands-on technical training facility',          'skills,lab,technical,training,workshop',          150, 200, '🔧'),
(3, 'guide8', NULL,   'Room 301',         'classroom','General classroom for technical courses',       'classroom,301,technical,course',                  200, 250, '🚪'),
(3, 'guide8', NULL,   'Room 310',         'classroom','General classroom for academic programs',       'classroom,310,academic,program',                  350, 250, '🚪'),
-- Floor 4
(4, 'guide9', NULL,   'MOLA Auditorium',  'facility', 'Large multipurpose auditorium for events',      'auditorium,mola,events,assembly,graduation',      200, 300, '🎭'),
(4, 'guide9', 'fac2', 'Mock Bridge',      'lab',      'Ship bridge simulations and maritime training', 'mock bridge,maritime,simulation,navigation',      350, 200, '⚓'),
(4, 'guide9', 'fac2', 'GMDSS Room',       'lab',      'Global Maritime Distress and Safety System training', 'gmdss,maritime,communication,safety',       400, 250, '📡');


-- ============================================================================
-- TABLE 8: TAGS
-- Purpose: Lookup table for searchable tags
-- ============================================================================

CREATE TABLE tags (
    id         SERIAL       PRIMARY KEY,
    name       VARCHAR(50)  NOT NULL UNIQUE,
    created_at TIMESTAMPTZ  DEFAULT NOW()
);

INSERT INTO tags (name) VALUES
('sports'), ('academic'), ('competition'), ('cultural'), ('announcement'),
('library'), ('maritime'), ('technology'), ('health'), ('dining'),
('history'), ('milestone'), ('foundation'), ('navigation'), ('floor-1'),
('floor-2'), ('floor-3'), ('floor-4');


-- ============================================================================
-- TABLE 9: CONTENT_TAGS  (Many-to-Many junction)
-- Purpose: Attach multiple tags to any content item across all tables
-- Relationships:
--   content_tags (N) ──> tags (1)     [ FK: tag_id → tags.id ]
--   Polymorphic: (content_type + content_id) references events/history/etc.
-- ============================================================================

CREATE TABLE content_tags (
    id           SERIAL      PRIMARY KEY,
    tag_id       INT         NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('event','history','facility','campus_guide')),
    content_id   VARCHAR(10) NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tag_id, content_type, content_id)   -- prevent duplicate tagging
);

CREATE INDEX idx_ctags_tag         ON content_tags(tag_id);
CREATE INDEX idx_ctags_type_id     ON content_tags(content_type, content_id);

-- Seed some tags
INSERT INTO content_tags (tag_id, content_type, content_id) VALUES
(1,  'event',  'evt2'),   -- sports → basketball
(2,  'event',  'evt4'),   -- academic → career guidance
(3,  'event',  'evt1'),   -- competition → science fair
(4,  'event',  'evt3'),   -- cultural → diversity week
(5,  'event',  'evt1'),   -- announcement → science fair
(11, 'history','hist1'),  -- history → founding
(13, 'history','hist1'),  -- foundation → founding
(12, 'history','hist2'),  -- milestone → expansion
(6,  'facility','fac8'),  -- library → school library
(8,  'facility','fac1'),  -- technology → computer lab
(7,  'facility','fac2'),  -- maritime → maritime training
(9,  'facility','fac10'), -- health → clinic
(10, 'facility','fac9'),  -- dining → canteen
(15, 'campus_guide','guide1'), -- floor-1
(15, 'campus_guide','guide2'), -- floor-1
(15, 'campus_guide','guide3'), -- floor-1
(16, 'campus_guide','guide5'), -- floor-2
(17, 'campus_guide','guide8'), -- floor-3
(18, 'campus_guide','guide9'); -- floor-4


-- ============================================================================
-- TABLE 10: VOICE_SETTINGS
-- Purpose: Available TTS voice configurations
-- Relationships:
--   voice_settings (1) ──< user_preferences (N) [ FK: voice_id → voice_settings.voice_id ]
--   voice_settings (1) ──< tts_usage_logs   (N) [ FK: voice_id → voice_settings.voice_id ]
-- ============================================================================

CREATE TABLE voice_settings (
    voice_id      VARCHAR(100) PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    lang          VARCHAR(10)  NOT NULL,
    gender        VARCHAR(10)  NOT NULL CHECK (gender IN ('male', 'female', 'neutral')),
    local_service BOOLEAN      DEFAULT TRUE,
    is_active     BOOLEAN      DEFAULT TRUE,
    created_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_voice_lang   ON voice_settings(lang);
CREATE INDEX idx_voice_gender ON voice_settings(gender);
CREATE INDEX idx_voice_active ON voice_settings(is_active);

INSERT INTO voice_settings (voice_id, name, lang, gender, local_service) VALUES
('google_us_en',      'Google US English',        'en-US', 'female', TRUE),
('google_uk_en',      'Google UK English Female', 'en-GB', 'female', TRUE),
('microsoft_david',   'Microsoft David',          'en-US', 'male',   TRUE),
('microsoft_zira',    'Microsoft Zira',           'en-US', 'female', TRUE),
('google_us_en_male', 'Google US English Male',   'en-US', 'male',   TRUE);


-- ============================================================================
-- TABLE 11: USER_PREFERENCES
-- Purpose: Public visitor settings (theme, voice, last state)
-- Relationships:
--   user_preferences (N) ──> voice_settings (1) [ FK: voice_id → voice_settings.voice_id ]
--   user_preferences (1) ──< search_logs    (N) [ FK: user_id  → user_preferences.user_id ]
--   user_preferences (1) ──< tts_usage_logs (N) [ FK: user_id  → user_preferences.user_id ]
-- ============================================================================

CREATE TABLE user_preferences (
    user_id        VARCHAR(50)  PRIMARY KEY,
    theme          VARCHAR(10)  DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    voice_id       VARCHAR(100) REFERENCES voice_settings(voice_id) ON DELETE SET NULL,
    speech_rate    NUMERIC(3,1) DEFAULT 1.0 CHECK (speech_rate BETWEEN 0.5 AND 2.0),
    last_category  VARCHAR(50),
    search_history JSONB        DEFAULT '[]'::JSONB,
    created_at     TIMESTAMPTZ  DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  DEFAULT NOW(),
    last_login     TIMESTAMPTZ
);

CREATE INDEX idx_user_pref_voice      ON user_preferences(voice_id);
CREATE INDEX idx_user_pref_last_login ON user_preferences(last_login);

INSERT INTO user_preferences (user_id, theme, voice_id, speech_rate, last_category, search_history) VALUES
('user_001', 'dark',  'google_us_en',      1.0, 'events',     '["library", "canteen", "registrar"]'),
('user_002', 'light', 'microsoft_david',   1.2, 'facilities', '["computer lab", "chemistry lab"]'),
('user_003', 'dark',  'google_uk_en',      0.9, 'history',    '["founding", "expansion"]');


-- ============================================================================
-- TABLE 12: SEARCH_LOGS
-- Purpose: Track search queries for analytics
-- Relationships:
--   search_logs (N) ──> user_preferences (1) [ FK: user_id → user_preferences.user_id ]
-- ============================================================================

CREATE TABLE search_logs (
    id            SERIAL       PRIMARY KEY,
    user_id       VARCHAR(50)  REFERENCES user_preferences(user_id) ON DELETE SET NULL,
    search_query  VARCHAR(255) NOT NULL,
    results_count INT,
    search_type   VARCHAR(10)  DEFAULT 'text' CHECK (search_type IN ('text', 'voice')),
    created_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_search_user         ON search_logs(user_id);
CREATE INDEX idx_search_query        ON search_logs(search_query);
CREATE INDEX idx_search_created      ON search_logs(created_at);
CREATE INDEX idx_search_user_created ON search_logs(user_id, created_at);


-- ============================================================================
-- TABLE 13: TTS_USAGE_LOGS
-- Purpose: Track Text-to-Speech playback analytics
-- Relationships:
--   tts_usage_logs (N) ──> user_preferences (1) [ FK: user_id  → user_preferences.user_id ]
--   tts_usage_logs (N) ──> voice_settings   (1) [ FK: voice_id → voice_settings.voice_id ]
--   tts_usage_logs (N) ──> admin_users      (1) [ FK: admin_id → admin_users.id ]  (optional)
--   Polymorphic reference: content_type + content_id → events | history | facilities | campus_guide
-- ============================================================================

CREATE TABLE tts_usage_logs (
    id               SERIAL       PRIMARY KEY,
    user_id          VARCHAR(50)  REFERENCES user_preferences(user_id) ON DELETE SET NULL,
    content_type     VARCHAR(20)  NOT NULL CHECK (content_type IN ('event', 'history', 'facility', 'campus_guide')),
    content_id       VARCHAR(10)  NOT NULL,
    voice_id         VARCHAR(100) REFERENCES voice_settings(voice_id) ON DELETE SET NULL,
    speech_rate      NUMERIC(3,1),
    duration_seconds INT,
    created_at       TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_tts_user         ON tts_usage_logs(user_id);
CREATE INDEX idx_tts_voice        ON tts_usage_logs(voice_id);
CREATE INDEX idx_tts_content_type ON tts_usage_logs(content_type);
CREATE INDEX idx_tts_content_id   ON tts_usage_logs(content_id);
CREATE INDEX idx_tts_created      ON tts_usage_logs(created_at);


-- ============================================================================
-- AUTO-UPDATE updated_at  FUNCTION & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_departments_updated_at    BEFORE UPDATE ON departments    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_admin_users_updated_at    BEFORE UPDATE ON admin_users    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_events_updated_at         BEFORE UPDATE ON events         FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_history_updated_at        BEFORE UPDATE ON history        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_facilities_updated_at     BEFORE UPDATE ON facilities     FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_campus_guide_updated_at   BEFORE UPDATE ON campus_guide   FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_navigation_data_updated_at BEFORE UPDATE ON navigation_data FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();


-- ============================================================================
-- TRIGGER: Append search term to user's search_history JSON array
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_after_search_log()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.user_id IS NOT NULL THEN
        UPDATE user_preferences
        SET search_history = (
            -- Keep last 20 searches
            (search_history || to_jsonb(NEW.search_query))
            -> (GREATEST(jsonb_array_length(search_history || to_jsonb(NEW.search_query)) - 20, 0))
        )
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_after_search_log
    AFTER INSERT ON search_logs
    FOR EACH ROW EXECUTE FUNCTION fn_after_search_log();


-- ============================================================================
-- VIEWS
-- ============================================================================

-- View 1: Upcoming active events with department info
CREATE VIEW active_events WITH (security_invoker = true) AS
SELECT
    e.id, e.title, e.content, e.event_date,
    e.category, e.priority, e.icon,
    d.name  AS department_name,
    d.icon  AS department_icon,
    d.color AS department_color,
    u.name  AS created_by_name
FROM events e
JOIN departments d ON e.dept_id = d.id
LEFT JOIN admin_users u ON e.created_by = u.id
WHERE e.is_active = TRUE AND e.event_date >= CURRENT_DATE
ORDER BY e.event_date ASC, e.priority DESC;

-- View 2: Facilities with usage count and department info
CREATE VIEW popular_facilities WITH (security_invoker = true) AS
SELECT
    f.id, f.title, f.category, f.icon,
    d.name  AS department_name,
    d.color AS department_color,
    COUNT(t.id) AS tts_play_count
FROM facilities f
JOIN departments d ON f.dept_id = d.id
LEFT JOIN tts_usage_logs t ON f.id = t.content_id AND t.content_type = 'facility'
WHERE f.is_active = TRUE
GROUP BY f.id, f.title, f.category, f.icon, d.name, d.color
ORDER BY tts_play_count DESC;

-- View 3: Navigation summary per floor with linked guide info
CREATE VIEW navigation_by_floor WITH (security_invoker = true) AS
SELECT
    nd.floor,
    COUNT(nd.id)                                AS location_count,
    STRING_AGG(DISTINCT nd.type, ', ' ORDER BY nd.type) AS types,
    STRING_AGG(DISTINCT cg.title, ' | ')        AS linked_guide_titles
FROM navigation_data nd
LEFT JOIN campus_guide cg ON nd.campus_guide_id = cg.id
WHERE nd.is_active = TRUE
GROUP BY nd.floor
ORDER BY nd.floor;

-- View 4: Search analytics ranked by frequency
CREATE VIEW search_analytics WITH (security_invoker = true) AS
SELECT
    search_query,
    COUNT(*)           AS search_count,
    AVG(results_count) AS avg_results,
    MAX(created_at)    AS last_searched,
    COUNT(DISTINCT user_id) AS unique_users
FROM search_logs
GROUP BY search_query
ORDER BY search_count DESC;

-- View 5: Department content summary (how much each dept has published)
CREATE VIEW dept_content_summary WITH (security_invoker = true) AS
SELECT
    d.id AS dept_id, d.name, d.icon, d.color,
    COUNT(DISTINCT e.id)  AS event_count,
    COUNT(DISTINCT f.id)  AS facility_count,
    COUNT(DISTINCT cg.id) AS guide_count
FROM departments d
LEFT JOIN events        e  ON e.dept_id  = d.id AND e.is_active  = TRUE
LEFT JOIN facilities    f  ON f.dept_id  = d.id AND f.is_active  = TRUE
LEFT JOIN campus_guide  cg ON cg.dept_id = d.id AND cg.is_active = TRUE
GROUP BY d.id, d.name, d.icon, d.color
ORDER BY d.name;

-- View 6: TTS analytics by content type
CREATE VIEW tts_analytics WITH (security_invoker = true) AS
SELECT
    content_type,
    COUNT(*)                        AS play_count,
    AVG(duration_seconds)           AS avg_duration_sec,
    COUNT(DISTINCT user_id)         AS unique_listeners,
    vs.name                         AS most_used_voice
FROM tts_usage_logs t
LEFT JOIN voice_settings vs ON t.voice_id = vs.voice_id
GROUP BY content_type, vs.name
ORDER BY play_count DESC;


-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function 1: Full-text search across all content tables
CREATE OR REPLACE FUNCTION search_content(search_term TEXT)
RETURNS TABLE (
    source_type  TEXT,
    id           TEXT,
    title        VARCHAR(255),
    content      TEXT,
    category     VARCHAR(50),
    icon         VARCHAR(20),
    dept_name    TEXT,
    dept_color   TEXT
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
        SELECT 'event'::TEXT, e.id, e.title, e.content, e.category, e.icon,
               d.name::TEXT, d.color::TEXT
        FROM events e JOIN departments d ON e.dept_id = d.id
        WHERE e.is_active = TRUE AND (
            e.title    ILIKE '%' || search_term || '%' OR
            e.content  ILIKE '%' || search_term || '%' OR
            e.category ILIKE '%' || search_term || '%'
        )
        UNION ALL
        SELECT 'history'::TEXT, h.id, h.title, h.content, h.category, h.icon,
               NULL, NULL
        FROM history h
        WHERE h.is_active = TRUE AND (
            h.title    ILIKE '%' || search_term || '%' OR
            h.content  ILIKE '%' || search_term || '%' OR
            h.category ILIKE '%' || search_term || '%'
        )
        UNION ALL
        SELECT 'facility'::TEXT, f.id, f.title, f.content, f.category, f.icon,
               d.name::TEXT, d.color::TEXT
        FROM facilities f JOIN departments d ON f.dept_id = d.id
        WHERE f.is_active = TRUE AND (
            f.title    ILIKE '%' || search_term || '%' OR
            f.content  ILIKE '%' || search_term || '%' OR
            f.category ILIKE '%' || search_term || '%'
        )
        UNION ALL
        SELECT 'campus_guide'::TEXT, cg.id, cg.title, cg.content, cg.category, cg.icon,
               d.name::TEXT, d.color::TEXT
        FROM campus_guide cg
        LEFT JOIN departments d ON cg.dept_id = d.id
        WHERE cg.is_active = TRUE AND (
            cg.title    ILIKE '%' || search_term || '%' OR
            cg.content  ILIKE '%' || search_term || '%' OR
            cg.category ILIKE '%' || search_term || '%'
        )
        ORDER BY source_type, title;
END;
$$;

-- Function 2: Get all navigation map points for a floor, with guide + facility links
CREATE OR REPLACE FUNCTION get_floor_navigation(floor_num INT)
RETURNS TABLE (
    id              INT,
    name            VARCHAR(255),
    type            VARCHAR(20),
    description     TEXT,
    keywords        TEXT,
    coordinate_x    INT,
    coordinate_y    INT,
    icon            VARCHAR(20),
    campus_guide_id VARCHAR(10),
    guide_title     VARCHAR(255),
    facility_id     VARCHAR(10),
    facility_title  VARCHAR(255)
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
        SELECT nd.id, nd.name, nd.type, nd.description, nd.keywords,
               nd.coordinate_x, nd.coordinate_y, nd.icon,
               nd.campus_guide_id, cg.title AS guide_title,
               nd.facility_id,    f.title  AS facility_title
        FROM navigation_data nd
        LEFT JOIN campus_guide cg ON nd.campus_guide_id = cg.id
        LEFT JOIN facilities   f  ON nd.facility_id     = f.id
        WHERE nd.floor = floor_num AND nd.is_active = TRUE
        ORDER BY nd.type, nd.name;
END;
$$;

-- Function 3: Get all content owned by a department (joined)
CREATE OR REPLACE FUNCTION get_department_content(p_dept_id VARCHAR)
RETURNS TABLE (
    content_type VARCHAR(20),
    id           TEXT,
    title        VARCHAR(255),
    category     VARCHAR(50),
    priority     VARCHAR(10),
    icon         VARCHAR(20)
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
        SELECT 'event'::VARCHAR(20), e.id, e.title, e.category, e.priority, e.icon
        FROM events e WHERE e.dept_id = p_dept_id AND e.is_active = TRUE
        UNION ALL
        SELECT 'facility'::VARCHAR(20), f.id, f.title, f.category, f.priority, f.icon
        FROM facilities f WHERE f.dept_id = p_dept_id AND f.is_active = TRUE
        UNION ALL
        SELECT 'campus_guide'::VARCHAR(20), cg.id, cg.title, cg.category, cg.priority, cg.icon
        FROM campus_guide cg WHERE cg.dept_id = p_dept_id AND cg.is_active = TRUE
        ORDER BY content_type, title;
END;
$$;

-- Function 4: Log TTS usage (convenience wrapper)
CREATE OR REPLACE FUNCTION log_tts_usage(
    p_user_id      TEXT,
    p_content_type TEXT,
    p_content_id   TEXT,
    p_voice_id     TEXT,
    p_speech_rate  NUMERIC,
    p_duration     INT
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO tts_usage_logs (user_id, content_type, content_id, voice_id, speech_rate, duration_seconds)
    VALUES (p_user_id, p_content_type, p_content_id, p_voice_id, p_speech_rate, p_duration);
END;
$$;


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE departments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE history          ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities       ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_guide     ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_data  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags             ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_usage_logs   ENABLE ROW LEVEL SECURITY;

-- Departments: public read
CREATE POLICY "Public read departments"       ON departments     FOR SELECT USING (is_active = TRUE);
-- Admin users: anon full access (admin panel uses anon key)
CREATE POLICY "Anon manage admin_users"       ON admin_users     FOR ALL    USING (true) WITH CHECK (true);
-- Content: public read, anon write
CREATE POLICY "Public read events"            ON events          FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anon manage events"            ON events          FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read history"           ON history         FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anon manage history"           ON history         FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read facilities"        ON facilities      FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anon manage facilities"        ON facilities      FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read campus_guide"      ON campus_guide    FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Anon manage campus_guide"      ON campus_guide    FOR ALL    USING (true) WITH CHECK (true);
-- Navigation: public read
CREATE POLICY "Public read navigation"        ON navigation_data FOR SELECT USING (is_active = TRUE);
-- Tags: public read, anon write
CREATE POLICY "Public read tags"              ON tags            FOR SELECT USING (true);
CREATE POLICY "Public read content_tags"      ON content_tags    FOR SELECT USING (true);
CREATE POLICY "Anon manage content_tags"      ON content_tags    FOR ALL    USING (true) WITH CHECK (true);
-- Voice settings: public read
CREATE POLICY "Public read voice_settings"    ON voice_settings  FOR SELECT USING (is_active = TRUE);
-- User prefs: anon full
CREATE POLICY "Anon manage user_preferences"  ON user_preferences FOR ALL   USING (true) WITH CHECK (true);
-- Analytics: anon insert + read
CREATE POLICY "Anon log searches"             ON search_logs     FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon read search_logs"         ON search_logs     FOR SELECT USING (true);
CREATE POLICY "Anon log tts"                  ON tts_usage_logs  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon read tts_logs"            ON tts_usage_logs  FOR SELECT USING (true);


-- ============================================================================
-- USEFUL REFERENCE QUERIES
-- ============================================================================

-- All upcoming events with department badge:
-- SELECT * FROM active_events;

-- Search across all content:
-- SELECT * FROM search_content('library');

-- Full floor map with linked guide + facility:
-- SELECT * FROM get_floor_navigation(2);

-- Everything owned by registrar dept:
-- SELECT * FROM get_department_content('registrar');

-- Popular facilities by TTS plays:
-- SELECT * FROM popular_facilities LIMIT 10;

-- Navigation summary per floor:
-- SELECT * FROM navigation_by_floor;

-- Search trends:
-- SELECT * FROM search_analytics LIMIT 20;

-- Department publishing summary:
-- SELECT * FROM dept_content_summary;

-- TTS analytics:
-- SELECT * FROM tts_analytics;

-- ============================================================================
-- END OF SCHEMA — V.I.R.A. v3.0
-- ============================================================================
