import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export function AppLogo({ to = '/dashboard', compact = false }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow transition-transform group-hover:scale-105">
        <FileText className="h-5 w-5" />
      </div>
      {!compact && (
        <div>
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            CollabSpace
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-widest text-brand-600">
            Real-time
          </span>
        </div>
      )}
    </Link>
  );
}

export default AppLogo;
