import React from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, FileUp, SearchCheck, Globe2, Building2 } from 'lucide-react';

interface SellPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (title?: string, type?: string) => void;
}

export const SellPage: React.FC<SellPageProps> = ({ onNavigate, onOpenEnquiry }) => {
  const sellSteps = [
    { num: '01', title: 'Submit Property', desc: 'Login and fill out our multi-step property submission form with location and asset details.' },
    { num: '02', title: 'Verification', desc: 'Our legal team verifies title document copies and conducts duplicate property checks.' },
    { num: '03', title: 'Admin Review', desc: 'All submissions are placed in Pending Admin Review status prior to publication.' },
    { num: '04', title: 'Property Published', desc: 'Your asset is listed across our global NRI investor channel.' },
    { num: '05', title: 'Enquiries Managed', desc: 'Lala NRI Realty handles all buyer screening and negotiations while you stay informed.' },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-14 border border-[#C5A059]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block">
              NRI PROPERTY REPRESENTATION & SALE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Your Property. Our Reach.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Let Lala NRI Realty handle enquiries, buyer screening, and legal coordination while you stay fully informed from overseas.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('/sell/submit')}
                className="bg-[#C5A059] hover:bg-[#b59048] text-[#0F172A] px-7 py-3.5 rounded-xl font-bold text-sm transition shadow-lg inline-flex items-center gap-2"
              >
                <span>Submit Your Property</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenEnquiry(undefined, 'Sell')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-xl font-semibold text-sm transition"
              >
                Talk to Sales Desk
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-[#C5A059] text-base">Key Benefits</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> No Unsolicited Calls</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Duplicate Property Safeguards</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Verified High-Net-Worth Buyers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Visual Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block mb-2">
            TRANSPARENT PROCESS
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F172A]">
            Property Sale Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sellSteps.map((s, idx) => (
            <div key={idx} className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2 relative">
              <span className="text-2xl font-serif font-bold text-[#C5A059]">{s.num}</span>
              <h3 className="font-serif font-bold text-sm text-[#0F172A]">{s.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#F3EFE6] p-10 rounded-3xl border border-[#EADFC9] space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Ready to List Your Property?</h2>
        <p className="text-slate-600 text-xs max-w-lg mx-auto">
          Login to your Lala NRI Property Owner account and complete our 8-step authenticated submission form.
        </p>
        <button
          onClick={() => onNavigate('/sell/submit')}
          className="bg-[#0F172A] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#1E293B] transition border border-[#C5A059]/40"
        >
          Begin Property Submission
        </button>
      </section>
    </div>
  );
};
