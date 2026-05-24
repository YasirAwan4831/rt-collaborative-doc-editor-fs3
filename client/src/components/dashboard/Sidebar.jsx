import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Clock, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { AppLogo } from '../layout/AppLogo.jsx';
import { Avatar } from '../common/Avatar.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'All Documents' },
    { to: '/dashboard?filter=recent', icon: Clock, label: 'Recent' },
  ];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--border)] bg-surface-elevated transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
          <AppLogo />
          <button onClick={onClose} className="rounded-lg p-1.5 lg:hidden hover:bg-surface-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                    : 'text-[var(--text-secondary)] hover:bg-surface-muted hover:text-[var(--text-primary)]',
                )
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-surface-muted p-3">
            <Avatar name={user?.displayName} src={user?.photoURL} online />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                {user?.displayName}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export function SidebarToggle({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-surface-muted lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}

export default Sidebar;
