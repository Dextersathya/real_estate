import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Eye, BellRing, Smartphone, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export const PropertyJourneyAnimation: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      tag: '01. ASSET ONBOARDING',
      title: 'Your Property',
      subtitle: 'Your valued real estate asset in India, held securely and represented with utmost care.',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      detail: 'Complete legal onboarding, key custody verification, and digital inventory baseline.',
    },
    {
      id: 'step-2',
      tag: '02. BESPOKE GOVERNANCE',
      title: 'Professional Management',
      subtitle: 'Dedicated local management teams acting solely in your best interest.',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      detail: 'Tenant vetting, rent collection, tax payments, maintenance, and legal representation.',
    },
    {
      id: 'step-3',
      tag: '03. ONSITE VIGILANCE',
      title: 'Regular Monitoring',
      subtitle: 'Bi-monthly 45-point physical inspections with high-definition photography and video logs.',
      icon: Eye,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      detail: 'Water intrusion checks, electrical testing, pest inspection, and security audit.',
    },
    {
      id: 'step-4',
      tag: '04. TRANSPARENT VAULT',
      title: 'Clear Updates',
      subtitle: 'Instant digital reports, statement ledgers, and maintenance receipts delivered directly to your portal.',
      icon: BellRing,
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200',
      detail: 'NRE/NRO bank remittance confirmations and quarterly digital health cards.',
    },
    {
      id: 'step-5',
      tag: '05. TOTAL PEACE OF MIND',
      title: 'You Stay Informed',
      subtitle: 'Enjoy complete clarity and control from anywhere in the world.',
      icon: Smartphone,
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      detail: 'You stay informed. We handle the rest.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-20 bg-[#FAF9F6] border-y border-[#EADFC9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#C5A059] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
            THE LALA NRI CARE EXPERIENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F172A] leading-tight">
            The Property Journey
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Experience how we transform distance into seamless peace of mind through structured architectural governance.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="flex justify-between items-center relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#EADFC9] -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-[#C5A059] -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              const isPast = idx < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-[#0F172A] text-[#C5A059] ring-4 ring-[#C5A059]/30 scale-110 shadow-lg'
                      : isPast
                      ? 'bg-[#C5A059] text-white'
                      : 'bg-[#F3EFE6] text-slate-400 border border-[#EADFC9]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </button>
              );
            })}
          </div>

          {/* Step Labels */}
          <div className="hidden sm:grid grid-cols-5 gap-2 text-center mt-3 text-[11px] font-semibold text-slate-600">
            {steps.map((s, idx) => (
              <span
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer transition ${idx === activeStep ? 'text-[#0F172A] font-bold underline decoration-[#C5A059] underline-offset-4' : 'text-slate-400'}`}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>

        {/* Dynamic Display Stage */}
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[420px]">
          
          {/* Image Stage */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 rounded-2xl overflow-hidden shadow-md bg-slate-100 group">
            <AnimatePresence mode="wait">
              <motion.img
                key={steps[activeStep].image}
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
                {steps[activeStep].tag}
              </span>
              <p className="text-xs text-slate-200 mt-2 font-medium">
                {steps[activeStep].detail}
              </p>
            </div>
          </div>

          {/* Text & Action Stage */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[activeStep].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3EFE6] border border-[#EADFC9] rounded-full text-xs font-semibold text-[#0F172A]">
                  {React.createElement(steps[activeStep].icon, { className: "w-4 h-4 text-[#C5A059]" })}
                  <span>Step {activeStep + 1} of 5</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A]">
                  {steps[activeStep].title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {steps[activeStep].subtitle}
                </p>

                <div className="p-4 bg-[#F5F0EB]/80 rounded-xl border-l-4 border-[#C5A059] text-xs text-slate-700">
                  <strong className="block text-[#0F172A] font-semibold mb-0.5">Lala NRI Guarantee:</strong>
                  {activeStep === 4 ? (
                    <span className="text-[#0F172A] font-bold text-sm">You Stay Informed. We Handle the Rest.</span>
                  ) : (
                    <span>Real-time visibility with total operational autonomy. No stress, zero distance barriers.</span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#EADFC9]">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition flex items-center gap-1 text-xs font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <span className="text-xs font-medium text-slate-500">
                {activeStep + 1} / {steps.length}
              </span>

              <button
                onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                className="p-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition flex items-center gap-1 text-xs font-medium"
              >
                Next Step
                <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>
          </div>

        </div>

        {/* Conclusion Banner */}
        <div className="mt-12 text-center max-w-xl mx-auto p-4 bg-[#0F172A] text-[#F5F0EB] rounded-2xl shadow-lg border border-[#C5A059]/40">
          <p className="text-sm font-serif font-semibold tracking-wide">
            "You Stay Informed. We Handle the Rest."
          </p>
        </div>

      </div>
    </section>
  );
};
