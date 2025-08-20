# SurgeryModule Localhost Setup Guide

Bu rehber, localhost geliştirme sunucusunun güvenilir bir şekilde çalışmasını sağlamak için hazırlanmıştır.

## 🚀 Hızlı Başlangıç

### İlk Kurulum (Windows için)
```powershell
# Proje dizinine git
cd C:\SurgeryModule\web

# Ortam değişkenlerini kur
.\setup-env.ps1

# .env dosyasını düzenle (DATABASE_URL ve AUTH_SECRET'ı güncelle)
notepad .env

# Geliştirme sunucusunu başlat
.\start-dev.ps1
```

### İlk Kurulum (Terminal için)
```bash
# Proje dizinine git
cd C:/SurgeryModule/web

# Ortam değişkenlerini kur
./setup-env.sh

# .env dosyasını düzenle
nano .env

# Geliştirme sunucusunu başlat
npm run dev
```

## 📋 Gerekli Adımlar

### 1. Environment Variables (.env dosyası)
`.env` dosyasında şu değerleri güncellemeniz gerekiyor:

```env
# Veritabanı bağlantısı (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@hostname:5432/database"

# Güvenlik anahtarı (Rastgele bir string oluşturun)
AUTH_SECRET="your-super-secret-key-here"
```

### 2. Veritabanı Kurulumu
```bash
npm run db:setup
```

Bu komut:
- Veritabanı bağlantısını test eder
- Auth şemasını yükler
- Migration'ları çalıştırır
- Seed verilerini ekler

### 3. Geliştirme Sunucusunu Başlatma
```bash
npm run dev
```

Sunucu http://localhost:4000 adresinde çalışacak.

## 🔧 Sorun Giderme

### Port 4000 Zaten Kullanılıyor
```powershell
# Port'u kullanan işlemi bul ve durdur
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Veritabanı Bağlantı Hatası
1. `.env` dosyasındaki `DATABASE_URL` değerini kontrol edin
2. Neon dashboard'dan connection string'i kopyaladığınızdan emin olun
3. Firewall ayarlarınızı kontrol edin

### Dependency Hatası
```bash
# Bağımlılıkları yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### Auth Secret Hatası
```bash
# Güvenli bir secret oluştur
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📁 Dosya Yapısı

```
web/
├── .env                    # Ortam değişkenleri (siz oluşturun)
├── setup-env.ps1           # Windows setup script'i
├── setup-env.sh            # Linux/Mac setup script'i
├── start-dev.ps1           # Windows startup script'i
├── start-dev.bat           # Windows batch startup
└── LOCALHOST_SETUP.md      # Bu dosya
```

## 🚀 Otomatik Startup (Önerilen)

Her seferinde aynı sorunları yaşamamak için:

### Windows için:
```powershell
# start-dev.ps1 script'ini kullanın
.\start-dev.ps1
```

### Terminal için:
```bash
# Alias oluşturun
echo "alias start-dev='cd /c/SurgeryModule/web && npm run dev'" >> ~/.bashrc
source ~/.bashrc

# Şimdi sadece bu komutu kullanın
start-dev
```

## 📞 Destek

Eğer hala sorun yaşıyorsanız:

1. `dev-err.log` dosyasını kontrol edin
2. Veritabanı bağlantınızı test edin
3. Node.js ve npm versiyonlarınızı kontrol edin

```bash
node --version
npm --version
```

## ⚡ Hızlı Komutlar

```bash
# Tam reset ve yeniden başlatma
rm -rf node_modules .env
npm install
./setup-env.sh
# .env dosyasını düzenle
npm run db:setup
npm run dev
```
