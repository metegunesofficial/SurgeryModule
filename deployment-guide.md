# Deployment Guide
## Atilla Ağız ve Diş Sağlığı Merkezi - Ameliyathane ve Sterilizasyon Modülleri

### Versiyon: 1.0
### Tarih: 2025-08-08

---

## 1. DEPLOYMENT OVERVIEW

### 1.1 Architecture Summary
- **Frontend:** Next.js 14+ deployed on Vercel
- **Backend API:** Next.js API Routes (serverless functions)
- **Database:** PostgreSQL hosted on Supabase
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics + Sentry

### 1.2 Environment Structure

```
Production Environment
├── Frontend: medicasimple-surgery.vercel.app
├── Database: Supabase PostgreSQL
├── Authentication: Supabase Auth
└── Storage: Supabase Storage

Staging Environment  
├── Frontend: medicasimple-surgery-staging.vercel.app
├── Database: Supabase (staging project)
├── Authentication: Supabase Auth (staging)
└── Storage: Supabase Storage (staging)

Development Environment
├── Frontend: localhost:3000
├── Database: Local PostgreSQL / Supabase
├── Authentication: Supabase Auth (dev)
└── Storage: Supabase Storage (dev)
```

## 2. PRE-DEPLOYMENT CHECKLIST

### 2.1 Technical Requirements
- [ ] Node.js 20+ installed
- [ ] Git repository configured
- [ ] Vercel account created and configured
- [ ] Supabase project created (prod & staging)
- [ ] Domain names configured (if using custom domains)
- [ ] SSL certificates ready
- [ ] MedikaSimple API keys obtained
- [ ] Environment variables prepared

### 2.2 Compliance Requirements
- [ ] KVKK compliance documented
- [ ] SKS requirements mapped to features
- [ ] JCI standards verified
- [ ] Security audit completed
- [ ] Data backup strategy implemented
- [ ] Incident response plan prepared

### 2.3 User Readiness
- [ ] User training materials prepared
- [ ] User accounts created
- [ ] Roles and permissions configured
- [ ] Test data prepared (anonymized)
- [ ] Support documentation ready

## 3. SUPABASE SETUP

### 3.1 Database Setup

#### Create Supabase Projects
```bash
# Production
# Go to https://supabase.com/dashboard
# Create new project: "medicasimple-surgery-prod"
# Note down: 
# - Database URL
# - API URL  
# - Anon Key
# - Service Role Key

# Staging
# Create new project: "medicasimple-surgery-staging"
# Note down the same credentials
```

#### Database Schema Setup
```sql
-- Run these SQL commands in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'technician', 'quality_manager');
CREATE TYPE surgery_status AS ENUM ('scheduled', 'preparing', 'in_progress', 'completed', 'cancelled');
CREATE TYPE sterilization_type AS ENUM ('steam', 'ethylene_oxide', 'hydrogen_peroxide');
CREATE TYPE cycle_status AS ENUM ('running', 'completed', 'failed', 'interrupted');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  department TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operating rooms
CREATE TABLE operating_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  room_type TEXT NOT NULL,
  capacity INTEGER DEFAULT 1,
  equipment_list JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surgeries
CREATE TABLE surgeries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id TEXT NOT NULL, -- MedikaSimple patient ID
  patient_name TEXT NOT NULL,
  surgeon_id UUID NOT NULL REFERENCES profiles(id),
  assistant_ids UUID[] DEFAULT '{}',
  room_id UUID NOT NULL REFERENCES operating_rooms(id),
  procedure_type TEXT NOT NULL,
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_start TIMESTAMP WITH TIME ZONE,
  actual_end TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER NOT NULL, -- minutes
  status surgery_status DEFAULT 'scheduled',
  notes TEXT,
  preparation_checklist JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sterilization cycles
CREATE TABLE sterilization_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_number TEXT UNIQUE NOT NULL,
  sterilizer_id TEXT NOT NULL,
  cycle_type sterilization_type NOT NULL,
  temperature DECIMAL(5,2),
  pressure DECIMAL(5,2),
  duration INTEGER, -- minutes
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status cycle_status DEFAULT 'running',
  operator_id UUID NOT NULL REFERENCES profiles(id),
  validation_results JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sterilization_method TEXT,
  expiry_duration INTEGER DEFAULT 30, -- days
  is_reusable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material tracking
CREATE TABLE material_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id),
  cycle_id UUID REFERENCES sterilization_cycles(id),
  status TEXT DEFAULT 'dirty',
  location TEXT,
  sterilization_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  used_in_surgery UUID REFERENCES surgeries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_surgeries_date ON surgeries (scheduled_start);
CREATE INDEX idx_surgeries_status ON surgeries (status);
CREATE INDEX idx_surgeries_room ON surgeries (room_id);
CREATE INDEX idx_surgeries_surgeon ON surgeries (surgeon_id);
CREATE INDEX idx_material_tracking_status ON material_tracking (status);
CREATE INDEX idx_material_tracking_cycle ON material_tracking (cycle_id);
CREATE INDEX idx_audit_logs_user_date ON audit_logs (user_id, created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sterilization_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policy
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Surgeries policies  
CREATE POLICY "Users can view all surgeries" ON surgeries FOR SELECT USING (true);
CREATE POLICY "Doctors and admins can manage surgeries" ON surgeries FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'doctor')
  )
);

-- Add similar policies for other tables...
```

