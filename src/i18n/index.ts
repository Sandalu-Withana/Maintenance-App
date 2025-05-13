import { en } from './locales/en';
import { fr } from './locales/fr';
import { create } from 'zustand';

type Locale = 'en' | 'fr';

type I18nStore = {
  locale: Locale;
  translations: {
    en: typeof en;
    fr: typeof fr;
  };
  t: (key: string, params?: Record<string, any>) => string;
  setLocale: (locale: Locale) => void;
};

export const useI18n = create<I18nStore>((set, get) => ({
  locale: 'en',
  translations: {
    en,
    fr,
  },
  t: (key: string, params?: Record<string, any>) => {
    const { locale, translations } = get();
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as any)[k];
        } else {
          return key;
        }
      } else {
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce(
        (acc: string, [paramKey, paramValue]) => {
          return acc.replace(
            new RegExp(`{{${paramKey}}}`, 'g'),
            String(paramValue)
          );
        },
        value as string
      );
    }

    return typeof value === 'string' ? value : key;
  },
  setLocale: (locale: Locale) => set({ locale }),
}));
