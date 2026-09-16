import React from 'react';
import { Building2, Phone, Mail, MapPin, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import logoImage from '../assets/images/regenerated_image_1786429723844.png';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (propertyTitle?: string, type?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEnquiry }) => {
  return (
    <footer className="bg-navy text-[#FDFCFB] pt-16 pb-8 border-t border-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E2D42]">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Lala NRI Realty Logo" 
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover shadow-sm border border-gold/40" 
              />
              <div>
                <span className="text-xl font-bold uppercase tracking-widest text-white">
                  Lala NRI Realty
                </span>
                <p className="text-[9px] uppercase tracking-[0.25em] gold-accent font-bold mt-0.5">PROPERTY MANAGEMENT</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-md font-light">
              India’s premier property management and real estate advisory firm built specifically for Non-Resident Indians across USA, UK, UAE, Canada, Australia, and worldwide.
            </p>

            <div className="p-4 bg-[#11233d] border border-gold/30 text-xs text-slate-200 flex items-start gap-3 border-l-4 border-gold">
              <ShieldCheck className="w-5 h-5 gold-accent shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-bold uppercase tracking-wider text-[11px] mb-1">Strict Governance Policy</strong>
                Buyers, sellers, renters, and property owners do NOT communicate directly through our platform. All communications are handled strictly through Lala NRI Realty.
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white serif-title font-bold text-base mb-4 border-b border-gold/40 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-medium text-slate-300">
              <li><button onClick={() => onNavigate('/')} className="hover:gold-accent transition">Home</button></li>
              <li><button onClick={() => onNavigate('/about')} className="hover:gold-accent transition">About Us</button></li>
              <li><button onClick={() => onNavigate('/management')} className="hover:gold-accent transition">NRI Property Management</button></li>
              <li><button onClick={() => onNavigate('/buy')} className="hover:gold-accent transition">Buy Properties</button></li>
              <li><button onClick={() => onNavigate('/sell')} className="hover:gold-accent transition">Sell Property</button></li>
              <li><button onClick={() => onNavigate('/rent')} className="hover:gold-accent transition">Rentals</button></li>
              <li><button onClick={() => onNavigate('/contact')} className="hover:gold-accent transition">Contact Us</button></li>
            </ul>
          </div>

          {/* Col 3: Property Categories */}
          <div>
            <h4 className="text-white serif-title font-bold text-base mb-4 border-b border-gold/40 pb-2 inline-block">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider font-medium text-slate-300">
              <li><button onClick={() => onNavigate('/buy?type=Residential')} className="hover:gold-accent transition">Residential Villas & Condos</button></li>
              <li><button onClick={() => onNavigate('/buy?type=Commercial')} className="hover:gold-accent transition">Commercial Offices & Retail</button></li>
              <li><button onClick={() => onNavigate('/buy?type=Farmland')} className="hover:gold-accent transition">Farmland & Farmhouses</button></li>
              <li><button onClick={() => onNavigate('/buy?type=Land')} className="hover:gold-accent transition">Open Plots & Layouts</button></li>
              <li><button onClick={() => onNavigate('/buy?type=Industrial')} className="hover:gold-accent transition">Industrial Logistics Yards</button></li>
              <li><button onClick={() => onNavigate('/buy?type=Investment')} className="hover:gold-accent transition">Pre-Leased Commercial Units</button></li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-white serif-title font-bold text-base mb-4 border-b border-gold/40 pb-2 inline-block">
              Corporate Desk
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 gold-accent shrink-0 mt-0.5" />
                <span>Suite 802, Jubilee Hills, Road No. 36, Hyderabad, Telangana 500033</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 gold-accent shrink-0" />
                <a href="tel:+919962525935" className="hover:text-white">+91 99625 25935</a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 gold-accent shrink-0" />
                <a href="https://wa.me/919962525935" target="_blank" rel="noreferrer" className="hover:text-white">+91 99625 25935 (WhatsApp)</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 gold-accent shrink-0" />
                <a href="mailto:contact@lalanri.com" className="hover:text-white">contact@lalanri.com</a>
              </li>
            </ul>

            <button
              onClick={() => onOpenEnquiry()}
              className="mt-6 w-full bg-[#C5A059] hover:bg-[#b59048] text-white font-bold py-3 px-4 text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
            >
              <span>Schedule Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Rights Mini-Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] font-medium text-slate-400 gap-4">
          <div className="flex gap-6 text-slate-300 font-bold">
            <span>Mumbai</span>
            <span>Dubai</span>
            <span>London</span>
            <span>New York</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="text-white">© {new Date().getFullYear()} Lala NRI Realty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

