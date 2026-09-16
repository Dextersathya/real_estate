"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/auth/client";
import { loginAction } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign in via Better Auth Client SDK (attaches session cookie directly in browser)
      const { data, error: authErr } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });

      if (authErr || !data) {
        setLoading(false);
        setError(authErr?.message || "Invalid email or password.");
        return;
      }

      // 2. Lookup role from backend
      const result = await loginAction(form.email, form.password);

      // 3. Redirect to destination or role default
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get("redirect");
      const targetUrl = redirectParam || (result.role === "admin" ? "/admin" : "/dashboard");

      window.location.href = targetUrl;
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-[#C5A059] font-bold text-2xl">Lala NRI Realty</Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to your owner or admin account</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs text-slate-400 mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs text-slate-400 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C5A059] text-[#0F172A] py-3 rounded-xl font-bold text-sm hover:bg-[#D4B06A] transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#C5A059] font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          <Link href="/" className="hover:text-slate-400 transition-colors">← Back to homepage</Link>
        </p>
      </div>
    </main>
  );
}
