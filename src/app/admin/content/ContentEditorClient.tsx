"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { updateSiteContent, type SiteContentData } from "@/actions/content";

type Props = {
  initialContent: SiteContentData;
  adminName: string;
};

type TabType = "announcement" | "hero" | "stats" | "testimonials" | "faqs" | "contact";

export default function ContentEditorClient({ initialContent, adminName }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("announcement");
  const [content, setContent] = useState<SiteContentData>(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    const res = await updateSiteContent(content);
    setIsSaving(false);

    if (res.success) {
      setSaveStatus({ type: "success", message: "Site content updated successfully!" });
      setTimeout(() => setSaveStatus(null), 4000);
    } else {
      setSaveStatus({ type: "error", message: res.error || "Failed to save content." });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* ── Fixed Sidebar ──────────────────────────────────────────────── */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-[#0A1120] border-r border-white/5 flex flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-[#C5A059] font-bold text-lg tracking-tight">
            Lala NRI Realty
          </Link>
          <p className="text-xs text-slate-500 mt-1">Admin Management Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: "📊" },
            { href: "/admin/properties", label: "Properties", icon: "🏢" },
            { href: "/admin/owners", label: "Owners", icon: "👥" },
            { href: "/admin/enquiries", label: "Enquiries", icon: "📩" },
            { href: "/admin/content", label: "Site Content", icon: "✏️", active: true },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                item.active
                  ? "bg-[#C5A059]/10 text-[#C5A059] font-semibold border border-[#C5A059]/20"
                  : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-slate-200">{adminName}</p>
            <p className="text-xs text-[#C5A059]">Administrator</p>
          </div>
          <form action={logoutAction} className="mt-2">
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-400/5"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────────────── */}
      <main className="ml-64 flex-1 p-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">CMS & Live Content</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Site Content Management</h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure homepage banners, trust badges, testimonials, FAQs, and global liaison contacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 transition-colors"
            >
              View Public Site ↗
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#C5A059] hover:bg-[#D4B06A] text-[#0F172A] transition-all shadow-lg shadow-[#C5A059]/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Status Toast / Alert */}
        {saveStatus && (
          <div
            className={`mt-4 p-4 rounded-xl text-sm flex items-center justify-between border ${
              saveStatus.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            <span>{saveStatus.message}</span>
            <button
              onClick={() => setSaveStatus(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 mt-6 overflow-x-auto pb-px">
          {[
            { id: "announcement", label: "Announcement Bar", icon: "📢" },
            { id: "hero", label: "Hero & Positioning", icon: "🎯" },
            { id: "stats", label: "Trust Metrics (Stats)", icon: "📈" },
            { id: "testimonials", label: "Client Testimonials", icon: "💬" },
            { id: "faqs", label: "NRI Legal & Tax FAQs", icon: "❓" },
            { id: "contact", label: "Global Liaison Desk", icon: "📞" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/5 rounded-t-lg"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Announcement Bar */}
        {activeTab === "announcement" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div>
                  <h3 className="font-semibold text-white">Top Alert & Announcement Ribbon</h3>
                  <p className="text-xs text-slate-400">Appears at the very top of all public pages for special updates.</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-xs text-slate-400">
                    {content.announcement.enabled ? "Active" : "Hidden"}
                  </span>
                  <input
                    type="checkbox"
                    checked={content.announcement.enabled}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, enabled: e.target.checked },
                      })
                    }
                    className="w-5 h-5 accent-[#C5A059] rounded cursor-pointer"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Pill / Badge Label</label>
                  <input
                    type="text"
                    value={content.announcement.badge}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, badge: e.target.value },
                      })
                    }
                    className="w-full max-w-xs bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Announcement Message</label>
                  <input
                    type="text"
                    value={content.announcement.text}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        announcement: { ...content.announcement, text: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Call to Action Link Text</label>
                    <input
                      type="text"
                      value={content.announcement.linkText}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, linkText: e.target.value },
                        })
                      }
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5">Destination URL</label>
                    <input
                      type="text"
                      value={content.announcement.linkUrl}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          announcement: { ...content.announcement, linkUrl: e.target.value },
                        })
                      }
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Live Header Preview</p>
                <div className="bg-gradient-to-r from-[#C5A059]/20 via-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#C5A059] text-[#0F172A] text-xs font-bold px-2 py-0.5 rounded">
                      {content.announcement.badge}
                    </span>
                    <span className="text-xs text-slate-200">{content.announcement.text}</span>
                  </div>
                  <span className="text-xs text-[#C5A059] font-semibold underline">
                    {content.announcement.linkText} →
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hero Section */}
        {activeTab === "hero" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-white">Homepage Hero Section</h3>
              <p className="text-xs text-slate-400 mb-4">First impression for NRI investors and property owners visiting the site.</p>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Over-title Tag / Eyebrow</label>
                <input
                  type="text"
                  value={content.hero.tag}
                  onChange={(e) =>
                    setContent({ ...content, hero: { ...content.hero, tag: e.target.value } })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Primary Headline</label>
                <input
                  type="text"
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({ ...content, hero: { ...content.hero, title: e.target.value } })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Subtitle & Mission Statement</label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={(e) =>
                    setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Primary CTA Button</label>
                  <input
                    type="text"
                    value={content.hero.primaryCta}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, primaryCta: e.target.value } })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={content.hero.secondaryCta}
                    onChange={(e) =>
                      setContent({ ...content, hero: { ...content.hero, secondaryCta: e.target.value } })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Trust Metrics (Stats) */}
        {activeTab === "stats" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">Trust Badges & Milestone Statistics</h3>
                  <p className="text-xs text-slate-400">Displays verified figures highlighting company track record.</p>
                </div>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      stats: [...content.stats, { label: "New Metric", value: "100+" }],
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 transition-colors"
                >
                  + Add Stat
                </button>
              </div>

              <div className="space-y-4">
                {content.stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                    <div className="w-1/3">
                      <label className="block text-[11px] text-slate-400 mb-1">Statistic Figure / Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...content.stats];
                          updated[index].value = e.target.value;
                          setContent({ ...content, stats: updated });
                        }}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-[#C5A059] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] text-slate-400 mb-1">Metric Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...content.stats];
                          updated[index].label = e.target.value;
                          setContent({ ...content, stats: updated });
                        }}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const updated = content.stats.filter((_, i) => i !== index);
                        setContent({ ...content, stats: updated });
                      }}
                      className="text-xs text-slate-500 hover:text-red-400 p-2 mt-4"
                      title="Remove Metric"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Client Testimonials */}
        {activeTab === "testimonials" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-white">Client Reviews & Testimonials</h3>
                  <p className="text-xs text-slate-400">Social proof from NRI property owners worldwide.</p>
                </div>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      testimonials: [
                        ...content.testimonials,
                        {
                          id: `test-${Date.now()}`,
                          name: "NRI Owner Name",
                          location: "City, Country",
                          propertyType: "Residential Villa",
                          quote: "Write glowing feedback about Lala NRI Realty management here...",
                        },
                      ],
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059]/20 transition-colors"
                >
                  + Add Testimonial
                </button>
              </div>

              <div className="space-y-6">
                {content.testimonials.map((item, index) => (
                  <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#C5A059]">Review #{index + 1}</span>
                      <button
                        onClick={() => {
                          const updated = content.testimonials.filter((_, i) => i !== index);
                          setContent({ ...content, testimonials: updated });
                        }}
                        className="text-xs text-slate-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Client Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[index].name = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Location / Residence</label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[index].location = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Property Type Managed</label>
                        <input
                          type="text"
                          value={item.propertyType}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[index].propertyType = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Client Quote / Testimonial</label>
                      <textarea
                        rows={2}
                        value={item.quote}
                        onChange={(e) => {
                          const updated = [...content.testimonials];
                          updated[index].quote = e.target.value;
                          setContent({ ...content, testimonials: updated });
                        }}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: FAQs */}
        {activeTab === "faqs" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-white">NRI Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-400">Questions regarding FEMA, taxation, lease execution, and PoA.</p>
                </div>
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      faqs: [
                        ...content.faqs,
                        {
                          id: `faq-${Date.now()}`,
                          question: "New FAQ Question?",
                          answer: "Detailed explanation and legal/procedural guidance...",
                          category: "Tax & Legal",
                        },
                      ],
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059]/20 transition-colors"
                >
                  + Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {content.faqs.map((faq, index) => (
                  <div key={faq.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">FAQ Item #{index + 1}</span>
                      <button
                        onClick={() => {
                          const updated = content.faqs.filter((_, i) => i !== index);
                          setContent({ ...content, faqs: updated });
                        }}
                        className="text-xs text-slate-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-3">
                        <label className="block text-[11px] text-slate-400 mb-1">Question</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => {
                            const updated = [...content.faqs];
                            updated[index].question = e.target.value;
                            setContent({ ...content, faqs: updated });
                          }}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Category</label>
                        <input
                          type="text"
                          value={faq.category}
                          onChange={(e) => {
                            const updated = [...content.faqs];
                            updated[index].category = e.target.value;
                            setContent({ ...content, faqs: updated });
                          }}
                          className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Answer / Guidance</label>
                      <textarea
                        rows={3}
                        value={faq.answer}
                        onChange={(e) => {
                          const updated = [...content.faqs];
                          updated[index].answer = e.target.value;
                          setContent({ ...content, faqs: updated });
                        }}
                        className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Contact & Global Liaison */}
        {activeTab === "contact" && (
          <div className="mt-6 space-y-6 max-w-4xl">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-white">Global Liaison & HQ Contact Information</h3>
              <p className="text-xs text-slate-400 mb-4">Official communication channels for client consultations and emergency queries.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Primary Calling Line</label>
                  <input
                    type="text"
                    value={content.contact.phone}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, phone: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Official WhatsApp Business</label>
                  <input
                    type="text"
                    value={content.contact.whatsapp}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, whatsapp: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Official Support Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, email: e.target.value },
                    })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Headquarters Physical Address</label>
                <input
                  type="text"
                  value={content.contact.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: { ...content.contact, address: e.target.value },
                    })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">North America Liaison Desk</label>
                  <input
                    type="text"
                    value={content.contact.usLiaison}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, usLiaison: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Middle East (UAE / Gulf) Liaison Desk</label>
                  <input
                    type="text"
                    value={content.contact.uaeLiaison}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contact: { ...content.contact, uaeLiaison: e.target.value },
                      })
                    }
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
