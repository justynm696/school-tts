-- ============================================================================
-- V.I.R.A. (Virtual Interactive Resource Assistant)
-- Complete Database Schema - SQL Script
-- Celtech College Olongapo
-- ============================================================================
-- Database: celtech_vira
-- Version: 1.0
-- Created: February 15, 2026
-- ============================================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS celtech_vira
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE celtech_vira;

-- ============================================================================
-- TABLE 1: EVENTS
-- Purpose: Store school events and announcements
-- ============================================================================

CREATE TABLE events (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    event_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    
    INDEX idx_event_date (event_date),
    INDEX idx_category (category),
    INDEX idx_priority (priority),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Events
INSERT INTO events (id, title, content, event_date, category, priority, icon) VALUES
('evt1', 'Annual Science Fair 2026', 'Get ready for our biggest science fair yet! Students from all grades are invited to participate and showcase their innovative science projects. The fair will be held on February 15th in the school gymnasium. Registration deadline is February 1st. Prizes will be awarded for the most creative and scientifically sound projects.', '2026-02-15', 'Competition', 'high', '🔬'),
('evt2', 'Inter-School Basketball Tournament', 'Our school basketball team will be competing in the regional inter-school tournament from January 25th to 27th. All students are encouraged to come and support our team. The matches will be held at the City Sports Complex. Let\'s cheer our team to victory!', '2026-01-25', 'Sports', 'medium', '🏀'),
('evt3', 'Cultural Diversity Week', 'Join us for Cultural Diversity Week from February 5th to 9th! Students will have the opportunity to learn about different cultures through food, music, dance, and art. Each day will feature a different region of the world. Don\'t miss this enriching cultural experience!', '2026-02-05', 'Cultural', 'medium', '🌍'),
('evt4', 'Career Guidance Workshop', 'High school students are invited to attend a career guidance workshop on January 30th. Industry professionals from various fields will share their experiences and provide valuable insights into different career paths. This is a great opportunity to explore your future options.', '2026-01-30', 'Academic', 'high', '💼');

-- ============================================================================
-- TABLE 2: HISTORY
-- Purpose: Store institutional history and milestones
-- ============================================================================

CREATE TABLE history (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    milestone_date DATE,
    category VARCHAR(50) NOT NULL,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_milestone_date (milestone_date),
    INDEX idx_category (category),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for History
INSERT INTO history (id, title, content, milestone_date, category, priority, icon) VALUES
('hist1', 'Phase 1: Founding and Early History (1959)', 'Central Luzon College of Science and Technology (CELTECH College) was conceptualized on May 20, 1959, by Doña Helen P. Legaspi. It officially opened on September 24, 1959, in San Fernando, Pampanga, as the Artistic Vocational School (AVS), initially focusing on fashion and vocational education.', '1959-09-24', 'Foundation', 'high', '🏛️'),
('hist2', 'Phase 2: Expansion to Olongapo (1970s-1980s)', 'During the 1970s and 1980s, the college established its presence in Olongapo City. The Olongapo campus became a primary education hub for Amerasians—children of U.S. servicemen stationed at the nearby naval bases.', '1975-01-01', 'Expansion', 'medium', '📈'),
('hist3', 'Phase 3: Evolution into CELTECH - A Model Institution', 'The school evolved from a small vocational center into a "model institution of higher learning," adopting the name Central Luzon College of Science and Technology to reflect its broader academic offerings.', '2000-01-01', 'Modernization', 'high', '🎓');

-- ============================================================================
-- TABLE 3: FACILITIES
-- Purpose: Store campus facilities and resources
-- ============================================================================

CREATE TABLE facilities (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    icon VARCHAR(10),
    capacity INT,
    operating_hours VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_priority (priority),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Facilities
INSERT INTO facilities (id, title, content, category, priority, icon, capacity, operating_hours) VALUES
('fac1', 'Computer Laboratories - Five State-of-the-Art Labs', 'CELTECH College boasts five state-of-the-art computer laboratories equipped with over 200 modern computers running the latest software for programming, design, and engineering applications.', 'Technology', 'high', '💻', 200, '7:00 AM - 8:00 PM (Mon-Fri), 8:00 AM - 5:00 PM (Sat)'),
('fac2', 'Maritime Training Facilities - World-Class Simulators', 'CELTECH\'s maritime training facilities are among the best in the region, featuring state-of-the-art ship bridge simulators, engine room simulators, and GMDSS training rooms.', 'Maritime', 'high', '⚓', 50, '8:00 AM - 6:00 PM (Mon-Sat)'),
('fac8', 'School Library and Information Center - 200-Seat Capacity', 'The CELTECH School Library and Information Center on the 2nd floor is a comprehensive learning resource hub housing over 15,000 books, journals, and academic publications.', 'Academic', 'high', '📚', 200, '7:00 AM - 7:00 PM (Mon-Fri), 8:00 AM - 4:00 PM (Sat)');

-- ============================================================================
-- TABLE 4: CAMPUS_GUIDE
-- Purpose: Store campus navigation and location information
-- ============================================================================

CREATE TABLE campus_guide (
    id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority ENUM('high', 'medium', 'low') DEFAULT 'medium',
    icon VARCHAR(10),
    floor_number INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_floor (floor_number),
    INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Campus Guide
INSERT INTO campus_guide (id, title, content, category, priority, icon, floor_number) VALUES
('guide1', '1st Floor - Main Entrance & Administrative Offices', 'Welcome to the 1st Floor, the main entry point to Celtech College. Upon entering through the main entrance, you will find the spacious Lobby and Waiting Area directly ahead.', 'Navigation', 'high', '🏢', 1),
('guide2', '1st Floor - Room Directory', 'First Floor Room Directory: Entrance and Lobby, Registrar Office, Finance Office, CESO Office, Faculty Lounge, Tourism Lab, OSSAA Office, and more.', 'Rooms', 'high', '🚪', 1),
('guide3', '2nd Floor - Library & Computer Facilities', 'The 2nd Floor is the academic heart of Celtech College, featuring the School Library and Information Center on the left side.', 'Navigation', 'high', '📚', 2);

-- ============================================================================
-- TABLE 5: NAVIGATION_DATA
-- Purpose: Store interactive campus navigation system data
-- ============================================================================

CREATE TABLE navigation_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    floor INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    type ENUM('office', 'lab', 'classroom', 'facility', 'amenity') NOT NULL,
    description TEXT,
    keywords TEXT,
    coordinate_x INT,
    coordinate_y INT,
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_floor (floor),
    INDEX idx_type (type),
    INDEX idx_name (name),
    INDEX idx_active (is_active),
    FULLTEXT INDEX idx_keywords (keywords, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Navigation Data
INSERT INTO navigation_data (floor, name, type, description, keywords, coordinate_x, coordinate_y, icon) VALUES
-- Floor 1
(1, 'Registrar Office', 'office', 'Student enrollment, records, and transcripts', 'registrar,enrollment,records,transcript,grades', 150, 200, '📋'),
(1, 'Finance Office', 'office', 'Tuition payments and financial services', 'finance,payment,tuition,cashier,billing', 250, 200, '💰'),
(1, 'Canteen', 'amenity', 'Student and faculty dining area', 'canteen,food,dining,cafeteria,lunch', 300, 350, '🍽️'),
(1, 'Chemistry Lab', 'lab', 'Chemistry experiments and practicals', 'chemistry,lab,science,experiment', 400, 250, '🧪'),
(1, 'Library', 'facility', 'School Library and Information Center', 'library,books,study,reading,research', 100, 150, '📚'),

-- Floor 2
(2, 'School Library', 'facility', 'Main library with books, journals, computers, and study areas', 'library,books,study,research,reading,journals', 100, 150, '📚'),
(2, 'Computer Lab', 'lab', 'Modern computers and software for IT courses', 'computer,lab,IT,programming,software', 300, 200, '💻'),
(2, 'Crime Lab', 'lab', 'Criminology students forensic training and investigations', 'crime,lab,criminology,forensic,investigation', 350, 250, '🔬'),
(2, 'Physics Lab', 'lab', 'Physics experiments, demonstrations, and practicals', 'physics,lab,science,experiment', 400, 300, '⚛️'),
(2, 'Speech Lab', 'lab', 'Communication and public speaking training', 'speech,communication,public speaking,language', 200, 180, '🎤'),

-- Floor 3
(3, 'Skills Lab', 'lab', 'Hands-on technical training facility', 'skills,lab,technical,training,workshop', 150, 200, '🔧'),
(3, 'Room 301', 'classroom', 'General classroom for technical courses', 'classroom,301,technical,course', 200, 250, '🚪'),
(3, 'Room 310', 'classroom', 'General classroom for academic programs', 'classroom,310,academic,program', 350, 250, '🚪'),

-- Floor 4
(4, 'MOLA Auditorium', 'facility', 'Large multipurpose auditorium for events and assemblies', 'auditorium,mola,events,assembly,graduation', 200, 300, '🎭'),
(4, 'Mock Bridge', 'lab', 'Ship bridge simulations and maritime training', 'mock bridge,maritime,simulation,navigation', 350, 200, '⚓'),
(4, 'GMDSS Room', 'lab', 'Global Maritime Distress and Safety System training', 'gmdss,maritime,communication,safety', 400, 250, '📡');

-- ============================================================================
-- TABLE 6: USER_PREFERENCES
-- Purpose: Store user settings and preferences
-- ============================================================================

CREATE TABLE user_preferences (
    user_id VARCHAR(50) PRIMARY KEY,
    theme ENUM('light', 'dark') DEFAULT 'light',
    voice_id VARCHAR(100),
    speech_rate DECIMAL(2,1) DEFAULT 1.0,
    last_category VARCHAR(50),
    search_history JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    INDEX idx_theme (theme),
    INDEX idx_last_login (last_login),
    CONSTRAINT chk_speech_rate CHECK (speech_rate BETWEEN 0.5 AND 2.0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for User Preferences
INSERT INTO user_preferences (user_id, theme, voice_id, speech_rate, last_category, search_history) VALUES
('user_001', 'dark', 'Google US English', 1.0, 'events', '["library", "canteen", "registrar"]'),
('user_002', 'light', 'Microsoft David', 1.2, 'facilities', '["computer lab", "chemistry lab"]'),
('user_003', 'dark', 'Google UK English Female', 0.9, 'history', '["founding", "expansion"]');

-- ============================================================================
-- TABLE 7: VOICE_SETTINGS
-- Purpose: Store available TTS voice configurations
-- ============================================================================

CREATE TABLE voice_settings (
    voice_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lang VARCHAR(10) NOT NULL,
    gender ENUM('male', 'female', 'neutral') NOT NULL,
    local_service BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_lang (lang),
    INDEX idx_gender (gender),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data for Voice Settings
INSERT INTO voice_settings (voice_id, name, lang, gender, local_service) VALUES
('google_us_en', 'Google US English', 'en-US', 'female', TRUE),
('google_uk_en', 'Google UK English Female', 'en-GB', 'female', TRUE),
('microsoft_david', 'Microsoft David', 'en-US', 'male', TRUE),
('microsoft_zira', 'Microsoft Zira', 'en-US', 'female', TRUE),
('google_us_en_male', 'Google US English Male', 'en-US', 'male', TRUE);

-- ============================================================================
-- TABLE 8: SEARCH_LOGS
-- Purpose: Track search queries for analytics
-- ============================================================================

CREATE TABLE search_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    search_query VARCHAR(255) NOT NULL,
    results_count INT,
    search_type ENUM('text', 'voice') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_query (search_query),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES user_preferences(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 9: TTS_USAGE_LOGS
-- Purpose: Track TTS usage for analytics
-- ============================================================================

CREATE TABLE tts_usage_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    content_type ENUM('event', 'history', 'facility', 'campus_guide') NOT NULL,
    content_id VARCHAR(10) NOT NULL,
    voice_id VARCHAR(100),
    speech_rate DECIMAL(2,1),
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_content_type (content_type),
    INDEX idx_created (created_at),
    FOREIGN KEY (user_id) REFERENCES user_preferences(user_id) ON DELETE SET NULL,
    FOREIGN KEY (voice_id) REFERENCES voice_settings(voice_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View: Active Events
CREATE VIEW active_events AS
SELECT id, title, content, event_date, category, priority, icon
FROM events
WHERE is_active = TRUE AND event_date >= CURDATE()
ORDER BY event_date ASC, priority DESC;

-- View: Popular Facilities
CREATE VIEW popular_facilities AS
SELECT f.id, f.title, f.category, f.icon, COUNT(t.id) as usage_count
FROM facilities f
LEFT JOIN tts_usage_logs t ON f.id = t.content_id AND t.content_type = 'facility'
WHERE f.is_active = TRUE
GROUP BY f.id, f.title, f.category, f.icon
ORDER BY usage_count DESC;

-- View: Navigation Summary by Floor
CREATE VIEW navigation_by_floor AS
SELECT floor, COUNT(*) as location_count, 
       GROUP_CONCAT(DISTINCT type) as types
FROM navigation_data
WHERE is_active = TRUE
GROUP BY floor
ORDER BY floor;

-- View: Search Analytics
CREATE VIEW search_analytics AS
SELECT search_query, COUNT(*) as search_count, 
       AVG(results_count) as avg_results,
       MAX(created_at) as last_searched
FROM search_logs
GROUP BY search_query
ORDER BY search_count DESC
LIMIT 50;

-- ============================================================================
-- STORED PROCEDURES
-- ============================================================================

-- Procedure: Search Content
DELIMITER //
CREATE PROCEDURE search_content(IN search_term VARCHAR(255))
BEGIN
    -- Search in Events
    SELECT 'event' as type, id, title, content, category, icon
    FROM events
    WHERE is_active = TRUE AND (
        title LIKE CONCAT('%', search_term, '%') OR
        content LIKE CONCAT('%', search_term, '%') OR
        category LIKE CONCAT('%', search_term, '%')
    )
    UNION ALL
    -- Search in History
    SELECT 'history' as type, id, title, content, category, icon
    FROM history
    WHERE is_active = TRUE AND (
        title LIKE CONCAT('%', search_term, '%') OR
        content LIKE CONCAT('%', search_term, '%') OR
        category LIKE CONCAT('%', search_term, '%')
    )
    UNION ALL
    -- Search in Facilities
    SELECT 'facility' as type, id, title, content, category, icon
    FROM facilities
    WHERE is_active = TRUE AND (
        title LIKE CONCAT('%', search_term, '%') OR
        content LIKE CONCAT('%', search_term, '%') OR
        category LIKE CONCAT('%', search_term, '%')
    )
    UNION ALL
    -- Search in Campus Guide
    SELECT 'campus_guide' as type, id, title, content, category, icon
    FROM campus_guide
    WHERE is_active = TRUE AND (
        title LIKE CONCAT('%', search_term, '%') OR
        content LIKE CONCAT('%', search_term, '%') OR
        category LIKE CONCAT('%', search_term, '%')
    )
    ORDER BY type, title;
END //
DELIMITER ;

-- Procedure: Get Floor Navigation
DELIMITER //
CREATE PROCEDURE get_floor_navigation(IN floor_num INT)
BEGIN
    SELECT id, name, type, description, keywords, 
           coordinate_x, coordinate_y, icon
    FROM navigation_data
    WHERE floor = floor_num AND is_active = TRUE
    ORDER BY type, name;
END //
DELIMITER ;

-- Procedure: Log TTS Usage
DELIMITER //
CREATE PROCEDURE log_tts_usage(
    IN p_user_id VARCHAR(50),
    IN p_content_type VARCHAR(20),
    IN p_content_id VARCHAR(10),
    IN p_voice_id VARCHAR(100),
    IN p_speech_rate DECIMAL(2,1),
    IN p_duration INT
)
BEGIN
    INSERT INTO tts_usage_logs (user_id, content_type, content_id, voice_id, speech_rate, duration_seconds)
    VALUES (p_user_id, p_content_type, p_content_id, p_voice_id, p_speech_rate, p_duration);
END //
DELIMITER ;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: Update search logs after search
DELIMITER //
CREATE TRIGGER after_search_log
AFTER INSERT ON search_logs
FOR EACH ROW
BEGIN
    -- Update user's search history
    UPDATE user_preferences
    SET search_history = JSON_ARRAY_APPEND(
        COALESCE(search_history, JSON_ARRAY()),
        '$',
        NEW.search_query
    )
    WHERE user_id = NEW.user_id;
END //
DELIMITER ;

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Query 1: Get all upcoming events
-- SELECT * FROM active_events;

-- Query 2: Search for content
-- CALL search_content('library');

-- Query 3: Get navigation for specific floor
-- CALL get_floor_navigation(2);

-- Query 4: Get most popular facilities
-- SELECT * FROM popular_facilities LIMIT 10;

-- Query 5: Get user preferences
-- SELECT * FROM user_preferences WHERE user_id = 'user_001';

-- Query 6: Get all locations on a floor
-- SELECT * FROM navigation_data WHERE floor = 1 AND is_active = TRUE;

-- Query 7: Get search analytics
-- SELECT * FROM search_analytics;

-- Query 8: Get TTS usage statistics
-- SELECT content_type, COUNT(*) as usage_count, AVG(duration_seconds) as avg_duration
-- FROM tts_usage_logs
-- GROUP BY content_type;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_events_date_priority ON events(event_date, priority);
CREATE INDEX idx_facilities_category_active ON facilities(category, is_active);
CREATE INDEX idx_navigation_floor_type ON navigation_data(floor, type);
CREATE INDEX idx_search_logs_user_created ON search_logs(user_id, created_at);

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

-- Create application user
-- CREATE USER 'vira_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE ON celtech_vira.* TO 'vira_app'@'localhost';
-- GRANT EXECUTE ON celtech_vira.* TO 'vira_app'@'localhost';

-- Create admin user
-- CREATE USER 'vira_admin'@'localhost' IDENTIFIED BY 'admin_password_here';
-- GRANT ALL PRIVILEGES ON celtech_vira.* TO 'vira_admin'@'localhost';

-- FLUSH PRIVILEGES;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
