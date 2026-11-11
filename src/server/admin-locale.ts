"use server";

import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE } from "@/lib/admin-locale";

export async function setAdminLanguage(formData: FormData) {
  const lang = formData.get("lang") === "en" ? "en" : "es";
  const jar = await cookies();
  jar.set(ADMIN_LANG_COOKIE, lang, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
