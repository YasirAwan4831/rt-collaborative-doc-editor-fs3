import { History, RotateCcw } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDate.js';
import { Button } from '../common/Button.jsx';
import { canEdit } from '../../constants/roles.js';

export function VersionHistoryPanel({ versions, role, onRestore, onClose }) {
  return (
    <div className="flex h-full w-80 flex-col border-l border-[var(--border)] bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-semibold">Version History</span>
        </div>
        <button onClick={onClose} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {versions.length === 0 ? (
          <p className="text-center text-sm text-[var(--text-muted)] py-8">
            No versions yet. Edits will appear here as snapshots.
          </p>
        ) : (
          <div className="relative space-y-0">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]" />
            {versions.map((v) => (
              <div key={v.id} className="relative flex gap-4 pb-6 pl-6">
                <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-brand-500 bg-surface-elevated" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Version {v.version}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{formatDateTime(v.createdAt)}</p>
                  {canEdit(role) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 !px-0"
                      onClick={() => onRestore(v.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border)] p-3 text-xs text-[var(--text-muted)]">
        Firestore persistence placeholder — connect database for full history
      </div>
    </div>
  );
}

export default VersionHistoryPanel;
