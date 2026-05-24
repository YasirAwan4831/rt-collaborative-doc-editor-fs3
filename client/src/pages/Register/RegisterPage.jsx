import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout.jsx';
import { SSOButton } from '../../components/auth/SSOButton.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, error, clearError, isDevMode } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await register(email, password || 'dev123', displayName);
      navigate('/dashboard');
    } catch {
      /* handled in context */
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={isDevMode ? 'Dev mode — instant workspace access' : 'Start collaborating in seconds'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Alex Morgan"
          required
        />
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
          placeholder={isDevMode ? 'Optional in dev mode' : 'Min. 6 characters'}
          required={!isDevMode}
        />
        {error && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{error}</p>
        )}
        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-surface px-2 text-[var(--text-muted)]">or</span>
        </div>
      </div>

      <SSOButton provider="Google" icon={Chrome} onClick={loginWithGoogle} loading={loading} />

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
