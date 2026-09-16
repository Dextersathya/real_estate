import React from 'react';
import { Property } from '../types';
import { MapPin, Maximize2, Bed, Bath, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (id: string) => void;
  onEnquire: (propertyTitle: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails, onEnquire }) => {
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Management':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Buy':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Rent':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  const mainImage = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="bg-white border border-[#E5E1DA] overflow-hidden shadow-xs hover:shadow-luxury hover:border-gold transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100 border-b border-[#E5E1DA]">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
          <span className={`text-[10px] font-bold px-2.5 py-1 uppercase tracking-widest border shadow-xs ${getCategoryBadgeClass(property.category)}`}>
            {property.category}
          </span>

          <span className="bg-navy/90 text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider backdrop-blur-xs flex items-center gap-1 border border-gold/40">
            <ShieldCheck className="w-3 h-3 gold-accent" />
            <span>Verified</span>
          </span>
        </div>

        {/* Bottom Property Type Pill */}
        <div className="absolute bottom-3 left-3 text-white text-xs font-bold uppercase tracking-wider bg-black/60 px-2.5 py-1 backdrop-blur-xs">
          {property.type}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-slate-500 text-xs mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 gold-accent mr-1 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(property.id)}
            className="text-lg serif-title font-bold text-navy hover:gold-accent transition cursor-pointer line-clamp-2 mb-2 leading-snug"
          >
            {property.title}
          </h3>

          {/* Features pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.features.slice(0, 3).map((feat, idx) => (
              <span key={idx} className="bg-[#F2F0EB] text-slate-700 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border border-[#E5E1DA] flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 gold-accent" />
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Specs & CTA */}
        <div>
          {/* Specs Row */}
          <div className="py-3 border-t border-[#E5E1DA] border-b mb-4 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.areaSqFt.toLocaleString()} sq.ft</span>
            </div>

            {property.bedrooms !== undefined && (
              <div className="flex items-center gap-1 font-medium">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}

            {property.bathrooms !== undefined && (
              <div className="flex items-center gap-1 font-medium">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}

            {/* Availability status badge */}
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              {property.status === 'Under Management' ? 'Managed' : 'Available'}
            </span>
          </div>

          {/* Action Buttons (NO PRICE) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(property.id)}
              className="w-full py-2.5 px-3 border border-navy text-navy hover:bg-navy hover:text-white font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1"
            >
              <span>View Property</span>
            </button>

            <button
              onClick={() => onEnquire(property.title)}
              className="w-full py-2.5 px-3 bg-navy hover:bg-[#1a2d47] text-white font-bold text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1 border border-gold/40"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-3 h-3 gold-accent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

