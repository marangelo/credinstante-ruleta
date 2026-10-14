// Datos de ejemplo para la demo de UI. No hay backend.

export type Promotor = { nombre: string; usuario: string };
export type Cliente = {
  nombre: string;
  documento: string;
  telefono: string;
  activo: boolean;
  alDia: boolean;
  yaGiro: boolean;
};

export const SOPORTE_TEL = "2533-6439";

export const promotor: Promotor = { nombre: "Carlos Mendoza", usuario: "cmendoza" };

export const cliente: Cliente = {
  nombre: "María López",
  documento: "001-150389-0012K",
  telefono: "8845-2210",
  activo: true,
  alDia: true,
  yaGiro: false,
};

// Datos de ejemplo para /ya-participo.
export const participacionPrevia = {
  cliente: "Ana Gutiérrez",
  fecha: "07/10/2026 · 15:20",
  monto: 25,
  promotor: promotor.nombre,
};

// Córdobas, con separador de miles con coma (C$1,100)
export const formatMonto = (n: number) => `C$${n.toLocaleString("es-NI")}`;

export const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
