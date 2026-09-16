import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Your Property in India",
  description: "List your Indian property for sale through Lala NRI Realty — discreet, managed, confidential.",
};

export default function SellPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl">Lala NRI Realty</Link>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/buy" className="hover:text-[#C5A059]">Buy</Link>
            <Link href="/rent" className="hover:text-[#C5A059]">Rent</Link>
            <Link href="/sell" className="text-[#C5A059] font-semibold">Sell</Link>
            <Link href="/manage" className="hover:text-[#C5A059]">Manage</Link>
          </div>
          <Link href="/login" className="text-sm bg-[#C5A059] text-[#0F172A] px-4 py-2 rounded-lg font-semibold">Login</Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[#C5A059] text-sm font-semibold uppercase tracking-widest mb-3">Sell with Confidence</p>
            <h1 className="text-4xl font-bold mb-6 leading-tight">Sell Your Indian Property — Discreetly & Professionally</h1>
            <p className="text-slate-400 leading-relaxed mb-8">
              Whether you're an NRI looking to exit an investment or relocating permanently, Lala NRI Realty manages the entire sale process on your behalf — from valuation to paperwork — while keeping your identity and property details completely confidential.
            </p>

            <div className="space-y-5">
              {[
                { icon: "🔒", title: "Complete Confidentiality", desc: "Your name and contact details are never disclosed to buyers. All negotiations happen through us." },
                { icon: "📋", title: "Legal & Documentation Support", desc: "We coordinate title verification, encumbrance certificates, and buyer due diligence." },
                { icon: "💼", title: "NRI-Specific Compliance", desc: "Full guidance on FEMA regulations, TDS requirements, and NRE/NRO repatriation." },
                { icon: "🤝", title: "Qualified Buyer Network", desc: "Access to our curated network of serious buyers — no time-wasters." },
              ].map((f) => (
                <div key={f.title} className="flex gap-4">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="font-semibold mb-1">{f.title}</p>
                    <p className="text-sm text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-2xl p-5">
              <p className="text-sm text-slate-400">
                Already registered? <Link href="/login" className="text-[#C5A059] font-semibold underline">Log in</Link> to submit your property directly from your owner dashboard.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Submit a Sell Enquiry</h2>
            <p className="text-sm text-slate-500 mb-6">Our team will reach out within 24 hours to discuss your property and next steps.</p>
            <EnquiryForm defaultType="sell" />
          </div>
        </div>
      </div>
    </main>
  );
}
