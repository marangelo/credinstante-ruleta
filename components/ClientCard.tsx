import { Check } from "lucide-react";
import type { Cliente } from "@/lib/mock-data";
import { Avatar } from "./Avatar";
import { Card } from "./Card";

export function ClientCard({ cliente }: { cliente: Cliente }) {
  const checks = [
    { ok: cliente.activo, text: "Cliente activo de Credin$tante" },
    { ok: cliente.alDia, text: "Al día con sus cuotas" },
    { ok: !cliente.yaGiro, text: "Todavía no giró en esta promoción" },
  ].filter((c) => c.ok);
  return (
    <Card className="p-5 shadow-card-lg">
      <div className="flex items-center gap-3">
        <Avatar nombre={cliente.nombre} size={56} tone="green" />
        <div className="min-w-0">
          <p className="font-display text-[20px] font-black leading-tight text-brand-blue">{cliente.nombre}</p>
          <p className="text-[14px] text-ink-soft">Doc. {cliente.documento}</p>
          <p className="text-[14px] text-ink-soft">Tel. {cliente.telefono}</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
        {checks.map((c) => (
          <li key={c.text} className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-light text-green-dark">
              <Check size={15} strokeWidth={3} aria-hidden="true" />
            </span>
            {c.text}
          </li>
        ))}
      </ul>
    </Card>
  );
}
