# Technical Architecture Document (TAD)
## Atilla Ağız ve Diş Sağlığı Merkezi - Ameliyathane ve Sterilizasyon Modülleri

### Versiyon: 1.0
### Tarih: 2025-08-08

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (API Layer)   │◄──►│   (Supabase)    │
│   React/Next.js │    │   Node.js       │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TV Display    │    │   MedikaSimple  │    │   File Storage  │
│   System        │    │   CRM API       │    │   (Supabase)    │
│   (WebSocket)   │    │   Integration   │    │   Documents     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 Technology Stack

#### Frontend
- **Framework:** Next.js 14+ (React 18+)
- **Styling:** Tailwind CSS + MedikaSimple Design System
- **State Management:** Zustand / Redux Toolkit
- **UI Library:** Headless UI / Radix UI
- **Forms:** React Hook Form + Zod Validation
- **Charts:** Chart.js / Recharts
- **Date Handling:** date-fns

#### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js / Fastify
- **Database ORM:** Prisma / Supabase Client
- **Authentication:** Supabase Auth
- **API Documentation:** Swagger/OpenAPI
- **Validation:** Zod / Joi
- **Background Jobs:** Bull Queue (Redis)

#### Database
- **Primary DB:** PostgreSQL (Supabase)
- **Cache:** Redis (Upstash)
- **File Storage:** Supabase Storage
- **Search:** PostgreSQL Full-text Search

#### Infrastructure
- **Hosting:** Vercel (Frontend)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **CDN:** Vercel Edge Network
- **Monitoring:** Sentry + Vercel Analytics
- **Email:** Resend / Supabase Auth

## 2. DATABASE DESIGN

### 2.1 Core Entities

```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL,
  department VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Operating Room Management
CREATE TABLE operating_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  room_type room_type_enum NOT NULL,
  capacity INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  equipment_list JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Surgery Schedule
CREATE TABLE surgeries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL, -- Link to MedikaSimple
  surgeon_id UUID REFERENCES users(id),
  assistant_ids UUID[],
  room_id UUID REFERENCES operating_rooms(id),
  procedure_type VARCHAR(100) NOT NULL,
  scheduled_start TIMESTAMP NOT NULL,
  estimated_duration INTEGER NOT NULL, -- minutes
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  status surgery_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sterilization Cycles
CREATE TABLE sterilization_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_number VARCHAR(20) UNIQUE NOT NULL,
  sterilizer_id UUID NOT NULL,
  cycle_type sterilization_type NOT NULL,
  temperature DECIMAL(5,2),
  pressure DECIMAL(5,2),
  duration INTEGER, -- minutes
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  status cycle_status DEFAULT 'running',
  operator_id UUID REFERENCES users(id),
  validation_results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Material Tracking
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode VARCHAR(50) UNIQUE,
  name VARCHAR(100) NOT NULL,
  category material_category NOT NULL,
  sterilization_method VARCHAR(50),
  expiry_duration INTEGER, -- days after sterilization
  is_reusable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE material_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES materials(id),
  cycle_id UUID REFERENCES sterilization_cycles(id),
  status tracking_status DEFAULT 'dirty',
  location VARCHAR(50),
  sterilization_date TIMESTAMP,
  expiry_date TIMESTAMP,
  used_in_surgery UUID REFERENCES surgeries(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Enums and Types

```sql
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'technician', 'quality_manager');
CREATE TYPE room_type_enum AS ENUM ('main_surgery', 'minor_surgery', 'consultation');
CREATE TYPE surgery_status AS ENUM ('scheduled', 'preparing', 'in_progress', 'completed', 'cancelled');
CREATE TYPE sterilization_type AS ENUM ('steam', 'ethylene_oxide', 'hydrogen_peroxide');
CREATE TYPE cycle_status AS ENUM ('running', 'completed', 'failed', 'interrupted');
CREATE TYPE material_category AS ENUM ('instruments', 'textiles', 'implants', 'consumables');
CREATE TYPE tracking_status AS ENUM ('dirty', 'cleaning', 'sterilizing', 'sterile', 'expired', 'in_use');
```

## 3. API DESIGN

### 3.1 RESTful API Endpoints

```typescript
// Authentication
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/refresh

// Surgery Management
GET    /api/surgeries              // List surgeries
POST   /api/surgeries              // Create surgery
GET    /api/surgeries/:id          // Get surgery details
PUT    /api/surgeries/:id          // Update surgery
DELETE /api/surgeries/:id          // Cancel surgery
POST   /api/surgeries/:id/start    // Start surgery
POST   /api/surgeries/:id/complete // Complete surgery

// Operating Room Management
GET    /api/rooms                  // List rooms
GET    /api/rooms/:id/schedule     // Room schedule
POST   /api/rooms/:id/prepare      // Mark room as prepared
GET    /api/rooms/availability     // Check availability

// Sterilization Management
GET    /api/sterilization/cycles   // List cycles
POST   /api/sterilization/cycles   // Start new cycle
GET    /api/sterilization/cycles/:id // Cycle details
POST   /api/sterilization/cycles/:id/complete // Complete cycle

