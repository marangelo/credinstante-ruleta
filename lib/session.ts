// Sesión del promotor en una cookie firmada con HMAC-SHA256 (Web Crypto: corre en middleware y en el servidor).
// Laravel solo verifica las credenciales; la sesión vive aquí.

export type Sesion = {
  id: number;
  nombre: string;
  usuario: string;
  rol: number;
  zona: number;
  exp: number; // epoch en segundos
};

export const SESSION_COOKIE = "ruleta_sesion";
export const SESSION_MAX_AGE = 60 * 60 * 12; // una jornada

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function clave(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Falta SESSION_SECRET");
  return crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export async function firmarSesion(datos: Omit<Sesion, "exp">): Promise<string> {
  const sesion: Sesion = { ...datos, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const payload = b64url(enc.encode(JSON.stringify(sesion)));
  const firma = await crypto.subtle.sign("HMAC", await clave(), enc.encode(payload));
  return `${payload}.${b64url(new Uint8Array(firma))}`;
}

export async function leerSesion(token: string | undefined): Promise<Sesion | null> {
  if (!token) return null;
  const [payload, firma] = token.split(".");
  if (!payload || !firma) return null;
  try {
    const valida = await crypto.subtle.verify("HMAC", await clave(), fromB64url(firma), enc.encode(payload));
    if (!valida) return null;
    const sesion = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as Sesion;
    return sesion.exp > Date.now() / 1000 ? sesion : null;
  } catch {
    return null;
  }
}
