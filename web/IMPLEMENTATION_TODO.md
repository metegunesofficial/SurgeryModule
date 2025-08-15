Backend/DB/Security setup

- Add `.env.example` to document required env (DATABASE_URL, AUTH_SECRET, etc.)
- Security headers + lightweight rate limiter middleware
- DB client abstraction compatible with Neon/Supabase (HTTP + Pool)
- Auth adapter based on Postgres tables and Credentials provider
- SQL migration runner under `scripts/migrate.mjs` and initial migration in `db/migrations`
- Health route at `/api/health`

Deploy notes

- Set env on Vercel: DATABASE_URL, AUTH_SECRET, AUTH_URL, CORS_ORIGINS
- Attach Vercel Postgres/Neon or Supabase (copy connection string)
- Run `npm run db:apply-auth` and `npm run db:migrate` once

## Amaç

Mevcut menü başlıklarının altındaki içerikleri, dünya standartlarında Cerrahi (Ameliyat) ve Sterilizasyon modülleri haline getirmek.

## Kapsam ve Yol Haritası

### 1) Cerrahi (Ameliyat) Modülü
- [x] Bölüm isimlendirmeleri ve içerik standardizasyonu (metinler korunacak, ek bölümler eklenecek)
- [x] Yeni bölümler (UI):
  - [x] Kaynak Kullanımı (ameliyathane, ekipman, personel doluluğu)
  - [x] Konflikt Tespiti (zaman/oda/ekipman çakışmaları – placeholder)
  - [x] Anestezi Hazırlığı (preop risk, ASA, onay – placeholder)
- [x] Haftalık plan üzerinde “hazırlık durumları” rozeti (placeholder)
- [x] Testler: yeni başlıkların render edildiğini doğrulayan üniteler

### 2) Sterilizasyon Modülü
- [x] Bölüm isimlendirmeleri ve içerik standardizasyonu (mevcudu koruyup genişletme)
- [x] Yeni bölümler (UI):
  - [x] Alet Seti Hazırlığı (set durumu/eksikler – placeholder)
  - [x] İzlenebilirlik (chain-of-custody, QR akışı – placeholder)
- [x] Kalite Güvence metrikleri (AAMI/ISO bağlamında açıklayıcı etiketler – placeholder)
- [x] Testler: yeni başlıkların render edildiğini doğrulayan üniteler

### 3) Çapraz Kesit İyileştirmeleri
- [x] Erişilebilirlik: başlık hiyerarşisi, buton etiketleri (aria-label), kontrast (mevcut stiller korunarak)
- [x] Performans: memoization (kritik sayfa bileşenleri `memo` ile sarıldı)
- [x] RBAC: işlem butonları için yetkilendirme kancaları (yer tutucu `RBACProvider`, `useRBAC` eklendi; davranış değişmeden tüm izinler açık)

## Uygulama Sırası (MVP)
1. Test ekle: yeni başlıklar görünür olmalı (ameliyat + sterilizasyon) ✅
2. UI ekle: küçük, risksiz kartlar ve başlıklar ✅
3. Tüm testleri çalıştır ve yeşil tut ✅
4. Sonraki iterasyonda gerçek veri kaynağına entegrasyon için kancalar ekle ✅ (yer tutucu hook'lar eklendi: `useSurgeryModule`, `useSterilizationModule`)



## Genişletme Yol Haritası (Eksik Özellikler)

Ameliyathane (OR)
- [ ] Preference Card ve Case Cart: `src/lib/or/preference-cards.ts` (tipler) + `src/stores/orPreference.ts` (store) + UI listesi
- [ ] OR KPI: blok doluluk, iptal/ertelenme, turnover P95 — `src/stores/orKpi.ts` + dashboard kartları
- [ ] Antibiyotik profilaksi zamanlayıcı: vaka başına uyarı ve kayıt (form + audit)
- [ ] Sayım uzlaşma ve olay: spong/alet sayımı, mismatch engelleme, olay bildirimi bağı
- [ ] Çevresel izleme: oda sıcaklık/nem ve kapı açılma sayacı (mock sensör sağlayıcı → adapter)
- [ ] Anestezi trend import: mock seri/port arayüzünden veri çekme ve vaka ile bağlama
- [ ] Turnover checklist: temizlik tamamlanmadan oda tahsisini engelleme kuralı

Sterilizasyon (SPD)
- [ ] Bowie‑Dick günlük test: form, saklama ve rapor; CI/BI ile yük onayı bağlama
- [ ] Implant hold: BI negatif doğrulaması olmadan implant serbest bırakmayı engelleme
- [ ] IFU takibi: set/prosedür bazlı program/parametre zorlama, ihlal uyarısı
- [ ] Loaner tray yönetimi: giriş/çıkış, içerik doğrulama, SLA takibi
- [ ] Set montaj talimatı: görsel adımlar, eksik parça ve yeniden işleme akışı
- [ ] Cihaz bakım/kalibrasyon: sayaç, plan, uyarı; CMMS adapter arayüzü
- [ ] Peel‑pack/tekil alet izleme: DataMatrix ile tekil izlenebilirlik ve batch tarama UI
- [ ] Recall kapsam arama: lot/siklus/cihaz bazlı geriye izleme ekranı
- [ ] Yük (load) onayı: parametrik kontrol + CI/BI eşleştirme + yetkili serbest bırakma imzası

Güvenlik/Yetki
- [ ] İnce taneli roller: OR Coordinator, SPD Lead, Infection Control; `src/lib/rbac.ts` genişletme
- [ ] Audit dışa aktarma: AuditPanel'e JSON export + arşiv uç noktası (server route mock)

Dayanıklılık/İşletme
- [ ] Çevrimdışı kuyruk görünürlüğü (retry jobs UI) ve devre kesici metrikleri
- [ ] Entegrasyon rate‑limit ve geri‑basınç ayarları (adapter bazlı)


## Eczane / İlaç ve Stok Yönetimi (Teknik Yol Haritası)

Tipler
- [ ] `src/types/pharmacy.ts`: `Medication`, `MedicationLot`, `InventoryLocation`, `InventoryMovement`, `MedicationOrder`, `MedicationAdministration`

Store ve İş Kuralları
- [ ] `src/stores/pharmacy.ts`: envanter (FEFO), hareketler, eMAR akışı, kontrollü maddeler için çift imza/lot tüketim
- [ ] `src/stores/pharmacy.test.ts`: FEFO seçimi, lot eksiye düşmeme, waste/return akış testleri

UI
- [ ] `src/app/eczane/` listeleri: stok kartları, düşük stok/son kullanma uyarıları
- [ ] Hasta ekranı bağlantısı: yatış/taburcu sayfasında “İlaç Uygula” modalı ve barkod doğrulama (bileklik+ilaç)

Entegrasyon
- [ ] `src/lib/integrations/medication.ts`: FHIR `Medication`, `MedicationRequest`, `MedicationAdministration` map
- [ ] MEDULA/SGK (opsiyonel): faturalama/geri ödeme alan şablonları