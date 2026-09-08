import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const getSavedLanguage = () => {
  const user = getCurrentUser();

  if (!user) {
    return 'en';
  }

  const userId = user._id || user.id || user.email;

  return localStorage.getItem(`appLanguage_${userId}`) || 'en';
};

const savedLanguage = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },

  lng: savedLanguage,

  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;