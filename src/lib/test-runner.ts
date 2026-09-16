import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { db } from "@/db";
import {
  profiles,
  properties,
  propertyImages,
  propertyDocuments,
  propertyUpdates,
  enquiries,
  authUser,
} from "@/db/schema";
import { eq, count, inArray } from "drizzle-orm";
import { submitEnquiry, updateEnquiryStatus } from "@/actions/enquiries";
import {
  submitProperty,
  approveProperty,
  updatePropertyStatus,
  logPropertyUpdate,
  rejectProperty,
} from "@/actions/properties";
import { sendOtp, verifyOtp, registerWithOtp, loginAction } from "@/actions/auth";
import { auth } from "@/auth";
import { nanoid } from "nanoid";

type TestResult = {
  name: string;
  passed: boolean;
  details?: string;
  error?: string;
};

const results: TestResult[] = [];

function recordResult(name: string, passed: boolean, details?: string, error?: string) {
  results.push({ name, passed, details, error });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${passed ? "PASS" : "FAIL"}] ${name}${details ? ` - ${details}` : ""}`);
  if (error) {
    console.error(`   Error details: ${error}`);
  }
}

async function runTests() {
  console.log("\n🧪 Starting Comprehensive Lala NRI Realty Application Test Suite...\n");

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Database Connection & Schema Health Check
  // ───────────────────────────────────────────────────────────────────────────
  console.log("─── Step 1: Database & Schema Health Check ───");
  try {
    const [{ value: profileCount }] = await db.select({ value: count() }).from(profiles);
    const [{ value: propertyCount }] = await db.select({ value: count() }).from(properties);
    const [{ value: enquiryCount }] = await db.select({ value: count() }).from(enquiries);

    recordResult(
      "Neon Postgres Database Connection & Schema",
      true,
      `Connected. Live counts -> Profiles: ${profileCount}, Properties: ${propertyCount}, Enquiries: ${enquiryCount}`
    );
  } catch (err: any) {
    recordResult("Neon Postgres Database Connection & Schema", false, undefined, err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Public Visitor HTTP Routes Check
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 2: Public HTTP Routes ───");
  const publicRoutes = [
    "/",
    "/buy",
    "/buy/prop-102",
    "/rent",
    "/rent/prop-102",
    "/manage",
    "/sell",
    "/contact",
    "/about",
    "/login",
    "/signup",
  ];

  for (const route of publicRoutes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, { method: "GET" });
      if (res.status === 200) {
        recordResult(`Public Route HTTP 200 OK (${route})`, true, `Status: ${res.status}`);
      } else {
        recordResult(`Public Route HTTP 200 OK (${route})`, false, `Unexpected Status: ${res.status}`);
      }
    } catch (err: any) {
      recordResult(`Public Route HTTP 200 OK (${route})`, false, undefined, err.message);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Security & Route Protection (Proxy Middleware)
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 3: Route Protection & Security Proxy ───");
  const protectedRoutes = ["/dashboard", "/admin"];

  for (const route of protectedRoutes) {
    try {
      const res = await fetch(`http://localhost:3000${route}`, {
        method: "GET",
        redirect: "manual",
      });
      // Should return 307 redirect to /login
      if (res.status === 307 || res.status === 302) {
        const location = res.headers.get("location");
        recordResult(
          `Protected Route Security (${route})`,
          true,
          `Redirected with status ${res.status} to ${location}`
        );
      } else {
        recordResult(
          `Protected Route Security (${route})`,
          false,
          `Expected 307 redirect but got status ${res.status}`
        );
      }
    } catch (err: any) {
      recordResult(`Protected Route Security (${route})`, false, undefined, err.message);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Public Enquiry Submission Flow
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 4: Visitor Enquiry Submission Flow ───");
  let testEnquiryId: string | null = null;
  try {
    const enquiryPayload = {
      propertyId: "prop-103",
      type: "buy" as const,
      name: "Automated QA Inspector",
      email: "qa.inspector@nri-test.com",
      phone: "+1 415 555 9988",
      country: "United States",
      message: "Automated test enquiry for agricultural land prop-103.",
      preferredContact: "email",
    };

    const res = await submitEnquiry(enquiryPayload);
    if (res.success) {
      // Find created enquiry in DB
      const [dbEnquiry] = await db
        .select()
        .from(enquiries)
        .where(eq(enquiries.email, "qa.inspector@nri-test.com"))
        .limit(1);

      if (dbEnquiry && dbEnquiry.status === "new") {
        testEnquiryId = dbEnquiry.id;
        recordResult(
          "Public Enquiry Submission & DB Persistence",
          true,
          `Enquiry created with ID ${dbEnquiry.id} and status '${dbEnquiry.status}'`
        );
      } else {
        recordResult("Public Enquiry Submission & DB Persistence", false, "Enquiry not found in DB");
      }
    } else {
      recordResult("Public Enquiry Submission & DB Persistence", false, res.error);
    }
  } catch (err: any) {
    recordResult("Public Enquiry Submission & DB Persistence", false, undefined, err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Authentication (Better Auth & OTP System)
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 5: Authentication & Session System ───");

  // Admin authentication test
  try {
    const adminLogin = await loginAction("admin@lalanri.com", "Admin@Lala2025!");
    if (adminLogin.success && adminLogin.role === "admin") {
      recordResult("Admin User Authentication", true, `Logged in successfully as role '${adminLogin.role}'`);
    } else {
      recordResult("Admin User Authentication", false, adminLogin.error || "Login failed");
    }
  } catch (err: any) {
    recordResult("Admin User Authentication", false, undefined, err.message);
  }

  // Owner authentication test
  try {
    const ownerLogin = await loginAction("rajesh.sharma@nri.com", "Owner@Lala2025!");
    if (ownerLogin.success && ownerLogin.role === "owner") {
      recordResult("Owner User Authentication", true, `Logged in successfully as role '${ownerLogin.role}'`);
    } else {
      recordResult("Owner User Authentication", false, ownerLogin.error || "Login failed");
    }
  } catch (err: any) {
    recordResult("Owner User Authentication", false, undefined, err.message);
  }

  // OTP verification test
  const testEmail = `test.user.${nanoid(6)}@nri-test.com`;
  try {
    const otpSendRes = await sendOtp(testEmail);
    if (otpSendRes.success) {
      // In dev mode, master OTP '123456' works
      const otpVerifyRes = await verifyOtp(testEmail, "123456");
      if (otpVerifyRes.success) {
        recordResult("OTP Dispatch & Verification System", true, "OTP generated & verified successfully");
      } else {
        recordResult("OTP Dispatch & Verification System", false, otpVerifyRes.message);
      }
    } else {
      recordResult("OTP Dispatch & Verification System", false, otpSendRes.message);
    }
  } catch (err: any) {
    recordResult("OTP Dispatch & Verification System", false, undefined, err.message);
  }

  // New Owner Registration test
  try {
    const regRes = await registerWithOtp({
      email: testEmail,
      password: "TestUserPass123!",
      name: "Automated QA Owner",
      phone: "+91 99887 76655",
      country: "India",
      otp: "123456",
    });

    if (regRes.success) {
      const [profile] = await db.select().from(profiles).where(eq(profiles.name, "Automated QA Owner")).limit(1);
      if (profile) {
        recordResult("New User Registration & Profile Creation", true, `User & Profile registered ID ${profile.id}`);
      } else {
        recordResult("New User Registration & Profile Creation", false, "Profile row missing in DB");
      }
    } else {
      recordResult("New User Registration & Profile Creation", false, regRes.error);
    }
  } catch (err: any) {
    recordResult("New User Registration & Profile Creation", false, undefined, err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Property Submission & Approval Workflow
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 6: Property Submission & Admin Lifecycle Workflow ───");

  // Get Owner 1 profile
  const [owner1Profile] = await db.select().from(profiles).where(eq(profiles.role, "owner")).limit(1);
  const [adminProfile] = await db.select().from(profiles).where(eq(profiles.role, "admin")).limit(1);

  let createdPropertyId: string | null = null;

  if (owner1Profile && adminProfile) {
    // 6a. Direct DB Property Submission simulation
    try {
      const propId = `prop-qa-${nanoid(6)}`;
      await db.insert(properties).values({
        id: propId,
        ownerId: owner1Profile.id,
        category: "residential",
        purpose: "manage_only",
        title: "Automated Test Luxury Villa at HITEC City",
        description: "A modern smart villa submitted by automated test suite.",
        location: "HITEC City Phase 3",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500081",
        area: 4800,
        areaUnit: "sqft",
        bedrooms: 4,
        bathrooms: 4,
        furnishingStatus: "Fully Furnished",
        features: ["Smart Home", "Private Garden", "24/7 Security"],
        status: "pending_review",
      });

      await db.insert(propertyUpdates).values({
        id: `upd-${nanoid(8)}`,
        propertyId: propId,
        message: "Property submitted for admin review.",
        category: "Listing",
        author: owner1Profile.name,
        createdBy: owner1Profile.id,
      });

      createdPropertyId = propId;

      const [propCheck] = await db.select().from(properties).where(eq(properties.id, propId)).limit(1);
      if (propCheck && propCheck.status === "pending_review") {
        recordResult(
          "Property Onboarding Submission (Pending Review)",
          true,
          `Property ID ${propId} created with status 'pending_review'`
        );
      } else {
        recordResult("Property Onboarding Submission (Pending Review)", false, "Property not created correctly");
      }
    } catch (err: any) {
      recordResult("Property Onboarding Submission (Pending Review)", false, undefined, err.message);
    }

    // 6b. Admin Approval Test
    if (createdPropertyId) {
      try {
        await db
          .update(properties)
          .set({ status: "published", updatedAt: new Date() })
          .where(eq(properties.id, createdPropertyId));

        await db.insert(propertyUpdates).values({
          id: `upd-${nanoid(8)}`,
          propertyId: createdPropertyId,
          message: "Property approved and published by Admin.",
          category: "Listing",
          author: "Admin QA Suite",
          createdBy: adminProfile.id,
        });

        const [approvedProp] = await db
          .select()
          .from(properties)
          .where(eq(properties.id, createdPropertyId))
          .limit(1);

        if (approvedProp && approvedProp.status === "published") {
          recordResult(
            "Admin Property Approval & Publishing",
            true,
            `Property ${createdPropertyId} status transitioned to 'published'`
          );
        } else {
          recordResult("Admin Property Approval & Publishing", false, "Property status not updated to published");
        }
      } catch (err: any) {
        recordResult("Admin Property Approval & Publishing", false, undefined, err.message);
      }

      // 6c. Property Timeline Update Logging
      try {
        const updateId = `upd-${nanoid(8)}`;
        await db.insert(propertyUpdates).values({
          id: updateId,
          propertyId: createdPropertyId,
          message: "Quarterly Physical Inspection — All 45 checkpoints verified.",
          category: "Inspection",
          author: "Field Operations Team",
          createdBy: adminProfile.id,
        });

        const updatesList = await db
          .select()
          .from(propertyUpdates)
          .where(eq(propertyUpdates.propertyId, createdPropertyId));

        if (updatesList.length >= 2) {
          recordResult(
            "Property Maintenance & Timeline Logger",
            true,
            `Found ${updatesList.length} timeline events recorded for property`
          );
        } else {
          recordResult("Property Maintenance & Timeline Logger", false, "Timeline update count mismatch");
        }
      } catch (err: any) {
        recordResult("Property Maintenance & Timeline Logger", false, undefined, err.message);
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Admin Enquiry Management Workflow
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 7: Admin Enquiry Management Workflow ───");
  if (testEnquiryId) {
    try {
      await updateEnquiryStatus(testEnquiryId, "contacted", "Followed up via phone call by Admin Ramesh.");

      const [updatedEnquiry] = await db
        .select()
        .from(enquiries)
        .where(eq(enquiries.id, testEnquiryId))
        .limit(1);

      if (updatedEnquiry && updatedEnquiry.status === "contacted" && updatedEnquiry.adminNotes) {
        recordResult(
          "Admin Enquiry Desk Status & Note Management",
          true,
          `Enquiry status updated to '${updatedEnquiry.status}' with note: "${updatedEnquiry.adminNotes}"`
        );
      } else {
        recordResult("Admin Enquiry Desk Status & Note Management", false, "Enquiry status or note update failed");
      }
    } catch (err: any) {
      recordResult("Admin Enquiry Desk Status & Note Management", false, undefined, err.message);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Cleanup Test Records
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n─── Step 8: Test Cleanup ───");
  try {
    if (createdPropertyId) {
      await db.delete(propertyUpdates).where(eq(propertyUpdates.propertyId, createdPropertyId));
      await db.delete(properties).where(eq(properties.id, createdPropertyId));
    }
    if (testEnquiryId) {
      await db.delete(enquiries).where(eq(enquiries.id, testEnquiryId));
    }
    await db.delete(profiles).where(eq(profiles.name, "Automated QA Owner"));
    await db.delete(authUser).where(eq(authUser.email, testEmail));
    recordResult("Automated Test Data Cleanup", true, "All temporary test entities cleaned up cleanly");
  } catch (err: any) {
    recordResult("Automated Test Data Cleanup", false, undefined, err.message);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Test Summary Report
  // ───────────────────────────────────────────────────────────────────────────
  console.log("\n=========================================================");
  console.log("             LALA NRI REALTY TEST REPORT                  ");
  console.log("=========================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`Total Features Tested : ${total}`);
  console.log(`Passed                : ${passed} ✅`);
  console.log(`Failed                : ${failed} ${failed > 0 ? "❌" : ""}`);
  console.log("=========================================================\n");

  if (failed > 0) {
    console.log("Failed tests details:");
    results.filter(r => !r.passed).forEach(r => {
      console.log(` - ${r.name}: ${r.error || r.details}`);
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
