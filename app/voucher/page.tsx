import type { Metadata } from "next";
import Image from "next/image";
import { BackButton } from "@/components/BackButton";
import { leerMonto, type MontoSearchParams } from "@/components/premio-monto";
import { VoucherPrintButton } from "@/components/voucher-print-button";
import { formatMonto, premioEjemplo, promocion, SOPORTE_TEL } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Voucher · Credin$tante" };

// Ticket para impresora térmica de 80mm: solo blanco y negro.
const printCss = `
@page { size: 80mm auto; margin: 0; }
@media print {
  html, body, body > div { background: #fff !important; min-height: 0 !important; max-width: none !important; }
}
`;

export default async function VoucherPage({ searchParams }: { searchParams: MontoSearchParams }) {
  const monto = await leerMonto(searchParams);
  const { cliente, promotor, codigo, fechaHora } = premioEjemplo;

  const datos = [
    { label: "Cliente", value: cliente.nombre },
    { label: "Documento", value: cliente.documento },
    { label: "Promotor", value: promotor.nombre },
    { label: "Fecha y hora", value: fechaHora },
    { label: "Código", value: codigo, className: "tracking-[1px]" },
  ];

  return (
    <main className="flex min-h-dvh flex-col items-center bg-[#E9ECEA] px-4 pb-8 pt-6 print:block print:min-h-0 print:bg-white print:p-0">
      <style>{printCss}</style>

      <div className="mb-4 flex w-[320px] max-w-full items-center justify-between print:hidden">
        <BackButton href={`/premio?monto=${monto}`} />
        <VoucherPrintButton />
      </div>

      <article
        aria-label="Voucher de premio"
        className="ticket-in flex w-[320px] max-w-full flex-col items-center gap-2.5 bg-white px-5 py-[22px] font-sans text-black shadow-float print:w-[80mm] print:max-w-none print:shadow-none"
      >
        <Image
          src="/logo.png"
          alt="Credin$tante"
          width={110}
          height={110}
          className="size-[110px] object-contain grayscale contrast-[1.4]"
        />
        <p className="text-[12px]">TEL {SOPORTE_TEL}</p>
        <hr className="w-full border-0 border-t-2 border-dashed border-black" />
        <h1 className="font-display text-[18px] font-black tracking-[2px]">VOUCHER DE PREMIO</h1>
        <p className="text-[12px]">Ruleta · {promocion.nombre}</p>

        <div className="mt-1 w-full rounded-lg border-2 border-black p-2.5 text-center">
          <p className="text-[12px] font-bold tracking-[1px]">MONTO GANADO</p>
          <p className="font-display text-[52px] font-black leading-[1.05]">{formatMonto(monto)}</p>
        </div>

        <dl className="flex w-full flex-col gap-1.5 text-[13px]">
          {datos.map((d) => (
            <div key={d.label} className="flex justify-between gap-2">
              <dt>{d.label}</dt>
              <dd className={`text-right font-bold ${d.className ?? ""}`}>{d.value}</dd>
            </div>
          ))}
        </dl>

        <hr className="w-full border-0 border-t-2 border-dashed border-black" />

        <div className="mt-[18px] flex w-full gap-3.5">
          {["Firma cliente", "Firma promotor"].map((f) => (
            <div key={f} className="flex flex-1 flex-col items-center gap-1 border-t border-black pt-1 text-[11px]">
              {f}
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] leading-[1.4]">Premio sujeto a bases y condiciones de la promoción.</p>
        <p className="font-display text-[14px] font-extrabold">Creciendo con vos</p>
      </article>
    </main>
  );
}
