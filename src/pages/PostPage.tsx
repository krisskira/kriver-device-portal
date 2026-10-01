import type { TutorialsContent } from '../types';
import { useParams } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { ArticleView } from '../components/ArticleView';
import { TutorialCard } from '../components/Cards';
import { formatDate, relatedPosts } from '../lib/posts';
import { useI18n } from '../hooks/useI18n';

export function PostPage() {
  const { slug } = useParams();
  const { locale, t } = useI18n();
  const query = useContent<TutorialsContent>('/tutorials/tutorials');

  return (
    <QueryState query={query}>
      {(data: any) => {
        const post = data.items.find((item: any) => item.slug === slug);
        if (!post) return <Missing label={t('post.missing')} />;
        const isVideo = post.type === 'video';
        const related = relatedPosts(data.items, post);
        return (
          <ArticleView
            back={{ to: '/tutoriales', label: t('post.back') }}
            kicker={`${isVideo ? t('card.video') : t('card.post')} · ${formatDate(post.published, locale)} · ${post.minutes} min`}
            title={post.title}
            comingSoon={post.comingSoon}
            comingSoonLabel={post.comingSoonLabel || data.comingSoonLabel}
            summary={post.excerpt}
            rating={post.rating}
            poster={isVideo ? post.poster : undefined}
            video={post.video}
            posterLabel={t('post.preview', { title: post.title })}
            playable={isVideo}
            sections={post.sections}
            footer={
              related.length ? (
                <div className="mt-16 border-t border-line/30 pt-12 lg:mt-24">
                  <h2 className="font-display text-2xl font-bold text-fg">{t('post.related')}</h2>
                  <ul className="mt-8 grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {related.map((item: any) => (
                      <li key={item.slug} className="w-full max-w-[365px]">
                        <TutorialCard item={item} variant="green" showRating comingSoonLabel={data.comingSoonLabel} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            }
          />
        );
      }}
    </QueryState>
  );
}

export function Missing({ label }: any) {
  return <p className="mx-auto max-w-3xl px-5 py-16 text-muted sm:px-8">{label}</p>;
}
