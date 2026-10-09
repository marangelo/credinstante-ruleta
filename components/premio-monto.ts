import { premioEjemplo, premiosRuleta } from "@/lib/mock-data";

export type MontoSearchParams = Promise<{ monto?: string | string[] }>;

// Lee ?monto= y solo acepta montos que existen en la ruleta; si no, usa el premio de ejemplo.
export async function leerMonto(searchParams: MontoSearchParams) {
  const { monto } = await searchParams;
  const n = Number(Array.isArray(monto) ? monto[0] : monto);
  return (premiosRuleta as readonly number[]).includes(n) ? n : premioEjemplo.monto;
}
