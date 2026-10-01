import { Link } from 'react-router-dom';
import { mediaUrl } from '../assets/media';
import { formatDate } from '../lib/posts';
import { useI18n } from '../hooks/useI18n';
import { Stars } from './ui';

const borders: Record<string, string> = {
  orange: 'border-grad-orange',
  green: 'border-grad-green',
};

export function ComingSoonBadge({ label = 'Coming soon' }: any) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/45 bg-[rgba(24,24,24,0.55)] px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.16em] text-paper shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-md">
      {label}
    </span>
  );
}

function MediaCard({
  to,
  cover,
  title,
  text,
  variant = 'orange',
  rating,
  actionLabel,
  badge,
  meta,
  comingSoon = false,
  comingSoonLabel = 'Coming soon',
}: any) {
  const { t } = useI18n();
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
          {comingSoon ? (
            <span className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px]">
              <ComingSoonBadge label={comingSoonLabel} />
            </span>
          ) : (
            <span className="absolute inset-0 bg-[rgba(30,30,30,0.3)]" aria-hidden="true" />
          )}
          {badge ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-ink/80 px-3 py-1 font-noto text-xs font-semibold text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-3">
          <h3 className="h-[60px] font-display text-xl font-semibold leading-[30px] text-fg group-hover:text-action dark:group-hover:text-blue">
            <Link
              to={to}
              className="line-clamp-2 outline-none after:absolute after:inset-0 after:rounded-[14px] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-blue"
            >
              <span className="sr-only">{actionLabel}: </span>
              {title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 h-[66px] text-lg leading-[22px] text-muted">{text}</p>
          {meta ? <p className="mt-3 font-noto text-sm text-muted">{meta}</p> : null}
          <div className="mt-auto flex items-center justify-between pt-4">
            {rating ? <Stars value={rating} /> : <span />}
            <span className="inline-flex h-9 w-[100px] items-center justify-center gap-1 rounded-[40px] bg-ink pl-2 text-sm font-bold text-white transition group-hover:bg-black dark:bg-paper dark:text-ink dark:group-hover:bg-white">
              {t('card.view')}
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

export function TutorialCard({ item, variant = 'orange', showRating = false, comingSoonLabel }: any) {
  const { locale, t } = useI18n();
  return (
    <MediaCard
      to={`/tutoriales/${item.slug}`}
      cover={item.cover}
      title={item.title}
      text={item.excerpt}
      variant={variant}
      rating={showRating ? item.rating : undefined}
      actionLabel={item.type === 'video' ? t('card.viewVideo') : t('card.viewPost')}
      badge={item.type === 'video' ? t('card.video') : t('card.post')}
      meta={formatDate(item.published, locale)}
      comingSoon={item.comingSoon}
      comingSoonLabel={item.comingSoonLabel || comingSoonLabel}
    />
  );
}

export function ProjectCard({ item }: any) {
  const { t } = useI18n();
  return (
    <MediaCard
      to={`/proyectos/${item.slug}`}
      cover={item.cover}
      title={item.title}
      text={item.summary}
      actionLabel={t('card.viewProject')}
    />
  );
}
