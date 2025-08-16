# QA Notes — Frontend/QA Coverage (DOCS 6, 7, 8, 13)

## 6) Kimlik Doğrulama ve RBAC (UI)
- Kriter: Rol değişince menü/aksiyon görünürlüğü değişir
- Doğrulama (unit/integration):
  - RBAC menü/aksiyon testleri yeşil
  - Örnek: `web/src/components/layout/__tests__/sidebar.rbac.test.tsx` (2/2 passed)
  - Örnek: `web/src/app/ameliyat-planlama/__tests__/rbac.actions.test.tsx` (2/2 passed)
  - Örnek: `web/src/app/sterilizasyon/__tests__/rbac.actions.test.tsx` (2/2 passed)

## 7) Çoklu‑Tenant Sayfaları (pages)
- Kriter: `/{slug}` ve `/{slug}/ameliyat-planlama` render edilir
- Doğrulama (E2E smoke):
  - `web/test/e2e/tenant.spec.ts`
  - `/demo` → boş DB durumda "Klinik/Hastane bulunamadı." metni doğrulandı
  - `/demo/ameliyat-planlama` → "Ameliyat Planlama (Tenant)" başlığı doğrulandı

## 8) Test ve Kalite
- Bağımlılıklar: `npm ci` tamam
- Tip kontrol: `npm run typecheck` → 0 hata
- Unit/Integration: `npm test` → 33 dosya, 61/61 passed
- E2E (Playwright): `npm run e2e` → 8/8 passed (smoke + tenant)

## 13) Son Smoke ve Kabul
- Kriter: Temel rotalar 200 ve ana içerik görünür
- Doğrulama (E2E smoke):
  - `/` → sidebar/header görünür
  - `/ameliyat-planlama` → başlık görünür
  - `/sterilizasyon` → H1 görünür
  - `/uyum` → PRD başlığı görünür
  - `/account/signin` → auth başlığı görünür
- Build: `npm run build` başarılı (SSR + prerender kritik rotalar)

---

### Komut Çıktı Özetleri
- Unit/Integration: 61 passed
- Playwright E2E: 8 passed
- Build: başarılı, prerender çıktıları üretildi
