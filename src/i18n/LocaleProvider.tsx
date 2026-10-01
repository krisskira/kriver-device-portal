import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '../types';
import { LocaleContext } from './context';
import { translate, type MessageKey } from './messages';

const STORAGE_KEY = 'kriver-locale';

function readLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'es') return fromUrl;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'es') return stored;
  return browserLocale();
}

function browserLocale(): Locale {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of preferred) {
    const code = String(tag || '').toLowerCase().slice(0, 2);
    if (code === 'en' || code === 'es') return code;
  }
  return 'es';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readLocale);
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: MessageKey, vars?: Record<string, string>) => translate(locale, key, vars),
    }),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'es-CO';
    localStorage.setItem(STORAGE_KEY, locale);
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== locale) {
      url.searchParams.set('lang', locale);
      window.history.replaceState(window.history.state, '', url);
    }
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
