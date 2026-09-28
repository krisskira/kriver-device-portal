import { useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { ThemeProvider } from './theme/ThemeProvider';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { Seo } from './components/Seo';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectPage } from './pages/ProjectPage';
import { TutorialsPage } from './pages/TutorialsPage';
import { PostPage } from './pages/PostPage';
import { PaymentPage } from './pages/PaymentPage';

function basename() {
  const base = import.meta.env.BASE_URL || '/';
  if (base === './' || base === '.' || base === '/') return '/';
  return base.replace(/\/$/, '');
}

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={basename()}>
          <ScrollManager />
          <Seo />
          <div className="flex min-h-screen flex-col bg-bg text-fg">
            <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-action focus:px-4 focus:py-2 focus:font-display focus:text-white">
              Saltar al contenido
            </a>
            <SiteHeader />
            <main id="contenido" className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/proyectos" element={<ProjectsPage />} />
                <Route path="/proyectos/:slug" element={<ProjectPage />} />
                <Route path="/tutoriales" element={<TutorialsPage />} />
                <Route path="/tutoriales/:slug" element={<PostPage />} />
                <Route path="/pagos" element={<PaymentPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <SiteFooter />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-[36px] font-bold leading-[54px]">Esa página no existe</h1>
      <p className="mt-3 text-xl text-muted">El enlace no coincide con ninguna sección del portafolio.</p>
      <Link
        to="/"
        className="mt-6 inline-flex h-[41px] items-center rounded-[20px] bg-action px-6 font-display font-semibold text-white"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
