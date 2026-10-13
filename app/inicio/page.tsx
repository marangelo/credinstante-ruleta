import Image from "next/image";
import Link from "next/link";
import { Gift, LoaderPinwheel, LogOut } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Pill } from "@/components/Pill";
import { Screen } from "@/components/Screen";
import { StatCard } from "@/components/StatCard";
import { getSesion } from "@/lib/auth";
import { formatMonto } from "@/lib/mock-data";
import { resumenPremios, textoPremio } from "@/lib/premios";
import { fechaLarga, hora, misGiros } from "@/lib/ruleta";
import { logout } from "../login/actions";

export default async function InicioPage() {
  const promotor = await getSesion();
  const { resumen, giros, promocion } = await misGiros(promotor.id, "hoy");
  const ultimos = giros.slice(0, 3);

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
        <div className="flex items-center gap-1">
          <Image src="/logo.png" alt="Credin$tante" width={52} height={52} className="size-[52px] object-contain" />
          <form action={logout}>
            <button
              type="submit"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className="flex size-11 items-center justify-center rounded-full text-ink-soft transition-[color,transform] duration-150 ease-out hover:text-brand-blue active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              <LogOut size={22} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </form>
        </div>
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
        {promocion ? (
          <>
            <Pill tone="lime" className="relative">
              Promoción activa
            </Pill>
            <p className="relative mt-2.5 font-display text-[24px] font-black leading-[1.1]">{promocion.nombre}</p>
            <p className="relative mt-1.5 text-[14px] text-green-light">
              {resumenPremios(promocion.montos, promocion.objetos)} · Vence {fechaLarga(promocion.vence)}
            </p>
          </>
        ) : (
          <>
            <Pill tone="lime" className="relative">
              Sin promoción
            </Pill>
            <p className="relative mt-2.5 font-display text-[22px] font-black leading-[1.1]">No hay una promoción activa hoy</p>
            <p className="relative mt-1.5 text-[14px] text-green-light">Cuando se active una, vas a poder girar.</p>
          </>
        )}
      </section>

      <div className="mt-3.5 grid grid-cols-2 gap-3">
        <StatCard label="Giros de hoy" value={String(resumen.giros)} accent="blue" />
        <StatCard label="Entregado hoy" value={formatMonto(resumen.entregado)} accent="green" />
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
        {ultimos.length === 0 ? (
          <p className="mt-1.5 rounded-2xl bg-white px-4 py-4 text-center text-[14px] text-ink-soft shadow-[0_2px_8px_rgba(31,107,53,0.08)]">
            Todavía no hiciste giros hoy.
          </p>
        ) : (
          <ul className="stagger-list mt-1.5 flex flex-col gap-2">
            {ultimos.map((g) => (
              <li key={g.codigo}>
                <Link
                  href={`/premio?codigo=${g.codigo}`}
                  className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 no-underline shadow-[0_2px_8px_rgba(31,107,53,0.08)] transition-transform active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-green-light font-display text-[15px] font-black text-green-dark"
                  >
                    {g.tipo === "OBJETO" ? <Gift size={18} strokeWidth={2.4} /> : "$"}
                  </span>
                  <div className="flex min-w-0 grow flex-col">
                    <span className="truncate text-[15px] font-semibold text-ink">{g.cliente}</span>
                    <span className="text-[12px] text-ink-soft">{hora(g.fecha)}</span>
                  </div>
                  <span className="max-w-[40%] truncate font-display text-[18px] font-black text-green-dark">{textoPremio(g)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Espacio para que la barra fija no tape el contenido */}
      <div aria-hidden="true" className="h-[86px] shrink-0" />
      <BottomNav active="inicio" />
    </Screen>
  );
}
