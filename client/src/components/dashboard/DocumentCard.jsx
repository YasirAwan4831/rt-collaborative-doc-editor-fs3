import { Link } from 'react-router-dom';
import { FileText, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatRelativeTime } from '../../utils/formatDate.js';
import { ROLE_LABELS } from '../../constants/roles.js';
import { cn } from '../../utils/cn.js';

export function DocumentCard({ document, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group relative rounded-xl border border-[var(--border)] bg-surface-elevated p-5 transition-all hover:border-brand-500/30 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/editor/${document.id}`} className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-[var(--text-primary)] group-hover:text-brand-600">
              {document.title}
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Edited {formatRelativeTime(document.updatedAt)}
            </p>
          </div>
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-muted data-[open]:opacity-100"
            data-open={menuOpen || undefined}
          >
            <MoreVertical className="h-4 w-4 text-[var(--text-muted)]" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-40 rounded-lg border border-[var(--border)] bg-surface-elevated py-1 shadow-soft">
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted"
                  onClick={() => { setMenuOpen(false); onRename(document); }}
                >
                  <Pencil className="h-4 w-4" /> Rename
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10"
                  onClick={() => { setMenuOpen(false); onDelete(document); }}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-medium',
            document.role === 'viewer'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
          )}
        >
          {ROLE_LABELS[document.role] || 'Editor'}
        </span>
        <span className="text-xs text-[var(--text-muted)]">v{document.version}</span>
      </div>
    </div>
  );
}

export default DocumentCard;
