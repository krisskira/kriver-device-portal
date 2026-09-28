import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FlagTitle } from './ui';
import { wrap } from './layout';
import iconPhone from '../../docs/images/icon-phone.svg';
import iconPc from '../../docs/images/icon-pc.svg';
import { useQuery } from '@tanstack/react-query';
import techStackUrl from '../assets/stack/tech-stack.svg?url';

const icons = { smartphone: iconPhone, airplay: iconPc };

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue';

export function ServicesSection({ services, stack }) {
  const stackName = stack.title.join(' ');
  const techStack = useQuery({
    queryKey: ['asset', techStackUrl],
    queryFn: () => fetch(techStackUrl).then((response) => response.text()),
    staleTime: Infinity,
  });

  return (
    <section id={services.id} aria-labelledby="servicios-title" className="scroll-mt-[90px] py-16 lg:py-28">
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6`}>
        <div className="max-w-[560px]">
          <FlagTitle id="servicios-title" lines={services.title} />
          {services.lead ? <p className="mt-6 text-lg leading-7 text-muted lg:text-xl lg:leading-8">{services.lead}</p> : null}

          <ul className="mt-10 grid gap-8">
            {services.items.map((item) => (
              <li key={item.title} className="flex items-start gap-5">
                <ServiceIcon name={item.icon} />
                <div>
                  <h3 className="font-display text-xl font-bold leading-7 text-fg lg:text-2xl">{item.title}</h3>
                  {item.tags ? (
                    <p className="mt-1 font-noto text-sm font-semibold tracking-wide text-action dark:text-blue">{item.tags}</p>
                  ) : null}
                  <p className="mt-2 text-base leading-6 text-muted lg:text-lg lg:leading-7">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>

          {services.cta ? (
            <Link
              to={services.cta.to}
              className={`group mt-10 inline-flex items-center gap-2 font-display text-lg font-semibold text-action dark:text-blue ${focusRing}`}
            >
              {services.cta.label}
              <ArrowRight size={18} aria-hidden="true" className="transition group-hover:translate-x-1" />
            </Link>
          ) : null}
        </div>

        <figure className="relative mx-auto w-full max-w-[640px] motion-safe:animate-float dark:rounded-[40px] dark:bg-white dark:p-8">
          <figcaption className="sr-only">
            {stackName}: {stack.items.join(', ')}
          </figcaption>
          <div className="aspect-[623/590]" dangerouslySetInnerHTML={{ __html: techStack.data ?? '' }} />
        </figure>
      </div>
    </section>
  );
}

function ServiceIcon({ name }) {
  if (name === 'cpu') return <CpuIcon />;
  return <img src={icons[name]} alt="" aria-hidden="true" className="h-[72px] w-[72px] shrink-0" />;
}

function CpuIcon() {
  return (
    <svg viewBox="0 0 89 89" className="h-[72px] w-[72px] shrink-0" fill="none" aria-hidden="true">
      <rect x="26" y="26" width="37" height="37" rx="6" stroke="#51A1EB" strokeWidth="4" />
      <rect x="36" y="36" width="17" height="17" rx="3" stroke="#51A1EB" strokeWidth="4" />
      <path
        d="M37 26V16M52 26V16M37 73V63M52 73V63M26 37H16M26 52H16M73 37H63M73 52H63"
        stroke="#51A1EB"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
