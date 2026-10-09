import Link from "next/link";
import { Clock } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { EstadoIlustracion } from "@/components/estado-ilustracion";
import { Screen } from "@/components/Screen";
import { formatMonto, participacionPrevia } from "@/lib/mock-data";

export default function YaParticipoPage() {
  const p = participacionPrevia;
  const filas = [
    { label: "Cliente", value: p.cliente, cls: "font-bold text-brand-blue" },
    { label: "Giró el", value: p.fecha, cls: "font-semibold" },
    { label: "Ganó", value: formatMonto(p.monto), cls: "font-display text-[17px] font-black text-green" },
    { label: "Promotor", value: p.promotor, cls: "font-semibold" },
  ];

  return (
    <Screen className="text-center">
      <div className="flex">
        <BackButton href="/cliente" />
      </div>

      <div className="mt-12 flex flex-col items-center">
        <EstadoIlustracion tone="cream">
          <Clock size={64} strokeWidth={2} className="text-gold-dark" />
        </EstadoIlustracion>
        <h1 className="mt-7 font-display text-[28px] font-black leading-[1.15] text-brand-blue">
          Este cliente ya
          <br />
          participó
        </h1>
        <p className="mt-2.5 text-[15px] leading-[1.45] text-ink-soft">
          Cada cliente puede girar una sola vez por promoción. ¡Gracias por confiar en nosotros!
        </p>
      </div>

      <Card className="mt-[22px] px-[18px] py-4 text-left shadow-card-lg">
        <dl className="flex flex-col divide-y divide-line">
          {filas.map((f) => (
            <div key={f.label} className="flex items-center justify-between gap-3 py-2 text-[14px] first:pt-0 last:pb-0">
              <dt className="text-ink-soft">{f.label}</dt>
              <dd className={`text-right ${f.cls}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <div className="min-h-8 grow" />

      <Button href="/cliente">Buscar otro cliente</Button>
      <Link
        href="/voucher"
        className="mx-auto mt-2 flex min-h-11 items-center px-3 text-[15px] font-semibold text-white underline underline-offset-2 hover:text-gold-light focus-visible:outline-3 focus-visible:outline-white"
      >
        Reimprimir voucher
      </Link>
    </Screen>
  );
}
