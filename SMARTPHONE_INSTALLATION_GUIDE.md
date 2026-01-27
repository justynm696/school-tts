# 📱 Smartphone Installation Guide - V.I.R.A. CeltechVoice

## Overview
V.I.R.A. (Virtual Interactive Resource Assistant) CeltechVoice is a **Progressive Web App (PWA)** that can be installed on your smartphone like a native app - no app store needed!

---

## 🌍 Supported Languages

The application supports **18+ languages** for text-to-speech:

| Language | Code | Available Voices |
|----------|------|------------------|
| 🇺🇸 English (US) | en-US | Microsoft David, Mark, Zira, Google US |
| 🇬🇧 English (UK) | en-GB | Male & Female |
| 🇵🇭 **Filipino/Tagalog** | fil-PH | **Coming Soon** |
| 🇩🇪 German | de-DE | Google Deutsch |
| 🇪🇸 Spanish | es-ES | Google Español |
| 🇫🇷 French | fr-FR | Google Français |
| 🇮🇳 Hindi | hi-IN | Google हिन्दी |
| 🇮🇩 Bahasa Indonesia | id-ID | Google Bahasa Indonesia |
| 🇮🇹 Italian | it-IT | Google Italiano |
| 🇯🇵 Japanese | ja-JP | Google 日本語 |
| 🇰🇷 Korean | ko-KR | Google 한국어 |
| 🇳🇱 Dutch | nl-NL | Google Nederlands |
| 🇵🇱 Polish | pl-PL | Google Polski |
| 🇧🇷 Portuguese | pt-BR | Google Português |
| 🇷🇺 Russian | ru-RU | Google Русский |
| 🇨🇳 Chinese (Simplified) | zh-CN | Google 中文 |
| 🇭🇰 Chinese (Cantonese) | zh-HK | Google 粵語 |
| 🇹🇼 Chinese (Traditional) | zh-TW | Google 國語 |

---

## 📲 Installation Instructions

### For Android Devices (Chrome/Edge)

#### Method 1: Install from Browser
1. **Open Chrome or Edge** on your Android phone
2. **Navigate to**: Your deployed URL (e.g., `https://your-celtech-app.netlify.app`)
3. **Tap the menu** (⋮) in the top-right corner
4. **Select "Install app"** or "Add to Home screen"
5. **Tap "Install"** in the popup
6. The app icon will appear on your home screen!

#### Method 2: Banner Prompt
1. Visit the website in Chrome/Edge
2. Wait for the **"Add to Home screen"** banner to appear at the bottom
3. Tap **"Add"**
4. The app installs automatically!

#### Features on Android:
- ✅ Full-screen app experience
- ✅ App icon on home screen
- ✅ Works offline (after first visit)
- ✅ Push notifications (if enabled)
- ✅ Access to device features (microphone for voice search)

---

### For iOS Devices (iPhone/iPad - Safari)

#### Installation Steps:
1. **Open Safari** on your iPhone/iPad
2. **Navigate to**: Your deployed URL
3. **Tap the Share button** (□↑) at the bottom of the screen
4. **Scroll down** and tap **"Add to Home Screen"**
5. **Edit the name** if desired (default: "V.I.R.A. CeltechVoice")
6. **Tap "Add"** in the top-right corner
7. The app icon appears on your home screen!

#### Features on iOS:
- ✅ Full-screen app experience
- ✅ App icon on home screen
- ✅ Standalone mode (no browser UI)
- ⚠️ Limited offline support (Safari restrictions)
- ✅ Voice search with microphone permission

---

## 🚀 Deployment Options

To make your app accessible on smartphones, you need to deploy it online. Here are the best options:

### Option 1: Netlify (Recommended - FREE)
**Why Netlify?**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Easy deployment
- ✅ Custom domain support
- ✅ Continuous deployment from Git

**Quick Deploy:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to your project
cd c:\ai\school-tts

# Deploy
netlify deploy --prod
```

**Or use Drag & Drop:**
1. Go to https://app.netlify.com/drop
2. Drag your `school-tts` folder
3. Get instant URL!

---

### Option 2: Vercel (FREE)
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to your project
cd c:\ai\school-tts

# Deploy
vercel --prod
```

---

