const files = import.meta.glob<string>('./mock/*.{jpg,png,svg}', { eager: true, import: 'default' });
const postFiles = import.meta.glob<string>('./posts/**/*.{jpg,png,webp,svg,mp4}', { eager: true, import: 'default' });
const aboutFiles = import.meta.glob<string>('./about/*.{jpg,png,webp}', { eager: true, import: 'default' });

export const media: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]: any) => [path.replace('./mock/', '').replace(/\.\w+$/, ''), url]),
);

// Medios de posts: se referencian como "posts/<post>/<archivo>" (con extensión).
for (const [path, url] of Object.entries({ ...postFiles, ...aboutFiles })) {
  media[path.replace('./', '')] = url;
}

export function mediaUrl(value?: string) {
  if (!value) return undefined;
  return media[value] || value;
}
