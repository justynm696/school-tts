# 🎙️ V.I.R.A. - Virtual Interactive Resource Assistant
## CeltechVoice - Celtech College Olongapo

A modern, AI-powered voice assistant and text-to-speech application for Celtech College Olongapo. V.I.R.A. (Virtual Interactive Resource Assistant) helps you listen to announcements, events, schedules, campus history, facilities information, and navigate the campus with an intuitive voice interface.

![CeltechVoice](celtech_logo.png)

## ✨ Features

### 🎤 Voice Assistant (V.I.R.A.)
- **Voice Search**: Search content using your voice
- **Text-to-Speech**: Listen to any content with natural voices
- **Multiple Voices**: Choose from various voice options
- **Speed Control**: Adjust playback speed from 0.5x to 2x
- **Progress Tracking**: Visual progress bar during playback
- **Play/Pause/Stop**: Full playback controls

### 🔍 Smart Search
- **Universal Search**: Search across all categories simultaneously
- **Special Pages**: Find navigation pages and special features
- **Voice-Activated**: Use voice commands to search
- **Real-time Results**: Instant search results as you type

### 📚 Content Categories
- **📰 News**: School news, achievements, and updates
- **📅 Events**: Upcoming school events and activities
- **🏛️ History**: School history and milestones
- **🏢 Facilities**: Information about school facilities
- **🗺️ Campus Guide**: Comprehensive campus information
- **🧭 Interactive Maps**: Floor-by-floor navigation with room finder

### 🎯 Priority System
- **High Priority**: Critical announcements marked in red
- **Medium Priority**: Important notices marked in yellow
- **Low Priority**: General information marked in green

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No installation required - runs directly in the browser!

### Running the Application

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server for the best experience

2. **Using a local server** (recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then open `http://localhost:8000` in your browser.

## 📱 How to Use

### Basic Usage
1. **Browse Content**: Click on category tabs (News, Events, History, Facilities, Campus Guide)
2. **Search**: Use the search bar to find specific content
3. **Voice Search**: Click the microphone icon to search by voice
4. **Select Item**: Click on any card to view details
5. **Listen**: Click the "Listen" button or the card itself to open the TTS panel
6. **Control Playback**: Use play/pause and stop buttons
7. **Customize**: Adjust speed and select different voices

### Voice Assistant (V.I.R.A.)
- Click the **V.I.R.A.** floating button (bottom-right) to access the voice assistant
- Use voice search to find announcements, events, and information
- V.I.R.A. can read any content aloud with customizable voices and speeds

### Interactive Campus Maps
- Click on **Interactive Maps** tab to access floor-by-floor navigation
- Use the **Room Finder** to search for specific rooms, offices, or facilities
- View detailed floor maps for all 4 floors
- Click on floor maps to zoom in for better detail

### Keyboard Shortcuts
- **Space**: Play/Pause speech
- **Escape**: Close TTS panel

### Theme Toggle
- Click the sun/moon icon in the header to switch between light and dark modes
- Your preference is saved automatically

## 🎨 Customization

### Adding New Content
Edit `data.js` to add new announcements, events, schedules, or news:

```javascript
announcements: [
    {
        id: 'unique-id',
        title: 'Your Title',
        content: 'Your content here...',
        date: '2026-01-20',
        category: 'Category Name',
        priority: 'high', // or 'medium', 'low'
        icon: '📢' // Any emoji
    }
]
```

### Changing Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --color-primary: hsl(260, 85%, 60%);
    --color-secondary: hsl(200, 90%, 55%);
    --color-accent: hsl(330, 85%, 60%);
}
```

## 🌐 Browser Compatibility

The application works best on:
- ✅ Chrome/Edge (Recommended)
- ✅ Safari
- ✅ Firefox
- ✅ Opera

**Note**: Text-to-speech quality and available voices vary by browser and operating system.

## 📱 Mobile Installation

### Add to Home Screen (PWA-Ready)

**iOS (Safari)**:
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android (Chrome)**:
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"

## 🎯 Features Breakdown

### Content Cards
- **Icon**: Visual identifier for each item
- **Title**: Clear, descriptive heading
- **Date**: When the item was posted
- **Category**: Content classification
- **Priority Badge**: Visual priority indicator
- **Content**: Full text that will be read aloud

### TTS Control Panel
- **Title Display**: Shows current item being read
- **Text Display**: Scrollable content view
- **Progress Bar**: Visual playback progress
- **Play/Pause Button**: Toggle playback
- **Stop Button**: Stop and reset playback
- **Speed Slider**: Adjust reading speed (0.5x - 2.0x)
- **Voice Selector**: Choose from available voices

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality
- **Web Speech API**: Text-to-speech synthesis
- **Local Storage**: Theme preference persistence

### File Structure
```
school-tts/
├── index.html          # Main HTML structure
├── navigation.html     # Interactive campus maps page
├── styles.css          # Complete styling and design system
├── app.js             # Application logic and TTS functionality
├── navigation.js      # Interactive maps functionality
├── data.js            # School information data
├── manifest.json      # PWA manifest
├── netlify.toml       # Deployment configuration
├── deploy.ps1         # Quick deployment script
└── README.md          # This file
```

## 🎨 Design Philosophy

- **Mobile-First**: Designed primarily for mobile devices
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized animations and smooth interactions
- **User Experience**: Intuitive navigation and clear visual hierarchy
- **Modern Aesthetics**: Premium design with vibrant colors and smooth gradients
- **Voice-First**: Optimized for voice interaction and accessibility

## 🚀 Future Enhancements

Potential features for future versions:
- [ ] Offline support with Service Worker
- [ ] Bookmark favorite items
- [x] ~~Search functionality~~ ✅ Completed
- [x] ~~Voice search~~ ✅ Completed
- [x] ~~Interactive campus maps~~ ✅ Completed
- [ ] Push notifications for new announcements
- [ ] Multi-language support
- [ ] Audio recording of announcements
- [ ] Integration with school management systems
- [ ] User authentication for personalized content

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to customize this application for your school's needs. You can:
- Add more categories
- Customize the design and colors
- Add new features
- Integrate with backend systems

## 📞 Support

For questions or issues:
- Check browser console for errors
- Ensure your browser supports Web Speech API
- Try using a different browser
- Clear browser cache and reload

---

**Made with ❤️ for better school communication**

**Powered by V.I.R.A. - Your Virtual Interactive Resource Assistant** 🎓🔊🤖
