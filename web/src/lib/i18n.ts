export type Locale = 'tr' | 'en';

const messages: Record<Locale, Record<string, string>> = {
	tr: {
		'surgery.today': 'Bugünün Programı',
		'surgery.orStatus': 'Ameliyathane Durumu',
		'sterilization.active': 'Aktif Döngüler',
	},
	en: {
		'surgery.today': "Today's Program",
		'surgery.orStatus': 'Operating Room Status',
		'sterilization.active': 'Active Cycles',
	},
};

let currentLocale: Locale = 'tr';

export function setLocale(locale: Locale) {
	currentLocale = locale;
}

export function t(key: string): string {
	return messages[currentLocale]?.[key] ?? key;
}


