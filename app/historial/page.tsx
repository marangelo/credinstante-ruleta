import { BackButton } from "@/components/BackButton";
import { BottomNav } from "@/components/BottomNav";
import { HistorialFiltros } from "@/components/historial-filtros";
import { Pill } from "@/components/Pill";
import { formatMonto, girosHoy, resumenHoy } from "@/lib/mock-data";

// Color de la moneda según el tamaño del premio.
const coinTone = (monto: number) =>
  monto >= 100 ? "bg-brand-blue text-white" : monto >= 50 ? "bg-gold text-navy" : "bg-green-light text-green-dark";

export default function HistorialPage() {
  const resumen = [
    { label: "Giros", value: String(resumenHoy.giros), gold: false },
    { label: "Entregado", value: formatMonto(resumenHoy.entregado), gold: true },
    { label: "Premio mayor", value: formatMonto(resumenHoy.premioMayor), gold: false },
  ];

  return (
    <main className="stagger relative min-h-dvh px-5 pb-[110px] pt-6">
      <header className="flex items-center gap-2.5">
        <BackButton href="/inicio" label="Volver al inicio" />
        <h1 className="font-display text-[22px] font-black text-brand-blue">Mis giros de hoy</h1>
      </header>

      <dl className="mt-[18px] grid grid-cols-3 gap-2 rounded-[24px] bg-brand-blue px-5 py-[18px] text-white">
        {resumen.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5">
            <dt className="text-[12px] text-[#C9D6F2]">{r.label}</dt>
            <dd className={`font-display text-[24px] font-black leading-tight ${r.gold ? "text-[#FFD966]" : ""}`}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <HistorialFiltros />
      </div>

      <ul className="stagger-list mt-3.5 flex flex-col gap-2">
        {girosHoy.map((g) => (
          <li
            key={g.id}
            className="flex items-center gap-3 rounded-[16px] bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(31,107,53,0.08)]"
          >
            <span
              aria-hidden="true"
              className={`flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[16px] font-black ${coinTone(g.monto)}`}
            >
              $
            </span>
            <div className="flex min-w-0 grow flex-col gap-px">
              <p className="truncate text-[15px] font-semibold">{g.cliente}</p>
              <p className="text-[12px] text-ink-soft">
                {g.hora} · Código {g.codigo}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <p className="font-display text-[18px] font-black leading-none text-brand-blue">{formatMonto(g.monto)}</p>
              <Pill tone="greenLight" className="px-2 py-0.5 text-[11px]">
                {g.estado}
              </Pill>
            </div>
          </li>
        ))}
      </ul>

      <BottomNav active="historial" />
    </main>
  );
}
