import type { AboutContent, SiteContent } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Mail, MapPin } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { Rich } from '../components/ArticleView';
import { FlagTitle } from '../components/ui';
import { FacebookIcon, GitHubIcon, LinkedInIcon } from '../components/icons';
import { wrap } from '../components/layout';
import { media, mediaUrl } from '../assets/media';
import { useI18n } from '../hooks/useI18n';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue';
const chip = 'rounded-[20px] border border-blue bg-card px-3 py-1 font-display text-sm font-semibold text-action dark:text-blue';

export function AboutPage() {
  const about = useContent<AboutContent>('/about/about');
  const site = useContent<SiteContent>('/site/site');

  return (
    <QueryState query={about}>{(data: any) => <AboutContent data={data} site={site.data} />}</QueryState>
  );
}

function AboutContent({ data, site }: any) {
  const { locale, t } = useI18n();
  const links = [
    site?.linkedin && { label: 'LinkedIn', href: site.linkedin, icon: LinkedInIcon },
    site?.github && { label: 'GitHub', href: site.github, icon: GitHubIcon },
    site?.facebook && { label: 'Facebook', href: site.facebook, icon: FacebookIcon },
    site?.orcid && { label: 'ORCID', href: site.orcid, icon: BadgeCheck },
  ].filter(Boolean);

  return (
    <article className="relative overflow-x-clip pb-[76px] lg:pb-[140px]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[294px] bg-[linear-gradient(180deg,rgba(81,161,235,0.29)_0%,rgba(255,255,255,0)_100%)]"
      />
      <img
        src={media['dots-red']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-120px] top-[60px] w-[252px] lg:left-[-8px]"
      />
      <img
        src={media['dots-blue']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-120px] top-[760px] w-[252px] lg:right-[-11px]"
      />

      <div className={`${wrap} relative pt-[94px] lg:pt-[142px]`}>
        <header className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16 lg:pl-[86px]">
          <div>
            <FlagTitle as="h1" lines={[data.title]} />
            <p className="mt-6 font-display text-2xl font-bold leading-9 text-fg lg:mt-8 lg:text-[32px] lg:leading-[44px]">
              {data.name}
            </p>
            <p className="mt-1 font-noto text-base font-semibold text-action dark:text-blue lg:text-lg">{data.role}</p>
            <p className="mt-6 max-w-[760px] text-base leading-7 text-muted lg:text-xl lg:leading-8">{data.summary}</p>
            <ul className="mt-6 flex flex-wrap items-center gap-3">
              <li className="inline-flex items-center gap-2 text-sm text-muted">
                <MapPin size={16} aria-hidden="true" />
                {data.location}
              </li>
              {links.map(({ label, href, icon }: any) => {
                const Icon = icon;
                return (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={t('footer.newTab', { label })}
                      className={`inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-noto text-sm font-semibold text-fg transition hover:border-blue ${focusRing}`}
                    >
                      <Icon size={16} />
                      {label}
                    </a>
                  </li>
                );
              })}
              {site?.email ? (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className={`inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-noto text-sm font-semibold text-fg transition hover:border-blue ${focusRing}`}
                  >
                    <Mail size={16} aria-hidden="true" />
                    {site.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <img
            src={mediaUrl(data.photo)}
            alt={t('about.photoAlt', { name: data.name })}
            width="720"
            height="768"
            className="mx-auto h-auto w-[260px] lg:w-[340px]"
          />
        </header>

        <dl className="mt-14 grid gap-4 sm:grid-cols-3 lg:mt-20 lg:pl-[86px]">
          {data.highlights.map((item: any) => (
            <div key={item.label} className="flex flex-col rounded-xl border border-line/40 bg-card px-6 py-5">
              <dt className="order-2 text-sm text-muted lg:text-base">{item.label}</dt>
              <dd className="font-display text-[36px] font-bold leading-[48px] text-fg">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:pl-[86px]">
          <div>
            <section aria-labelledby="about-story">
              <h2 id="about-story" className="sr-only">
                {data.title}
              </h2>
              {data.story.map((paragraph: any, index: any) => (
                <p key={index} className={`${index ? 'mt-4' : ''} text-base leading-7 text-muted lg:text-xl lg:leading-8`}>
                  <Rich text={paragraph} />
                </p>
              ))}
            </section>

            <Section id="about-experience" title={data.experienceTitle} className="mt-14">
              {data.experienceLead ? (
                <p className="mt-4 text-base leading-7 text-muted lg:text-lg">{data.experienceLead}</p>
              ) : null}
              <ol className="relative mt-8 space-y-10 border-l-2 border-blue/40 pl-6">
                {data.experience.map((item: any) => (
                  <li key={item.period} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-bg bg-blue"
                    />
                    <p className="font-noto text-sm font-semibold text-action dark:text-blue">{item.period}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-fg lg:text-xl">{item.title}</h3>
                    <p className="mt-2 text-base leading-7 text-muted">{item.text}</p>
                    {item.learned?.length ? (
                      <div className="mt-3">
                        <p className="font-noto text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                          {data.learnedLabel}
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {item.learned.map((skill: any) => (
                            <li key={skill} className={chip}>
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ol>
              {data.experienceClosing ? (
                <p className="mt-10 rounded-xl border-l-4 border-yellow bg-card px-5 py-4 text-base leading-7 text-fg lg:text-lg">
                  {data.experienceClosing}
                </p>
              ) : null}
            </Section>
          </div>

          <div>
            <Section id="about-skills" title={data.skillsTitle}>
              <div className="mt-6 space-y-5">
                {data.skills.map((group: any) => (
                  <div key={group.name}>
                    <h3 className="font-display text-base font-bold text-fg">{group.name}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item: any) => (
                        <li key={item} className={chip}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="about-education" title={data.educationTitle} className="mt-12">
              <ul className="mt-6 space-y-4">
                {data.education.map((item: any) => (
                  <li key={item.name}>
                    <h3 className="font-display text-base font-bold text-fg">{item.name}</h3>
                    <p className="text-sm text-muted">
                      {item.org} · {item.period}
                    </p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="about-certifications" title={data.certificationsTitle} className="mt-12">
              <ul className="mt-6 space-y-4">
                {data.certifications.map((item: any) => (
                  <li key={item.name}>
                    <h3 className="font-display text-base font-bold text-fg">{item.name}</h3>
                    <p className="text-sm text-muted">
                      {item.issuer} · <time dateTime={item.date}>{formatMonth(item.date, locale)}</time>
                    </p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="about-languages" title={data.languagesTitle} className="mt-12">
              <ul className="mt-6 flex flex-wrap gap-3">
                {data.languages.map((item: any) => (
                  <li key={item.code} lang={item.code} className={chip}>
                    {item.name} · {item.level}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <Section id="about-quotes" title={data.quotesTitle} className="mt-16 lg:mt-24 lg:pl-[86px]">
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {data.quotes.map((quote: any) => (
              <li key={quote.author}>
                <figure className="h-full rounded-xl border border-line/40 bg-card p-6 lg:p-8">
                  <blockquote className="text-base italic leading-7 text-muted lg:text-lg">“{quote.text}”</blockquote>
                  <figcaption className="mt-4 font-display text-sm font-bold text-fg">{quote.author}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Section>

        {data.cta ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center lg:mt-24">
            <p className="font-display text-2xl font-bold text-fg">{data.cta.title}</p>
            <Link
              to={data.cta.to}
              className={`group inline-flex h-12 items-center gap-2 rounded-full bg-action px-6 font-display text-base font-semibold text-white ${focusRing}`}
            >
              {data.cta.label}
              <ArrowRight size={18} aria-hidden="true" className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Section({ id, title, className = '', children }: any) {
  return (
    <section aria-labelledby={id} className={className}>
      <h2 id={id} className="flex items-center gap-[5px] font-display text-2xl font-bold leading-9 text-fg">
        <img src={media['flag-small']} alt="" aria-hidden="true" className="h-[27px] w-8" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function formatMonth(value: any, locale: any) {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-CO', { month: 'short', year: 'numeric' }).format(
    new Date(year, month - 1, 1),
  );
}
