import { db } from "@/db";
import { properties, propertyImages } from "@/db/schema";
import { eq, inArray, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home — Lala NRI Realty",
};

// Public-safe property type — no owner_id, no tenant fields
type PublicProperty = {
  id: string;
  title: string;
  category: string;
  purpose: string;
  city: string;
  state: string | null;
  area: number;
  areaUnit: string;
  features: string[];
  isFeatured: boolean;
  coverImage: string | null;
};

async function getFeaturedProperties(): Promise<PublicProperty[]> {
  // Explicit column selection — never return owner_id, tenant fields, or contact info
  const rows = await db
    .select({
      id: properties.id,
      title: properties.title,
      category: properties.category,
      purpose: properties.purpose,
      city: properties.city,
      state: properties.state,
      area: properties.area,
      areaUnit: properties.areaUnit,
      features: properties.features,
      isFeatured: properties.isFeatured,
    })
    .from(properties)
    .where(
      inArray(properties.status, ["published", "under_management"])
    )
    .orderBy(desc(properties.isFeatured), desc(properties.createdAt))
    .limit(6);

  if (rows.length === 0) return [];

  // Fetch first image for each property
  const ids = rows.map((r) => r.id);
  const images = await db
    .select({ propertyId: propertyImages.propertyId, url: propertyImages.url })
    .from(propertyImages)
    .where(inArray(propertyImages.propertyId, ids))
    .orderBy(propertyImages.sortOrder);

  const imageMap = new Map<string, string>();
  for (const img of images) {
    if (!imageMap.has(img.propertyId)) imageMap.set(img.propertyId, img.url);
  }

  return rows.map((r) => ({
    ...r,
    features: Array.isArray(r.features) ? r.features : [],
    coverImage: imageMap.get(r.id) ?? null,
  }));
}

const categoryLabels: Record<string, string> = {
  residential: "Residential",
  commercial_building: "Commercial",
  commercial_land: "Commercial Land",
  farmland: "Farmland",
  agricultural_land: "Agricultural Land",
  industrial: "Industrial",
};

const purposeHref: Record<string, string> = {
  buy: "/buy",
  rent: "/rent",
  manage_only: "/manage",
};

export default async function HomePage() {
  const featured = await getFeaturedProperties();

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#C5A059] font-bold text-xl tracking-tight">
            Lala NRI Realty
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <Link href="/buy" className="hover:text-[#C5A059] transition-colors">Buy</Link>
            <Link href="/rent" className="hover:text-[#C5A059] transition-colors">Rent</Link>
            <Link href="/sell" className="hover:text-[#C5A059] transition-colors">Sell</Link>
            <Link href="/manage" className="hover:text-[#C5A059] transition-colors">Manage</Link>
            <Link href="/about" className="hover:text-[#C5A059] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#C5A059] transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[#C5A059] text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4B06A] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            Trusted by NRIs across 40+ countries
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-none">
            Your Property.<br />Professionally Managed.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            India's premier bespoke property management and real estate firm — exclusively for Non-Resident Indians. Your single trusted point of contact.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/manage"
              className="bg-[#C5A059] text-[#0F172A] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#D4B06A] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Manage My Property
            </Link>
            <Link
              href="/buy"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-white/5 transition-all"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/buy", icon: "🏠", label: "Buy Property", sub: "Curated listings across India" },
              { href: "/rent", icon: "🔑", label: "Rent Property", sub: "Verified rental opportunities" },
              { href: "/sell", icon: "📋", label: "Sell Property", sub: "Discreet, managed sales" },
              { href: "/manage", icon: "⚙️", label: "Manage Property", sub: "Full-service management" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-[#C5A059]/30 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-semibold text-white group-hover:text-[#C5A059] transition-colors">{s.label}</div>
                <div className="text-sm text-slate-500 mt-1">{s.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#C5A059] text-sm font-semibold uppercase tracking-widest mb-2">Featured Portfolio</p>
                <h2 className="text-3xl font-bold">Premium Properties</h2>
              </div>
              <Link href="/buy" className="text-sm text-slate-400 hover:text-[#C5A059] transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((prop) => (
                <Link
                  key={prop.id}
                  href={`${purposeHref[prop.purpose] ?? "/buy"}/${prop.id}`}
                  className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-[#C5A059]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-52 bg-slate-800">
                    {prop.coverImage ? (
                      <Image
                        src={prop.coverImage}
                        alt={prop.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-4xl">🏢</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs bg-[#C5A059]/90 text-[#0F172A] font-semibold px-2 py-1 rounded-full">
                        {categoryLabels[prop.category] ?? prop.category}
                      </span>
                      {prop.isFeatured && (
                        <span className="text-xs bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full">⭐ Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-white group-hover:text-[#C5A059] transition-colors line-clamp-1">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {prop.city}{prop.state ? `, ${prop.state}` : ""}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                      <span>{prop.area.toLocaleString()} {prop.areaUnit}</span>
                      {Array.isArray(prop.features) && prop.features.length > 0 && (
                        <span className="text-slate-600">·</span>
                      )}
                      {Array.isArray(prop.features) && prop.features.slice(0, 2).map((f) => (
                        <span key={f} className="bg-white/5 px-2 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why NRIs Trust Us ─────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C5A059] text-sm font-semibold uppercase tracking-widest mb-2">Why Lala NRI Realty</p>
            <h2 className="text-3xl font-bold">Built for the NRI mindset</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🛡️",
                title: "Complete Confidentiality",
                desc: "Your contact details and property documents are never shared with buyers, renters, or third parties. All enquiries funnel exclusively through our team.",
              },
              {
                icon: "📍",
                title: "On-Ground Presence",
                desc: "Our field managers conduct physical inspections, handle maintenance, and interface with tenants — so you don't have to be in India.",
              },
              {
                icon: "💼",
                title: "End-to-End Management",
                desc: "From tenant sourcing and rent collection to property tax payments and legal compliance — one team handles everything.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-7">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to list your property?</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Submit your property details and our team will review and respond within 24 hours. No public listing of prices — complete discretion guaranteed.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="bg-[#C5A059] text-[#0F172A] px-8 py-4 rounded-xl font-bold hover:bg-[#D4B06A] transition-all"
            >
              Register as Owner
            </Link>
            <Link
              href="/contact"
              className="border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/5 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#C5A059] font-bold text-lg">Lala NRI Realty</div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href="/about" className="hover:text-slate-300 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link href="/login" className="hover:text-slate-300 transition-colors">Login</Link>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} Lala NRI Realty · Hyderabad, India</p>
        </div>
      </footer>
    </main>
  );
}
