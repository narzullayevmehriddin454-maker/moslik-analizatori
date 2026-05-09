import { useState, useEffect } from 'react';
export type Language = 'UZ' | 'RU' | 'EN';
export function useLanguage() {
  const [lang, setLang] = useState<Language>('UZ');
  useEffect(() => {
    const saved = localStorage.getItem('moslik_lang') as Language;
    if (saved && ['UZ', 'RU', 'EN'].includes(saved)) setLang(saved);
  }, []);
  const changeLang = (l: Language) => { setLang(l); localStorage.setItem('moslik_lang', l); };
  return { lang, changeLang };
}