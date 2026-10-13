// Premios de la ruleta: dinero (monto) u objeto (nombre). Sin acceso a Laravel: se puede usar en el cliente.
import { formatMonto } from "@/lib/mock-data";

export type TipoPremio = "DINERO" | "OBJETO";

/** Premio configurado en la promoción. `peso` es la probabilidad relativa (1 = igual que los demás). */
export type Premio = { id: number; tipo: TipoPremio; monto: number | null; nombre: string | null; peso: number };

/** Premio que salió en un giro. `premio` es el nombre del objeto. */
export type PremioGanado = { tipo: TipoPremio; monto: number | null; premio: string | null };

/** "$300" o "Gorra" */
export function textoPremio(p: PremioGanado) {
  return p.tipo === "OBJETO" ? (p.premio ?? "Premio") : formatMonto(p.monto ?? 0);
}

/** "Premios de $100 a $500 y Gorra", según lo que tenga la promoción */
export function resumenPremios(montos: number[], objetos: string[]) {
  const dinero =
    montos.length > 1
      ? `de ${formatMonto(Math.min(...montos))} a ${formatMonto(Math.max(...montos))}`
      : montos.length === 1
        ? `de ${formatMonto(montos[0])}`
        : null;
  const cosas = objetos.length === 0 ? null : objetos.length <= 2 ? objetos.join(" y ") : `${objetos.length} objetos`;

  if (dinero && cosas) return `Premios ${dinero} y ${cosas}`;
  if (dinero) return `${montos.length > 1 ? "Premios" : "Premio"} ${dinero}`;
  if (cosas) return `${objetos.length > 1 ? "Premios" : "Premio"}: ${cosas}`;
  return "Sin premios";
}
