import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { BrandLogo } from './Logo';
import { wrap } from './layout';
import { useTheme } from '../hooks/useTheme';
import { useContent } from '../hooks/useContent';
import { media } from '../assets/media';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue';

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const site = useContent('/site/site');
  const location = useLocation();
  const locationKey = `${location.pathname}${location.hash}`;
  const [menu, setMenu] = useState({ key: locationKey, open: false });
  const open = menu.key === locationKey && menu.open;
  const setOpen = (value) => setMenu({ key: locationKey, open: value });
  const nav = site.data?.nav ?? [];
  const payments = site.data?.payments;
  const coffee = site.data?.coffee;
  const onTutorials = location.pathname.startsWith('/tutoriales');
  const [atTop, setAtTop] = useState(true);
  const home = useContent('/home/home');
  const overlay = location.pathname === '/' && home.isSuccess && atTop && !open;
  const tone = overlay ? 'text-paper' : 'text-fg';

  useEffect(() => {
    const update = () => setAtTop(window.scrollY < 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const themeButton = (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${overlay ? 'text-paper hover:bg-white/10' : 'text-fg hover:bg-black/5 dark:hover:bg-white/10'} ${focusRing}`}
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${overlay ? 'bg-transparent' : 'bg-header shadow-bar'}`}
    >
      <div className={`${wrap} flex h-[90px] items-center justify-between`}>
        <Link to="/" className={`rounded-md ${focusRing}`}>
          <BrandLogo className="h-[68px] w-auto" onDark={overlay} />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex xl:gap-[109px]" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`font-noto text-lg font-semibold transition ${overlay ? 'text-paper hover:text-yellow' : 'text-fg hover:text-blue'} ${focusRing}`}
            >
              {item.label}
            </Link>
          ))}
          {payments ? (
            <span className="flex items-center gap-4">
              <Link
                to={payments.to}
                className={`inline-flex h-[41px] w-[120px] items-center justify-center rounded-[20px] bg-action font-noto text-lg font-semibold text-white transition hover:brightness-95 ${focusRing}`}
              >
                {payments.label}
              </Link>
              {themeButton}
            </span>
          ) : null}
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          {onTutorials && coffee ? (
            <a
              href={coffee.href}
              className={`inline-flex h-[30px] items-center gap-3 rounded-[20px] bg-action pl-[13px] pr-[13px] font-display text-[10px] font-medium text-white ${focusRing}`}
            >
              {coffee.label}
              <img src={media.paypal} alt="" aria-hidden="true" className="h-6 w-6 brightness-0 invert" />
            </a>
          ) : payments ? (
            <Link
              to={payments.to}
              className={`inline-flex h-[33px] w-[112px] items-center justify-center rounded-[20px] bg-action font-noto text-sm font-semibold text-white ${focusRing}`}
            >
              {payments.label}
            </Link>
          ) : null}
          {themeButton}
          <button
            type="button"
            className={`inline-flex h-9 w-9 items-center justify-center ${tone} ${focusRing}`}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-[90px] z-40 lg:hidden">
          <button className="absolute inset-0 bg-ink/40" aria-label="Cerrar menú" onClick={() => setOpen(false)} />
          <nav
            id="menu-movil"
            className="absolute inset-x-0 top-0 flex h-[354px] flex-col items-center bg-bg pt-[42px] shadow-bar"
            aria-label="Móvil"
          >
            <ul className="flex flex-col items-center gap-[50px]">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={`font-noto text-sm font-semibold text-fg ${focusRing}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-auto pb-[26px] font-noto text-[10px] font-semibold text-[#ababab]">
              © {new Date().getFullYear()} Kriver Devices Todos los derechos reservados
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
