# V.I.R.A. System - DFD Diagram (Mermaid Format)
## Data Flow Diagram

This file contains the DFD in Mermaid diagram format.
You can visualize it at: https://mermaid.live/

## Context Diagram (Level 0)

```mermaid
graph TB
    User[👤 USER<br/>Student/Faculty/Visitor]
    System[V.I.R.A. SYSTEM<br/>Text-to-Speech Application]
    WebSpeech[🔊 Web Speech API]
    Browser[💾 Browser Storage]
    
    User -->|Voice Commands<br/>Search Queries<br/>UI Interactions| System
    System -->|Audio Output<br/>Visual Content<br/>Search Results| User
    System <-->|TTS/Recognition| WebSpeech
    System <-->|Read/Write Data| Browser
    
    style System fill:#1e5a8e,stroke:#f39c12,stroke-width:3px,color:#fff
    style User fill:#27ae60,stroke:#333,stroke-width:2px,color:#fff
    style WebSpeech fill:#e74c3c,stroke:#333,stroke-width:2px,color:#fff
    style Browser fill:#9b59b6,stroke:#333,stroke-width:2px,color:#fff
```

## Level 1 DFD - Main Processes

```mermaid
graph TB
    User[👤 USER]
    
    P1((1.0<br/>SEARCH<br/>ENGINE))
    P2((2.0<br/>CONTENT<br/>DISPLAY))
    P3((3.0<br/>VOICE<br/>ASSISTANT))
    P4((4.0<br/>TTS<br/>ENGINE))
    P5((5.0<br/>INTERACTIVE<br/>MAPS))
    
    D1[(D1: School Data<br/>events, history,<br/>facilities, guides)]
    D2[(D2: User Preferences<br/>theme, voice,<br/>settings)]
    D3[(D3: Navigation Data<br/>floors, locations,<br/>coordinates)]
    
    WebSpeech[Web Speech API]
    
    User -->|Search Query| P1
    User -->|Category Selection| P2
    User -->|Voice Input| P3
    User -->|Floor Selection| P5
    
    P1 -->|Filtered Results| User
    P2 -->|Content Cards| User
    P3 -->|Recognized Commands| User
    P5 -->|Floor Plan Display| User
    
    P1 -->|Selected Content| P4
    P2 -->|Selected Content| P4
    P3 -->|Selected Content| P4
    
    P4 -->|Audio Output| WebSpeech
    WebSpeech -->|Audio Stream| User
    
    D1 -.->|Read Data| P1
    D1 -.->|Read Data| P2
    D1 -.->|Read Data| P3
    
    D2 -.->|Read Settings| P4
    D2 <-.->|Read/Write| P2
    
    D3 -.->|Read Locations| P5
    D3 -.->|Read Data| P1
    
    style P1 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P2 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P3 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P4 fill:#e74c3c,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P5 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style D1 fill:#f39c12,stroke:#2c3e50,stroke-width:2px,color:#fff
    style D2 fill:#9b59b6,stroke:#2c3e50,stroke-width:2px,color:#fff
    style D3 fill:#1abc9c,stroke:#2c3e50,stroke-width:2px,color:#fff
```

## Level 2 DFD - Search Engine Process (1.0)

```mermaid
graph TB
    User[👤 USER]
    
    P11[1.1<br/>Input<br/>Validation]
    P12[1.2<br/>Search<br/>Algorithm]
    P13[1.3<br/>Result<br/>Formatting]
    P14[1.4<br/>Display<br/>Results]
    
    D1[(School Data)]
    
    User -->|Raw Input| P11
    P11 -->|Validated Query| P12
    P12 <-.->|Query Data| D1
    P12 -->|Matched Items| P13
    P13 -->|Formatted Results| P14
    P14 -->|Visual Output| User
    
    style P11 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P12 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P13 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P14 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style D1 fill:#f39c12,stroke:#2c3e50,stroke-width:2px,color:#fff
```

## Level 2 DFD - TTS Engine Process (4.0)

