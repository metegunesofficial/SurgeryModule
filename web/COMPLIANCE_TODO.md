### Deploy Hazırlık Kontrol Listesi

- Build scriptleri: `build` ve `start` komutları eklenecek
- SSR build: `__create/route-builder.ts` dosyasında prod’da dosya sistemi taramasını kaldır
- Prerender: gerçek rotaları tek tek listele (wildcard kullanma)
- Env değişkenleri: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `CORS_ORIGINS`, `NEXT_PUBLIC_*`
- Sağlık kontrolleri ve base URL: `NEXT_PUBLIC_CREATE_BASE_URL` prod’da set edilmeli (gerekirse kaldır)
- Testler: tüm vitest testleri yeşil
- Tip kontrol: strict TS noEmit yeşil
- Start: `react-router-serve` ile SSR servis ayağa kalkıyor
# SKS/JCI Uyumlu İçerik Genişletme Planı

Bu dosya, mevcut uygulamadaki tüm sayfaların SKS (Sağlıkta Kalite Standartları) ve JCI (Joint Commission International) gereksinimlerine uygun olacak şekilde içerik genişletme yol haritasını tanımlar. Genişletmeler mevcut davranışı değiştirmez; sadece görünür içerikleri ve göstergeleri artırır. Tüm eklemeler test-önce yaklaşımıyla yapılacaktır.

## Hedefler (Yüksek Seviye)
- Hasta Güvenliği Hedefleri (IPSG) görünürlük ve durum takibi
- Enfeksiyon Önleme ve Kontrol (Sterilizasyon, çevresel izleme, el hijyeni)
- Cerrahi Güvenlik (WHO kontrol listesi, preop/postop kontroller)
- Personel Yetkinlik, Eğitim Uyumu ve RBAC görünürlüğü
- Olay Bildirimleri, Sentinel/Near Miss sınıflandırması
- Dokümantasyon, denetim izi (audit), raporlama görünürlüğü

## Sayfa Bazlı Genişletmeler

### 1) Dashboard (`src/app/page.jsx`)
 - [x] Kart: Hasta Güvenliği Hedefleri (IPSG)
 - [x] Kart: Sterilizasyon Kalite Göstergeleri (AAMI/ISO referanslı)
 - [x] Kart: Olay Bildirimleri özeti (kritik/uyarı/sistem)
 - [x] Kart: Dokümantasyon ve Denetim görünürlüğü (audit izi)
 - [x] Kart: Eğitim Uyumu (tamamlanan/eksik eğitimler)

 Testler:
 - [x] `src/app/__tests__/dashboard.compliance.test.tsx`

### 2) Ameliyat Planlama (`src/app/ameliyat-planlama/page.jsx`)
 - [x] Bölüm: Cerrahi Güvenlik Kontrol Listesi (Sign-in, Time-out, Sign-out)
 - [x] Mevcut preop kontrol listesine JCI/WHO etiketleri

 Testler:
 - [x] `src/app/ameliyat-planlama/__tests__/compliance.test.tsx`

### 3) Canlı İzleme (`src/app/canli-izleme/page.jsx`)
 - [x] Bölüm: Aseptik Alan Uyarıları
 - [x] Bölüm: Kapı Erişimi ve Hareket (açma sıklığı)
 - [x] Bölüm: El Hijyeni ve Temas Süreleri

 Testler:
 - [x] `src/app/canli-izleme/__tests__/page.test.tsx`

### 4) Sterilizasyon (`src/app/sterilizasyon/page.jsx`)
 - [x] Bölüm: SKS ve JCI Referansları (ST79, ISO 11140-1, süreç politikaları)

 Testler:
 - [x] `src/app/sterilizasyon/__tests__/compliance.extended.test.tsx`

### 5) Personel (`src/app/personel/page.jsx`)
 - [x] Bölüm: Eğitim Uygunluğu (tamamlanma oranı, gerekli eğitimler)
 - [x] Bölüm: Yetkinlik Matriksi (rol/beceri karşılaştırması)

 Testler:
 - [x] `src/app/personel/__tests__/compliance.test.tsx`

### 6) Bildirimler (`src/app/bildirimler/page.jsx`)
 - [x] Bölüm: Uyumluluk Rozetleri (SKS/JCI etiket lejandı)
 - [x] Kartlarda statik SKS/JCI rozet alanı (görsel bağlam)

 Testler:
 - [x] `src/app/bildirimler/__tests__/page.test.tsx`

### 7) Ayarlar (`src/app/ayarlar/page.jsx`)
 - [x] Bölüm: Uyumluluk (JCI denetim modu, SKS rapor e-postaları)
 - [x] Bölüm: Denetim ve Saklama (audit log saklama süresi, veri saklama politikaları)

 Testler:
 - [x] `src/app/ayarlar/__tests__/page.test.tsx`

### 8) Hesap (`src/app/account/page.jsx`)
 - [x] Bölüm: Eğitim ve Yeterlilikler (sertifika/yenileme tarihleri)
 - [x] Bölüm: Sertifikalar (liste)

 Testler:
 - [x] `src/app/account/__tests__/page.test.tsx`

## Notlar
- Tüm genişletmeler mevcut davranışı değiştirmez, sadece yeni başlık ve bilgi kartları eklenir.
- Gerçek veri entegrasyonu sonraki iterasyondadır; bu sürüm yer tutucu (placeholder) metrikler içerir.
- Erişilebilirlik: yeni başlıklarda uygun hiyerarşi ve `aria-` nitelikleri korunur.


