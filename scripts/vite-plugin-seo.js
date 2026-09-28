import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/tutoriales', changefreq: 'weekly', priority: '0.9' },
  { path: '/proyectos', changefreq: 'monthly', priority: '0.8' },
];

const PRIVATE_ROUTES = ['/pagos'];

function readJson(root, file) {
  return JSON.parse(readFileSync(resolve(root, 'src/content', file), 'utf8'));
}

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sitemap(siteUrl, root) {
  const today = new Date().toISOString().slice(0, 10);
  const tutorials = readJson(root, 'tutorials/tutorials.json').items;
  const projects = readJson(root, 'projects/projects.json').items;
  const newestPost = tutorials.map((item) => item.published).filter(Boolean).sort().at(-1);

  const routes = [
    ...STATIC_ROUTES.map((route) => ({
      ...route,
      lastmod: route.path === '/tutoriales' ? newestPost || today : today,
    })),
    ...tutorials.map((item) => ({
      path: `/tutoriales/${item.slug}`,
      lastmod: item.published || today,
      changefreq: 'monthly',
      priority: '0.7',
    })),
    ...projects.map((item) => ({
      path: `/proyectos/${item.slug}`,
      lastmod: today,
      changefreq: 'yearly',
      priority: '0.6',
    })),
  ];

  const urls = routes
    .map(
      (route) => `  <url>
    <loc>${escapeXml(`${siteUrl}${route.path === '/' ? '/' : route.path}`)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function robots(siteUrl) {
  const basePath = new URL(siteUrl).pathname.replace(/\/$/, '');

  return `User-agent: *
Allow: /
${PRIVATE_ROUTES.map((route) => `Disallow: ${basePath}${route}`).join('\n')}

Sitemap: ${siteUrl}/sitemap.xml
`;
}

/**
 * Sustituye %SITE_URL% en index.html y, al compilar, genera
 * sitemap.xml, robots.txt, llms.txt con URLs absolutas y 404.html
 * (GitHub Pages lo sirve en rutas profundas de la SPA).
 */
export function seoFiles({ siteUrl }) {
  const base = String(siteUrl || '').replace(/\/$/, '');
  let config;

  return {
    name: 'kriver-seo-files',
    configResolved(resolved) {
      config = resolved;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
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
    transformIndexHtml(html) {
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
