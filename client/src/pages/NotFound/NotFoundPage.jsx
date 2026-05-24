import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
        <FileQuestion className="h-10 w-10" />
      </div>
      <div>
        <h1 className="text-6xl font-bold text-[var(--text-primary)]">404</h1>
        <p className="mt-2 text-lg text-[var(--text-secondary)]">Page not found</p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
      </div>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
