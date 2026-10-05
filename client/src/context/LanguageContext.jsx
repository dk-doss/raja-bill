import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('raja_store_lang') || 'en';
  });

  const setLanguage = (newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('raja_store_lang', newLang);
    } catch (e) {}
  };

  const toggleLanguage = () => {
    setLanguage(lang === 'en' ? 'ta' : 'en');
  };

  const t = (key, params = {}) => {
    const dict = translations[lang] || translations.en;
    let text = dict[key] || translations.en[key] || key;

    // Replace {param} placeholders if present
    Object.keys(params).forEach((paramKey) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