#### Initialize Sample Data
```sql
-- Insert sample operating rooms
INSERT INTO operating_rooms (name, room_type, capacity) VALUES
('Ameliyathane 1', 'main_surgery', 1),
('Ameliyathane 2', 'main_surgery', 1),
('Minör İşlem Odası', 'minor_surgery', 1);

-- Insert sample materials
INSERT INTO materials (barcode, name, category, sterilization_method) VALUES
('MAT001', 'Cerrahi Forseps', 'instruments', 'steam'),
('MAT002', 'Skalpel Seti', 'instruments', 'steam'),
('MAT003', 'Ameliyat Örtüsü', 'textiles', 'steam');

-- Create admin user (will be created after first login)
-- This is just a placeholder - actual user creation happens through Supabase Auth
```

### 3.2 Authentication Setup

#### Configure Authentication
```sql
-- In Supabase Dashboard > Authentication > Settings

-- Site URL (for redirects)
Site URL: https://medicasimple-surgery.vercel.app

-- Additional redirect URLs
https://medicasimple-surgery-staging.vercel.app
http://localhost:3000

-- Enable providers
Email: enabled
Phone: disabled (for now)

-- Email templates (customize as needed)
Confirm signup: Custom template with Turkish language
Reset password: Custom template with Turkish language
```

#### Create Trigger for Profile Creation
```sql
-- Function to create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 'nurse');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 3.3 Storage Setup

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('documents', 'documents', false),
('images', 'images', false),
('reports', 'reports', false);

-- Storage policies
CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view documents" ON storage.objects FOR SELECT USING (
  bucket_id = 'documents' AND auth.role() = 'authenticated'
);
```

## 4. VERCEL DEPLOYMENT

### 4.1 Project Setup

#### Install Vercel CLI
```bash
npm i -g vercel
vercel login
```

