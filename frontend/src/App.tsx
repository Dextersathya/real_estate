import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ManagementPage } from './pages/ManagementPage';
import { BuyPage } from './pages/BuyPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { SellPage } from './pages/SellPage';
import { PropertySubmissionPage } from './pages/PropertySubmissionPage';
import { RentPage } from './pages/RentPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OtpVerificationPage } from './pages/OtpVerificationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  
  // Enquiry Modal state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryTitle, setEnquiryTitle] = useState<string | undefined>(undefined);
  const [enquiryType, setEnquiryType] = useState<string>('General');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (propertyTitle?: string, defaultType: string = 'General') => {
    setEnquiryTitle(propertyTitle);
    setEnquiryType(defaultType);
    setEnquiryOpen(true);
  };

  // Render Page Component
  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onOpenEnquiry={handleOpenEnquiry}
          onViewProperty={(id) => navigate(`/property/${id}`)}
        />
      );
    }

    if (currentPath === '/about') {
      return (
        <AboutPage
          onNavigate={navigate}
          onOpenEnquiry={() => handleOpenEnquiry(undefined, 'General')}
        />
      );
    }

    if (currentPath === '/management') {
      return (
        <ManagementPage
          onNavigate={navigate}
          onOpenEnquiry={(title, type) => handleOpenEnquiry(title, type || 'Management')}
        />
      );
    }

    if (currentPath === '/buy') {
      return (
        <BuyPage
          onViewProperty={(id) => navigate(`/property/${id}`)}
          onOpenEnquiry={(title, type) => handleOpenEnquiry(title, type || 'Buy')}
        />
      );
    }

    if (currentPath.startsWith('/property/')) {
      const id = currentPath.replace('/property/', '');
      return (
        <PropertyDetailsPage
          propertyId={id}
          onBack={() => navigate('/buy')}
          onOpenEnquiry={(title, type) => handleOpenEnquiry(title, type || 'Buy')}
        />
      );
    }

    if (currentPath === '/sell') {
      return (
        <SellPage
          onNavigate={navigate}
          onOpenEnquiry={(title, type) => handleOpenEnquiry(title, type || 'Sell')}
        />
      );
    }

    if (currentPath === '/sell/submit') {
      return <PropertySubmissionPage onNavigate={navigate} />;
    }

    if (currentPath === '/rent') {
      return (
        <RentPage
          onViewProperty={(id) => navigate(`/property/${id}`)}
          onOpenEnquiry={(title, type) => handleOpenEnquiry(title, type || 'Rent')}
        />
      );
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }

    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }

    if (currentPath === '/verify-otp') {
      return <OtpVerificationPage onNavigate={navigate} />;
    }

    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }

    if (currentPath === '/verify-email') {
      return <EmailVerificationPage onNavigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return (
        <OwnerDashboardPage
          onNavigate={navigate}
          onOpenEnquiry={(title, type) => handleOpenEnquiry(title, type)}
          onViewPropertyDetails={(id) => navigate(`/property/${id}`)}
        />
      );
    }

    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      let initialTab: 'dashboard' | 'properties' | 'owners' | 'buyListings' | 'sellListings' | 'rentListings' | 'enquiries' | 'content' | 'settings' = 'dashboard';
      if (currentPath.includes('/properties')) initialTab = 'properties';
      else if (currentPath.includes('/owners')) initialTab = 'owners';
      else if (currentPath.includes('/enquiries')) initialTab = 'enquiries';
      else if (currentPath.includes('/content')) initialTab = 'content';
      else if (currentPath.includes('/settings')) initialTab = 'settings';

      return (
        <AdminDashboardPage
          initialTab={initialTab}
          onNavigate={navigate}
          onViewPropertyDetails={(id) => navigate(`/property/${id}`)}
        />
      );
    }

    return <NotFoundPage onNavigate={navigate} />;
  };

  // Hide Navbar and Footer on full-bleed dashboards if desired, or keep them for clean navigation
  const isDashboardRoute = currentPath === '/dashboard' || currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-slate-900 font-sans antialiased selection:bg-[#C5A059] selection:text-[#0F172A]">
      {!isDashboardRoute && <Navbar currentPath={currentPath} onNavigate={navigate} />}

      <div className="flex-1">
        {renderPage()}
      </div>

      {!isDashboardRoute && (
        <Footer
          onNavigate={navigate}
          onOpenEnquiry={() => handleOpenEnquiry(undefined, 'General')}
        />
      )}

      {/* Global Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        propertyTitle={enquiryTitle}
        defaultEnquiryType={enquiryType}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
