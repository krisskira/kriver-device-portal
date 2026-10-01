import catalog from './en.json' with { type: 'json' };
import type { Locale } from '../types';

const phrases = catalog as Record<string, string>;

const KEEP = new Set([
  'slug',
  'id',
  'icon',
  'href',
  'to',
  'cover',
  'poster',
  'currency',
  'year',
  'type',
  'published',
  'code',
  'shortName',
  'owner',
]);

function keepAsIs(key: string, value: unknown) {
  if (KEEP.has(key)) return true;
  return (
    typeof value === 'string' &&
    (/^https?:/.test(value) || value.startsWith('/') || value.startsWith('+') || value.includes('@'))
  );
}

function isLocaleMessage(value: object): value is { es: string; en: string } {
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  return keys.length === 2 && typeof record.es === 'string' && typeof record.en === 'string';
}

export function localize(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item: any) => localize(item, locale));
  if (value && typeof value === 'object') {
    if (isLocaleMessage(value)) return value[locale] || value.es;
    return Object.fromEntries(
      Object.entries(value).map(([key, item]: any) => [key, keepAsIs(key, item) ? item : localize(item, locale)]),
    );
  }
  if (typeof value === 'string' && locale === 'en') return phrases[value] ?? value;
  return value;
}