### Option 3: GitHub Pages (FREE)
1. Create a GitHub repository
2. Upload your files
3. Enable GitHub Pages in Settings
4. Access at: `https://yourusername.github.io/repo-name`

---

### Option 4: Firebase Hosting (FREE)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

---

## 🔧 Required Files for PWA

Your app already has these files:

### ✅ manifest.json
```json
{
  "name": "V.I.R.A. - CeltechVoice",
  "short_name": "CeltechVoice",
  "description": "Virtual Interactive Resource Assistant for Celtech College",
  "start_url": "/index.html",
  "display": "standalone",
  "theme_color": "#1e5a8e",
  "background_color": "#0f1419",
  "icons": [...]
}
```

### ✅ Service Worker (Optional - for offline support)
Located in `sw.js` - caches files for offline access

### ✅ Icons
- `celtech_logo.png` - App icon (192x192 and 512x512)

---

## 📱 Testing on Smartphone

### Before Deployment:
1. **Use ngrok** for temporary public URL:
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Start local server (if needed)
   # Then expose it
   ngrok http 8080
   ```

2. **Use your phone's browser** to visit the ngrok URL
3. **Test installation** following the steps above

### After Deployment:
1. Visit your deployed URL on your smartphone
2. Install the app
3. Test all features:
   - ✅ Voice search
   - ✅ Text-to-speech
   - ✅ Language selection
   - ✅ Dark/light mode
   - ✅ Offline access (if service worker enabled)

---

## 🎯 Features Available on Smartphone

### ✅ Core Features:
- **Text-to-Speech**: Listen to all content in 18+ languages
- **Voice Search**: Search using your voice (microphone required)
- **Offline Mode**: Access cached content without internet
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Optimized for all screen sizes

### ✅ Smartphone-Specific:
- **Home Screen Icon**: Quick access like a native app
- **Full-Screen Mode**: Immersive experience
- **Touch Gestures**: Swipe, tap, pinch-to-zoom
- **Microphone Access**: Voice search and commands
- **Share Integration**: Share content from the app

---

## 🌐 Recommended Deployment URL Structure

```
https://celtech-voice.netlify.app/
├── index.html (Main app)
├── navigation.html (Interactive maps)
├── data.js (Content)
├── app.js (Logic)
├── styles.css (Styling)
├── manifest.json (PWA config)
├── sw.js (Service worker)
└── celtech_logo.png (Icon)
```

---

## 📞 Support & Contact

**For technical support:**
- Email: info@clcst.com.ph
- Phone: +63 917 114 0297

**For app issues:**
- Check browser compatibility (Chrome/Edge recommended)
- Ensure microphone permissions are granted
- Clear browser cache if issues persist

---

## 🔐 Privacy & Permissions

The app may request:
- **Microphone**: For voice search (optional)
- **Storage**: To cache content for offline use
- **Notifications**: For important updates (optional)

All data is processed locally on your device. No personal information is sent to external servers.

---

## 📊 Browser Compatibility

| Browser | Android | iOS | Features |
|---------|---------|-----|----------|
| Chrome | ✅ Full | ❌ N/A | All features |
| Edge | ✅ Full | ❌ N/A | All features |
| Safari | ❌ N/A | ✅ Partial | Limited offline |
| Firefox | ⚠️ Partial | ⚠️ Partial | No install prompt |
| Samsung Internet | ✅ Full | ❌ N/A | All features |

**Recommended:** Chrome (Android) or Safari (iOS)

---

## 🎓 Quick Start After Installation

1. **Open the app** from your home screen
2. **Grant microphone permission** (for voice search)
3. **Select your preferred language** from the voice dropdown
4. **Browse content** using the tabs:
   - 📰 News
   - 📅 Events
   - 🏛️ History
   - 🏢 Facilities
   - 🗺️ Campus Guide
   - 🧭 Interactive Maps
5. **Tap any card** to hear it read aloud
6. **Use voice search** by tapping the microphone icon

---

## 🚀 Next Steps

1. **Deploy your app** using one of the methods above
2. **Share the URL** with students and faculty
3. **Test on multiple devices** to ensure compatibility
4. **Collect feedback** and improve the app
5. **Add more languages** as needed (Filipino/Tagalog coming soon!)

---

**Enjoy your smartphone-ready V.I.R.A. CeltechVoice app! 📱🎓**
