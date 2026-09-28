import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { media } from '../assets/media';
import { wrap } from './layout';
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from './icons';

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
