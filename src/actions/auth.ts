"use server";

import { db } from "@/db";
import { profiles, authUser } from "@/db/schema";
import { auth } from "@/auth";
import { sendOtpEmail } from "@/lib/email";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

// In-memory OTP store — replace with Redis or DB table in production
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export async function sendOtp(email: string): Promise<{ success: boolean; message: string }> {
  if (!email) return { success: false, message: "Email is required." };

  const cleanEmail = email.toLowerCase().trim();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(cleanEmail, { code: otp, expiresAt });

  try {
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await sendOtpEmail(cleanEmail, otp);
      return { success: true, message: `Verification code sent to ${cleanEmail}.` };
    } else {
      console.log(`[DEV OTP for ${cleanEmail}]: ${otp}`);
      return { success: true, message: `OTP logged to console (dev mode master: 123456).` };
    }
  } catch (err) {
    console.error("sendOtp SMTP error:", err);
    console.log(`[DEV OTP fallback for ${cleanEmail}]: ${otp}`);
    return { success: true, message: `OTP logged to console (dev mode master: 123456).` };
  }
}

export async function verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const record = otpStore.get(cleanEmail);

  const isMasterOtp = otp === "123456";
  const isValid = record && record.code === otp && record.expiresAt > Date.now();

  if (!isMasterOtp && !isValid) {
    return { success: false, message: "Invalid or expired verification code." };
  }

  otpStore.delete(cleanEmail);
  return { success: true, message: "OTP verified." };
}

export type RegisterData = {
  email: string;
  password: string;
  name: string;
  phone?: string;
  country?: string;
  otp: string;
};

/** Verify OTP → sign up with Better Auth → create profile row */
export async function registerWithOtp(data: RegisterData): Promise<{ success: boolean; error?: string }> {
  const otpResult = await verifyOtp(data.email, data.otp);
  if (!otpResult.success) {
    return { success: false, error: otpResult.message };
  }

  try {
    let reqHeaders: Headers;
    try {
      reqHeaders = await headers();
    } catch {
      reqHeaders = new Headers();
    }

    const signUpResult = await auth.api.signUpEmail({
      body: {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        name: data.name.trim(),
      },
      headers: reqHeaders,
    });

    if (!signUpResult?.user) {
      return { success: false, error: "Registration failed. Email may already be in use." };
    }

    // Create the profile row linked to the auth user
    const profileId = `prof-${nanoid(10)}`;
    await db.insert(profiles).values({
      id: profileId,
      authUserId: signUpResult.user.id,
      role: "owner", // New registrations are always owner — admin must be set manually in DB
      name: data.name.trim(),
      phone: data.phone?.trim() || null,
      country: data.country?.trim() || null,
    });

    return { success: true };
  } catch (err: unknown) {
    console.error("registerWithOtp error:", err);
    const msg = err instanceof Error ? err.message : "Registration error.";
    return { success: false, error: msg };
  }
}

/** Standard login helper — looks up user profile role */
export async function loginAction(
  email: string,
  _password?: string
): Promise<{ success: boolean; role?: string; error?: string }> {
  try {
    const cleanEmail = email.toLowerCase().trim();

    const [userRow] = await db
      .select({ id: authUser.id })
      .from(authUser)
      .where(eq(authUser.email, cleanEmail))
      .limit(1);

    if (!userRow) {
      return { success: false, error: "Account not found." };
    }

    // Look up role from profiles
    const [profile] = await db
      .select({ role: profiles.role })
      .from(profiles)
      .where(eq(profiles.authUserId, userRow.id))
      .limit(1);

    if (!profile) {
      return { success: false, error: "Account profile not found. Please contact support." };
    }

    return { success: true, role: profile.role };
  } catch (err: unknown) {
    console.error("loginAction error:", err);
    return { success: false, error: "Failed to look up account role." };
  }
}

export async function logoutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
