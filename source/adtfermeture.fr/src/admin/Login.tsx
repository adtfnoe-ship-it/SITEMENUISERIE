import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { usePhoto } from '../lib/photos';

export default function Login() {
  const logo = usePhoto('logo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-brand-blue-dark px-8 py-8 flex flex-col items-center gap-3">
            <img src={logo.src} alt={logo.alt} className="h-16 w-auto object-contain" />
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest">
              Espace administration
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h1 className="text-2xl font-bold text-brand-blue-dark mb-1">
              Connexion
            </h1>
            <p className="text-slate-500 text-sm mb-7">
              Accédez à la gestion du site.
            </p>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm text-red-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Adresse e-mail</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input pl-11"
                    placeholder="admin@exemple.fr"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Mot de passe</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-11 pr-11"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 rounded-xl text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Chargement…' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
