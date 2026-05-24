import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, FileText } from 'lucide-react';
import { Sidebar, SidebarToggle } from '../../components/dashboard/Sidebar.jsx';
import { SearchBar } from '../../components/dashboard/SearchBar.jsx';
import { DocumentCard } from '../../components/dashboard/DocumentCard.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Input } from '../../components/common/Input.jsx';
import { ThemeToggle } from '../../components/layout/ThemeToggle.jsx';
import { LoadingScreen } from '../../components/common/LoadingScreen.jsx';
import { useDocuments } from '../../hooks/useDocuments.js';

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    documents,
    loading,
    error,
    search,
    setSearch,
    createDocument,
    renameDocument,
    deleteDocument,
  } = useDocuments();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [renameModal, setRenameModal] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const doc = await createDocument('Untitled Document');
      navigate(`/editor/${doc.id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRename = async () => {
    if (!renameModal || !newTitle.trim()) return;
    await renameDocument(renameModal.id, newTitle.trim());
    setRenameModal(null);
    setNewTitle('');
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) {
      await deleteDocument(doc.id);
    }
  };

  if (loading && documents.length === 0) {
    return <LoadingScreen message="Loading your workspace..." />;
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex flex-1 flex-col min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-surface-elevated px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Documents</h1>
              <p className="text-sm text-[var(--text-muted)]">
                {documents.length} document{documents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar value={search} onChange={setSearch} />
            <ThemeToggle />
            <Button onClick={handleCreate} loading={creating}>
              <FilePlus className="h-4 w-4" />
              New Document
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents yet"
              description="Create your first collaborative document and invite your team to edit in real time."
              action={
                <Button onClick={handleCreate} loading={creating}>
                  <FilePlus className="h-4 w-4" />
                  Create Document
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-fade-in">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onRename={(d) => {
                    setRenameModal(d);
                    setNewTitle(d.title);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Modal
        open={Boolean(renameModal)}
        onClose={() => setRenameModal(null)}
        title="Rename document"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRenameModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
