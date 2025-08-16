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


### Eksik/Genişletme Önerileri (Dünya standartlarına göre)

Ameliyathane (OR)
- [ ] Blok kullanım ve oda kullanım KPI'ları (blok doluluk, iptal/ertelenme oranı, turnover süresi P95)
- [ ] Preference Card yönetimi (cerrah/prosedür bazlı malzeme/alet şablonları) ve Case Cart hazırlığı
- [ ] Antibiyotik profilaksi zamanlayıcı ve kayıt (kesiden önce 60 dk kuralı)
- [ ] Sayım uzlaşma (spong/alet/şırınga) ve olay kaydı; RF/RTLS destekli sayım entegrasyonu (opsiyonel)
- [ ] İmplant UDI tarama ve vaka/patient bağlama, vendor loaner set planlama kısıtları
- [ ] Kapı açılma sayısı, oda sıcaklık/nem izleme ve alarm eşikleri (çevresel izleme)
- [ ] Anestezi kaydı/monitor entegrasyon arayüzü (trend import; mock → gerçek adapter)
- [ ] Turnover optimizasyonu: temizlik durumları ve temizlik standardı kontrol listesi
- [ ] Operasyon notu şablonları ve imza iş akışları (çoklu imza)
- [ ] KPI paneli: oda/ekip/cerrah bazlı üretkenlik ve bekleme listesi metrikleri

Sterilizasyon (SPD)
- [ ] AAMI ST79/ISO uyumlu Bowie‑Dick günlük test kaydı ve doğrulama
- [ ] BI negatif çıkana kadar implant yük serbest bırakma (implant hold) kuralı ve onay
- [ ] IFU (kullanım talimatı) referans takibi ve zorlama (program/parametre uyumu)
- [ ] Loaner tray kabul/teslim, içerik doğrulama ve zaman penceresi yönetimi
- [ ] Set montaj talimatı (resimli adım listesi), hatalı/eksik parça olayı ve yeniden işleme akışı
- [ ] Cihaz bakım/kalibrasyon planı, sayaç ve bakım uyarıları (CMMS entegrasyonu opsiyonel)
- [ ] Peel‑pack ve tekil alet izlenebilirliği; toplu tarama (batch) desteği
- [ ] Lot/seri ve geri çağırma (recall) kapsam araması; klinik kullanım bağlamına geri izleme
- [ ] Yük (load) onay akışı: parametrik kontrol, CI/BI sonuç eşleştirme ve yetkili serbest bırakma

Güvenlik/Yetki
- [ ] İnce taneli RBAC: OR Koordinatörü, SPD Sorumlusu, Enfeksiyon Kontrol rol ve izinleri
- [ ] Audit log dışa aktarma (CSV/JSON) ve immutable arşivleme stratejisi

Performans/Dayanıklılık
- [ ] Çevrimdışı kuyruk ve tekrar deneme (örn. tarama/etiket basımı) için görsel kuyruk durumu
- [ ] Entegrasyonlar için devre kesici/kaynak bazlı geri‑basınç ve rate‑limit uyarlaması

eMAR / İlaç Düşümü Kullanım Notları
- [ ] 5 doğru kuralı: doğru hasta, doğru ilaç, doğru doz, doğru yol, doğru zaman; barkod eşleştirme ile doğrula
- [ ] FEFO kuralı: hasta düşümünde en eski son kullanma tarihli uygun lot seçimi
- [ ] Kontrollü madde düşümünde çift imza ve waste gerekçesi zorunlu


### Eczane / İlaç ve Stok Yönetimi (Yeni)
- [ ] Formülary/ilaç sözlüğü ve eşanlam/ATC kodları
- [ ] Envanter: lot/son kullanma (FEFO), minimum-maksimum seviye ve uyarılar
- [ ] Stok hareketleri: alım, sarf/ilaç düşümü, iade, zayi, transfer (kaynak/hedef konum)
- [ ] eMAR: Medication Order/Administration kayıtları, sonuçlar (given/held/refused/wasted) ve gerekçe
- [ ] Barkod doğrulama: hasta-bileklik + ilaç barkodu eşleştirme (5 doğru kuralı)
- [ ] Kontrollü maddeler: çift imza, zayi/waste akışı ve envanter sayımı
- [ ] Hasta bazlı ilaç düşümü: işlemde ilgili lot/expiry bağlama ve otomatık stok azaltma (FEFO)
- [ ] Entegrasyon: HL7/FHIR Medication, MedicationRequest/Administration; MEDULA (uygunsa)

