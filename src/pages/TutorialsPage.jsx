import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { QueryState } from '../components/QueryState';
import { TutorialCard } from '../components/Cards';
import { wrap } from '../components/layout';
import { media, mediaUrl } from '../assets/media';

const PAGE_SIZE = 8;

export function TutorialsPage() {
  const query = useContent('/tutorials/tutorials');
  const site = useContent('/site/site');
  const [params, setParams] = useSearchParams();
  const filter = params.get('tipo') || 'todos';
  const page = Math.max(1, Number(params.get('pagina') || 1));

  return (
    <QueryState query={query}>
      {(data) => (
        <TutorialList
          data={data}
          coffee={site.data?.coffee}
          filter={filter}
          page={page}
          onFilter={(tipo) => setParams(tipo === 'todos' ? {} : { tipo })}
          onPage={(next, tipo) => {
            const value = { pagina: String(next) };
            if (tipo !== 'todos') value.tipo = tipo;
            setParams(value);
          }}
        />
      )}
    </QueryState>
  );
}

function CoffeeBubble({ coffee }) {
  return (
    <a
      href={coffee.href}
      className="group hidden items-center gap-[5px] rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue lg:flex"
    >
      <span className="relative flex h-12 w-[209px] items-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]">
        <img src={media['coffee-bubble']} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full" />
        <span className="relative flex items-center gap-[7px] pl-4">
          <img src={media.coffee} alt="" aria-hidden="true" className="h-9 w-9" />
          <span className="text-base text-ink-soft">{coffee.label}</span>
        </span>
      </span>
      <span className="relative flex h-[102px] w-[102px] items-center justify-center rounded-full bg-blue transition group-hover:brightness-95">
        <img src={media.paypal} alt="" aria-hidden="true" className="h-[54px] w-[54px]" />
      </span>
    </a>
  );
}

function TutorialList({ data, coffee, filter, page, onFilter, onPage }) {
  const filtered = useMemo(() => {
    if (filter === 'todos') return data.items;
    return data.items.filter((item) => item.type === filter);
  }, [data.items, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="relative overflow-x-clip pb-[62px] lg:pb-[276px]">
      <section aria-labelledby="tutoriales-page-title" className="relative lg:h-[408px]">
        <div className="relative h-[198px] overflow-hidden lg:absolute lg:right-0 lg:top-0 lg:h-[334px] lg:w-[50.2%]">
          <img src={mediaUrl(data.hero)} alt="" aria-hidden="true" className="h-full w-full -scale-x-100 object-cover" />
          <span className="absolute inset-0 bg-[linear-gradient(0deg,#fff_0%,rgba(81,161,235,0.34)_100%)] dark:bg-[linear-gradient(0deg,#1b1b1b_0%,rgba(81,161,235,0.34)_100%)] lg:bg-[linear-gradient(90deg,#fff_3%,rgba(81,161,235,0.34)_100%)] dark:lg:bg-[linear-gradient(90deg,#1b1b1b_3%,rgba(81,161,235,0.34)_100%)]" />
        </div>
        <span
          aria-hidden="true"
          className="mx-auto block h-0.5 w-[308px] translate-x-[17px] rounded-[10px] bg-blue lg:absolute lg:right-[2.9%] lg:top-[334px] lg:h-[5px] lg:w-[44.6%] lg:translate-x-0"
        />
        <img
          src={media['dots-red']}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[-182px] top-[175px] w-[252px] lg:left-[-8px] lg:top-[67px]"
        />
        <div className={`${wrap} relative mt-8 text-center lg:absolute lg:inset-x-0 lg:top-[142px] lg:mt-0 lg:text-left`}>
          <div className="lg:pl-[86px]">
            <h1
              id="tutoriales-page-title"
              className="font-display text-2xl font-bold leading-9 text-fg lg:text-[36px] lg:leading-[54px]"
            >
              {data.title}
            </h1>
            <p className="mx-auto mt-[18px] max-w-[286px] text-sm leading-[17px] text-muted lg:mx-0 lg:mt-[33px] lg:max-w-[408px] lg:text-xl lg:leading-6">
              {data.lead}
            </p>
          </div>
        </div>
      </section>

      <div className={`${wrap} relative`}>
        <div className="mt-14 flex items-center justify-between lg:mt-0 lg:pl-[86px]">
          <div
            className="grid w-full grid-cols-3 gap-[47px] lg:flex lg:w-auto lg:gap-[39px]"
            role="group"
            aria-label="Tipo de contenido"
          >
            {data.filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onFilter(item.id)}
                  className={`h-[41px] rounded-[20px] border border-blue font-display text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue lg:w-[120px] lg:text-base ${
                    active ? 'bg-action text-white' : 'bg-card text-action hover:bg-blue/10 dark:text-blue'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {coffee ? <CoffeeBubble coffee={coffee} /> : null}
        </div>

        <img
          src={media['dots-blue']}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-149px] top-[470px] w-[252px] lg:right-[-11px] lg:top-[491px]"
        />
        <img
          src={media['dots-red']}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[-125px] top-[1393px] w-[252px] lg:left-[-7px] lg:top-[1001px]"
        />

        <h2 className="sr-only">Listado de tutoriales y blog</h2>
        {visible.length === 0 ? (
          <p className="mt-10 text-muted">No hay piezas con ese filtro.</p>
        ) : (
          <ul className="relative mt-14 grid justify-items-center gap-[34px] md:grid-cols-2 lg:mt-[77px] xl:grid-cols-4 xl:gap-x-8 xl:gap-y-[86px]">
            {visible.map((item) => (
              <li key={item.slug} className="w-full max-w-[365px]">
                <TutorialCard item={item} variant="green" showRating />
              </li>
            ))}
          </ul>
        )}

        {pages > 1 ? (
          <nav className="mt-16 flex justify-center gap-3" aria-label="Paginación">
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => onPage(number, filter)}
                className={`h-[41px] w-[41px] rounded-[20px] border border-blue font-display text-base font-semibold ${
                  number === current ? 'bg-action text-white' : 'bg-card text-action dark:text-blue'
                }`}
                aria-current={number === current ? 'page' : undefined}
              >
                {number}
              </button>
            ))}
          </nav>
        ) : null}
      </div>
    </div>
  );
}
