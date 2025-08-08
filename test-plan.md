# Test Plan Document
## Atilla Ağız ve Diş Sağlığı Merkezi - Ameliyathane ve Sterilizasyon Modülleri

### Versiyon: 1.0
### Tarih: 2025-08-08

---

## 1. TEST STRATEGY OVERVIEW

### 1.1 Test Objectives
- **Functional Testing:** Tüm fonksiyonların gereksinimler doğrultusunda çalışması
- **Integration Testing:** MedikaSimple CRM ve üçüncü parti entegrasyonların doğruluğu
- **Performance Testing:** Sistem performansının kabul edilebilir seviyede olması
- **Security Testing:** Hasta verilerinin güvenliği ve KVKV uyumluluğu
- **Usability Testing:** Kullanıcı dostu arayüz ve iş akışları
- **Compliance Testing:** SKS ve JCI standartlarına uyumluluk

### 1.2 Test Scope

#### Dahil Edilen Fonksiyonlar
- Ameliyathane yönetimi (planlama, izleme, raporlama)
- Sterilizasyon süreç yönetimi
- TV ekran entegrasyonu
- Kullanıcı kimlik doğrulama ve yetkilendirme
- Raporlama ve audit trail
- MedikaSimple CRM entegrasyonu

#### Dahil Edilmeyen Fonksiyonlar
- Üçüncü parti cihaz entegrasyonları (gelecek faz)
- Mobil uygulama (bu sürümde yok)
- Advanced AI özellikler (gelecek sürüm)

### 1.3 Test Approach

#### Test Pyramid Structure
```
        /\
       /  \
      / E2E \ (10%)
     /______\
    /        \
   /Integration\ (30%)
  /_____________\
 /               \
/     Unit Tests  \ (60%)
\________________/
```

## 2. UNIT TESTING PLAN

### 2.1 Frontend Unit Tests (React/Next.js)

#### Testing Framework
- **Framework:** Jest + React Testing Library
- **Coverage Target:** 85%+
- **Mock Strategy:** MSW (Mock Service Worker)

#### Component Testing Examples

```typescript
// Button Component Tests
describe('Button Component', () => {
  test('renders with correct variant styles', () => {
    render(<Button variant="primary">Test Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  test('handles loading state correctly', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

// Surgery Schedule Component Tests  
describe('SurgerySchedule Component', () => {
  test('displays surgery list correctly', async () => {
    const mockSurgeries = [
      { id: '1', patientName: 'Ali Veli', time: '10:00' },
      { id: '2', patientName: 'Ayşe Fatma', time: '14:00' }
    ];

    render(<SurgerySchedule surgeries={mockSurgeries} />);
    
    await waitFor(() => {
      expect(screen.getByText('Ali Veli')).toBeInTheDocument();
      expect(screen.getByText('Ayşe Fatma')).toBeInTheDocument();
    });
  });

  test('handles empty surgery list', () => {
    render(<SurgerySchedule surgeries={[]} />);
    expect(screen.getByText('Bugün ameliyat planlanmamış')).toBeInTheDocument();
  });
});

// Form Validation Tests
describe('SurgeryForm Validation', () => {
  test('validates required fields', async () => {
    render(<SurgeryForm onSubmit={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /kaydet/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Hasta seçimi zorunludur')).toBeInTheDocument();
      expect(screen.getByText('Doktor seçimi zorunludur')).toBeInTheDocument();
    });
  });

  test('validates time conflicts', async () => {
    const mockProps = {
      existingSurgeries: [{ roomId: '1', start: '10:00', end: '11:00' }]
    };

    render(<SurgeryForm {...mockProps} onSubmit={jest.fn()} />);
    
    // Try to schedule conflicting time
    fireEvent.change(screen.getByLabelText(/ameliyathane/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/başlangıç saati/i), { target: { value: '10:30' } });

    await waitFor(() => {
      expect(screen.getByText('Bu saatte oda dolu')).toBeInTheDocument();
    });
  });
});
```

### 2.2 Backend Unit Tests (Node.js)

#### Testing Framework
- **Framework:** Jest + Supertest
- **Database:** In-memory SQLite for tests
- **Coverage Target:** 90%+

