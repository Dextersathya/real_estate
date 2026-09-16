import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, User, Enquiry, SiteContent, PropertyTimeline } from '../types';
import { 
  fetchAdminStats, 
  fetchProperties, 
  fetchAdminUsers, 
  fetchAdmins,
  createAdmin,
  removeAdmin,
  fetchEnquiries, 
  updatePropertyStatus,
  updateProperty,
  updateEnquiryStatus, 
  updateUserStatus, 
  fetchSiteContent, 
  updateSiteContent, 
  addTimelineEntry, 
  deleteProperty 
} from '../lib/api';
import { ImageUploadDropzone } from '../components/ImageUploadDropzone';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ShoppingBag, 
  Key, 
  MessageSquare, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Check, 
  Eye, 
  Clock,
  Filter,
  BadgeCheck,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Tag,
  UserPlus,
  UserCheck,
  Shield,
  KeyRound,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
  onViewPropertyDetails: (id: string) => void;
  initialTab?: 'dashboard' | 'properties' | 'owners' | 'admins' | 'buyListings' | 'sellListings' | 'rentListings' | 'enquiries' | 'content' | 'media' | 'settings';
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
  onNavigate, 
  onViewPropertyDetails, 
  initialTab = 'dashboard' 
}) => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'properties' | 'owners' | 'admins' | 'buyListings' | 'sellListings' | 'rentListings' | 'enquiries' | 'content' | 'media' | 'settings'
  >(initialTab);

  // Stats
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalManaged: 0,
    pendingApprovals: 0,
    buyEnquiries: 0,
    sellEnquiries: 0,
    rentEnquiries: 0,
    totalOwners: 0,
    totalEnquiries: 0,
  });

  // Data collections
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin Management Modal & State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminFormMode, setAdminFormMode] = useState<'create' | 'promote'>('create');
  const [adminFormData, setAdminFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: 'India',
    password: '',
    promoteUserId: '',
  });
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [adminBannerNotice, setAdminBannerNotice] = useState<string | null>(null);
  const [approvalBannerNotice, setApprovalBannerNotice] = useState<string | null>(null);

  // Selected for Modal / Editing
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryNotes, setEnquiryNotes] = useState('');
  
  // Property Management state
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('All');
  const [propertyCategoryFilter, setPropertyCategoryFilter] = useState('All');
  const [propertyCityFilter, setPropertyCityFilter] = useState('All');

  // Edit Property Modal State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Property>>({});
  const [isSavingProperty, setIsSavingProperty] = useState(false);

  // Timeline / Audit Log Modal State
  const [selectedPropertyForTimeline, setSelectedPropertyForTimeline] = useState<Property | null>(null);
  const [timelineTitle, setTimelineTitle] = useState('');
  const [timelineDesc, setTimelineDesc] = useState('');
  const [timelineCategory, setTimelineCategory] = useState<'Inspection' | 'Maintenance' | 'Tenant' | 'Document' | 'Listing' | 'Management'>('Inspection');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [sData, pData, uData, eData, cData, aData] = await Promise.all([
        fetchAdminStats(),
        fetchProperties({ all: 'true' }),
        fetchAdminUsers(),
        fetchEnquiries(),
        fetchSiteContent(),
        fetchAdmins(),
      ]);

      setStats(sData);
      setProperties(pData);
      setUsers(uData);
      setEnquiries(eData);
      setSiteContent(cData);
      setAdmins(aData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (pId: string) => {
    const prop = properties.find((p) => p.id === pId);
    await updatePropertyStatus(pId, { status: 'Approved' });
    setApprovalBannerNotice(`Property "${prop?.title || 'Listing'}" has been approved and moved to the live Buy / Sell page!`);
    loadAllAdminData();
    setTimeout(() => {
      setApprovalBannerNotice(null);
    }, 9000);
  };

  const handleRejectProperty = async (pId: string) => {
    await updatePropertyStatus(pId, { status: 'Rejected' });
    loadAllAdminData();
  };

  const handleCreateOrPromoteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAdmin(true);
    try {
      if (adminFormMode === 'promote') {
        if (!adminFormData.promoteUserId) {
          alert('Please select an owner account to promote to Administrator.');
          setIsSubmittingAdmin(false);
          return;
        }
        const res = await createAdmin({
          promoteUserId: adminFormData.promoteUserId,
          fullName: '',
          email: '',
          password: adminFormData.password || 'admin123',
        });
        setAdminBannerNotice(res.message || 'User promoted to Administrator successfully.');
      } else {
        if (!adminFormData.email || !adminFormData.fullName) {
          alert('Administrator Full Name and Email are required.');
          setIsSubmittingAdmin(false);
          return;
        }
        const res = await createAdmin({
          fullName: adminFormData.fullName,
          email: adminFormData.email,
          phone: adminFormData.phone,
          country: adminFormData.country,
          password: adminFormData.password || 'admin123',
        });
        setAdminBannerNotice(res.message || 'New Administrator added successfully.');
      }

      setShowAddAdminModal(false);
      setAdminFormData({
        fullName: '',
        email: '',
        phone: '',
        country: 'India',
        password: '',
        promoteUserId: '',
      });
      await loadAllAdminData();
      setTimeout(() => setAdminBannerNotice(null), 8000);
    } catch (err: any) {
      alert(err?.message || 'Failed to add administrator.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const handleRemoveAdminUser = async (adminUser: User) => {
    if (adminUser.id === 'user-admin-1' || adminUser.email.toLowerCase() === 'admin@lalanri.com') {
      alert('The primary Super Administrator account (admin@lalanri.com) cannot be removed.');
      return;
    }
    if (admins.length <= 1) {
      alert('Cannot remove the last remaining administrator.');
      return;
    }
    if (!confirm(`Are you sure you want to revoke Administrator access for "${adminUser.fullName}" (${adminUser.email})?`)) {
      return;
    }
    try {
      const res = await removeAdmin(adminUser.id);
      setAdminBannerNotice(res.message || 'Administrator privileges revoked.');
      await loadAllAdminData();
      setTimeout(() => setAdminBannerNotice(null), 8000);
    } catch (err: any) {
      alert(err?.message || 'Failed to remove administrator.');
    }
  };

  const handleSetUnderManagement = async (pId: string) => {
    await updatePropertyStatus(pId, { status: 'Under Management' });
    loadAllAdminData();
  };

  const handleDeleteProp = async (pId: string) => {
    if (confirm('Are you sure you want to delete this property listing?')) {
      await deleteProperty(pId);
      loadAllAdminData();
    }
  };

  const handleOpenEditProperty = (p: Property) => {
    setEditingProperty(p);
    setEditFormData({
      title: p.title,
      category: p.category,
      type: p.type,
      price: p.price,
      priceFormat: p.priceFormat,
      location: p.location,
      city: p.city,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      areaSqFt: p.areaSqFt,
      furnishingStatus: p.furnishingStatus,
      status: p.status,
      verified: p.verified ?? true,
      description: p.description,
      images: p.images || [],
      ownerName: p.ownerName,
      ownerPhone: p.ownerPhone,
    });
  };

  const handleSaveEditProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setIsSavingProperty(true);
    try {
      await updateProperty(editingProperty.id, editFormData);
      setEditingProperty(null);
      await loadAllAdminData();
    } catch (err) {
      console.error(err);
      alert('Failed to update property details.');
    } finally {
      setIsSavingProperty(false);
    }
  };

  const handleToggleVerified = async (p: Property) => {
    await updateProperty(p.id, { verified: !p.verified });
    loadAllAdminData();
  };

  const handleQuickStatusChange = async (pId: string, newStatus: string) => {
    await updatePropertyStatus(pId, { status: newStatus });
    loadAllAdminData();
  };

  const handleUpdateEnquiryStatus = async (eId: string, status: string) => {
    await updateEnquiryStatus(eId, { status, adminNotes: enquiryNotes });
    setSelectedEnquiry(null);
    loadAllAdminData();
  };

  const handleToggleUserStatus = async (uId: string, currentStatus: string) => {
    const next = currentStatus === 'active' ? 'suspended' : 'active';
    await updateUserStatus(uId, next);
    loadAllAdminData();
  };

  const handleAddTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyForTimeline || !timelineTitle) return;
    await addTimelineEntry({
      propertyId: selectedPropertyForTimeline.id,
      title: timelineTitle,
      description: timelineDesc,
      category: timelineCategory,
      author: user?.fullName || 'Lala NRI Admin',
    });
    setSelectedPropertyForTimeline(null);
    setTimelineTitle('');
    setTimelineDesc('');
    setTimelineCategory('Inspection');
    loadAllAdminData();
    alert('Timeline inspection log added to property vault.');
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-[#0F172A]">Administrator Access Only</h2>
        <p className="text-xs text-slate-600">Please authenticate as an administrator to access this console.</p>
        <button onClick={() => onNavigate('/login')} className="bg-[#0F172A] text-white px-5 py-2 rounded-lg text-xs font-semibold">
          Login as Admin
        </button>
      </div>
    );
  }

  const pendingProps = properties.filter((p) => p.status === 'Pending Review');
  const buyListings = properties.filter((p) => p.category === 'Buy');
  const sellListings = properties.filter((p) => p.category === 'Sell');
  const rentListings = properties.filter((p) => p.category === 'Rent');

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white p-5 border-r border-[#C5A059]/30 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded bg-[#C5A059] text-[#0F172A] flex items-center justify-center font-bold text-xs">
              ADM
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-white">ADMIN CONSOLE</p>
              <p className="text-[10px] text-[#C5A059]">Lala NRI Realty Desk</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'dashboard' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'properties' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4" />
                <span>Properties ({properties.length})</span>
              </div>
              {pendingProps.length > 0 && (
                <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                  {pendingProps.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('owners')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'owners' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Owner Profiles ({users.filter((u) => u.role === 'PROPERTY_OWNER').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'admins' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin Team & Access</span>
              </div>
              <span className="bg-slate-800 text-emerald-400 font-bold text-[10px] px-1.5 py-0.5 rounded">
                {admins.length || users.filter((u) => u.role === 'ADMIN').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('buyListings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'buyListings' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Listings</span>
            </button>

            <button
              onClick={() => setActiveTab('sellListings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'sellListings' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Sell Submissions</span>
            </button>

            <button
              onClick={() => setActiveTab('rentListings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'rentListings' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Rent Listings</span>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'enquiries' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4" />
                <span>Enquiries</span>
              </div>
              <span className="bg-slate-800 text-amber-400 font-bold text-[10px] px-1.5 py-0.2 rounded">
                {enquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'content' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Website Content</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium transition ${
                activeTab === 'settings' ? 'bg-[#C5A059] text-[#0F172A] font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

        </div>

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

      {/* Main Canvas */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[#C5A059] text-xs font-semibold uppercase tracking-widest block">
              LALA NRI REALTY MANAGEMENT DESK
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#0F172A]">
              Admin Control Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('admins');
                setShowAddAdminModal(true);
              }}
              className="bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-900 border border-emerald-600/40 flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4 text-emerald-300" />
              <span>Add Admin</span>
            </button>

            <button
              onClick={() => onNavigate('/sell/submit')}
              className="bg-[#0F172A] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#1E293B] border border-[#C5A059]/40 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        {/* Global Notifications / Live Feedback */}
        {approvalBannerNotice && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-4 text-emerald-950 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-emerald-900">Listing Approved & Moved to Portal</p>
                <p className="text-emerald-800">{approvalBannerNotice}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('/buy')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition"
              >
                <span>View on Live Buy Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setApprovalBannerNotice(null)}
                className="p-1 text-emerald-700 hover:text-emerald-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {adminBannerNotice && (
          <div className="bg-blue-50 border border-blue-300 rounded-2xl p-4 flex items-center justify-between gap-4 text-blue-950 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-blue-900">Admin Team Update</p>
                <p className="text-blue-800">{adminBannerNotice}</p>
              </div>
            </div>
            <button
              onClick={() => setAdminBannerNotice(null)}
              className="p-1 text-blue-700 hover:text-blue-900 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Total Properties</span>
                <p className="text-3xl font-serif font-bold text-[#0F172A]">{stats.totalProperties}</p>
                <span className="text-[10px] text-slate-500 font-medium">{stats.totalManaged} Under Active Management</span>
              </div>

              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Pending Approvals</span>
                <p className="text-3xl font-serif font-bold text-amber-700">{stats.pendingApprovals}</p>
                <span className="text-[10px] text-amber-900 bg-amber-50 font-bold px-2 py-0.5 rounded">Requires Review</span>
              </div>

              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Total Enquiries</span>
                <p className="text-3xl font-serif font-bold text-[#0F172A]">{stats.totalEnquiries}</p>
                <span className="text-[10px] text-slate-600 font-medium">Buy: {stats.buyEnquiries} | Sell: {stats.sellEnquiries} | Rent: {stats.rentEnquiries}</span>
              </div>

              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-2">
                <span className="text-slate-500 text-xs font-medium block">Total Owners</span>
                <p className="text-3xl font-serif font-bold text-emerald-800">{stats.totalOwners}</p>
                <span className="text-[10px] text-emerald-800 font-bold">Registered NRI Owners</span>
              </div>

            </div>

            {/* Pending Approvals Table */}
            {pendingProps.length > 0 && (
              <div className="bg-[#FDFBF7] border border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif font-bold text-lg text-[#0F172A]">Pending Property Approvals</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-slate-500 uppercase text-[10px]">
                        <th className="py-2">Title</th>
                        <th className="py-2">Type</th>
                        <th className="py-2">Location</th>
                        <th className="py-2">Submitted By</th>
                        <th className="py-2">Duplicate Check</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {pendingProps.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 font-serif font-bold text-slate-900">{p.title}</td>
                          <td className="py-3">{p.type} ({p.category})</td>
                          <td className="py-3">{p.location}, {p.city}</td>
                          <td className="py-3">{p.ownerName || p.ownerEmail || 'Owner'}</td>
                          <td className="py-3">
                            {p.isDuplicateFlagged ? (
                              <span className="text-[10px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold">Possible Duplicate</span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">Clear</span>
                            )}
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => handleApproveProperty(p.id)}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-800"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectProperty(p.id)}
                              className="px-2.5 py-1 bg-rose-700 text-white rounded font-bold hover:bg-rose-800"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 2. PROPERTIES TAB */}
        {activeTab === 'properties' && (() => {
          const filteredProperties = properties.filter((p) => {
            const q = propertySearchQuery.toLowerCase().trim();
            const matchesSearch =
              !q ||
              p.title.toLowerCase().includes(q) ||
              p.city.toLowerCase().includes(q) ||
              p.location.toLowerCase().includes(q) ||
              (p.ownerName && p.ownerName.toLowerCase().includes(q)) ||
              p.id.toLowerCase().includes(q);

            const matchesStatus = propertyStatusFilter === 'All' || p.status === propertyStatusFilter;
            const matchesCategory = propertyCategoryFilter === 'All' || p.category === propertyCategoryFilter;
            const matchesCity = propertyCityFilter === 'All' || p.city === propertyCityFilter;

            return matchesSearch && matchesStatus && matchesCategory && matchesCity;
          });

          const uniqueCities = Array.from(new Set(properties.map((p) => p.city).filter(Boolean)));

          return (
            <div className="space-y-6">
              {/* Summary Metrics Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    <span>Total Portfolio</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">{properties.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Registered Estates & Units</div>
                </div>

                <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Active Managed</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-emerald-900 mt-1">
                    {properties.filter((p) => p.status === 'Under Management').length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Under Fiduciary Protocol</div>
                </div>

                <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-semibold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Pending Approval</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-900 mt-1">
                    {properties.filter((p) => p.status === 'Pending Review' || p.status === 'Pending Approval').length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Submissions Awaiting Verification</div>
                </div>

                <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-4 shadow-2xs">
                  <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                    <span>Verified Badged</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#0F172A] mt-1">
                    {properties.filter((p) => p.verified).length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Clear Legal & Title Dossier</div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-5 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#0F172A]">Properties Registry & Portfolio Control</h2>
                    <p className="text-slate-500 text-xs">Full administrative property inventory management, status transitions, and audit logs.</p>
                  </div>
                  <button
                    onClick={() => onNavigate('/sell/submit')}
                    className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <PlusCircle className="w-4 h-4 text-[#C5A059]" />
                    <span>Register New Property</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search title, city, owner..."
                      value={propertySearchQuery}
                      onChange={(e) => setPropertySearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <select
                      value={propertyCategoryFilter}
                      onChange={(e) => setPropertyCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Management">NRI Property Management</option>
                      <option value="Buy">For Sale (Buy)</option>
                      <option value="Sell">Sell Submissions</option>
                      <option value="Rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={propertyStatusFilter}
                      onChange={(e) => setPropertyStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059]"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Under Management">Under Management</option>
                      <option value="Available">Available / Active</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rented">Rented</option>
                      <option value="Sold">Sold</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={propertyCityFilter}
                      onChange={(e) => setPropertyCityFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059]"
                    >
                      <option value="All">All Cities</option>
                      {uniqueCities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(propertySearchQuery || propertyStatusFilter !== 'All' || propertyCategoryFilter !== 'All' || propertyCityFilter !== 'All') && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Filtered count: {filteredProperties.length} properties</span>
                    <button
                      onClick={() => {
                        setPropertySearchQuery('');
                        setPropertyStatusFilter('All');
                        setPropertyCategoryFilter('All');
                        setPropertyCityFilter('All');
                      }}
                      className="text-[11px] text-[#C5A059] font-bold hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Table Registry */}
              <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#F4EFE6] border-b border-[#EADFC9] text-slate-700 uppercase text-[10px] tracking-wider font-bold">
                        <th className="py-3 px-4">Asset</th>
                        <th className="py-3 px-3">Type & Category</th>
                        <th className="py-3 px-3">Location & City</th>
                        <th className="py-3 px-3">NRI Owner</th>
                        <th className="py-3 px-3">Verified</th>
                        <th className="py-3 px-3">Management Status</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EADFC9]">
                      {filteredProperties.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No properties matching specified criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProperties.map((p) => (
                          <tr key={p.id} className="hover:bg-amber-50/40 transition">
                            <td className="py-3 px-4 font-serif font-bold text-slate-900">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80'}
                                  alt={p.title}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <div className="font-serif font-bold text-slate-900 leading-snug">{p.title}</div>
                                  <div className="text-[10px] text-[#C5A059] font-bold mt-0.5">{p.priceFormat || p.price}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-800 border border-slate-200">
                                {p.type} • {p.category}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-slate-800 font-medium">{p.location}</div>
                              <div className="text-slate-400 text-[10px]">{p.city}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="text-slate-800 font-semibold">{p.ownerName || 'NRI Owner'}</div>
                              <div className="text-slate-400 text-[10px]">{p.ownerPhone || 'No contact'}</div>
                            </td>
                            <td className="py-3 px-3">
                              <button
                                onClick={() => handleToggleVerified(p)}
                                title="Click to toggle verified status"
                                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition ${
                                  p.verified
                                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                <BadgeCheck className={`w-3 h-3 ${p.verified ? 'text-blue-600' : 'text-slate-400'}`} />
                                {p.verified ? 'Verified' : 'Unverified'}
                              </button>
                            </td>
                            <td className="py-3 px-3">
                              <select
                                value={p.status}
                                onChange={(e) => handleQuickStatusChange(p.id, e.target.value)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-hidden cursor-pointer ${
                                  p.status === 'Under Management'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : p.status === 'Pending Review' || p.status === 'Pending Approval'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : p.status === 'Approved' || p.status === 'Available'
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="Approved">Approved</option>
                                <option value="Under Management">Under Management</option>
                                <option value="Available">Available</option>
                                <option value="Rented">Rented</option>
                                <option value="Sold">Sold</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onViewPropertyDetails(p.id)}
                                  title="Preview Property"
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleOpenEditProperty(p)}
                                  title="Edit Property Details"
                                  className="p-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg transition"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setSelectedPropertyForTimeline(p)}
                                  title="Inspection & Timeline Audit Vault"
                                  className="px-2 py-1 bg-[#C5A059] hover:bg-amber-600 text-[#0F172A] font-bold rounded-lg text-[10px] transition flex items-center gap-1"
                                >
                                  <Clock className="w-3 h-3" />
                                  Log
                                </button>

                                <button
                                  onClick={() => handleDeleteProp(p.id)}
                                  title="Delete Property"
                                  className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Timeline & Audit Log Modal */}
        {selectedPropertyForTimeline && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold bg-[#F3EFE6] px-2 py-0.5 rounded text-slate-800 uppercase">
                    Audit Vault
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#0F172A] mt-1">
                    Inspection Timeline: {selectedPropertyForTimeline.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPropertyForTimeline(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* View Existing Logs */}
              {selectedPropertyForTimeline.timeline && selectedPropertyForTimeline.timeline.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Past Audit History</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedPropertyForTimeline.timeline.map((entry, idx) => (
                      <div key={entry.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{entry.title}</span>
                          <span className="text-[10px] text-slate-400">{entry.date}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{entry.description}</p>
                        <div className="text-[10px] text-[#C5A059] font-semibold">Author: {entry.author || 'Lala NRI Admin'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Audit Form */}
              <form onSubmit={handleAddTimeline} className="space-y-3 pt-2 border-t">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Log New Site Audit / Event</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Audit Category</label>
                    <select
                      value={timelineCategory}
                      onChange={(e) => setTimelineCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                    >
                      <option value="Inspection">Physical Inspection</option>
                      <option value="Maintenance">Routine Maintenance</option>
                      <option value="Tenant">Tenant Audit</option>
                      <option value="Document">Tax / Title Document</option>
                      <option value="Listing">Market Listing Update</option>
                      <option value="Management">Management Milestone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Title / Milestone</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q3 Physical Site Inspection"
                      value={timelineTitle}
                      onChange={(e) => setTimelineTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Inspection Findings & Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide full audit details for owner dossier..."
                    value={timelineDesc}
                    onChange={(e) => setTimelineDesc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyForTimeline(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Save Log to Owner Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Property Modal */}
        {editingProperty && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0F172A]">
                  Edit Property Listing: {editingProperty.title}
                </h3>
                <button
                  onClick={() => setEditingProperty(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditProperty} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title</label>
                    <input
                      type="text"
                      required
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Price / Rent Display</label>
                    <input
                      type="text"
                      required
                      value={editFormData.priceFormat || editFormData.price || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, priceFormat: e.target.value, price: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={editFormData.category || 'Management'}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value="Management">Management Only</option>
                      <option value="Buy">Buy / For Sale</option>
                      <option value="Rent">Rent / Lease</option>
                      <option value="Sell">Sell Submission</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={editFormData.type || 'Villa'}
                      onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Plot">Plot / Land</option>
                      <option value="Farmland">Farmland</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={editFormData.city || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Locality / Address</label>
                    <input
                      type="text"
                      required
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={editFormData.bedrooms || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, bedrooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={editFormData.bathrooms || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, bathrooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sq.ft)</label>
                    <input
                      type="number"
                      value={editFormData.areaSqFt || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, areaSqFt: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing Status</label>
                    <select
                      value={editFormData.furnishingStatus || 'Unfurnished'}
                      onChange={(e) => setEditFormData({ ...editFormData, furnishingStatus: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                    >
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Fully Furnished">Fully Furnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={editFormData.status || 'Under Management'}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-bold"
                    >
                      <option value="Under Management">Under Management</option>
                      <option value="Available">Available</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rented">Rented</option>
                      <option value="Sold">Sold</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Contact Phone</label>
                    <input
                      type="text"
                      value={editFormData.ownerPhone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, ownerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editVerified"
                    checked={editFormData.verified ?? true}
                    onChange={(e) => setEditFormData({ ...editFormData, verified: e.target.checked })}
                    className="w-4 h-4 text-[#C5A059] rounded"
                  />
                  <label htmlFor="editVerified" className="text-xs font-bold text-slate-800 flex items-center gap-1 cursor-pointer">
                    <BadgeCheck className="w-4 h-4 text-blue-600" />
                    Verified Property Dossier (Attach Verified Stamp)
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Media Gallery</label>
                  <ImageUploadDropzone
                    images={editFormData.images || []}
                    onChange={(newImages) => setEditFormData({ ...editFormData, images: newImages })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProperty}
                    className="px-6 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                  >
                    {isSavingProperty ? 'Saving...' : 'Save Property Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. OWNERS TAB */}
        {activeTab === 'owners' && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0F172A]">Registered NRI Owners</h2>
                <p className="text-xs text-slate-600">Global NRI property owners registered on Lala NRI Realty platform.</p>
              </div>
              <button
                onClick={() => {
                  setAdminFormMode('promote');
                  setShowAddAdminModal(true);
                }}
                className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Promote Owner to Admin</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Country</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Account Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.filter((u) => u.role === 'PROPERTY_OWNER').map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 font-serif font-bold text-slate-900">{u.fullName}</td>
                      <td className="py-3">{u.email}</td>
                      <td className="py-3">{u.phone || 'N/A'}</td>
                      <td className="py-3">{u.country || 'N/A'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-slate-100 text-slate-700">
                          NRI Owner
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.status === 'active' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setAdminFormMode('promote');
                            setAdminFormData({
                              ...adminFormData,
                              promoteUserId: u.id,
                              fullName: u.fullName,
                              email: u.email
                            });
                            setShowAddAdminModal(true);
                          }}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-semibold text-[10px]"
                        >
                          Make Admin
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className="px-2.5 py-1 bg-slate-800 text-white rounded font-medium text-[11px]"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. ADMIN TEAM & ACCESS TAB */}
        {activeTab === 'admins' && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-700" />
                  <h2 className="text-xl font-serif font-bold text-[#0F172A]">Administrator Team & Access Control</h2>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Manage team members who have permission to review listings, manage property vaults, and view buyer enquiries.
                </p>
              </div>

              <button
                onClick={() => {
                  setAdminFormMode('create');
                  setShowAddAdminModal(true);
                }}
                className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-[#C5A059]" />
                <span>Add Administrator</span>
              </button>
            </div>

            {/* Quick Policy Notice */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
              <Shield className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Admin Governance & Security</p>
                <p className="text-amber-800 mt-0.5">
                  Administrators have full operational access to the Lala NRI Realty console. To revoke access, use the "Remove Admin" button. The primary Super Administrator (<code className="font-mono bg-amber-100 px-1 rounded">admin@lalanri.com</code>) cannot be deleted.
                </p>
              </div>
            </div>

            {/* Admin Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Administrator</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Country</th>
                    <th className="py-2">Access Tier</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {admins.map((adm) => {
                    const isSuperAdmin = adm.id === 'user-admin-1' || adm.email.toLowerCase() === 'admin@lalanri.com';
                    const isCurrentUser = user?.id === adm.id || user?.email.toLowerCase() === adm.email.toLowerCase();

                    return (
                      <tr key={adm.id} className="hover:bg-amber-50/30 transition">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-bold text-xs shrink-0">
                              {adm.fullName ? adm.fullName.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-serif font-bold text-slate-900">{adm.fullName}</span>
                                {isCurrentUser && (
                                  <span className="bg-emerald-100 text-emerald-900 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 block">ID: {adm.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 font-medium text-slate-800">{adm.email}</td>
                        <td className="py-3.5 text-slate-600">{adm.phone || '+91 98765 43210'}</td>
                        <td className="py-3.5 text-slate-600">{adm.country || 'India'}</td>
                        <td className="py-3.5">
                          {isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-purple-100 text-purple-900 border border-purple-200">
                              <Shield className="w-3 h-3 text-purple-700" />
                              Super Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-100 text-blue-900 border border-blue-200">
                              <ShieldCheck className="w-3 h-3 text-blue-700" />
                              Administrator
                            </span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-900">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          {isSuperAdmin ? (
                            <span className="text-[10px] text-slate-400 font-medium italic pr-2">
                              Primary Root
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRemoveAdminUser(adm)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-[11px] transition inline-flex items-center gap-1"
                              title="Revoke administrator privileges"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove Admin</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add / Promote Admin Modal */}
        {showAddAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-[#EADFC9] pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-serif font-bold text-lg text-[#0F172A]">
                    {adminFormMode === 'create' ? 'Add New Administrator' : 'Promote Owner to Administrator'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddAdminModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#EADFC9]/40 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAdminFormMode('create')}
                  className={`py-1.5 rounded-lg transition ${adminFormMode === 'create' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-700 hover:bg-white/50'}`}
                >
                  Create New Admin
                </button>
                <button
                  type="button"
                  onClick={() => setAdminFormMode('promote')}
                  className={`py-1.5 rounded-lg transition ${adminFormMode === 'promote' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-700 hover:bg-white/50'}`}
                >
                  Promote Registered User
                </button>
              </div>

              <form onSubmit={handleCreateOrPromoteAdmin} className="space-y-4 text-xs">
                {adminFormMode === 'create' ? (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Administrator Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Sharma"
                        value={adminFormData.fullName}
                        onChange={(e) => setAdminFormData({ ...adminFormData, fullName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Admin Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. vikram@lalanri.com"
                        value={adminFormData.email}
                        onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={adminFormData.phone}
                          onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-800 mb-1">Country</label>
                        <input
                          type="text"
                          placeholder="India"
                          value={adminFormData.country}
                          onChange={(e) => setAdminFormData({ ...adminFormData, country: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Initial Password (Optional, default: admin123)</label>
                      <input
                        type="text"
                        placeholder="admin123"
                        value={adminFormData.password}
                        onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">The new admin can use this password to log in via the Login page.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Select Registered Owner Account *</label>
                      <select
                        required
                        value={adminFormData.promoteUserId}
                        onChange={(e) => {
                          const selected = users.find((u) => u.id === e.target.value);
                          setAdminFormData({
                            ...adminFormData,
                            promoteUserId: e.target.value,
                            fullName: selected?.fullName || '',
                            email: selected?.email || '',
                          });
                        }}
                        className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs"
                      >
                        <option value="">-- Choose an Owner Profile --</option>
                        {users.filter((u) => u.role !== 'ADMIN').map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.fullName} ({u.email}) - {u.country || 'NRI'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 mb-1">Set / Update Admin Password (Optional)</label>
                      <input
                        type="text"
                        placeholder="Leave blank to retain current password or use admin123"
                        value={adminFormData.password}
                        onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#EADFC9] rounded-xl focus:ring-1 focus:ring-[#C5A059] outline-hidden text-xs font-mono"
                      />
                    </div>
                  </>
                )}

                <div className="pt-3 border-t border-[#EADFC9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAdmin}
                    className="px-5 py-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    {isSubmittingAdmin ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>{adminFormMode === 'create' ? 'Create Admin Account' : 'Grant Admin Privileges'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="text-xl font-serif font-bold text-[#0F172A]">Customer & Investor Enquiries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Date</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Property Ref</th>
                    <th className="py-2">Preferred Contact</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {enquiries.map((e) => (
                    <tr key={e.id}>
                      <td className="py-3 text-slate-500">{e.createdAt.split('T')[0]}</td>
                      <td className="py-3 font-bold text-slate-900">{e.name} ({e.country})</td>
                      <td className="py-3"><span className="px-2 py-0.5 bg-slate-100 rounded">{e.enquiryType}</span></td>
                      <td className="py-3 truncate max-w-[150px]">{e.propertyTitle || 'General'}</td>
                      <td className="py-3 font-semibold text-emerald-800">{e.preferredContact}</td>
                      <td className="py-3"><span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">{e.status}</span></td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedEnquiry(e);
                            setEnquiryNotes(e.adminNotes || '');
                          }}
                          className="px-2.5 py-1 bg-[#0F172A] text-white rounded text-[11px] font-bold"
                        >
                          Manage Enquiry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Enquiry Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#0F172A]">
                Enquiry Details: {selectedEnquiry.name}
              </h3>
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <p><strong>Email:</strong> {selectedEnquiry.email}</p>
                <p><strong>Phone:</strong> {selectedEnquiry.phone}</p>
                <p><strong>Country:</strong> {selectedEnquiry.country}</p>
                <p><strong>Preferred Contact:</strong> {selectedEnquiry.preferredContact}</p>
                <p><strong>Message:</strong> {selectedEnquiry.message}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Admin Resolution Notes</label>
                <textarea
                  rows={2}
                  value={enquiryNotes}
                  onChange={(e) => setEnquiryNotes(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, 'Contacted')}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded text-xs font-bold"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, 'Completed')}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded text-xs font-bold"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-3 py-1.5 border rounded text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. BUY / SELL / RENT LISTINGS TABS */}
        {(activeTab === 'buyListings' || activeTab === 'sellListings' || activeTab === 'rentListings') && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#0F172A]">
                  {activeTab === 'buyListings' && 'Buy Properties Portfolio (Public & Approved)'}
                  {activeTab === 'sellListings' && 'Sell Submissions & Listing Approvals'}
                  {activeTab === 'rentListings' && 'Rental Inventory & Managed Units'}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeTab === 'sellListings' && 'When you approve a submission here, it automatically goes live on the public Buy / Sell page.'}
                  {activeTab === 'buyListings' && 'Properties published to the global NRI buyer network.'}
                  {activeTab === 'rentListings' && 'Properties under full-service property management.'}
                </p>
              </div>

              {activeTab === 'buyListings' && (
                <button
                  onClick={() => onNavigate('/buy')}
                  className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span>Open Public Buy Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(activeTab === 'buyListings' ? buyListings : activeTab === 'sellListings' ? sellListings : rentListings).map((p) => {
                const isApproved = p.status === 'Approved';
                const isPending = p.status === 'Pending Review';

                return (
                  <div key={p.id} className={`p-4 bg-white border rounded-xl space-y-3 text-xs transition shadow-2xs ${isPending ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-serif font-bold text-sm text-[#0F172A] block">{p.title}</span>
                        <span className="text-[11px] text-slate-500">{p.location}, {p.city}</span>
                      </div>
                      <div>
                        {isApproved ? (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            Live on Buy/Sell
                          </span>
                        ) : isPending ? (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-700" />
                            Pending Approval
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            {p.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Owner</span>
                        <span className="font-medium text-slate-800">{p.ownerName || 'NRI Owner'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Price</span>
                        <span className="font-bold text-emerald-800">
                          {p.currency || '₹'} {p.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onViewPropertyDetails(p.id)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                        {isApproved && (
                          <button
                            onClick={() => onNavigate('/buy')}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-bold text-[11px] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live View</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isPending && (
                          <button
                            onClick={() => handleApproveProperty(p.id)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve & Move to Live Portal</span>
                          </button>
                        )}
                        {isApproved && (
                          <button
                            onClick={() => handleSetUnderManagement(p.id)}
                            className="px-2.5 py-1 bg-[#0F172A] hover:bg-slate-800 text-white rounded font-medium text-[11px]"
                          >
                            Set Under Management
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteProp(p.id)}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-semibold text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. WEBSITE CONTENT TAB */}
        {activeTab === 'content' && siteContent && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs space-y-4 max-w-2xl">
            <h2 className="text-xl font-serif font-bold text-[#0F172A]">Edit Website Content & Contacts</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateSiteContent(siteContent);
                alert('Website content updated!');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Company Phone</label>
                <input
                  type="text"
                  value={siteContent.companyPhone}
                  onChange={(e) => setSiteContent({ ...siteContent, companyPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Company WhatsApp Desk</label>
                <input
                  type="text"
                  value={siteContent.companyWhatsApp}
                  onChange={(e) => setSiteContent({ ...siteContent, companyWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Company Email</label>
                <input
                  type="email"
                  value={siteContent.companyEmail}
                  onChange={(e) => setSiteContent({ ...siteContent, companyEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Office Address</label>
                <textarea
                  rows={2}
                  value={siteContent.officeAddress}
                  onChange={(e) => setSiteContent({ ...siteContent, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-[#0F172A] text-white rounded-xl font-bold">
                Save Content Updates
              </button>
            </form>
          </div>
        )}

        {/* 7. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 shadow-2xs space-y-4 max-w-xl text-xs">
            <h2 className="text-xl font-serif font-bold text-[#0F172A]">System Settings & Governance</h2>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-950">
              <p className="font-bold">Fiduciary Communication Rule Enforced</p>
              <p>Buyers, sellers, renters, and property owners cannot directly chat or access private contact info through the system. All communications route through Lala NRI Realty.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
