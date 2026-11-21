import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { Lock, Mail, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { resolveImageUrl } from '../../utils/mediaUrl';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [require2FA, setRequire2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, checkAuth } = useAuthStore();

  const cachedLogo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('portfolio_settings') || '{}')?.logoUrl || '';
    } catch {
      return '';
    }
  }, []);

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { 
        email, 
        password,
        ...(require2FA ? { totpCode: totpCode.trim() } : {})
      });

      if (response.data?.require2FA) {
        setRequire2FA(true);
        setLoading(false);
        return;
      }

      if (response.data?.token) {
        localStorage.setItem('admin_token', response.data.token);
      }
      if (response.data?.data) {
        setUser(response.data.data);
      }
      await checkAuth(); // Verify session against /auth/me
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-xl">
        <div className="mb-8 text-center flex flex-col items-center">
          <img
            src={resolveImageUrl(cachedLogo) || '/logo.webp'}
            alt="Logo"
            className="h-10 sm:h-12 w-auto mb-4 object-contain filter invert contrast-125 dark:filter-none select-none"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.onerror = null;
              el.src = '/logo.webp';
            }}
          />
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {require2FA ? 'Two-Factor Authentication' : 'Admin Login'}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {require2FA 
              ? 'Enter your 6-digit verification code' 
              : 'Enter your credentials to access the dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!require2FA ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-shadow"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 gap-2 text-xs font-medium">
                <ShieldCheck size={16} />
                <span>Two-Factor Authentication</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground text-center block">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full py-3 px-4 bg-input border border-border rounded-xl text-center font-mono tracking-[0.4em] text-xl font-bold focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="123456"
                  autoFocus
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setRequire2FA(false);
                  setTotpCode('');
                  setError('');
                }}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft size={13} /> Back to email &amp; password
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (require2FA && totpCode.length !== 6)}
            className="w-full py-2.5 px-4 bg-foreground text-background font-semibold rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : require2FA ? (
              'Verify & Sign In'
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
