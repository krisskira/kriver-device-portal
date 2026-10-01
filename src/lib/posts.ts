import type { Tutorial } from '../types';

export function formatDate(iso?: string, locale: any = 'es') {
  if (!iso) return '';
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`));
}

export function byRelevance(a: Tutorial, b: Tutorial) {
  return (b.rating ?? 0) - (a.rating ?? 0) || (b.published ?? '').localeCompare(a.published ?? '');
}

export function byDate(a: Tutorial, b: Tutorial) {
  return (b.published ?? '').localeCompare(a.published ?? '') || (b.rating ?? 0) - (a.rating ?? 0);
}

export function latestPosts(items: Tutorial[], limit: any = items.length) {
  return [...items].sort(byDate).slice(0, limit);
}

export function relatedPosts(items: Tutorial[], current: Tutorial, limit: any = 3) {
  return [...items]
    .filter((item: any) => item.slug !== current.slug)
    .sort((a: any, b: any) => Number(b.type === current.type) - Number(a.type === current.type) || byRelevance(a, b))
    .slice(0, limit);
}
