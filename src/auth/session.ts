/**
 * session.ts — server-side session helper.
 *
 * Call `getServerSession()` in any Server Component or Server Action to get
 * the current user + their profile (including role).
 * Never trust client-supplied role or owner ID.
 */

import { headers } from "next/headers";
import { auth } from "./index";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export type ServerProfile = {
  id: string;
  authUserId: string;
  role: "owner" | "admin";
  name: string;
  phone: string | null;
  country: string | null;
  avatarUrl: string | null;
};

export type ServerSession = {
  authUser: { id: string; email: string; name: string };
  profile: ServerProfile;
};

/**
 * Returns the current session with the profile row from our DB.
 * Returns null if not authenticated.
 */
export async function getServerSession(): Promise<ServerSession | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.authUserId, session.user.id))
    .limit(1);

  if (!profile) return null;

  return {
    authUser: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    profile: {
      id: profile.id,
      authUserId: profile.authUserId,
      role: profile.role,
      name: profile.name,
      phone: profile.phone,
      country: profile.country,
      avatarUrl: profile.avatarUrl,
    },
  };
}

/** Throws if not authenticated. */
export async function requireSession(): Promise<ServerSession> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

/** Throws if not admin. */
export async function requireAdmin(): Promise<ServerSession> {
  const session = await requireSession();
  if (session.profile.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/** Throws if not the owner of the given profileId or not admin. */
export async function requireOwnerOrAdmin(
  profileId: string
): Promise<ServerSession> {
  const session = await requireSession();
  if (
    session.profile.role !== "admin" &&
    session.profile.id !== profileId
  ) {
    throw new Error("FORBIDDEN");
  }
  return session;
}
