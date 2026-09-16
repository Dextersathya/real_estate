import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/EnquiryForm";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [prop] = await db.select({ title: properties.title, city: properties.city }).from(properties)
    .where(and(eq(properties.id, id), eq(properties.purpose, "rent"), eq(properties.status, "published"))).limit(1);
  if (!prop) return { title: "Property Not Found" };
  return { title: `${prop.title} — ${prop.city} | For Rent` };
}

export default async function RentPropertyDetailPage({ params }: Props) {
  const { id } = await params;

  const [prop] = await db.select({
    id: properties.id, title: properties.title, description: properties.description,
    category: properties.category, city: properties.city, state: properties.state,
    location: properties.location, area: properties.area, areaUnit: properties.areaUnit,
    bedrooms: properties.bedrooms, bathrooms: properties.bathrooms,
    furnishingStatus: properties.furnishingStatus, features: properties.features,
    occupancy: properties.occupancy,
  }).from(properties)
    .where(and(eq(properties.id, id), eq(properties.purpose, "rent"), eq(properties.status, "published")))
    .limit(1);

  if (!prop) notFound();

  const images = await db.select({ url: propertyImages.url }).from(propertyImages)
    .where(eq(propertyImages.propertyId, id)).orderBy(propertyImages.sortOrder);

  const features = Array.isArray(prop.features) ? prop.features : [];

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl">Lala NRI Realty</Link>
          <Link href="/rent" className="text-sm text-slate-400 hover:text-white transition-colors">← Back to Rent</Link>
        </div>
      </nav>
      <div className="pt-24 pb-20 px-6 max-w-6xl mx-auto">
        {images.length > 0 && (
          <div className={`grid gap-3 mb-8 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image src={images[0].url} alt={prop.title} fill className="object-cover" sizes="50vw" priority />
            </div>
            {images.length > 1 && (
              <div className="grid grid-rows-2 gap-3">
                {images.slice(1, 3).map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden">
                    <Image src={img.url} alt={`${prop.title} ${i + 2}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-[#C5A059]/20 text-[#C5A059] px-2 py-1 rounded-full font-semibold">{prop.category.replace(/_/g, " ")}</span>
                {prop.occupancy === "vacant" && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Available</span>}
              </div>
              <h1 className="text-3xl font-bold">{prop.title}</h1>
              <p className="text-slate-400 mt-1">📍 {prop.location}, {prop.city}{prop.state ? `, ${prop.state}` : ""}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-xs text-slate-500 mb-1">Area</p><p className="font-semibold">{prop.area.toLocaleString()} {prop.areaUnit}</p></div>
              {prop.bedrooms && <div><p className="text-xs text-slate-500 mb-1">Bedrooms</p><p className="font-semibold">{prop.bedrooms} BHK</p></div>}
              {prop.bathrooms && <div><p className="text-xs text-slate-500 mb-1">Bathrooms</p><p className="font-semibold">{prop.bathrooms}</p></div>}
              {prop.furnishingStatus && <div><p className="text-xs text-slate-500 mb-1">Furnishing</p><p className="font-semibold">{prop.furnishingStatus}</p></div>}
            </div>
            {prop.description && <div><h2 className="text-lg font-semibold mb-3">About this Property</h2><p className="text-slate-400 leading-relaxed">{prop.description}</p></div>}
            {features.length > 0 && (
              <div><h2 className="text-lg font-semibold mb-3">Features & Amenities</h2>
                <div className="flex flex-wrap gap-2">{features.map((f) => <span key={f} className="bg-white/[0.05] border border-white/10 text-sm px-3 py-1.5 rounded-full text-slate-300">✓ {f}</span>)}</div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-1">Enquire About Renting</h2>
              <p className="text-xs text-slate-500 mb-5">Rent details shared privately after initial consultation.</p>
              <EnquiryForm propertyId={prop.id} propertyTitle={prop.title} defaultType="rent" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