// Material Tracking
GET    /api/materials              // List materials
POST   /api/materials/scan         // Scan barcode
GET    /api/materials/:id/history  // Material history
POST   /api/materials/batch        // Batch process materials

// Quality & Compliance
GET    /api/reports/sks            // SKS compliance reports
GET    /api/reports/jci            // JCI compliance reports
GET    /api/audit-logs             // Audit trail
POST   /api/incidents              // Report incidents

// TV Display
GET    /api/display/surgeries      // Current surgery status
WS     /api/display/live           // WebSocket for real-time updates
```

### 3.2 WebSocket Events

```typescript
// Real-time events for TV display and notifications
interface WebSocketEvents {
  'surgery-status-update': {
    surgeryId: string;
    status: SurgeryStatus;
    estimatedEnd?: Date;
  };
  
  'room-status-change': {
    roomId: string;
    status: 'occupied' | 'preparing' | 'cleaning' | 'ready';
  };
  
  'emergency-alert': {
    type: 'medical' | 'fire' | 'security';
    message: string;
    roomId?: string;
  };
  
  'sterilization-complete': {
    cycleId: string;
    materialsCount: number;
  };
}
```

## 4. INTEGRATION ARCHITECTURE

### 4.1 MedikaSimple CRM Integration

```typescript
// MedikaSimple API Client
class MedikaSimpleClient {
  private baseURL = process.env.MEDIKASIMPLE_API_URL;
  private apiKey = process.env.MEDIKASIMPLE_API_KEY;
  
  async getPatient(patientId: string) {
    return await this.request(`/patients/${patientId}`);
  }
  
  async createAppointment(data: AppointmentData) {
    return await this.request('/appointments', 'POST', data);
  }
  
  async updateTreatment(treatmentId: string, data: TreatmentUpdate) {
    return await this.request(`/treatments/${treatmentId}`, 'PUT', data);
  }
  
  private async request(endpoint: string, method = 'GET', data?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    return response.json();
  }
}
```

### 4.2 Third-party Integration Layer

```typescript
// Generic integration interface
interface ThirdPartyIntegration {
  name: string;
  version: string;
  authenticate(): Promise<boolean>;
  syncData(dataType: string, data: any): Promise<void>;
  healthCheck(): Promise<boolean>;
}

// Integration registry
class IntegrationManager {
  private integrations: Map<string, ThirdPartyIntegration> = new Map();
  
  register(name: string, integration: ThirdPartyIntegration) {
    this.integrations.set(name, integration);
  }
  
  async syncAllData(dataType: string, data: any) {
    const promises = Array.from(this.integrations.values())
      .map(integration => integration.syncData(dataType, data));
    
    await Promise.allSettled(promises);
  }
}
```

## 5. SECURITY ARCHITECTURE

### 5.1 Authentication & Authorization

```typescript
// Role-based access control
const permissions = {
  admin: ['*'],
  doctor: [
    'surgery:read',
    'surgery:create',
    'surgery:update',
    'patient:read',
    'room:read'
  ],
  nurse: [
    'surgery:read',
    'surgery:update',
    'material:read',
    'material:track',
    'room:prepare'
  ],
  technician: [
    'sterilization:*',
    'material:*',
    'equipment:*'
  ],
  quality_manager: [
    'report:*',
    'audit:*',
    'incident:*'
  ]
};

