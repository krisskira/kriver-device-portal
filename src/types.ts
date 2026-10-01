import type { ReactNode } from 'react';

export type Locale = 'es' | 'en';

export type LinkTo = { label: string; to: string };

export type SiteContent = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  owner: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  linkedin: string;
  whatsapp: string;
  github: string;
  facebook: string;
  orcid: string;
  nav: LinkTo[];
  cta: LinkTo;
  payments: LinkTo;
  about: LinkTo;
  coffee: { label: string; href: string };
  social: { label: string; icon: string; href: string }[];
  footer: {
    pitch: string;
    cta: LinkTo;
    navTitle: string;
    contactTitle: string;
    socialTitle: string;
    socialText: string;
    location: string;
    rights: string;
    backToTop: string;
  };
};

export type ArticleImage = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  pixelated?: boolean;
};

export type ArticleSection = {
  heading?: string;
  body?: string | string[];
  list?: string[];
  image?: ArticleImage;
  gallery?: ArticleImage[];
  code?: string;
};

export type Tutorial = {
  slug: string;
  type: string;
  tags?: string[];
  title: string;
  excerpt: string;
  cover?: string;
  poster?: string;
  video?: { src?: string; poster?: string; caption?: string };
  rating?: number;
  minutes?: number;
  published?: string;
  sections?: ArticleSection[];
  comingSoon?: boolean;
  comingSoonLabel?: string;
};

export type TutorialsContent = {
  title: string;
  lead: string;
  hero?: string;
  filters: { id: string; label: string }[];
  items: Tutorial[];
  sorts: { id: string; label: string }[];
  comingSoonLabel?: string;
};

export type Project = {
  slug: string;
  schema?: Record<string, unknown>;
  title: string;
  year: string | number;
  role: string;
  tags: string[];
  summary: string;
  cover?: string;
  sections?: ArticleSection[];
};

export type ProjectsContent = {
  title: string;
  lead: string;
  items: Project[];
};

export type HeroContent = {
  badge?: string;
  title: string;
  highlight?: string;
  lead?: string;
  primary?: LinkTo;
  secondary?: LinkTo;
  whatsapp?: string;
  values?: string[];
  chips?: { icon: string; title: string; text: string }[];
  next?: { label: string; to: string };
};

export type ServiceItem = { title: string; tags?: string; text: string; icon?: string };

export type ServicesContent = {
  id?: string;
  title: string[];
  lead?: string;
  cta?: LinkTo;
  items: ServiceItem[];
};

export type StackContent = { title?: string; items?: string[] };

export type HomeContent = {
  hero: HeroContent;
  services: ServicesContent;
  stack: StackContent;
  tutorials: { title: string[]; lead?: string; limit?: number; cta?: LinkTo };
  contact: ContactContent;
};

export type ContactField = { name: string; label: string; type?: string; required?: boolean };
export type ContactChoice = { value: string; label: string };

export type ContactContent = {
  id?: string;
  title?: string | string[];
  kicker?: string;
  lead?: string;
  aside?: string;
  fields?: ContactField[];
  roles?: { legend?: string; name?: string; options?: ContactChoice[] };
  services?: { legend?: string; name?: string; options?: ContactChoice[] };
  attachment?: { label?: string; hint?: string; name?: string };
  maxMessage?: number;
  errors?: Record<string, string>;
  privacy?: string;
  submit?: string;
  sending?: string;
  success?: string;
};

export type PaymentsContent = {
  title: string;
  stepsTitle?: string;
  steps?: { icon?: string; label: string }[];
  closing?: string;
  methodsLink?: string;
  methodsTitle?: string;
  methodsLead?: string;
  methods?: { id: string; name: string; color?: string; text?: string; url?: string; cta?: string }[];
  requestLink?: string;
  requestMessage?: string;
  disclaimer?: string;
  currency?: string;
  fields?: Record<string, string>;
  terms?: string;
  submit?: string;
  successTitle?: string;
  successBody?: string;
};

export type AboutItem = Record<string, string | undefined>;

export type AboutContent = {
  title?: string;
  name: string;
  alternateName?: string;
  photo?: string;
  role?: string;
  location?: string;
  since?: string;
  summary?: string;
  story?: string[];
  highlights?: { value: string; label: string }[];
  experienceTitle?: string;
  experienceLead?: string;
  experience?: { period: string; title: string; text: string; learned?: string }[];
  experienceClosing?: string;
  learnedLabel?: string;
  skillsTitle?: string;
  skills?: { name: string; items: string[] | string }[];
  educationTitle?: string;
  education?: { name: string; org?: string; period?: string }[];
  certificationsTitle?: string;
  certifications?: { name: string; issuer?: string; date?: string }[];
  languagesTitle?: string;
  languages?: { name: string; level?: string; code?: string }[];
  quotesTitle?: string;
  quotes?: { text: string; author?: string }[];
  cta?: { title?: string; label: string; to: string };
};

export type ArticleProps = {
  title: string;
  summary?: string;
  rating?: number;
  poster?: string;
  posterLabel?: string;
  video?: { src?: string; poster?: string; caption?: string };
  playable?: boolean;
  sections?: ArticleSection[];
  aside?: ReactNode;
  kicker?: string;
  back?: LinkTo;
  footer?: ReactNode;
  comingSoon?: boolean;
  comingSoonLabel?: string;
};
