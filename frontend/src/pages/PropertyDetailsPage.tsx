import React, { useState, useEffect } from 'react';
import { Property, PropertyTimeline } from '../types';
import { fetchPropertyById, fetchPropertyTimeline } from '../lib/api';
import { MapPin, Maximize2, Bed, Bath, ShieldCheck, Phone, MessageSquare, ArrowLeft, CheckCircle2, FileText, ChevronRight } from 'lucide-react';

interface PropertyDetailsPageProps {
  propertyId: string;
  onBack: () => void;
  onOpenEnquiry: (propertyTitle?: string, type?: string) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ propertyId, onBack, onOpenEnquiry }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [timeline, setTimeline] = useState<PropertyTimeline[]>([]);
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchPropertyById(propertyId),
      fetchPropertyTimeline(propertyId).catch(() => []),
    ]).then(([propData, timeData]) => {
      setProperty(propData);
      setTimeline(timeData);
      if (propData.images && propData.images.length > 0) {
        setSelectedImg(propData.images[0]);
      }
    }).catch((err) => console.error(err))
    .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 text-sm font-medium">Loading property dossier...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Property Not Found</h2>
        <p className="text-slate-600 text-sm">The property listing you requested is currently unavailable or archived.</p>
        <button onClick={onBack} className="bg-[#0F172A] text-white px-6 py-2 rounded-lg text-sm">
          Return to Property Search
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0F172A] transition bg-[#F3EFE6] px-3.5 py-2 rounded-lg border border-[#EADFC9]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Image Stage */}
          <div className="space-y-3">
            <div className="relative h-80 sm:h-[450px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-[#EADFC9] shadow-md">
              <img
                src={selectedImg || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#0F172A]/90 text-white text-xs px-3 py-1 rounded-md border border-amber-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                Lala NRI Confidential Representation
              </div>
            </div>

            {/* Thumbnail Strip */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`h-20 w-28 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImg === img ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Overview */}
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-[#F3EFE6] text-[#0F172A] text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-[#EADFC9]">
                  {property.type}
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {property.category}
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {property.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F172A] leading-tight">
                {property.title}
              </h1>

              <div className="flex items-center text-slate-500 text-sm font-medium mt-1.5">
                <MapPin className="w-4 h-4 text-[#C5A059] mr-1" />
                <span>{property.location}, {property.city}, {property.state}</span>
              </div>
            </div>

            {/* Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F3EFE6] rounded-xl border border-[#EADFC9] text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Built-Up Area</span>
                <strong className="text-sm font-serif font-bold text-[#0F172A]">{property.areaSqFt.toLocaleString()} sq.ft</strong>
              </div>

              {property.bedrooms !== undefined && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Bedrooms</span>
                  <strong className="text-sm font-serif font-bold text-[#0F172A]">{property.bedrooms} BHK</strong>
                </div>
              )}

              {property.bathrooms !== undefined && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-medium">Bathrooms</span>
                  <strong className="text-sm font-serif font-bold text-[#0F172A]">{property.bathrooms} Baths</strong>
                </div>
              )}

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-medium">Occupancy</span>
                <strong className="text-sm font-serif font-bold text-emerald-800">{property.occupancyStatus || 'Vacant'}</strong>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#0F172A]">Property Dossier</h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#EADFC9]">
                <h3 className="text-lg font-serif font-bold text-[#0F172A]">Features & Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-[#F5F0EB]/60 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Management History / Timeline if available */}
            {timeline.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#EADFC9]">
                <h3 className="text-lg font-serif font-bold text-[#0F172A]">Inspection & Management Logs</h3>
                <div className="space-y-3">
                  {timeline.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#0F172A]">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Contact & Confidentiality Card */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 border border-[#C5A059]/40 shadow-xl space-y-5 sticky top-24">
            
            <div>
              <span className="text-[#C5A059] text-[10px] uppercase tracking-widest font-bold block mb-1">
                CENTRAL POINT OF CONTACT
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Contact Lala NRI Realty
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                All enquiries are managed exclusively by our senior property desk. We do not expose owner private contact information.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => onOpenEnquiry(property.title, property.category)}
                className="w-full bg-[#C5A059] hover:bg-[#b59048] text-[#0F172A] font-bold py-3 px-4 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Enquire Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+919962525935"
                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>Call Lala NRI Realty (+91 99625 25935)</span>
              </a>

              <a
                href={`https://wa.me/919962525935?text=Hi%20Lala%20NRI%20Realty,%20I%20am%20enquiring%20about%20${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk (+91 99625 25935)</span>
              </a>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <strong className="block text-white">Privacy Guarantee</strong>
              <span>Direct owner-buyer contacts are prohibited. Lala NRI Realty validates all inquiries to protect your investment.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
