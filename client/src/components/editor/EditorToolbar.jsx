import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '../../utils/cn.js';

function ToolButton({ onClick, active, disabled, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-md p-2 transition-colors',
        active
          ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
          : 'text-[var(--text-secondary)] hover:bg-surface-muted hover:text-[var(--text-primary)]',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, readOnly }) {
  if (!editor) return null;

  const btn = (action, opts = {}) => (
    <ToolButton
      onClick={() => action()}
      active={opts.active?.()}
      disabled={readOnly}
      title={opts.title}
    >
      {opts.icon}
    </ToolButton>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--border)] bg-surface-elevated px-2 py-1.5">
      {btn(() => editor.chain().focus().undo().run(), { icon: <Undo className="h-4 w-4" />, title: 'Undo' })}
      {btn(() => editor.chain().focus().redo().run(), { icon: <Redo className="h-4 w-4" />, title: 'Redo' })}
      <div className="mx-1 h-6 w-px bg-[var(--border)]" />
      {btn(() => editor.chain().focus().toggleBold().run(), {
        icon: <Bold className="h-4 w-4" />,
        active: () => editor.isActive('bold'),
        title: 'Bold',
      })}
      {btn(() => editor.chain().focus().toggleItalic().run(), {
        icon: <Italic className="h-4 w-4" />,
        active: () => editor.isActive('italic'),
        title: 'Italic',
      })}
      {btn(() => editor.chain().focus().toggleUnderline().run(), {
        icon: <Underline className="h-4 w-4" />,
        active: () => editor.isActive('underline'),
        title: 'Underline',
      })}
      {btn(() => editor.chain().focus().toggleStrike().run(), {
        icon: <Strikethrough className="h-4 w-4" />,
        active: () => editor.isActive('strike'),
        title: 'Strikethrough',
      })}
      <div className="mx-1 h-6 w-px bg-[var(--border)]" />
      {btn(() => editor.chain().focus().toggleHeading({ level: 1 }).run(), {
        icon: <Heading1 className="h-4 w-4" />,
        active: () => editor.isActive('heading', { level: 1 }),
        title: 'Heading 1',
      })}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), {
        icon: <Heading2 className="h-4 w-4" />,
        active: () => editor.isActive('heading', { level: 2 }),
        title: 'Heading 2',
      })}
      {btn(() => editor.chain().focus().toggleBulletList().run(), {
        icon: <List className="h-4 w-4" />,
        active: () => editor.isActive('bulletList'),
        title: 'Bullet list',
      })}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), {
        icon: <ListOrdered className="h-4 w-4" />,
        active: () => editor.isActive('orderedList'),
        title: 'Numbered list',
      })}
      <div className="mx-1 h-6 w-px bg-[var(--border)]" />
      {btn(() => editor.chain().focus().setTextAlign('left').run(), {
        icon: <AlignLeft className="h-4 w-4" />,
        active: () => editor.isActive({ textAlign: 'left' }),
        title: 'Align left',
      })}
      {btn(() => editor.chain().focus().setTextAlign('center').run(), {
        icon: <AlignCenter className="h-4 w-4" />,
        active: () => editor.isActive({ textAlign: 'center' }),
        title: 'Align center',
      })}
      {btn(() => editor.chain().focus().setTextAlign('right').run(), {
        icon: <AlignRight className="h-4 w-4" />,
        active: () => editor.isActive({ textAlign: 'right' }),
        title: 'Align right',
      })}
    </div>
  );
}

export default EditorToolbar;
