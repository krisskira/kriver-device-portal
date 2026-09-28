import { useParams } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { ArticleView } from '../components/ArticleView';

export function PostPage() {
  const { slug } = useParams();
  const query = useContent('/tutorials/tutorials');

  return (
    <QueryState query={query}>
      {(data) => {
        const post = data.items.find((item) => item.slug === slug);
        if (!post) return <Missing label="Ese tutorial no está en la lista." />;
        const isVideo = post.type === 'video';
        return (
          <ArticleView
            title={post.title}
            summary={post.excerpt}
            rating={post.rating}
            poster={isVideo ? post.poster : undefined}
            posterLabel={`Vista previa del video: ${post.title}`}
            playable={isVideo}
            sections={post.sections}
          />
        );
      }}
    </QueryState>
  );
}

export function Missing({ label }) {
  return <p className="mx-auto max-w-3xl px-5 py-16 text-muted sm:px-8">{label}</p>;
}
