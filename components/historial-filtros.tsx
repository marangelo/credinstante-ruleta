"use client";

import { useState } from "react";

const filtros = ["Hoy", "Esta semana", "Este mes"] as const;

// Filtros visuales del historial. Solo cambian el estado activo; la lista no se filtra.
export function HistorialFiltros() {
  const [activo, setActivo] = useState<(typeof filtros)[number]>("Hoy");
  return (
    <div role="group" aria-label="Período" className="flex gap-2">
      {filtros.map((f) => {
        const on = f === activo;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={on}
            onClick={() => setActivo(f)}
            className={`h-11 rounded-full px-4 text-[14px] transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
              on ? "bg-green font-bold text-white" : "border-2 border-green-light bg-white font-semibold text-ink"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
