import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

const DEFAULT_DESCRIPTION =
  'Portafolio de Kriver Devices: desarrollo de aplicaciones, sitios web, soluciones IoT, proyectos y tutoriales tecnológicos.';

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

export function Seo() {
  const { pathname } = useLocation();
  const siteQuery = useContent('/site/site');
  const projectsQuery = useContent('/projects/projects');
  const tutorialsQuery = useContent('/tutorials/tutorials');

  const metadata = useMemo(() => {
    const site = siteQuery.data;
    const projects = projectsQuery.data;
    const tutorials = tutorialsQuery.data;
    const projectSlug = pathname.match(/^\/proyectos\/([^/]+)$/)?.[1];
    const tutorialSlug = pathname.match(/^\/tutoriales\/([^/]+)$/)?.[1];
    const project = projects?.items.find((item) => item.slug === projectSlug);
    const tutorial = tutorials?.items.find((item) => item.slug === tutorialSlug);

    if (project) {
      return {
        title: `${project.title} | Kriver Devices`,
        description: project.summary,
        type: 'article',
      };
    }
    if (tutorial) {
      return {
        title: `${tutorial.title} | Kriver Devices`,
        description: tutorial.excerpt,
        type: 'article',
      };
    }

    const routes = {
      '/': {
        title: 'Kriver Devices | Soluciones tecnológicas',
        description: site?.description || DEFAULT_DESCRIPTION,
      },
      '/proyectos': {
        title: 'Proyectos personales | Kriver Devices',
        description: projects?.lead || DEFAULT_DESCRIPTION,
      },
      '/tutoriales': {
        title: 'Tutoriales y blog | Kriver Devices',
        description: tutorials?.lead || DEFAULT_DESCRIPTION,
      },
      '/pagos': {
        title: 'Pagos | Kriver Devices',
        description: 'Formulario de pago simulado de Kriver Devices.',
        noIndex: true,
      },
    };
    return routes[pathname] || {
      title: 'Página no encontrada | Kriver Devices',
      description: DEFAULT_DESCRIPTION,
      noIndex: true,
    };
  }, [pathname, projectsQuery.data, siteQuery.data, tutorialsQuery.data]);

  useEffect(() => {
    const site = siteQuery.data;
    const configuredUrl = String(import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    const canonical = `${configuredUrl}${pathname === '/' ? '' : pathname}`;
    const image = `${configuredUrl}/brand/og-cover.png`;
    const robots = metadata.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

    document.title = metadata.title;
    setMeta('meta[name="description"]', { name: 'description', content: metadata.description });
    setMeta('meta[name="author"]', { name: 'author', content: site?.owner || 'Cristian David Vergara Gómez' });
    setMeta('meta[name="robots"]', { name: 'robots', content: robots });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: metadata.title });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: metadata.description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: metadata.type || 'website' });
    setMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    setMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    setMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    setMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    setMeta('meta[property="og:image:alt"]', {
      property: 'og:image:alt',
      content: 'Kriver Devices, soluciones tecnológicas',
    });
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'es_CO' });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Kriver Devices' });
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    setLink('canonical', canonical);

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${configuredUrl}/#website`,
          url: `${configuredUrl}/`,
          name: 'Kriver Devices',
          inLanguage: 'es-CO',
          description: site?.description || DEFAULT_DESCRIPTION,
          publisher: { '@id': `${configuredUrl}/#business` },
        },
        {
          '@type': ['ProfessionalService', 'Organization'],
          '@id': `${configuredUrl}/#business`,
          name: 'Kriver Devices',
          url: `${configuredUrl}/`,
          logo: `${configuredUrl}/brand/logo.svg`,
          image,
          description: site?.description || DEFAULT_DESCRIPTION,
          email: site?.email,
          telephone: site?.phone,
          areaServed: { '@type': 'Country', name: 'Colombia' },
          sameAs: [site?.linkedin, site?.github].filter(Boolean),
          founder: { '@id': `${configuredUrl}/#person` },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: site?.phone,
            email: site?.email,
            contactType: 'customer service',
            availableLanguage: ['Spanish'],
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios tecnológicos',
            itemListElement: [
              'Desarrollo de aplicaciones móviles',
              'Desarrollo de aplicaciones y sitios web',
              'Soluciones IoT y prototipos',
            ].map((name) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name },
            })),
          },
        },
        {
          '@type': 'Person',
          '@id': `${configuredUrl}/#person`,
          name: site?.owner || 'Cristian David Vergara Gómez',
          email: site?.email,
          telephone: site?.phone,
          url: site?.linkedin,
          sameAs: [site?.linkedin, site?.github].filter(Boolean),
          worksFor: { '@id': `${configuredUrl}/#business` },
          jobTitle: 'Desarrollador e ingeniero',
        },
      ],
    };

    let script = document.getElementById('kriver-structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'kriver-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, [metadata, pathname, siteQuery.data]);

  return null;
}
