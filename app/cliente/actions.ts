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

export type BusquedaState = {
  cedula?: string;
  error?: string;
  cliente?: ClienteRuleta;
  promocion?: string | null; // nombre de la promoción vigente, null si no hay
  participacion?: Participacion | null;
};

type RespuestaLaravel = {
  CODIGO: string;
  MENSAJE?: string;
  CLIENTE?: { ID: number; NOMBRE: string; CEDULA: string; TELEFONO: string; ZONA: string | null; ACTIVO: boolean };
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
  if (cedula.replace(/[^0-9a-z]/gi, "").length < 5) {
    return { cedula, error: "Escribí la cédula completa del cliente." };
  }

  let res: Response;
  try {
    res = await laravelPost("/ruleta/cliente", { cedula });
  } catch {
    return { cedula, error: SIN_CONEXION };
  }

  if (res.status === 404) return { cedula, error: "No encontramos un cliente con esa cédula. Revisala e intentá de nuevo." };
  if (!res.ok) return { cedula, error: "El servidor no respondió bien. Intentá de nuevo en un momento." };

  const r = (await res.json()) as RespuestaLaravel;
  const c = r.CLIENTE!;

  return {
    cedula,
    cliente: { id: c.ID, nombre: c.NOMBRE, cedula: c.CEDULA, telefono: c.TELEFONO, zona: c.ZONA, activo: c.ACTIVO },
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
