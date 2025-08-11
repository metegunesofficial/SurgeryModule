# UI Kılavuzu

- Renkler ve tema: değişkenler `src/app/globals.css` içinde. Yardımcı sınıflar: `card`, `btn-primary`.
- Layout: `Sidebar` + `Header` `app/layout.tsx` içinde. Mobilde hamburger ile `Sidebar` aç/kapa.

## Bildirimler
```tsx
import { useToast } from '@/components/ui/Toast';

function SaveButton() {
  const { show } = useToast();
  return (
    <button className="btn-primary px-3 py-2" onClick={() => show('Kaydedildi', 'success')}>
      Kaydet
    </button>
  );
}
```

## TV Ekranı
- JSON: `/api/display/surgeries`
- SSE: `/api/display/live`
- UI: `/display`

## Formlar
- `Surgeries` sayfasında React Hook Form + Zod kullanılmakta.

## Erişilebilirlik
- Skip link: “İçeriğe atla” `Header` altında.
- `:focus-visible` stilleri etkin.
