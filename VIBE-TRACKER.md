# 🤖 Vibe Tracker — Sprint 1 İzleme Dosyası

Bu dosyadan yapılanları ve sıradaki işleri tek yerden takip edebilirsin. Her madde doğrulama adımları ve ilgili dosya/komut referansları ile birlikte verilir.

## 🎯 Kapsam (Sprint 1)

- [x] Database core şema migration'ları yazıldı
  - Dosya: `web/db/migrations/0002_core_schema.sql`
  - İçerik: `hospitals`, `departments`, `users`, `operating_rooms`, `surgeries` + indeksler
  - Çalıştırma: `cd web && npm run db:migrate`

- [x] Development seed script eklendi
  - Dosya: `web/scripts/seed.mjs`
  - Veri: Mock şemalara uygun örnek hastane, bölüm, kullanıcı, OR ve planlı ameliyat
  - Çalıştırma: `cd web && npm run db:seed`

- [x] DB setup tek komutta
  - `package.json` script: `db:setup` → `db:apply-auth` + `db:migrate` + `db:seed`
  - Çalıştırma: `cd web && npm run db:setup`

- [x] Test altyapısı çalışıyor ve tüm mevcut testler geçiyor
  - Çalıştırma: `cd web && npm test`
  - Ortam: jsdom; DB bağlantısı olmadan da çalışır

- [x] Dokümantasyon güncellendi
  - `README-updated.md` Quick Start → DB komutları eklendi
  - `web/README.md` Database → `db:seed`, `db:setup`
  - `tam-todo-listesi.md`, `moduller-epic.md`, `kalite-standartlari.md` ilerleme notları güncellendi

## ✅ Kabul Kriterleri (Sprint 1 temel)

- **DB Şema**: Migration başarıyla uygulanmalı; tablolar ve indeksler oluşmalı
  - Doğrulama: `SELECT COUNT(*) FROM _migrations;` içinde `0002_core_schema.sql` görünmeli
- **Seed**: Örnek kayıtlar eklenmeli (hastane, bölüm, kullanıcı, OR, planlı ameliyat)
  - Doğrulama: `SELECT * FROM hospitals LIMIT 1;` kayıt dönmeli
- **Testler**: Tüm unit/integration testler geçmeli
  - Doğrulama: `npm test` tüm dosyalarda pass
- **Dokümantasyon**: Kurulum ve komutlar tek kaynaktan erişilebilir
  - Doğrulama: `README-updated.md` ve `web/README.md` komutları içeriyor

## 🔜 Sıradaki İşler (Sprint 1 devamı)

- [ ] Authentication akışlarını tamamla (signin/signup UI + api routes varsa)
  - Acceptance: Geçerli kullanıcıyla login/logout; hatalı giriş reddedilir
  - Referans: `web/src/__create/@auth/create.js`, `web/__create/index.ts`

- [ ] RBAC enforcement (navigasyon + sayfa eylemleri)
  - Acceptance: Role/permission bazlı menü/eylem görünürlüğü
  - Referans: `web/src/lib/rbac.ts`, `web/src/utils/useRBAC.jsx`, `web/src/components/layout/Sidebar.jsx`

- [ ] UI Foundation iyileştirmeleri (layout, header, nav states)
  - Acceptance: Erişilebilir, responsive, test edilebilir layout
  - Referans: `web/src/app/layout.jsx`, `web/src/components/layout/*`

- [ ] E2E smoke (Playwright) minimal senaryo
  - Acceptance: `/` ve ana modül sayfaları 200 dönmeli ve temel elementler görünmeli
  - Komut: `cd web && npm run e2e`

## 🧪 Doğrulama Komutları

```bash
# 1) Bağımlılıklar
cd web
npm ci

# 2) Ortam değişkenleri (örnek için .env)
# web/README.md içindeki örnek .env'yi kullanın

# 3) DB kurulum (Postgres gerek)
npm run db:setup

# 4) Testler
npm test
```

## 🗂️ Değişen Dosyalar (Önemli)

- `web/db/migrations/0002_core_schema.sql`
- `web/scripts/seed.mjs`
- `web/package.json` (scripts: `db:seed`, `db:setup`)
- `README-updated.md`, `web/README.md`, `tam-todo-listesi.md`, `moduller-epic.md`, `kalite-standartlari.md`

## 📒 İlerleme Günlüğü

- 2025-08-16
  - Core şema migration eklendi (0002)
  - Seed script eklendi ve dokümantasyon güncellendi
  - Mevcut testler geçti (unit/integration)


