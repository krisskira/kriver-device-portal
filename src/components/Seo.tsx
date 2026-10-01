import type { AboutContent, ProjectsContent, SiteContent, TutorialsContent } from '../types';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { mediaUrl } from '../assets/media';
import { useI18n } from '../hooks/useI18n';

const SITE_NAME = 'Kriver Devices';
const OWNER = 'Crhistian David Vergara Gómez';
const INDEX_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
const THIN_ROBOTS = 'noindex, follow';
const PRIVATE_ROBOTS = 'noindex, nofollow';

type PageMeta = {
  title: string;
  description: string;
  type?: string;
  image?: string;
  section?: string;
  tags?: string[];
  project?: ProjectsContent['items'][number];
  published?: string;
  video?: TutorialsContent['items'][number]['video'];
  robots?: string;
  tutorial?: TutorialsContent['items'][number];
  profile?: boolean;
  collection?: string[][];
};

function siteUrl() {
  return String(import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
}

function absolute(url: any) {
  return url ? new URL(url, window.location.href).href : undefined;
}

function setMeta(selector: any, attributes: any) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]: any) => element.setAttribute(key, value));
}

function setOrRemoveMeta(property: any, content: any) {
  const selector = `meta[property="${property}"]`;
  if (content) setMeta(selector, { property, content });
  else document.head.querySelector(selector)?.remove();
}

function setNamedMeta(name: any, content: any) {
  const selector = `meta[name="${name}"]`;
  if (content) setMeta(selector, { name, content });
  else document.head.querySelector(selector)?.remove();
}

function setMetaList(property: any, values: any = []) {
  document.head.querySelectorAll(`meta[property="${property}"]`).forEach((element: any) => element.remove());
  values.forEach((content: any) => {
    const element = document.createElement('meta');
    element.setAttribute('property', property);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  });
}

function setLink(selector: any, attributes: any) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]: any) => element.setAttribute(key, value));
}

function breadcrumb(base: any, trail: any) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path]: any, index: any) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${base}${path}`,
    })),
  };
}

function personNode(base: any, site: any, about: any, t: any, language: any) {
  const sameAs = [site?.linkedin, site?.github, site?.facebook, site?.orcid].filter(Boolean);
  const node = {
    '@type': 'Person',
    '@id': `${base}/#person`,
    name: about?.name || site?.owner || OWNER,
    alternateName: about?.alternateName,
    url: `${base}/sobre-mi`,
    image: about?.photo,
    email: site?.email,
    telephone: site?.phone,
    jobTitle: about?.role || t('seo.jobTitle'),
    description: about?.summary,
    sameAs,
    worksFor: { '@id': `${base}/#business` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Palmira',
      addressRegion: 'Valle del Cauca',
      addressCountry: 'CO',
    },
    nationality: { '@type': 'Country', name: 'Colombia' },
  };
  if (!about) return node;

  return {
    ...node,
    knowsAbout: about.skills.flatMap((group: any) => group.items),
    knowsLanguage: about.languages.map((item: any) => ({ '@type': 'Language', name: item.name, alternateName: item.code })),
    alumniOf: about.education.map((item: any) => ({ '@type': 'EducationalOrganization', name: item.org })),
    hasCredential: [
      ...about.education.map((item: any) => ({
        '@type': 'EducationalOccupationalCredential',
        name: item.name,
        credentialCategory: 'degree',
        recognizedBy: { '@type': 'EducationalOrganization', name: item.org },
      })),
      ...about.certifications.map((item: any) => ({
        '@type': 'EducationalOccupationalCredential',
        name: item.name,
        credentialCategory: 'certificate',
        dateCreated: item.date,
        recognizedBy: { '@type': 'Organization', name: item.issuer },
      })),
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: about.role,
      occupationLocation: { '@type': 'Country', name: 'Colombia' },
      skills: about.skills.flatMap((group: any) => group.items).join(', '),
      experienceRequirements: {
        '@type': 'OccupationalExperienceRequirements',
        monthsOfExperience: monthsSince(about.since),
      },
      inLanguage: language,
    },
  };
}

function monthsSince(value: any) {
  if (!value) return undefined;
  const [year, month] = value.split('-').map(Number);
  const now = new Date();
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
}

