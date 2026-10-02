/**
 * Único acceso a datos de la landing.
 *
 * Hoy resuelve los JSON de src/content/<página>/.
 * Para usar un backend, define VITE_API_BASE (sin barra final).
 * Las rutas se mantienen: /site/site, /home/home, /projects/projects,
 * /tutorials/tutorials.
 */
const modules = import.meta.glob<{ default: unknown }>('../content/**/*.json');

export async function apiGet<T>(path: string): Promise<T> {
  const remote = import.meta.env.VITE_API_BASE;

  if (remote) {
    const url = `${String(remote).replace(/\/$/, '')}${path}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error ${response.status} al cargar ${path}`);
    }
    return response.json() as Promise<T>;
  }

  const suffix = `${path}.json`.replace(/^\//, '');
  const loader = Object.entries(modules).find(([key]: any) => key.endsWith(suffix))?.[1];

  if (!loader) {
    throw new Error(`No hay datos locales para ${path}`);
  }

  const file = await loader();
  return file.default as T;
}
