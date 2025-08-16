# 🏥 Surgery Module - Kapsamlı Ameliyathane & Sterilizasyon Yönetim Sistemi

## Vizyon
Zincir hastane grupları için dünya standartlarında, tüm kalite kriterlerini karşılayan, modüler ve entegre edilebilir ameliyathane & sterilizasyon yönetim platformu.

## Hedef Kullanıcılar
- **Zincir Hastane Grupları** (birden fazla lokasyon)
- **Büyük Hastaneler** (200+ yatak kapasiteli)
- **Özel Hastaneler** (JCI, SKS akreditasyonu hedefleyen)
- **Kamu Hastaneleri** (Sağlık Bakanlığı standartları uyumlu)

## Kapsam ve Standartlar

### Desteklenen Kalite Standartları
- **Türkiye:** SKS (Sağlıkta Kalite Standartları)
- **Uluslararası:** JCI (Joint Commission International)
- **Teknik:** ISO 13485, AAMI, HIMSS
- **Sterilizasyon:** EN 556, ISO 17665

### Ana Modüller
1. **Ameliyathane Yönetimi** - OR scheduling, resource management
2. **Sterilizasyon Merkezi** - SPD workflow, traceability
3. **Eczane/Stok Yönetimi** - Medication, inventory control
4. **Kalite Uyum** - Compliance monitoring, audit trails
5. **Entegrasyon** - HIS, CRM, ERP connectivity
6. **Raporlama** - KPI dashboards, regulatory reports

## Teknik Stack
- **Frontend:** React Router 7, Chakra UI, TypeScript
- **Backend:** Node.js, Hono, PostgreSQL
- **Deployment:** Vercel, Supabase
- **Testing:** Vitest, Playwright
- **Auth:** NextAuth.js, RBAC

## Quick Start
```bash
cd web
npm ci
npm run db:apply-auth
npm run db:migrate
npm run db:seed
npm run dev
```

## Live Demo
🌐 [surgery-module.vercel.app](https://surgery-module.vercel.app/)

## Proje Durumu
🚧 **Aktif Geliştirme Aşaması** - MVP hazırlık süreci

---
*Bu proje, küresel hastane yönetim standartlarını karşılayan, ölçeklenebilir bir sağlık teknolojisi çözümü geliştirmeyi hedeflemektedir.*