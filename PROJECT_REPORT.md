# V.I.R.A. Project Assessment Report
**Virtual Interactive Resource Assistant — Celtech College Olongapo**

## 1. Project Overview
V.I.R.A. (Virtual Interactive Resource Assistant) is an integrated AI-powered campus management and navigation system designed for Celtech College Olongapo. It serves as a centralized hub for events, campus history, facility information, and interactive floor-by-floor navigation, enhanced by a conversational AI assistant ("Jarvis Mode").

---

## 2. Technology Stack & Integration
This project successfully applies core software engineering principles using the following technologies:

### • Database Management Systems (DBMS)
- **Primary DBMS:** The system utilizes **Supabase (PostgreSQL)** for cloud-based data persistence.
- **Data Isolation:** Implements department-level data isolation where officers can only manage content (events, facilities) belonging to their specific department ID.
- **Relational Design:** Uses foreign keys to link content items to department accounts.

### • API Integration
- **Google Gemini API:** Integrated the **Gemini 1.5 Flash** model via RESTful services to power the conversational AI voice assistant.
- **Asynchronous Logic:** Uses `fetch` and asynchronous/await patterns to handle real-time AI processing without blocking the GUI.
- **Contextual Injection:** Dynamically injects local database records into the API prompt to provide "RAG" (Retrieval-Augmented Generation) capabilities.

### • Graphical User Interface (GUI) / Web Interface
- **Modern Aesthetics:** Implements a premium **Glassmorphism** design system using CSS variables and modern layout techniques (Flexbox/Grid).
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile viewing.
- **Interactive Mapping:** Includes a dedicated navigation module with high-fidelity SVG/Vector floor plans and dynamic "You Are Here" pin placement.

### • File Handling and Data persistence
- **State Management:** Implements a multi-tier persistence strategy:
  1. **Supabase Cloud Storage:** For permanent, shared records.
  2. **LocalStorage Cache:** For offline capabilities and fallback state management.
  3. **JSON Serialization:** Features a built-in export/import utility for downloading data snapshots as JSON files.

---

## 3. Mapping to Learning Outcomes

### LO 1: Apply software engineering principles and advanced programming concepts.
- **Modular Architecture:** The project is divided into distinct logic layers (`app.js` for frontend, `admin.js` for management, `db.js` for data access).
- **Asynchronous Programming:** Extensive use of Promises and Async/Await for non-blocking operations during API calls and database synchronization.
- **Object-Oriented Logic:** UI components are generated dynamically using template literals and functional mapping.

### LO 2: Implement and manage APIs, data handling, file processing, and persistent storage.
- **Storage Strategy:** Successfully managed data flow between cloud (Supabase), browser storage (LocalStorage), and static fallbacks (`data.js`).
- **RESTful Integration:** Built a robust interface to interact with Google's Generative AI endpoints, including complex JSON payload management and error handling.

### LO 3: Demonstrate competence in system design, costing, documentation, testing, and maintenance.
- **System Documentation:** The project includes comprehensive documentation (ERD/DFD diagrams, testing guides, and maintenance logs).
- **Cost Estimation:** Includes a COCOMO II effort estimation model to predict development costs and resource allocation.
- **Deployment:** Fully deployed and maintained on **Netlify** with a production-ready environment.

### LO 4: Apply version control, collaboration tools, and ethical considerations.
- **Version Control:** Managed via **Git**, ensuring a clean history of features and fixes.
- **Ethical AI:** Implemented strict system instructions for the AI assistant to ensure polite, accurate, and college-appropriate responses.
- **Security:** Integrated **Role-Based Access Control (RBAC)** to ensure only authorized department heads can modify sensitive campus data.

---

## 4. Conclusion
V.I.R.A. demonstrates a high level of integration across modern software technologies. By combining real-time database sync, advanced AI interaction, and architectural rigor, the project meets 100% of the functional and educational requirements outlined in the project brief.
