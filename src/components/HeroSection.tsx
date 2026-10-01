import type { SiteContent } from '../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Cpu, MonitorSmartphone, Smartphone } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { useI18n } from '../hooks/useI18n';
import { WhatsAppBadge } from './icons';
import wordmark from '../assets/brand/logo-wordmark-light.svg';
import { wrap } from './layout';

const chipIcons: Record<string, typeof Cpu> = { mobile: Smartphone, web: MonitorSmartphone, iot: Cpu };
const chipPlacement = [
  'sm:right-0 sm:top-[2%] [animation-delay:0s]',
  'sm:left-[-8%] sm:top-[13%] [animation-delay:-2.3s]',
  'sm:right-[-2%] sm:top-[88%] [animation-delay:-4.6s]',
];
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow';

export function HeroSection({ hero }: any) {
  const site = useContent<SiteContent>('/site/site');
  const { t } = useI18n();
  const whatsapp = site.data?.whatsapp;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mt-[90px] flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(135deg,#454545_0%,#333_55%,#262626_100%)] pt-[90px] text-paper"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(240,223,65,.16),transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-[-220px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(81,161,235,.2),transparent_65%)]"
      />

      <div
        className={`${wrap} relative grid flex-1 items-center gap-12 pb-16 pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-12`}
      >
        <div className="max-w-[640px]">
          {hero.badge ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-4 py-1.5 font-noto text-xs font-semibold tracking-wide text-paper/90 sm:text-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ade80]" />
              </span>
              {hero.badge}
            </p>
          ) : null}

          <h1
            id="hero-title"
            className="mt-6 font-display text-[34px] font-bold leading-[1.15] tracking-[-0.01em] sm:text-5xl lg:text-[56px] xl:text-[64px]"
          >
            {hero.title}{' '}
            <span className="bg-[linear-gradient(90deg,#F0DF41,#EB5151)] bg-clip-text text-transparent">{hero.highlight}</span>
          </h1>

          <p className="mt-6 max-w-[540px] text-lg leading-[1.45] text-paper/80 lg:text-[22px]">{hero.lead}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to={hero.primary.to}
              className={`group inline-flex h-[54px] items-center justify-center gap-2 max-sm:w-full rounded-full bg-yellow px-7 font-display text-base font-semibold text-ink shadow-[0_10px_30px_-10px_rgba(240,223,65,.6)] transition hover:brightness-95 ${focusRing}`}
            >
              {hero.primary.label}
              <ArrowRight size={18} aria-hidden="true" className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to={hero.secondary.to}
              className={`inline-flex h-[54px] items-center justify-center rounded-full max-sm:w-full border border-paper/30 px-7 font-display text-base font-semibold text-paper transition hover:border-paper hover:bg-paper/10 ${focusRing}`}
            >
              {hero.secondary.label}
            </Link>
          </div>

          {whatsapp && hero.whatsapp ? (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${hero.whatsapp}${t('contact.newTab')}`}
              className={`mt-5 inline-flex items-center gap-2 rounded-sm font-noto text-sm font-semibold text-paper/75 underline-offset-4 transition hover:text-yellow hover:underline ${focusRing}`}
            >
              <WhatsAppBadge size={24} />
              {hero.whatsapp}
            </a>
          ) : null}

          {hero.values?.length ? (
            <ul className="mt-10 grid gap-3 border-t border-paper/10 pt-6 font-noto text-sm text-paper/80 sm:grid-cols-3 sm:gap-4">
              {hero.values.map((value: any) => (
                <li key={value} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow/15 text-yellow">
                    <Check size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {value}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <HeroArt chips={hero.chips ?? []} />
      </div>

      {hero.next ? (
        <a
          href={hero.next.to}
          className={`absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 rounded-md font-noto text-xs font-semibold text-paper/60 transition hover:text-paper xl:flex ${focusRing}`}
        >
          {hero.next.label}
          <ChevronDown size={20} aria-hidden="true" className="motion-safe:animate-bounce" />
        </a>
      ) : null}

      <div className="relative h-1.5" aria-hidden="true">
        <div className="grid h-full grid-cols-3">
          <span className="bg-yellow shadow-[0_0_14px_2px_rgba(240,223,65,.55)]" />
          <span className="bg-blue shadow-[0_0_14px_2px_rgba(81,161,235,.55)]" />
          <span className="bg-red shadow-[0_0_14px_2px_rgba(235,81,81,.55)]" />
        </div>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute inset-y-0 left-0 w-1/5 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent)] mix-blend-screen motion-safe:animate-sweep motion-reduce:hidden" />
        </div>
        <span className="pointer-events-none absolute -top-3 left-0 h-7 w-1/5 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.45),transparent_70%)] blur-sm motion-safe:animate-sweep motion-reduce:hidden" />
      </div>
    </section>
  );
}

function HeroArt({ chips }: any) {
  return (
    <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[500px] lg:max-w-[600px]">
      <svg viewBox="0 0 600 520" className="block aspect-[600/520] w-full overflow-visible" aria-hidden="true">
        <circle cx="230" cy="260" r="228" fill="rgba(255,253,248,.03)" stroke="rgba(255,253,248,.08)" />
        <g className="origin-center [transform-box:fill-box] motion-safe:animate-spin-slow">
          <circle cx="230" cy="260" r="205" fill="none" stroke="rgba(255,253,248,.22)" strokeDasharray="2 10" strokeLinecap="round" strokeWidth="2" />
        </g>
        <circle cx="230" cy="260" r="165" fill="none" stroke="rgba(255,253,248,.1)" />
        <circle cx="230" cy="260" r="115" fill="none" stroke="rgba(255,253,248,.14)" />
        <path d="M230 40V480M10 260H450" stroke="rgba(255,253,248,.22)" strokeDasharray="4 7" />
        <rect x="213" y="126" width="34" height="34" fill="#F0DF41" />
        <rect x="96" y="243" width="34" height="34" fill="#EB5151" />
        <rect x="213" y="398" width="34" height="34" fill="#51A1EB" />
        <image href={wordmark} x="160.4" y="156" width="423" height="229.8" className="drop-shadow-[0_12px_30px_rgba(0,0,0,.35)]" />
      </svg>

      <ul className="mt-2 grid gap-3 sm:contents">
        {chips.map((chip: any, index: any) => {
          const Icon = chipIcons[chip.icon] || Cpu;
          return (
            <li
              key={chip.title}
              className={`flex items-center gap-3 rounded-2xl border border-paper/15 bg-[#2a2a2a]/75 py-2 pl-2 pr-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,.7)] backdrop-blur-md sm:absolute sm:max-w-[78%] sm:-translate-x-5 sm:motion-safe:animate-float ${chipPlacement[index % chipPlacement.length]}`}
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper/10 text-yellow sm:h-10 sm:w-10">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xs font-semibold sm:text-sm">{chip.title}</span>
                <span className="block font-noto text-[11px] text-paper/65 sm:text-xs">{chip.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
