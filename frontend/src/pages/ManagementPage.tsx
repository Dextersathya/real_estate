import React from 'react';
import { ShieldCheck, KeyRound, FileCheck, DollarSign, Wrench, BellRing, CheckCircle2, ArrowRight } from 'lucide-react';

interface ManagementPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (title?: string, type?: string) => void;
}

export const ManagementPage: React.FC<ManagementPageProps> = ({ onNavigate, onOpenEnquiry }) => {
  const services = [
    {
      title: 'Tenant Curation & Lease Governance',
      desc: 'Rigorous background verification of prospective corporate and expat tenants. Formal lease agreements executed with power of attorney backing.',
      icon: KeyRound,
    },
    {
      title: 'Rent Collection & Overseas Remittance',
      desc: 'Automated monthly rent collection deposited directly into your designated NRE/NRO accounts with digital tax deduction receipts.',
      icon: DollarSign,
    },
    {
      title: 'Regular Physical Site Audits',
      desc: 'Bi-monthly 45-point inspection visits checking electrical, plumbing, waterproofing, and structural health with high-resolution photo logs.',
      icon: FileCheck,
    },
    {
      title: 'Maintenance & Repairs Desk',
      desc: '24/7 emergency repair dispatch using vetted, licensed contractors. Transparent cost estimates uploaded to your owner vault before work begins.',
      icon: Wrench,
    },
    {
      title: 'Property Tax & Utility Management',
      desc: 'Timely filing of municipal property taxes, water dues, electricity bills, and society maintenance charges so no penalties accrue.',
      icon: ShieldCheck,
    },
    {
      title: 'Legal Representation & Boundary Safety',
      desc: 'Perimeter monitoring for land plots, legal boundary protection, encumbrance verification, and anti-encroachment vigilance.',
      icon: BellRing,
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-14 border border-[#C5A059]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block">
              NRI PROPERTY MANAGEMENT SERVICES
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Total Fiduciary Ownership of Your Real Estate Assets
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              Distance should never compromise property value. Lala NRI Realty manages your residential homes, commercial towers, farmland, and plots with complete accountability.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('/sell/submit')}
                className="bg-[#C5A059] hover:bg-[#b59048] text-[#0F172A] px-6 py-3 rounded-xl font-bold text-sm transition"
              >
                Onboard My Property
              </button>

              <button
                onClick={() => onOpenEnquiry(undefined, 'Management')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-xl font-semibold text-sm transition"
              >
                Request Management Tariff
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-700 p-6 rounded-2xl space-y-3">
            <h3 className="font-serif font-bold text-[#C5A059] text-base">Why Onboard?</h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> 100% Tax Compliant Remittances</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Anti-Encroachment Vigilance</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> Dedicated Property Relationship Manager</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#0F172A]">Comprehensive Management Pillars</h2>
          <p className="text-slate-600 text-sm mt-2">Designed specifically for non-resident property owners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 space-y-3 hover:border-[#C5A059] transition shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-[#0F172A] text-[#C5A059] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#0F172A]">{srv.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process Flow */}
      <section className="bg-[#F3EFE6] py-12 border-y border-[#EADFC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Simple Property Onboarding</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#EADFC9]">
              <span className="text-xs font-bold text-[#C5A059] uppercase block mb-1">Step 1</span>
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Digital Property Submission</h4>
              <p className="text-slate-600 text-xs mt-1">Submit basic location details and title document copies online.</p>
            </div>
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#EADFC9]">
              <span className="text-xs font-bold text-[#C5A059] uppercase block mb-1">Step 2</span>
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Physical Verification Audit</h4>
              <p className="text-slate-600 text-xs mt-1">Our field team visits the site, conducts baseline audits & checks boundaries.</p>
            </div>
            <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#EADFC9]">
              <span className="text-xs font-bold text-[#C5A059] uppercase block mb-1">Step 3</span>
              <h4 className="font-serif font-bold text-sm text-[#0F172A]">Active Dashboard Access</h4>
              <p className="text-slate-600 text-xs mt-1">Monitor real-time updates, tenant payments, and inspection reports 24/7.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
