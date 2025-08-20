# SurgeryModule Environment Setup Script
# This script helps you set up the required environment variables

Write-Host "Setting up environment variables for SurgeryModule..." -ForegroundColor Green

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host ".env file already exists. Backing up to .env.backup" -ForegroundColor Yellow
    Copy-Item .env .env.backup
}

# Create .env file with template
@"
# Database Configuration
# Replace with your actual Neon database URL
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Authentication Configuration
# Generate a secure random string for production
AUTH_SECRET="your-super-secret-auth-key-change-this-in-production"

# Development Configuration
NODE_ENV="development"
PORT="4000"

# Optional: CORS origins for development
CORS_ORIGINS="http://localhost:4000,http://127.0.0.1:4000"

# Optional: Auth URL (defaults to localhost:4000 if not set)
AUTH_URL="http://localhost:4000"
"@ | Out-File -FilePath .env -Encoding UTF8

Write-Host "Created .env file with template values" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Please update the following values in .env:" -ForegroundColor Yellow
Write-Host "   1. DATABASE_URL - Replace with your actual Neon database URL"
Write-Host "   2. AUTH_SECRET - Generate a secure random string"
Write-Host ""
Write-Host "You can generate a secure AUTH_SECRET with:" -ForegroundColor Cyan
Write-Host '   node -e "console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))"'
Write-Host ""
Write-Host "Once updated, run: npm run db:setup" -ForegroundColor Green
Write-Host "Then run: npm run dev" -ForegroundColor Green
