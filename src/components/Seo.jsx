import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { mediaUrl } from '../assets/media';

const SITE_NAME = 'Kriver Devices';
const OWNER = 'Cristian David Vergara Gómez';
const HOME_TITLE = 'Kriver Devices | Apps móviles, sitios web e IoT a la medida';
const DEFAULT_DESCRIPTION =
  'Kriver Devices diseña y desarrolla apps móviles iOS y Android, sitios y aplicaciones web full stack y soluciones IoT con ESP32 y STM32, desde la idea hasta producción.';
const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
const SERVICES = [
  ['Apps móviles', 'iOS, Android y multiplataforma'],
  ['Sitios y aplicaciones web', 'Full stack, cloud, web y TV'],
  ['Hardware e Internet of Things', 'ESP32, STM32, IoT y Linux embebido'],
];

function siteUrl() {
  return String(import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
}

function absolute(url) {
  return url ? new URL(url, window.location.href).href : undefined;
}

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function setOrRemoveMeta(property, content) {
  const selector = `meta[property="${property}"]`;
  if (content) setMeta(selector, { property, content });
  else document.head.querySelector(selector)?.remove();
}

function setLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function breadcrumb(base, trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${base}${path}`,
    })),
  };
}

export function Seo() {
  const { pathname } = useLocation();
  const siteQuery = useContent('/site/site');
  const projectsQuery = useContent('/projects/projects');
  const tutorialsQuery = useContent('/tutorials/tutorials');

  const metadata = useMemo(() => {
    const projects = projectsQuery.data;
    const tutorials = tutorialsQuery.data;
    const projectSlug = pathname.match(/^\/proyectos\/([^/]+)$/)?.[1];
    const tutorialSlug = pathname.match(/^\/tutoriales\/([^/]+)$/)?.[1];
    const project = projects?.items.find((item) => item.slug === projectSlug);
    const tutorial = tutorials?.items.find((item) => item.slug === tutorialSlug);

    if (project) {
      return {
        title: `${project.title} | ${SITE_NAME}`,
        description: project.summary,
        type: 'article',
        image: project.cover,
        section: 'Proyectos',
        tags: project.tags,
        project,
      };
    }
    if (tutorial) {
      return {
        title: `${tutorial.title} | ${SITE_NAME}`,
        description: tutorial.excerpt,
        type: 'article',
        image: tutorial.cover,
        section: tutorial.type === 'video' ? 'Videos' : 'Blog',
        published: tutorial.published,
        tutorial,
      };
    }

    const routes = {
      '/': { title: HOME_TITLE, description: DEFAULT_DESCRIPTION },
      '/proyectos': {
        title: `Proyectos personales | ${SITE_NAME}`,
        description: projects?.lead || DEFAULT_DESCRIPTION,
        collection: projects?.items.map((item) => [item.title, `/proyectos/${item.slug}`]),
      },
      '/tutoriales': {
        title: `Tutoriales y blog de desarrollo e IoT | ${SITE_NAME}`,
        description: tutorials?.lead || DEFAULT_DESCRIPTION,
        collection: tutorials?.items.map((item) => [item.title, `/tutoriales/${item.slug}`]),
      },
      '/pagos': {
        title: `Pagos | ${SITE_NAME}`,
        description: 'Formulario de pago simulado de Kriver Devices.',
        noIndex: true,
      },
    };
    return (
      routes[pathname] || {
        title: `Página no encontrada | ${SITE_NAME}`,
        description: DEFAULT_DESCRIPTION,
        noIndex: true,
      }
    );
  }, [pathname, projectsQuery.data, tutorialsQuery.data]);

  useEffect(() => {
    const site = siteQuery.data;
    const base = siteUrl();
    const canonical = `${base}${pathname === '/' ? '/' : pathname}`;
    const image = absolute(mediaUrl(metadata.image)) || `${base}/brand/og-cover.png`;
    const imageAlt = metadata.image ? metadata.title.replace(` | ${SITE_NAME}`, '') : 'Kriver Devices, soluciones tecnológicas';
    const robots = metadata.noIndex ? 'noindex, nofollow' : INDEX_ROBOTS;
    const owner = site?.owner || OWNER;
    const sameAs = [site?.linkedin, site?.github].filter(Boolean);

    document.title = metadata.title;
    setMeta('meta[name="description"]', { name: 'description', content: metadata.description });
    setMeta('meta[name="author"]', { name: 'author', content: owner });
    setMeta('meta[name="robots"]', { name: 'robots', content: robots });
    setMeta('meta[name="googlebot"]', { name: 'googlebot', content: robots });
    setMeta('meta[name="bingbot"]', { name: 'bingbot', content: robots });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: metadata.type || 'website' });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:image:secure_url"]', { property: 'og:image:secure_url', content: image });
    setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: imageAlt });
    setOrRemoveMeta('og:image:type', metadata.image ? undefined : 'image/png');
    setOrRemoveMeta('og:image:width', metadata.image ? undefined : '1200');
    setOrRemoveMeta('og:image:height', metadata.image ? undefined : '630');
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'es_CO' });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    setOrRemoveMeta('article:published_time', metadata.published);
    setOrRemoveMeta('article:section', metadata.section);
    setOrRemoveMeta('article:author', metadata.type === 'article' ? site?.linkedin : undefined);
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: imageAlt });
    setLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    setLink('link[rel="alternate"][hreflang="es-CO"]', { rel: 'alternate', hreflang: 'es-CO', href: canonical });
    setLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: canonical });

    const person = { '@id': `${base}/#person` };
    const business = { '@id': `${base}/#business` };
    const graph = [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: SITE_NAME,
        inLanguage: 'es-CO',
        description: DEFAULT_DESCRIPTION,
        publisher: business,
      },
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': `${base}/#business`,
        name: SITE_NAME,
        url: `${base}/`,
        logo: `${base}/brand/logo.svg`,
        image: `${base}/brand/og-cover.png`,
        description: DEFAULT_DESCRIPTION,
        email: site?.email,
        telephone: site?.phone,
        address: { '@type': 'PostalAddress', addressCountry: 'CO' },
        areaServed: [
          { '@type': 'Country', name: 'Colombia' },
          { '@type': 'Place', name: 'Remoto' },
        ],
        knowsAbout: ['React', 'Node.js', 'TypeScript', 'Kotlin', 'Swift', 'Docker', 'ESP32', 'STM32', 'Linux embebido', 'IoT'],
        sameAs,
        founder: person,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: site?.phone,
          email: site?.email,
          contactType: 'customer service',
          availableLanguage: ['Spanish', 'English'],
          url: `${base}/#contacto`,
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicios tecnológicos',
          itemListElement: SERVICES.map(([name, description]) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name, description, provider: business },
          })),
        },
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: owner,
        email: site?.email,
        telephone: site?.phone,
        url: site?.linkedin,
        sameAs,
        worksFor: business,
        jobTitle: 'Desarrollador e ingeniero',
      },
    ];

    if (!metadata.noIndex) {
      graph.push({
        '@type': metadata.collection ? 'CollectionPage' : 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: metadata.title,
        description: metadata.description,
        inLanguage: 'es-CO',
        isPartOf: { '@id': `${base}/#website` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        ...(pathname === '/' ? { about: business } : {}),
        ...(metadata.collection
          ? {
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: metadata.collection.map(([name, path], index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  name,
                  url: `${base}${path}`,
                })),
              },
            }
          : {}),
      });
    }

    if (metadata.tutorial) {
      const item = metadata.tutorial;
      graph.push(
        {
          '@type': 'BlogPosting',
          '@id': `${canonical}#article`,
          headline: item.title,
          description: item.excerpt,
          image,
          url: canonical,
          datePublished: item.published,
          dateModified: item.published,
          inLanguage: 'es-CO',
          articleSection: metadata.section,
          timeRequired: item.minutes ? `PT${item.minutes}M` : undefined,
          author: person,
          publisher: business,
          mainEntityOfPage: { '@id': `${canonical}#webpage` },
          ...(item.rating ? { contentRating: `${item.rating}/5` } : {}),
        },
        breadcrumb(base, [
          ['Inicio', '/'],
          ['Tutoriales', '/tutoriales'],
          [item.title, pathname],
        ]),
      );
    } else if (metadata.project) {
      const item = metadata.project;
      graph.push(
        {
          '@type': 'CreativeWork',
          '@id': `${canonical}#project`,
          name: item.title,
          description: item.summary,
          image,
          url: canonical,
          dateCreated: item.year,
          keywords: item.tags?.join(', '),
          inLanguage: 'es-CO',
          creator: person,
          publisher: business,
          mainEntityOfPage: { '@id': `${canonical}#webpage` },
        },
        breadcrumb(base, [
          ['Inicio', '/'],
          ['Proyectos', '/proyectos'],
          [item.title, pathname],
        ]),
      );
    } else if (metadata.collection) {
      graph.push(
        breadcrumb(base, [
          ['Inicio', '/'],
          [pathname === '/tutoriales' ? 'Tutoriales' : 'Proyectos', pathname],
        ]),
      );
    }

    let script = document.getElementById('kriver-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'kriver-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [metadata, pathname, siteQuery.data]);

  return null;
}
