import React, { useState } from 'react';
import { submitEnquiry } from '../lib/api';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Building2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    reason: 'General Enquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        enquiryType: 'General',
        message: `[Reason: ${formData.reason}] ${formData.message}`,
        preferredContact: 'WhatsApp',
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40">
        <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block mb-1">
          GLOBAL CONCIERGE DESK
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Contact Lala NRI Realty
        </h1>
        <p className="text-slate-300 text-sm font-light mt-2 max-w-xl">
          Dedicated property managers available across international time zones for Non-Resident Indians.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info cards */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-xl font-serif font-bold text-[#0F172A]">Corporate Desk</h3>
            
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#0F172A]">Headquarters</strong>
                  <span>Lala NRI Realty Towers, Suite 802, Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033</span>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <strong className="block text-[#0F172A]">Phone Desk</strong>
                  <a href="tel:+919962525935" className="hover:underline">+91 99625 25935</a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <strong className="block text-[#0F172A]">WhatsApp Desk</strong>
                  <a href="https://wa.me/919962525935" target="_blank" rel="noreferrer" className="hover:underline">+91 99625 25935</a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <strong className="block text-[#0F172A]">Email Support</strong>
                  <a href="mailto:contact@lalanri.com" className="hover:underline">contact@lalanri.com</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Map Visual Card */}
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-[#C5A059]/40 space-y-3">
            <h4 className="font-serif font-bold text-[#C5A059] text-sm">Headquarters Map & Direction</h4>
            <div className="h-40 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative flex items-center justify-center p-4 text-center">
              <div className="space-y-1">
                <MapPin className="w-8 h-8 text-[#C5A059] mx-auto animate-bounce" />
                <p className="text-xs font-bold">Jubilee Hills Landmark</p>
                <p className="text-[10px] text-slate-400">Road No. 36 Metro Station Corridor</p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 sm:p-8 shadow-2xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-serif font-bold text-[#0F172A]">Message Sent Successfully</h3>
              <p className="text-slate-600 text-xs max-w-md mx-auto">
                Thank you for contacting Lala NRI Realty. Our NRI Property Officer will review your enquiry and respond shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-serif font-bold text-[#0F172A]">Send Us a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 408 555 0192"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Contact</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                >
                  <option value="General Enquiry">General Property Management Enquiry</option>
                  <option value="Property Onboarding">Onboarding a New Property</option>
                  <option value="Buy Inquiry">Buying Real Estate</option>
                  <option value="Sell Inquiry">Selling Property</option>
                  <option value="Tenant Management">Tenant & Rent Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can Lala NRI Realty assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold rounded-xl text-sm transition shadow-md border border-[#C5A059]/40 flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4 text-[#C5A059]" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
