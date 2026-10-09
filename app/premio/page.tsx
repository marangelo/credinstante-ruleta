import type { Metadata } from "next";
import { Printer } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Hills } from "@/components/Hills";
import { Pill } from "@/components/Pill";
import { PremioDecor } from "@/components/premio-decor";
import { leerMonto, type MontoSearchParams } from "@/components/premio-monto";
import { formatMonto, premioEjemplo } from "@/lib/mock-data";

export const metadata: Metadata = { title: "¡Ganaste! · Credin$tante" };

export default async function PremioPage({ searchParams }: { searchParams: MontoSearchParams }) {
  const monto = await leerMonto(searchParams);
  const { cliente, promotor, codigo, fechaHora } = premioEjemplo;
  const nombre = cliente.nombre.split(" ")[0];

  const datos = [
    { label: "Código", value: codigo, className: "tracking-[2px] text-brand-blue font-bold" },
    { label: "Entregado por", value: promotor.nombre, className: "font-semibold" },
    { label: "Fecha y hora", value: fechaHora, className: "font-semibold" },
  ];

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <PremioDecor />
      <Hills height={170} />

      <div className="stagger relative z-10 flex flex-1 flex-col items-center px-5 pb-6 pt-[30px]">
        <p className="self-end text-[13px] font-semibold text-ink-soft">Paso 3/3</p>
        <p className="rounded-full bg-white px-4 py-[7px] text-[14px] font-bold text-green-dark shadow-card">
          ¡Felicitaciones, {nombre}!
        </p>
        <h1 className="mt-2.5 font-display text-[48px] font-black leading-none text-brand-blue">¡Ganaste!</h1>
        <Pill tone="lime" className="mt-2">
          Seremos tus mejores aliados
        </Pill>

        <div
          className="pop-in relative mt-6 flex size-[220px] shrink-0 flex-col items-center justify-center rounded-full border-6 border-white text-navy shadow-[0_16px_40px_rgba(181,125,5,0.4)]"
          style={{
            background: "radial-gradient(circle at 35% 28%, #FFF6D6 0%, #F2B705 50%, #B57D05 100%)",
            // La moneda llega después del título: es el momento principal de la pantalla.
            animationDelay: "240ms",
          }}
        >
          <div aria-hidden="true" className="absolute inset-3 rounded-full border-2 border-dashed border-navy/30" />
          <p className="text-[13px] font-extrabold tracking-[1.5px]">PREMIO EN EFECTIVO</p>
          <p className="font-display text-[64px] font-black leading-[1.05]">{formatMonto(monto)}</p>
          <p className="text-[12px] font-bold">Credin$tante</p>
        </div>

        <Card className="mt-[22px] flex w-full flex-col gap-[9px] px-[18px] py-3.5 shadow-card-lg">
          <dl className="flex flex-col gap-[9px] text-[14px]">
            {datos.map((d, i) => (
              <div
                key={d.label}
                className={`flex justify-between gap-3 ${i > 0 ? "border-t border-line pt-[9px]" : ""}`}
              >
                <dt className="text-ink-soft">{d.label}</dt>
                <dd className={`text-right ${d.className}`}>{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="flex items-center gap-2 rounded-xl bg-green-light px-3 py-[9px] text-[13px] font-semibold text-green-dark">
            <Printer size={18} strokeWidth={2.4} aria-hidden="true" className="shrink-0" />
            Imprimí el voucher y entregáselo al cliente
          </p>
        </Card>

        <div className="min-h-5 flex-1" />

        <Button href={`/voucher?monto=${monto}`} icon={<Printer size={22} strokeWidth={2.4} aria-hidden="true" />}>
          Imprimir voucher
        </Button>
        <Button href="/cliente" variant="secondary" className="mt-3">
          Siguiente cliente
        </Button>
      </div>
    </main>
  );
}
