# User Interface Specification Document (UI/UX Spec)
## Atilla Ağız ve Diş Sağlığı Merkezi - Ameliyathane ve Sterilizasyon Modülleri

### Versiyon: 1.0
### Tarih: 2025-08-08

---

## 1. DESIGN SYSTEM & BRAND GUIDELINES

### 1.1 MedikaSimple Color Palette

#### Primary Colors
```css
--primary-blue: #2196F3;      /* Ana mavi */
--primary-blue-dark: #1976D2;  /* Koyu mavi */
--primary-blue-light: #E3F2FD; /* Açık mavi arka plan */

--success-green: #4CAF50;      /* Başarı yeşili */
--success-green-dark: #388E3C;  /* Koyu yeşil */

--background-gray: #F5F5F5;    /* Arka plan grisi */
--text-gray: #757575;          /* Metin grisi */
--text-dark: #424242;          /* Koyu metin */

--white: #FFFFFF;              /* Beyaz */
--accent-orange: #FF9800;      /* Uyarı/vurgu */
--error-red: #F44336;          /* Hata kırmızısı */
```

#### Semantic Colors
```css
--color-primary: var(--primary-blue);
--color-primary-hover: var(--primary-blue-dark);
--color-success: var(--success-green);
--color-warning: var(--accent-orange);
--color-error: var(--error-red);
--color-info: var(--primary-blue-light);
```

### 1.2 Typography Scale

```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 1.3 Spacing System

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## 2. COMPONENT LIBRARY

### 2.1 Base Components

#### Button Component
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

// Usage Examples:
<Button variant="primary" size="md">Ameliyat Başlat</Button>
<Button variant="success" size="sm" icon={<CheckIcon />}>Onayla</Button>
<Button variant="error" size="lg" loading>Siliniyor...</Button>
```

#### Card Component
```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

// Medical Card Variants:
<Card title="Ameliyat Detayları" shadow="md">
  <SurgeryDetails />
</Card>

<Card title="Sterilizasyon Döngüsü" actions={<CycleActions />}>
  <CycleProgress />
</Card>
```

#### Form Components
```tsx
// Input Field
interface InputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'datetime-local';
}

// Select Component
interface SelectProps {
  label: string;
  options: Array<{value: string; label: string}>;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

// Medical-specific inputs
<PatientSearchInput 
  label="Hasta Seç" 
  onPatientSelect={handlePatientSelect}
/>

<DoctorSelect 
  label="Doktor" 
  department="oral-surgery"
  required
/>

<RoomSelect 
  label="Ameliyathane" 
  availableOnly
  date={selectedDate}
/>
```

### 2.2 Medical-Specific Components

#### Surgery Status Badge
```tsx
interface StatusBadgeProps {
  status: 'scheduled' | 'preparing' | 'in_progress' | 'completed' | 'cancelled';
  showIcon?: boolean;
}

const statusConfig = {
  scheduled: { color: 'blue', icon: CalendarIcon, label: 'Planlandı' },
  preparing: { color: 'yellow', icon: ClockIcon, label: 'Hazırlanıyor' },
  in_progress: { color: 'green', icon: PlayIcon, label: 'Devam Ediyor' },
  completed: { color: 'success', icon: CheckIcon, label: 'Tamamlandı' },
  cancelled: { color: 'error', icon: XIcon, label: 'İptal Edildi' }
};
```

#### Real-time Surgery Monitor
```tsx
interface SurgeryMonitorProps {
  surgery: Surgery;
  showVitals?: boolean;
  showTimer?: boolean;
}

// Displays:
// - Patient info
// - Current status
// - Elapsed/remaining time  
// - Vital signs (if available)
// - Team members
```

#### Sterilization Cycle Tracker
```tsx
interface CycleTrackerProps {
  cycle: SterilizationCycle;
  showProgress?: boolean;
  showParameters?: boolean;
}

// Displays:
// - Cycle type and parameters
// - Progress bar with time remaining
// - Temperature/pressure readings
// - Material count
// - Operator info
```

## 3. PAGE LAYOUTS & NAVIGATION

