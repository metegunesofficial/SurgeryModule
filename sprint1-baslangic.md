# 🚀 Sprint 1 Başlangıç Kılavuzu - Hemen Başla!

## 📅 Sprint 1 Özeti (2 Hafta - 16 Ağustos - 30 Ağustos)

### 🎯 Ana Hedefler
1. **Authentication & Authorization sistemi** tamamla
2. **Database schema & models** oluştur  
3. **Basic UI foundation** hazırla
4. **Development workflow** kur

---

## 🔥 İLK GÜN (16 Ağustos) - HEMEN YAPILACAKLAR

### ⚡ 1. Development Environment Setup
```bash
# Proje kök dizininde
cd SurgeryModule/web

# Dependencies kontrol et ve eksikleri ekle
npm install --save-dev @types/node@latest
npm install --save zod@latest @auth/core@latest

# Environment dosyalarını oluştur
cp .env.example .env
# .env dosyasını düzenle (DATABASE_URL, AUTH_SECRET vs.)

# Geliştirme sunucusunu başlat
npm run dev
```

### ⚡ 2. Database Schema - Core Models
**Dosya:** `web/db/schema/core.sql`
```sql
-- Users tablosu
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    hospital_id UUID NOT NULL,
    department_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hospitals tablosu  
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    total_beds INTEGER,
    total_ors INTEGER,
    is_active BOOLEAN DEFAULT true,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Operating Rooms tablosu
CREATE TABLE operating_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    name VARCHAR(100) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    capabilities JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surgeries tablosu (temel)
CREATE TABLE surgeries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    or_id UUID NOT NULL REFERENCES operating_rooms(id),
    patient_id VARCHAR(100) NOT NULL,
    surgeon_id UUID NOT NULL REFERENCES users(id),
    procedure_name VARCHAR(255) NOT NULL,
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    status VARCHAR(50) DEFAULT 'scheduled',
    priority VARCHAR(20) DEFAULT 'routine',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ⚡ 3. Authentication Setup
**Dosya:** `web/src/auth.ts` (güncelle)
```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email)
        })

        if (!user) {
          return null
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password, 
          user.passwordHash
        )

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          hospitalId: user.hospitalId
        }
      }
    })
  ],
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
        role: token.role as string,
        hospitalId: token.hospitalId as string
      }
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.role = user.role
        token.hospitalId = user.hospitalId
      }
      return token
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  }
}
```

### ⚡ 4. RBAC System
**Dosya:** `web/src/lib/rbac.ts`
```typescript
export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  HOSPITAL_ADMIN = 'hospital_admin',
  OR_COORDINATOR = 'or_coordinator',  
  SURGEON = 'surgeon',
  OR_NURSE = 'or_nurse',
  SPD_SUPERVISOR = 'spd_supervisor',
  SPD_TECHNICIAN = 'spd_technician'
}

export enum Permission {
  // Operating Room permissions
  OR_VIEW = 'or_view',
  OR_SCHEDULE = 'or_schedule',
  OR_MODIFY = 'or_modify',
  OR_DELETE = 'or_delete',
  
  // Sterilization permissions  
  SPD_VIEW = 'spd_view',
  SPD_PROCESS = 'spd_process',
  SPD_RELEASE = 'spd_release',
  
  // Admin permissions
  USER_MANAGE = 'user_manage',
  HOSPITAL_MANAGE = 'hospital_manage',
  SYSTEM_CONFIG = 'system_config'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SYSTEM_ADMIN]: Object.values(Permission),
  [UserRole.HOSPITAL_ADMIN]: [
    Permission.OR_VIEW, Permission.OR_SCHEDULE, Permission.OR_MODIFY,
    Permission.SPD_VIEW, Permission.SPD_PROCESS,
    Permission.USER_MANAGE, Permission.HOSPITAL_MANAGE
  ],
  [UserRole.OR_COORDINATOR]: [
    Permission.OR_VIEW, Permission.OR_SCHEDULE, Permission.OR_MODIFY
  ],
  [UserRole.SURGEON]: [
    Permission.OR_VIEW, Permission.OR_SCHEDULE
  ],
  [UserRole.OR_NURSE]: [
    Permission.OR_VIEW
  ],
  [UserRole.SPD_SUPERVISOR]: [
    Permission.SPD_VIEW, Permission.SPD_PROCESS, Permission.SPD_RELEASE
  ],
  [UserRole.SPD_TECHNICIAN]: [
    Permission.SPD_VIEW, Permission.SPD_PROCESS
  ]
}

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

// React hook
export function usePermissions(requiredPermission: Permission) {
  const { data: session } = useSession()
  
  return {
    hasPermission: session?.user?.role 
      ? hasPermission(session.user.role as UserRole, requiredPermission)
      : false,
    isLoading: !session
  }
}
```

---

## 🎨 5. UI FOUNDATION

### Layout Component
**Dosya:** `web/src/components/Layout.tsx`
```tsx
import { Box, Flex, VStack, HStack, Text, Button } from '@chakra-ui/react'
import { useSession, signOut } from 'next-auth/react'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'

