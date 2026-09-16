import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Property in India",
  description: "Browse premium properties available for purchase across India, curated for NRI investors.",
};

async function getBuyListings() {
  const rows = await db
    .select({
      id: properties.id,
      title: properties.title,
      category: properties.category,
      city: properties.city,
      state: properties.state,
      area: properties.area,
      areaUnit: properties.areaUnit,
      features: properties.features,
      description: properties.description,
      isFeatured: properties.isFeatured,
    })
    .from(properties)
    .where(eq(properties.status, "published"))
    .orderBy(desc(properties.isFeatured), desc(properties.createdAt));

  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return [];

  const images = await db
    .select({ propertyId: propertyImages.propertyId, url: propertyImages.url })
    .from(propertyImages)
    .where(inArray(propertyImages.propertyId, ids))
    .orderBy(propertyImages.sortOrder);

  const imageMap = new Map<string, string>();
  for (const img of images) {
    if (!imageMap.has(img.propertyId)) imageMap.set(img.propertyId, img.url);
  }

  return rows.map((r) => ({ ...r, features: Array.isArray(r.features) ? r.features : [], coverImage: imageMap.get(r.id) ?? null }));
}

const categoryLabels: Record<string, string> = {
  residential: "Residential",
  commercial_building: "Commercial Building",
  commercial_land: "Commercial Land",
  farmland: "Farmland",
  agricultural_land: "Agricultural Land",
  industrial: "Industrial",
};

export default async function BuyPage() {
  const listings = await getBuyListings();

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl tracking-tight">Lala NRI Realty</Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <Link href="/buy" className="text-[#C5A059] font-semibold">Buy</Link>
            <Link href="/rent" className="hover:text-[#C5A059] transition-colors">Rent</Link>
            <Link href="/sell" className="hover:text-[#C5A059] transition-colors">Sell</Link>
            <Link href="/manage" className="hover:text-[#C5A059] transition-colors">Manage</Link>
            <Link href="/contact" className="hover:text-[#C5A059] transition-colors">Contact</Link>
          </div>
          <Link href="/login" className="text-sm bg-[#C5A059] text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4B06A] transition-colors">Login</Link>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-[#C5A059] text-sm font-semibold uppercase tracking-widest mb-2">Properties for Sale</p>
          <h1 className="text-4xl font-bold">Buy Property in India</h1>
          <p className="text-slate-400 mt-2 max-w-xl">
            Curated selection of residential, commercial, and land properties — all verified and managed by Lala NRI Realty.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-2xl mb-2">No listings available yet.</p>
            <p className="text-sm">Check back soon or <Link href="/contact" className="text-[#C5A059] underline">contact us</Link>.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((prop) => (
              <Link
                key={prop.id}
                href={`/buy/${prop.id}`}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C5A059]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-52 bg-slate-800">
                  {prop.coverImage ? (
                    <Image src={prop.coverImage} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl">🏢</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs bg-[#C5A059]/90 text-[#0F172A] font-semibold px-2 py-1 rounded-full">
                    {categoryLabels[prop.category] ?? prop.category}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-semibold text-white group-hover:text-[#C5A059] transition-colors line-clamp-1">{prop.title}</h2>
                  <p className="text-sm text-slate-400 mt-1">{prop.city}{prop.state ? `, ${prop.state}` : ""}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{prop.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <span>{prop.area.toLocaleString()} {prop.areaUnit}</span>
                    {prop.features.slice(0, 2).map((f) => (
                      <span key={f} className="bg-white/5 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-[#C5A059] font-semibold">Price on Request — Contact for Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
