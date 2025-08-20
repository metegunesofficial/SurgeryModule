# SurgeryModule Development Server Startup Script
# This script ensures localhost runs reliably every time

param(
    [switch]$SkipSetup,
    [switch]$Force
)

Write-Host "🚀 SurgeryModule Development Server Startup" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($process) {
            $owningProcess = Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue
            if ($owningProcess) {
                Write-Host "🔄 Killing process '$($owningProcess.ProcessName)' on port $Port" -ForegroundColor Yellow
                Stop-Process -Id $process.OwningProcess -Force
                Start-Sleep -Seconds 2
            }
        }
    }
    catch {
        Write-Host "⚠️  Could not kill process on port $Port" -ForegroundColor Yellow
    }
}

# Check if port 4000 is in use and offer to kill it
if (Test-PortInUse -Port 4000) {
    Write-Host "⚠️  Port 4000 is already in use" -ForegroundColor Yellow
    if ($Force) {
        Stop-ProcessOnPort -Port 4000
    } else {
        $response = Read-Host "Do you want to kill the process using port 4000? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            Stop-ProcessOnPort -Port 4000
        } else {
            Write-Host "❌ Please free up port 4000 and try again" -ForegroundColor Red
            exit 1
        }
    }
}

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "💡 Running environment setup..." -ForegroundColor Cyan
    & "$PSScriptRoot/setup-env.ps1"
    Write-Host ""
    Write-Host "⚠️  Please edit the .env file with your actual values, then run this script again" -ForegroundColor Yellow
    Write-Host "   Required: DATABASE_URL and AUTH_SECRET" -ForegroundColor Yellow
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Setup database if not skipping
if (!$SkipSetup) {
    Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan

    # Test database connection first
    Write-Host "🔍 Testing database connection..." -ForegroundColor Cyan
    try {
        $envContent = Get-Content ".env" -Raw
        $databaseUrl = ($envContent | Select-String -Pattern 'DATABASE_URL="([^"]+)"').Matches.Groups[1].Value
        if ($databaseUrl -and $databaseUrl -notlike "*user:password*") {
            Write-Host "✅ Database URL configured" -ForegroundColor Green
        } else {
            Write-Host "❌ Database URL not properly configured" -ForegroundColor Red
            Write-Host "💡 Please update DATABASE_URL in .env file" -ForegroundColor Yellow
            exit 1
        }
    }
    catch {
        Write-Host "❌ Could not read DATABASE_URL from .env" -ForegroundColor Red
        exit 1
    }

    # Run database setup
    npm run db:setup
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Database setup failed" -ForegroundColor Red
        Write-Host "💡 Check your DATABASE_URL and try again" -ForegroundColor Yellow
        exit 1
    }
}

# Start development server
Write-Host "🌟 Starting development server..." -ForegroundColor Green
Write-Host "📍 Server will be available at: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🔄 Logs will be saved to: dev-out.log and dev-err.log" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the dev server and capture output
try {
    npm run dev 2>&1 | Tee-Object -FilePath "dev-out.log"
} catch {
    Write-Host "❌ Failed to start development server" -ForegroundColor Red
    Write-Host "💡 Check dev-err.log for more details" -ForegroundColor Yellow
    exit 1
}
