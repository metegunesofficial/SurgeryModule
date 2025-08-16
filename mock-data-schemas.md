# 🗃️ Mock Veri Şemaları ve Test Verileri

## 👥 User Management Mock Data

### User Entities
```typescript
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  hospitalId: string
  departmentId?: string
  isActive: boolean
  permissions: Permission[]
  createdAt: Date
  lastLoginAt: Date
}

enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  HOSPITAL_ADMIN = 'hospital_admin',
  OR_COORDINATOR = 'or_coordinator',
  SURGEON = 'surgeon',
  ANESTHESIOLOGIST = 'anesthesiologist',
  OR_NURSE = 'or_nurse',
  SPD_SUPERVISOR = 'spd_supervisor',
  SPD_TECHNICIAN = 'spd_technician',
  PHARMACY_MANAGER = 'pharmacy_manager',
  QUALITY_OFFICER = 'quality_officer'
}
```

### Mock Users
```typescript
const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'admin@acmehospital.com',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    role: UserRole.HOSPITAL_ADMIN,
    hospitalId: 'hospital-001',
    isActive: true,
    permissions: ['ALL'],
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date('2025-08-16')
  },
  {
    id: 'user-002',
    email: 'dr.mehmet@acmehospital.com',
    firstName: 'Dr. Mehmet',
    lastName: 'Özkan',
    role: UserRole.SURGEON,
    hospitalId: 'hospital-001',
    departmentId: 'dept-cardiac',
    isActive: true,
    permissions: ['OR_SCHEDULE', 'OR_VIEW', 'PATIENT_MANAGE'],
    createdAt: new Date('2024-02-01'),
    lastLoginAt: new Date('2025-08-15')
  }
]
```

## 🏥 Hospital & Department Mock Data

### Hospital Entity
```typescript
interface Hospital {
  id: string
  name: string
  address: string
  city: string
  country: string
  accreditation: Accreditation[]
  totalBeds: number
  totalORs: number
  isActive: boolean
  settings: HospitalSettings
}

interface Accreditation {
  type: 'JCI' | 'SKS' | 'ISO13485' | 'HIMSS'
  level: string
  validUntil: Date
  certificateNumber: string
}
```

### Mock Hospitals
```typescript
const mockHospitals: Hospital[] = [
  {
    id: 'hospital-001',
    name: 'Acme Hastanesi Kadıköy',
    address: 'Fenerbahçe Mah. Hastane Cad. No:123',
    city: 'İstanbul',
    country: 'Türkiye',
    accreditation: [
      { type: 'JCI', level: 'Full', validUntil: new Date('2026-12-31'), certificateNumber: 'JCI-TR-2024-001' },
      { type: 'SKS', level: 'Level 3', validUntil: new Date('2025-12-31'), certificateNumber: 'SKS-2024-456' }
    ],
    totalBeds: 250,
    totalORs: 12,
    isActive: true,
    settings: {
      timezone: 'Europe/Istanbul',
      language: 'tr-TR',
      currency: 'TRY'
    }
  }
]
```

## 🏢 Department Mock Data
```typescript
interface Department {
  id: string
  hospitalId: string
  name: string
  type: DepartmentType
  headOfDepartment: string // userId
  staff: string[] // userIds
  equipment: string[] // equipmentIds
  specializations: string[]
}

const mockDepartments: Department[] = [
  {
    id: 'dept-cardiac',
    hospitalId: 'hospital-001',
    name: 'Kalp ve Damar Cerrahisi',
    type: 'SURGICAL',
    headOfDepartment: 'user-002',
    staff: ['user-002', 'user-003', 'user-004'],
    equipment: ['eq-heartlung-001', 'eq-monitor-001'],
    specializations: ['Bypass', 'Valve Surgery', 'Pacemaker']
  }
]
```

## 🏥 Operating Room Mock Data

### OR Entity
```typescript
interface OperatingRoom {
  id: string
  hospitalId: string
  name: string
  roomNumber: string
  type: ORType
  status: ORStatus
  equipment: Equipment[]
  capabilities: ORCapability[]
  maintenanceSchedule: MaintenanceSchedule[]
  isActive: boolean
}

enum ORType {
  GENERAL = 'general',
  CARDIAC = 'cardiac',
  NEURO = 'neuro',
  ORTHOPEDIC = 'orthopedic',
  PEDIATRIC = 'pediatric',
  TRAUMA = 'trauma'
}

enum ORStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}
```

