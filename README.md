# SurgeryModule - Hastane Yönetim Sistemi

## 📋 Proje Genel Bakış

SurgeryModule, hastane ve ameliyathane yönetimi için geliştirilmiş kapsamlı bir web uygulamasıdır. Ameliyat planlama, sterilizasyon, personel yönetimi ve uyumluluk takibi gibi kritik modülleri içerir.

## 🚀 Özellikler

- **Çoklu-Tenant Mimarisi**: Her hastane için ayrı tenant desteği
- **RBAC (Rol Tabanlı Erişim Kontrolü)**: Güvenli ve esnek yetki yönetimi
- **Ameliyat Planlama**: Detaylı cerrahi planlama ve zamanlama
- **Sterilizasyon Yönetimi**: Ameliyathane sterilizasyon süreçleri
- **Uyumluluk Takibi**: SKS/JCI standartlarına uygunluk
- **Gerçek Zamanlı İzleme**: Canlı ameliyathane durumu
- **Personel Yönetimi**: Eğitim ve yetkinlik matrisi
- **Bildirim Sistemi**: Akıllı uyarı ve hatırlatma sistemi

## 🏗️ Teknoloji Stack'i

### Frontend
- **Framework**: React 18+ with React Router 7
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Management**: React Hook Form + Zod
- **UI Components**: Chakra UI, Radix UI

### Backend
- **Runtime**: Node.js (Vercel Serverless)
- **Database**: PostgreSQL (Neon/Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js

### Development Tools
- **Build Tool**: Vite
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Linting**: ESLint + Prettier
- **Deployment**: Vercel

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 20+
- PostgreSQL database
- Git

### Yerel Kurulum

```bash
# Projeyi klonlayın
git clone <repository-url>
cd SurgeryModule

# Bağımlılıkları yükleyin
cd web
npm ci

# Ortam değişkenlerini ayarlayın
cp .env.example .env.local

# Veritabanı şemasını uygulayın
npm run db:apply-auth
npm run db:migrate
npm run db:seed

# Geliştirme sunucusunu başlatın
npm run dev
```

Uygulama http://localhost:4000 adresinde çalışacak.

## 🧪 Testler

```bash
# Unit ve Integration testleri
npm test

# E2E testleri
npm run e2e

# TypeScript kontrolü
npm run typecheck

# Build testi
npm run build
```

## 📦 Dağıtım

Proje Vercel için optimize edilmiştir:

```bash
# Production build
npm run build

# Vercel deployment (otomatik)
git push origin main
```

## 🔧 Yapılandırma

### Ortam Değişkenleri

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
AUTH_URL=https://your-domain.com/api/auth
NEXT_PUBLIC_PROJECT_GROUP_ID=your-project-id
```

### Veritabanı

```bash
# Migration'ları uygulayın
npm run db:migrate

# Auth şemasını uygulayın
npm run db:apply-auth
```

## 📁 Proje Yapısı

```
web/
├── src/
│   ├── app/           # React Router sayfaları
│   ├── components/    # Yeniden kullanılabilir bileşenler
│   ├── lib/          # Yardımcı fonksiyonlar ve yapılandırmalar
│   ├── stores/       # Zustand state yönetimi
│   ├── types/        # TypeScript tip tanımları
│   └── utils/        # Genel yardımcı fonksiyonlar
├── api/              # Backend API endpoint'leri
├── db/               # Veritabanı şeması ve migration'lar
├── test/            # Test dosyaları
└── public/          # Statik dosyalar
```

## 🔐 Güvenlik

- HTTPS zorunlu
- CSP (Content Security Policy) aktif
- Rate limiting uygulanmış
- Güvenli çerez ayarları
- SQL injection koruması

## 📊 Performans

- Code splitting aktif
- Image optimization
- Caching stratejileri
- Lazy loading

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. GitHub Issues kullanın
2. `dev-err.log` ve `dev-out.log` dosyalarını kontrol edin
3. Rate limiting loglarını inceleyin

## 🔄 Güncelleme Geçmişi

Detaylı değişiklik geçmişi için `CHANGELOG.md` dosyasına bakın.
