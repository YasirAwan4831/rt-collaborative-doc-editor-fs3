import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, History, Eye } from 'lucide-react';
import { useEditor } from '../../hooks/useEditor.js';
import { RichTextEditor } from '../../components/editor/RichTextEditor.jsx';
import { CollaboratorsPanel } from '../../components/editor/CollaboratorsPanel.jsx';
import { VersionHistoryPanel } from '../../components/editor/VersionHistoryPanel.jsx';
import { SaveStatus } from '../../components/editor/SaveStatus.jsx';
import { LoadingScreen } from '../../components/common/LoadingScreen.jsx';
import { ThemeToggle } from '../../components/layout/ThemeToggle.jsx';
import { ROLE_LABELS } from '../../constants/roles.js';
import { canEdit } from '../../constants/roles.js';
import { cn } from '../../utils/cn.js';

export default function EditorPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);

  const {
    document,
    collaborators,
    typingUsers,
    saveStatus,
    loading,
    error,
    versions,
    isRemoteUpdate,
    updateContent,
    handleBlur,
    loadVersions,
    restoreVersion,
  } = useEditor(documentId);

  useEffect(() => {
    if (showHistory) loadVersions();
  }, [showHistory, loadVersions]);

  if (loading) return <LoadingScreen message="Opening document..." />;
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface">
        <p className="text-red-600">{error}</p>
        <Link to="/dashboard" className="text-brand-600 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const readOnly = !canEdit(document?.role);

  return (
    <div className="flex h-screen flex-col bg-surface">
      <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-surface-elevated px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-surface-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-[var(--text-primary)]">
              {document?.title}
            </h1>
            <div className="flex items-center gap-2">
              <SaveStatus status={saveStatus} />
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                  readOnly
                    ? 'bg-amber-500/10 text-amber-700'
                    : 'bg-emerald-500/10 text-emerald-700',
                )}
              >
                {readOnly ? (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" /> Viewer
                  </span>
                ) : (
                  ROLE_LABELS[document?.role] || 'Editor'
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              showHistory
                ? 'bg-brand-500/10 text-brand-700'
                : 'text-[var(--text-secondary)] hover:bg-surface-muted',
            )}
          >
            <History className="h-4 w-4" />
            History
          </button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          {readOnly && (
            <div className="mb-3 rounded-lg bg-amber-500/10 px-4 py-2 text-sm text-amber-800 dark:text-amber-300">
              You have view-only access. Editing is disabled.
            </div>
          )}
          <RichTextEditor
            content={document?.content}
            onChange={updateContent}
            onBlur={handleBlur}
            readOnly={readOnly}
            isRemoteUpdate={isRemoteUpdate}
          />
        </div>

        {showHistory ? (
          <VersionHistoryPanel
            versions={versions}
            role={document?.role}
            onRestore={async (id) => {
              await restoreVersion(id);
              setShowHistory(false);
            }}
            onClose={() => setShowHistory(false)}
          />
        ) : (
          <CollaboratorsPanel collaborators={collaborators} typingUsers={typingUsers} />
        )}
      </div>
    </div>
  );
}
