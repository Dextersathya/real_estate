import React, { useState, useEffect } from 'react';
import { Property, PropertyType } from '../types';
import { fetchProperties } from '../lib/api';
import { PropertyCard } from '../components/PropertyCard';
import { Search, Filter, RefreshCw, Building2 } from 'lucide-react';

interface BuyPageProps {
  initialTypeFilter?: string;
  onViewProperty: (id: string) => void;
  onOpenEnquiry: (propertyTitle?: string, type?: string) => void;
}

export const BuyPage: React.FC<BuyPageProps> = ({ initialTypeFilter, onViewProperty, onOpenEnquiry }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters (NO PRICE FILTERS)
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter || 'ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');

  const propertyTypes: PropertyType[] = [
    'Residential',
    'Commercial',
    'Land',
    'Farmland',
    'Industrial',
    'Investment',
  ];

  useEffect(() => {
    loadData();
  }, [selectedType, selectedCategory, selectedCity]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { status: 'Approved' };
      if (selectedType !== 'ALL') params.type = selectedType;
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedCity !== 'ALL') params.city = selectedCity;
      if (search) params.search = search;

      const data = await fetchProperties(params);
      setProperties(data);
    } catch (err) {
      console.error('Failed to load properties', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedType('ALL');
    setSelectedCategory('ALL');
    setSelectedCity('ALL');
  };

  return (
    <div className="space-y-10 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-12 border border-[#C5A059]/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block">
            VERIFIED REAL ESTATE PORTFOLIO
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Find a Property Worth Coming Home To.
          </h1>
          <p className="text-slate-300 text-sm font-light leading-relaxed">
            Verified residential homes, commercial suites, farmland estates, and development plots across prime growth corridors in India.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          
          {/* Keyword Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location or Keyword</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search location, neighborhood, or project..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
            >
              <option value="ALL">All Property Types</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
            >
              <option value="ALL">All Categories</option>
              <option value="Buy">For Purchase (Buy)</option>
              <option value="Rent">For Lease (Rent)</option>
              <option value="Management">Managed Asset</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A059]"
            >
              <option value="ALL">All Cities</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Ranga Reddy">Ranga Reddy</option>
            </select>
          </div>

        </form>

        <div className="flex justify-between items-center pt-2 border-t border-[#EADFC9]/60 text-xs text-slate-500">
          <span className="font-medium">
            Showing <strong className="text-[#0F172A]">{properties.length}</strong> verified property listings (No prices exposed)
          </span>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-slate-600 hover:text-[#0F172A] font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-serif font-bold text-[#0F172A]">No Properties Found</h3>
          <p className="text-slate-600 text-xs">No active property listings match your chosen filter criteria.</p>
          <button
            onClick={resetFilters}
            className="bg-[#0F172A] text-white px-5 py-2 rounded-lg text-xs font-medium"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onViewDetails={onViewProperty}
              onEnquire={(title) => onOpenEnquiry(title, 'Buy')}
            />
          ))}
        </div>
      )}
    </div>
  );
};
