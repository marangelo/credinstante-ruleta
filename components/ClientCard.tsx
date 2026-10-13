import { Check, X } from "lucide-react";
import type { ClienteRuleta, Participacion } from "@/app/cliente/actions";
import { textoPremio } from "@/lib/premios";
import { Avatar } from "./Avatar";
import { Card } from "./Card";

const fechaCorta = (f: string) => {
  const [d, h] = f.split(" ");
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y} · ${h.slice(0, 5)}`;
};

type Props = { cliente: ClienteRuleta; promocion: string | null; participacion: Participacion | null };

export function ClientCard({ cliente, promocion, participacion }: Props) {
  const checks = [
    cliente.activo
      ? { ok: true, text: "Cliente activo de Credin$tante" }
      : { ok: false, text: "Cliente inactivo: no puede participar" },
    !promocion
      ? { ok: false, text: "No hay una promoción activa hoy" }
      : participacion
        ? {
            ok: false,
            text: `Ya giró en esta promoción: ganó ${textoPremio(participacion)} el ${fechaCorta(participacion.fecha)}${
              participacion.promotor ? ` con ${participacion.promotor}` : ""
            }`,
          }
        : { ok: true, text: "Todavía no giró en esta promoción" },
  ];

  return (
    <Card className="p-5 shadow-card-lg">
      <div className="flex items-center gap-3">
        <Avatar nombre={cliente.nombre} size={56} tone="green" />
        <div className="min-w-0">
          <p className="font-display text-[20px] font-black leading-tight text-brand-blue">{cliente.nombre}</p>
          <p className="text-[14px] text-ink-soft">Céd. {cliente.cedula}</p>
          {cliente.telefono && <p className="text-[14px] text-ink-soft">Tel. {cliente.telefono}</p>}
          {cliente.zona && <p className="text-[14px] text-ink-soft">{cliente.zona}</p>}
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
        {checks.map((c) => (
          <li key={c.text} className="flex items-start gap-2.5 text-[15px] font-medium text-ink">
            <span
              className={`mt-px flex size-6 shrink-0 items-center justify-center rounded-full ${
                c.ok ? "bg-green-light text-green-dark" : "bg-cream text-gold-dark"
              }`}
            >
              {c.ok ? (
                <Check size={15} strokeWidth={3} aria-hidden="true" />
              ) : (
                <X size={15} strokeWidth={3} aria-hidden="true" />
              )}
            </span>
            {c.text}
          </li>
        ))}
      </ul>
    </Card>
  );
}
