import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useI18n } from '../hooks/useI18n';

type QueryLike<T> =
  | Pick<UseQueryResult<T>, 'isPending' | 'isError' | 'error' | 'data' | 'refetch'>
  | { isPending: true };

export function QueryState<T>({ query, children }: { query: QueryLike<T>; children: (data: T) => ReactNode }) {
  const { t } = useI18n();
  if (query.isPending) return <Skeleton />;
  if ('isError' in query && query.isError) {
    const message = query.error instanceof Error ? query.error.message : undefined;
    return (
      <div className="mx-auto max-w-[1191px] px-4 py-24">
        <div role="alert" className="rounded-xl border border-ink-soft bg-card px-6 py-8">
          <p className="font-display text-xl font-bold text-fg">{t('query.error')}</p>
          <p className="mt-2 text-lg text-muted">{message}</p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-6 h-[41px] w-[120px] rounded-[20px] bg-action font-display text-base font-semibold text-white"
          >
            {t('query.retry')}
          </button>
        </div>
      </div>
    );
  }
  if (!('data' in query) || query.data === undefined) return null;
  return children(query.data);
}

function Skeleton() {
  return (
    <div className="mx-auto max-w-[1191px] animate-pulse space-y-4 px-4 py-24" aria-hidden="true">
      <div className="h-10 w-2/3 rounded-full bg-soft" />
      <div className="h-5 w-full rounded-full bg-soft" />
      <div className="h-5 w-5/6 rounded-full bg-soft" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="h-[403px] rounded-[14px] bg-soft" />
        <div className="h-[403px] rounded-[14px] bg-soft" />
      </div>
    </div>
  );
}
