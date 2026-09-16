import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Better Auth Tables ──────────────────────────────────────────────────────
// These are required by Better Auth's Drizzle adapter.

export const authUser = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authSession = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" }),
});

export const authAccount = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => authUser.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authVerification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// ─── Enums ──────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum("role", ["owner", "admin"]);

export const propertyCategoryEnum = pgEnum("property_category", [
  "residential",
  "commercial_building",
  "commercial_land",
  "farmland",
  "agricultural_land",
  "industrial",
]);

export const propertyPurposeEnum = pgEnum("property_purpose", [
  "buy",
  "rent",
  "manage_only",
]);

export const propertyStatusEnum = pgEnum("property_status", [
  "pending_review",
  "published",
  "under_management",
  "rented",
  "sold",
  "rejected",
]);

export const occupancyEnum = pgEnum("occupancy_status", [
  "vacant",
  "rented",
  "under_renovation",
]);

export const docVisibilityEnum = pgEnum("doc_visibility", [
  "admin_only",
  "owner_and_admin",
]);

export const enquiryTypeEnum = pgEnum("enquiry_type", [
  "buy",
  "rent",
  "sell",
  "manage",
  "general",
]);

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "closed",
]);

// ─── Tables ─────────────────────────────────────────────────────────────────

/**
 * profiles — one per registered user.
 * auth_user_id links to Better Auth's internal user record.
 * role is kept here so every query can derive permissions from DB alone.
 */
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  authUserId: text("auth_user_id").notNull().unique(),
  role: roleEnum("role").notNull().default("owner"),
  name: text("name").notNull(),
  phone: text("phone"),
  country: text("country"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * properties — central listing table.
 * Public queries MUST select explicit columns — never owner_id, tenant fields, or profile contact.
 */
export const properties = pgTable("properties", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  category: propertyCategoryEnum("category").notNull(),
  purpose: propertyPurposeEnum("purpose").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  pincode: text("pincode"),
  addressDetails: text("address_details"),
  area: integer("area").notNull().default(0),
  areaUnit: text("area_unit").notNull().default("sqft"),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  furnishingStatus: text("furnishing_status"),
  // jsonb: { features: string[], amenities: string[] }
  features: jsonb("features").$type<string[]>().default([]),
  status: propertyStatusEnum("status").notNull().default("pending_review"),
  occupancy: occupancyEnum("occupancy").notNull().default("vacant"),
  // Tenant fields — NEVER exposed to public or non-admin queries
  tenantName: text("tenant_name"),
  tenantContact: text("tenant_contact"),
  lastInspectionDate: text("last_inspection_date"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isDuplicateFlagged: boolean("is_duplicate_flagged").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const propertyImages = pgTable("property_images", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const propertyDocuments = pgTable("property_documents", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  docType: text("doc_type").notNull(), // e.g. "Title Deed", "Inspection Report"
  fileName: text("file_name"),
  visibleTo: docVisibilityEnum("visible_to")
    .notNull()
    .default("admin_only"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * enquiries — all enquiry contact is stored here, routed to Admin only.
 * Buyer/renter contact info (email, phone) is visible to Admin only.
 * property_id is nullable for general enquiries not tied to a listing.
 */
export const enquiries = pgTable("enquiries", {
  id: text("id").primaryKey(),
  propertyId: text("property_id").references(() => properties.id, {
    onDelete: "set null",
  }),
  type: enquiryTypeEnum("type").notNull().default("general"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  country: text("country"),
  message: text("message").notNull(),
  preferredContact: text("preferred_contact").default("phone"),
  status: enquiryStatusEnum("status").notNull().default("new"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * property_updates — the activity log / timeline visible to both owner and admin.
 */
export const propertyUpdates = pgTable("property_updates", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  category: text("category").notNull().default("General"), // Inspection | Maintenance | Tenant | Document | Listing
  author: text("author").notNull().default("Lala NRI Realty"),
  createdBy: text("created_by").references(() => profiles.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const profilesRelations = relations(profiles, ({ many }) => ({
  properties: many(properties),
  propertyUpdates: many(propertyUpdates),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [properties.ownerId],
    references: [profiles.id],
  }),
  images: many(propertyImages),
  documents: many(propertyDocuments),
  enquiries: many(enquiries),
  updates: many(propertyUpdates),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
  property: one(properties, {
    fields: [propertyImages.propertyId],
    references: [properties.id],
  }),
}));

export const propertyDocumentsRelations = relations(
  propertyDocuments,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyDocuments.propertyId],
      references: [properties.id],
    }),
  })
);

export const enquiriesRelations = relations(enquiries, ({ one }) => ({
  property: one(properties, {
    fields: [enquiries.propertyId],
    references: [properties.id],
  }),
}));

export const propertyUpdatesRelations = relations(
  propertyUpdates,
  ({ one }) => ({
    property: one(properties, {
      fields: [propertyUpdates.propertyId],
      references: [properties.id],
    }),
    createdByProfile: one(profiles, {
      fields: [propertyUpdates.createdBy],
      references: [profiles.id],
    }),
  })
);
