"use server";

import { getSesion } from "@/lib/auth";
import { laravelPost, SIN_CONEXION } from "@/lib/laravel";
import type { PremioGanado, TipoPremio } from "@/lib/premios";

export type ClienteRuleta = {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  zona: string | null;
  activo: boolean;
};

export type Participacion = PremioGanado & { fecha: string; codigo: string; promotor: string | null };

// Crédito activo con el que se identificó al cliente.
export type CreditoActivo = { id: number; estado: number };

export type BusquedaState = {
  cedula?: string;
  credito?: string; // lo que escribió el promotor
  error?: string;
  campoError?: "cedula" | "credito"; // campo a marcar como inválido, si el error es de uno solo
  cliente?: ClienteRuleta;
  creditoActivo?: CreditoActivo;
  promocion?: string | null; // nombre de la promoción vigente, null si no hay
  participacion?: Participacion | null;
};

type RespuestaLaravel = {
  CODIGO: string;
  MENSAJE?: string;
  CLIENTE?: { ID: number; NOMBRE: string; CEDULA: string; TELEFONO: string; ZONA: string | null; ACTIVO: boolean };
  CREDITO?: { ID: number; ESTADO: number } | null;
  PROMOCION?: { ID: number; NOMBRE: string } | null;
  PARTICIPACION?: {
    FECHA: string;
    TIPO: TipoPremio;
    MONTO: number | null;
    PREMIO: string | null;
    CODIGO: string;
    PROMOTOR: string | null;
  } | null;
};

export async function buscarCliente(_prev: BusquedaState, formData: FormData): Promise<BusquedaState> {
  await getSesion();

  const cedula = String(formData.get("cedula") ?? "").trim();
  const credito = String(formData.get("credito") ?? "").trim();
  const base = { cedula, credito };

  if (cedula.replace(/[^0-9a-z]/gi, "").length < 5) {
    return { ...base, campoError: "cedula", error: "Escribí la cédula completa del cliente." };
  }
  // El número de crédito es un entero (id del crédito en Credinstantes)
  if (!/^\d{1,10}$/.test(credito) || Number(credito) < 1) {
    return { ...base, campoError: "credito", error: "Escribí el número de crédito, solo con números." };
  }

  let res: Response;
  try {
    // Laravel solo encuentra al cliente si el crédito está activo y es de esa cédula
    res = await laravelPost("/ruleta/cliente", { cedula, credito: Number(credito) });
  } catch {
    return { ...base, error: SIN_CONEXION };
  }

  if (res.status === 404) {
    const r = (await res.json().catch(() => ({}))) as RespuestaLaravel;
    switch (r.CODIGO) {
      case "NO_COINCIDE":
        return { ...base, error: "Ese número de crédito no pertenece a la cédula ingresada. Revisá los dos datos." };
      case "CREDITO_INACTIVO":
        return { ...base, campoError: "credito", error: "Ese crédito ya no está activo. Pedile al cliente el número de su crédito vigente." };
      default:
        return { ...base, campoError: "credito", error: "No encontramos ese número de crédito. Revisalo e intentá de nuevo." };
    }
  }
  if (!res.ok) return { ...base, error: "El servidor no respondió bien. Intentá de nuevo en un momento." };

  const r = (await res.json()) as RespuestaLaravel;
  const c = r.CLIENTE!;

  return {
    ...base,
    cliente: { id: c.ID, nombre: c.NOMBRE, cedula: c.CEDULA, telefono: c.TELEFONO, zona: c.ZONA, activo: c.ACTIVO },
    creditoActivo: r.CREDITO ? { id: r.CREDITO.ID, estado: r.CREDITO.ESTADO } : undefined,
    promocion: r.PROMOCION?.NOMBRE ?? null,
    participacion: r.PARTICIPACION
      ? {
          fecha: r.PARTICIPACION.FECHA,
          tipo: r.PARTICIPACION.TIPO,
          monto: r.PARTICIPACION.MONTO,
          premio: r.PARTICIPACION.PREMIO,
          codigo: r.PARTICIPACION.CODIGO,
          promotor: r.PARTICIPACION.PROMOTOR,
        }
      : null,
  };
}
