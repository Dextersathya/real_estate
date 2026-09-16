import React, { useEffect, useState } from 'react';
import { Property } from '../types';
import { fetchProperties } from '../lib/api';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyJourneyAnimation } from '../components/PropertyJourneyAnimation';
import heroImage from '../assets/images/nri_property_hero_1786299228435.jpg';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Building, 
  Trees, 
  MapPin, 
  Factory, 
  TrendingUp, 
  ClipboardCheck, 
  PhoneCall, 
  MessageSquare, 
  KeyRound, 
  Star,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (propertyTitle?: string, type?: string) => void;
  onViewProperty: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenEnquiry, onViewProperty }) => {
  const [featuredProps, setFeaturedProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties({ status: 'Approved' })
      .then((data) => {
        setFeaturedProps(data.slice(0, 3));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const whatWeManage = [
    { title: 'Residential', desc: 'Luxury villas, penthouses, gated community homes, and upscale apartments.', icon: Building, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
    { title: 'Commercial', desc: 'Grade-A office space, IT parks, retail showrooms, and corporate suites.', icon: Building2, img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
    { title: 'Land & Plots', desc: 'Commercial land, corner plots, HMDA/DTCP layouts, and highway plots.', icon: MapPin, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
    { title: 'Farmland', desc: 'Gated farmland estates, teakwood orchards, and organic farmhouses.', icon: Trees, img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=800' },
    { title: 'Industrial', desc: 'Warehouses, logistics yards, light manufacturing units, and cold storage.', icon: Factory, img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800' },
    { title: 'Investment', desc: 'High-yield tenanted assets, pre-leased commercial units, and growth land.', icon: TrendingUp, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' },
  ];

  const managementSteps = [
    { num: '01', title: 'Onboard', desc: 'Property verification, baseline documentation, and key custody transfer.' },
    { num: '02', title: 'Manage', desc: 'Tenant curation, rent collection, tax payments, and routine maintenance.' },
    { num: '03', title: 'Monitor', desc: 'Bi-monthly physical site inspections with 45-point photographic audits.' },
    { num: '04', title: 'Update', desc: 'Instant portal reports, bank remittance receipts, and transparent logs.' },
  ];

  const whyUsPoints = [
    { title: 'Trusted Management', desc: 'Complete fiduciary responsibility. We manage your property like our own.' },
    { title: 'Professional Coordination', desc: 'Experienced in-house legal, maintenance, and tenant relation desks.' },
    { title: 'Transparent Updates', desc: 'Clear digital reports, inspection photography, and direct bank receipts.' },
    { title: 'NRI-Friendly Service', desc: 'Time-zone aligned communication for US, UK, Gulf, Canada, & Australia.' },
    { title: 'One Trusted Point of Contact', desc: 'Zero direct buyer-owner hassles. All enquiries flow strictly through us.' },
  ];

  return (
    <div className="bg-ivory text-navy space-y-16 pb-16">
      {/* 1. HERO SECTION - GEOMETRIC BALANCE SPLIT GRID */}
      <section className="grid grid-cols-12 min-h-[80vh] border-b border-[#E5E1DA]">
        
        {/* LEFT SIDE: HERO CONTENT */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 lg:py-16 space-y-8 bg-ivory border-r border-[#E5E1DA]">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] gold-accent block">
              Premier NRI Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl serif-title leading-[1.1] text-navy font-normal">
              Your Property.<br />
              <span className="italic gold-accent">Professionally</span><br />
              Managed.
            </h1>
            
            {/* INTERESTING FEATURED IMAGE BANNER */}
            <div className="relative my-4 overflow-hidden rounded-xs border border-[#E5E1DA] shadow-sm group">
              <img
                src={heroImage}
                alt="Luxury NRI Managed Estate"
                referrerPolicy="no-referrer"
                className="w-full h-44 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent flex items-end p-3.5">
                <div className="flex items-center justify-between w-full text-white text-xs">
                  <span className="font-semibold tracking-wider uppercase text-[10px] bg-[#C5A059] px-2 py-0.5 rounded-xs">
                    Featured Asset
                  </span>
                  <span className="text-slate-200 text-[11px] italic">
                    Jubilee Hills, Hyderabad
                  </span>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-600 max-w-md leading-relaxed">
              Tailored real estate and management solutions for Non-Resident Indians. Trusted, transparent, and totally handled.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onNavigate('/sell/submit')}
              className="bg-[#C5A059] hover:bg-[#b59048] text-white px-8 py-4 font-bold uppercase text-xs tracking-widest shadow-lg transition-all text-center"
            >
              Manage My Property
            </button>
            <button
              onClick={() => onNavigate('/buy')}
              className="bg-white text-[#0A192F] border-2 border-[#0A192F] hover:bg-[#0A192F] hover:text-[#C5A059] active:bg-[#0A192F] active:text-[#C5A059] focus:outline-hidden focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 px-8 py-4 font-bold uppercase text-xs tracking-widest transition-all text-center shadow-xs cursor-pointer"
            >
              Explore Listings
            </button>
          </div>

          {/* STATS STRIP */}
          <div className="flex gap-8 sm:gap-10 pt-8 border-t border-[#E5E1DA]">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-navy serif-title">500+</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">Managed Assets</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-navy serif-title">12+</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">Global Cities</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-navy serif-title">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">Transparency</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: GEOMETRIC VISUAL GRID */}
        <div className="col-span-12 lg:col-span-7 grid grid-rows-6 grid-cols-2 p-6 lg:p-8 gap-4 bg-[#F2F0EB]">
          {/* LARGE FEATURED IMAGE CARD */}
          <div className="row-span-4 col-span-2 relative overflow-hidden group min-h-[300px]">
            <img
              src={heroImage}
              alt="Luxury Villa"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* MINI CARD 1: RESIDENTIAL */}
          <button
            onClick={() => onNavigate('/buy?type=Residential')}
            className="row-span-2 bg-white flex flex-col p-6 shadow-xs border border-[#E5E1DA] justify-between text-left group hover:border-gold transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#F9F8F6] flex items-center justify-center">
              <span className="gold-accent text-lg">◈</span>
            </div>
            <div>
              <h4 className="font-bold text-navy text-base">Residential</h4>
              <p className="text-xs text-slate-500 mt-1">Villas, Luxury Apartments & Condos.</p>
            </div>
            <span className="text-[10px] font-bold uppercase gold-accent tracking-wider group-hover:translate-x-1 transition-transform">
              View Category →
            </span>
          </button>

          {/* MINI CARD 2: COMMERCIAL */}
          <button
            onClick={() => onNavigate('/buy?type=Commercial')}
            className="row-span-2 bg-navy text-white flex flex-col p-6 shadow-xs justify-between text-left group hover:bg-[#13243f] transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-lg">◈</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Commercial</h4>
              <p className="text-xs text-white/70 mt-1">Office Spaces, Retail & Warehouses.</p>
            </div>
            <span className="text-[10px] font-bold uppercase text-white tracking-wider group-hover:translate-x-1 transition-transform">
              View Category →
            </span>
          </button>
        </div>

      </section>

      {/* 2. PROPERTY JOURNEY ANIMATED EXPERIENCE */}
      <PropertyJourneyAnimation />

      {/* 3. ABOUT SECTION - GEOMETRIC BALANCE CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white border border-[#E5E1DA] p-8 sm:p-12 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-l-4 border-gold">
          <div className="lg:col-span-7 space-y-4">
            <span className="gold-accent text-xs font-bold uppercase tracking-[0.3em] block">
              About Lala NRI Realty
            </span>
            <h2 className="text-3xl sm:text-4xl serif-title text-navy font-normal">
              Bridging Oceans. Safeguarding Investments.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Lala NRI Realty was founded with a singular purpose: to provide Non-Resident Indians with an uncompromising, professional property management service.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Managing real estate in India while residing thousands of miles away often leads to unauthorized encroachments, unpaid property taxes, delayed maintenance, and stressful tenant dealings. We eliminate distance barriers completely by becoming your single, trusted legal representative on the ground.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/about')}
                className="bg-navy text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#1a2d47] transition inline-flex items-center gap-2"
              >
                <span>Read Corporate Overview</span>
                <ChevronRight className="w-4 h-4 gold-accent" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-72 sm:h-80 border border-[#E5E1DA] overflow-hidden shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000"
              alt="Lala NRI Office"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/20" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 border-l-4 border-gold shadow-luxury">
              <p className="text-xs font-bold text-navy uppercase tracking-wider">Centralized Governance</p>
              <p className="text-[11px] text-slate-600 mt-0.5">All tenant & buyer communications routed exclusively through Lala NRI Realty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT WE MANAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="gold-accent text-xs font-bold uppercase tracking-[0.3em] block">
            Asset Class Spectrum
          </span>
          <h2 className="text-3xl sm:text-4xl serif-title text-navy font-normal">
            What We Manage
          </h2>
          <p className="text-slate-600 text-sm">
            Comprehensive fiduciary oversight across all major real estate asset categories in India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whatWeManage.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E5E1DA] p-6 shadow-xs hover:border-gold transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-44 overflow-hidden mb-3 border border-[#E5E1DA]">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute top-3 left-3 bg-navy text-[#C5A059] p-2.5">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl serif-title text-navy font-bold">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E1DA]">
                  <button
                    onClick={() => onNavigate(`/buy?type=${item.title}`)}
                    className="text-xs font-bold uppercase tracking-wider text-navy gold-accent hover:text-navy flex items-center justify-between w-full"
                  >
                    <span>Browse {item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. PROPERTY MANAGEMENT PROCESS */}
      <section className="bg-[#F2F0EB] py-16 border-y border-[#E5E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="gold-accent text-xs font-bold uppercase tracking-[0.3em] block">
              Our Management Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl serif-title text-navy font-normal">
              How Lala NRI Management Works
            </h2>
            <p className="text-slate-600 text-sm">
              A clear, 4-stage operational cycle ensuring structured governance and total transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {managementSteps.map((step, idx) => (
              <div key={idx} className="bg-white border border-[#E5E1DA] p-6 shadow-xs border-t-4 border-navy space-y-3">
                <div className="text-3xl serif-title font-bold gold-accent">{step.num}</div>
                <h3 className="text-lg serif-title font-bold text-navy">{step.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => onNavigate('/management')}
              className="bg-navy text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#1a2d47] transition shadow-md"
            >
              Explore Management Services
            </button>
          </div>
        </div>
      </section>

      {/* 6. BUY / SELL / RENT TRIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* BUY CARD */}
          <div className="bg-white border border-[#E5E1DA] p-8 shadow-xs hover:border-gold transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#F2F0EB] text-navy flex items-center justify-center font-bold">
                <Building className="w-6 h-6 gold-accent" />
              </div>
              <h3 className="text-2xl serif-title font-bold text-navy">Buy Property</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Discover verified residential villas, commercial suites, farmland, and plots across prime Indian growth centers.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 gold-accent" /> Title Verified Listings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 gold-accent" /> Confident Confidentiality</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/buy')}
              className="mt-6 w-full py-3.5 bg-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1a2d47] transition"
            >
              Search Buy Listings
            </button>
          </div>

          {/* SELL CARD */}
          <div className="bg-navy text-white p-8 shadow-luxury border-2 border-gold flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#C5A059] text-navy flex items-center justify-center font-bold">
                <KeyRound className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl serif-title font-bold text-white">Sell Your Property</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Your Property. Our Reach. Let Lala NRI Realty handle buyer screening, price negotiations, and legal title transfers.
              </p>
              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 gold-accent" /> NRI Asset Representation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 gold-accent" /> Duplicate Check & Admin Approval</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/sell')}
              className="mt-6 w-full py-3.5 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#b59048] transition"
            >
              Submit Property for Sale
            </button>
          </div>

          {/* RENT CARD */}
          <div className="bg-white border border-[#E5E1DA] p-8 shadow-xs hover:border-gold transition flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#F2F0EB] text-navy flex items-center justify-center font-bold">
                <Users className="w-6 h-6 gold-accent" />
              </div>
              <h3 className="text-2xl serif-title font-bold text-navy">Rentals</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Premium residential and commercial rental options managed with high standards of tenant curation.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 gold-accent" /> Corporate & Expat Tenants</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 gold-accent" /> Seamless Lease Governance</li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('/rent')}
              className="mt-6 w-full py-3.5 bg-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1a2d47] transition"
            >
              Browse Rental Inventory
            </button>
          </div>

        </div>
      </section>

      {/* 7. FEATURED PROPERTIES (NO PRICES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span className="gold-accent text-xs font-bold uppercase tracking-[0.3em] block mb-1">
              Curated Selection
            </span>
            <h2 className="text-3xl sm:text-4xl serif-title text-navy font-normal">
              Featured Properties
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/buy')}
            className="text-xs font-bold uppercase tracking-wider text-navy hover:gold-accent flex items-center gap-1.5"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 gold-accent" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-[#E5E1DA]/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProps.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onViewDetails={onViewProperty}
                onEnquire={(title) => onOpenEnquiry(title, 'Buy')}
              />
            ))}
          </div>
        )}
      </section>

      {/* 8. WHY LALA NRI REALTY */}
      <section className="bg-navy text-white py-16 border-y border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="gold-accent text-xs font-bold uppercase tracking-[0.3em] block">
              Why Choose Lala NRI Realty
            </span>
            <h2 className="text-3xl sm:text-4xl serif-title text-white font-normal">
              Built Specifically for Overseas Property Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {whyUsPoints.map((pt, idx) => (
              <div key={idx} className="bg-[#11233d] border border-[#1E2D42] p-5 space-y-3 hover:border-gold transition-all">
                <ShieldCheck className="w-6 h-6 gold-accent" />
                <h3 className="serif-title font-bold text-white text-sm">{pt.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="gold-accent text-xs font-bold uppercase tracking-[0.3em] block">
            Client Satisfaction
          </span>
          <h2 className="text-3xl sm:text-4xl serif-title text-navy font-normal">
            Trusted by NRIs Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E5E1DA] p-6 shadow-luxury border-l-4 border-gold space-y-4">
            <div className="flex text-[#C5A059] gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A059]" />)}
            </div>
            <p className="text-slate-700 text-xs leading-relaxed italic">
              "Living in California, I was constantly worried about my Jubilee Hills villa. Lala NRI Realty took over complete tenant management, rent collection, and sends bi-monthly photo reports. Outstanding service!"
            </p>
            <div className="border-t border-[#E5E1DA] pt-3 flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Rajesh S." className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold text-navy">Rajesh Sharma</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">San Jose, California, USA</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E1DA] p-6 shadow-luxury border-l-4 border-gold space-y-4">
            <div className="flex text-[#C5A059] gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A059]" />)}
            </div>
            <p className="text-slate-700 text-xs leading-relaxed italic">
              "The strict rule where Lala NRI Realty handles all buyer enquiries is brilliant. No random callers or middlemen. They screened candidates for my HITEC City office space professionally."
            </p>
            <div className="border-t border-[#E5E1DA] pt-3 flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Priya P." className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold text-navy">Priya Patel</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">London, United Kingdom</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E5E1DA] p-6 shadow-luxury border-l-4 border-gold space-y-4">
            <div className="flex text-[#C5A059] gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#C5A059]" />)}
            </div>
            <p className="text-slate-700 text-xs leading-relaxed italic">
              "I purchased 3 acres of farmland through Lala NRI Realty. Their legal diligence and physical site monitoring give me total confidence."
            </p>
            <div className="border-t border-[#E5E1DA] pt-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-navy text-white flex items-center justify-center font-bold text-xs">
                VS
              </div>
              <div>
                <p className="text-xs font-bold text-navy">Vikram Singh</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Dubai, UAE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-navy text-white p-8 sm:p-14 text-center border-2 border-gold shadow-luxury space-y-6">
          <h2 className="text-3xl sm:text-4xl serif-title text-white max-w-2xl mx-auto leading-tight">
            Your Property Deserves Professional Care.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto font-light">
            Connect with our NRI Property Concierge Desk today and experience seamless real estate governance.
          </p>
          <div>
            <button
              onClick={() => onOpenEnquiry(undefined, 'Management')}
              className="bg-[#C5A059] hover:bg-[#b59048] text-white font-bold py-4 px-8 text-xs uppercase tracking-widest transition shadow-lg inline-flex items-center gap-2"
            >
              <span>Talk to Lala NRI Realty</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

