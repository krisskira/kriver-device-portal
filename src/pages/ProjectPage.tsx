import type { ProjectsContent } from '../types';
import { useParams } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { ArticleView } from '../components/ArticleView';
import { Missing } from './PostPage';
import { useI18n } from '../hooks/useI18n';

export function ProjectPage() {
  const { slug } = useParams();
  const query = useContent<ProjectsContent>('/projects/projects');
  const { t } = useI18n();

  return (
    <QueryState query={query}>
      {(data: any) => {
        const project = data.items.find((item: any) => item.slug === slug);
        if (!project) return <Missing label={t('project.missing')} />;
        return (
          <ArticleView
            title={project.title}
            summary={project.summary}
            poster={project.cover}
            posterLabel={project.title}
            sections={project.sections}
            aside={
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('project.tech')}>
                <li className="rounded-[20px] bg-action px-4 py-1.5 font-display text-sm font-semibold text-white">
                  {project.year} · {project.role}
                </li>
                {project.tags.map((tag: any) => (
                  <li
                    key={tag}
                    className="rounded-[20px] border border-blue bg-card px-4 py-1.5 font-display text-sm font-semibold text-action dark:text-blue"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            }
          />
        );
      }}
    </QueryState>
  );
}
