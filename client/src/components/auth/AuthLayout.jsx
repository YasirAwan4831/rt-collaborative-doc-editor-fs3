import { AppLogo } from '../layout/AppLogo.jsx';
import { ThemeToggle } from '../layout/ThemeToggle.jsx';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 p-12 text-white">
        <AppLogo to="/" />
        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Collaborate in real time, anywhere.
          </h1>
          <p className="text-brand-200 text-lg">
            A production-ready workspace for teams to create, edit, and sync documents
            with live presence, role-based access, and seamless cloud integration.
          </p>
          <div className="flex gap-3 pt-4">
            {['Live sync', 'Role-based access', 'Version history'].map((f) => (
              <span
                key={f}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-brand-300">© 2026 CollabSpace — Internship Project</p>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between p-6 lg:justify-end">
          <div className="lg:hidden">
            <AppLogo />
          </div>
          <ThemeToggle />
        </header>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
              {subtitle && (
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
