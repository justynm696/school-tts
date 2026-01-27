# CeltechVoice Deployment Guide

This guide will help you deploy the CeltechVoice application so it can be accessed via a web link on both desktop and mobile devices.

## 🚀 Quick Deployment Options

### Option 1: GitHub Pages (FREE - Recommended for Students)
**Best for:** Simple, free hosting with custom domain support

#### Steps:
1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com and sign up

2. **Create a New Repository**
   - Click "New Repository"
   - Name it: `celtech-voice` or `school-tts`
   - Make it Public
   - Don't initialize with README

3. **Upload Your Files**
   ```bash
   # Open PowerShell in your project folder (c:\ai\school-tts)
   cd c:\ai\school-tts
   
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit - CeltechVoice TTS App"
   
   # Connect to GitHub (replace YOUR-USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR-USERNAME/celtech-voice.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at: `https://YOUR-USERNAME.github.io/celtech-voice/`

5. **Access on Mobile**
   - Simply open the URL on any mobile browser
   - Works on iOS Safari, Android Chrome, etc.

---

### Option 2: Netlify (FREE - Easiest Drag & Drop)
**Best for:** Instant deployment without Git knowledge

#### Steps:
1. **Go to Netlify**
   - Visit https://www.netlify.com
   - Sign up for free (use GitHub, Google, or email)

2. **Deploy via Drag & Drop**
   - Click "Add new site" → "Deploy manually"
   - Drag your entire `school-tts` folder into the upload area
   - Wait 30 seconds for deployment

3. **Get Your Link**
   - Netlify will give you a URL like: `https://random-name-12345.netlify.app`
   - You can customize the URL in Site Settings → Domain Management

4. **Mobile Access**
   - Share the link - it works on all devices automatically!

---

### Option 3: Vercel (FREE - Professional Hosting)
**Best for:** Fast deployment with automatic HTTPS

#### Steps:
1. **Install Vercel CLI** (optional, or use web interface)
   ```powershell
   npm install -g vercel
   ```

2. **Deploy from Command Line**
   ```powershell
   cd c:\ai\school-tts
   vercel
   ```
   - Follow the prompts
   - Your app will be live in seconds!

3. **Or Use Web Interface**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

---

### Option 4: Firebase Hosting (FREE - Google's Platform)
**Best for:** Integration with other Google services

#### Steps:
1. **Install Firebase CLI**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```powershell
   cd c:\ai\school-tts
   firebase login
   firebase init hosting
   ```

3. **Configure**
   - Select "Use an existing project" or create new
   - Set public directory to: `.` (current directory)
   - Configure as single-page app: No
   - Don't overwrite index.html

4. **Deploy**
   ```powershell
   firebase deploy
   ```

5. **Access Your App**
   - URL will be: `https://your-project-id.web.app`

---

## 📱 Mobile Optimization Checklist

Your app is already mobile-friendly, but here are some enhancements:

### Add to Home Screen Support
I've created a `manifest.json` file for you (see below) that allows users to:
- Add the app to their phone's home screen
- Use it like a native app
- Get a custom icon and splash screen

### Responsive Design
✅ Already implemented with CSS media queries
✅ Touch-friendly buttons and controls
✅ Voice search works on mobile browsers

---

## 🔒 Important Notes

### Voice Features on Mobile:
- **Text-to-Speech**: Works on all mobile browsers
- **Voice Search**: 
  - ✅ Works on Chrome for Android
  - ✅ Works on Safari for iOS (iOS 14.5+)
  - ⚠️ May require HTTPS (all deployment options above provide this)

### HTTPS Requirement:
- Voice search requires HTTPS for security
- All recommended hosting options provide free HTTPS automatically

---

## 🌐 Custom Domain (Optional)

If you want a custom domain like `voice.celtech.edu.ph`:

1. **Purchase a domain** (or use school's existing domain)
2. **Configure DNS** in your hosting provider:
   - GitHub Pages: Add CNAME record
   - Netlify/Vercel: Follow their custom domain setup
   - Firebase: Add domain in Firebase Console

---

## 📊 Recommended Choice

**For Celtech College, I recommend:**

1. **Quick Testing**: Use Netlify (drag & drop in 1 minute)
2. **Long-term**: Use GitHub Pages (free, reliable, educational)
3. **Professional**: Use Vercel (fastest, best performance)

---

## 🆘 Need Help?

If you encounter issues:
1. Check that all files are uploaded
2. Ensure `index.html` is in the root directory
3. Verify HTTPS is enabled
4. Test on different browsers

---

## 📱 Sharing the Link

Once deployed, you can:
- Share the URL via QR code
- Add to school website
- Share on social media
- Email to students and faculty
- Print on posters with QR code

**Example QR Code Generation:**
- Use https://qr-code-generator.com
- Enter your deployed URL
- Download and print the QR code
