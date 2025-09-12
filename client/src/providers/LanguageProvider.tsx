import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n from '@/i18n';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createOliveTheme } from '@/theme';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  mode: 'light' | 'dark';
  toggleDarkMode: () => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);
export const useLanguage = () => useContext(LanguageContext)!;
// בתוך LanguageProvider.tsx
import { useTranslation } from 'react-i18next';

export function useDirection() {
  const { i18n } = useTranslation();
  return i18n.dir(); // מחזיר 'rtl' או 'ltr'
}

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('i18nextLng') || 'en');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const direction = language === 'he' ? 'rtl' : 'ltr';

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setLanguageState(lang);
  };

  const toggleDarkMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
  }, [direction]);

  const theme = useMemo(() => createOliveTheme(mode), [mode]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, mode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LanguageContext.Provider>
  );
};