```typescript
// Service Layer Tests
describe('SurgeryService', () => {
  test('creates surgery with valid data', async () => {
    const surgeryData = {
      patientId: 'patient-1',
      surgeonId: 'surgeon-1',
      roomId: 'room-1',
      scheduledStart: new Date('2025-01-15T10:00:00Z'),
      estimatedDuration: 60
    };

    const result = await SurgeryService.create(surgeryData);
    
    expect(result.id).toBeDefined();
    expect(result.status).toBe('scheduled');
  });

  test('throws error for room conflicts', async () => {
    // Create existing surgery
    await SurgeryService.create({
      patientId: 'patient-1',
      roomId: 'room-1',
      scheduledStart: new Date('2025-01-15T10:00:00Z'),
      estimatedDuration: 60
    });

    // Try to create conflicting surgery
    const conflictingData = {
      patientId: 'patient-2',
      roomId: 'room-1',
      scheduledStart: new Date('2025-01-15T10:30:00Z'),
      estimatedDuration: 60
    };

    await expect(SurgeryService.create(conflictingData))
      .rejects.toThrow('Room is not available at this time');
  });
});

// API Route Tests
describe('POST /api/surgeries', () => {
  test('creates surgery successfully', async () => {
    const surgeryData = {
      patientId: 'patient-1',
      surgeonId: 'surgeon-1',
      roomId: 'room-1',
      scheduledStart: '2025-01-15T10:00:00Z',
      estimatedDuration: 60
    };

    const response = await request(app)
      .post('/api/surgeries')
      .send(surgeryData)
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.status).toBe('scheduled');
  });

  test('returns validation error for invalid data', async () => {
    const invalidData = {
      patientId: '', // Empty patient ID
      surgeonId: 'surgeon-1'
    };

    const response = await request(app)
      .post('/api/surgeries')
      .send(invalidData)
      .expect(400);

    expect(response.body.error).toContain('patientId is required');
  });

  test('requires authentication', async () => {
    const surgeryData = { patientId: 'patient-1' };

    await request(app)
      .post('/api/surgeries')
      .send(surgeryData)
      .expect(401);
  });
});

// Sterilization Service Tests
describe('SterilizationService', () => {
  test('starts sterilization cycle', async () => {
    const cycleData = {
      sterilizerId: 'sterilizer-1',
      type: 'steam',
      temperature: 134,
      pressure: 2.1,
      duration: 15,
      materials: ['material-1', 'material-2']
    };

    const cycle = await SterilizationService.startCycle(cycleData);
    
    expect(cycle.status).toBe('running');
    expect(cycle.startTime).toBeDefined();
  });

  test('validates sterilization parameters', async () => {
    const invalidData = {
      sterilizerId: 'sterilizer-1',
      type: 'steam',
      temperature: 100, // Too low for steam sterilization
      pressure: 2.1,
      duration: 15
    };

    await expect(SterilizationService.startCycle(invalidData))
      .rejects.toThrow('Temperature too low for steam sterilization');
  });
});
```

## 3. INTEGRATION TESTING PLAN

### 3.1 API Integration Tests

#### MedikaSimple CRM Integration
```typescript
describe('MedikaSimple Integration', () => {
  test('fetches patient data successfully', async () => {
    const patientId = 'patient-123';
    
    // Mock MedikaSimple API response
    nock('https://api.medicasimple.com')
      .get(`/patients/${patientId}`)
      .reply(200, {
        id: patientId,
        name: 'Ali Veli',
        phone: '05551234567'
      });

    const patient = await MedikaSimpleClient.getPatient(patientId);
    
    expect(patient.name).toBe('Ali Veli');
    expect(patient.phone).toBe('05551234567');
  });

  test('handles API errors gracefully', async () => {
    const patientId = 'non-existent-patient';
    
    nock('https://api.medicasimple.com')
      .get(`/patients/${patientId}`)
      .reply(404, { error: 'Patient not found' });

    await expect(MedikaSimpleClient.getPatient(patientId))
      .rejects.toThrow('Patient not found');
  });

  test('syncs surgery data with CRM', async () => {
    const surgeryData = {
      patientId: 'patient-123',
      procedure: 'Diş İmplantı',
      date: '2025-01-15T10:00:00Z'
    };

    nock('https://api.medicasimple.com')
      .post('/treatments')
      .reply(201, { id: 'treatment-456' });

    const result = await MedikaSimpleClient.createTreatment(surgeryData);
    
    expect(result.id).toBe('treatment-456');
  });
});
```

