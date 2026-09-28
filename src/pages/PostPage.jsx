import { useParams } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { ArticleView } from '../components/ArticleView';
import { TutorialCard } from '../components/Cards';
import { formatDate, relatedPosts } from '../lib/posts';

export function PostPage() {
  const { slug } = useParams();
  const query = useContent('/tutorials/tutorials');

  return (
    <QueryState query={query}>
      {(data) => {
        const post = data.items.find((item) => item.slug === slug);
        if (!post) return <Missing label="Ese tutorial no está en la lista." />;
        const isVideo = post.type === 'video';
        const related = relatedPosts(data.items, post);
        return (
          <ArticleView
            back={{ to: '/tutoriales', label: '← Todos los tutoriales' }}
            kicker={`${isVideo ? 'Video' : 'Blog'} · ${formatDate(post.published)} · ${post.minutes} min`}
            title={post.title}
            summary={post.excerpt}
            rating={post.rating}
            poster={isVideo ? post.poster : undefined}
            posterLabel={`Vista previa del video: ${post.title}`}
            playable={isVideo}
            sections={post.sections}
            footer={
              related.length ? (
                <div className="mt-16 border-t border-line/30 pt-12 lg:mt-24">
                  <h2 className="font-display text-2xl font-bold text-fg">Sigue con</h2>
                  <ul className="mt-8 grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {related.map((item) => (
                      <li key={item.slug} className="w-full max-w-[365px]">
                        <TutorialCard item={item} variant="green" showRating />
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

export function Missing({ label }) {
  return <p className="mx-auto max-w-3xl px-5 py-16 text-muted sm:px-8">{label}</p>;
}
