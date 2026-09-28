import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { HeroSection } from '../components/HeroSection';
import { ServicesSection } from '../components/ServicesSection';
import { TutorialCard } from '../components/Cards';
import { ContactSection } from '../components/ContactSection';
import { FlagTitle } from '../components/ui';
import { wrap } from '../components/layout';
import { media } from '../assets/media';
import { latestPosts } from '../lib/posts';

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
  const posts = latestPosts(tutorials.data.items, content.tutorials.limit);

  return (
    <>
      <HeroSection hero={content.hero} />
      <ServicesSection services={content.services} stack={content.stack} />
      <TutorialsSection section={content.tutorials} posts={posts} />
      <ContactSection contact={content.contact} />
    </>
  );
}

function TutorialsSection({ section, posts }) {
  return (
    <section aria-labelledby="tutoriales-title" className="relative overflow-x-clip">
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
        className="pointer-events-none absolute left-[-5.44%] top-[560px] hidden w-[110.9%] max-w-none xl:block"
      />
      <div className={`${wrap} relative`}>
        <div className="grid gap-[34px] md:grid-cols-2 md:gap-4 xl:grid-cols-4 xl:gap-y-0 xl:pl-12">
          <header className="-mb-2.5 md:col-span-2 md:mb-0 xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:-ml-12 xl:min-h-[380px] min-[1680px]:w-[430px]">
            <FlagTitle id="tutoriales-title" lines={section.title} />
            <p className="mt-6 max-w-[242px] text-sm leading-[17px] text-muted md:mt-11 md:max-w-[346px] md:pl-px md:text-xl md:leading-6">
              {section.lead}
            </p>
            {section.cta ? (
              <Link
                to={section.cta.to}
                className="group mt-6 inline-flex items-center gap-2 font-display text-base font-semibold text-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue dark:text-blue md:text-lg"
              >
                {section.cta.label}
                <ArrowRight size={18} aria-hidden="true" className="transition group-hover:translate-x-1" />
              </Link>
            ) : null}
          </header>
          {posts.map((item, index) => (
            <div
              key={item.slug}
              className={`mx-auto w-full max-w-[365px] self-start xl:max-w-none ${
                index % 2 === 0 ? 'xl:row-start-2' : 'xl:row-span-2 xl:row-start-1 xl:mt-[96px]'
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
