import type { Config } from '@react-router/dev/config';

export default {
    appDirectory: './src/app',
    ssr: true,
    prerender: [
        '/',
        '/account',
        '/ameliyat-planlama',
        '/ayarlar',
        '/bildirimler',
        '/canli-izleme',
        '/personel',
        '/sterilizasyon',
        '/uyum',
    ],
} satisfies Config;
