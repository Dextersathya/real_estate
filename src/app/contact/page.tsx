import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Lala NRI Realty",
  description: "Get in touch with Lala NRI Realty for property management, buying, selling, or leasing services in India.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl tracking-tight">
            Lala NRI Realty
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/buy" className="hover:text-white transition-colors">Buy</Link>
            <Link href="/rent" className="hover:text-white transition-colors">Rent</Link>
            <Link href="/manage" className="hover:text-white transition-colors">NRI Services</Link>
            <Link href="/sell" className="hover:text-white transition-colors">Sell</Link>
            <Link href="/login" className="bg-[#C5A059] text-[#0F172A] font-semibold px-4 py-2 rounded-xl">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs bg-[#C5A059]/20 text-[#C5A059] px-3 py-1 rounded-full font-semibold">
            24/7 NRI Support Desk
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-3 mb-4">
            We are here to assist your property needs
          </h1>
          <p className="text-slate-400">
            Have a question about managing, buying, or selling property in India? Submit your enquiry below and an NRI Client Relations Lead will connect with you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white">Headquarters & Desk</h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                  📍
                </div>
                <div>
                  <h3 className="font-semibold text-sm">India Office</h3>
                  <p className="text-slate-400 text-sm mt-0.5">
                    Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Direct Phone & WhatsApp</h3>
                  <p className="text-slate-400 text-sm mt-0.5">+91 98765 00000 / +1 408 555 0192</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                  ✉️
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Official Email</h3>
                  <p className="text-slate-400 text-sm mt-0.5">desk@lalanri.com / admin@lalanri.com</p>
                </div>
              </div>
            </div>

            <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-2xl p-6">
              <h3 className="text-[#C5A059] font-semibold mb-2">🔒 Complete Confidentiality</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Your personal details, contact numbers, and property records are kept strictly confidential and visible only to platform directors.
              </p>
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Send us a Message</h2>
            <p className="text-slate-400 text-xs mb-6">
              Fill out the details below and our concierge desk will reach out via your preferred contact mode.
            </p>
            <EnquiryForm defaultType="general" />
          </div>
        </div>
      </div>
    </main>
  );
}
