import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { leerSesion, SESSION_COOKIE, type Sesion } from "@/lib/session";

// Sesión actual; el middleware ya garantiza que exista en las pantallas protegidas.
export async function getSesion(): Promise<Sesion> {
  const sesion = await leerSesion((await cookies()).get(SESSION_COOKIE)?.value);
  if (!sesion) redirect("/login");
  return sesion;
}
