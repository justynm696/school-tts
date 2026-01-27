# Quick Deploy Script for V.I.R.A. CeltechVoice
# This script helps you deploy your app to Netlify

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  V.I.R.A. CeltechVoice Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Netlify CLI is installed
Write-Host "Checking for Netlify CLI..." -ForegroundColor Yellow
$netlifyInstalled = Get-Command netlify -ErrorAction SilentlyContinue

if (-not $netlifyInstalled) {
    Write-Host "Netlify CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g netlify-cli
    Write-Host "Netlify CLI installed successfully!" -ForegroundColor Green
}
else {
    Write-Host "Netlify CLI is already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Options" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Deploy to Netlify (Production)" -ForegroundColor White
Write-Host "2. Deploy to Netlify (Draft/Preview)" -ForegroundColor White
Write-Host "3. Open Netlify Dashboard" -ForegroundColor White
Write-Host "4. Test locally before deploying" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Deploying to Netlify (Production)..." -ForegroundColor Yellow
        Write-Host ""
        netlify deploy --prod --dir=.
        Write-Host ""
        Write-Host "Deployment complete!" -ForegroundColor Green
        Write-Host "Your app is now live and can be installed on smartphones!" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "Deploying to Netlify (Draft)..." -ForegroundColor Yellow
        Write-Host ""
        netlify deploy --dir=.
        Write-Host ""
        Write-Host "Draft deployment complete!" -ForegroundColor Green
        Write-Host "Test the preview URL before deploying to production." -ForegroundColor Yellow
    }
    "3" {
        Write-Host ""
        Write-Host "Opening Netlify Dashboard..." -ForegroundColor Yellow
        netlify open
    }
    "4" {
        Write-Host ""
        Write-Host "Starting local server..." -ForegroundColor Yellow
        Write-Host "Open your browser to: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        python -m http.server 8080
    }
    "5" {
        Write-Host ""
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host ""
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy the deployment URL" -ForegroundColor White
Write-Host "2. Open it on your smartphone browser" -ForegroundColor White
Write-Host "3. Install the app:" -ForegroundColor White
Write-Host "   - Android: Menu > Install app" -ForegroundColor Gray
Write-Host "   - iOS: Share > Add to Home Screen" -ForegroundColor Gray
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "SMARTPHONE_INSTALLATION_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
