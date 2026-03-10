// School Information Data
const schoolData = {

    events: [
        {
            id: 'evt1',
            title: 'Annual Science Fair 2026',
            content: 'Get ready for our biggest science fair yet! Students from all grades are invited to participate and showcase their innovative science projects. The fair will be held on February 15th in the school gymnasium. Registration deadline is February 1st. Prizes will be awarded for the most creative and scientifically sound projects.',
            date: '2026-02-15',
            category: 'Competition',
            priority: 'high',
            icon: '🔬'
        },
        {
            id: 'evt2',
            title: 'Inter-School Basketball Tournament',
            content: 'Our school basketball team will be competing in the regional inter-school tournament from January 25th to 27th. All students are encouraged to come and support our team. The matches will be held at the City Sports Complex. Let\'s cheer our team to victory!',
            date: '2026-01-25',
            category: 'Sports',
            priority: 'medium',
            icon: '🏀'
        },
        {
            id: 'evt3',
            title: 'Cultural Diversity Week',
            content: 'Join us for Cultural Diversity Week from February 5th to 9th! Students will have the opportunity to learn about different cultures through food, music, dance, and art. Each day will feature a different region of the world. Don\'t miss this enriching cultural experience!',
            date: '2026-02-05',
            category: 'Cultural',
            priority: 'medium',
            icon: '🌍'
        },
        {
            id: 'evt4',
            title: 'Career Guidance Workshop',
            content: 'High school students are invited to attend a career guidance workshop on January 30th. Industry professionals from various fields will share their experiences and provide valuable insights into different career paths. This is a great opportunity to explore your future options.',
            date: '2026-01-30',
            category: 'Academic',
            priority: 'high',
            icon: '💼'
        }
    ],

    history: [
        {
            id: 'hist1',
            title: 'Phase 1: Founding and Early History (1959)',
            content: 'Central Luzon College of Science and Technology (CELTECH College) was conceptualized on May 20, 1959, by Doña Helen P. Legaspi. It officially opened on September 24, 1959, in San Fernando, Pampanga, as the Artistic Vocational School (AVS), initially focusing on fashion and vocational education. What began as a small vocational school has since expanded into a multi-campus institution offering higher education in maritime, healthcare, and business fields.',
            date: '1959-09-24',
            category: 'Foundation',
            priority: 'high',
            icon: '🏛️'
        },
        {
            id: 'hist2',
            title: 'Phase 2: Expansion to Olongapo (1970s-1980s)',
            content: 'During the 1970s and 1980s, the college established its presence in Olongapo City. During this period, the Olongapo campus became a primary education hub for Amerasians—children of U.S. servicemen stationed at the nearby naval bases in Olongapo and Subic—who enrolled in technical-vocational and college courses. This expansion marked a significant milestone in the institution\'s growth and community service, demonstrating CELTECH\'s commitment to serving diverse communities.',
            date: '1975-01-01',
            category: 'Expansion',
            priority: 'medium',
            icon: '📈'
        },
        {
            id: 'hist3',
            title: 'Phase 3: Evolution into CELTECH - A Model Institution',
            content: 'The school evolved from a small vocational center into a "model institution of higher learning," adopting the name Central Luzon College of Science and Technology to reflect its broader academic offerings in applied sciences and technology. This transformation represented a commitment to excellence in technical-vocational education and higher learning, positioning CELTECH as a leader in career development and professional education.',
            date: '2000-01-01',
            category: 'Modernization',
            priority: 'high',
            icon: '🎓'
        },
        {
            id: 'hist4',
            title: 'Current Campus Location and Facilities',
            content: 'The main Olongapo campus is situated in the building of the former Olongapo Doctor\'s Hospital in Upper Kalaklan. The campus features state-of-the-art facilities including air-conditioned laboratories, a mini-hospital for healthcare training, a mini-hotel for hospitality programs, a 200-seat library with internet access, dedicated automotive laboratories, and specialized crime laboratories for criminology students. These comprehensive facilities support hands-on learning across all programs.',
            date: '2020-01-01',
            category: 'Infrastructure',
            priority: 'high',
            icon: '🏢'
        },
        {
            id: 'hist5',
            title: 'Leadership - The Legaspi Family Legacy',
            content: 'As of 2026, the institution remains under the leadership of the Legaspi family, continuing the vision of founder Doña Helen P. Legaspi. Dr. Renato P. Legaspi serves as President and CEO, while Dr. Rene Paulo Legaspi serves as Senior Vice President and COO. Under their leadership, CELTECH has maintained its commitment to transformative education and continues to expand its programs and services to meet the evolving needs of students and industry.',
            date: '2026-01-20',
            category: 'Leadership',
            priority: 'high',
            icon: '👨‍💼'
        },
        {
            id: 'hist6',
            title: '66th Founding Anniversary Celebration',
            content: 'The college celebrated its 66th Founding Anniversary in late 2025 and early 2026, marking over six decades of excellence in education. This milestone celebration honored the institution\'s rich history, from its humble beginnings as the Artistic Vocational School in 1959 to its current status as a comprehensive multi-campus institution. The anniversary highlighted CELTECH\'s enduring commitment to transforming lives through quality education.',
            date: '2025-12-01',
            category: 'Achievement',
            priority: 'high',
            icon: '🎉'
        },
        {
            id: 'hist7',
            title: 'Institutional Vision - Leading Career Development',
            content: 'CELTECH College aims to be a leading career development and education center in various fields, including maritime, healthcare, and technical-vocational courses. The vision is to be a model for values-driven and globally competitive education, preparing students for employment both locally and internationally. CELTECH strives to produce graduates who are not only technically competent but also embody the values of integrity, professionalism, and social responsibility.',
            date: '2026-01-20',
            category: 'Vision',
            priority: 'high',
            icon: '🌟'
        },
        {
            id: 'hist8',
            title: 'Institutional Mission - Transformative Education',
            content: 'To achieve its vision, CELTECH is committed to offering high-quality education in science, technology, culture, and the arts. The college focuses on producing competent, productive, innovative, and socially responsible professionals and citizens. CELTECH encourages research among faculty and students and builds partnerships with various sectors to help students utilize their skills effectively. The institution is guided by transformative education that promotes personal integrity, professionalism, social responsibility, and productive citizenship.',
            date: '2026-01-20',
            category: 'Mission',
            priority: 'high',
            icon: '✨'
        },
        {
            id: 'hist9',
            title: 'College Philosophy and Credo',
            content: 'CELTECH\'s philosophy centers on transformative education that promotes personal integrity, professionalism, social responsibility, and productive citizenship. The institution believes in developing the whole person, not just imparting technical skills. This philosophy is embodied in CELTECH\'s powerful credo: "We Teach. We Train. We Touch. We Transform." These four pillars represent the college\'s commitment to comprehensive education that changes lives and builds better communities.',
            date: '2026-01-20',
            category: 'Philosophy',
            priority: 'high',
            icon: '💡'
        },
        {
            id: 'hist10',
            title: 'Digital Student Services - AIMS Portal',
            content: 'CELTECH provides comprehensive digital platforms for student administration through the AIMS Student Information System. Students can access their AIMS Student Account to view personal information, class schedules, grades, and school messages. This online portal streamlines academic management and keeps students connected with important updates. The AIMS system represents CELTECH\'s commitment to leveraging technology for improved student services and administrative efficiency.',
            date: '2026-01-20',
            category: 'Services',
            priority: 'medium',
            icon: '💻'
        },
        {
            id: 'hist11',
            title: 'Online Payment System - Dragonpay Integration',
            content: 'As of January 2026, CELTECH has officially implemented an online banking system via Dragonpay for faster and more convenient transactions. Students can now pay tuition and other fees using e-wallets, mobile banking, and various online payment methods. This digital payment system eliminates the need for long queues and provides students with flexible payment options, making financial transactions more efficient and accessible.',
            date: '2026-01-01',
            category: 'Services',
            priority: 'medium',
            icon: '💳'
        },
        {
            id: 'hist12',
            title: 'Financial Assistance Programs',
            content: 'CELTECH offers various financial assistance programs to support students in achieving their educational goals. These include the Tertiary Education Subsidy (TES) and the Tuition Discount Program (TDP). Information regarding these programs is regularly updated on official social channels. The college is committed to making quality education accessible to deserving students through these scholarship and financial aid opportunities.',
            date: '2026-01-20',
            category: 'Services',
            priority: 'medium',
            icon: '🎓'
        },
        {
            id: 'hist13',
            title: 'Maritime Programs and NaMMAT',
            content: 'CELTECH offers specialized maritime programs including BS Marine Transportation and BS Marine Engineering. Aspiring maritime students must register for the National Merchant Marine Aptitude Test (NaMMAT), a requirement for admission to these programs. Registration details and bulletins are provided via the CEM NaMMAT website. CELTECH\'s maritime programs are equipped with state-of-the-art simulators and training facilities, including bridge simulators and GMDSS training rooms, ensuring graduates meet international STCW standards.',
            date: '2026-01-20',
            category: 'Programs',
            priority: 'high',
            icon: '⚓'
        },
        {
            id: 'hist14',
            title: 'Criminology Department and Specialized Programs',
            content: 'CELTECH has a dedicated College of Criminology with specialized facilities including a crime laboratory for forensic training and investigations. The Criminology Department Resource Page provides detailed admission requirements for new students and transferees. The college also offers programs in healthcare, hospitality and tourism management, and various technical-vocational courses. Each program is designed to meet industry standards and prepare students for professional careers.',
            date: '2026-01-20',
            category: 'Programs',
            priority: 'high',
            icon: '🔬'
        },
        {
            id: 'hist15',
            title: 'Contact Information and Campus Resources',
            content: 'For general inquiries, CELTECH College can be reached at +63 917 114 0297 or via email at info@clcst.com.ph. The CELTECH Registrar Department handles adding and dropping subjects and official document requests. The campus provides comprehensive resources including air-conditioned laboratories, a mini-hospital, a mini-hotel, a 200-seat library with internet access, automotive laboratories, and crime laboratories. The Center for Research and Development (CReDe) supports institutional research initiatives. CELTECH maintains ISO 9001:2015 certification and STCW compliance for maritime programs.',
            date: '2026-01-20',
            category: 'Contact',
            priority: 'medium',
            icon: '📞'
        }
    ],
    facilities: [
        {
            id: 'fac1',
            title: 'Computer Laboratories - Five State-of-the-Art Labs',
            content: 'CELTECH College boasts five state-of-the-art computer laboratories equipped with over 200 modern computers running the latest software for programming, design, and engineering applications. Each lab features high-speed internet connectivity, air conditioning, and ergonomic furniture for comfortable learning. The labs are open from 7:00 AM to 8:00 PM on weekdays and 8:00 AM to 5:00 PM on Saturdays. Students have access to industry-standard software including AutoCAD for engineering design, Adobe Creative Suite for multimedia and graphics, Microsoft Office for productivity, and various programming environments for software development. The computer labs support courses in Information Technology, Computer Science, Engineering, and Multimedia Arts.',
            date: '2026-01-24',
            category: 'Technology',
            priority: 'high',
            icon: '💻'
        },
        {
            id: 'fac2',
            title: 'Maritime Training Facilities - World-Class Simulators',
            content: 'CELTECH\'s maritime training facilities are among the best in the region, featuring state-of-the-art ship bridge simulators, engine room simulators, and GMDSS (Global Maritime Distress and Safety System) training rooms. The Mock Bridge on the 4th floor provides realistic ship navigation training, while the Engineering Simulator offers hands-on experience with marine engine operations. The Plotting Room is equipped for navigation and chart work exercises. These facilities meet international STCW (Standards of Training, Certification and Watchkeeping for Seafarers) standards, ensuring our maritime graduates are globally competitive. The Solas Lab on the 1st floor provides Safety of Life at Sea training, covering emergency procedures, firefighting, and survival techniques.',
            date: '2026-01-24',
            category: 'Maritime',
            priority: 'high',
            icon: '⚓'
        },
        {
            id: 'fac3',
            title: 'Criminology and Forensic Science Laboratory',
            content: 'The Crime Lab on the 2nd floor is a specialized facility for criminology students, equipped with modern forensic investigation tools and equipment. Students learn crime scene investigation, evidence collection and preservation, fingerprint analysis, ballistics examination, and forensic photography. The laboratory includes mock crime scenes for practical training, microscopes for trace evidence analysis, and documentation equipment. The facility supports the College of Criminology\'s mission to produce competent law enforcement professionals. Students also have access to the Moot Court in Room 201 for legal studies and mock trial simulations, providing comprehensive preparation for careers in criminal justice and law enforcement.',
            date: '2026-01-24',
            category: 'Criminology',
            priority: 'high',
            icon: '🔬'
        },
        {
            id: 'fac4',
            title: 'Healthcare Training Facilities - Mini-Hospital and Clinic',
            content: 'CELTECH provides comprehensive healthcare training facilities including a fully-equipped mini-hospital for nursing and healthcare students. The facility features patient care simulation rooms, medical equipment for hands-on training, and a modern clinic with a registered nurse on duty for student health services. Healthcare students practice patient assessment, medication administration, wound care, and emergency response procedures in a realistic clinical environment. The mini-hospital supports programs in Nursing, Midwifery, and other allied health courses. The facility is equipped with hospital beds, vital signs monitors, medical supplies, and training mannequins for various medical procedures, ensuring graduates are well-prepared for professional healthcare careers.',
            date: '2026-01-24',
            category: 'Healthcare',
            priority: 'high',
            icon: '🏥'
        },
        {
            id: 'fac5',
            title: 'Hospitality and Tourism Management Facilities',
            content: 'The College of Tourism, Travel Management, and Hospitality Management (CTTHM) is supported by world-class facilities including the Tourism Lab, Kitchen Lab, Food and Beverage Lab, and a mini-hotel for practical training. The Kitchen Lab is a professional culinary training facility where students learn food preparation, cooking techniques, menu planning, and kitchen management. The Food and Beverage Lab provides training in restaurant service, bartending, table setting, and customer service. The mini-hotel offers hands-on experience in hotel operations, front desk management, housekeeping, and guest relations. The Function Room is used for event management training, including banquet service, catering, and event coordination. These facilities ensure hospitality students receive industry-standard training.',
            date: '2026-01-24',
            category: 'Hospitality',
            priority: 'high',
            icon: '🏨'
        },
        {
            id: 'fac6',
            title: 'Engineering and Technical Workshops',
            content: 'CELTECH\'s engineering workshops provide hands-on training in electronics, mechanics, and industrial technology. The Electrical Lab is equipped with oscilloscopes, signal generators, multimeters, and circuit testing equipment for electrical engineering practicals. The Mechanical Area features lathes, milling machines, welding stations, and metalworking tools for mechanical engineering training. The Refrigeration and Air Conditioning Lab offers specialized training in HVAC systems, refrigeration cycles, and climate control technology. The Automotive Bay provides vehicle maintenance and repair training with diagnostic equipment and automotive tools. All workshops are supervised by qualified technicians and instructors, with safety equipment and protective gear provided to all students. These facilities support Engineering, Industrial Technology, and Automotive Technology programs.',
            date: '2026-01-24',
            category: 'Technical',
            priority: 'high',
            icon: '🔧'
        },
        {
            id: 'fac7',
            title: 'Science Laboratories - Chemistry and Physics',
            content: 'CELTECH maintains well-equipped science laboratories for chemistry and physics education. The Chemistry Lab on the 1st floor features fume hoods, laboratory benches, chemical storage facilities, and a complete set of laboratory glassware and equipment for conducting experiments in general chemistry, organic chemistry, and analytical chemistry. Students perform titrations, distillations, synthesis reactions, and qualitative analysis. The Physics Lab in Room 212 on the 2nd floor is equipped with apparatus for mechanics, electricity and magnetism, optics, thermodynamics, and modern physics experiments. Both laboratories support science education across all programs and provide essential practical training for students in scientific fields.',
            date: '2026-01-24',
            category: 'Science',
            priority: 'medium',
            icon: '🧪'
        },
        {
            id: 'fac8',
            title: 'School Library and Information Center - 200-Seat Capacity',
            content: 'The CELTECH School Library and Information Center on the 2nd floor is a comprehensive learning resource hub housing over 15,000 books, journals, academic publications, and reference materials covering all fields of study. The library features a digital section with e-books, online databases, and electronic journals accessible to all students. The 200-seat capacity includes comfortable reading areas, individual study carrels for focused work, and group discussion rooms for collaborative learning. The library is equipped with computers for research, internet access, and a printing station. Library hours are Monday to Friday 7:00 AM to 7:00 PM, and Saturday 8:00 AM to 4:00 PM. Students can borrow up to 5 books for two weeks. Professional librarians provide research assistance, information literacy programs, and bibliographic instruction to support academic success.',
            date: '2026-01-24',
            category: 'Academic',
            priority: 'high',
            icon: '📚'
        },
        {
            id: 'fac9',
            title: 'Communication and Language Laboratories',
            content: 'The Speech Lab in Room 208 on the 2nd floor is a specialized facility for developing communication skills, public speaking, oral interpretation, and language proficiency. The lab is equipped with audio recording equipment, presentation tools, and individual practice stations where students can record and review their speeches and presentations. The facility supports English, Communication Arts, and Public Speaking courses. Students practice pronunciation, voice modulation, articulation, and presentation delivery in a supportive environment. The Speech Lab also hosts debate competitions, declamation contests, and public speaking workshops. This facility is essential for developing the communication competencies required in all professional fields.',
            date: '2026-01-24',
            category: 'Communication',
            priority: 'medium',
            icon: '🎤'
        },
        {
            id: 'fac10',
            title: 'Innovation Hub and Maker Space - Cutting-Edge Technology',
            content: 'The newly established Innovation Hub and Maker Space represents CELTECH\'s commitment to fostering creativity, innovation, and entrepreneurship. This state-of-the-art facility is equipped with 3D printers for rapid prototyping, laser cutters for precision fabrication, electronics prototyping tools including Arduino and Raspberry Pi kits, soldering stations, and collaborative workspaces designed for team projects. Students can develop prototypes, work on capstone projects, create innovative products, and bring their entrepreneurial ideas to life. The space hosts regular workshops on design thinking, entrepreneurship, emerging technologies, product development, and startup creation. The Innovation Hub is open to all students and serves as a vibrant center for creativity, experimentation, and technological innovation on campus.',
            date: '2026-01-24',
            category: 'Innovation',
            priority: 'high',
            icon: '🚀'
        },
        {
            id: 'fac11',
            title: 'MOLA Auditorium - Multipurpose Event Venue',
            content: 'The MOLA Auditorium on the 4th floor is a large multipurpose hall with a seating capacity for several hundred people. This impressive venue hosts assemblies, seminars, conferences, graduation ceremonies, cultural performances, and special events. The auditorium features comfortable theater-style seating, modern audio-visual equipment including projectors, sound systems, and stage lighting, air conditioning, and a spacious stage for performances and presentations. The MOLA Auditorium serves as the heart of campus events and celebrations, bringing the CELTECH community together for important occasions. The venue is also available for external bookings for professional conferences, corporate events, and community gatherings, making it a valuable resource for both the college and the wider Olongapo community.',
            date: '2026-01-24',
            category: 'Events',
            priority: 'high',
            icon: '🎭'
        },
        {
            id: 'fac12',
            title: 'Student Services, Amenities, and Campus Life',
            content: 'CELTECH provides comprehensive student services and amenities to support academic success, personal development, and campus life. The modern Canteen on the 1st floor serves affordable and nutritious meals, snacks, and beverages throughout the day. The Student Lounge offers comfortable seating, entertainment facilities, and spaces for relaxation and socialization. The Guidance Office provides counseling services, career guidance, psychological support, and personal development programs. The OSSAA (Office of Student Services and Activities Affairs) coordinates student organizations, clubs, events, and extracurricular activities. The campus features free WiFi coverage throughout all buildings, ATM machines for convenient banking, a bookstore for textbooks and supplies, and photocopy and printing services. Security personnel are on duty 24/7 to ensure campus safety and security. These comprehensive services create a supportive and enriching campus environment for all CELTECH students.',
            date: '2026-01-24',
            category: 'Services',
            priority: 'medium',
            icon: '🎓'
        }
    ],
    campus_guide: [
        {
            id: 'guide1',
            title: '1st Floor - Main Entrance & Administrative Offices',
            content: 'Welcome to the 1st Floor, the main entry point to Celtech College. Upon entering through the main entrance, you will find the spacious Lobby and Waiting Area directly ahead. To your right is the Registrar Office for enrollment and academic records, followed by the Finance Office for payments and financial matters. The CESO Office and Faculty Lounge are located near the entrance. The 1st Floor also houses important facilities including the Tourism Lab, OSSAA Office, Academics Research Office, Asset Management Office, Guidance Office, Clinic, HRS Office, Onboard Training Office, Maritime Faculty Room, and CTTHM Storage. For dining, the Canteen is centrally located with the Kitchen Lab and Function Room nearby. Technical facilities include the Chemistry Lab, Food and Beverage Lab, Electrical Lab, Solas Lab, Mechanical Area, and Refrigeration and Air Conditioning Lab. The basement area is also accessible from this floor.',
            date: '2026-01-23',
            category: 'Navigation',
            priority: 'high',
            icon: '🏢'
        },
        {
            id: 'guide2',
            title: '1st Floor - Room Directory',
            content: 'First Floor Room Directory: Entrance and Lobby - Main entrance and waiting area. Registrar Office - Student enrollment, records, and transcripts. Finance Office - Tuition payments and financial services. CESO Office - Community extension services. Faculty Lounge - Faculty rest and meeting area. Tourism Lab - Hospitality and tourism training. OSSAA Office - Student affairs and activities. Academics Research Office - Research support and resources. Asset Management Office - Inventory and asset tracking. Guidance Office - Student counseling and support. Clinic - Medical services and first aid. HRS Office - Human resources and staffing. Onboard Training Office - Maritime training coordination. Maritime Faculty Room - Maritime instructors office. CTTHM Storage - Storage for hospitality equipment. Canteen - Student and faculty dining area. Kitchen Lab - Culinary arts training kitchen. Function Room - Events and gatherings. Chemistry Lab - Chemistry experiments and practicals. Food and Beverage Lab - F&B service training. Electrical Lab - Electrical engineering practicals. Solas Lab - Safety of Life at Sea training. Mechanical Area - Mechanical workshop. Refrigeration and Air Conditioning Lab - HVAC training facility. Basement - Storage and utilities.',
            date: '2026-01-23',
            category: 'Rooms',
            priority: 'high',
            icon: '🚪'
        },
        {
            id: 'guide3',
            title: '2nd Floor - Library & Computer Facilities',
            content: 'The 2nd Floor is the academic heart of Celtech College, featuring the School Library and Information Center on the left side - your gateway to knowledge with thousands of books, journals, and digital resources. The floor includes modern learning facilities: Room 208 houses the Speech Lab for communication skills development, Room 209 is the Computer Lab equipped with modern computers for IT courses, Room 210 is a general classroom, Room 211 is the Crime Lab for criminology students, and Room 212 is the Physics Lab for science experiments. Additional classrooms include Rooms 201 through 206, with Room 201 serving as the Moot Court for law and legal studies simulations. The floor is designed with wide corridors and clear directional arrows to help you navigate between the library, labs, and classrooms. Stairs are located at both ends of the floor for easy access to other levels.',
            date: '2026-01-23',
            category: 'Navigation',
            priority: 'high',
            icon: '📚'
        },
        {
            id: 'guide4',
            title: '2nd Floor - Room Directory',
            content: 'Second Floor Room Directory: School Library and Information Center - Main library with books, journals, computers, and study areas. Open Monday to Friday 7:00 AM to 7:00 PM, Saturday 8:00 AM to 4:00 PM. Room 201 - Moot Court for legal studies and mock trials. Room 202 - General classroom for various courses. Room 203 - General classroom for lectures and discussions. Room 204 - General classroom for academic instruction. Room 205 - General classroom for student learning. Room 206 - General classroom for course delivery. Room 208 - Speech Lab for communication and public speaking training. Room 209 - Computer Lab with modern computers and software for IT courses. Room 210 - General classroom for academic programs. Room 211 - Crime Lab for criminology students, forensic training and investigations. Room 212 - Physics Lab for physics experiments, demonstrations, and practicals. The 2nd Floor provides a comprehensive learning environment with specialized labs and ample classroom space.',
            date: '2026-01-23',
            category: 'Rooms',
            priority: 'medium',
            icon: '🔬'
        },
        {
            id: 'guide5',
            title: '3rd Floor - Skills Lab & Classrooms',
            content: 'The 3rd Floor features the Skills Lab on the left side, a specialized facility for hands-on technical training and practical skills development. The floor is organized with two rows of classrooms: the upper row includes Rooms 310, 311, 312, 313, 314, 315, and 316, while the lower row consists of Rooms 301, 302, 303, 304, 305, 306, and 307. All rooms are equipped with modern teaching facilities including projectors, whiteboards, and comfortable seating. The wide central corridor with directional arrows makes navigation easy between classrooms. Restrooms and stairs are conveniently located at both ends of the floor. The 3rd Floor provides a quiet and focused learning environment ideal for technical courses, engineering programs, and skills-based training. The Skills Lab is equipped with tools and equipment for various technical disciplines.',
            date: '2026-01-23',
            category: 'Navigation',
            priority: 'medium',
            icon: '🔧'
        },
        {
            id: 'guide6',
            title: '3rd Floor - Room Directory',
            content: 'Third Floor Room Directory: Skills Lab - Hands-on technical training facility with tools and equipment for practical skills development in various technical fields. Room 301 - General classroom for technical courses. Room 302 - General classroom for engineering programs. Room 303 - General classroom for skills training. Room 304 - General classroom for technical instruction. Room 305 - General classroom for vocational courses. Room 306 - General classroom for specialized training. Room 307 - General classroom for technical education. Room 310 - General classroom for academic programs. Room 311 - General classroom for course delivery. Room 312 - General classroom for student learning. Room 313 - General classroom for technical subjects. Room 314 - General classroom for engineering courses. Room 315 - General classroom for skills-based learning. Room 316 - General classroom for vocational training. The 3rd Floor is dedicated to technical and vocational education with comprehensive classroom facilities.',
            date: '2026-01-23',
            category: 'Rooms',
            priority: 'medium',
            icon: '🛠️'
        },
        {
            id: 'guide7',
            title: '4th Floor - Auditorium & Engineering Facilities',
            content: 'The 4th Floor is home to the impressive MOLA Auditorium on the left side, a large multipurpose hall used for assemblies, seminars, conferences, graduations, and special events. The auditorium features comfortable seating, modern audio-visual equipment, and air conditioning. Adjacent to the auditorium are specialized engineering facilities: Room 406 contains the Mock Bridge for maritime and engineering simulations, Room 404 is the Plotting Room for navigation and chart work, and Room 405 is a general classroom. The upper section includes Rooms 408, 409, 410, 411, and 412 (GMDSS - Global Maritime Distress and Safety System training room). The Engineering Simulator and Bridge Simulator rooms provide state-of-the-art training for maritime students. The floor is well-ventilated with wide corridors and clear signage. Stairs at both ends provide easy access to other floors.',
            date: '2026-01-23',
            category: 'Navigation',
            priority: 'high',
            icon: '🎭'
        },
        {
            id: 'guide8',
            title: '4th Floor - Room Directory',
            content: 'Fourth Floor Room Directory: MOLA Auditorium - Large multipurpose auditorium for assemblies, seminars, conferences, graduation ceremonies, and special events. Capacity for several hundred people with modern AV equipment. Room 404 - Plotting Room for maritime navigation, chart work, and route planning exercises. Room 405 - General classroom for maritime and engineering courses. Room 406 - Mock Bridge for ship bridge simulations and maritime training scenarios. Room 408 - General classroom for technical instruction. Room 409 - General classroom for engineering programs. Room 410 - General classroom for maritime courses. Room 411 - General classroom for specialized training. Room 412 - GMDSS Room (Global Maritime Distress and Safety System) for maritime communication training and emergency procedures. Engineering Simulator - Advanced engineering simulation facility for hands-on training. Bridge Simulator - Ship bridge simulator for realistic maritime navigation training. The 4th Floor is the center for maritime education and large-scale events.',
            date: '2026-01-23',
            category: 'Rooms',
            priority: 'high',
            icon: '⚓'
        },
        {
            id: 'guide9',
            title: 'Campus Navigation Tips',
            content: 'Navigating Celtech College is easy with these helpful tips: All floors have clear directional arrows painted on the corridors to guide you. Stairs are located at both ends of each floor for convenient access. The main entrance is on the 1st Floor - this is where you should enter and exit the building. Floor maps are posted at each floor landing showing room locations. Room numbers follow a logical pattern: first digit indicates floor (1st floor = 100s, 2nd floor = 200s, etc.). For administrative matters, visit the 1st Floor offices. For library and computer access, go to the 2nd Floor. For technical training and classrooms, visit the 3rd Floor. For auditorium events and maritime training, head to the 4th Floor. Emergency exits are clearly marked with green signs. In case of emergency, use the nearest stairwell - do not use elevators. Security personnel are available to assist with directions. The campus is accessible to persons with disabilities. Restrooms are available on every floor.',
            date: '2026-01-23',
            category: 'Navigation',
            priority: 'medium',
            icon: '🗺️'
        },
        {
            id: 'guide10',
            title: 'Finding Specific Services',
            content: 'Quick guide to finding essential services at Celtech College: For Enrollment and Registration - Visit the Registrar Office on the 1st Floor. For Tuition Payments - Go to the Finance Office on the 1st Floor. For Medical Assistance - The Clinic is located on the 1st Floor with a registered nurse on duty. For Counseling and Guidance - Visit the Guidance Office on the 1st Floor. For Library Services - The School Library and Information Center is on the 2nd Floor. For Computer Access - Computer Labs are on the 2nd Floor (Room 209). For Food and Drinks - The Canteen is centrally located on the 1st Floor. For Student Activities - Visit the OSSAA Office on the 1st Floor. For Research Support - The Academics Research Office is on the 1st Floor. For Technical Training - Skills Lab is on the 3rd Floor. For Maritime Training - Mock Bridge and simulators are on the 4th Floor. For Events and Assemblies - MOLA Auditorium is on the 4th Floor. All offices are open Monday to Friday 8:00 AM to 5:00 PM, and Saturday 8:00 AM to 12:00 PM.',
            date: '2026-01-23',
            category: 'Services',
            priority: 'high',
            icon: '📍'
        }
    ]
};

// ── Admin integration shim ─────────────────────────────────
// Reads admin-edited data from localStorage if available,
// otherwise falls back to the default schoolData above.
(function () {
    const saved = localStorage.getItem('vira_data');
    window.viRAData = saved ? JSON.parse(saved) : schoolData;
})();