### Mock Operating Rooms
```typescript
const mockORs: OperatingRoom[] = [
  {
    id: 'or-001',
    hospitalId: 'hospital-001',
    name: 'Ameliyathane 1',
    roomNumber: 'OR-01',
    type: ORType.CARDIAC,
    status: ORStatus.AVAILABLE,
    equipment: [
      { id: 'eq-001', name: 'Kalp-Akciğer Makinesi', status: 'operational' },
      { id: 'eq-002', name: 'Anestezi Makinesi', status: 'operational' }
    ],
    capabilities: ['Open Heart Surgery', 'Minimally Invasive', 'Robotic Surgery'],
    maintenanceSchedule: [
      { date: new Date('2025-08-20'), type: 'preventive', duration: 120 }
    ],
    isActive: true
  }
]
```

## 📅 Surgery Schedule Mock Data

### Surgery Entity
```typescript
interface Surgery {
  id: string
  hospitalId: string
  orId: string
  patientId: string
  surgeonId: string
  anesthesiologistId: string
  assistantIds: string[]
  nurseIds: string[]
  procedureCode: string
  procedureName: string
  scheduledStart: Date
  scheduledEnd: Date
  actualStart?: Date
  actualEnd?: Date
  status: SurgeryStatus
  priority: SurgeryPriority
  notes: string
  instrumentSets: string[] // setIds
  medications: MedicationOrder[]
  complications?: Complication[]
}

enum SurgeryStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DELAYED = 'delayed'
}
```

### Mock Surgeries
```typescript
const mockSurgeries: Surgery[] = [
  {
    id: 'surgery-001',
    hospitalId: 'hospital-001',
    orId: 'or-001',
    patientId: 'patient-001',
    surgeonId: 'user-002',
    anesthesiologistId: 'user-005',
    assistantIds: ['user-006'],
    nurseIds: ['user-007', 'user-008'],
    procedureCode: 'ICD-10-PCS-021209W',
    procedureName: 'Koroner Bypass (CABG)',
    scheduledStart: new Date('2025-08-17T08:00:00'),
    scheduledEnd: new Date('2025-08-17T12:00:00'),
    status: SurgeryStatus.SCHEDULED,
    priority: 'ELECTIVE',
    notes: 'Triple vessel disease, EF: 45%',
    instrumentSets: ['set-cardiac-001', 'set-basic-001'],
    medications: [
      { drugId: 'drug-heparin', dose: '5000 IU', route: 'IV' }
    ]
  }
]
```

## 🧼 Sterilization Mock Data

### Instrument Set
```typescript
interface InstrumentSet {
  id: string
  hospitalId: string
  name: string
  code: string
  category: string
  instruments: Instrument[]
  standardComposition: InstrumentComposition[]
  currentStatus: SetStatus
  lastSterilized?: Date
  expiryDate?: Date
  assignedToOR?: string
}

interface Instrument {
  id: string
  name: string
  serialNumber?: string
  manufacturer: string
  isPresent: boolean
  condition: 'good' | 'worn' | 'damaged'
  lastInspected: Date
}
```

### Mock Instrument Sets
```typescript
const mockInstrumentSets: InstrumentSet[] = [
  {
    id: 'set-cardiac-001',
    hospitalId: 'hospital-001',
    name: 'Kalp Cerrahisi Seti - Temel',
    code: 'CARD-BASIC-001',
    category: 'Cardiac Surgery',
    instruments: [
      {
        id: 'inst-001',
        name: 'DeBakey Forseps 20cm',
        serialNumber: 'DB-001-2024',
        manufacturer: 'Aesculap',
        isPresent: true,
        condition: 'good',
        lastInspected: new Date('2025-08-15')
      }
    ],
    standardComposition: [
      { instrumentId: 'inst-001', quantity: 2, isMandatory: true }
    ],
    currentStatus: 'STERILE',
    lastSterilized: new Date('2025-08-16T06:00:00'),
    expiryDate: new Date('2025-08-23T06:00:00')
  }
]
```

### Sterilization Cycle
```typescript
interface SterilizationCycle {
  id: string
  hospitalId: string
  sterilizerId: string
  cycleNumber: string
  startTime: Date
  endTime?: Date
  temperature: number
  pressure: number
  duration: number
  status: CycleStatus
  operator: string // userId
  instrumentSets: string[] // setIds
  biologicalIndicator: BiologicalIndicator
  chemicalIndicators: ChemicalIndicator[]
  releaseStatus: 'QUARANTINE' | 'RELEASED' | 'REJECTED'
  releaseBy?: string // userId
  releaseDate?: Date
}
```

