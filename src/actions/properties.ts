"use server";

import { db } from "@/db";
import {
  properties,
  propertyImages,
  propertyDocuments,
  propertyUpdates,
  profiles,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireSession, requireAdmin } from "@/auth/session";
import { sendPropertyStatusEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type SubmitPropertyData = {
  category: "residential" | "commercial_building" | "commercial_land" | "farmland" | "agricultural_land" | "industrial";
  purpose: "buy" | "rent" | "manage_only";
  title: string;
  description?: string;
  location: string;
  city: string;
  state?: string;
  pincode?: string;
  addressDetails?: string;
  area: number;
  areaUnit?: string;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  features?: string[];
  imageUrls?: string[];
};

/** Owner submits a new property — always lands as pending_review */
export async function submitProperty(data: SubmitPropertyData) {
  const session = await requireSession();

  if (!data.title || !data.location || !data.city) {
    return { success: false, error: "Title, location, and city are required." };
  }

  const id = `prop-${nanoid(10)}`;

  try {
    await db.insert(properties).values({
      id,
      ownerId: session.profile.id,
      category: data.category,
      purpose: data.purpose,
      title: data.title.trim(),
      description: data.description?.trim(),
      location: data.location.trim(),
      city: data.city.trim(),
      state: data.state?.trim(),
      pincode: data.pincode?.trim(),
      addressDetails: data.addressDetails?.trim(),
      area: data.area || 0,
      areaUnit: data.areaUnit || "sqft",
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      furnishingStatus: data.furnishingStatus,
      features: data.features || [],
      status: "pending_review",
    });

    // Insert images
    if (data.imageUrls && data.imageUrls.length > 0) {
      await db.insert(propertyImages).values(
        data.imageUrls.map((url, i) => ({
          id: `img-${nanoid(8)}`,
          propertyId: id,
          url,
          sortOrder: i,
        }))
      );
    }

    // Log initial update
    await db.insert(propertyUpdates).values({
      id: `upd-${nanoid(8)}`,
      propertyId: id,
      message: "Property submitted for admin review.",
      category: "Listing",
      author: session.profile.name,
      createdBy: session.profile.id,
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin/properties");

    return { success: true, propertyId: id };
  } catch (err) {
    console.error("submitProperty error:", err);
    return { success: false, error: "Failed to submit property. Please try again." };
  }
}

/** Admin approves a property — sets status to published */
export async function approveProperty(propertyId: string) {
  const session = await requireAdmin();

  try {
    const [prop] = await db
      .select({
        id: properties.id,
        title: properties.title,
        ownerId: properties.ownerId,
      })
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (!prop) return { success: false, error: "Property not found." };

    await db
      .update(properties)
      .set({ status: "published", updatedAt: new Date() })
      .where(eq(properties.id, propertyId));

    // Log
    await db.insert(propertyUpdates).values({
      id: `upd-${nanoid(8)}`,
      propertyId,
      message: "Property approved and published to the live portal.",
      category: "Listing",
      author: "Lala NRI Realty Administration",
      createdBy: session.profile.id,
    });

    // Notify owner via email
    const [owner] = await db
      .select({ authUserId: profiles.authUserId, name: profiles.name })
      .from(profiles)
      .where(eq(profiles.id, prop.ownerId))
      .limit(1);

    if (owner && process.env.GMAIL_USER) {
      // Fetch owner email from Better Auth tables — we do a best-effort async send
      sendPropertyStatusEmail(
        // In practice, you'd join with the Better Auth `user` table or store email in profiles.
        // For now, we pass a placeholder — wire actual email lookup in production.
        process.env.ADMIN_EMAIL || "",
        owner.name,
        prop.title,
        "published"
      ).catch(console.error);
    }

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath("/buy");
    revalidatePath("/rent");

    return { success: true };
  } catch (err) {
    console.error("approveProperty error:", err);
    return { success: false, error: "Failed to approve property." };
  }
}

/** Admin rejects a property */
export async function rejectProperty(propertyId: string, reason?: string) {
  const session = await requireAdmin();

  try {
    await db
      .update(properties)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(properties.id, propertyId));

    await db.insert(propertyUpdates).values({
      id: `upd-${nanoid(8)}`,
      propertyId,
      message: reason
        ? `Property rejected: ${reason}`
        : "Property rejected by admin. Please contact support.",
      category: "Listing",
      author: "Lala NRI Realty Administration",
      createdBy: session.profile.id,
    });

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);

    return { success: true };
  } catch (err) {
    console.error("rejectProperty error:", err);
    return { success: false, error: "Failed to reject property." };
  }
}

/** Admin updates any property status */
export async function updatePropertyStatus(
  propertyId: string,
  status: "pending_review" | "published" | "under_management" | "rented" | "sold" | "rejected",
  extras?: {
    occupancy?: "vacant" | "rented" | "under_renovation";
    tenantName?: string;
    tenantContact?: string;
    lastInspectionDate?: string;
    note?: string;
  }
) {
  const session = await requireAdmin();

  try {
    await db
      .update(properties)
      .set({
        status,
        ...(extras?.occupancy ? { occupancy: extras.occupancy } : {}),
        ...(extras?.tenantName !== undefined ? { tenantName: extras.tenantName } : {}),
        ...(extras?.tenantContact !== undefined ? { tenantContact: extras.tenantContact } : {}),
        ...(extras?.lastInspectionDate ? { lastInspectionDate: extras.lastInspectionDate } : {}),
        updatedAt: new Date(),
      })
      .where(eq(properties.id, propertyId));

    const note = extras?.note || `Status updated to ${status}.`;
    await db.insert(propertyUpdates).values({
      id: `upd-${nanoid(8)}`,
      propertyId,
      message: note,
      category: "Management",
      author: "Lala NRI Realty Administration",
      createdBy: session.profile.id,
    });

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath("/dashboard");

    return { success: true };
  } catch (err) {
    console.error("updatePropertyStatus error:", err);
    return { success: false, error: "Failed to update status." };
  }
}

/** Owner or Admin logs a property update message */
export async function logPropertyUpdate(
  propertyId: string,
  message: string,
  category = "General"
) {
  const session = await requireSession();

  // Owners can only log updates on their own properties
  if (session.profile.role !== "admin") {
    const [prop] = await db
      .select({ ownerId: properties.ownerId })
      .from(properties)
      .where(
        and(
          eq(properties.id, propertyId),
          eq(properties.ownerId, session.profile.id)
        )
      )
      .limit(1);

    if (!prop) return { success: false, error: "Property not found or access denied." };
  }

  try {
    await db.insert(propertyUpdates).values({
      id: `upd-${nanoid(8)}`,
      propertyId,
      message: message.trim(),
      category,
      author: session.profile.name,
      createdBy: session.profile.id,
    });

    revalidatePath(`/dashboard/properties/${propertyId}`);
    revalidatePath(`/admin/properties/${propertyId}`);

    return { success: true };
  } catch (err) {
    console.error("logPropertyUpdate error:", err);
    return { success: false, error: "Failed to log update." };
  }
}
