import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';

type Item = { slug?: string; published?: string; comingSoon?: boolean };

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/tutoriales', changefreq: 'weekly', priority: '0.9' },
  { path: '/proyectos', changefreq: 'monthly', priority: '0.8' },
  { path: '/sobre-mi', changefreq: 'monthly', priority: '0.7' },
];

const PRIVATE_ROUTES = ['/pagos'];

function readJson(root: string, file: string): { items: Item[] } {
  return JSON.parse(readFileSync(resolve(root, 'src/content', file), 'utf8'));
}

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function sitemap(siteUrl: string, root: string) {
  const today = new Date().toISOString().slice(0, 10);
  const tutorials = readJson(root, 'tutorials/tutorials.json').items.filter((item: any) => !item.comingSoon);
  const projects = readJson(root, 'projects/projects.json').items;
  const newestPost = tutorials.map((item: any) => item.published).filter(Boolean).sort().at(-1);

  const routes = [
    ...STATIC_ROUTES.map((route: any) => ({
      ...route,
      lastmod: route.path === '/tutoriales' ? newestPost || today : today,
    })),
    ...tutorials.map((item: any) => ({
      path: `/tutoriales/${item.slug}`,
      lastmod: item.published || today,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...projects.map((item: any) => ({
      path: `/proyectos/${item.slug}`,
      lastmod: today,
      changefreq: 'yearly',
      priority: '0.6',
    })),
  ];

  const urls = routes
    .map((route: any) => {
      const loc = `${siteUrl}${route.path === '/' ? '/' : route.path}`;
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="es-CO" href="${escapeXml(loc)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(`${loc}?lang=en`)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(loc)}" />
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export function robots(siteUrl: string) {
  const basePath = new URL(siteUrl).pathname.replace(/\/$/, '');

  return `User-agent: *
Allow: /
${PRIVATE_ROUTES.map((route: any) => `Disallow: ${basePath}${route}`).join('\n')}

Sitemap: ${siteUrl}/sitemap.xml
`;
}

/**
 * Sustituye %SITE_URL% en index.html y, al compilar, genera
 * sitemap.xml, robots.txt, llms.txt con URLs absolutas y 404.html
 * (GitHub Pages lo sirve en rutas profundas de la SPA).
 */
export function seoFiles({ siteUrl }: { siteUrl?: string } = {}): Plugin {
  const base = String(siteUrl || '').replace(/\/$/, '');
  let config: ResolvedConfig;

  return {
    name: 'kriver-seo-files',
    configResolved(resolved: any) {
      config = resolved;
    },
    configureServer(server: any) {
      server.middlewares.use((request: any, response: any, next: any) => {
        const path = request.url?.split('?')[0];
        if (path === '/robots.txt') {
          response.setHeader('Content-Type', 'text/plain; charset=utf-8');
          response.end(robots(base));
        } else if (path === '/sitemap.xml') {
          response.setHeader('Content-Type', 'application/xml; charset=utf-8');
          response.end(sitemap(base, config.root));
        } else {
          next();
        }
      });
    },
    transformIndexHtml(html: any) {
      return html.replaceAll('%SITE_URL%', base);
    },
    closeBundle() {
      if (config.command !== 'build') return;
      const outDir = resolve(config.root, config.build.outDir);
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap(base, config.root));
      writeFileSync(resolve(outDir, 'robots.txt'), robots(base));
      const llms = resolve(outDir, 'llms.txt');
      writeFileSync(llms, readFileSync(llms, 'utf8').replace(/\]\(\//g, `](${base}/`));
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}
