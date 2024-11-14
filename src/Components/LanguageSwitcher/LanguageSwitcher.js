// LanguageSwitcher.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css'
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // ذخیره زبان انتخابی در localStorage
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('fa')}>فارسی</button>
    </div>
  );
}

export default LanguageSwitcher;