### 3.1 Main Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    Header                           │
│  Logo | Navigation | User Menu | Notifications     │
├─────────────────────────────────────────────────────┤
│ Side │                                             │
│ bar  │              Main Content                   │
│      │                                             │
│ Nav  │                                             │
│      │                                             │
├─────────────────────────────────────────────────────┤
│                    Footer                          │
│           Status Bar | Last Updated                │
└─────────────────────────────────────────────────────┘
```

#### Header Component
- Logo (MedikaSimple branding)
- Main navigation tabs
- User profile dropdown
- Notification bell with badge
- Emergency alert banner (when active)

#### Sidebar Navigation
- Dashboard
- Ameliyathane
  - Planlama
  - Aktif Ameliyatlar
  - Geçmiş
- Sterilizasyon  
  - Döngü Yönetimi
  - Malzeme Takibi
  - Kalite Kontrolü
- Raporlar
  - SKS Raporları
  - JCI Raporları
  - Performans
- Ayarlar

### 3.2 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }  
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }

/* Mobile (< 768px): Stack navigation, condensed content */
/* Tablet (768px - 1024px): Collapsible sidebar */
/* Desktop (> 1024px): Full sidebar, multi-column layouts */
```

## 4. PAGE-SPECIFIC UI SPECIFICATIONS

### 4.1 Dashboard Page

#### Layout
```
┌─────────────────────────────────────────┐
│           Quick Stats Cards             │
├─────────┬───────────────────────────────┤
│         │                               │
│ Today's │        Surgery Timeline       │
│ Surgeries│                               │
│         │                               │
├─────────┼───────────────────────────────┤
│ Steril. │      Recent Activities        │
│ Status  │                               │
└─────────┴───────────────────────────────┘
```

#### Components
- **Quick Stats:** Active surgeries, pending sterilization, alerts
- **Surgery Timeline:** Today's surgery schedule with real-time status
- **Sterilization Dashboard:** Active cycles, queue status
- **Recent Activities:** Audit log, recent completions
- **Alert Panel:** System notifications, compliance reminders

### 4.2 Surgery Planning Page

#### Layout
```
┌─────────────────────────────────────────┐
│      Calendar View | List View           │
├─────────┬───────────────────────────────┤
│         │                               │
│ Filters │        Surgery Schedule       │
│ &       │                               │  
│ Search  │      [+ New Surgery]          │
│         │                               │
└─────────┴───────────────────────────────┘
```

#### Features
- **Calendar Integration:** Month/week/day views
- **Drag & Drop:** Reschedule surgeries easily
- **Resource Conflicts:** Highlight conflicts automatically
- **Quick Actions:** Start, edit, cancel, duplicate
- **Filtering:** By doctor, room, procedure type, status

### 4.3 Active Surgery Monitoring

#### Layout
```
┌─────────────────────────────────────────┐
│          Live Surgery Status             │
├─────────┬───────────────────────────────┤
│ Surgery │                               │
│ Cards   │        Detail Panel           │
│ (Left)  │                               │
│         │      - Patient Info           │  
│         │      - Team Members           │
│         │      - Timeline               │
│         │      - Notes                  │
└─────────┴───────────────────────────────┘
```

#### Real-time Features
- **Live Status Updates:** WebSocket-powered status changes
- **Timer Display:** Elapsed time, estimated completion
- **Team Communication:** In-app messaging
- **Emergency Alerts:** One-click emergency notifications
- **Progress Tracking:** Procedure phase tracking

### 4.4 TV Display Interface

#### Design Principles
- **High Contrast:** Easy reading from distance
- **Large Text:** Minimum 24px font size  
- **Clear Hierarchy:** Status > Patient > Time
- **Color Coding:** Consistent status colors
- **Auto-refresh:** Real-time updates without flicker

#### Layout
```
┌─────────────────────────────────────────┐
│              ATILLA A&D MERKEZI         │
├─────────────────────────────────────────┤
│                                         │
│  Ameliyathane 1    |    Dr. Mehmet Ali  │
│  ●  DEVAM EDİYOR   |    Diş İmplantı   │ 
│     15:30 - 16:45  |    ~30 dk kaldı   │
│                                         │
├─────────────────────────────────────────┤
│  Ameliyathane 2    |    Dr. Ayşe Kaya  │
│  ●  HAZIRLIK       |    Çekim İşlemi   │
│     16:00 başlıyor |    Beklemede      │
└─────────────────────────────────────────┘
```

### 4.5 Sterilization Management

#### Cycle Management View
```
┌─────────────────────────────────────────┐
│     Active Cycles           Queue        │
├─────────┬───────────────────────────────┤
│ Cycle 1 │                               │
│ Steam   │        Cycle Details          │
│ 134°C   │                               │
│ ████▒▒▒ │      - Materials: 15 items   │
│ 65%     │      - Start: 14:30          │
│         │      - Est. End: 15:45       │
│         │      - Operator: A. Yılmaz   │
└─────────┴───────────────────────────────┘
```

