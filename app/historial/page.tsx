import Link from "next/link";
import { Gift } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { HistorialFiltros, PERIODOS } from "@/components/historial-filtros";
import { Pill } from "@/components/Pill";
import { getSesion } from "@/lib/auth";
import { formatMonto } from "@/lib/mock-data";
import { textoPremio, type PremioGanado } from "@/lib/premios";
import { diaHora, hora, misGiros, type Periodo } from "@/lib/ruleta";

// Color de la moneda según el premio: objetos en lima, dinero según el monto.
const coinTone = (p: PremioGanado) =>
  p.tipo === "OBJETO"
    ? "bg-lime text-white"
    : (p.monto ?? 0) >= 100
      ? "bg-brand-blue text-white"
      : (p.monto ?? 0) >= 50
        ? "bg-gold text-navy"
        : "bg-green-light text-green-dark";

const titulos: Record<Periodo, string> = { hoy: "Mis giros de hoy", semana: "Mis giros de la semana", mes: "Mis giros del mes" };

export default async function HistorialPage({ searchParams }: { searchParams: Promise<{ periodo?: string }> }) {
  const pedido = (await searchParams).periodo;
  const periodo: Periodo = PERIODOS.some((p) => p.valor === pedido) ? (pedido as Periodo) : "hoy";

  const promotor = await getSesion();
  const { resumen, giros } = await misGiros(promotor.id, periodo);

  const tarjetas = [
    { label: "Giros", value: String(resumen.giros), gold: false },
    { label: "Entregado", value: formatMonto(resumen.entregado), gold: true },
    // Con objetos entregados, el tercer dato es cuántos; si no, el premio mayor en dinero
    resumen.objetos > 0
      ? { label: "Objetos", value: String(resumen.objetos), gold: false }
      : { label: "Premio mayor", value: formatMonto(resumen.mayor), gold: false },
  ];

  return (
    <main className="stagger relative min-h-dvh px-5 pb-[110px] pt-6">
      <header className="flex items-center gap-2.5">
        <BackButton href="/inicio" label="Volver al inicio" />
        <h1 className="font-display text-[22px] font-black text-brand-blue">{titulos[periodo]}</h1>
      </header>

      <dl className="mt-[18px] grid grid-cols-3 gap-2 rounded-[24px] bg-brand-blue px-5 py-[18px] text-white">
        {tarjetas.map((r) => (
          <div key={r.label} className="flex min-w-0 flex-col gap-0.5">
            <dt className="text-[12px] text-[#C9D6F2]">{r.label}</dt>
            <dd className={`truncate font-display text-[24px] font-black leading-tight ${r.gold ? "text-[#FFD966]" : ""}`}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <HistorialFiltros activo={periodo} />
      </div>

      {giros.length === 0 ? (
        <p className="mt-3.5 rounded-[16px] bg-white px-4 py-5 text-center text-[14px] text-ink-soft shadow-[0_2px_8px_rgba(31,107,53,0.08)]">
          No hay giros en este período.
        </p>
      ) : (
        <ul className="stagger-list mt-3.5 flex flex-col gap-2">
          {giros.map((g) => (
            <li key={g.codigo}>
              <Link
                href={`/premio?codigo=${g.codigo}`}
                className="flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-3 no-underline shadow-[0_2px_8px_rgba(31,107,53,0.08)] transition-transform active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[16px] font-black ${coinTone(g)}`}
                >
                  {g.tipo === "OBJETO" ? <Gift size={18} strokeWidth={2.4} /> : "$"}
                </span>
                <div className="flex min-w-0 grow flex-col gap-px">
                  <p className="truncate text-[15px] font-semibold text-ink">{g.cliente}</p>
                  <p className="text-[12px] text-ink-soft">
                    {periodo === "hoy" ? hora(g.fecha) : diaHora(g.fecha)} ·{" "}
                    <span className="whitespace-nowrap">Código {g.codigo}</span>
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="max-w-[120px] truncate font-display text-[18px] font-black leading-none text-brand-blue">
                    {textoPremio(g)}
                  </p>
                  <Pill tone="greenLight" className="px-2 py-0.5 text-[11px]">
                    Entregado
                  </Pill>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <BottomNav active="historial" />
    </main>
  );
}
