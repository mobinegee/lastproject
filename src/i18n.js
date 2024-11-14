// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// بررسی اینکه زبان ذخیره‌شده در localStorage وجود داره یا نه
const savedLanguage = localStorage.getItem('language') || 'en'; // پیش‌فرض 'en' است

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      description: "This is a sample description",
      h1 : 'instagram'
    },
  },
  fa: {
    translation: {
      welcome: "خوش آمدید",
      description: "این یک توضیح نمونه است",
      h1 : 'اینستاگرام',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // زبان پیش‌فرض را به زبان ذخیره‌شده در localStorage تغییر دهید
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
