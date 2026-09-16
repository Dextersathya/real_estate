import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Globe, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import logoImage from '../assets/images/regenerated_image_1786429720735.png';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { sendRegistrationOtp } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'United States',
    acceptedTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Please provide a valid contact number.');
      return;
    }

    if (!formData.acceptedTerms) {
      setError('You must accept the terms of service to continue.');
      return;
    }

    setLoading(true);

    try {
      // Dispatch OTP to the applicant's email and phone
      const otpRes = await sendRegistrationOtp(formData.email, formData.phone);
      
      // Save pending registration payload to sessionStorage
      const pendingPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        otpPreview: otpRes.otpPreview || '123456',
      };
      sessionStorage.setItem('pending_registration_data', JSON.stringify(pendingPayload));

      // Navigate to OTP verification page
      onNavigate('/verify-otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to initiate account verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl p-8 sm:p-12 shadow-xl w-full space-y-6">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F172A] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-xs">
            <span>Step 1</span>
            <span className="text-slate-400 font-normal">/ 2</span>
          </span>
          <span className="text-xs font-semibold text-slate-500">Contact & Owner Profile</span>
        </div>

        <div className="text-center max-w-md mx-auto space-y-2">
          <img 
            src={logoImage} 
            alt="Lala NRI Realty Logo" 
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover mx-auto shadow-md border border-gold/40" 
          />
          <h1 className="text-2xl font-serif font-bold text-[#0F172A]">Create Owner Account</h1>
          <p className="text-slate-500 text-xs">
            Enter your details below. You will verify your contact information via OTP and set your password on the next step.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold max-w-lg mx-auto">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
          
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Rajesh Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="rajesh@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  required
                  placeholder="+1 408 555 0192"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Residence *</label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              >
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="Other">Other International</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-100/90 rounded-xl text-[11px] text-slate-600 flex items-center gap-2 border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
            <span>Account automatically designated as <strong>PROPERTY_OWNER</strong> with institutional-grade asset privacy.</span>
          </div>

          <label className="flex items-start gap-2 text-xs text-slate-600 font-medium cursor-pointer pt-1">
            <input
              type="checkbox"
              required
              checked={formData.acceptedTerms}
              onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
              className="mt-0.5 rounded border-slate-300 text-[#0F172A]"
            />
            <span>I agree to the Lala NRI Realty Terms of Service and Confidential Representation Agreement.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-sm transition shadow-md border border-[#C5A059]/40 flex items-center justify-center gap-2"
          >
            {loading ? 'Sending OTP Code...' : 'Continue to OTP Verification'}
            <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="font-bold text-[#0F172A] hover:underline"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
};
