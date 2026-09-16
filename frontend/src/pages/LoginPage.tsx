import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import logoImage from '../assets/images/regenerated_image_1786429720735.png';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const u = await login(email, password);
      if (u.role === 'ADMIN') {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 w-full">
        
        {/* Left Column: Photo & Brand */}
        <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-full bg-slate-900 flex flex-col justify-between p-8 sm:p-12 text-white">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
            alt="Luxury Home"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />

          <div className="relative z-10 flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="Lala NRI Realty Logo" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover shadow-md border border-gold/40" 
            />
            <span className="font-serif font-bold tracking-tight text-xl">LALA NRI REALTY</span>
          </div>

          <div className="relative z-10 space-y-3 my-auto pt-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Stay Connected to Your Property.
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-light">
              Secure digital access for Non-Resident Indians to monitor physical inspection reports, tenant remittances, and legal records.
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-700/60 pt-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>Fiduciary NRI Property Management Protocol</span>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 space-y-6 flex flex-col justify-center">
          
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Welcome Back</h2>
            <p className="text-slate-500 text-xs mt-1">Sign in to manage your real estate portfolio.</p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address or Admin ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="admin@lalanri.com or rajesh.sharma@nri.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F172A] focus:ring-[#C5A059]"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-xs text-[#0F172A] hover:text-[#C5A059] font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-sm transition shadow-md border border-[#C5A059]/40 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Login to Account'}
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="font-bold text-[#0F172A] hover:underline"
            >
              Create Account
            </button>
          </p>

        </div>

      </div>
    </div>
  );
};
