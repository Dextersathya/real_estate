import { requireAdmin } from "@/auth/session";
import { redirect } from "next/navigation";
import { getSiteContent } from "@/actions/content";
import ContentEditorClient from "./ContentEditorClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Content CMS — Admin | Lala NRI Realty",
};

export default async function AdminContentPage() {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/login");
  }

  const initialContent = await getSiteContent();

  return (
    <ContentEditorClient
      initialContent={initialContent}
      adminName={session.profile.name}
    />
  );
}
