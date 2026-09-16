import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, Notification, PropertyTimeline } from '../types';
import { fetchProperties, fetchNotifications, markNotificationsRead, fetchPropertyTimeline } from '../lib/api';
import { 
  LayoutDashboard, 
  Building2, 
  ShoppingBag, 
  PlusCircle, 
  Key, 
  Bell, 
  User as UserIcon, 
  PhoneCall, 
  LogOut, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  MapPin, 
  Download, 
  UserCheck 
} from 'lucide-react';

interface OwnerDashboardPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: (title?: string, type?: string) => void;
  onViewPropertyDetails: (id: string) => void;
}

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({
  onNavigate,
  onOpenEnquiry,
  onViewPropertyDetails,
}) => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'notifications' | 'profile'>('dashboard');
  const [properties, setProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<PropertyTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOwnerData();
    }
  }, [user]);

  const loadOwnerData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [props, notifs] = await Promise.all([
        fetchProperties({ ownerId: user.id }),
        fetchNotifications(user.id),
      ]);
      setProperties(props);
      setNotifications(notifs);
      if (props.length > 0) {
        setSelectedProperty(props[0]);
        loadTimeline(props[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTimeline = async (propId: string) => {
    try {
      const time = await fetchPropertyTimeline(propId);
      setSelectedTimeline(time);
    } catch {
      setSelectedTimeline([]);
    }
  };

  const handleSelectProp = (p: Property) => {
    setSelectedProperty(p);
    loadTimeline(p.id);
  };

  if (!user) return null;

  const managedProps = properties.filter((p) => p.status === 'Under Management');
  const listedProps = properties.filter((p) => ['Approved', 'Pending Review', 'Active'].includes(p.status));
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white p-5 border-r border-[#C5A059]/30 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Owner Identity */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-10 h-10 rounded-full bg-[#C5A059] text-[#0F172A] font-bold flex items-center justify-center text-sm shadow-md">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-white truncate max-w-[140px]">{user.fullName}</p>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded uppercase font-semibold">
                PROPERTY OWNER
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'dashboard' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'properties' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>My Properties ({properties.length})</span>
            </button>

            <button
              onClick={() => onNavigate('/buy')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Properties</span>
            </button>

            <button
              onClick={() => onNavigate('/sell/submit')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-emerald-400 hover:bg-slate-800 font-semibold transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Property</span>
            </button>

            <button
              onClick={() => onNavigate('/rent')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              <Key className="w-4 h-4" />
              <span>Rentals</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('notifications');
                markNotificationsRead(user.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'notifications' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {unreadNotifs > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {unreadNotifs}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'profile' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Owner Profile</span>
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Lala Desk</span>
            </button>
          </nav>

        </div>

        {/* Footer Logout */}
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/50 rounded-xl text-xs font-semibold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Canvas */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block">
              NRI OWNER PORTAL
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#0F172A]">
              Welcome, {user.fullName}
            </h1>
            <p className="text-xs text-slate-500">Residence Country: {user.country}</p>
          </div>

          <button
            onClick={() => onNavigate('/sell/submit')}
            className="bg-[#0F172A] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1E293B] flex items-center gap-1.5 border border-[#C5A059]/40"
          >
            <PlusCircle className="w-4 h-4 text-[#C5A059]" />
            <span>Submit New Property</span>
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Properties Managed</span>
                <p className="text-3xl font-serif font-bold text-[#0F172A]">{managedProps.length}</p>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2 py-0.5 rounded">Active Fiduciary Care</span>
              </div>

              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Properties Listed</span>
                <p className="text-3xl font-serif font-bold text-[#0F172A]">{properties.length}</p>
                <span className="text-[10px] text-amber-800 bg-amber-50 font-bold px-2 py-0.5 rounded">Buy/Sell/Rent Listings</span>
              </div>

              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Notifications</span>
                <p className="text-3xl font-serif font-bold text-[#0F172A]">{notifications.length}</p>
                <span className="text-[10px] text-slate-600 font-medium">Recent Inspection Alerts</span>
              </div>

              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Verification Vault</span>
                <p className="text-3xl font-serif font-bold text-emerald-800">100%</p>
                <span className="text-[10px] text-emerald-800 font-bold">Compliant & Legal</span>
              </div>

            </div>

            {/* Selected Property Spotlight */}
            {properties.length > 0 && selectedProperty && (
              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#EADFC9] pb-4 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">PROPERTY SPOTLIGHT</span>
                    <h2 className="text-xl font-serif font-bold text-[#0F172A]">{selectedProperty.title}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      {selectedProperty.location}, {selectedProperty.city}
                    </p>
                  </div>

                  {/* Switch property dropdown if multiple */}
                  {properties.length > 1 && (
                    <select
                      value={selectedProperty.id}
                      onChange={(e) => {
                        const found = properties.find((p) => p.id === e.target.value);
                        if (found) handleSelectProp(found);
                      }}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Property Detail Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  <div className="lg:col-span-5 h-64 rounded-2xl overflow-hidden border">
                    <img
                      src={selectedProperty.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-4 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-[#F3EFE6] rounded-xl border border-[#EADFC9]">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Management Status</span>
                        <strong className="text-sm font-serif font-bold text-[#0F172A]">{selectedProperty.status}</strong>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Occupancy</span>
                        <strong className="text-sm font-serif font-bold text-emerald-800">{selectedProperty.occupancyStatus || 'Vacant'}</strong>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tenant Name</span>
                        <strong className="text-sm font-serif font-bold text-slate-800">{selectedProperty.tenantName || 'N/A (Vacant)'}</strong>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Last Inspection</span>
                        <strong className="text-sm font-serif font-bold text-slate-800">{selectedProperty.lastInspectionDate || 'Scheduled Q3'}</strong>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Area</span>
                        <strong className="text-sm font-serif font-bold text-slate-800">{selectedProperty.areaSqFt} sq. ft.</strong>
                      </div>

                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-semibold">Pricing Policy</span>
                        <strong className="text-xs font-semibold text-amber-900">Confidential (No Public Price)</strong>
                      </div>
                    </div>

                    {/* Timeline & Documents */}
                    <div className="space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#0F172A]">Recent Activity & Inspection Logs</h4>
                      {selectedTimeline.length === 0 ? (
                        <p className="text-slate-500 text-xs italic">No inspection entries recorded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTimeline.map((item) => (
                            <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                              <div className="flex justify-between items-center font-bold text-slate-900">
                                <span>{item.title}</span>
                                <span className="text-[10px] text-slate-400">{item.date}</span>
                              </div>
                              <p className="text-slate-600 text-[11px]">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* MY PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0F172A]">My Managed Estate Portfolio</h2>
                <p className="text-slate-500 text-xs">Real-time status, tenancy records, and inspection logs for your registered assets.</p>
              </div>
              <button
                onClick={() => onNavigate('/sell/submit')}
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
              >
                <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                <span>Submit Another Property</span>
              </button>
            </div>
            
            {properties.length === 0 ? (
              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-12 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-[#0F172A]">No Properties Registered Yet</h3>
                <p className="text-slate-500 text-xs">Submit your property for Lala NRI Realty management or sales representation.</p>
                <button
                  onClick={() => onNavigate('/sell/submit')}
                  className="bg-[#0F172A] text-white px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Submit First Property
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((p) => (
                  <div key={p.id} className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-4 hover:border-[#C5A059] transition">
                    <div className="flex gap-4 items-start">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                        alt={p.title}
                        className="w-20 h-20 rounded-xl object-cover border border-[#EADFC9] shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold bg-[#F3EFE6] px-2 py-0.5 rounded text-slate-800 uppercase">
                            {p.type} • {p.category}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            {p.status}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-[#0F172A] truncate">{p.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C5A059]" />
                          <span>{p.location}, {p.city}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Tenancy Status</span>
                        <span className="font-semibold text-slate-800">{p.tenantName ? `Occupied (${p.tenantName})` : 'Vacant / Available'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-semibold block">Last Audit</span>
                        <span className="font-semibold text-slate-800">{p.lastInspectionDate || 'Up to Date'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#EADFC9] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <a
                        href={`https://wa.me/919962525935?text=Hi%20Lala%20NRI%20Realty,%20I%20am%20enquiring%20about%20my%20managed%20property%20${encodeURIComponent(p.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-bold hover:underline text-[11px] flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        Manager WhatsApp (+91 99625 25935)
                      </a>

                      <button
                        onClick={() => onViewPropertyDetails(p.id)}
                        className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1 transition"
                      >
                        View Dossier
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#0F172A]">Notifications & Alerts</h2>
            <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 space-y-3">
              {notifications.length === 0 ? (
                <p className="text-slate-500 text-xs italic">No notifications found.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.date.split('T')[0]}</span>
                    </div>
                    <p className="text-slate-600 text-xs">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 sm:p-8 space-y-6 max-w-xl">
            <h2 className="text-xl font-serif font-bold text-[#0F172A]">Owner Profile Details</h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Full Name</span>
                <p className="font-bold text-slate-900 text-sm">{user.fullName}</p>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Email Address</span>
                <p className="font-bold text-slate-900 text-sm">{user.email}</p>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Phone Number</span>
                <p className="font-bold text-slate-900 text-sm">{user.phone}</p>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Country of Residence</span>
                <p className="font-bold text-slate-900 text-sm">{user.country}</p>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">System Role</span>
                <p className="font-bold text-emerald-800 text-sm">{user.role}</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