export function Seo() {
  const { pathname } = useLocation();
  const { locale, t } = useI18n();
  const siteQuery = useContent<SiteContent>('/site/site');
  const aboutQuery = useContent<AboutContent>('/about/about');
  const projectsQuery = useContent<ProjectsContent>('/projects/projects');
  const tutorialsQuery = useContent<TutorialsContent>('/tutorials/tutorials');

  const metadata = useMemo((): PageMeta => {
    const projects = projectsQuery.data;
    const tutorials = tutorialsQuery.data;
    const projectSlug = pathname.match(/^\/proyectos\/([^/]+)$/)?.[1];
    const tutorialSlug = pathname.match(/^\/tutoriales\/([^/]+)$/)?.[1];
    const project = projects?.items.find((item: any) => item.slug === projectSlug);
    const tutorial = tutorials?.items.find((item: any) => item.slug === tutorialSlug);

    if (project) {
      return {
        title: `${project.title} | ${SITE_NAME}`,
        description: project.summary,
        type: 'article',
        image: project.cover,
        section: t('seo.projects'),
        tags: project.tags,
        project,
      };
    }
    if (tutorial) {
      return {
        title: `${tutorial.title} | ${SITE_NAME}`,
        description: tutorial.excerpt,
        type: 'article',
        image: tutorial.video?.poster || tutorial.cover,
        section: tutorial.type === 'video' ? t('seo.videos') : t('seo.blog'),
        published: tutorial.published,
        tags: tutorial.tags,
        video: tutorial.comingSoon ? undefined : tutorial.video,
        robots: tutorial.comingSoon ? THIN_ROBOTS : undefined,
        tutorial,
      };
    }

    const routes = {
      '/': { title: t('seo.homeTitle'), description: t('seo.homeDescription') },
      '/proyectos': {
        title: t('seo.projectsTitle'),
        description: projects?.lead || t('seo.homeDescription'),
        collection: projects?.items.map((item: any) => [item.title, `/proyectos/${item.slug}`]),
      },
      '/tutoriales': {
        title: t('seo.tutorialsTitle'),
        description: tutorials?.lead || t('seo.homeDescription'),
        collection: tutorials?.items
          .filter((item: any) => !item.comingSoon)
          .map((item: any) => [item.title, `/tutoriales/${item.slug}`]),
      },
      '/sobre-mi': {
        title: t('seo.aboutTitle'),
        description: aboutQuery.data?.summary || t('seo.aboutDescription'),
        type: 'profile',
        image: aboutQuery.data?.photo,
        profile: true,
      },
      '/pagos': {
        title: t('seo.paymentsTitle'),
        description: t('seo.paymentsDescription'),
        robots: PRIVATE_ROBOTS,
      },
    };
    const pages = routes as Record<string, (typeof routes)[keyof typeof routes]>;
    return (
      pages[pathname] || {
        title: t('seo.notFound'),
        description: t('seo.homeDescription'),
        robots: PRIVATE_ROBOTS,
      }
    );
  }, [pathname, projectsQuery.data, tutorialsQuery.data, aboutQuery.data, t]);

  useEffect(() => {
    const site = siteQuery.data;
    const about = aboutQuery.data;
    const base = siteUrl();
    const pageUrl = `${base}${pathname === '/' ? '/' : pathname}`;
    const englishUrl = `${pageUrl}?lang=en`;
    const canonical = locale === 'en' ? englishUrl : pageUrl;
    const image = absolute(mediaUrl(metadata.image)) || `${base}/brand/og-cover.png`;
    const language = locale === 'en' ? 'en' : 'es-CO';
    const imageAlt = metadata.image ? metadata.title.replace(` | ${SITE_NAME}`, '') : t('seo.imageAlt');
    const robots = metadata.robots || INDEX_ROBOTS;
    const indexable = robots === INDEX_ROBOTS;
    const owner = about?.name || site?.owner || OWNER;
    const keywords = metadata.tags?.length ? [...metadata.tags, SITE_NAME, owner].join(', ') : t('seo.keywords');
    const videoUrl = metadata.video ? absolute(mediaUrl(metadata.video.src)) : undefined;

    document.title = metadata.title;
    setMeta('meta[name="description"]', { name: 'description', content: metadata.description });
    setNamedMeta('keywords', keywords);
    setMeta('meta[name="author"]', { name: 'author', content: owner });
    setMeta('meta[name="creator"]', { name: 'creator', content: owner });
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
    setOrRemoveMeta('og:video', videoUrl);
    setOrRemoveMeta('og:video:type', videoUrl ? 'video/mp4' : undefined);
    setMeta('meta[property="og:locale"]', { property: 'og:locale', content: locale === 'en' ? 'en_US' : 'es_CO' });
    setMeta('meta[property="og:locale:alternate"]', {
      property: 'og:locale:alternate',
      content: locale === 'en' ? 'es_CO' : 'en_US',
    });
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    setOrRemoveMeta('article:published_time', metadata.published);
    setOrRemoveMeta('article:modified_time', metadata.published);
    setOrRemoveMeta('article:section', metadata.section);
    setOrRemoveMeta('article:author', metadata.type === 'article' ? `${base}/sobre-mi` : undefined);
    setMetaList('article:tag', metadata.type === 'article' ? metadata.tags : []);
    const names = owner.split(' ');
    setOrRemoveMeta('profile:first_name', metadata.profile ? names.slice(0, -2).join(' ') || names[0] : undefined);
    setOrRemoveMeta('profile:last_name', metadata.profile ? names.slice(-2).join(' ') : undefined);
    setOrRemoveMeta('profile:username', metadata.profile ? 'krisskira' : undefined);
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: metadata.title });
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metadata.description });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: imageAlt });
    setLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    setLink('link[rel="alternate"][hreflang="es-CO"]', { rel: 'alternate', hreflang: 'es-CO', href: pageUrl });
    setLink('link[rel="alternate"][hreflang="en"]', { rel: 'alternate', hreflang: 'en', href: englishUrl });
    setLink('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: pageUrl });

    const person = { '@id': `${base}/#person` };
    const business = { '@id': `${base}/#business` };
    const sameAs = [site?.linkedin, site?.github, site?.facebook, site?.orcid].filter(Boolean);
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: SITE_NAME,
        inLanguage: language,
        description: t('seo.homeDescription'),
        publisher: business,
        author: person,
      },
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': `${base}/#business`,
        name: SITE_NAME,
        url: `${base}/`,
        logo: `${base}/brand/logo.svg`,
        image: `${base}/brand/og-cover.png`,
        description: t('seo.homeDescription'),
        email: site?.email,
        telephone: site?.phone,
        address: { '@type': 'PostalAddress', addressLocality: 'Palmira', addressCountry: 'CO' },
        areaServed: [
          { '@type': 'Country', name: 'Colombia' },
          { '@type': 'Place', name: locale === 'en' ? 'Remote' : 'Remoto' },
        ],
        knowsAbout: ['React', 'React Native', 'Node.js', 'TypeScript', 'Python', 'Go', 'Swift', 'Kotlin', 'AWS', 'Docker', 'ESP32', 'STM32', 'IoT'],
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
          name: t('seo.services'),
          itemListElement: [
            [t('seo.serviceMobile'), 'iOS, Android'],
            [t('seo.serviceWeb'), 'Full stack, cloud, web, TV'],
            [t('seo.serviceIot'), 'ESP32, STM32, IoT'],
          ].map(([name, description]: any) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name, description, provider: business },
          })),
        },
      },
      personNode(base, site, about, t, language),
    ];

    if (indexable) {
      graph.push({
        '@type': metadata.profile ? 'ProfilePage' : metadata.collection ? 'CollectionPage' : 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: canonical,
        name: metadata.title,
        description: metadata.description,
        inLanguage: language,
        isPartOf: { '@id': `${base}/#website` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        ...(pathname === '/' ? { about: business } : {}),
        ...(metadata.profile ? { mainEntity: person, about: person } : {}),
        ...(metadata.collection
          ? {
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: metadata.collection.map(([name, path]: any, index: any) => ({
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

    if (metadata.tutorial && indexable) {
      const item = metadata.tutorial;
      const video = metadata.video
        ? {
            '@type': 'VideoObject',
            '@id': `${pageUrl}#video`,
            name: item.title,
            description: metadata.video.caption || item.excerpt,
            thumbnailUrl: image,
            contentUrl: videoUrl,
            uploadDate: item.published,
            inLanguage: language,
            author: person,
          }
        : undefined;
      graph.push(
        {
          '@type': item.type === 'video' ? 'TechArticle' : 'BlogPosting',
          '@id': `${pageUrl}#article`,
          headline: item.title,
          description: item.excerpt,
          image,
          url: canonical,
          datePublished: item.published,
          dateModified: item.published,
          inLanguage: language,
          articleSection: metadata.section,
          keywords: item.tags?.join(', '),
          timeRequired: item.minutes ? `PT${item.minutes}M` : undefined,
          author: person,
          publisher: business,
          isPartOf: { '@id': `${base}/#website` },
          mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
          ...(video ? { video: { '@id': video['@id'] } } : {}),
          ...(item.rating ? { contentRating: `${item.rating}/5` } : {}),
        },
        ...(video ? [video] : []),
        breadcrumb(base, [
          [t('seo.home'), '/'],
          [t('seo.tutorials'), '/tutoriales'],
          [item.title, pathname],
        ]),
      );
    } else if (metadata.project) {
      const item = metadata.project;
      graph.push(
        {
          '@type': 'CreativeWork',
          ...(item.schema ?? {}),
          '@id': `${pageUrl}#project`,
          name: item.title,
          description: item.summary,
          image,
          url: canonical,
          dateCreated: item.year,
          keywords: item.tags?.join(', '),
          inLanguage: language,
          creator: person,
          author: person,
          publisher: business,
          mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        },
        breadcrumb(base, [
          [t('seo.home'), '/'],
          [t('seo.projects'), '/proyectos'],
          [item.title, pathname],
        ]),
      );
    } else if (metadata.collection || metadata.profile) {
      const label = metadata.profile ? t('seo.about') : pathname === '/tutoriales' ? t('seo.tutorials') : t('seo.projects');
      graph.push(
        breadcrumb(base, [
          [t('seo.home'), '/'],
          [label, pathname],
        ]),
      );
    }

    let script = document.getElementById('kriver-structured-data') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'kriver-structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  }, [metadata, pathname, siteQuery.data, aboutQuery.data, locale, t]);

  return null;
}
