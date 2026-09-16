import { getServerSession } from "@/auth/session";
import { db } from "@/db";
import { properties, propertyImages, propertyUpdates } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Dashboard — Lala NRI Realty" };

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

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");
  // If admin somehow lands here, send them to admin panel
  if (session.profile.role === "admin") redirect("/admin");

  const myProperties = await db
    .select({
      id: properties.id,
      title: properties.title,
      category: properties.category,
      city: properties.city,
      status: properties.status,
      occupancy: properties.occupancy,
      tenantName: properties.tenantName, // Owner CAN see their own tenant info
      lastInspectionDate: properties.lastInspectionDate,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
    })
    .from(properties)
    .where(eq(properties.ownerId, session.profile.id))
    .orderBy(desc(properties.updatedAt));

  const propIds = myProperties.map((p) => p.id);

  // Fetch cover images for all properties
  const images =
    propIds.length > 0
      ? await db
          .select({ propertyId: propertyImages.propertyId, url: propertyImages.url })
          .from(propertyImages)
          .where(eq(propertyImages.propertyId, propIds[0])) // simplified — do per-property in detail page
          .orderBy(propertyImages.sortOrder)
      : [];

  const imageMap = new Map<string, string>();
  for (const img of images) {
    if (!imageMap.has(img.propertyId)) imageMap.set(img.propertyId, img.url);
  }

  // Recent updates across all my properties
  const recentUpdates =
    propIds.length > 0
      ? await db
          .select({
            id: propertyUpdates.id,
            propertyId: propertyUpdates.propertyId,
            message: propertyUpdates.message,
            category: propertyUpdates.category,
            author: propertyUpdates.author,
            createdAt: propertyUpdates.createdAt,
          })
          .from(propertyUpdates)
          .where(eq(propertyUpdates.propertyId, propIds[0])) // simplified
          .orderBy(desc(propertyUpdates.createdAt))
          .limit(5)
      : [];

  const stats = {
    total: myProperties.length,
    underManagement: myProperties.filter((p) => p.status === "under_management").length,
    pendingReview: myProperties.filter((p) => p.status === "pending_review").length,
    published: myProperties.filter((p) => p.status === "published").length,
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#0A1120] border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-[#C5A059] font-bold text-lg">Lala NRI Realty</Link>
          <p className="text-xs text-slate-500 mt-1">Owner Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.05] text-white text-sm font-medium">
            <span>🏠</span> My Properties
          </Link>
          <Link href="/dashboard/properties/new" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/[0.03] hover:text-white text-sm transition-all">
            <span>➕</span> Submit Property
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-bold text-sm">
              {session.profile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.profile.name}</p>
              <p className="text-xs text-slate-500">{session.profile.country || "Owner"}</p>
            </div>
          </div>
          <form action={logoutAction} className="mt-2">
            <button type="submit" className="w-full text-left px-3 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/5">
              Sign out
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome back, {session.profile.name.split(" ")[0]}</h1>
          <p className="text-slate-400 text-sm mt-1">Here's the status of your properties.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Properties", value: stats.total, icon: "🏘️" },
            { label: "Under Management", value: stats.underManagement, icon: "⚙️" },
            { label: "Pending Review", value: stats.pendingReview, icon: "⏳" },
            { label: "Published", value: stats.published, icon: "✅" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Properties List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">My Properties</h2>
          <Link href="/dashboard/properties/new" className="text-sm bg-[#C5A059] text-[#0F172A] px-4 py-2 rounded-lg font-semibold hover:bg-[#D4B06A] transition-colors">
            + Submit New
          </Link>
        </div>

        {myProperties.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-slate-500 text-lg mb-2">No properties yet</p>
            <p className="text-slate-600 text-sm mb-6">Submit your first property to get started.</p>
            <Link href="/dashboard/properties/new" className="bg-[#C5A059] text-[#0F172A] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#D4B06A] transition-colors">
              Submit a Property
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myProperties.map((prop) => (
              <Link
                key={prop.id}
                href={`/dashboard/properties/${prop.id}`}
                className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 hover:border-[#C5A059]/30 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-800 flex-shrink-0 overflow-hidden">
                  {imageMap.get(prop.id) ? (
                    <Image src={imageMap.get(prop.id)!} alt={prop.title} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 text-xl">🏢</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{prop.title}</h3>
                  <p className="text-sm text-slate-400">{prop.city} · {prop.category.replace(/_/g, " ")}</p>
                  {prop.tenantName && (
                    <p className="text-xs text-slate-500 mt-0.5">Tenant: {prop.tenantName}</p>
                  )}
                  {prop.lastInspectionDate && (
                    <p className="text-xs text-slate-600">Last inspection: {prop.lastInspectionDate}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColors[prop.status] ?? "bg-slate-500/10 text-slate-400"}`}>
                    {statusLabels[prop.status] ?? prop.status}
                  </span>
                  <span className="text-xs text-slate-600 capitalize">{prop.occupancy}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
