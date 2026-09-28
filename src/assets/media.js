const files = import.meta.glob('./mock/*.{jpg,png,svg}', { eager: true, import: 'default' });

export const media = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace('./mock/', '').replace(/\.\w+$/, ''), url]),
);

export function mediaUrl(value) {
  if (!value) return undefined;
  return media[value] || value;
}
