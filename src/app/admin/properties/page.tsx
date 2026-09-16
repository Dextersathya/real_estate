import { requireAdmin } from "@/auth/session";
import { db } from "@/db";
import { properties, propertyImages, profiles } from "@/db/schema";
import { inArray, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { approveProperty, rejectProperty } from "@/actions/properties";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "All Properties — Admin" };

const statusColors: Record<string, string> = {
  pending_review: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  published: "bg-green-500/10 text-green-400 border-green-500/20",
  under_management: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  rented: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  sold: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending_review: "Pending Review",
  published: "Published",
  under_management: "Under Management",
  rented: "Rented",
  sold: "Sold",
  rejected: "Rejected",
};

export default async function AdminPropertiesPage() {
  try { await requireAdmin(); } catch { redirect("/login"); }

  const allProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      category: properties.category,
      purpose: properties.purpose,
      city: properties.city,
      state: properties.state,
      status: properties.status,
      occupancy: properties.occupancy,
      ownerId: properties.ownerId,
      isFeatured: properties.isFeatured,
      isDuplicateFlagged: properties.isDuplicateFlagged,
      createdAt: properties.createdAt,
    })
    .from(properties)
    .orderBy(desc(properties.createdAt));

  const ids = allProperties.map((p) => p.id);
  const ownerIds = [...new Set(allProperties.map((p) => p.ownerId))];

  const [imgs, ownerProfiles] = await Promise.all([
    ids.length > 0
      ? db.select({ propertyId: propertyImages.propertyId, url: propertyImages.url })
          .from(propertyImages).where(inArray(propertyImages.propertyId, ids)).orderBy(propertyImages.sortOrder)
      : Promise.resolve([]),
    ownerIds.length > 0
      ? db.select({ id: profiles.id, name: profiles.name, phone: profiles.phone, country: profiles.country })
          .from(profiles).where(inArray(profiles.id, ownerIds))
      : Promise.resolve([]),
  ]);

  const imageMap = new Map<string, string>();
  for (const img of imgs) { if (!imageMap.has(img.propertyId)) imageMap.set(img.propertyId, img.url); }
  const ownerMap = new Map(ownerProfiles.map((o) => [o.id, o]));

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <div className="fixed top-0 left-0 h-full w-64 bg-[#0A1120] border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-[#C5A059] font-bold text-lg">Lala NRI Realty</Link>
          <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: "📊" },
            { href: "/admin/properties", label: "Properties", icon: "🏢", active: true },
            { href: "/admin/owners", label: "Owners", icon: "👥" },
            { href: "/admin/enquiries", label: "Enquiries", icon: "📩" },
            { href: "/admin/content", label: "Site Content", icon: "✏️" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${item.active ? "bg-white/[0.05] text-white font-medium" : "text-slate-400 hover:bg-white/[0.03] hover:text-white"}`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="ml-64 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">All Properties</h1>
          <p className="text-slate-400 text-sm mt-1">{allProperties.length} total properties across all owners.</p>
        </div>

        <div className="space-y-4">
          {allProperties.map((prop) => {
            const cover = imageMap.get(prop.id);
            const owner = ownerMap.get(prop.ownerId);
            return (
              <div key={prop.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-start gap-4">
                <div className="w-20 h-16 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden">
                  {cover ? (
                    <Image src={cover} alt={prop.title} width={80} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">🏢</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">{prop.title}</h3>
                        {prop.isDuplicateFlagged && <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full">⚠ Duplicate?</span>}
                      </div>
                      <p className="text-sm text-slate-400">{prop.city}{prop.state ? `, ${prop.state}` : ""} · {prop.category.replace(/_/g, " ")}</p>
                      {owner && (
                        <p className="text-xs text-slate-500 mt-1">
                          Owner: <span className="text-slate-300">{owner.name}</span>
                          {owner.country && ` · ${owner.country}`}
                          {owner.phone && ` · ${owner.phone}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[prop.status] ?? "bg-slate-500/10 text-slate-400"}`}>
                        {statusLabels[prop.status] ?? prop.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Link href={`/admin/properties/${prop.id}`} className="text-xs text-[#C5A059] hover:underline">View Details →</Link>
                    {prop.status === "pending_review" && (
                      <>
                        <form action={async () => { "use server"; await approveProperty(prop.id); }}>
                          <button type="submit" className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full hover:bg-green-500/20 transition-all">
                            ✓ Approve
                          </button>
                        </form>
                        <form action={async () => { "use server"; await rejectProperty(prop.id, "Does not meet listing criteria."); }}>
                          <button type="submit" className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full hover:bg-red-500/20 transition-all">
                            ✗ Reject
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
