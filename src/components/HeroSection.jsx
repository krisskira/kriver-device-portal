import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Cpu, MessageCircle, MonitorSmartphone, Smartphone } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { BrandMark } from './BrandMark';
import { wrap } from './layout';

const chipIcons = { mobile: Smartphone, web: MonitorSmartphone, iot: Cpu };
const chipPlacement = [
  'right-[-2%] top-[6%] [animation-delay:0s]',
  'left-[-6%] top-[58%] [animation-delay:-2.3s]',
  'bottom-[1%] right-[8%] [animation-delay:-4.6s]',
];
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow';

export function HeroSection({ hero }) {
  const site = useContent('/site/site');
  const whatsapp = site.data?.whatsapp;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative -mt-[90px] overflow-hidden bg-[linear-gradient(135deg,#454545_0%,#333_55%,#262626_100%)] pt-[90px] text-paper"
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
        className={`${wrap} relative grid items-center gap-12 pb-16 pt-10 lg:min-h-[min(calc(100svh-90px),760px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-12`}
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
              aria-label={`${hero.whatsapp} (se abre en una pestaña nueva)`}
              className={`mt-5 inline-flex items-center gap-2 rounded-sm font-noto text-sm font-semibold text-paper/75 underline-offset-4 transition hover:text-yellow hover:underline ${focusRing}`}
            >
              <MessageCircle size={16} aria-hidden="true" />
              {hero.whatsapp}
            </a>
          ) : null}

          {hero.values?.length ? (
            <ul className="mt-10 grid gap-3 border-t border-paper/10 pt-6 font-noto text-sm text-paper/80 sm:grid-cols-3 sm:gap-4">
              {hero.values.map((value) => (
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

      <div className="grid h-1.5 grid-cols-3" aria-hidden="true">
        <span className="bg-yellow" />
        <span className="bg-blue" />
        <span className="bg-red" />
      </div>
    </section>
  );
}

function HeroArt({ chips }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[540px]">
      <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="260" cy="260" r="250" fill="rgba(255,253,248,.03)" stroke="rgba(255,253,248,.08)" />
        <g className="origin-center [transform-box:fill-box] motion-safe:animate-spin-slow">
          <circle cx="260" cy="260" r="222" fill="none" stroke="rgba(255,253,248,.22)" strokeDasharray="2 10" strokeLinecap="round" strokeWidth="2" />
        </g>
        <circle cx="260" cy="260" r="180" fill="none" stroke="rgba(255,253,248,.1)" />
        <circle cx="260" cy="260" r="125" fill="none" stroke="rgba(255,253,248,.14)" />
        <path d="M260 22V498M22 260H498" stroke="rgba(255,253,248,.22)" strokeDasharray="4 7" />
        <rect x="243" y="100" width="34" height="34" fill="#F0DF41" />
        <rect x="100" y="243" width="34" height="34" fill="#EB5151" />
        <rect x="243" y="386" width="34" height="34" fill="#51A1EB" />
      </svg>

      <BrandMark className="absolute left-[36%] top-[29%] w-[56%] text-paper drop-shadow-[0_12px_30px_rgba(0,0,0,.35)]" />

      <ul className="contents">
        {chips.map((chip, index) => {
          const Icon = chipIcons[chip.icon] || Cpu;
          return (
            <li
              key={chip.title}
              className={`absolute flex items-center gap-3 rounded-2xl border border-paper/15 bg-[#2a2a2a]/70 py-2 pl-2 pr-4 shadow-[0_18px_40px_-18px_rgba(0,0,0,.7)] backdrop-blur-md motion-safe:animate-float ${chipPlacement[index % chipPlacement.length]}`}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-paper/10 text-yellow sm:h-10 sm:w-10">
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
