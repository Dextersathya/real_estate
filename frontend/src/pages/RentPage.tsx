import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { fetchProperties } from '../lib/api';
import { PropertyCard } from '../components/PropertyCard';
import { Building2, Search, Filter } from 'lucide-react';

interface RentPageProps {
  onViewProperty: (id: string) => void;
  onOpenEnquiry: (propertyTitle?: string, type?: string) => void;
}

export const RentPage: React.FC<RentPageProps> = ({ onViewProperty, onOpenEnquiry }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProperties({ category: 'Rent' })
      .then((data) => setProperties(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40">
        <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block mb-1">
          MANAGED RENTAL PORTFOLIO
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Find a Place That Fits.
        </h1>
        <p className="text-slate-300 text-sm font-light leading-relaxed mt-2 max-w-xl">
          Curated corporate residences, executive penthouses, and modern office spaces under Lala NRI Realty management.
        </p>
      </div>

      {/* Filter */}
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search location or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong className="text-[#0F172A]">{filtered.length}</strong> rental options (No prices exposed)
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-12 text-center space-y-3 max-w-md mx-auto">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-serif font-bold text-[#0F172A]">No Rentals Available</h3>
          <p className="text-slate-600 text-xs">Try adjusting your location search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onViewDetails={onViewProperty}
              onEnquire={(title) => onOpenEnquiry(title, 'Rent')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
