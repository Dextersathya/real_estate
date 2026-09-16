import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Management for NRIs",
  description: "Full-service property management for Non-Resident Indians — inspections, tenants, rent collection, legal compliance.",
};

export default function ManagePage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl">Lala NRI Realty</Link>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/buy" className="hover:text-[#C5A059]">Buy</Link>
            <Link href="/rent" className="hover:text-[#C5A059]">Rent</Link>
            <Link href="/sell" className="hover:text-[#C5A059]">Sell</Link>
            <Link href="/manage" className="text-[#C5A059] font-semibold">Manage</Link>
          </div>
          <Link href="/login" className="text-sm bg-[#C5A059] text-[#0F172A] px-4 py-2 rounded-lg font-semibold">Login</Link>
        </div>
      </nav>

      <section className="pt-28 pb-16 px-6 max-w-5xl mx-auto text-center">
        <p className="text-[#C5A059] text-sm font-semibold uppercase tracking-widest mb-3">Property Management</p>
        <h1 className="text-5xl font-bold mb-6 leading-tight">Your Property — Perfectly Maintained from 10,000 Miles Away</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Our field managers conduct physical inspections, handle tenants, collect rents, pay bills, and report everything to you — no matter where in the world you are.
        </p>
        <Link href="#enquire" className="bg-[#C5A059] text-[#0F172A] px-8 py-4 rounded-xl font-bold inline-block hover:bg-[#D4B06A] transition-all">
          Start Managing My Property
        </Link>
      </section>

      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">What We Handle</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🔍", title: "Bi-Monthly Inspections", desc: "45-point physical inspection reports delivered to your inbox with photos." },
              { icon: "👥", title: "Tenant Management", desc: "Background verification, lease drafting, deposit handling, and dispute resolution." },
              { icon: "💰", title: "Rent Collection & Remittance", desc: "Monthly rent collection and direct remittance to your NRE/NRO account." },
              { icon: "🔧", title: "Maintenance & Repairs", desc: "On-call vendor network for plumbing, electrical, civil, and appliance work." },
              { icon: "📄", title: "Legal & Tax Compliance", desc: "Property tax, utility bills, municipal dues, and FEMA compliance handled." },
              { icon: "📊", title: "Monthly Reports", desc: "Detailed financial and maintenance reports with photo documentation." },
            ].map((s) => (
              <div key={s.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="enquire" className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Get a Management Quote</h2>
            <p className="text-sm text-slate-500 mb-6">Tell us about your property and we'll reach out within 24 hours.</p>
            <EnquiryForm defaultType="manage" />
          </div>
        </div>
      </section>
    </main>
  );
}