#### Database Integration Tests
```typescript
describe('Database Operations', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    await cleanupTestDatabase();
  });

  test('complex surgery query with joins', async () => {
    const todaysSurgeries = await db.query(`
      SELECT s.*, p.name as patient_name, u.full_name as surgeon_name, r.name as room_name
      FROM surgeries s
      JOIN patients p ON s.patient_id = p.id
      JOIN users u ON s.surgeon_id = u.id
      JOIN operating_rooms r ON s.room_id = r.id
      WHERE DATE(s.scheduled_start) = CURRENT_DATE
      ORDER BY s.scheduled_start
    `);

    expect(todaysSurgeries.length).toBeGreaterThan(0);
    expect(todaysSurgeries[0]).toHaveProperty('patient_name');
  });

  test('sterilization material tracking', async () => {
    const materialId = await createTestMaterial();
    const cycleId = await createTestCycle();

    await MaterialTrackingService.addToCycle(materialId, cycleId);
    
    const tracking = await MaterialTrackingService.getHistory(materialId);
    
    expect(tracking.length).toBe(1);
    expect(tracking[0].status).toBe('sterilizing');
  });
});
```

### 3.2 WebSocket Integration Tests

```typescript
describe('WebSocket Communication', () => {
  let client: WebSocket;

  beforeEach(() => {
    client = new WebSocket('ws://localhost:3000/api/websocket');
  });

  afterEach(() => {
    client.close();
  });

  test('receives surgery status updates', (done) => {
    client.on('message', (data) => {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'surgery-status-update') {
        expect(message.surgeryId).toBe('surgery-123');
        expect(message.status).toBe('in_progress');
        done();
      }
    });

    // Trigger status update
    SurgeryService.updateStatus('surgery-123', 'in_progress');
  });

  test('TV display receives live updates', (done) => {
    const displayClient = new WebSocket('ws://localhost:3000/api/display/live');
    
    displayClient.on('message', (data) => {
      const update = JSON.parse(data.toString());
      
      expect(update.type).toBe('display-update');
      expect(update.surgeries).toBeInstanceOf(Array);
      done();
    });

    // Trigger display update
    DisplayService.broadcastUpdate();
  });
});
```

## 4. END-TO-END TESTING PLAN

### 4.1 E2E Testing Framework
- **Tool:** Playwright
- **Browsers:** Chrome, Firefox, Safari
- **Devices:** Desktop, Tablet, Mobile

### 4.2 Critical User Journeys

#### Surgery Management Flow
```typescript
test('Complete surgery workflow', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'doctor@test.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // Navigate to surgery planning
  await page.click('[data-testid="nav-surgeries"]');
  await page.click('[data-testid="new-surgery-button"]');

  // Fill surgery form
  await page.click('[data-testid="patient-select"]');
  await page.type('[data-testid="patient-search"]', 'Ali Veli');
  await page.click('[data-testid="patient-option-1"]');

  await page.selectOption('[data-testid="surgeon-select"]', 'surgeon-1');
  await page.selectOption('[data-testid="room-select"]', 'room-1');
  await page.fill('[data-testid="start-time"]', '2025-01-15T10:00');
  await page.fill('[data-testid="duration"]', '60');

  // Submit form
  await page.click('[data-testid="save-surgery"]');

  // Verify creation
  await expect(page.locator('[data-testid="success-message"]'))
    .toContainText('Ameliyat başarıyla planlandı');

  // Start surgery
  await page.click('[data-testid="surgery-card-1"] [data-testid="start-button"]');
  
  // Confirm start
  await page.click('[data-testid="confirm-start"]');

  // Verify status update
  await expect(page.locator('[data-testid="surgery-status"]'))
    .toContainText('DEVAM EDİYOR');
});
```

