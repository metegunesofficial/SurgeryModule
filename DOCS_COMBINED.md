# 📋 SurgeryModule — Deploy Hazırlık TODO (100% Kapsam)

> Bu kontrol listesi tamamen bittiğinde uygulama üretime %100 hazır kabul edilir. Her maddenin altında Kriter ve Doğrulama adımı vardır.

---

## 1) Proje Temizlik ve Versiyonlama
- [x] Çalışma alanı temiz (git): `git status` → untracked/modified yok
- [x] Değişiklikler commit ve push edildi (main/deploy branch)
- [x] Versiyon ve değişiklik notu güncellendi (semver + değişiklik özeti)
  - Kriter: Tag/Release oluşturuldu
  - Doğrulama: Git tag ve GitHub/Git provider release kaydı

## 2) Ortam ve Gizli Anahtarlar (Prod)
- [x] Prod ortamı oluşturuldu (Vercel projede root → repo kökü)
- [x] Build Root ayarlı: `web`
- [x] Env değişkenleri tanımlandı
  - `DATABASE_URL`
  - `AUTH_SECRET`
  - `AUTH_URL` (ör: `https://<domain>/api/auth`)
  - `CORS_ORIGINS` (virgülle ayrılmış)
  - `CREATE_TEMP_API_KEY` (opsiyonel; Create/Stripe köprüsü için)
  - `NEXT_PUBLIC_*` (gerekli olanlar)
    - `NEXT_PUBLIC_PROJECT_GROUP_ID` (opsiyonel; Create entegrasyonu)
    - `NEXT_PUBLIC_CREATE_BASE_URL` (opsiyonel; varsayılan `https://www.create.xyz`)
    - `NEXT_PUBLIC_CREATE_API_BASE_URL` (opsiyonel; Stripe proxy uçları)
    - `NEXT_PUBLIC_CREATE_HOST` (opsiyonel; hostname iletimi)
    - `NEXT_PUBLIC_CREATE_ENV` (opsiyonel; `PRODUCTION` ise demo uyarıları gizlenir)
  - Kriter: Eksik env yok
  - Doğrulama: Vercel Project → Settings → Environment Variables

## 3) Güvenlik Başlıkları ve Çerez Politikası
- [x] Güvenlik başlıkları aktif (root `vercel.json`)
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options` = `DENY`
  - `Referrer-Policy` = `strict-origin-when-cross-origin`
  - `X-Content-Type-Options` = `nosniff`
  - `Permissions-Policy` (gereksiz izinler kapalı)
  - Kriter: Tüm başlıklar prod responsta mevcut
  - Doğrulama: `curl -I https://<domain> | findstr -i "content-security-policy\|strict-transport-security\|x-frame-options\|referrer-policy\|x-content-type-options\|permissions-policy"`
- [x] Çerezler prod’da güvenli
  - `secure: true`, `sameSite: none`, `httpOnly: true`, `path: /`
  - Kriter: Auth cookie attribute’ları doğru
  - Doğrulama: Tarayıcı DevTools → Application → Cookies

## 4) Veritabanı Kurulum (Prod)
- [x] Yetkili/verimli Postgres bağlantısı (Neon/Supabase/managed PG)
- [x] Auth şeması uygulandı: `cd web && node scripts/apply-auth-schema.mjs`
- [x] Migrations uygulandı: `cd web && node scripts/migrate.mjs`
  - Kriter: `_migrations` tablosunda en az `0002_core_schema.sql` kayıtlı
  - Doğrulama: `SELECT * FROM _migrations;`
- [x] Seed sadece dev/staging’de çalışır; prod’da devre dışı
  - Kriter: Prod DB’de seed veri yok (isteğe bağlı)
  - Doğrulama: Örnek tablo sayımları anomalisiz

## 5) API Sağlık ve Rate Limit
- [x] Health endpoint 200 döner: `GET /api/health`
  - Kriter: 200 + `Content-Type: application/json` + `{ ok: true }`
  - Doğrulama: `curl -i https://<domain>/api/health`
- [x] Rate limit aktif ve doğru eşiklerle çalışır
  - `/api/health` → window: 1000ms, max: 5
  - `/api/tenants` → GET: 10/s, POST: 5/s
  - Kriter: Limit aşımında 429
  - Doğrulama: Kısa sürede ardışık isteklerle 429 testi

