#!/bin/bash

# SurgeryModule Environment Setup Script
# This script helps you set up the required environment variables

echo "🔧 Setting up environment variables for SurgeryModule..."

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Create .env file with template
cat > .env << 'EOF'
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
EOF

echo "✅ Created .env file with template values"
echo ""
echo "⚠️  IMPORTANT: Please update the following values in .env:"
echo "   1. DATABASE_URL - Replace with your actual Neon database URL"
echo "   2. AUTH_SECRET - Generate a secure random string"
echo ""
echo "💡 You can generate a secure AUTH_SECRET with:"
echo '   node -e "console.log(require(\"crypto\").randomBytes(32).toString(\"hex\"))"'
echo ""
echo "🚀 Once updated, run: npm run db:setup"
echo "🚀 Then run: npm run dev"