#### Sterilization Workflow
```typescript
test('Sterilization cycle management', async ({ page }) => {
  await loginAsUser(page, 'technician@test.com');

  // Navigate to sterilization
  await page.click('[data-testid="nav-sterilization"]');

  // Start new cycle
  await page.click('[data-testid="new-cycle-button"]');
  await page.selectOption('[data-testid="sterilizer-select"]', 'sterilizer-1');
  await page.selectOption('[data-testid="cycle-type"]', 'steam');
  
  // Add materials
  await page.click('[data-testid="add-materials"]');
  await page.click('[data-testid="material-checkbox-1"]');
  await page.click('[data-testid="material-checkbox-2"]');
  await page.click('[data-testid="confirm-materials"]');

  // Start cycle
  await page.click('[data-testid="start-cycle"]');

  // Verify cycle started
  await expect(page.locator('[data-testid="cycle-status"]'))
    .toContainText('ÇALIŞIYOR');

  // Monitor progress
  const progressBar = page.locator('[data-testid="cycle-progress"]');
  await expect(progressBar).toBeVisible();

  // Complete cycle (simulate)
  await page.click('[data-testid="simulate-complete"]');

  // Verify completion
  await expect(page.locator('[data-testid="cycle-status"]'))
    .toContainText('TAMAMLANDI');
});
```

#### TV Display Integration
```typescript
test('TV display shows real-time updates', async ({ page, context }) => {
  // Open main app in one tab
  const mainPage = await context.newPage();
  await loginAsUser(mainPage, 'doctor@test.com');

  // Open TV display in another tab
  await page.goto('/display');

  // Start a surgery in main app
  await mainPage.goto('/surgeries');
  await mainPage.click('[data-testid="surgery-card-1"] [data-testid="start-button"]');
  await mainPage.click('[data-testid="confirm-start"]');

  // Verify TV display updates
  await expect(page.locator('[data-testid="surgery-1-status"]'))
    .toContainText('DEVAM EDİYOR', { timeout: 5000 });

  // Verify estimated time is shown
  await expect(page.locator('[data-testid="surgery-1-remaining"]'))
    .toBeVisible();
});
```

## 5. PERFORMANCE TESTING PLAN

### 5.1 Load Testing Scenarios

#### Concurrent Users
```javascript
// K6 Load Test Script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 },  // Ramp up
    { duration: '5m', target: 50 },  // Stay at 50 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
};

export default function () {
  // Login
  let loginResponse = http.post('http://localhost:3000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  check(loginResponse, {
    'login successful': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  let authToken = loginResponse.json('token');

  // Get surgeries list
  let surgeriesResponse = http.get('http://localhost:3000/api/surgeries', {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  check(surgeriesResponse, {
    'surgeries loaded': (r) => r.status === 200,
    'surgeries response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
```

#### Database Performance
```sql
-- Performance test queries
EXPLAIN ANALYZE 
SELECT s.*, p.name as patient_name, u.full_name as surgeon_name
FROM surgeries s
JOIN patients p ON s.patient_id = p.id  
JOIN users u ON s.surgeon_id = u.id
WHERE DATE(s.scheduled_start) = CURRENT_DATE;

-- Expected: < 100ms execution time

EXPLAIN ANALYZE
SELECT * FROM material_tracking mt
JOIN materials m ON mt.material_id = m.id
WHERE mt.status = 'sterilizing'
ORDER BY mt.created_at DESC;

-- Expected: < 50ms execution time
```

### 5.2 Performance Benchmarks

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Page Load Time | < 3s | < 5s |
| API Response Time | < 500ms | < 1s |
| Database Query Time | < 100ms | < 500ms |
| WebSocket Latency | < 100ms | < 250ms |
| Memory Usage | < 512MB | < 1GB |
| CPU Usage | < 70% | < 90% |

## 6. SECURITY TESTING PLAN

### 6.1 Authentication & Authorization Tests

