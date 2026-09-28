import { Link } from 'react-router-dom';
import { mediaUrl } from '../assets/media';
import { formatDate } from '../lib/posts';
import { Stars } from './ui';

const borders = {
  orange: 'border-grad-orange',
  green: 'border-grad-green',
};

function MediaCard({ to, cover, title, text, variant = 'orange', rating, actionLabel, badge, meta }) {
  return (
    <article className={`group relative flex min-h-[403px] flex-col rounded-[14px] shadow-card ${borders[variant]}`}>
      <div className="flex flex-1 flex-col">
        <div className="relative h-[174px] shrink-0 overflow-hidden rounded-t-[12px] bg-soft">
          {cover ? (
            <img
              src={mediaUrl(cover)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-[scale] duration-700 ease-out group-hover:scale-110 group-has-[a:focus-visible]:scale-110 motion-safe:group-hover:animate-drift motion-safe:group-has-[a:focus-visible]:animate-drift"
            />
          ) : null}
          <span className="absolute inset-0 bg-[rgba(30,30,30,0.3)]" aria-hidden="true" />
          {badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-noto text-xs font-semibold text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
          <h3 className="line-clamp-2 font-display text-xl font-semibold leading-[30px] text-fg group-hover:text-action dark:group-hover:text-blue">
            <Link
              to={to}
              className="outline-none after:absolute after:inset-0 after:rounded-[14px] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-blue"
            >
              <span className="sr-only">{actionLabel}: </span>
              {title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 max-w-[290px] text-lg leading-[22px] text-muted">{text}</p>
          {meta ? <p className="mt-3 font-noto text-sm text-muted">{meta}</p> : null}
          <div className="mt-auto flex items-center justify-between pt-4">
            {rating ? <Stars value={rating} /> : <span />}
            <span className="inline-flex h-9 w-[100px] items-center justify-center gap-1 rounded-[40px] bg-ink pl-2 text-sm font-bold text-white transition group-hover:bg-black dark:bg-paper dark:text-ink dark:group-hover:bg-white">
              Ver
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
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
      badge={item.type === 'video' ? 'Video' : 'Blog'}
      meta={formatDate(item.published)}
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
