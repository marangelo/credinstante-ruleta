import Image from "next/image";
import Link from "next/link";
import { LoaderPinwheel } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { StatCard } from "@/components/StatCard";
import { formatMonto, girosHoy, promocion, promotor, resumenHoy } from "@/lib/mock-data";

export default function InicioPage() {
  const ultimos = girosHoy.slice(0, 3);

  return (
    <Screen>
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar nombre={promotor.nombre} size={48} tone="blue" />
          <h1 className="flex flex-col">
            <span className="text-[13px] text-ink-soft">Buen día,</span>
            <span className="font-display text-[20px] font-black leading-tight text-brand-blue">{promotor.nombre}</span>
          </h1>
        </div>
        <Image src="/logo.png" alt="Credin$tante" width={52} height={52} className="size-[52px] object-contain" />
      </header>

      <section
        aria-label="Promoción activa"
        className="relative mt-5 overflow-hidden rounded-[24px] bg-green-dark p-5 text-white"
      >
        <svg
          width="120"
          height="80"
          viewBox="0 0 34 22"
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-3.5 -rotate-[25deg] opacity-25"
        >
          <path d="M2 11 C 8 0, 26 0, 32 11 C 26 22, 8 22, 2 11 Z" fill="#CFEFC9" />
        </svg>
        <Pill tone="lime" className="relative">
          Promoción activa
        </Pill>
        <p className="relative mt-2.5 font-display text-[24px] font-black leading-[1.1]">{promocion.nombre}</p>
        <p className="relative mt-1.5 text-[14px] text-green-light">
          Premios desde {formatMonto(promocion.premioMin)} hasta {formatMonto(promocion.premioMax)} · Vence{" "}
          {promocion.vence}
        </p>
      </section>

      <div className="mt-3.5 grid grid-cols-2 gap-3">
        <StatCard label="Giros de hoy" value={String(resumenHoy.giros)} accent="blue" />
        <StatCard label="Entregado hoy" value={formatMonto(resumenHoy.entregado)} accent="green" />
      </div>

      <Button
        href="/cliente"
        className="mt-[18px] h-[72px]! rounded-[22px]! text-[22px]!"
        icon={<LoaderPinwheel size={28} strokeWidth={2.4} aria-hidden="true" />}
      >
        Nuevo giro
      </Button>

      <section aria-labelledby="ultimos-giros" className="mt-[22px]">
        <div className="flex items-center justify-between">
          <h2 id="ultimos-giros" className="font-display text-[18px] font-black text-brand-blue">
            Últimos giros
          </h2>
          <Link
            href="/historial"
            className="-mr-2 flex min-h-11 items-center px-2 text-[14px] font-semibold text-green-dark underline-offset-2 hover:text-brand-blue hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <ul className="stagger-list mt-1.5 flex flex-col gap-2">
          {ultimos.map((g) => (
            <li
              key={g.id}
              className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 shadow-[0_2px_8px_rgba(31,107,53,0.08)]"
            >
              <span
                aria-hidden="true"
                className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-green-light font-display text-[15px] font-black text-green-dark"
              >
                $
              </span>
              <div className="flex min-w-0 grow flex-col">
                <span className="truncate text-[15px] font-semibold">{g.cliente}</span>
                <span className="text-[12px] text-ink-soft">{g.hora}</span>
              </div>
              <span className="font-display text-[18px] font-black text-green-dark">{formatMonto(g.monto)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Espacio para que la barra fija no tape el contenido */}
      <div aria-hidden="true" className="h-[86px] shrink-0" />
      <BottomNav active="inicio" />
    </Screen>
  );
}
