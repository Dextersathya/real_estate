import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

interface EmailVerificationPageProps {
  onNavigate: (path: string) => void;
}

export const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ onNavigate }) => {
  const { user, updateUserInState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(user?.emailVerified || false);

  const handleVerifyNow = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; user: any }>('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.user) {
        updateUserInState(res.user);
        setVerified(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl p-8 shadow-xl text-center space-y-6">
        
        <div className="w-14 h-14 bg-amber-100 text-[#0F172A] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Mail className="w-8 h-8 text-[#C5A059]" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-[#0F172A]">Verify Your Email</h1>

        {verified ? (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Email Address Verified Successfully</span>
            </div>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="w-full bg-[#0F172A] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#1E293B]"
            >
              Continue to Owner Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-slate-600">
            <p>
              We have dispatched a verification email to <strong>{user?.email || 'your registered email'}</strong>.
            </p>

            <button
              onClick={handleVerifyNow}
              disabled={loading}
              className="w-full py-3 bg-[#0F172A] text-white font-bold rounded-xl text-sm hover:bg-[#1E293B] border border-[#C5A059]/40"
            >
              {loading ? 'Verifying...' : 'Click Here to Verify Email (Instant)'}
            </button>

            <button
              onClick={() => onNavigate('/dashboard')}
              className="text-slate-500 hover:text-slate-800 text-xs font-medium block mx-auto pt-2"
            >
              Skip for now & Continue to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
