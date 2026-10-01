import type { ProjectsContent } from '../types';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { ProjectCard } from '../components/Cards';
import { FlagTitle } from '../components/ui';
import { wrap } from '../components/layout';
import { media } from '../assets/media';
import { useI18n } from '../hooks/useI18n';

export function ProjectsPage() {
  const query = useContent<ProjectsContent>('/projects/projects');
  const { t } = useI18n();

  return (
    <QueryState query={query}>
      {(data: any) => (
        <div className="relative overflow-x-clip pb-[62px] lg:pb-[276px]">
          <img
            src={media['dots-red']}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-[-120px] top-[60px] w-[252px] lg:left-[-8px] lg:top-[67px]"
          />
          <img
            src={media['dots-blue']}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-120px] top-[420px] w-[252px] lg:right-[-11px]"
          />
          <div className={`${wrap} relative pt-[94px] lg:pt-[142px]`}>
            <div className="lg:pl-[86px]">
              <FlagTitle as="h1" lines={[data.title]} />
              <p className="mt-6 max-w-[408px] text-sm leading-[17px] text-muted lg:mt-4 lg:text-xl lg:leading-6">
                {data.lead}
              </p>
            </div>
            <ul className="mt-14 grid justify-items-center gap-[34px] md:grid-cols-2 lg:mt-[77px] xl:grid-cols-4 xl:gap-x-8 xl:gap-y-[86px]">
              {data.items.map((item: any) => (
                <li key={item.slug} className="w-full max-w-[365px]">
                  <ProjectCard item={item} />
                </li>
              ))}
            </ul>
            <p className="mt-16 text-center text-lg text-muted">
              {t('projects.ask')}{' '}
              <Link to="/#contacto" className="font-display font-semibold text-action underline-offset-4 dark:text-blue hover:underline">
                {t('projects.write')}
              </Link>
            </p>
          </div>
        </div>
      )}
    </QueryState>
  );
}
