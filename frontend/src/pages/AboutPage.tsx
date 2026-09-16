import React from 'react';
import { Building2, ShieldCheck, Award, Users, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenEnquiry }) => {
  return (
    <div className="space-y-16 py-12">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-14 border border-[#C5A059]/40 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block">
              CORPORATE OVERVIEW
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              India’s Premier Property Management Firm for Non-Resident Indians
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Lala NRI Realty was established to solve a critical challenge faced by overseas property owners: maintaining physical, legal, and financial governance of high-value Indian real estate without geographical stress.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#0F172A]">Our Core Pillars</h2>
          <p className="text-slate-600 text-sm mt-2">Built on fiduciary integrity, strict confidentiality, and complete single-point coordination.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Single Point of Contact</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Buyers, sellers, renters, and tenants do not communicate directly. All negotiations and inquiries are routed through Lala NRI Realty to safeguard your privacy.
            </p>
          </div>

          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Time-Zone Alignment</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Our NRI desk operates on flexible shifts catering to North America (PST/EST), Europe (GMT), Middle East (GST), and Australasia.
            </p>
          </div>

          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">45-Point Inspections</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Bi-monthly physical site audits ensure your property remains pristine, free from unauthorized occupation, and structurally sound.
            </p>
          </div>
        </div>
      </section>

      {/* Coverage Cities */}
      <section className="bg-[#F3EFE6] py-14 border-y border-[#EADFC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Metropolitan Coverage</h2>
            <p className="text-slate-600 text-xs mt-1">Dedicated field inspection teams active across tier-1 growth corridors.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {['Hyderabad', 'Bengaluru', 'Mumbai & NCR', 'Chennai', 'Goa', 'Pune'].map((city, idx) => (
              <div key={idx} className="bg-[#FDFBF7] border border-[#EADFC9] rounded-xl p-4 font-serif font-bold text-sm text-[#0F172A] shadow-2xs">
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-3xl font-serif font-bold text-[#0F172A]">Ready to Secure Your Property?</h2>
        <button
          onClick={onOpenEnquiry}
          className="bg-[#0F172A] text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#1E293B] transition border border-[#C5A059]/40 inline-flex items-center gap-2"
        >
          <span>Schedule an Initial Consultation</span>
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
        </button>
      </section>
    </div>
  );
};
