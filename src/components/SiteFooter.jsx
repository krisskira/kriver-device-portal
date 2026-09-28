import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { media } from '../assets/media';
import { wrap } from './layout';

const socialIcons = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  whatsapp: WhatsAppIcon,
};

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow';
const linkClass = `rounded-sm text-paper/75 transition hover:text-yellow ${focusRing}`;

export function SiteFooter() {
  const site = useContent('/site/site');
  const data = site.data;
  const footer = data?.footer ?? {};
  const year = new Date().getFullYear();
  const nav = [...(data?.nav ?? []), ...(data?.payments ? [data.payments] : [])];

  const contacts = [
    data?.email && { icon: Mail, label: data.email, href: `mailto:${data.email}` },
    data?.phone && { icon: Phone, label: data.phoneDisplay || data.phone, href: `tel:${data.phone}` },
    data?.whatsapp && { icon: MessageCircle, label: 'Escríbeme por WhatsApp', href: data.whatsapp, external: true },
  ].filter(Boolean);

  return (
    <footer className="relative overflow-hidden bg-[#333] text-paper">
      <img
        src={media['dots-blue']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-10 hidden w-[180px] opacity-20 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(240,223,65,.14),transparent_65%)]"
      />

      <div className={`${wrap} relative grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr_1.2fr] lg:gap-10 lg:py-20`}>
        <div className="max-w-[360px]">
          <Link to="/" className={`inline-flex items-center gap-4 rounded-md ${focusRing}`}>
            <img src={media['footer-logo']} alt="" aria-hidden="true" width="72" height="72" className="h-[72px] w-[72px]" />
            <span>
              <span className="block font-display text-2xl font-semibold leading-tight">{data?.name || 'Kriver Devices'}</span>
              <span className="mt-1 block font-noto text-xs font-semibold uppercase tracking-[.18em] text-blue-soft">
                {data?.tagline || 'Smart Home Technologies'}
              </span>
            </span>
          </Link>
          {footer.pitch ? <p className="mt-6 text-lg leading-[26px] text-paper/75">{footer.pitch}</p> : null}
          {footer.cta ? (
            <Link
              to={footer.cta.to}
              className={`group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-yellow px-6 font-display text-base font-semibold text-ink transition hover:brightness-95 ${focusRing}`}
            >
              {footer.cta.label}
              <ArrowRight size={18} aria-hidden="true" className="transition group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>

        <nav aria-labelledby="footer-nav">
          <FooterTitle id="footer-nav">{footer.navTitle || 'Explora'}</FooterTitle>
          <ul className="mt-6 grid grid-cols-2 gap-3 font-noto md:grid-cols-1 text-base font-semibold">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterTitle id="footer-contact">{footer.contactTitle || 'Contacto'}</FooterTitle>
          <address className="mt-6 grid gap-4 text-base not-italic" aria-labelledby="footer-contact">
            {contacts.map(({ icon, label, href, external }) => {
              const Icon = icon;
              return (
                <a
                  key={href}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  aria-label={external ? `${label} (se abre en una pestaña nueva)` : undefined}
                  className={`group flex items-center gap-3 break-all ${linkClass}`}
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/10 text-paper transition group-hover:bg-yellow group-hover:text-ink">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  {label}
                </a>
              );
            })}
            {footer.location ? (
              <p className="flex items-center gap-3 text-paper/75">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/10">
                  <MapPin size={16} aria-hidden="true" />
                </span>
                {footer.location}
              </p>
            ) : null}
          </address>
        </div>

        <div>
          <FooterTitle id="footer-social">{footer.socialTitle || 'Sígueme'}</FooterTitle>
          {footer.socialText ? <p className="mt-6 text-base text-paper/75">{footer.socialText}</p> : null}
          <ul className="mt-5 flex flex-wrap gap-3" aria-labelledby="footer-social">
            {(data?.social ?? []).map((item) => {
              const Icon = socialIcons[item.icon] || Mail;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.label} (se abre en una pestaña nueva)`}
                    className={`inline-flex h-11 items-center gap-2 rounded-full border border-paper/20 px-4 font-noto text-sm font-semibold text-paper transition hover:border-yellow hover:bg-yellow hover:text-ink ${focusRing}`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-paper/10">
        <div className={`${wrap} flex flex-col items-center gap-4 py-6 text-center font-noto text-sm text-paper/70 md:flex-row md:justify-between md:text-left`}>
          <p>
            © {year} {footer.rights || 'Kriver Devices. Todos los derechos reservados.'}
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`group inline-flex items-center gap-2 font-semibold text-paper transition hover:text-yellow ${focusRing}`}
          >
            {footer.backToTop || 'Volver arriba'}
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-paper/25 transition group-hover:-translate-y-0.5 group-hover:border-yellow">
              <ArrowUp size={16} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      <div className="grid h-1.5 grid-cols-3" aria-hidden="true">
        <span className="bg-yellow" />
        <span className="bg-blue" />
        <span className="bg-red" />
      </div>
    </footer>
  );
}

function FooterTitle({ id, children }) {
  return (
    <h2 id={id} className="font-display text-lg font-semibold">
      {children}
      <span className="mt-3 flex gap-1" aria-hidden="true">
        <span className="h-1 w-5 rounded-full bg-yellow" />
        <span className="h-1 w-5 rounded-full bg-blue" />
        <span className="h-1 w-5 rounded-full bg-red" />
      </span>
    </h2>
  );
}

function LinkedInIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.630V21h-4z" />
    </svg>
  );
}

function GitHubIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.06.89.9-2.98-.2-.31a8.2 8.2 0 1 1 6.84 3.72zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}