export function Layout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box w="240px" bg="gray.50" borderRight="1px" borderColor="gray.200">
        <VStack spacing={0} align="stretch">
          <Box p={4} borderBottom="1px" borderColor="gray.200">
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              Surgery Module
            </Text>
            <Text fontSize="sm" color="gray.600">
              {session.user?.hospitalId} // TODO: Hospital name
            </Text>
          </Box>
          
          <Navigation />
        </VStack>
      </Box>

      {/* Main content */}
      <Flex flex={1} direction="column">
        {/* Header */}
        <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={3}>
          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold">
              Dashboard // TODO: Dynamic title
            </Text>
            
            <UserMenu user={session.user} />
          </Flex>
        </Box>

        {/* Page content */}
        <Box flex={1} overflow="auto" p={6}>
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
```

### Navigation Component
**Dosya:** `web/src/components/Navigation.tsx`
```tsx
import { VStack, Link, Icon, HStack, Text } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { 
  Calendar, 
  Activity, 
  Pill, 
  Shield, 
  Settings,
  Users
} from 'lucide-react'
import { usePermissions, Permission } from '@/lib/rbac'

const navigationItems = [
  { 
    label: 'Ameliyat Planlama', 
    href: '/ameliyat-planlama', 
    icon: Calendar,
    permission: Permission.OR_VIEW 
  },
  { 
    label: 'Sterilizasyon', 
    href: '/sterilizasyon', 
    icon: Activity,
    permission: Permission.SPD_VIEW
  },
  { 
    label: 'Eczane', 
    href: '/eczane', 
    icon: Pill,
    permission: Permission.OR_VIEW // TODO: pharmacy permission
  },
  { 
    label: 'Kalite Uyum', 
    href: '/uyum', 
    icon: Shield,
    permission: Permission.OR_VIEW
  },
  { 
    label: 'Personel', 
    href: '/personel', 
    icon: Users,
    permission: Permission.USER_MANAGE
  },
  { 
    label: 'Ayarlar', 
    href: '/ayarlar', 
    icon: Settings,
    permission: Permission.HOSPITAL_MANAGE
  }
]

export function Navigation() {
  const location = useLocation()

  return (
    <VStack spacing={1} align="stretch" p={2}>
      {navigationItems.map((item) => {
        const { hasPermission } = usePermissions(item.permission)
        
        if (!hasPermission) return null

        const isActive = location.pathname === item.href

        return (
          <Link
            key={item.href}
            as={RouterLink}
            to={item.href}
            _hover={{ textDecoration: 'none' }}
          >
            <HStack
              spacing={3}
              px={3}
              py={2}
              rounded="md"
              bg={isActive ? 'blue.50' : 'transparent'}
              color={isActive ? 'blue.600' : 'gray.700'}
              _hover={{
                bg: isActive ? 'blue.50' : 'gray.100'
              }}
            >
              <Icon as={item.icon} boxSize={5} />
              <Text fontSize="sm" fontWeight="medium">
                {item.label}
              </Text>
            </HStack>
          </Link>
        )
      })}
    </VStack>
  )
}
```

---

## 🧪 6. BASIC TESTING SETUP

### Test Utils Setup
**Dosya:** `web/src/test-utils/index.tsx`
```tsx
import { render } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@hospital.com',
    name: 'Test User',
    role: 'or_coordinator',
    hospitalId: 'test-hospital'
  },
  expires: '2025-12-31'
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <SessionProvider session={mockSession}>
      <ChakraProvider>
        {ui}
      </ChakraProvider>
    </SessionProvider>
  )
}

export * from '@testing-library/react'
export { renderWithProviders as render }
```

### İlk Test
**Dosya:** `web/src/components/__tests__/Layout.test.tsx`
```tsx
import { render, screen } from '@/test-utils'
import { Layout } from '../Layout'

describe('Layout', () => {
  it('renders navigation items correctly', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )

    expect(screen.getByText('Surgery Module')).toBeInTheDocument()
    expect(screen.getByText('Ameliyat Planlama')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('shows user menu', () => {
    render(
      <Layout>
        <div>Test content</div>
      </Layout>
    )

    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
```

---

## 📋 7. İLK HAFTA KONTROL LİSTESİ

### Pazartesi (19 Ağustos)
- [ ] Database migrations çalıştır
- [ ] Authentication test et (login/logout)
- [ ] RBAC permissions test et
- [ ] Layout ve navigation test et

### Salı (20 Ağustos)  
- [ ] Mock data script yazılması
- [ ] API endpoints (CRUD operations)
- [ ] Basic error handling
- [ ] Loading states

### Çarşamba (21 Ağustos)
- [ ] Form components (surgery creation)
- [ ] Calendar component foundation
- [ ] State management setup (Zustand)

### Perşembe (22 Ağustos)
- [ ] Integration testing
- [ ] E2E testing setup (Playwright)
- [ ] CI/CD pipeline test

### Cuma (23 Ağustos)
- [ ] Code review ve cleanup
- [ ] Documentation update
- [ ] Sprint 1 demo hazırlık

---

## 🚀 HOW TO START RIGHT NOW

### Terminal komutları (sırayla çalıştır):
```bash
# 1. Proje dizinine git
cd SurgeryModule/web

# 2. Dependencies kontrol
npm install

# 3. Database setup (Supabase/local)
npm run db:setup
npm run db:migrate

# 4. Environment variables
cp .env.example .env
# .env dosyasını düzenle!

# 5. Development server başlat
npm run dev

# 6. Yeni terminal açıp test çalıştır
npm run test

# 7. TypeScript check
npm run typecheck
```

### İlk commit:
```bash
git add .
git commit -m "feat(sprint1): setup auth, RBAC, basic UI foundation

- Add NextAuth.js with credentials provider
- Implement RBAC system with role-based permissions  
- Create Layout and Navigation components
- Setup testing utilities
- Add database schema for core entities"

git push origin main
```

**ŞİMDİ BAŞLA! İlk adımları tamamladıktan sonra sıradaki task'lara geç. Her gün küçük increment'ler yaparak ilerle.**