## 💊 Pharmacy Mock Data

### Medication
```typescript
interface Medication {
  id: string
  hospitalId: string
  name: string
  genericName: string
  brandName?: string
  dosageForm: 'tablet' | 'injection' | 'solution' | 'cream'
  strength: string
  manufacturer: string
  barcode: string
  isControlled: boolean
  storageConditions: StorageCondition[]
  currentStock: number
  reorderLevel: number
  maxStock: number
  unitCost: number
  expiryBatches: ExpiryBatch[]
}

const mockMedications: Medication[] = [
  {
    id: 'med-001',
    hospitalId: 'hospital-001',
    name: 'Heparin Sodium',
    genericName: 'Heparin',
    brandName: 'Clexane',
    dosageForm: 'injection',
    strength: '5000 IU/0.2ml',
    manufacturer: 'Sanofi',
    barcode: '8699546421234',
    isControlled: false,
    storageConditions: ['REFRIGERATED'],
    currentStock: 150,
    reorderLevel: 50,
    maxStock: 500,
    unitCost: 25.50,
    expiryBatches: [
      { batchNumber: 'HEP2024001', quantity: 100, expiryDate: new Date('2026-03-15') }
    ]
  }
]
```

## 📊 Compliance & Audit Mock Data

### Compliance Check
```typescript
interface ComplianceCheck {
  id: string
  hospitalId: string
  standard: 'SKS' | 'JCI' | 'ISO' | 'AAMI'
  requirement: string
  description: string
  checkDate: Date
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL'
  evidence: ComplianceEvidence[]
  correctiveActions?: CorrectiveAction[]
  nextCheckDate: Date
  responsibleUser: string
}

const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: 'comp-001',
    hospitalId: 'hospital-001',
    standard: 'JCI',
    requirement: 'PCI.01.01.01',
    description: 'Time-out prosedürü her ameliyat öncesi uygulanmalı',
    checkDate: new Date('2025-08-15'),
    status: 'COMPLIANT',
    evidence: [
      { type: 'DOCUMENT', description: 'Time-out checklist forms', documentId: 'doc-001' }
    ],
    nextCheckDate: new Date('2025-09-15'),
    responsibleUser: 'user-009' // Quality Officer
  }
]
```

## 🧪 Test Senaryoları

### Unit Test Mock Functions
```typescript
// Mock data generators
export const generateMockUser = (overrides?: Partial<User>): User => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  email: `test${Math.floor(Math.random() * 1000)}@hospital.com`,
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.OR_NURSE,
  hospitalId: 'hospital-test',
  isActive: true,
  permissions: ['OR_VIEW'],
  createdAt: new Date(),
  lastLoginAt: new Date(),
  ...overrides
})

// Integration test scenarios
export const testScenarios = {
  surgeryScheduling: {
    conflictDetection: {
      sameTimeSlot: 'İki ameliyat aynı zaman aralığında planlanamaz',
      sameDoctor: 'Aynı doktor iki farklı ameliyatta aynı anda bulunamaz',
      sameOR: 'Aynı ameliyathane aynı anda iki ameliyat için kullanılamaz'
    }
  },
  sterilizationWorkflow: {
    setTracking: 'Set hazırlamadan sterilizasyona gönderilemez',
    biologicalIndicator: 'BI negatif olmadan set serbest bırakılamaz',
    expiryControl: 'Süresi geçmiş setler kullanılamaz'
  }
}
```

---

## 📋 Test Veri Kullanım Kılavuzu

### Development Environment
```bash
# Mock veriyi development DB'ye yükle
npm run db:seed:dev

# Specific mock data kategörilerini yükle
npm run db:seed:users
npm run db:seed:hospitals
npm run db:seed:surgeries
```

### Testing Environment
```bash
# Test DB'yi temizle ve mock veri yükle
npm run test:db:reset
npm run test:db:seed

# Specific test senaryolarını çalıştır
npm run test:scenario:scheduling
npm run test:scenario:sterilization
```

### Production-like Data
```bash
# Anonymized production benzeri veri oluştur
npm run db:generate:realistic --size=large
npm run db:generate:performance-test --users=1000
```

Bu mock veri şemaları, development ve testing süreçlerinde gerçekçi senaryolar oluşturmak için kullanılabilir. Her entity gerçek hastane ortamındaki veri yapılarını yansıtacak şekilde tasarlanmıştır.