# Portfolio Setup Script
# Run this script to set up your portfolio website

Write-Host "🚀 Setting up Vishwajeet's Portfolio Website..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check for .env.local file
Write-Host ""
if (Test-Path ".env.local") {
    Write-Host "✓ .env.local file found" -ForegroundColor Green
} else {
    Write-Host "⚠ .env.local file not found" -ForegroundColor Yellow
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✓ .env.local created. Please update it with your Firebase credentials" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Update .env.local with your Firebase credentials" -ForegroundColor White
Write-Host "2. Set up Firebase (see README.md for instructions)" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host ""
Write-Host "For detailed setup instructions, see README.md" -ForegroundColor Cyan
Write-Host ""
