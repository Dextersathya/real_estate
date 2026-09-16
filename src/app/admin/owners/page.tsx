import { requireAdmin } from "@/auth/session";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { properties } from "@/db/schema";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Owners — Admin" };

export default async function AdminOwnersPage() {
  try { await requireAdmin(); } catch { redirect("/login"); }

  const owners = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      phone: profiles.phone,
      country: profiles.country,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .where(eq(profiles.role, "owner"));

  // Property counts per owner
  const ownerIds = owners.map((o) => o.id);
  const propCounts: Record<string, number> = {};
  for (const oid of ownerIds) {
    const [row] = await db.select({ count: count() }).from(properties).where(eq(properties.ownerId, oid));
    propCounts[oid] = row?.count ?? 0;
  }

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
            { href: "/admin/properties", label: "Properties", icon: "🏢" },
            { href: "/admin/owners", label: "Owners", icon: "👥", active: true },
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
          <h1 className="text-2xl font-bold">Property Owners</h1>
          <p className="text-slate-400 text-sm mt-1">{owners.length} registered owners.</p>
        </div>
        <div className="space-y-3">
          {owners.map((o) => (
            <div key={o.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold">
                    {o.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{o.name}</p>
                    <p className="text-sm text-slate-400">{o.country} {o.phone ? `· ${o.phone}` : ""}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{propCounts[o.id] ?? 0}</p>
                <p className="text-xs text-slate-400">properties</p>
              </div>
            </div>
          ))}
          {owners.length === 0 && <div className="text-center py-20 text-slate-500">No owners registered yet.</div>}
        </div>
      </div>
    </main>
  );
}
