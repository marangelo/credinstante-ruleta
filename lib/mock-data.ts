// Datos de ejemplo para la demo de UI. No hay backend.

export type Promotor = { nombre: string; usuario: string };
export type Promocion = { nombre: string; vence: string; premioMin: number; premioMax: number };
export type Cliente = {
  nombre: string;
  documento: string;
  telefono: string;
  activo: boolean;
  alDia: boolean;
  yaGiro: boolean;
};
export type Giro = {
  id: string;
  cliente: string;
  hora: string;
  monto: number;
  codigo: string;
  estado: "Entregado";
};

export const SOPORTE_TEL = "2533-6439";

export const promotor: Promotor = { nombre: "Carlos Mendoza", usuario: "cmendoza" };

export const promocion: Promocion = {
  nombre: "Ruleta de la Primavera",
  vence: "31 oct. 2026",
  premioMin: 5,
  premioMax: 500,
};

export const cliente: Cliente = {
  nombre: "María López",
  documento: "001-150389-0012K",
  telefono: "8845-2210",
  activo: true,
  alDia: true,
  yaGiro: false,
};

// Orden de los premios alrededor de la ruleta (sentido horario desde arriba).
export const premiosRuleta = [5, 50, 10, 100, 15, 250, 20, 75, 25, 500, 30, 40] as const;
export const GRAN_PREMIO = 500;

export const girosHoy: Giro[] = [
  { id: "g1", cliente: "Ana Gutiérrez", hora: "10:42", monto: 25, codigo: "RP-7F3K2", estado: "Entregado" },
  { id: "g2", cliente: "José Martínez", hora: "10:05", monto: 10, codigo: "RP-6C1M8", estado: "Entregado" },
  { id: "g3", cliente: "Rosa Herrera", hora: "09:31", monto: 100, codigo: "RP-5B9Q4", estado: "Entregado" },
  { id: "g4", cliente: "Luis Castillo", hora: "09:02", monto: 15, codigo: "RP-4H2T7", estado: "Entregado" },
  { id: "g5", cliente: "Carmen Rivas", hora: "08:47", monto: 50, codigo: "RP-3D8W1", estado: "Entregado" },
  { id: "g6", cliente: "Pedro Álvarez", hora: "08:15", monto: 5, codigo: "RP-2A6N5", estado: "Entregado" },
];

export const resumenHoy = {
  giros: girosHoy.length,
  entregado: girosHoy.reduce((t, g) => t + g.monto, 0),
  premioMayor: Math.max(...girosHoy.map((g) => g.monto)),
};

// Premio de ejemplo para /premio y /voucher.
export const premioEjemplo = {
  monto: 100,
  codigo: "RP-8K4P9",
  fechaHora: "09/10/2026 · 11:18",
  cliente,
  promotor,
};

// Datos de ejemplo para /ya-participo.
export const participacionPrevia = {
  cliente: "Ana Gutiérrez",
  fecha: "07/10/2026 · 15:20",
  monto: 25,
  promotor: promotor.nombre,
};

export const formatMonto = (n: number) => `$${n.toLocaleString("es")}`;

export const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
