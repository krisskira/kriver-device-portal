import { useContext } from 'react';
import { LocaleContext } from '../i18n/context';

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useI18n debe usarse dentro de LocaleProvider');
  return context;
}
