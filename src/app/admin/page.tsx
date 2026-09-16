import { requireAdmin } from "@/auth/session";
import { db } from "@/db";
import { properties, enquiries, profiles } from "@/db/schema";
import { eq, count, inArray } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Panel — Lala NRI Realty" };

const statusColors: Record<string, string> = {
  pending_review: "bg-amber-500/10 text-amber-400",
  published: "bg-green-500/10 text-green-400",
  under_management: "bg-blue-500/10 text-blue-400",
  rented: "bg-purple-500/10 text-purple-400",
  sold: "bg-slate-500/10 text-slate-400",
  rejected: "bg-red-500/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  pending_review: "Pending Review",
  published: "Published",
  under_management: "Under Management",
  rented: "Rented",
  sold: "Sold",
  rejected: "Rejected",
};

export default async function AdminPage() {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/login");
  }

  // Admin stats
  const [totalProperties] = await db.select({ count: count() }).from(properties);
  const [underMgmt] = await db.select({ count: count() }).from(properties).where(eq(properties.status, "under_management"));
  const [pendingApprovals] = await db.select({ count: count() }).from(properties).where(eq(properties.status, "pending_review"));
  const [totalOwners] = await db.select({ count: count() }).from(profiles).where(eq(profiles.role, "owner"));
  const [totalEnquiries] = await db.select({ count: count() }).from(enquiries);
  const [newEnquiries] = await db.select({ count: count() }).from(enquiries).where(eq(enquiries.status, "new"));
  const [buyEnq] = await db.select({ count: count() }).from(enquiries).where(eq(enquiries.type, "buy"));
  const [rentEnq] = await db.select({ count: count() }).from(enquiries).where(eq(enquiries.type, "rent"));
  const [sellEnq] = await db.select({ count: count() }).from(enquiries).where(eq(enquiries.type, "sell"));
  const [manageEnq] = await db.select({ count: count() }).from(enquiries).where(eq(enquiries.type, "manage"));

  // Recent pending properties
  const pendingProps = await db
    .select({
      id: properties.id,
      title: properties.title,
      category: properties.category,
      city: properties.city,
      ownerId: properties.ownerId,
      status: properties.status,
      createdAt: properties.createdAt,
    })
    .from(properties)
    .where(eq(properties.status, "pending_review"))
    .limit(5);

  // Get owner names
  const ownerIds = [...new Set(pendingProps.map((p) => p.ownerId))];
  const ownerProfiles = ownerIds.length > 0
    ? await db.select({ id: profiles.id, name: profiles.name }).from(profiles).where(inArray(profiles.id, ownerIds))
    : [];
  const ownerMap = new Map(ownerProfiles.map((o) => [o.id, o.name]));

  // Recent enquiries
  const recentEnquiries = await db
    .select({
      id: enquiries.id,
      name: enquiries.name,
      type: enquiries.type,
      status: enquiries.status,
      country: enquiries.country,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .orderBy(enquiries.createdAt)
    .limit(5);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#0A1120] border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-[#C5A059] font-bold text-lg">Lala NRI Realty</Link>
          <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: "📊" },
            { href: "/admin/properties", label: "Properties", icon: "🏢" },
            { href: "/admin/owners", label: "Owners", icon: "👥" },
            { href: "/admin/enquiries", label: "Enquiries", icon: "📩" },
            { href: "/admin/content", label: "Site Content", icon: "✏️" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-white/[0.03] hover:text-white text-sm transition-all">
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{session.profile.name}</p>
            <p className="text-xs text-[#C5A059]">Administrator</p>
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
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Platform overview and actions.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Properties", value: totalProperties.count, icon: "🏘️", href: "/admin/properties" },
            { label: "Under Management", value: underMgmt.count, icon: "⚙️", href: "/admin/properties" },
            { label: "Pending Approvals", value: pendingApprovals.count, icon: "⏳", href: "/admin/properties", alert: pendingApprovals.count > 0 },
            { label: "Total Owners", value: totalOwners.count, icon: "👥", href: "/admin/owners" },
          ].map((s) => (
            <Link key={s.label} href={s.href}
              className={`bg-white/[0.03] border rounded-2xl p-5 hover:bg-white/[0.05] transition-all ${s.alert ? "border-amber-500/30" : "border-white/10"}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.alert ? "text-amber-400" : ""}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Enquiry Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Enquiries", value: totalEnquiries.count },
            { label: "New / Unread", value: newEnquiries.count, alert: true },
            { label: "Buy Enquiries", value: buyEnq.count },
            { label: "Rent Enquiries", value: rentEnq.count },
            { label: "Sell Enquiries", value: sellEnq.count },
          ].map((s) => (
            <Link key={s.label} href="/admin/enquiries"
              className={`bg-white/[0.03] border rounded-2xl p-4 hover:bg-white/[0.05] transition-all ${s.alert && s.value > 0 ? "border-[#C5A059]/30" : "border-white/10"}`}>
              <div className={`text-2xl font-bold ${s.alert && s.value > 0 ? "text-[#C5A059]" : ""}`}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Properties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Pending Approvals</h2>
              <Link href="/admin/properties" className="text-xs text-[#C5A059] hover:underline">View all →</Link>
            </div>
            {pendingProps.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center text-slate-500 text-sm">
                No pending properties ✓
              </div>
            ) : (
              <div className="space-y-3">
                {pendingProps.map((prop) => (
                  <Link key={prop.id} href={`/admin/properties/${prop.id}`}
                    className="flex items-center justify-between bg-white/[0.03] border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-all">
                    <div>
                      <p className="font-medium text-sm text-white">{prop.title}</p>
                      <p className="text-xs text-slate-400">{prop.city} · {ownerMap.get(prop.ownerId) ?? "Unknown Owner"}</p>
                    </div>
                    <span className="text-xs bg-amber-500/10 text-amber-400 px-2 py-1 rounded-full">Review →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Enquiries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Recent Enquiries</h2>
              <Link href="/admin/enquiries" className="text-xs text-[#C5A059] hover:underline">View all →</Link>
            </div>
            {recentEnquiries.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center text-slate-500 text-sm">
                No enquiries yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentEnquiries.map((enq) => (
                  <Link key={enq.id} href="/admin/enquiries"
                    className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-[#C5A059]/30 transition-all">
                    <div>
                      <p className="font-medium text-sm text-white">{enq.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{enq.type} enquiry · {enq.country}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${enq.status === "new" ? "bg-[#C5A059]/10 text-[#C5A059]" : "bg-slate-700 text-slate-400"}`}>
                      {enq.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
