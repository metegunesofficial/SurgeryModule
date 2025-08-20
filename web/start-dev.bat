@echo off
REM SurgeryModule Development Server Startup Script
REM This script ensures localhost runs reliably every time

echo 🚀 SurgeryModule Development Server Startup
echo ==============================================

REM Check if .env file exists
if not exist ".env" (
    echo ❌ .env file not found
    echo 💡 Running environment setup...
    powershell -ExecutionPolicy Bypass -File "%~dp0setup-env.ps1"
    echo.
    echo ⚠️  Please edit the .env file with your actual values, then run this script again
    echo    Required: DATABASE_URL and AUTH_SECRET
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm ci
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Setup database
echo 🗄️  Setting up database...
npm run db:setup
if errorlevel 1 (
    echo ❌ Database setup failed
    echo 💡 Check your DATABASE_URL and try again
    pause
    exit /b 1
)

REM Start development server
echo 🌟 Starting development server...
echo 📍 Server will be available at: http://localhost:4000
echo 🔄 Logs will be saved to: dev-out.log and dev-err.log
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the dev server
npm run dev
