import { requireAdmin } from "@/auth/session";
import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { updateEnquiryStatus } from "@/actions/enquiries";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Enquiries — Admin" };

const statusColors: Record<string, string> = {
  new: "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20",
  contacted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const typeColors: Record<string, string> = {
  buy: "bg-green-500/10 text-green-400",
  rent: "bg-blue-500/10 text-blue-400",
  sell: "bg-purple-500/10 text-purple-400",
  manage: "bg-orange-500/10 text-orange-400",
  general: "bg-slate-500/10 text-slate-400",
};

export default async function AdminEnquiriesPage() {
  try { await requireAdmin(); } catch { redirect("/login"); }

  // Admin sees all enquiries including full contact details (email, phone)
  const allEnquiries = await db
    .select({
      id: enquiries.id,
      propertyId: enquiries.propertyId,
      type: enquiries.type,
      name: enquiries.name,
      email: enquiries.email,   // Admin-only visible fields
      phone: enquiries.phone,   // Admin-only visible fields
      country: enquiries.country,
      message: enquiries.message,
      preferredContact: enquiries.preferredContact,
      status: enquiries.status,
      adminNotes: enquiries.adminNotes,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .orderBy(desc(enquiries.createdAt));

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
            { href: "/admin/owners", label: "Owners", icon: "👥" },
            { href: "/admin/enquiries", label: "Enquiries", icon: "📩", active: true },
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
          <h1 className="text-2xl font-bold">All Enquiries</h1>
          <p className="text-slate-400 text-sm mt-1">{allEnquiries.length} total enquiries. Contact details are admin-only and never shared publicly.</p>
        </div>

        <div className="space-y-4">
          {allEnquiries.length === 0 && (
            <div className="text-center py-20 text-slate-500">No enquiries yet.</div>
          )}
          {allEnquiries.map((enq) => (
            <div key={enq.id} className={`bg-white/[0.03] border rounded-2xl p-5 ${enq.status === "new" ? "border-[#C5A059]/20" : "border-white/10"}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{enq.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColors[enq.type] ?? "bg-slate-500/10 text-slate-400"}`}>{enq.type}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border capitalize ${statusColors[enq.status] ?? "bg-slate-500/10 text-slate-400"}`}>{enq.status}</span>
                  </div>
                  <p className="text-sm text-slate-400">{enq.country}</p>
                </div>
                <p className="text-xs text-slate-600 flex-shrink-0">{new Date(enq.createdAt).toLocaleDateString()}</p>
              </div>

              {/* Contact info — admin only */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 mb-3">
                <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Contact (Admin Only)</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span>📧 <span className="text-slate-300">{enq.email}</span></span>
                  <span>📞 <span className="text-slate-300">{enq.phone}</span></span>
                  {enq.preferredContact && <span className="text-slate-400">Prefers: {enq.preferredContact}</span>}
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{enq.message}</p>

              {enq.adminNotes && (
                <p className="text-xs text-slate-500 bg-white/[0.02] rounded-lg px-3 py-2 mb-3">
                  📝 {enq.adminNotes}
                </p>
              )}

              <div className="flex items-center gap-2">
                {enq.status !== "contacted" && (
                  <form action={async () => { "use server"; await updateEnquiryStatus(enq.id, "contacted"); }}>
                    <button type="submit" className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition-all">
                      Mark Contacted
                    </button>
                  </form>
                )}
                {enq.status !== "closed" && (
                  <form action={async () => { "use server"; await updateEnquiryStatus(enq.id, "closed"); }}>
                    <button type="submit" className="text-xs bg-slate-500/10 text-slate-400 border border-slate-500/20 px-3 py-1.5 rounded-full hover:bg-slate-500/20 transition-all">
                      Close
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
