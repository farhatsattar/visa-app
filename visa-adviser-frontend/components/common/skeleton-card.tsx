export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-600 dark:bg-slate-800">
      <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-600" />
      <div className="mt-4 h-3 w-full rounded bg-slate-200 dark:bg-slate-600" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-600" />
    </div>
  );
}
