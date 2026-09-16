"use client";

import { useState } from "react";
import { submitEnquiry } from "@/actions/enquiries";

type Props = {
  propertyId?: string;
  propertyTitle?: string;
  defaultType?: "buy" | "rent" | "sell" | "manage" | "general";
};

const COUNTRIES = [
  "United States", "United Kingdom", "United Arab Emirates", "Canada",
  "Australia", "Singapore", "Germany", "Qatar", "Kuwait", "Bahrain",
  "Oman", "Saudi Arabia", "New Zealand", "Malaysia", "India", "Other",
];

export function EnquiryForm({ propertyId, propertyTitle, defaultType = "general" }: Props) {
  const [state, setState] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    message: propertyTitle ? `I am interested in "${propertyTitle}". Please share more details.` : "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await submitEnquiry({
      propertyId,
      type: defaultType,
      ...state,
    });

    setResult(res);
    setLoading(false);

    if (res.success) {
      setState({ name: "", email: "", phone: "", country: "", message: "" });
    }
  };

  if (result?.success) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="font-semibold text-white text-lg mb-2">Enquiry Received</h3>
        <p className="text-slate-400 text-sm">{result.message}</p>
        <button
          onClick={() => setResult(null)}
          className="mt-4 text-[#C5A059] text-sm underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-slate-400 mb-1" htmlFor="enq-name">Full Name *</label>
        <input
          id="enq-name"
          type="text"
          required
          placeholder="Your full name"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1" htmlFor="enq-email">Email Address *</label>
        <input
          id="enq-email"
          type="email"
          required
          placeholder="your@email.com"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1" htmlFor="enq-phone">Phone / WhatsApp *</label>
        <input
          id="enq-phone"
          type="tel"
          required
          placeholder="+1 555 000 0000"
          value={state.phone}
          onChange={(e) => setState({ ...state, phone: e.target.value })}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1" htmlFor="enq-country">Country of Residence</label>
        <select
          id="enq-country"
          value={state.country}
          onChange={(e) => setState({ ...state, country: e.target.value })}
          className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]/50 transition"
        >
          <option value="">Select country...</option>
          {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1" htmlFor="enq-message">Message *</label>
        <textarea
          id="enq-message"
          required
          rows={4}
          value={state.message}
          onChange={(e) => setState({ ...state, message: e.target.value })}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition resize-none"
          placeholder="Tell us more about your requirement..."
        />
      </div>

      {result?.error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {result.error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#C5A059] text-[#0F172A] py-3 rounded-xl font-bold text-sm hover:bg-[#D4B06A] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Submit Enquiry"}
      </button>
      <p className="text-xs text-slate-600 text-center">
        Your details are kept strictly confidential and shared only with our team.
      </p>
    </form>
  );
}