```typescript
describe('Security Tests', () => {
  test('prevents unauthorized access', async () => {
    const response = await request(app)
      .get('/api/surgeries')
      .expect(401);

    expect(response.body.error).toBe('Authentication required');
  });

  test('enforces role-based access', async () => {
    const nurseToken = await getTokenForRole('nurse');
    
    // Nurse should not be able to delete surgeries
    const response = await request(app)
      .delete('/api/surgeries/123')
      .set('Authorization', `Bearer ${nurseToken}`)
      .expect(403);

    expect(response.body.error).toContain('Insufficient permissions');
  });

  test('validates JWT tokens', async () => {
    const invalidToken = 'invalid.jwt.token';
    
    const response = await request(app)
      .get('/api/surgeries')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);

    expect(response.body.error).toBe('Invalid token');
  });
});
```

### 6.2 Data Security Tests

```typescript
describe('Data Security', () => {
  test('encrypts sensitive patient data', async () => {
    const patientData = {
      name: 'Gizli Hasta',
      tcNo: '12345678901',
      phone: '05551234567'
    };

    const encrypted = SecurityService.encryptSensitiveData(patientData);
    expect(encrypted).not.toContain(patientData.tcNo);
    
    const decrypted = SecurityService.decryptSensitiveData(encrypted);
    expect(decrypted.tcNo).toBe(patientData.tcNo);
  });

  test('logs all data access attempts', async () => {
    const userId = 'user-123';
    await request(app)
      .get('/api/patients/patient-456')
      .set('Authorization', `Bearer ${await getToken(userId)}`);

    const auditLogs = await AuditService.getLogs({
      userId,
      resource: 'patients',
      action: 'read'
    });

    expect(auditLogs.length).toBeGreaterThan(0);
  });
});
```

### 6.3 SQL Injection Tests

```typescript
test('prevents SQL injection attacks', async () => {
  const maliciousInput = "'; DROP TABLE surgeries; --";
  
  const response = await request(app)
    .get(`/api/surgeries/search?q=${encodeURIComponent(maliciousInput)}`)
    .set('Authorization', `Bearer ${validToken}`)
    .expect(400);

  // Verify table still exists
  const tableCheck = await db.query("SELECT COUNT(*) FROM surgeries");
  expect(tableCheck.rows.length).toBeGreaterThan(0);
});
```

## 7. COMPLIANCE TESTING PLAN

### 7.1 SKS Standards Testing

```typescript
describe('SKS Compliance Tests', () => {
  test('SAH01: Surgery process definitions exist', async () => {
    const processes = await db.query(`
      SELECT * FROM process_definitions 
      WHERE category = 'surgery'
    `);
    
    expect(processes.rows.length).toBeGreaterThan(0);
  });

  test('SAH07: Surgery safety checks are enforced', async () => {
    const surgeryData = {
      patientId: 'patient-1',
      surgeonId: 'surgeon-1',
      roomId: 'room-1'
      // Missing safety checklist
    };

    await expect(SurgeryService.start(surgeryData))
      .rejects.toThrow('Safety checklist must be completed');
  });

  test('SDS08: Material tracking is comprehensive', async () => {
    const materialId = 'material-123';
    const tracking = await MaterialTrackingService.getFullHistory(materialId);
    
    expect(tracking).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: 'dirty' }),
        expect.objectContaining({ status: 'cleaning' }),
        expect.objectContaining({ status: 'sterilizing' }),
        expect.objectContaining({ status: 'sterile' })
      ])
    );
  });
});
```

### 7.2 JCI Standards Testing

```typescript
describe('JCI Compliance Tests', () => {
  test('Patient identification requirements', async () => {
    const surgery = await SurgeryService.getById('surgery-123');
    
    // Must have at least 2 patient identifiers
    expect(surgery.patient.identifiers.length).toBeGreaterThanOrEqual(2);
    expect(surgery.patient.identifiers).toContain('tcNo');
    expect(surgery.patient.identifiers).toContain('birthDate');
  });

  test('Surgical site marking documentation', async () => {
    const surgicalSite = await SurgicalSiteService.getMarking('surgery-123');
    
    expect(surgicalSite.markedBy).toBeDefined();
    expect(surgicalSite.verifiedBy).toBeDefined();
    expect(surgicalSite.timestamp).toBeDefined();
  });

  test('Time-out procedure documentation', async () => {
    const timeout = await TimeoutService.getRecord('surgery-123');
    
    expect(timeout.patientVerification).toBe(true);
    expect(timeout.procedureVerification).toBe(true);
    expect(timeout.siteVerification).toBe(true);
    expect(timeout.allTeamMembersPresent).toBe(true);
  });
});
```

