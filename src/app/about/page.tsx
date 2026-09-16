import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Lala NRI Realty",
  description: "Learn about Lala NRI Realty's mission to provide transparent, trusted, full-stack property management for NRIs.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl tracking-tight">
            Lala NRI Realty
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/buy" className="hover:text-white transition-colors">Buy</Link>
            <Link href="/rent" className="hover:text-white transition-colors">Rent</Link>
            <Link href="/manage" className="hover:text-white transition-colors">NRI Services</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/login" className="bg-[#C5A059] text-[#0F172A] font-semibold px-4 py-2 rounded-xl">Login</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <span className="text-xs bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full font-semibold">
            About Lala NRI Realty
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-3 mb-4">
            Protecting & Maximizing NRI Property Wealth
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We bridge the geographical gap for absentee landowners, providing end-to-end management, clear legal title assurance, and high-yield tenant stewardship across India.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-bold text-lg mb-2">Zero Encroachments</h3>
            <p className="text-slate-400 text-sm">Regular physical inspections with photo/video evidence to prevent unauthorized land access.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl">
            <div className="text-2xl mb-2">📑</div>
            <h3 className="font-bold text-lg mb-2">Tax & Legal Desk</h3>
            <p className="text-slate-400 text-sm">Timely municipal tax filings, utility bill clearings, and tenant lease agreements handled seamlessly.</p>
          </div>
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-2xl">
            <div className="text-2xl mb-2">🤝</div>
            <h3 className="font-bold text-lg mb-2">Single Point Contact</h3>
            <p className="text-slate-400 text-sm">No random broker calls. A dedicated admin desk coordinates all deals and enquiries with complete privacy.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
