import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../api/client';
import { localize } from '../i18n/localize';
import { useI18n } from './useI18n';

export function useContent<T>(path: string) {
  const { locale } = useI18n();
  return useQuery({
    queryKey: ['content', path],
    queryFn: () => apiGet<T>(path),
    select: useCallback((data: T) => localize(data, locale) as T, [locale]),
  });
}
