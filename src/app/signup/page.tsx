"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendOtp, verifyOtp, registerWithOtp } from "@/actions/auth";

type Step = "details" | "otp" | "done";

const COUNTRIES = [
  "United States", "United Kingdom", "United Arab Emirates", "Canada",
  "Australia", "Singapore", "Germany", "Qatar", "Kuwait", "Bahrain",
  "Oman", "Saudi Arabia", "New Zealand", "Malaysia", "India", "Other",
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState({
    email: "", password: "", confirmPassword: "", name: "", phone: "", country: "",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!form.email) { setError("Email is required."); return; }
    setLoading(true); setError(null);
    const result = await sendOtp(form.email);
    setLoading(false);
    if (!result.success) { setError(result.message); return; }
    setOtpSent(true);
    setMessage(result.message);
    setStep("otp");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true); setError(null);
    const result = await registerWithOtp({
      email: form.email,
      password: form.password,
      name: form.name,
      phone: form.phone,
      country: form.country,
      otp,
    });
    setLoading(false);
    if (!result.success) { setError(result.error || "Registration failed."); return; }
    setStep("done");
    setTimeout(() => router.push("/login"), 2000);
  };

  if (step === "done") {
    return (
      <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Account Created!</h1>
          <p className="text-slate-400">Redirecting you to login...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-[#C5A059] font-bold text-2xl">Lala NRI Realty</Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Create Owner Account</h1>
          <p className="text-slate-400 text-sm">Register to submit and track your properties</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Full Name *</label>
                <input type="text" required placeholder="Your full name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 transition" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email Address *</label>
                <input type="email" required placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 transition" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Phone / WhatsApp</label>
                <input type="tel" placeholder="+1 555 000 0000" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 transition" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Country of Residence</label>
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]/50 transition">
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Password *</label>
                <input type="password" required placeholder="Min. 8 characters" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 transition" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Confirm Password *</label>
                <input type="password" required placeholder="Re-enter password" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 transition" />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>}
              <button onClick={handleSendOtp} disabled={loading}
                className="w-full bg-[#C5A059] text-[#0F172A] py-3 rounded-xl font-bold text-sm hover:bg-[#D4B06A] transition-all disabled:opacity-60">
                {loading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </div>
          )}

          {step === "otp" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div className="text-center">
                <p className="text-slate-300 text-sm">{message}</p>
                <p className="text-slate-500 text-xs mt-1">Check your inbox and spam folder.</p>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 text-center">6-Digit Verification Code</label>
                <input type="text" required maxLength={6} placeholder="000000" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-2xl text-white text-center tracking-widest font-mono focus:outline-none focus:border-[#C5A059]/50 transition" />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading || otp.length < 6}
                className="w-full bg-[#C5A059] text-[#0F172A] py-3 rounded-xl font-bold text-sm hover:bg-[#D4B06A] transition-all disabled:opacity-60">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
              <button type="button" onClick={() => { setStep("details"); setOtp(""); setError(null); }}
                className="w-full text-sm text-slate-400 hover:text-white transition-colors">
                ← Back to details
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-[#C5A059] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
