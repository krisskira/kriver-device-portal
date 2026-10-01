import { Link } from 'react-router-dom';
import { media, mediaUrl } from '../assets/media';
import { ComingSoonBadge } from './Cards';
import { Stars } from './ui';
import { useI18n } from '../hooks/useI18n';

export function ArticleView({
  title,
  summary,
  rating,
  poster,
  posterLabel,
  video,
  playable = false,
  sections,
  aside,
  kicker,
  back,
  footer,
  comingSoon = false,
  comingSoonLabel = 'Coming soon',
}: any) {
  const { t } = useI18n();
  return (
    <article className="relative overflow-x-clip pb-[62px] lg:pb-[107px]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[294px] bg-[linear-gradient(180deg,rgba(81,161,235,0.29)_0%,rgba(255,255,255,0)_100%)]"
      />
      <img
        src={media['dots-blue']}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none absolute right-[-103px] w-[186px] lg:right-[-10px] lg:top-[336px] lg:w-[252px] ${
          poster ? 'top-[416px]' : 'top-[606px]'
        }`}
      />
      <img
        src={media['dots-red']}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-7px] top-[1409px] hidden w-[252px] lg:block"
      />

      <div className="relative mx-auto max-w-[1191px] px-4">
        <header className="flex items-start justify-between gap-6 pt-[94px] lg:pt-[142px]">
          <div className="max-w-[745px]">
            {back ? (
              <Link
                to={back.to}
                className="font-noto text-sm font-semibold text-action focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue dark:text-blue"
              >
                {back.label}
              </Link>
            ) : null}
            {kicker ? <p className="mt-4 font-noto text-sm font-semibold text-action dark:text-blue">{kicker}</p> : null}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-3">
              <h1 className="font-display text-2xl font-bold leading-9 text-fg lg:text-[36px] lg:leading-[54px]">{title}</h1>
              {comingSoon ? (
                <span className="inline-flex items-center rounded-full border border-ink/15 bg-ink px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.16em] text-paper dark:border-paper/20 dark:bg-paper dark:text-ink">
                  {comingSoonLabel}
                </span>
              ) : null}
            </div>
            {summary ? (
              <p className="mt-2 max-w-[245px] text-sm leading-[17px] text-muted sm:max-w-none lg:mt-8 lg:text-lg lg:leading-[22px]">
                {summary}
              </p>
            ) : null}
            {aside}
          </div>
          {rating ? (
            <div className="mt-[46px] flex shrink-0 flex-col items-center lg:mt-[34px]">
              <p className="font-display text-xl font-bold leading-[30px] text-fg lg:text-[36px] lg:leading-[54px]">
                <span className="sr-only">{t('article.rating')}</span>
                {rating}
              </p>
              <Stars value={rating} starClass="h-4 w-4 lg:h-6 lg:w-6" className="mt-1 gap-0.5 lg:gap-[5px]" />
            </div>
          ) : null}
        </header>

        {video && !comingSoon ? (
          <figure className="mt-[37px] lg:mt-[46px]">
            <video
              controls
              playsInline
              preload="metadata"
              poster={mediaUrl(video.poster || poster)}
              aria-label={posterLabel}
              className="aspect-video w-full rounded-xl bg-ink object-contain"
            >
              <source src={mediaUrl(video.src)} type="video/mp4" />
            </video>
            {video.caption ? <Caption text={video.caption} /> : null}
          </figure>
        ) : poster ? (
          <figure className="relative mt-[37px] overflow-hidden rounded-xl lg:mt-[46px]">
            <img src={mediaUrl(poster)} alt={posterLabel} className="h-[221px] w-full object-cover object-bottom lg:h-[455px]" />
            <span className="absolute inset-0 bg-black/20" aria-hidden="true" />
            {comingSoon ? (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/30 backdrop-blur-[2px]">
                <ComingSoonBadge label={comingSoonLabel} />
                {playable ? (
                  <img src={media.play} alt="" aria-hidden="true" className="w-[35px] lg:w-[69px]" />
                ) : null}
              </span>
            ) : playable ? (
              <img
                src={media.play}
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 w-[35px] -translate-x-1/2 -translate-y-1/2 lg:w-[69px]"
              />
            ) : null}
          </figure>
        ) : null}

        <div className={poster || video ? 'mt-9 lg:mt-16' : 'mt-[68px] lg:mt-[74px]'}>
          {sections.map((section: any, index: any) => (
            <section key={`${section.heading}-${index}`} className={index ? 'mt-[46px] lg:mt-16' : ''}>
              <h2 className="flex items-center gap-[5px] font-display text-2xl font-bold leading-9 text-fg">
                <img src={media['flag-small']} alt="" aria-hidden="true" className="h-[27px] w-8" />
                {section.heading}
              </h2>
              {[].concat(section.body ?? []).map((paragraph: any, i: any) => (
                <p key={i} className={`${i ? 'mt-3 lg:mt-4' : 'mt-3.5 lg:mt-6'} ${bodyText}`}>
                  <Rich text={paragraph} />
                </p>
              ))}
              {section.list ? (
                <ul className={`mt-3 list-disc space-y-2 pl-5 marker:text-action lg:mt-4 lg:pl-7 dark:marker:text-blue ${bodyText}`}>
                  {section.list.map((item: any) => (
                    <li key={item}>
                      <Rich text={item} />
                    </li>
                  ))}
                </ul>
              ) : null}
              {section.image ? <Figure image={section.image} className="mt-5 lg:mt-8" /> : null}
              {section.gallery ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-6">
                  {section.gallery.map((image: any) => (
                    <Figure key={image.src} image={image} />
                  ))}
                </div>
              ) : null}
              {section.code ? (
                <pre className="mx-auto mt-5 max-w-[706px] overflow-x-auto rounded-xl bg-[#0d1117] px-4 py-3 font-mono text-xs leading-[18px] text-[#9ecbff] lg:mt-8 lg:text-[13px]">
                  <code>{section.code}</code>
                </pre>
              ) : null}
            </section>
          ))}
          {footer}
        </div>
      </div>
    </article>
  );
}

const bodyText = 'text-sm leading-[17px] text-muted lg:text-xl lg:leading-7';

export function Rich({ text }: any) {
  return String(text)
    .split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .map((part: any, i: any) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <a
            key={i}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-action underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue dark:text-blue"
          >
            {link[1]}
          </a>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-fg">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="rounded bg-soft px-1.5 py-0.5 font-mono text-[0.85em] text-fg">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
}

function Caption({ text }: any) {
  return (
    <figcaption className="mt-2 text-center font-noto text-xs leading-5 text-muted lg:text-sm">
      <Rich text={text} />
    </figcaption>
  );
}

function Figure({ image, className = '' }: any) {
  return (
    <figure className={className}>
      <img
        src={mediaUrl(image.src)}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        className={`h-auto w-full rounded-xl border border-line/30 ${
          image.pixelated ? 'bg-[#9fc38a] [image-rendering:pixelated]' : 'bg-white'
        }`}
      />
      {image.caption ? <Caption text={image.caption} /> : null}
    </figure>
  );
}
