"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitProperty } from "@/actions/properties";

const CATEGORIES = [
  { value: "residential", label: "Residential" },
  { value: "commercial_building", label: "Commercial Building" },
  { value: "commercial_land", label: "Commercial Land" },
  { value: "farmland", label: "Farmland" },
  { value: "agricultural_land", label: "Agricultural Land" },
  { value: "industrial", label: "Industrial" },
] as const;

const PURPOSES = [
  { value: "buy", label: "For Sale / Buy" },
  { value: "rent", label: "For Rent" },
  { value: "manage_only", label: "Manage My Property" },
] as const;

const FEATURES = [
  "24/7 Security CCTV", "Power Backup", "Reserved Parking", "Lift/Elevator",
  "Swimming Pool", "Gym", "Smart Home Automation", "Solar Power",
  "Borewell", "Club House", "Landscaped Garden", "CCTV Surveillance",
];

type FormState = {
  category: string;
  purpose: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  pincode: string;
  area: string;
  areaUnit: string;
  bedrooms: string;
  bathrooms: string;
  furnishingStatus: string;
  selectedFeatures: string[];
  imageUrls: string[];
};

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    category: "residential",
    purpose: "manage_only",
    title: "",
    description: "",
    location: "",
    city: "",
    state: "Telangana",
    pincode: "",
    area: "",
    areaUnit: "sqft",
    bedrooms: "",
    bathrooms: "",
    furnishingStatus: "",
    selectedFeatures: [],
    imageUrls: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");

  const toggleFeature = (f: string) => {
    setForm((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(f)
        ? prev.selectedFeatures.filter((x) => x !== f)
        : [...prev.selectedFeatures, f],
    }));
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, imageUrlInput.trim()] }));
      setImageUrlInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitProperty({
      category: form.category as "residential" | "commercial_building" | "commercial_land" | "farmland" | "agricultural_land" | "industrial",
      purpose: form.purpose as "buy" | "rent" | "manage_only",
      title: form.title,
      description: form.description,
      location: form.location,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      area: parseInt(form.area) || 0,
      areaUnit: form.areaUnit,
      bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? parseInt(form.bathrooms) : undefined,
      furnishingStatus: form.furnishingStatus || undefined,
      features: form.selectedFeatures,
      imageUrls: form.imageUrls,
    });

    setLoading(false);
    if (!result.success) { setError(result.error || "Failed to submit."); return; }
    router.push("/dashboard");
  };

  const InputClass = "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A059]/50 focus:ring-1 focus:ring-[#C5A059]/30 transition";

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <div className="fixed top-0 left-0 h-full w-64 bg-[#0A1120] border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-[#C5A059] font-bold text-lg">Lala NRI Realty</Link>
          <p className="text-xs text-slate-500 mt-1">Owner Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/[0.03] hover:text-white text-sm transition-all">
            <span>🏠</span> My Properties
          </Link>
          <Link href="/dashboard/properties/new" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.05] text-white text-sm font-medium">
            <span>➕</span> Submit Property
          </Link>
        </nav>
      </div>

      <div className="ml-64 p-8 max-w-3xl">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to Dashboard</Link>
          <h1 className="text-2xl font-bold mt-3">Submit New Property</h1>
          <p className="text-slate-400 text-sm mt-1">Your property will be reviewed by our admin team before being published.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-base">Property Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]/50 transition">
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Purpose *</label>
                <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]/50 transition">
                  {PURPOSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Property Title *</label>
              <input type="text" required placeholder="e.g. Luxury 4BHK Villa at Jubilee Hills" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} className={InputClass} />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Description</label>
              <textarea rows={4} placeholder="Describe your property..." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={InputClass + " resize-none"} />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-base">Location</h2>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Street / Area *</label>
              <input type="text" required placeholder="e.g. Jubilee Hills, Road No. 36" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} className={InputClass} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">City *</label>
                <input type="text" required placeholder="City" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })} className={InputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">State</label>
                <input type="text" placeholder="State" value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })} className={InputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Pincode</label>
                <input type="text" placeholder="500033" value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={InputClass} />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-base">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Area *</label>
                <input type="number" required placeholder="1000" value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })} className={InputClass} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Unit</label>
                <select value={form.areaUnit} onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition">
                  <option value="sqft">sq ft</option>
                  <option value="sqyd">sq yards</option>
                  <option value="acres">acres</option>
                  <option value="sqm">sq meters</option>
                </select>
              </div>
            </div>
            {form.category === "residential" && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Bedrooms</label>
                  <input type="number" min={1} max={20} placeholder="4" value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} className={InputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Bathrooms</label>
                  <input type="number" min={1} max={20} placeholder="4" value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} className={InputClass} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Furnishing</label>
                  <select value={form.furnishingStatus} onChange={(e) => setForm({ ...form, furnishingStatus: e.target.value })}
                    className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition">
                    <option value="">Not specified</option>
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-base">Features & Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <button type="button" key={f} onClick={() => toggleFeature(f)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-all ${form.selectedFeatures.includes(f) ? "bg-[#C5A059]/20 border-[#C5A059]/50 text-[#C5A059]" : "bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20"}`}>
                  {form.selectedFeatures.includes(f) ? "✓ " : ""}{f}
                </button>
              ))}
            </div>
          </div>

          {/* Image URLs */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-base">Property Images</h2>
            <p className="text-xs text-slate-500">Paste image URLs (Unsplash links work great for testing). File upload will be added after Neon Object Storage is configured.</p>
            <div className="flex gap-2">
              <input type="url" placeholder="https://images.unsplash.com/..." value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                className={InputClass + " flex-1"} />
              <button type="button" onClick={addImageUrl}
                className="bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 px-4 rounded-xl hover:bg-[#C5A059]/30 transition-all text-sm font-medium">
                Add
              </button>
            </div>
            {form.imageUrls.length > 0 && (
              <div className="space-y-2">
                {form.imageUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.02] rounded-lg px-3 py-2">
                    <span className="flex-1 text-xs text-slate-400 truncate">{url}</span>
                    <button type="button" onClick={() => setForm((p) => ({ ...p, imageUrls: p.imageUrls.filter((_, j) => j !== i) }))}
                      className="text-red-400 text-xs hover:text-red-300">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</p>}

          <div className="flex gap-4">
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#C5A059] text-[#0F172A] py-4 rounded-xl font-bold hover:bg-[#D4B06A] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Submitting..." : "Submit for Admin Review"}
            </button>
            <Link href="/dashboard" className="px-6 py-4 border border-white/10 rounded-xl text-sm text-slate-400 hover:border-white/20 hover:text-white transition-all text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
