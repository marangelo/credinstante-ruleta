import Link from "next/link";
import type { Periodo } from "@/lib/ruleta";

export const PERIODOS: { valor: Periodo; label: string }[] = [
  { valor: "hoy", label: "Hoy" },
  { valor: "semana", label: "Esta semana" },
  { valor: "mes", label: "Este mes" },
];

// Filtro de período del historial: cada opción es un enlace (?periodo=), así queda en la URL.
export function HistorialFiltros({ activo }: { activo: Periodo }) {
  return (
    <nav aria-label="Período" className="flex gap-2">
      {PERIODOS.map((p) => {
        const on = p.valor === activo;
        return (
          <Link
            key={p.valor}
            href={p.valor === "hoy" ? "/historial" : `/historial?periodo=${p.valor}`}
            aria-current={on ? "page" : undefined}
            replace
            scroll={false}
            className={`flex h-11 items-center rounded-full px-4 text-[14px] no-underline transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
              on ? "bg-green font-bold text-white" : "border-2 border-green-light bg-white font-semibold text-ink"
            }`}
          >
            {p.label}
          </Link>
        );
      })}
    </nav>
  );
}
