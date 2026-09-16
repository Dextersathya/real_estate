import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/images/regenerated_image_1786429720735.png';
import { 
  Building2, 
  Phone, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  LayoutDashboard, 
  PlusCircle,
  Bell,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenEnquiry: (propertyTitle?: string, type?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenEnquiry }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Property Management', path: '/management' },
    { label: 'Buy', path: '/buy' },
    { label: 'Sell', path: '/sell' },
    { label: 'Rent', path: '/rent' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FDFCFB] border-b border-[#E5E1DA] shadow-xs transition-all">
      {/* Top micro bar */}
      <div className="bg-navy text-[#FDFCFB] text-xs py-1.5 px-4 sm:px-12 flex justify-between items-center border-b border-[#1E2D42]">
        <div className="flex items-center space-x-6 text-slate-300">
          <span className="flex items-center gap-1.5 hover:text-white transition">
            <Phone className="w-3.5 h-3.5 gold-accent" />
            <a href="tel:+919962525935">+91 99625 25935</a>
          </span>
          <span className="hidden sm:flex items-center gap-1.5 hover:text-white transition">
            <MessageSquare className="w-3.5 h-3.5 gold-accent" />
            <a href="https://wa.me/919962525935" target="_blank" rel="noreferrer">WhatsApp Us</a>
          </span>
          <span className="hidden md:inline-block text-slate-400 text-[11px] tracking-wider uppercase">
            Overseas NRI Property Desk
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <span className="hidden sm:inline-block text-slate-400">Verified Legal & Asset Custody</span>
          {user && (
            <span className="bg-[#C5A059]/20 text-gold px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 font-medium">
              {user.fullName} ({user.role === 'ADMIN' ? 'Admin' : 'Owner'})
            </span>
          )}
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-2">
        {/* Left Section: Mobile Hamburger Menu Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex lg:hidden items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-navy focus:outline-hidden hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 sm:gap-3 text-left group focus:outline-hidden shrink-0"
          >
            <img 
              src={logoImage} 
              alt="Lala NRI Realty Logo" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="text-base sm:text-xl font-bold tracking-widest text-[#0A192F] uppercase leading-none">
                Lala NRI Realty
              </div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold gold-accent mt-0.5 sm:mt-1">
                Property Management
              </div>
            </div>
          </button>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`transition-colors py-1 relative text-xs tracking-wider font-semibold uppercase ${
                  isActive
                    ? 'gold-accent'
                    : 'text-[#0A192F] hover:text-[#C5A059]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / Auth (Login & Enquire on the right) */}
        <div className="flex items-center space-x-1.5 sm:space-x-4 shrink-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-white border border-[#E5E1DA] hover:border-gold text-navy px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-xs transition"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-navy text-white text-[10px] sm:text-xs flex items-center justify-center font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{user.fullName.split(' ')[0]}</span>
                <span className="text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 bg-[#C5A059] text-white font-bold uppercase">
                  {user.role === 'ADMIN' ? 'Admin' : 'Owner'}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E1DA] shadow-luxury py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#E5E1DA]">
                    <p className="font-bold text-navy">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  {user.role === 'ADMIN' ? (
                    <>
                      <button
                        onClick={() => handleNavClick('/admin')}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-[#F2F0EB] flex items-center gap-2 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 gold-accent" />
                        Admin Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick('/admin/properties')}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-[#F2F0EB] flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-slate-500" />
                        Manage Properties
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavClick('/dashboard')}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-[#F2F0EB] flex items-center gap-2 font-medium"
                      >
                        <LayoutDashboard className="w-4 h-4 gold-accent" />
                        Owner Dashboard
                      </button>
                      <button
                        onClick={() => handleNavClick('/sell/submit')}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-[#F2F0EB] flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-600" />
                        Submit Property
                      </button>
                    </>
                  )}

                  <div className="border-t border-[#E5E1DA] my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                      handleNavClick('/');
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('/login')}
              className="text-xs font-semibold uppercase tracking-wider text-navy hover:gold-accent px-2 sm:px-3 py-1.5 sm:py-2 transition"
            >
              Login
            </button>
          )}

          <button
            onClick={() => onOpenEnquiry()}
            className="bg-navy text-white px-3 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:bg-[#1a2d47] transition-all shadow-xs shrink-0"
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E1DA] bg-ivory px-6 pt-4 pb-6 space-y-4 shadow-luxury">
          <div className="flex flex-col space-y-2 pb-3 border-b border-[#E5E1DA]">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left px-3 py-2 text-xs font-bold uppercase tracking-widest ${
                  currentPath === link.path
                    ? 'bg-navy text-white'
                    : 'text-navy hover:gold-accent'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-white border border-[#E5E1DA] text-xs">
                  <p className="font-bold text-navy">{user.fullName}</p>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">{user.role}</p>
                </div>
                {user.role === 'ADMIN' ? (
                  <button
                    onClick={() => handleNavClick('/admin')}
                    className="w-full text-left px-3 py-2 bg-navy text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Go to Admin Portal
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavClick('/dashboard')}
                    className="w-full text-left px-3 py-2 bg-navy text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Go to Owner Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 text-xs font-bold uppercase tracking-wider"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavClick('/login')}
                  className="flex-1 text-center py-2.5 border border-navy text-navy text-xs font-bold uppercase tracking-wider"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavClick('/register')}
                  className="flex-1 text-center py-2.5 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

