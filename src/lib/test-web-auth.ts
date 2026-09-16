import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { loginAction } from "@/actions/auth";

async function testWebAuth() {
  console.log("🌐 Testing Web-Based Login & Session Redirection Flow...\n");

  // 1. Admin Login
  console.log("1. Authenticating Admin via loginAction...");
  const adminRes = await loginAction("admin@lalanri.com", "Admin@Lala2025!");
  console.log("   Login result:", adminRes);

  if (!adminRes.success || adminRes.role !== "admin") {
    console.error("❌ Admin login failed!");
    process.exit(1);
  }

  // 2. Owner Login
  console.log("\n2. Authenticating Owner via loginAction...");
  const ownerRes = await loginAction("rajesh.sharma@nri.com", "Owner@Lala2025!");
  console.log("   Login result:", ownerRes);

  if (!ownerRes.success || ownerRes.role !== "owner") {
    console.error("❌ Owner login failed!");
    process.exit(1);
  }

  // 3. Test HTTP Login endpoint directly via Better Auth API
  console.log("\n3. Testing HTTP API endpoint `/api/auth/sign-in/email`...");
  const httpRes = await fetch("http://localhost:3000/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "http://localhost:3000",
    },
    body: JSON.stringify({
      email: "admin@lalanri.com",
      password: "Admin@Lala2025!",
    }),
  });

  console.log("   HTTP API Status:", httpRes.status);
  const setCookieHeader = httpRes.headers.get("set-cookie");
  console.log("   Set-Cookie Header present:", !!setCookieHeader);

  if (setCookieHeader) {
    // Extract token
    const tokenMatch = setCookieHeader.match(/better-auth\.session_token=([^;]+)/);
    if (tokenMatch) {
      const cookieValue = `better-auth.session_token=${tokenMatch[1]}`;
      console.log("   Extracted Cookie:", cookieValue.substring(0, 40) + "...");

      // 4. Test accessing protected /admin route with cookie header
      console.log("\n4. Accessing protected `/admin` route with session cookie...");
      const adminPageRes = await fetch("http://localhost:3000/admin", {
        method: "GET",
        headers: {
          Cookie: cookieValue,
        },
        redirect: "manual",
      });

      console.log("   Protected /admin HTTP Status:", adminPageRes.status);
      if (adminPageRes.status === 200) {
        console.log("   ✅ SUCCESS: Protected /admin page returned 200 OK with valid cookie!");
      } else {
        console.error(`   ❌ FAIL: Unexpected status ${adminPageRes.status}`);
        process.exit(1);
      }
    }
  }

  console.log("\n🎉 Web-based authentication and redirection test COMPLETED SUCCESSFULLY!");
}

testWebAuth().catch((err) => {
  console.error("Web auth test failed:", err);
  process.exit(1);
});
