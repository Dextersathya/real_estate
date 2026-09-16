"use server";

import { db } from "@/db";
import { enquiries } from "@/db/schema";
import { sendEnquiryNotificationEmail } from "@/lib/email";
import { nanoid } from "nanoid";

export type EnquiryFormData = {
  propertyId?: string;
  type: "buy" | "rent" | "sell" | "manage" | "general";
  name: string;
  email: string;
  phone: string;
  country?: string;
  message: string;
  preferredContact?: string;
};

export async function submitEnquiry(data: EnquiryFormData) {
  if (!data.name || !data.email || !data.phone || !data.message) {
    return { success: false, error: "Please provide all required fields." };
  }

  try {
    const id = `enq-${nanoid(10)}`;

    await db.insert(enquiries).values({
      id,
      propertyId: data.propertyId || null,
      type: data.type,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      country: data.country || "Global",
      message: data.message.trim(),
      preferredContact: data.preferredContact || "phone",
      status: "new",
    });

    // Notify admin via email (non-blocking)
    if (process.env.ADMIN_EMAIL) {
      sendEnquiryNotificationEmail(
        process.env.ADMIN_EMAIL,
        data.name,
        data.type,
        data.message
      ).catch(console.error);
    }

    return {
      success: true,
      message:
        "Thank you! Our team will contact you within 24 hours.",
    };
  } catch (err) {
    console.error("submitEnquiry error:", err);
    return { success: false, error: "Failed to submit enquiry. Please try again." };
  }
}

export async function updateEnquiryStatus(
  id: string,
  status: "new" | "contacted" | "closed",
  adminNotes?: string
) {
  // This action is admin-only — the caller (page/route) must verify role first
  try {
    const { eq } = await import("drizzle-orm");
    await db
      .update(enquiries)
      .set({
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      })
      .where(eq(enquiries.id, id));

    return { success: true };
  } catch (err) {
    console.error("updateEnquiryStatus error:", err);
    return { success: false, error: "Failed to update enquiry." };
  }
}