// Middleware for permission checking
const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userPermissions = permissions[userRole] || [];
    
    const hasPermission = userPermissions.includes('*') || 
                         userPermissions.includes(permission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

### 5.2 Data Encryption & Privacy

```typescript
// Data encryption utilities
class SecurityManager {
  private encryptionKey = process.env.ENCRYPTION_KEY;
  
  encryptSensitiveData(data: any): string {
    // Implementation for encrypting sensitive patient data
    return encrypt(JSON.stringify(data), this.encryptionKey);
  }
  
  decryptSensitiveData(encryptedData: string): any {
    // Implementation for decrypting sensitive patient data
    return JSON.parse(decrypt(encryptedData, this.encryptionKey));
  }
  
  auditLog(userId: string, action: string, resource: string, metadata?: any) {
    // Implementation for audit logging
    return this.createAuditEntry({
      userId,
      action,
      resource,
      timestamp: new Date(),
      metadata,
      ipAddress: this.getCurrentIP(),
    });
  }
}
```

## 6. DEPLOYMENT ARCHITECTURE

### 6.1 Vercel Deployment Configuration

```typescript
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
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_APP_URL": "@app-url",
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "functions": {
    "app/api/reports/generate": {
      "maxDuration": 30
    }
  }
}
```

### 6.2 Environment Configuration

```bash
# Production Environment Variables
NEXT_PUBLIC_APP_URL=https://ameliyathane.medicasimple.app
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Private Environment Variables
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MEDIKASIMPLE_API_URL=https://api.medicasimple.com
MEDIKASIMPLE_API_KEY=your-medikasimple-api-key
ENCRYPTION_KEY=your-encryption-key
REDIS_URL=redis://your-redis-url
SENTRY_DSN=your-sentry-dsn
```

## 7. MONITORING & OBSERVABILITY

### 7.1 Application Monitoring

```typescript
// Error tracking and performance monitoring
import * as Sentry from '@sentry/nextjs';
import { Analytics } from '@vercel/analytics/react';

// Custom performance metrics
class PerformanceMonitor {
  static trackOperation(operationName: string, duration: number, metadata?: any) {
    // Send metrics to monitoring service
    Sentry.addBreadcrumb({
      message: `Operation: ${operationName}`,
      data: { duration, ...metadata },
      level: 'info',
    });
  }
  
  static trackUserAction(action: string, userId: string, metadata?: any) {
    // Track user interactions for analytics
    Analytics.track(action, {
      userId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}
```

### 7.2 Health Checks

```typescript
// Health check endpoints
export async function GET() {
  const healthChecks = await Promise.allSettled([
    checkDatabase(),
    checkExternalAPIs(),
    checkStorageService(),
    checkCacheService(),
  ]);
  
  const status = healthChecks.every(check => check.status === 'fulfilled') 
    ? 'healthy' : 'degraded';
  
  return Response.json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      database: healthChecks[0].status,
      external_apis: healthChecks[1].status,
      storage: healthChecks[2].status,
      cache: healthChecks[3].status,
    }
  });
}
```

## 8. PERFORMANCE OPTIMIZATION

### 8.1 Frontend Optimization

```typescript
// Code splitting and lazy loading
const SurgeryModule = lazy(() => import('@/components/surgery/SurgeryModule'));
const SterilizationModule = lazy(() => import('@/components/sterilization/SterilizationModule'));
const ReportsModule = lazy(() => import('@/components/reports/ReportsModule'));

// Image optimization
const OptimizedImage = ({ src, alt, ...props }: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    priority={false}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    {...props}
  />
);

// API response caching
const useSWRWithCache = (key: string, fetcher: Function, options?: SWRConfiguration) => {
  return useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    ...options,
  });
};
```

### 8.2 Database Optimization

```sql
-- Database indexes for optimal query performance
CREATE INDEX CONCURRENTLY idx_surgeries_date_room 
ON surgeries (scheduled_start, room_id) 
WHERE status != 'cancelled';

CREATE INDEX CONCURRENTLY idx_materials_tracking_status 
ON material_tracking (status, location, expiry_date);

CREATE INDEX CONCURRENTLY idx_sterilization_cycles_date 
ON sterilization_cycles (start_time DESC, status);

-- Partial indexes for frequently queried subsets
CREATE INDEX CONCURRENTLY idx_active_users 
ON users (role, department) 
WHERE is_active = true;
```

## 9. TESTING STRATEGY

### 9.1 Testing Pyramid

```typescript
// Unit Tests (Jest + React Testing Library)
describe('SurgeryScheduler', () => {
  it('should calculate correct surgery duration', () => {
    const surgery = new Surgery({
      estimatedDuration: 120,
      actualStart: new Date('2025-01-01T10:00:00Z'),
    });
    
    expect(surgery.getEstimatedEnd()).toEqual(
      new Date('2025-01-01T12:00:00Z')
    );
  });
});

// Integration Tests (API endpoints)
describe('POST /api/surgeries', () => {
  it('should create surgery with valid data', async () => {
    const response = await request(app)
      .post('/api/surgeries')
      .send(validSurgeryData)
      .expect(201);
      
    expect(response.body.id).toBeDefined();
  });
});

// E2E Tests (Playwright)
test('should complete surgery workflow', async ({ page }) => {
  await page.goto('/surgeries');
  await page.click('[data-testid="new-surgery-button"]');
  await page.fill('[data-testid="patient-search"]', 'John Doe');
  await page.click('[data-testid="schedule-surgery"]');
  await expect(page).toHaveURL('/surgeries/confirmation');
});
```

## 10. MIGRATION & DEPLOYMENT STRATEGY

### 10.1 Data Migration

```typescript
// Migration scripts for existing data
class DataMigration {
  async migrateFromLegacySystem() {
    const legacyData = await this.fetchLegacyData();
    
    for (const record of legacyData) {
      await this.transformAndInsert(record);
    }
  }
  
  private async transformAndInsert(legacyRecord: any) {
    const transformed = {
      id: uuid(),
      ...this.mapFields(legacyRecord),
      migrated_at: new Date(),
    };
    
    await supabase.from('surgeries').insert(transformed);
  }
}
```

### 10.2 Rollout Strategy

```yaml
# Deployment stages
stages:
  - name: "Development"
    environment: "dev"
    auto_deploy: true
    
  - name: "Staging" 
    environment: "staging"
    manual_approval: true
    
  - name: "Production"
    environment: "prod"
    manual_approval: true
    rollback_strategy: "immediate"
```

Bu Technical Architecture Document, sistem geliştirme sürecinde teknik kılavuz olarak kullanılacak ve tüm geliştirici ekibi tarafından referans alınacaktır.