import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { EditorToolbar } from './EditorToolbar.jsx';
import { canEdit } from '../../constants/roles.js';

export function RichTextEditor({
  content,
  onChange,
  onBlur,
  readOnly,
  isRemoteUpdate,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Start writing your document...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
    ],
    content: content || '<p></p>',
    editable: !readOnly,
    onUpdate: ({ editor: e }) => {
      if (!isRemoteUpdate?.current) {
        onChange?.(e.getHTML());
      }
    },
    onBlur: () => onBlur?.(),
  });

  useEffect(() => {
    if (!editor || !content) return;
    if (isRemoteUpdate?.current) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor, isRemoteUpdate]);

  useEffect(() => {
    if (editor) editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-white dark:bg-slate-900/50 shadow-soft">
      <EditorToolbar editor={editor} readOnly={readOnly} />
      <div className="editor-content flex-1 overflow-y-auto px-8 py-6">
        <EditorContent editor={editor} className="prose-editor min-h-[60vh] max-w-3xl mx-auto" />
      </div>
    </div>
  );
}

export function useEditorReadOnly(role) {
  return !canEdit(role);
}

export default RichTextEditor;
