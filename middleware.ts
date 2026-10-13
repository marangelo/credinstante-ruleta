import { NextResponse, type NextRequest } from "next/server";
import { leerSesion, SESSION_COOKIE } from "@/lib/session";

// Pantallas que no requieren sesión.
const PUBLICAS = ["/login", "/sin-conexion"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sesion = await leerSesion(req.cookies.get(SESSION_COOKIE)?.value);
  const publica = PUBLICAS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!sesion && !publica) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }
  if (sesion && pathname === "/login") {
    return NextResponse.redirect(new URL("/inicio", req.url));
  }
  return NextResponse.next();
}

export const config = {
  // Todo menos assets estáticos de Next y archivos de /public.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
