import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type ThemeName } from './context';

const STORAGE_KEY = 'kriver-theme';

function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta: any) => meta.setAttribute('content', theme === 'dark' ? '#242424' : '#f7f7f7'));
  }, [theme]);

  const toggle = () => setTheme((current: any) => (current === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
