"use server";

import fs from "fs/promises";
import path from "path";
import { requireAdmin } from "@/auth/session";

const CONTENT_FILE_PATH = path.join(process.cwd(), "src", "data", "content.json");

export type SiteContentData = {
  announcement: {
    enabled: boolean;
    badge: string;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  hero: {
    tag: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  stats: Array<{ label: string; value: string }>;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    usLiaison: string;
    uaeLiaison: string;
  };
  faqs: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    location: string;
    propertyType: string;
    quote: string;
  }>;
};

export async function getSiteContent(): Promise<SiteContentData> {
  try {
    const raw = await fs.readFile(CONTENT_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Could not read site content file, using defaults:", err);
    return {
      announcement: {
        enabled: true,
        badge: "NEW",
        text: "Special 2025 NRI Tax & Legal Advisory Desk now open for US, UK & UAE clients.",
        linkText: "Schedule a Consultation",
        linkUrl: "/contact",
      },
      hero: {
        tag: "PREMIUM NRI REAL ESTATE PLATFORM",
        title: "Your Real Estate in India, Managed with Trust & Precision",
        subtitle: "End-to-end property management, leasing, title verification, and asset monetization tailored specifically for Non-Resident Indians.",
        primaryCta: "Explore Managed Properties",
        secondaryCta: "List Your Property",
      },
      stats: [
        { label: "Assets Under Management", value: "₹650+ Cr" },
        { label: "Global NRI Families", value: "1,400+" },
        { label: "On-Time Rental Payouts", value: "99.8%" },
        { label: "Prime Tech Corridors", value: "HITEC & Jubilee" },
      ],
      contact: {
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        email: "support@lalanri.com",
        address: "Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
        usLiaison: "+1 (408) 555-0199 (San Jose, CA)",
        uaeLiaison: "+971 50 123 4567 (Downtown Dubai)",
      },
      faqs: [],
      testimonials: [],
    };
  }
}

export async function updateSiteContent(
  updatedContent: SiteContentData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    await fs.writeFile(
      CONTENT_FILE_PATH,
      JSON.stringify(updatedContent, null, 2),
      "utf-8"
    );
    return { success: true };
  } catch (err: unknown) {
    console.error("updateSiteContent error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update content",
    };
  }
}
