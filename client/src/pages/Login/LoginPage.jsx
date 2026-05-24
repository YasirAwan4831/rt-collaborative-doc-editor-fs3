import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { SSOButton } from '../../components/auth/SSOButton.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, error, clearError, isDevMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await login(email, password || 'dev');
      navigate('/dashboard');
    } catch {
      /* error set in context */
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    clearError();
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={isDevMode ? 'Development mode — any email works' : 'Sign in to your workspace'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isDevMode ? 'Optional in dev mode' : '••••••••'}
          required={!isDevMode}
        />
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-[var(--text-muted)]">or continue with</span>
        </div>
      </div>

      <SSOButton provider="Google" icon={Chrome} onClick={handleGoogle} loading={loading} />

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