```mermaid
graph TB
    User[👤 USER]
    
    P41[4.1<br/>Content<br/>Extraction]
    P42[4.2<br/>Settings<br/>Retrieval]
    P43[4.3<br/>Utterance<br/>Creation]
    P44[4.4<br/>Speech<br/>Synthesis]
    P45[4.5<br/>Playback<br/>Controls]
    
    D2[(User Preferences)]
    WebSpeech[Web Speech API]
    
    User -->|Content Selection| P41
    P41 -->|Text Content| P43
    P42 <-.->|Read Settings| D2
    P42 -->|Settings Data| P43
    P43 -->|Utterance Object| P44
    P44 <-->|Synthesize| WebSpeech
    WebSpeech -->|Audio Stream| User
    P45 -->|Control Commands| P44
    User -->|Play/Pause/Stop| P45
    
    style P41 fill:#e74c3c,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P42 fill:#e74c3c,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P43 fill:#e74c3c,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P44 fill:#e74c3c,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P45 fill:#e74c3c,stroke:#2c3e50,stroke-width:2px,color:#fff
    style D2 fill:#9b59b6,stroke:#2c3e50,stroke-width:2px,color:#fff
```

## Level 2 DFD - Voice Assistant Process (3.0)

```mermaid
graph TB
    User[👤 USER]
    
    P31[3.1<br/>Microphone<br/>Access]
    P32[3.2<br/>Command<br/>Processing]
    P33[3.3<br/>Action<br/>Execution]
    P34[3.4<br/>Feedback<br/>Display]
    
    SpeechRec[Speech Recognition API]
    
    User -->|Voice Input| P31
    P31 -->|Audio Stream| SpeechRec
    SpeechRec -->|Recognized Text| P32
    P32 -->|Processed Command| P33
    P33 -->|Action Result| P34
    P34 -->|Visual/Audio Feedback| User
    
    style P31 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P32 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P33 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
    style P34 fill:#3498db,stroke:#2c3e50,stroke-width:2px,color:#fff
```

## Data Flow Examples

### Example 1: Search Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P1 as Search Engine
    participant D1 as School Data
    participant UI as Display
    
    U->>P1: Enter "library"
    P1->>P1: Validate input
    P1->>D1: Query data
    D1-->>P1: Return matches
    P1->>P1: Rank results
    P1->>P1: Format cards
    P1->>UI: Render results
    UI-->>U: Show 3 results
```

### Example 2: TTS Playback Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P4 as TTS Engine
    participant D2 as User Prefs
    participant API as Web Speech API
    
    U->>P4: Click event card
    P4->>P4: Extract content
    P4->>D2: Get settings
    D2-->>P4: Voice, rate
    P4->>P4: Create utterance
    P4->>API: Synthesize speech
    API-->>U: Play audio
    P4->>U: Update progress
```

### Example 3: Voice Command Flow

```mermaid
sequenceDiagram
    participant U as User
    participant P3 as Voice Assistant
    participant API as Speech Recognition
    participant P5 as Interactive Maps
    
    U->>P3: Click mic button
    P3->>API: Start listening
    U->>API: "Show me canteen"
    API-->>P3: Recognized text
    P3->>P3: Parse command
    P3->>P5: Navigate to canteen
    P5-->>U: Display location
```

## Process Summary Table

| Process ID | Name | Inputs | Outputs | Data Stores |
|------------|------|--------|---------|-------------|
| 1.0 | Search Engine | Search query | Filtered results | D1, D3 |
| 2.0 | Content Display | Category selection | Content cards | D1, D2 |
| 3.0 | Voice Assistant | Voice input | Recognized commands | - |
| 4.0 | TTS Engine | Text content | Audio output | D2 |
| 5.0 | Interactive Maps | Floor selection | Floor plan display | D3 |

## Data Store Details

| Store ID | Name | Contents | Access Type |
|----------|------|----------|-------------|
| D1 | School Data | events, history, facilities, campus_guide | Read-only |
| D2 | User Preferences | theme, voiceId, speechRate, lastCategory | Read/Write |
| D3 | Navigation Data | floors, locations, coordinates | Read-only |

---

**How to Visualize:**
1. Copy any Mermaid code block above
2. Go to https://mermaid.live/
3. Paste the code
4. View the interactive diagram
5. Export as PNG/SVG

**Alternative Tools:**
- VS Code with Mermaid extension
- GitHub (supports Mermaid in markdown)
- Draw.io (import Mermaid)
- Confluence (Mermaid plugin)

---

**Document Version:** 1.0  
**Last Updated:** February 15, 2026  
**Author:** V.I.R.A. Development Team
