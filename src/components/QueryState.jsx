export function QueryState({ query, children }) {
  if (query.isPending) return <Skeleton />;
  if (query.isError) {
    return (
      <div className="mx-auto max-w-[1191px] px-4 py-24">
        <div role="alert" className="rounded-xl border border-ink-soft bg-card px-6 py-8">
          <p className="font-display text-xl font-bold text-fg">No pudimos cargar esta información.</p>
          <p className="mt-2 text-lg text-muted">{query.error?.message}</p>
          <button
            type="button"
            onClick={() => query.refetch()}
            className="mt-6 h-[41px] w-[120px] rounded-[20px] bg-action font-display text-base font-semibold text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
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
