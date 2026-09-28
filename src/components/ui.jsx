import { useId } from 'react';
import { Link } from 'react-router-dom';
import { media } from '../assets/media';

export function FlagTitle({ as = 'h2', id, lines, className = '', size = 'lg' }) {
  const Tag = as;
  const [first, ...rest] = lines;
  const large = size === 'lg';
  return (
    <div className={`relative ${large ? 'pl-[55px] md:pl-[99px]' : 'pl-[37px]'} ${className}`}>
      <img
        src={media.flag}
        alt=""
        aria-hidden="true"
        className={`absolute left-0 ${large ? 'top-[11px] w-[50px] md:top-1 md:w-[110px]' : 'top-1 w-8'}`}
      />
      <Tag
        id={id}
        className={`relative font-display font-bold text-fg ${
          large ? 'text-2xl leading-[27px] md:text-[32px] md:leading-[48px]' : 'text-2xl leading-9'
        }`}
      >
        {first}
        {rest.map((line) => (
          <span key={line} className={`block ${large ? 'md:pl-[17px]' : ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    </div>
  );
}

function StarShape({ fill, className }) {
  const id = `half${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id}>
          <stop offset="50%" stopColor="#fec601" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.8l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.8l-5.8 3.3 1.5-6.4-4.9-4.3 6.5-.6z"
        fill={fill === 'full' ? '#fec601' : fill === 'half' ? `url(#${id})` : 'transparent'}
        stroke="#fec601"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Stars({ value, starClass = 'h-8 w-8', className = 'gap-1' }) {
  const stars = [1, 2, 3, 4, 5].map((n) => (value >= n ? 'full' : value >= n - 0.5 ? 'half' : 'empty'));
  return (
    <span className={`inline-flex ${className}`} role="img" aria-label={`Calificación ${value} de 5`}>
      {stars.map((fill, index) => (
        <StarShape key={index} fill={fill} className={starClass} />
      ))}
    </span>
  );
}

export function ViewButton({ to, label }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="inline-flex h-9 w-[100px] items-center justify-center gap-1 rounded-[40px] bg-ink pl-2 text-sm font-bold text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue dark:bg-paper dark:text-ink dark:hover:bg-white"
    >
      Ver
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export function TricolorBar({ className = '' }) {
  return (
    <div className={`grid h-[7px] grid-cols-3 md:h-[14px] ${className}`} aria-hidden="true">
      <span className="bg-yellow" />
      <span className="bg-blue" />
      <span className="bg-red" />
    </div>
  );
}

export function TriBars({ className = '' }) {
  return (
    <span className={`flex gap-[3px] ${className}`} aria-hidden="true">
      <span className="h-1.5 w-14 rounded-[9px] bg-yellow" />
      <span className="h-1.5 w-14 rounded-[9px] bg-blue" />
      <span className="h-1.5 w-14 rounded-[9px] bg-red" />
    </span>
  );
}
