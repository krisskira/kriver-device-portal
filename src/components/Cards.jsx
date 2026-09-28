import { mediaUrl } from '../assets/media';
import { Stars, ViewButton } from './ui';

const borders = {
  orange: 'border-grad-orange',
  green: 'border-grad-green',
};

function MediaCard({ to, cover, title, text, variant = 'orange', rating, actionLabel }) {
  return (
    <article className={`flex h-[403px] flex-col rounded-[14px] shadow-card ${borders[variant]}`}>
      <div className="relative h-[174px] shrink-0 overflow-hidden rounded-t-[12px] bg-soft">
        {cover ? (
          <img src={mediaUrl(cover)} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : null}
        <span className="absolute inset-0 bg-[rgba(30,30,30,0.3)]" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
        <h3 className="line-clamp-2 font-display text-xl font-semibold leading-[30px] text-fg">{title}</h3>
        <p className="mt-4 line-clamp-3 max-w-[290px] text-lg leading-[22px] text-muted">{text}</p>
        <div className="mt-auto flex items-center justify-between">
          {rating ? <Stars value={rating} /> : <span />}
          <ViewButton to={to} label={`${actionLabel}: ${title}`} />
        </div>
      </div>
    </article>
  );
}

export function TutorialCard({ item, variant = 'orange', showRating = false }) {
  return (
    <MediaCard
      to={`/tutoriales/${item.slug}`}
      cover={item.cover}
      title={item.title}
      text={item.excerpt}
      variant={variant}
      rating={showRating ? item.rating : undefined}
      actionLabel={item.type === 'video' ? 'Ver video' : 'Ver blog'}
    />
  );
}

export function ProjectCard({ item }) {
  return (
    <MediaCard
      to={`/proyectos/${item.slug}`}
      cover={item.cover}
      title={item.title}
      text={item.summary}
      actionLabel="Ver proyecto"
    />
  );
}