## 6) Kimlik Doğrulama ve RBAC
- [x] Sign-in/Sign-up/Logout akışları çalışır (valid/invalid senaryolar)
- [x] RBAC görünürlük ve eylem kısıtları uygulanır (navigasyon + sayfa aksiyonları)
  - Kriter: Rol değişince menü/aksiyon görünürlüğü değişir
  - Doğrulama: UI smoke + mevcut testler (RBAC testleri yeşil)

## 7) Çoklu‑Tenant (Demo ve Live)
- [x] Demo tenant (slug=`demo`) veya gerçek slug’lar çalışır
- [x] Tenant sayfaları: `/{slug}`, `/{slug}/ameliyat-planlama`
  - Kriter: `GET /api/tenants?slug=<slug>` doğru tenant döner
  - Doğrulama: UI gezinme ve API yanıtları

## 8) Test ve Kalite
- [x] Bağımlılıklar: `cd web && npm ci`
- [x] Tip kontrol: `npm run typecheck` → 0 hata
- [x] Unit/Integration: `npm test` → tüm testler yeşil
- [x] E2E (Playwright): `npm run e2e` → smoke senaryoları yeşil
  - Kriter: Tüm test komutları CI’de de geçer
  - Doğrulama: Lokal ve CI çıktıları

## 9) Derleme ve SSR
- [x] Prod derleme: `npm run build` başarılı
- [x] SSR servis başlatma (platform): `npm start`/Vercel serverless
- [x] Prerender çıktıları beklenen rotaları içerir
  - Kriter: 4xx/5xx yok, kritik rotalar prerender edildi
  - Doğrulama: Build log ve çıktı klasörü

## 10) Operasyon, Loglama ve İzleme
- [x] Platform logları (Vercel) aktif ve erişilebilir
- [x] Minimum uyarılar/alert kanalları (ör. health fail, 5xx artışı)
- [x] Log privacy: kişisel/veri gizliliği sızıntısı yok
  - Kriter: Loglarda PII yok, seviyeler uygun
  - Doğrulama: Örnek hata/istem günlükleri

## 11) Güvenlik ve Uyumluluk Doğrulamaları
- [x] Güvenlik taraması (npm audit) kritik açık yok
- [x] SAST/Dependabot (veya eşdeğer) uyarıları çözüldü
- [x] Temel SKS/JCI maddeleri görünürlük/doğrulama olarak UI’da mevcut
  - Kriter: Uyum sayfası (`/uyum`) ve ilgili bölümler render
  - Doğrulama: UI + testler

## 12) Rollback ve Kurtarma Planı
- [x] Uygulama rollback adımları (önceki build’e dönüş)
- [x] DB rollback stratejisi (migration geri alma veya hotfix)
  - Kriter: Dönüş planı dökümante ve denenmiş
  - Doğrulama: Staging’de prova

## 13) Son Smoke ve Kabul
- [x] Aşağıdaki rotalar prod’da 200 ve ana içerik görünür:
  - `/`
  - `/ameliyat-planlama`
  - `/sterilizasyon`
  - `/uyum`
  - `/account/signin`
  - Kriter: İlk boyama ve başlık/ana öğeler görünür
  - Doğrulama: Manuel veya Playwright ile prod URL’inde

## 14) Yayın Sonrası Kontrol
- [x] İlk 24 saat hata/performans izlemesi
- [x] Hızlı düzeltme kanalı (hotfix) hazır
- [x] Kullanıcı erişim ve temel akışlar tekrar doğrulandı

---

### Hızlı Komut Rehberi
```bash
# Kurulum
cd web
npm ci

# Tip kontrol ve test
npm run typecheck
npm test
npx playwright install chromium
npm run e2e

# Prod DB ilk kurulum (deploy sonrası bir kerelik)
node scripts/apply-auth-schema.mjs
node scripts/migrate.mjs

# Build (lokal doğrulama)
npm run build
```

### Notlar
- Rate limit in-memory’dir; çoklu instance için paylaşımlı store (Redis/Upstash) ile değiştirilmesi önerilir.
- Seed prod’da devre dışı tutulmalıdır.
