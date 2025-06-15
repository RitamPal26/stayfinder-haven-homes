
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  hi: { translation: hi },
};

const getDefaultLanguage = () => {
  // Attempt localStorage, else browser, else 'en'
  return localStorage.getItem('language') ||
    (navigator.language?.split('-')[0] || 'en');
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    supportedLngs: ['en', 'es', 'hi'],
  });

export default i18n;
