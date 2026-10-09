import type { Metadata } from "next";
import { Avatar } from "@/components/Avatar";
import { BackButton } from "@/components/BackButton";
import { Pill } from "@/components/Pill";
import { RuletaSpinner } from "@/components/ruleta-spinner";
import { Screen } from "@/components/Screen";
import { cliente, formatMonto, promocion } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Ruleta · Credin$tante" };

export default function RuletaPage() {
  return (
    <Screen>
      <header className="flex items-center gap-2.5">
        <BackButton href="/cliente" />
        <div className="flex min-w-0 items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3.5 shadow-card">
          <Avatar nombre={cliente.nombre} size={32} />
          <span className="truncate font-display text-[14px] font-extrabold text-brand-blue">{cliente.nombre}</span>
        </div>
        <span className="ml-auto shrink-0 text-[13px] font-semibold text-ink-soft">Paso 2/3</span>
      </header>

      <h1 className="mt-5 text-center font-display text-[32px] font-black leading-[1.05] text-brand-blue">
        ¡Tu suerte
        <br />
        <span className="text-green">está creciendo!</span>
      </h1>
      <div className="mt-2 flex justify-center">
        <Pill tone="lime">
          Premios de {formatMonto(promocion.premioMin)} hasta {formatMonto(promocion.premioMax)}
        </Pill>
      </div>

      <RuletaSpinner />
    </Screen>
  );
}
