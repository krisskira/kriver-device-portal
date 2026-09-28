import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { HeroSection } from '../components/HeroSection';
import { TutorialCard } from '../components/Cards';
import { ContactSection } from '../components/ContactSection';
import { FlagTitle } from '../components/ui';
import { wrap } from '../components/layout';
import { media } from '../assets/media';

export function HomePage() {
  const location = useLocation();
  const home = useContent('/home/home');
  const tutorials = useContent('/tutorials/tutorials');
  const pending = home.isPending || tutorials.isPending;
  const failed = [home, tutorials].find((query) => query.isError);

  useEffect(() => {
    if (pending || !location.hash) return;
    document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pending, location.hash]);

  if (failed) return <QueryState query={failed}>{() => null}</QueryState>;
  if (pending) return <QueryState query={{ isPending: true }}>{() => null}</QueryState>;

  const content = home.data;
  const posts = tutorials.data.items.slice(0, content.tutorials.limit);

  return (
    <>
      <HeroSection hero={content.hero} />
      <Services services={content.services} stack={content.stack} />
      <TutorialsSection section={content.tutorials} posts={posts} />
      <ContactSection contact={content.contact} />
    </>
  );
}

function Services({ services, stack }) {
  return (
    <section
      id={services.id}
      aria-labelledby="servicios-title"
      className={`${wrap} scroll-mt-[90px] overflow-x-clip pt-[75px] lg:pt-[117px]`}
    >
      <FlagTitle id="servicios-title" lines={services.title} />
      <div className="mt-[54px] grid justify-items-center gap-[74px] lg:mt-44 lg:grid-cols-2 lg:items-center lg:justify-items-start lg:gap-x-[116px] min-[1680px]:grid-cols-[357px_424px_1fr]">
        {services.items.map((item) => (
          <article key={item.title} className="flex max-w-[297px] flex-col items-center text-center lg:max-w-none lg:items-start lg:text-left">
            <img src={media[item.icon]} alt="" aria-hidden="true" className="h-[69px] w-[69px] lg:h-[89px] lg:w-[89px]" />
            <h3 className="mt-9 font-display text-base font-bold leading-6 text-muted lg:mt-[39px] lg:text-2xl lg:leading-9">
              {item.title}
            </h3>
            <p className="mt-6 text-sm leading-[17px] text-muted lg:mt-[23px] lg:text-xl lg:leading-6">{item.text}</p>
          </article>
        ))}
        <StackOrbit stack={stack} />
      </div>
    </section>
  );
}

function StackOrbit({ stack }) {
  const [open, setOpen] = useState(false);
  const [first, second] = stack.title;

  return (
    <div
      className="relative mt-[111px] justify-self-center lg:col-span-2 lg:mt-[260px] min-[1680px]:col-span-1 min-[1680px]:mt-0 min-[1680px]:justify-self-end"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls="stack-lista"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={`flex items-center gap-6 rounded-full text-right transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue lg:gap-[49px] ${
          open ? 'lg:opacity-0' : ''
        }`}
      >
        <span className="font-display text-2xl font-semibold leading-9 text-muted lg:text-[32px] lg:leading-[48px]">
          {first}
          <span className="block">{second}</span>
        </span>
        <img src={media['stack-button']} alt="" aria-hidden="true" className="h-[74px] w-[74px] lg:h-[130px] lg:w-[130px]" />
      </button>
      <ul id="stack-lista" className="sr-only">
        {stack.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <img
        src={media['stack-orbit']}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none mx-auto mt-6 w-[min(92vw,396px)] transition-all duration-300 lg:absolute lg:left-[-176px] lg:top-[-252px] lg:z-10 lg:mt-0 lg:w-[651px] lg:max-w-none ${
          open ? 'block opacity-100 lg:scale-100' : 'hidden opacity-0 lg:block lg:scale-95'
        }`}
      />
    </div>
  );
}

function TutorialsSection({ section, posts }) {
  return (
    <section aria-labelledby="tutoriales-title" className="relative overflow-x-clip pt-[177px] lg:pt-[293px]">
      <img
        src={media['curves-mobile']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-76.8%] top-[638px] w-[253.5%] max-w-none xl:hidden"
      />
      <img
        src={media.curves}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-5.44%] top-[454px] hidden w-[110.9%] max-w-none xl:block"
      />
      <div className={`${wrap} relative`}>
        <div className="grid gap-[34px] md:grid-cols-2 md:gap-4 xl:grid-cols-4 xl:gap-y-0 xl:pl-12">
          <header className="-mb-2.5 md:col-span-2 md:mb-0 xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:-ml-12 xl:min-h-[259px] min-[1680px]:w-[430px]">
            <FlagTitle id="tutoriales-title" lines={section.title} />
            <p className="mt-6 max-w-[242px] text-sm leading-[17px] text-muted md:mt-11 md:max-w-[346px] md:pl-px md:text-xl md:leading-6">
              {section.lead}
            </p>
          </header>
          {posts.map((item, index) => (
            <div
              key={item.slug}
              className={`mx-auto w-full max-w-[365px] self-start xl:max-w-none ${index > 1 ? 'max-md:hidden' : ''} ${
                index % 2 === 0 ? 'xl:row-start-2' : 'xl:row-span-2 xl:row-start-1 xl:mt-[9px]'
              }`}
            >
              <TutorialCard item={item} variant="orange" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
