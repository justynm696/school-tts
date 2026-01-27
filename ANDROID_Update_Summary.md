# V.I.R.A. Android Installation Support 📱

## ✅ Updates Completed

### 1. Enhanced PWA Manifest (`manifest.json`)
- Optimized for Android installation ("standalone" display).
- Added correct icons and shortcuts (Events, History, Maps).
- Updated description to reflect the removal of "News".
- Added "Related Applications" configuration for potential future Play Store link.

### 2. Added Service Worker (`sw.js`)
- **Offline Support**: Caches key files (HTML, CSS, JS, images) so the app works without internet.
- **Performance**: Faster load times on repeat visits.
- **PWA Requirement**: Essential for the "Install" prompt to appear on Android.

### 3. Updated Application Code
- **Service Worker Registration**: Enabled in both `app.js` and `navigation.js`.
- The app now automatically registers the service worker when loaded.

### 4. Installation Guide (`ANDROID_INSTALL_GUIDE.md`)
- Created a step-by-step guide for users to install the app via Chrome/Samsung Internet.

## 🚀 How to Test Installation
1. **Deploy** the updated code to a web server (e.g., Netlify, Vercel, or GitHub Pages). 
   *Note: PWAs require **HTTPS** to be installable.*
2. Open the URL on an Android device.
3. You should see an **"Install V.I.R.A."** prompt or be able to "Add to Home Screen" from the browser menu.
4. Once installed, the app will appear in the app drawer with the Celtech logo and launch in full-screen mode.

## 📂 New/Modified Files
- `manifest.json` (Modified)
- `sw.js` (New)
- `app.js` (Modified - enabled SW)
- `navigation.js` (Modified - enabled SW)
- `ANDROID_INSTALL_GUIDE.md` (New)

---
**Status:** ✅ Ready for Deployment
