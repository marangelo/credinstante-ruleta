"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { laravelPost, SIN_CONEXION } from "@/lib/laravel";
import { firmarSesion, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export type LoginState = { error?: string; usuario?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const clave = String(formData.get("clave") ?? "");

  if (!usuario || !clave) return { error: "Ingresá tu usuario y contraseña.", usuario };

  let res: Response;
  try {
    res = await laravelPost("/ruleta/login", { usuario, clave });
  } catch {
    return { error: SIN_CONEXION, usuario };
  }

  if (res.status === 429) return { error: "Demasiados intentos. Esperá un minuto e intentá de nuevo.", usuario };
  if (res.status === 401 || res.status === 422) return { error: "Usuario o contraseña incorrectos.", usuario };
  if (!res.ok) return { error: "El servidor no respondió bien. Intentá de nuevo en un momento.", usuario };

  const p = (await res.json()) as { id: number; nombre: string; usuario: string; rol: number; zona: number };

  (await cookies()).set(SESSION_COOKIE, await firmarSesion(p), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "1",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/inicio");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
