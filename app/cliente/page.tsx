import Link from "next/link";
import { Search } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { ClientCard } from "@/components/ClientCard";
import { Screen } from "@/components/Screen";
import { cliente } from "@/lib/mock-data";

export default function ClientePage() {
  return (
    <Screen>
      <header className="flex items-center gap-2.5">
        <BackButton href="/inicio" label="Volver al inicio" />
        <p className="font-display text-[20px] font-black text-brand-blue">Nuevo giro</p>
        <p className="ml-auto text-[13px] font-semibold text-ink-soft">Paso 1 de 3</p>
      </header>

      <h1 className="mt-6 font-display text-[28px] font-black leading-[1.1] text-brand-blue">¿Quién gira hoy?</h1>
      <p className="mt-1.5 text-[15px] text-ink-soft">Buscá al cliente con su documento de identidad</p>

      <div className="mt-[18px] flex flex-col gap-1.5">
        <label htmlFor="documento" className="font-display text-[14px] font-extrabold text-brand-blue">
          Documento de identidad
        </label>
        <div className="flex gap-2">
          <input
            id="documento"
            name="documento"
            type="text"
            autoComplete="off"
            defaultValue={cliente.documento}
            className="h-14 min-w-0 grow rounded-2xl border-2 border-green bg-white px-4 text-[17px] text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          />
          <button
            type="button"
            aria-label="Buscar cliente"
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white transition-transform active:scale-95 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <Search size={22} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      <section aria-label="Cliente encontrado" className="mt-[18px]">
        <ClientCard cliente={cliente} />
      </section>

      <div className="min-h-8 flex-1" />
      <Button href="/ruleta">Ir a la ruleta</Button>
      <Link
        href="/ya-participo"
        className="mt-2 flex min-h-11 items-center self-center px-2 text-[13px] text-white underline underline-offset-2"
      >
        Ver ejemplo: cliente que ya participó
      </Link>
    </Screen>
  );
}
