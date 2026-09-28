import { Link } from 'react-router-dom';
import { media, mediaUrl } from '../assets/media';
import { Stars } from './ui';

export function ArticleView({ title, summary, rating, poster, posterLabel, playable = false, sections, aside, kicker, back, footer }) {
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
            <h1 className="mt-2 font-display text-2xl font-bold leading-9 text-fg lg:text-[36px] lg:leading-[54px]">{title}</h1>
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
                <span className="sr-only">Calificación: </span>
                {rating}
              </p>
              <Stars value={rating} starClass="h-4 w-4 lg:h-6 lg:w-6" className="mt-1 gap-0.5 lg:gap-[5px]" />
            </div>
          ) : null}
        </header>

        {poster ? (
          <figure className="relative mt-[37px] overflow-hidden rounded-xl lg:mt-[46px]">
            <img src={mediaUrl(poster)} alt={posterLabel} className="h-[221px] w-full object-cover object-bottom lg:h-[455px]" />
            <span className="absolute inset-0 bg-black/20" aria-hidden="true" />
            {playable ? (
              <img
                src={media.play}
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 w-[35px] -translate-x-1/2 -translate-y-1/2 lg:w-[69px]"
              />
            ) : null}
          </figure>
        ) : null}

        <div className={poster ? 'mt-9 lg:mt-16' : 'mt-[68px] lg:mt-[74px]'}>
          {sections.map((section, index) => (
            <section key={`${section.heading}-${index}`} className={index ? 'mt-[46px]' : ''}>
              <h2 className="flex items-center gap-[5px] font-display text-2xl font-bold leading-9 text-fg">
                <img src={media['flag-small']} alt="" aria-hidden="true" className="h-[27px] w-8" />
                {section.heading}
              </h2>
              <p className="mt-3.5 text-sm leading-[17px] text-muted lg:mt-6 lg:text-xl lg:leading-6">{section.body}</p>
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
