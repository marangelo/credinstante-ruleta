"use server";

import { getSesion } from "@/lib/auth";
import { laravelPost, SIN_CONEXION } from "@/lib/laravel";
import type { PremioGanado } from "@/lib/premios";
import { premioGanado } from "@/lib/ruleta";

// En un rechazo, `codigo` es el giro previo del cliente (por ejemplo si la conexión se cortó
// después de que Laravel guardó el giro y el promotor reintentó).
export type ResultadoGiro =
  | { ok: true; idPremio: number; premio: PremioGanado; codigo: string }
  | { ok: false; error: string; codigo?: string };

// El premio lo sortea y guarda Laravel; la app solo anima la rueda hasta ese premio.
// idCredito: el crédito activo con el que se identificó al cliente; Laravel lo valida y lo guarda.
export async function girar(idCliente: number, idCredito: number): Promise<ResultadoGiro> {
  const sesion = await getSesion();

  let res: Response;
  try {
    res = await laravelPost("/ruleta/girar", { id_usuario: sesion.id, id_clientes: idCliente, id_creditos: idCredito });
  } catch {
    return { ok: false, error: SIN_CONEXION };
  }

  const r = await res.json().catch(() => null);
  if (res.ok && r?.CODIGO === "OK") {
    return { ok: true, idPremio: r.GIRO.ID_PREMIO, premio: premioGanado(r.GIRO), codigo: r.GIRO.CODIGO };
  }
  return {
    ok: false,
    error: r?.MENSAJE ?? "No se pudo registrar el giro. Intentá de nuevo.",
    codigo: r?.CODIGO === "YA_PARTICIPO" ? r.GIRO?.CODIGO : undefined,
  };
}
