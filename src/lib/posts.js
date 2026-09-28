export function formatDate(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(`${iso}T12:00:00`),
  );
}

export function byRelevance(a, b) {
  return (b.rating ?? 0) - (a.rating ?? 0) || (b.published ?? '').localeCompare(a.published ?? '');
}

export function byDate(a, b) {
  return (b.published ?? '').localeCompare(a.published ?? '') || (b.rating ?? 0) - (a.rating ?? 0);
}

export function latestPosts(items, limit) {
  return [...items].sort(byDate).slice(0, limit);
}

export function relatedPosts(items, current, limit = 3) {
  return [...items]
    .filter((item) => item.slug !== current.slug)
    .sort((a, b) => (b.type === current.type) - (a.type === current.type) || byRelevance(a, b))
    .slice(0, limit);
}
