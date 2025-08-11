# Yapılacaklar (Supabase Hariç)

- Backend (API)
  - [x] GET `/api/health`
  - [x] Rate limit (Upstash opsiyonel, yoksa in-memory fallback)
  - [x] Surgeries: `GET /api/surgeries`, `POST /api/surgeries`, `PUT /api/surgeries/:id`, `DELETE /api/surgeries/:id` (in-memory)
  - [x] Rooms: `GET /api/rooms` (placeholder)
  - [x] TV: `GET /api/display/surgeries` (JSON)
  - [x] TV canlı veri: SSE veya WebSocket gateway (yayın/broadcast servisi)
  - [x] Reports: `GET /api/reports/sks`, `GET /api/reports/jci` (stub)
  - [x] Auth/RBAC middleware (rol ve izin kontrolü) — `_lib/auth.ts` tekilleştirme
  - [x] Standart rate‑limit header’larını TÜM uçlara uygula: `health`, `rooms`, `display/*`
  - [x] Global hata yanıtlama helper'ı (tutarlı `error` payload + `content-type`)
  - [x] Güvenlik başlıkları ve CORS: `next.config.ts` veya route düzeyi (temel güvenlik başlıkları)
  - [x] Supabase adapter: `USE_SUPABASE=1` ile `surgeries` için Supabase tablo entegrasyonu (opsiyonel toggle)

- Frontend (UI)
  - [x] Uygulama iskeleti: `Sidebar`, `/dashboard`, `/surgeries`, `/sterilization`
  - [x] UI: Referans dashboard ile aynı renk paleti, tipografi ve sadelik; aynı sol `Sidebar` + üst çubuk layout'u ve menü davranışı
  - [x] Tema/Tasarım sistemi: `globals.css` içine UI/UX renk değişkenleri, Tailwind theme mapping
  - [x] Üst çubuk (Header): arama, bildirim, kullanıcı menüsü
  - [x] `Sidebar`: ikonlar, aktif durum, gruplanmış menü ve daraltılabilir bölümler
  - [x] Dashboard bölümleri: Quick Stats, Timeline, Sterilizasyon durumu, Recent Activities (mock veriyle)
  - [x] Surgeries sayfası: liste + oluşturma formu (React Hook Form + Zod + React Query) — boş/yükleniyor/hatayla durumları ve iskeletler
  - [x] Sterilization sayfaları: döngü/malzeme placeholder bileşenleri
  - [x] TV ekran sayfası (yüksek kontrast, büyük tipografi)
  - [x] TV canlı veri: SSE endpoint `/api/display/live` + yayın helper'ı
  - [x] Toast/notification altyapısı (başarı/hata)
  - [x] Erişilebilirlik: klavye navigasyonu, ARIA etiketleri, kontrast denetimi (skip link + focus göstergeleri)
  - [x] Responsive davranış: mobil hamburger menü, tablet için daraltılabilir `Sidebar`

- Güvenlik & Uygunluk
  - [x] Zod validasyonunu tüm uçlara yayma
  - [x] Güvenli HTTP başlıkları (CSP, HSTS vb.) ve `next.config.ts` header’ları
  - [x] Audit log (şimdilik stub)

- Test
  - [x] Unit: rate‑limit ve surgeries/rooms endpoint testleri (Vitest)
  - [x] Unit: `buildRateLimitHeaders` ve `display/surgeries` için testler
  - [x] Integration: rooms/surgeries birlikte akış testleri (in-memory store ile)
  - [x] E2E: temel kullanıcı akışları (Playwright)
  - [ ] Accessibility ve görsel regresyon (opsiyonel)

- Gözlemlenebilirlik & Performans
  - [x] Sentry entegrasyonu (client + server)
  - [x] Vercel Analytics
  - [x] Caching helper (Upstash Redis ile `getCached` benzeri)
  - [x] Web Vitals izleme ve kritik yol optimizasyonları (LCP, CLS, INP) – temel logger

- DevOps
  - [x] CI: test/build pipeline (GitHub Actions)
  - [x] Ortam değişkenleri örnekleri (`.env.example`) — proje kökünde ekle
  - [x] Husky + lint-staged pre-commit (lint, typecheck, test) (paketler eklendi, hook örneği yazıldı)
  - [x] Vercel proje ayarlarının dökümantasyonu (env, build komutları) — `deployment-guide.md`
  - [ ] Supabase proje oluşturma (Dashboard > New Project)
  - [ ] ENV tanımları: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `USE_SUPABASE=1` (Vercel & .env.local)
  - [ ] MCP Supabase yapılandırması: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` ile write mode (şu an bağlantı zaman aşımı)
  - [ ] Supabase şema migration'ı uygulama: `migrations/0001_create_surgeries.sql` (MCP veya SQL Editor)
  - [ ] Preview deploy’da smoke test: `npm run test:e2e`
  - [ ] Robots.txt & basic SEO (opsiyonel)
  - [ ] Error boundary sayfası (500) ve not-found geliştirmesi (opsiyonel)
  - [ ] Prod deploy öncesi smoke test: `npm run test:e2e` Vercel Preview üzerinde
  - [ ] Robots.txt & basic SEO (opsiyonel)
  - [ ] Error boundary sayfası (500) ve not-found geliştirmesi (opsiyonel)

- Dokümantasyon
  - [x] `web/README.md` proje özel yönergeler (çalıştırma, test, env, rol başlıkları `x-role` kullanımı)
  - [x] API dokümantasyonu (OpenAPI/Swagger taslağı) — `GET /api/openapi.json`
  - [x] UI kılavuzu: komponentlerin kısa kullanım notları (`web/docs/ui-guide.md`)

Not: Supabase ile ilgili yapılacaklar bu listeye dahil değildir; ayrı bir başlıkta ele alınacaktır.


