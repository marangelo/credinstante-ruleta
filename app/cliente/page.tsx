import { BackButton } from "@/components/BackButton";
import { Screen } from "@/components/Screen";
import { BuscarCliente } from "./buscar-cliente";

export default function ClientePage() {
  return (
    <Screen>
      <header className="flex items-center gap-2.5">
        <BackButton href="/inicio" label="Volver al inicio" />
        <p className="font-display text-[20px] font-black text-brand-blue">Nuevo giro</p>
        <p className="ml-auto text-[13px] font-semibold text-ink-soft">Paso 1 de 3</p>
      </header>

      <h1 className="mt-6 font-display text-[28px] font-black leading-[1.1] text-brand-blue">¿Quién gira hoy?</h1>
      <p className="mt-1.5 text-[15px] text-ink-soft">Ingresá la cédula del cliente y el número de su crédito activo</p>

      <BuscarCliente />
    </Screen>
  );
}
