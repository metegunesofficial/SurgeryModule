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
		'/gorevler',
        '/canli-izleme',
		'/randevular',
        '/personel',
        '/sterilizasyon',
        '/uyum',
    ],
} satisfies Config;
