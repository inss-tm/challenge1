import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

const savedLanguage = typeof window !== 'undefined'
  ? localStorage.getItem('itc_language') || 'fr'
  : 'fr';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const applyDirection = (lang) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
};

// Apply on initial load
applyDirection(savedLanguage);

i18n.on('languageChanged', (language) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('itc_language', language);
  }
  applyDirection(language);
});

export default i18n;
