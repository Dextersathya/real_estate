import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitProperty, checkDuplicateProperty } from '../lib/api';
import { PropertyType, Category } from '../types';
import { ShieldCheck, AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, Upload, FileText, Building2, Check } from 'lucide-react';
import { ImageUploadDropzone } from '../components/ImageUploadDropzone';

interface PropertySubmissionPageProps {
  onNavigate: (path: string) => void;
}

export const PropertySubmissionPage: React.FC<PropertySubmissionPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [duplicateChecked, setDuplicateChecked] = useState(false);
  const [duplicateResult, setDuplicateResult] = useState<{ isDuplicate: boolean; message: string; matchingPropertyTitle?: string } | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    type: 'Residential' as PropertyType,
    category: 'Sell' as Category,
    title: '',
    description: '',
    city: 'Hyderabad',
    state: 'Telangana',
    location: '',
    pincode: '',
    addressDetails: '',
    areaSqFt: 1800,
    bedrooms: 3,
    bathrooms: 3,
    furnishingStatus: 'Semi-Furnished' as 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished',
    features: ['24/7 Security CCTV', 'Reserved Underground Parking', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'],
    imageInput: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    documentName: 'Title Deed Copy.pdf',
  });

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-[#0F172A] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#0F172A]">Authentication Required</h2>
        <p className="text-slate-600 text-sm">
          Property submission is restricted to authenticated Property Owners to ensure security and prevent fraudulent listings.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onNavigate('/login')}
            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1E293B]"
          >
            Log In Now
          </button>
          <button
            onClick={() => onNavigate('/register')}
            className="border border-[#0F172A] text-[#0F172A] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const handleNextStep = async () => {
    setErrorMessage('');

    if (step === 2 && !formData.title) {
      setErrorMessage('Please enter a descriptive property title.');
      return;
    }
    if (step === 3 && (!formData.location || !formData.city)) {
      setErrorMessage('Please enter property location and city.');
      return;
    }

    // On Step 7 Review -> Run Duplicate Check
    if (step === 6) {
      setLoading(true);
      try {
        const res = await checkDuplicateProperty({
          location: formData.location,
          city: formData.city,
          pincode: formData.pincode,
          title: formData.title,
          addressDetails: formData.addressDetails,
          areaSqFt: formData.areaSqFt,
        });
        setDuplicateResult(res);
        setDuplicateChecked(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    setStep((prev) => Math.min(prev + 1, 8));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitFinal = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const imagesList = formData.images && formData.images.length > 0 ? formData.images : [formData.imageInput];
      const docList = [
        {
          id: `doc-${Date.now()}`,
          name: formData.documentName,
          url: '#',
          dateUploaded: new Date().toISOString().split('T')[0],
          fileType: 'PDF',
        },
      ];

      await submitProperty({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        addressDetails: formData.addressDetails,
        areaSqFt: Number(formData.areaSqFt),
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        furnishingStatus: formData.furnishingStatus,
        features: formData.features,
        images: imagesList,
        documents: docList,
        ownerId: user.id,
        ownerName: user.fullName,
        ownerEmail: user.email,
        ownerPhone: user.phone,
      });

      setSubmittedSuccess(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Property submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-[#FDFBF7] border border-[#EADFC9] rounded-3xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-[#0F172A] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-amber-700" />
        </div>

        <h2 className="text-3xl font-serif font-bold text-[#0F172A]">Property Submitted Successfully</h2>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-2">
          <p className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            Status: Pending Admin Review
          </p>
          <p>
            Your property entry is now in <strong>Pending Admin Review</strong>. Our verification desk will inspect the details and notify you once approved.
          </p>
          {duplicateResult?.isDuplicate && (
            <div className="p-2 bg-rose-100 text-rose-900 font-medium rounded border border-rose-300">
              Note: This property may already exist in our system. Our team will review your submission before publication.
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1E293B]"
          >
            Go to Owner Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stepsList = [
    'Property Type',
    'Basic Info',
    'Location',
    'Details',
    'Images',
    'Documents',
    'Review',
    'Submit',
  ];

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8">
      {/* Header */}
      <div className="bg-[#0F172A] text-white p-6 sm:p-8 rounded-2xl border border-[#C5A059]/40 flex justify-between items-center">
        <div>
          <span className="text-[#C5A059] text-[10px] uppercase font-bold tracking-widest block">
            AUTHENTICATED OWNER SUBMISSION
          </span>
          <h1 className="text-2xl font-serif font-bold text-white">Submit Your Property</h1>
        </div>
        <div className="text-right text-xs text-slate-300">
          <p className="font-semibold text-white">{user.fullName}</p>
          <p className="text-[10px] text-[#C5A059]">PROPERTY_OWNER</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-xl p-4 overflow-x-auto">
        <div className="flex justify-between items-center min-w-[600px] text-xs">
          {stepsList.map((label, idx) => {
            const stepNum = idx + 1;
            const isCurrent = stepNum === step;
            const isCompleted = stepNum < step;

            return (
              <div key={idx} className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isCurrent
                      ? 'bg-[#0F172A] text-[#C5A059] ring-2 ring-[#C5A059]'
                      : isCompleted
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`font-medium ${isCurrent ? 'text-[#0F172A] font-bold' : 'text-slate-500'}`}>
                  {label}
                </span>
                {idx < stepsList.length - 1 && <span className="text-slate-300 mx-1">/</span>}
              </div>
            );
          })}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Form Container */}
      <div className="bg-[#FDFBF7] border border-[#EADFC9] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Step 1: Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 1: Select Property Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Residential', 'Commercial', 'Land', 'Farmland', 'Industrial', 'Investment'] as PropertyType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`p-4 rounded-xl border text-left font-serif font-bold text-sm transition ${
                    formData.type === t
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 2: Basic Information</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
              <input
                type="text"
                placeholder="e.g. Jubilee Hills Luxury 4-BHK Villa"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Purpose</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Sell">For Sale (Sell)</option>
                <option value="Rent">For Rent (Rent)</option>
                <option value="Management">NRI Property Management Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Provide details about condition, view, accessibility, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 3: Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="e.g. Telangana"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Locality / Sector *</label>
              <input
                type="text"
                placeholder="e.g. Jubilee Hills, Road No. 36"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  placeholder="500033"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address Details (Internal Confidential)</label>
                <input
                  type="text"
                  placeholder="e.g. House No. 412, Lane 3"
                  value={formData.addressDetails}
                  onChange={(e) => setFormData({ ...formData, addressDetails: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Details */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 4: Property Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Area (sq. ft.) *</label>
                <input
                  type="number"
                  value={formData.areaSqFt}
                  onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing Status</label>
              <select
                value={formData.furnishingStatus}
                onChange={(e) => setFormData({ ...formData, furnishingStatus: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 5: Images */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 5: High-Resolution Photography</h3>
            <ImageUploadDropzone
              images={formData.images || []}
              onChange={(newImages) => setFormData({
                ...formData,
                images: newImages,
                imageInput: newImages[0] || '',
              })}
              label="Property Media & Photography"
              description="Upload local photos, drag and drop files, paste images directly from your clipboard (Ctrl+V / Cmd+V), or select sample photography."
            />
          </div>
        )}

        {/* Step 6: Documents */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 6: Title & Property Documents</h3>
            <p className="text-slate-600 text-xs">Specify document copy name for verification vault.</p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document File Name</label>
              <input
                type="text"
                value={formData.documentName}
                onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>
        )}

        {/* Step 7: Review & Duplicate Check */}
        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#0F172A]">Step 7: Verification & Duplicate Check</h3>

            {duplicateResult?.isDuplicate ? (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Possible Duplicate Property Detected</span>
                </div>
                <p className="font-semibold text-amber-900">
                  "This property may already exist in our system. Our team will review your submission before publication."
                </p>
                <p className="text-slate-600">
                  Matching listing identified: <strong>{duplicateResult.matchingPropertyTitle}</strong>. Your submission will proceed to <strong>Pending Admin Review</strong>.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>No duplicate properties found. Ready for submission.</span>
              </div>
            )}

            <div className="p-4 bg-slate-50 border rounded-xl text-xs space-y-2 text-slate-700">
              <p><strong>Title:</strong> {formData.title}</p>
              <p><strong>Type:</strong> {formData.type} ({formData.category})</p>
              <p><strong>Location:</strong> {formData.location}, {formData.city}</p>
              <p><strong>Area:</strong> {formData.areaSqFt} sq. ft.</p>
              <p><strong>Owner:</strong> {user.fullName} ({user.email})</p>
            </div>
          </div>
        )}

        {/* Step 8: Submit Confirmation */}
        {step === 8 && (
          <div className="space-y-4 text-center py-4">
            <h3 className="text-2xl font-serif font-bold text-[#0F172A]">Final Step: Confirm Submission</h3>
            <p className="text-slate-600 text-xs max-w-md mx-auto">
              By submitting, your property will enter <strong>Pending Admin Review</strong> status. No prices will be exposed publicly.
            </p>

            <button
              onClick={handleSubmitFinal}
              disabled={loading}
              className="bg-[#0F172A] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#1E293B] transition shadow-lg border border-[#C5A059]/40"
            >
              {loading ? 'Submitting Property...' : 'Confirm & Submit to Admin Review'}
            </button>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-[#EADFC9]">
          <button
            onClick={handlePrevStep}
            disabled={step === 1}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 disabled:opacity-40"
          >
            Previous
          </button>

          {step < 8 && (
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-[#0F172A] text-white rounded-lg text-xs font-semibold hover:bg-[#1E293B] flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
