import type { Metadata } from "next";
import { Gift, Printer } from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Hills } from "@/components/Hills";
import { Pill } from "@/components/Pill";
import { PremioDecor } from "@/components/premio-decor";
import { redirect } from "next/navigation";
import { formatMonto } from "@/lib/mock-data";
import { fechaHora, giroPorCodigo } from "@/lib/ruleta";

// La moneda mide 196px: los montos largos (C$1,000) bajan de tamaño para no salirse
const tamanoMonto = (texto: string) => (texto.length <= 5 ? 56 : texto.length === 6 ? 46 : 38);

export const metadata: Metadata = { title: "¡Ganaste! · Credin$tante" };

export default async function PremioPage({ searchParams }: { searchParams: Promise<{ codigo?: string }> }) {
  const giro = await giroPorCodigo(String((await searchParams).codigo ?? ""));
  if (!giro) redirect("/inicio");

  const { codigo } = giro;
  const esObjeto = giro.tipo === "OBJETO";
  const nombre = giro.cliente.split(" ")[0];
  const monto = formatMonto(giro.monto ?? 0);

  const datos = [
    { label: "Código", value: codigo, className: "tracking-[2px] text-brand-blue font-bold tabular-nums" },
    // Los datos con los que el promotor identificó al cliente para girar
    { label: "Cédula", value: giro.cedula, className: "font-semibold" },
    ...(giro.credito ? [{ label: "N° de crédito", value: String(giro.credito), className: "font-semibold tabular-nums" }] : []),
    { label: "Entregado por", value: giro.promotor ?? "-", className: "font-semibold" },
    { label: "Fecha y hora", value: fechaHora(giro.fecha), className: "font-semibold" },
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
          className="pop-in relative mt-5 flex size-[196px] shrink-0 flex-col items-center justify-center rounded-full border-6 border-white text-navy shadow-[0_16px_40px_rgba(181,125,5,0.4)]"
          style={{
            background: "radial-gradient(circle at 35% 28%, #FFF6D6 0%, #F2B705 50%, #B57D05 100%)",
            // La moneda llega después del título: es el momento principal de la pantalla.
            animationDelay: "240ms",
          }}
        >
          <div aria-hidden="true" className="absolute inset-3 rounded-full border-2 border-dashed border-navy/30" />
          {esObjeto ? (
            <>
              <Gift size={40} strokeWidth={2.2} aria-hidden="true" />
              <p className="mt-1 text-[13px] font-extrabold tracking-[1.5px]">TU PREMIO</p>
              <p className="line-clamp-2 max-w-[170px] text-center font-display text-[26px] font-black leading-[1.05] [overflow-wrap:anywhere]">
                {giro.premio}
              </p>
            </>
          ) : (
            <>
              <p className="text-[13px] font-extrabold tracking-[1.5px]">PREMIO EN EFECTIVO</p>
              <p className="font-display font-black leading-[1.05]" style={{ fontSize: tamanoMonto(monto) }}>
                {monto}
              </p>
            </>
          )}
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

        <Button href={`/voucher?codigo=${codigo}`} icon={<Printer size={22} strokeWidth={2.4} aria-hidden="true" />}>
          Imprimir voucher
        </Button>
        <Button href="/cliente" variant="secondary" className="mt-3">
          Siguiente cliente
        </Button>
      </div>
    </main>
  );
}
