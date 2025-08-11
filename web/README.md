Ameliyathane & Sterilizasyon Yönetim Sistemi – Web (Next.js)

## Başlangıç

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Uygulama `http://localhost:3000` adresinde çalışır. Varsayılan yönlendirme `Dashboard`'adır.

### Test Çalıştırma

```bash
npm test
```

Unit testler Vitest ile koşturulur. `web/vitest.config.ts` yapılandırmasını kullanır.

### Rollere Göre API Yetkilendirme

Geliştirme aşamasında `x-role` header'ı üzerinden rol geçilir:

```http
POST /api/surgeries
x-role: doctor
```

Desteklenen roller: `admin | doctor | nurse | technician | quality_manager`.

### TV Ekranı ve Canlı Veri

- JSON: `/api/display/surgeries`
- SSE: `/api/display/live`
- UI: `/display`

Ameliyat oluşturulduğunda canlı yayın ile ekran güncellenir.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Diğer

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Dağıtım

Vercel önerilir. `next.config.ts` içinde temel güvenlik başlıkları tanımlıdır. Gerekli env değişkenleri için kökte `.env.example` dosyasını referans alın.

## API Dokümanı
- OpenAPI JSON: `/api/openapi.json`

## UI Kılavuzu
- UI kılavuzu `web/docs/ui-guide.md` dosyasında tutulur (oluşturulabilir).