## 8. USABILITY TESTING PLAN

### 8.1 User Acceptance Testing Scenarios

#### Scenario 1: New User Onboarding
```
User Type: Yeni hemşire
Goal: İlk kez sistemi kullanarak ameliyat hazırlığı yapmak

Steps:
1. Sisteme giriş yapın
2. Bugünkü ameliyat listesini görüntüleyin
3. İlk ameliyat için hazırlık checklist'ini açın
4. Checklist'teki tüm maddeleri tamamlayın
5. Ameliyatın başlamaya hazır olduğunu işaretleyin

Success Criteria:
- 10 dakika içinde tamamlanabilir
- Yardım almadan gerçekleştirilebilir
- Hiçbir adımda kullanıcı kafası karışmaz
```

#### Scenario 2: Emergency Situation
```
User Type: Doktor
Goal: Acil durumda ameliyat planı değiştirmek

Steps:
1. Planlanmış ameliyatı iptal edin
2. Acil ameliyat için yeni plan oluşturun
3. Gerekli personeli bilgilendirin
4. Ameliyathane hazırlığını başlatın

Success Criteria:
- 2 dakika içinde gerçekleştirilebilir
- Kritik bilgiler net görülür
- Onay adımları minimal
```

### 8.2 A/B Testing Plans

#### Test 1: Surgery Card Layout
- **Variant A:** Kompakt kart görünümü
- **Variant B:** Detaylı liste görünümü
- **Metric:** Görev tamamlama süresi
- **Duration:** 2 hafta

#### Test 2: Navigation Structure
- **Variant A:** Sol sidebar navigasyon
- **Variant B:** Üst tab navigasyon
- **Metric:** Sayfa geçiş sayısı
- **Duration:** 1 hafta

## 9. MOBILE TESTING PLAN

### 9.1 Device Testing Matrix

| Device Type | Screen Size | OS | Browser |
|-------------|-------------|-------|---------|
| iPhone 12 | 390x844 | iOS 15+ | Safari |
| Samsung Galaxy S21 | 384x854 | Android 11+ | Chrome |
| iPad Air | 820x1180 | iPadOS 15+ | Safari |
| Generic Tablet | 768x1024 | Android 11+ | Chrome |

### 9.2 Mobile-Specific Test Cases

```typescript
test('mobile navigation works correctly', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  // Test hamburger menu
  await page.click('[data-testid="mobile-menu-toggle"]');
  await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();

  // Test navigation items
  await page.click('[data-testid="mobile-nav-surgeries"]');
  await expect(page).toHaveURL('/surgeries');
});

test('touch interactions work properly', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/surgeries');

  // Test swipe gesture
  const surgeryCard = page.locator('[data-testid="surgery-card-1"]');
  await surgeryCard.swipe('left');
  
  // Verify action menu appears
  await expect(page.locator('[data-testid="card-actions"]')).toBeVisible();
});
```

## 10. ACCESSIBILITY TESTING PLAN

### 10.1 Automated Accessibility Tests

```typescript
test('meets WCAG 2.1 AA standards', async ({ page }) => {
  await page.goto('/surgeries');
  
  const results = await page.accessibility.snapshot();
  
  // Check for missing alt text
  const images = results.children.filter(node => node.role === 'img');
  images.forEach(img => {
    expect(img.name).toBeDefined();
  });

  // Check color contrast
  await expect(page.locator('body')).toHaveScreenshot();
  
  // Use axe-core for automated testing
  const violations = await page.axe();
  expect(violations).toHaveLength(0);
});
```

### 10.2 Screen Reader Testing

```typescript
test('works with screen readers', async ({ page }) => {
  // Enable screen reader simulation
  await page.addInitScript(() => {
    window.speechSynthesis = {
      speak: (utterance) => {
        console.log('Screen reader:', utterance.text);
      }
    };
  });

  await page.goto('/surgeries');
  
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // Verify proper ARIA labels
  const button = page.locator('[data-testid="start-surgery-button"]');
  await expect(button).toHaveAttribute('aria-label', 'Ameliyatı başlat');
});
```

