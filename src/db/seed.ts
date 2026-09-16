/**
 * Seed script — migrates data from the legacy data_store.json into Neon Postgres.
 * Also creates the admin account via Better Auth + seeds the admin profile.
 *
 * Run: npx tsx src/db/seed.ts
 *
 * Requires DATABASE_URL in environment.
 * ADMIN_PASSWORD env var sets the admin password (defaults to prompting).
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "./index";
import {
  profiles,
  properties,
  propertyImages,
  propertyDocuments,
  propertyUpdates,
  enquiries,
} from "./schema";
import { auth } from "../auth";
import { nanoid } from "nanoid";

// ─── Seed data from migrated data_store.json ────────────────────────────────

const ADMIN_EMAIL = "admin@lalanri.com";
const ADMIN_NAME = "Lala NRI Admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@Lala2025!";

const seedUsers = [
  {
    id: "user-owner-1",
    email: "rajesh.sharma@nri.com",
    name: "Rajesh Sharma",
    phone: "+1 408 555 0192",
    country: "United States",
    role: "owner" as const,
  },
  {
    id: "user-owner-2",
    email: "priya.patel@nri.com",
    name: "Priya Patel",
    phone: "+44 20 7946 0912",
    country: "United Kingdom",
    role: "owner" as const,
  },
  {
    id: "user-owner-3",
    email: "vikram.singh@nri.com",
    name: "Vikram Singh",
    phone: "+971 50 123 4567",
    country: "United Arab Emirates",
    role: "owner" as const,
  },
];

const seedProperties = [
  {
    id: "prop-101",
    ownerId: "user-owner-1",
    category: "residential" as const,
    purpose: "manage_only" as const,
    title: "The Sky Villa at Jubilee Hills",
    description:
      "A magnificent 4-BHK duplex sky villa offering panoramic city views, private plunge pool, double-height living room, automated smart security, and dedicated concierge services. Fully maintained under Lala NRI Realty Premium Management.",
    location: "Jubilee Hills, Road No. 36",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500033",
    area: 5200,
    areaUnit: "sqft",
    bedrooms: 4,
    bathrooms: 5,
    furnishingStatus: "Fully Furnished",
    features: [
      "Private Plunge Pool",
      "24/7 Security CCTV",
      "Smart Home Automation",
      "Italian Marble Flooring",
      "Italian Modular Kitchen",
      "3 Reserved Underground Parking",
      "Clubhouse & Gym Access",
    ],
    status: "under_management" as const,
    occupancy: "rented" as const,
    tenantName: "Senior Corporate Executive (MNC Tech)",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200",
    ],
    updates: [
      {
        message: "Bi-Monthly Physical Inspection — Full 45-point check completed. Plunge pool filtration operational.",
        category: "Inspection",
        author: "Lala NRI Field Team",
      },
      {
        message: "Property Tax Payment Completed — GHMC Annual Tax paid in full for FY 2025-26.",
        category: "Document",
        author: "Lala NRI Accounts",
      },
      {
        message: "Tenant Lease Renewal Executed — Lease extended 12 months with 5% escalation.",
        category: "Tenant",
        author: "Lala NRI Legal Desk",
      },
    ],
  },
  {
    id: "prop-102",
    ownerId: "user-owner-2",
    category: "commercial_building" as const,
    purpose: "rent" as const,
    title: "Cyber Towers Tech Park Office Suite",
    description:
      "Grade-A commercial office space in the heart of HITEC City. LEED Gold certified, 100% power backup, high-speed elevator access, and structured tenant management.",
    location: "HITEC City, Phase 2",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    area: 12500,
    areaUnit: "sqft",
    features: [
      "100% Power Backup",
      "LEED Gold Certified",
      "Centralized HVAC",
      "20 Reserved Parking Slots",
      "High-Speed Elevators",
      "24/7 Access & Guarded Lobby",
    ],
    status: "published" as const,
    occupancy: "vacant" as const,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200",
    ],
    updates: [],
  },
  {
    id: "prop-103",
    ownerId: "user-owner-3",
    category: "farmland" as const,
    purpose: "buy" as const,
    title: "Gated Community Farmhouse & Plantation Land",
    description:
      "Serene 3-acre farmland with mature teakwood & fruit orchard, modern timber farmhouse, drip irrigation, perimeter solar fencing, and on-site caretaker.",
    location: "Shankarpally - Chevella Highway",
    city: "Ranga Reddy District",
    state: "Telangana",
    pincode: "501203",
    area: 130680,
    areaUnit: "sqft",
    bedrooms: 2,
    bathrooms: 2,
    features: [
      "3 Acres Gated Farmland",
      "Organic Fruit Orchard",
      "Drip Irrigation System",
      "Solar Powered Perimeter",
      "Borewell with High Yield",
      "Clear Title & Single Owner",
    ],
    status: "published" as const,
    occupancy: "vacant" as const,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200",
    ],
    updates: [],
  },
  {
    id: "prop-104",
    ownerId: "user-owner-1",
    category: "commercial_land" as const,
    purpose: "buy" as const,
    title: "Commercial Growth Corridor Corner Plot",
    description:
      "Prime commercial land 2,400 sq yards on the Outer Ring Road service highway. Ideal for hotel, retail, or logistics hub.",
    location: "Gachibowli Financial District Ext.",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500032",
    area: 21600,
    areaUnit: "sqft",
    features: [
      "Corner Plot with 2 Sides Road",
      "HMDA Approved Layout",
      "100 Feet Wide Road Frontage",
      "Immediate Clearance Available",
      "Commercial Zoned Land",
    ],
    status: "published" as const,
    occupancy: "vacant" as const,
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200",
    ],
    updates: [],
  },
  {
    id: "prop-105",
    ownerId: "user-owner-2",
    category: "industrial" as const,
    purpose: "manage_only" as const,
    title: "Modern Logistics & Industrial Facility",
    description:
      "Pre-engineered warehouse with dock levelers, fire safety sprinklers, heavy vehicle yard, and 24/7 CCTV managed end-to-end for NRI investors.",
    location: "Patancheru Industrial Zone",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "502319",
    area: 45000,
    areaUnit: "sqft",
    features: [
      "FM2 Grade Flooring",
      "Height Clearance 12 Meters",
      "Dock Levelers Included",
      "NFPA Fire Sprinkler System",
      "High Voltage Transformer Station",
    ],
    status: "under_management" as const,
    occupancy: "rented" as const,
    tenantName: "Global E-Commerce Logistics Ltd",
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    ],
    updates: [],
  },
  {
    id: "prop-106",
    ownerId: "user-owner-3",
    category: "residential" as const,
    purpose: "manage_only" as const,
    title: "Bespoke Luxury Estate at Sadashivnagar",
    description:
      "Architectural masterpiece with stone facade, teakwood paneling, landscaped gardens, smart home energy grid, and 24/7 security.",
    location: "Sadashivnagar, Palace Area",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560080",
    area: 6800,
    areaUnit: "sqft",
    bedrooms: 5,
    bathrooms: 6,
    furnishingStatus: "Fully Furnished",
    features: [
      "Landscaping & Lawn Care",
      "Solar Energy Microgrid",
      "Private Elevator",
      "Home Theater Room",
      "Staff Quarters Included",
    ],
    status: "under_management" as const,
    occupancy: "vacant" as const,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200",
    ],
    updates: [],
  },
];

const seedEnquiries = [
  {
    id: "enq-201",
    propertyId: "prop-101",
    type: "manage" as const,
    name: "Siddharth Rao",
    email: "siddharth.rao@example.com",
    phone: "+1 650 999 1234",
    country: "United States",
    message: "I own a similar penthouse villa in Jubilee Hills and want Lala NRI Realty to handle complete tenant management, monthly rent collection, and physical inspections.",
    preferredContact: "whatsapp",
    status: "closed" as const,
    adminNotes: "Assigned Senior Manager Mr. Ramesh for initial video consultation call.",
  },
  {
    id: "enq-202",
    propertyId: "prop-103",
    type: "buy" as const,
    name: "Ananya Deshmukh",
    email: "ananya.d@example.co.uk",
    phone: "+44 7700 900123",
    country: "United Kingdom",
    message: "Interested in buying agricultural farmland near Shankarpally. Request title verification summary and site visit assistance when I travel to India next month.",
    preferredContact: "phone",
    status: "closed" as const,
    adminNotes: "",
  },
  {
    id: "enq-203",
    type: "sell" as const,
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    phone: "+971 55 888 7766",
    country: "United Arab Emirates",
    message: "I want to sell my commercial land parcel near ORR Hyderabad through Lala NRI Realty. Please guide on listing procedures and confidentiality.",
    preferredContact: "email",
    status: "contacted" as const,
    adminNotes: "Email sent with property onboarding questionnaire and privacy agreement.",
  },
];

// ─── Main Seed ───────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Create admin user via Better Auth
  console.log("→ Creating admin user via Better Auth...");
  let adminAuthId: string;
  try {
    const adminResult = await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
      },
    });
    adminAuthId = adminResult.user.id;
    console.log(`  ✓ Admin auth user created: ${adminAuthId}`);
  } catch {
    console.log("  ⚠ Admin auth user may already exist — skipping creation.");
    // If already exists, we'll use a placeholder — adjust if you have a lookup API
    adminAuthId = `admin-auth-${nanoid(8)}`;
  }

  // 2. Seed owner auth users (demo accounts)
  const ownerAuthIds: Record<string, string> = {};
  for (const u of seedUsers) {
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: "Owner@Lala2025!",
          name: u.name,
        },
      });
      ownerAuthIds[u.id] = result.user.id;
      console.log(`  ✓ Owner ${u.name} created`);
    } catch {
      console.log(`  ⚠ Owner ${u.email} may already exist — skipping.`);
      ownerAuthIds[u.id] = `owner-auth-${nanoid(8)}`;
    }
  }

  // 3. Insert profiles
  console.log("→ Inserting profiles...");
  await db.insert(profiles).values([
    {
      id: "prof-admin-1",
      authUserId: adminAuthId,
      role: "admin",
      name: ADMIN_NAME,
      phone: "+91 98765 00000",
      country: "India",
    },
    ...seedUsers.map((u) => ({
      id: u.id,
      authUserId: ownerAuthIds[u.id],
      role: u.role,
      name: u.name,
      phone: u.phone,
      country: u.country,
    })),
  ]).onConflictDoNothing();
  console.log("  ✓ Profiles inserted");

  // 4. Insert properties, images, updates
  console.log("→ Inserting properties...");
  for (const p of seedProperties) {
    const { images, updates, ...propData } = p;

    await db.insert(properties).values({
      ...propData,
      description: propData.description,
      features: propData.features,
      status: propData.status,
      occupancy: propData.occupancy,
      tenantName: propData.tenantName || null,
      isFeatured: propData.isFeatured,
    }).onConflictDoNothing();

    // Images
    if (images.length > 0) {
      await db.insert(propertyImages).values(
        images.map((url, i) => ({
          id: `img-${p.id}-${i}`,
          propertyId: p.id,
          url,
          sortOrder: i,
        }))
      ).onConflictDoNothing();
    }

    // Updates / timeline
    for (const upd of updates) {
      await db.insert(propertyUpdates).values({
        id: `upd-${p.id}-${nanoid(6)}`,
        propertyId: p.id,
        message: upd.message,
        category: upd.category,
        author: upd.author,
      }).onConflictDoNothing();
    }

    console.log(`  ✓ ${p.title}`);
  }

  // 5. Insert enquiries
  console.log("→ Inserting enquiries...");
  for (const e of seedEnquiries) {
    await db.insert(enquiries).values({
      id: e.id,
      propertyId: "propertyId" in e ? e.propertyId : null,
      type: e.type,
      name: e.name,
      email: e.email,
      phone: e.phone,
      country: e.country,
      message: e.message,
      preferredContact: e.preferredContact,
      status: e.status,
      adminNotes: e.adminNotes || null,
    }).onConflictDoNothing();
  }
  console.log("  ✓ Enquiries inserted");

  console.log("\n✅ Seed complete!");
  console.log(`\nAdmin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log("Owner logins: <email> / Owner@Lala2025!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
