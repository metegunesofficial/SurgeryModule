## Ameliyathane ve Sterilizasyon PRD Uyum TODO

Bu dosya, `docs/ameliyathane-sterilizasyon-prd.tr.json` kapsamının uygulamadaki karşılığını %100'e yaklaştırmak için atılacak adımları içerir. Mevcut sürüm yalnızca görünürlük/placeholder düzeyinde olup davranışı değiştirmez.

### Genel
- [x] JSON'u dinamik okuyup sunan `/uyum` sayfası
- [x] Özet toplamlar (modül, alt modül, özellik, ekipman, gereksinim kategorileri, standartlar)
- [x] Testler: render ve data-testid kontrolleri
- [x] E2E: `/uyum` rota erişimi ve ana bölümlerin varlığı (Playwright)
  - [x] E2E temel test eklendi (`test/e2e/uyum.spec.ts`, `playwright.config.ts`)

### Ameliyathane Modülü (UI/Veri)
- [x] Planlama ve Randevu: çoklu klinik/oda/ekip eşlemesi için veri modeli (placeholder -> store)
- [x] Çakışma kontrolü ve bekleme listesi için algoritma iskeleti (rate-limit safe)
- [x] Blok planlama (cerrah/oda) konfig UI iskeleti
- [x] Onay/hatırlatma akışı (SMS/e-posta) için mock provider arayüzü
  - [x] Mock notification provider eklendi (`src/lib/providers/notifications/mock.ts`)
- [x] Vaka veri şeması (case_id, patient_id, scheduled_start, vs.) tipleri ve validasyon (Zod)
- [x] Operasyon notu tipleri ve imza/saat alanları
- [x] WHO kontrol listesi (preop/timeout/postop) durum makineleri
- [x] Ekip ataması: sorumluluk matrisi veri modeli
- [x] Kit doğrulama: scanned_kit_ids ve geçerlik kuralları için servis arayüzü
  - [x] Store iskeleti ve basit doğrulama kuralı (`src/stores/surgeryPlanning.ts: verifyKits`)
- [x] Materyal kullanımı kayıt formu
- [x] Olay bildirimi formu ve şiddet enum'ları
- [x] Audit log arayüzü

### Sterilizasyon Modülü (UI/Veri)
- [x] Kit/Tepsi şeması ve durum akışı (dirty -> clean -> packed -> sterilized -> ...)
- [x] Siklus kaydı: device/type zaman/parametre alanları ve PASS/FAIL kuralı
- [x] Yıkama kaydı: program ve parametreler
- [x] Etiket: DataMatrix üretimi için mock util
  - [x] Mock DataMatrix üretimi (`src/lib/sterilization/label.ts`)
- [x] Tarama olayları: event_type akışları ve konum (store iskeleti)
- [x] İndikatör: BI/CI alanları ve engelleme kuralları
- [x] Recall akışı: kapsam arama ve uyarı
- [x] Raporlama: siklus/başarı/BI/CI özetleri

### Performans/Kullanıcı/Altyapı
- [x] Query'lerde akıllı önbellekleme ve `staleTime` stratejileri (gerçek veriye geçişte)
- [x] UI erişilebilirlik iyileştirmeleri (ARIA, odak yönetimi)
- [x] RBAC aksiyon anahtarlarının merkezi şema tanımı
- [x] Çoklu dil (TR/EN) i18n iskeleti

### Entegrasyonlar
- [x] HL7 v2 (ADT, SIU/ORM) ve FHIR (Patient/Appointment/Procedure) için harita taslakları
- [x] e‑Nabız/MEDULA hata geri bildirimi arayüzleri (mock)
- [x] Cihaz arayüzleri (anestezi/monitor) için port/seri veri mock'u

Not: Tüm maddeler mevcut davranışı değiştirmeyecek şekilde aşamalı olarak eklenecektir.