#### Project Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "functions": {
    "app/api/reports/generate": {
      "maxDuration": 30
    },
    "app/api/export/pdf": {
      "maxDuration": 20
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

#### Environment Variables Setup
```bash
# Production Environment Variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add MEDIKASIMPLE_API_URL production
vercel env add MEDIKASIMPLE_API_KEY production
vercel env add ENCRYPTION_KEY production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add SENTRY_DSN production

# Staging Environment Variables
vercel env add NEXT_PUBLIC_SUPABASE_URL staging
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY staging
# ... (repeat for all variables)

# Development Environment Variables  
vercel env add NEXT_PUBLIC_SUPABASE_URL development
# ... (repeat for all variables)
```

### 4.2 Deployment Process

#### Initial Deployment
```bash
# Clone the repository
git clone <repository-url>
cd medicasimple-surgery-system

# Install dependencies
npm install

# Build and test locally
npm run build
npm run test

# Deploy to Vercel
vercel --prod

# The CLI will guide you through:
# 1. Linking to existing project or creating new
# 2. Setting up domains
# 3. Configuring environment variables
```

#### Custom Domain Setup
```bash
# Add custom domain
vercel domains add medicasimple-surgery.atillaagiz.com

# Verify domain ownership
# Add DNS records as instructed by Vercel

# Configure SSL
# Vercel automatically provisions SSL certificates
```

### 4.3 CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL_TEST }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY_TEST }}
      
      - name: Run build
        run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

## 5. ENVIRONMENT CONFIGURATION

### 5.1 Environment Variables

#### Production (.env.production)
```bash
# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://medicasimple-surgery.vercel.app
NEXT_PUBLIC_APP_NAME="Ameliyathane & Sterilizasyon Sistemi"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres

# MedikaSimple Integration
MEDIKASIMPLE_API_URL=https://api.medicasimple.com/v1
MEDIKASIMPLE_API_KEY=ms_live_abc123...
MEDIKASIMPLE_WEBHOOK_SECRET=whsec_abc123...

# Security
ENCRYPTION_KEY=your-32-character-encryption-key
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://medicasimple-surgery.vercel.app

# Third-party Services
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
SENTRY_ORG=your-org
SENTRY_PROJECT=medicasimple-surgery

# Email Configuration (if needed)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@atillaagiz.com
SMTP_PASS=your-app-password

# Monitoring
VERCEL_ANALYTICS_ID=your-analytics-id
```

#### Staging (.env.staging)
```bash
# Same as production but with staging values
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://medicasimple-surgery-staging.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
# ... etc
```

#### Development (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
# ... etc
```

### 5.2 Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      'your-project.supabase.co',
      'medicasimple.com'
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## 6. DOMAIN AND SSL CONFIGURATION

### 6.1 Domain Setup

#### DNS Configuration
```
# Add these DNS records to your domain provider:

# A Record
Name: medicasimple-surgery (or subdomain)
Value: 76.76.19.61 (Vercel IP)

# CNAME Record (alternative)
Name: medicasimple-surgery
Value: cname.vercel-dns.com

# For custom domain:
CNAME: www.medicasimple-surgery.atillaagiz.com -> cname.vercel-dns.com
A: medicasimple-surgery.atillaagiz.com -> 76.76.19.61
```

#### Vercel Domain Configuration
```bash
# Add domain to Vercel
vercel domains add medicasimple-surgery.atillaagiz.com

# Verify domain
vercel domains verify medicasimple-surgery.atillaagiz.com

# Check domain status
vercel domains ls
```

### 6.2 SSL Certificate

Vercel automatically provisions and renews SSL certificates for all domains. No manual configuration needed.

## 7. MONITORING AND LOGGING

### 7.1 Sentry Configuration

```javascript
// sentry.client.config.js
import { init } from '@sentry/nextjs';

init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  debug: process.env.NODE_ENV === 'development',
  integrations: [
    // Additional integrations if needed
  ],
});
```

```javascript
// sentry.server.config.js
import { init } from '@sentry/nextjs';

init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

### 7.2 Vercel Analytics

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 7.3 Custom Logging

```javascript
// lib/logger.js
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    // Add other transports as needed
  ],
});

export default logger;
```

## 8. SECURITY CONFIGURATION

### 8.1 Environment Security

```javascript
// lib/security.js
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(encryptedData) {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = parts.join(':');
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 8.2 CORS Configuration

Already configured in `next.config.js` and `vercel.json`.

### 8.3 Rate Limiting

```javascript
// lib/rate-limit.js
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});
```

## 9. PERFORMANCE OPTIMIZATION

### 9.1 Caching Strategy

```javascript
// lib/cache.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getCached(key, fetcher, ttl = 300) {
  const cached = await redis.get(key);
  
  if (cached) {
    return cached;
  }
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}
```

### 9.2 Database Optimization

```sql
-- Add database indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_surgeries_date_status 
ON surgeries (scheduled_start, status) 
WHERE status != 'cancelled';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_material_tracking_active 
ON material_tracking (status, location, expiry_date) 
WHERE status IN ('sterile', 'sterilizing');

-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT s.*, p.full_name as surgeon_name 
FROM surgeries s 
JOIN profiles p ON s.surgeon_id = p.id 
WHERE DATE(s.scheduled_start) = CURRENT_DATE;
```

## 10. BACKUP AND DISASTER RECOVERY

### 10.1 Database Backup

Supabase automatically handles database backups for paid plans:

- **Automatic Backups:** Daily backups for 7 days
- **Point-in-time Recovery:** Available for Pro plan
- **Manual Backups:** Can be triggered via Supabase Dashboard

### 10.2 Application Backup

```bash
# Backup deployment configuration
mkdir backups
vercel env pull .env.production.backup
cp vercel.json backups/
cp package.json backups/
cp next.config.js backups/

