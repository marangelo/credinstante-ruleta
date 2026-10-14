// Datos de la ruleta desde Laravel. Solo servidor.
import { laravelPost } from "@/lib/laravel";
import type { Premio, PremioGanado, TipoPremio } from "@/lib/premios";

export type Preparacion = {
  cliente: { id: number; nombre: string; cedula: string; activo: boolean };
  promocion: { nombre: string; premios: Premio[] } | null;
  yaParticipo: boolean;
};

export type GiroDetalle = PremioGanado & {
  codigo: string;
  fecha: string; // "YYYY-MM-DD HH:mm:ss"
  cliente: string;
  cedula: string;
  credito: number | null; // crédito con el que se giró (null en giros anteriores a guardarlo)
  promotor: string | null;
  promocion: string;
};

// Respuesta de Laravel para el premio de un giro
type PremioLaravel = { TIPO: TipoPremio; MONTO: number | null; PREMIO: string | null };
export const premioGanado = (g: PremioLaravel): PremioGanado => ({ tipo: g.TIPO, monto: g.MONTO, premio: g.PREMIO });

type PremioConfigLaravel = { ID: number; TIPO: TipoPremio; MONTO: number | null; NOMBRE: string | null; PESO: number };
const premio = (p: PremioConfigLaravel): Premio => ({ id: p.ID, tipo: p.TIPO, monto: p.MONTO, nombre: p.NOMBRE, peso: p.PESO });

/** Cliente + premios de la promoción vigente. null si el cliente no existe. */
export async function prepararRuleta(idCliente: number): Promise<Preparacion | null> {
  const res = await laravelPost("/ruleta/preparar", { id_clientes: idCliente });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Laravel respondió ${res.status} en /ruleta/preparar`);
  const r = await res.json();
  return {
    cliente: { id: r.CLIENTE.ID, nombre: r.CLIENTE.NOMBRE, cedula: r.CLIENTE.CEDULA, activo: r.CLIENTE.ACTIVO },
    promocion: r.PROMOCION ? { nombre: r.PROMOCION.NOMBRE, premios: r.PROMOCION.PREMIOS.map(premio) } : null,
    yaParticipo: r.PARTICIPACION !== null,
  };
}

/** Giro registrado, por su código. null si no existe. */
export async function giroPorCodigo(codigo: string): Promise<GiroDetalle | null> {
  // Código numérico de 8 dígitos; los primeros giros usaban RP-XXXXXX y se siguen pudiendo abrir
  if (!/^(\d{8}|RP-[0-9A-F]{6})$/i.test(codigo)) return null;
  const res = await laravelPost("/ruleta/giro", { codigo });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Laravel respondió ${res.status} en /ruleta/giro`);
  const g = (await res.json()).GIRO;
  return {
    ...premioGanado(g),
    codigo: g.CODIGO,
    fecha: g.FECHA,
    cliente: g.CLIENTE,
    cedula: g.CEDULA,
    credito: g.CREDITO ?? null,
    promotor: g.PROMOTOR,
    promocion: g.PROMOCION,
  };
}

export type Periodo = "hoy" | "semana" | "mes";

export type MisGiros = {
  /** entregado y mayor solo cuentan dinero; objetos es la cantidad de objetos entregados */
  resumen: { giros: number; entregado: number; mayor: number; objetos: number };
  giros: (PremioGanado & { codigo: string; fecha: string; cliente: string; zona: string | null })[];
  promocion: { nombre: string; vence: string; montos: number[]; objetos: string[] } | null;
};

/** Giros del promotor en el período, con resumen y la promoción vigente. */
export async function misGiros(idUsuario: number, periodo: Periodo): Promise<MisGiros> {
  const res = await laravelPost("/ruleta/mis-giros", { id_usuario: idUsuario, periodo });
  if (!res.ok) throw new Error(`Laravel respondió ${res.status} en /ruleta/mis-giros`);
  const r = await res.json();
  const p = r.PROMOCION;
  return {
    resumen: { giros: r.RESUMEN.GIROS, entregado: r.RESUMEN.ENTREGADO, mayor: r.RESUMEN.MAYOR, objetos: r.RESUMEN.OBJETOS },
    giros: r.GIROS.map((g: PremioLaravel & { CODIGO: string; FECHA: string; CLIENTE: string; ZONA?: string | null }) => ({
      ...premioGanado(g),
      codigo: g.CODIGO,
      fecha: g.FECHA,
      cliente: g.CLIENTE,
      zona: g.ZONA ?? null,
    })),
    promocion: p
      ? {
          nombre: p.NOMBRE,
          vence: p.VENCE,
          montos: p.MIN === null ? [] : p.MIN === p.MAX ? [p.MIN] : [p.MIN, p.MAX],
          objetos: p.OBJETOS,
        }
      : null,
  };
}

/** "2026-10-13 11:30:35" -> "11:30" */
export const hora = (f: string) => (f.split(" ")[1] ?? "").slice(0, 5);

/** "2026-10-13 11:30:35" -> "13/10 · 11:30" */
export function diaHora(f: string) {
  const [d] = f.split(" ");
  const [, m, dd] = d.split("-");
  return `${dd}/${m} · ${hora(f)}`;
}

/** "2026-10-31" -> "31 oct. 2026" */
export function fechaLarga(d: string) {
  return new Date(`${d}T12:00:00`).toLocaleDateString("es-NI", { day: "numeric", month: "short", year: "numeric" });
}

/** "2026-10-13 11:30:35" -> "13/10/2026 · 11:30" */
export function fechaHora(f: string) {
  const [d, h = ""] = f.split(" ");
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y} · ${h.slice(0, 5)}`;
}
