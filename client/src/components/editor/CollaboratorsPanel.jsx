import { Users, Wifi, WifiOff } from 'lucide-react';
import { Avatar } from '../common/Avatar.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';
import { useSocket } from '../../hooks/useSocket.js';

export function CollaboratorsPanel({ collaborators, typingUsers }) {
  const { connected } = useSocket();

  return (
    <div className="flex h-full flex-col border-l border-[var(--border)] bg-surface-elevated w-64 shrink-0">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">Active</span>
        </div>
        <span
          className={`flex items-center gap-1 text-xs ${connected ? 'text-emerald-600' : 'text-amber-600'}`}
          title={connected ? 'Connected' : 'Reconnecting...'}
        >
          {connected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {connected ? 'Online' : 'Offline'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {collaborators.length === 0 ? (
          <p className="text-center text-xs text-[var(--text-muted)] py-6">No collaborators yet</p>
        ) : (
          collaborators.map((c) => (
            <div
              key={c.socketId || c.userId}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-muted"
            >
              <Avatar name={c.displayName} src={c.photoURL} online={c.status === 'online'} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {c.displayName}
                  {typingUsers?.includes(c.userId) && (
                    <span className="ml-1 text-xs text-brand-600 animate-pulse-soft">typing...</span>
                  )}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {ROLE_LABELS[c.role] || 'Collaborator'}
                </p>
              </div>
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: c.color || '#33a6ff' }}
                title="Cursor color"
              />
            </div>
          ))
        )}
      </div>

      <div className="border-t border-[var(--border)] p-3">
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-2">
          Cursor tracking
        </p>
        <div className="rounded-lg border border-dashed border-[var(--border)] p-3 text-center text-xs text-[var(--text-muted)]">
          Live cursor positions will appear here when Firestore sync is enabled
        </div>
      </div>
    </div>
  );
}

export default CollaboratorsPanel;
