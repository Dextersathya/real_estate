import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Phone, ArrowLeft, CheckCircle2, RotateCw, AlertCircle, Lock, Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';
import logoImage from '../assets/images/regenerated_image_1786429720735.png';

interface PendingRegistration {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  otpPreview?: string;
}

interface OtpVerificationPageProps {
  onNavigate: (path: string) => void;
  pendingData?: PendingRegistration | null;
}

export const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({ onNavigate, pendingData: initialPendingData }) => {
  const { validateOtpCode, verifyAndRegisterWithOtp, sendRegistrationOtp } = useAuth();

  // Retrieve pending registration data from props or sessionStorage
  const [pendingData, setPendingData] = useState<PendingRegistration | null>(() => {
    if (initialPendingData) return initialPendingData;
    try {
      const stored = sessionStorage.getItem('pending_registration_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Current Step inside this page: 'verify_otp' | 'set_password' | 'completed'
  const [step, setStep] = useState<'verify_otp' | 'set_password' | 'completed'>('verify_otp');

  // OTP inputs
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifiedOtpCode, setVerifiedOtpCode] = useState<string>('');

  // Password fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState<number>(30);

  // Focus first input on mount
  useEffect(() => {
    if (step === 'verify_otp' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    setError('');
    const cleanVal = value.replace(/\D/g, '');

    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 6).split('');
      const newOtp = [...otpValues];
      digits.forEach((d, idx) => {
        if (index + idx < 6) {
          newOtp[index + idx] = d;
        }
      });
      setOtpValues(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otpValues];
    newOtp[index] = cleanVal;
    setOtpValues(newOtp);

    // Auto-advance to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const digits = pasteData.split('');
    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((d, i) => {
      newOtp[i] = d;
    });
    setOtpValues(newOtp);
    const focusTarget = Math.min(digits.length, 5);
    inputRefs.current[focusTarget]?.focus();
  };

  const handleResendOtp = async () => {
    if (!pendingData?.email || countdown > 0) return;
    setResending(true);
    setError('');
    setSuccessMessage('');

    try {
      await sendRegistrationOtp(pendingData.email, pendingData.phone);
      setCountdown(30);
      setSuccessMessage('A fresh verification code has been dispatched to your email.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  // Step 1: Verify OTP Code
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    if (!pendingData) {
      setError('No registration session found. Please register again.');
      return;
    }

    setLoading(true);

    try {
      await validateOtpCode(pendingData.email, fullOtp);
      setVerifiedOtpCode(fullOtp);
      setSuccessMessage('');
      setStep('set_password');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set Password & Finalize Registration
  const handleSetPasswordAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!pendingData) {
      setError('No registration session found. Please register again.');
      return;
    }

    setLoading(true);

    try {
      await verifyAndRegisterWithOtp({
        fullName: pendingData.fullName,
        email: pendingData.email,
        phone: pendingData.phone,
        country: pendingData.country,
        password: password,
        otp: verifiedOtpCode || otpValues.join(''),
      });

      // Clear pending storage
      sessionStorage.removeItem('pending_registration_data');
      setStep('completed');

      setTimeout(() => {
        onNavigate('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  // Password requirements calculation
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  // If user reached this page without pending data
  if (!pendingData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6 w-full">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-[#0F172A]">
            <AlertCircle className="w-8 h-8 text-[#C5A059]" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#0F172A]">No Pending Registration</h2>
          <p className="text-xs text-slate-600">
            You do not have an active registration session in progress. Please start by entering your contact details.
          </p>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => onNavigate('/register')}
              className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-sm transition shadow-md border border-[#C5A059]/40"
            >
              Start Account Registration
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-xs border border-slate-300 transition"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl p-8 sm:p-10 shadow-xl w-full space-y-6">
        
        {/* Step Progression Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#EADFC9] pb-4">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'verify_otp' ? 'bg-[#0F172A] text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 'verify_otp' ? '2' : '✓'}
            </span>
            <span className={`text-xs font-semibold ${step === 'verify_otp' ? 'text-[#0F172A]' : 'text-emerald-700'}`}>
              Verify OTP
            </span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'set_password' ? 'bg-[#0F172A] text-white' : step === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {step === 'completed' ? '✓' : '3'}
            </span>
            <span className={`text-xs font-semibold ${step === 'set_password' || step === 'completed' ? 'text-[#0F172A]' : 'text-slate-400'}`}>
              Set Password
            </span>
          </div>
        </div>

        {/* Header with Logo */}
        <div className="text-center space-y-2">
          <img 
            src={logoImage} 
            alt="Lala NRI Realty Logo" 
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover mx-auto shadow-md border border-gold/40" 
          />
          <h1 className="text-2xl font-serif font-bold text-[#0F172A]">
            {step === 'verify_otp' && 'Verify Your Contact'}
            {step === 'set_password' && 'Create Your Password'}
            {step === 'completed' && 'Account Activated'}
          </h1>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            {step === 'verify_otp' && 'Enter the 6-digit security code sent to your email to verify your identity.'}
            {step === 'set_password' && 'Your contact details are verified. Create a secure password for your owner portal.'}
            {step === 'completed' && 'Your account has been created and verified successfully.'}
          </p>
        </div>

        {/* Verified User Summary Card */}
        <div className="bg-white border border-[#EADFC9] rounded-2xl p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <span>Owner Applicant</span>
              {step !== 'verify_otp' && (
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </span>
            {step === 'verify_otp' && (
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="text-xs font-semibold text-[#C5A059] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Edit Info
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="font-semibold text-slate-900 truncate" title={pendingData.email}>{pendingData.email}</span>
            </div>
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="font-semibold text-slate-900 truncate">{pendingData.phone}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STAGE 1: OTP VERIFICATION */}
        {step === 'verify_otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-center text-xs font-bold text-slate-700 mb-3 tracking-wide uppercase">
                Enter 6-Digit OTP Code
              </label>
              
              <div className="flex justify-center items-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono text-[#0F172A] bg-white border-2 border-[#EADFC9] rounded-xl focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/30 focus:outline-hidden transition shadow-inner"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || otpValues.join('').length !== 6}
                className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-md border border-[#C5A059]/40 flex items-center justify-center gap-2"
              >
                {loading ? 'Validating OTP...' : 'Verify OTP & Set Password'}
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
                <span>Didn't receive the code?</span>
                {countdown > 0 ? (
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    Resend in <span className="font-mono font-bold text-[#0F172A]">{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="font-bold text-[#0F172A] hover:text-[#C5A059] hover:underline flex items-center gap-1 transition"
                  >
                    <RotateCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? 'Sending...' : 'Resend Code'}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {/* STAGE 2: SET PASSWORD AFTER OTP VERIFICATION */}
        {step === 'set_password' && (
          <form onSubmit={handleSetPasswordAndRegister} className="space-y-5">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>OTP verified successfully! Now set a password to secure your owner profile.</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-type your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Checklist */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <div className="font-semibold text-slate-600 mb-1">Password Requirements:</div>
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                  <span>{hasMinLength ? '✓' : '•'}</span> At least 6 characters
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                  <span>{hasNumber ? '✓' : '•'}</span> Contains at least one number
                </div>
                <div className={`flex items-center gap-1.5 ${passwordsMatch ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                  <span>{passwordsMatch ? '✓' : '•'}</span> Passwords match
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !hasMinLength || !passwordsMatch}
              className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-md border border-[#C5A059]/40 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration & Sign In'}
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            </button>
          </form>
        )}

        {/* STAGE 3: COMPLETED SUCCESS SCREEN */}
        {step === 'completed' && (
          <div className="py-6 text-center space-y-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-serif font-bold text-emerald-900">Account Activated Successfully!</h3>
            <p className="text-xs text-emerald-700">
              Welcome to Lala NRI Realty, <strong>{pendingData.fullName}</strong>. You are now logged in. Redirecting to your dashboard...
            </p>
          </div>
        )}

        {/* Security Assurance Badge */}
        <div className="pt-2 border-t border-slate-200/80 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Fiduciary Security Standard for NRI Asset Portfolios</span>
          </div>
        </div>

      </div>
    </div>
  );
};
