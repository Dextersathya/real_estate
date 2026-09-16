import React, { useState } from 'react';
import { submitEnquiry } from '../lib/api';
import { X, CheckCircle2, Send, Phone, Mail, MessageSquare, ShieldAlert } from 'lucide-react';
import logoImage from '../assets/images/regenerated_image_1786429720735.png';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledPropertyTitle?: string;
  defaultEnquiryType?: 'Management' | 'Buy' | 'Sell' | 'Rent' | 'General';
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  prefilledPropertyTitle,
  defaultEnquiryType = 'General',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'United States',
    enquiryType: defaultEnquiryType,
    propertyTitle: prefilledPropertyTitle || '',
    message: '',
    preferredContact: 'WhatsApp' as 'Phone' | 'Email' | 'WhatsApp',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        enquiryType: formData.enquiryType,
        propertyTitle: formData.propertyTitle || undefined,
        message: formData.message,
        preferredContact: formData.preferredContact,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 px-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#0F172A]">
              Thank You. Our team will contact you shortly.
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
              Your enquiry has been logged with Lala NRI Realty Desk. A dedicated Property Officer will reach out via <strong className="text-[#0F172A]">{formData.preferredContact}</strong> within 12 business hours.
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left">
              <p className="font-semibold mb-0.5">Direct Service Policy</p>
              Remember: Lala NRI Realty manages all communications directly. No individual seller/buyer details are exposed.
            </div>

            <button
              onClick={resetAndClose}
              className="mt-4 bg-[#0F172A] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1E293B] transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#EADFC9] pb-4 mb-5">
              <img 
                src={logoImage} 
                alt="Lala NRI Realty Logo" 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover shadow-sm border border-gold/40 shrink-0" 
              />
              <div>
                <h3 className="text-xl font-serif font-bold text-[#0F172A]">Enquire Now</h3>
                <p className="text-xs text-slate-500">Lala NRI Realty Confidential Concierge Service</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {prefilledPropertyTitle && (
                <div className="p-3 bg-[#F3EFE6] rounded-xl border border-[#EADFC9] text-xs text-[#0F172A]">
                  <span className="font-semibold text-slate-500 block text-[10px] uppercase">Property Selected:</span>
                  <strong className="text-sm font-serif">{prefilledPropertyTitle}</strong>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] bg-white"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] bg-white"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Residence *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] bg-white"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="India">India</option>
                    <option value="Other">Other International</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enquiry Type</label>
                  <select
                    value={formData.enquiryType}
                    onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] bg-white"
                  >
                    <option value="Management">Property Management</option>
                    <option value="Buy">Buying Property</option>
                    <option value="Sell">Selling Property</option>
                    <option value="Rent">Renting Property</option>
                    <option value="General">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Contact Method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContact: 'WhatsApp' })}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition ${
                        formData.preferredContact === 'WhatsApp'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContact: 'Phone' })}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition ${
                        formData.preferredContact === 'Phone'
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Phone
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredContact: 'Email' })}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1 transition ${
                        formData.preferredContact === 'Email'
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message or Requirements *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your property requirements, timelines, or management expectations..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-[#F5F0EB] font-semibold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 border border-[#C5A059]/40 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Enquiry to Lala NRI Desk</span>
                      <Send className="w-4 h-4 text-[#C5A059]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
