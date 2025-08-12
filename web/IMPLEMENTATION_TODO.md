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


