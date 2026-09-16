import React from 'react';
import { Building2, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto my-20 px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-[#0F172A] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md">
        <Building2 className="w-8 h-8 stroke-[2]" />
      </div>
      <h1 className="text-4xl font-serif font-bold text-[#0F172A]">404</h1>
      <h2 className="text-xl font-serif font-bold text-[#0F172A]">Page Not Found</h2>
      <p className="text-slate-600 text-xs leading-relaxed">
        The page or property dossier you requested could not be located in our registry.
      </p>
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1E293B] border border-[#C5A059]/40"
      >
        <Home className="w-4 h-4 text-[#C5A059]" />
        <span>Return to Homepage</span>
      </button>
    </div>
  );
};
