export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand-200 dark:border-brand-900" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] animate-pulse-soft">{message}</p>
    </div>
  );
}

export default LoadingScreen;