# Create git tag for stable releases
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0
```

### 10.3 Disaster Recovery Plan

1. **Data Loss Recovery:**
   - Restore from Supabase backup
   - Re-deploy application from git
   - Verify data integrity

2. **Application Failure:**
   - Check Vercel deployment logs
   - Rollback to previous deployment if needed
   - Monitor system health

3. **Third-party Service Failure:**
   - Enable graceful degradation
   - Show user-friendly error messages
   - Log incidents for later analysis

## 11. POST-DEPLOYMENT VERIFICATION

### 11.1 Health Checks

```bash
# Test application health
curl https://medicasimple-surgery.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "services": {
    "database": "healthy",
    "supabase": "healthy",
    "medicasimple": "healthy"
  }
}
```

### 11.2 Functionality Testing

```bash
# Test authentication
curl -X POST https://medicasimple-surgery.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test API endpoints
curl https://medicasimple-surgery.vercel.app/api/surgeries \
  -H "Authorization: Bearer <token>"
```

### 11.3 Performance Testing

```bash
# Use Apache Bench for basic load testing
ab -n 1000 -c 10 https://medicasimple-surgery.vercel.app/

# Use k6 for more comprehensive testing
k6 run performance-test.js
```

## 12. MAINTENANCE AND UPDATES

### 12.1 Regular Maintenance Tasks

#### Weekly
- [ ] Check application logs for errors
- [ ] Monitor performance metrics
- [ ] Review security alerts
- [ ] Check backup status

#### Monthly
- [ ] Update dependencies
- [ ] Review and rotate API keys
- [ ] Database performance analysis
- [ ] User feedback review

#### Quarterly
- [ ] Security audit
- [ ] Compliance review (SKS/JCI)
- [ ] Disaster recovery test
- [ ] Performance optimization review

### 12.2 Update Process

```bash
# 1. Create feature branch
git checkout -b feature/update-dependencies

# 2. Update dependencies
npm update
npm audit fix

# 3. Test changes
npm run test
npm run build

# 4. Deploy to staging
git push origin feature/update-dependencies
# Create PR to staging branch

# 5. Test on staging environment
# Run integration tests
# Verify functionality

# 6. Deploy to production
# Merge PR to main branch
# Monitor deployment
```

## 13. TROUBLESHOOTING

### 13.1 Common Issues

#### Build Failures
```bash
# Check build logs
vercel logs

# Common fixes:
# 1. Check for TypeScript errors
npm run type-check

# 2. Check for missing environment variables
vercel env ls

# 3. Clear cache and rebuild
vercel rm [deployment-url] --yes
vercel --prod
```

#### Database Connection Issues
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Check Supabase status
curl https://status.supabase.com/api/v2/status.json
```

#### Performance Issues
```bash
# Check Vercel function logs
vercel logs --follow

# Monitor database queries
# Use Supabase Dashboard > Database > Query Performance
```

### 13.2 Emergency Procedures

#### Application Down
1. Check Vercel status dashboard
2. Review recent deployments
3. Rollback if necessary: `vercel rollback`
4. Contact Vercel support if needed

#### Data Loss
1. Stop application if needed
2. Assess extent of data loss
3. Restore from backup
4. Verify data integrity
5. Resume normal operations

#### Security Breach
1. Immediately revoke compromised credentials
2. Change all API keys and secrets
3. Review audit logs
4. Assess impact and notify stakeholders
5. Implement additional security measures

## 14. CONTACT AND SUPPORT

### 14.1 Support Contacts

- **Technical Support:** developer@atillaagiz.com
- **System Admin:** admin@atillaagiz.com
- **Medical Staff Liaison:** support@atillaagiz.com

### 14.2 External Support

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **MedikaSimple Support:** support@medicasimple.com

### 14.3 Documentation

- **Application Documentation:** `/docs` directory
- **API Documentation:** `https://medicasimple-surgery.vercel.app/api-docs`
- **User Manual:** Available in system help section

---

**Deployment Completed Successfully! 🎉**

Bu deployment guide'ı takip ederek sistem başarıyla canlıya alınabilir. Herhangi bir sorun durumunda yukarıdaki troubleshooting bölümünü kontrol edin ve gerekirse destek ekibiyle iletişime geçin.