#### Material Tracking
- **Barcode Scanner:** Mobile-friendly scanner interface
- **Status Timeline:** Track material journey
- **Batch Processing:** Handle multiple items
- **Expiry Alerts:** Automated expiration notifications
- **Location Tracking:** Real-time location updates

## 5. INTERACTION PATTERNS

### 5.1 Form Validation
```tsx
// Real-time validation with immediate feedback
<form>
  <PatientSelect 
    error={errors.patient}
    onBlur={validatePatient}
  />
  <TimeInput
    error={errors.time}
    onChange={validateTime}
  />
  <Button 
    disabled={!isValid}
    loading={isSubmitting}
  >
    Kaydet
  </Button>
</form>
```

### 5.2 Loading States
- **Skeleton Loading:** For content-heavy sections
- **Spinner Loading:** For quick actions
- **Progress Bars:** For long operations (sterilization cycles)
- **Optimistic Updates:** Immediate UI feedback

### 5.3 Error Handling
```tsx
// Error boundaries for graceful error handling
<ErrorBoundary fallback={<ErrorPage />}>
  <SurgeryModule />
</ErrorBoundary>

// Toast notifications for user feedback
toast.error('Ameliyat planlanamadı. Oda çakışması var.');
toast.success('Sterilizasyon döngüsü başarıyla tamamlandı.');
toast.warning('Malzeme son kullanma tarihi yaklaşıyor.');
```

## 6. ACCESSIBILITY STANDARDS

### 6.1 WCAG 2.1 AA Compliance
- **Color Contrast:** Minimum 4.5:1 ratio for normal text
- **Focus Management:** Clear focus indicators
- **Keyboard Navigation:** Full keyboard accessibility
- **Screen Readers:** Proper ARIA labels and descriptions
- **Alternative Text:** Descriptive alt text for images

### 6.2 Medical Context Accessibility
- **High Stakes Actions:** Confirmation dialogs
- **Emergency Situations:** High contrast, large buttons
- **Multi-language Support:** Turkish primary, English fallback
- **Voice Announcements:** For critical status changes

## 7. MOBILE ADAPTATIONS

### 7.1 Mobile-First Components
```tsx
// Mobile-optimized surgery card
<MobileSurgeryCard>
  <StatusBadge status={surgery.status} />
  <PatientInfo patient={surgery.patient} compact />
  <TimeInfo start={surgery.start} duration={surgery.duration} />
  <ActionButtons>
    <Button size="sm">Detay</Button>
    <Button size="sm" variant="primary">Başlat</Button>
  </ActionButtons>
</MobileSurgeryCard>
```

### 7.2 Touch-Friendly Interface
- **Minimum Touch Target:** 44px x 44px
- **Gesture Support:** Swipe to navigate, pull to refresh
- **Bottom Navigation:** Easy thumb access
- **Floating Action Button:** Primary actions

## 8. PERFORMANCE & OPTIMIZATION

### 8.1 Image Optimization
```tsx
// Optimized medical images
<Image
  src="/medical-icons/surgery.svg"
  alt="Surgery icon"
  width={24}
  height={24}
  priority={false}
/>
```

### 8.2 Code Splitting
```tsx
// Route-based code splitting
const SurgeryModule = lazy(() => import('./Surgery/SurgeryModule'));
const SterilizationModule = lazy(() => import('./Sterilization/SterilizationModule'));
```

### 8.3 Data Loading Strategies
- **Progressive Loading:** Load critical data first
- **Background Sync:** Update data in background
- **Offline Support:** Cache critical functionality
- **Real-time Updates:** WebSocket for live data

## 9. TESTING CONSIDERATIONS

### 9.1 Visual Testing
- **Storybook:** Component library documentation
- **Chromatic:** Visual regression testing
- **Device Testing:** Multiple screen sizes and devices

### 9.2 User Experience Testing
- **A/B Testing:** Interface variations
- **User Flow Testing:** Critical path validation
- **Accessibility Testing:** Screen reader testing
- **Performance Testing:** Load time optimization

Bu UI/UX spezifikasyonu, sistem geliştirme sürecinde tasarım kılavuzu olarak kullanılacak ve kullanıcı deneyiminin tutarlılığını sağlayacaktır.