## 11. BROWSER COMPATIBILITY TESTING

### 11.1 Supported Browsers

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | Full |
| Firefox | 88+ | Full |
| Safari | 14+ | Full |
| Edge | 90+ | Full |
| Opera | 76+ | Limited |

### 11.2 Cross-browser Test Cases

```typescript
test.describe('Cross-browser compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`works on ${browserName}`, async ({ page }) => {
      await page.goto('/');
      
      // Test core functionality
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      
      await page.fill('[data-testid="email"]', 'test@example.com');
      await page.fill('[data-testid="password"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      await expect(page).toHaveURL('/dashboard');
    });
  });
});
```

## 12. TEST EXECUTION PLAN

### 12.1 Test Phases

#### Phase 1: Unit & Integration Tests (Week 1-2)
- Backend API tests
- Frontend component tests  
- Database integration tests
- MedikaSimple integration tests

#### Phase 2: System Testing (Week 3)
- End-to-end functionality tests
- Performance testing
- Security testing
- Browser compatibility tests

#### Phase 3: User Acceptance Testing (Week 4)
- Internal stakeholder testing
- Medical staff user testing
- Usability testing sessions
- Compliance verification

#### Phase 4: Production Testing (Week 5)
- Smoke tests on production
- Performance monitoring
- Security verification
- Compliance audit

### 12.2 Test Environment Setup

```yaml
# Test Environment Configuration
test-environments:
  unit:
    database: sqlite-memory
    external-apis: mocked
    
  integration:  
    database: postgresql-test
    external-apis: staging
    
  e2e:
    database: postgresql-test
    external-apis: staging
    browser: headless-chrome
    
  staging:
    database: postgresql-staging
    external-apis: production
    monitoring: enabled
    
  production:
    database: postgresql-production
    external-apis: production
    monitoring: full
    alerting: enabled
```

## 13. DEFECT MANAGEMENT

### 13.1 Defect Classification

| Severity | Criteria | Resolution Time |
|----------|----------|-----------------|
| Critical | System crash, data loss, security vulnerability | 24 hours |
| High | Feature not working, incorrect calculations | 3 days |
| Medium | Minor functionality issues, UI problems | 1 week |
| Low | Cosmetic issues, enhancement requests | 2 weeks |

### 13.2 Test Reporting

#### Daily Test Report Template
```
Tarih: [DATE]
Test Edildi:
- Unit Tests: [PASSED/TOTAL] 
- Integration Tests: [PASSED/TOTAL]
- E2E Tests: [PASSED/TOTAL]

Yeni Defectler: [COUNT]
- Critical: [COUNT]
- High: [COUNT]  
- Medium: [COUNT]
- Low: [COUNT]

Çözülen Defectler: [COUNT]
Test Coverage: [PERCENTAGE]%

Riskler:
- [Risk description and mitigation]

Sonraki Adımlar:
- [Next steps]
```

## 14. AUTOMATION STRATEGY

### 14.1 CI/CD Pipeline Integration

```yaml
# GitHub Actions Test Pipeline
name: Test Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage
      
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
```

### 14.2 Test Data Management

```typescript
// Test data factory
class TestDataFactory {
  static createSurgery(overrides?: Partial<Surgery>): Surgery {
    return {
      id: faker.string.uuid(),
      patientId: faker.string.uuid(),
      surgeonId: faker.string.uuid(),
      roomId: faker.string.uuid(),
      scheduledStart: faker.date.future(),
      estimatedDuration: faker.number.int({ min: 30, max: 180 }),
      status: 'scheduled',
      ...overrides
    };
  }

  static createPatient(overrides?: Partial<Patient>): Patient {
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      tcNo: faker.string.numeric(11),
      birthDate: faker.date.birthdate(),
      ...overrides
    };
  }
}
```

Bu kapsamlı test planı, sistemin kaliteli ve güvenilir bir şekilde geliştirilmesini sağlayacak ve tüm paydaşların beklentilerini karşılayacaktır.