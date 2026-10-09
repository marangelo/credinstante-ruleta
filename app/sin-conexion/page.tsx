import Link from "next/link";
import { RotateCw, ShieldCheck, WifiOff } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { EstadoIlustracion } from "@/components/estado-ilustracion";
import { Screen } from "@/components/Screen";
import { cliente } from "@/lib/mock-data";

export default function SinConexionPage() {
  return (
    <Screen className="text-center">
      <div className="flex">
        <BackButton href="/inicio" label="Volver al inicio" />
      </div>

      <div className="mt-12 flex flex-col items-center">
        <EstadoIlustracion tone="blue">
          <WifiOff size={64} strokeWidth={2} className="text-brand-blue" />
        </EstadoIlustracion>
        <h1 className="mt-7 font-display text-[28px] font-black leading-[1.15] text-brand-blue">
          Sin conexión
          <br />a internet
        </h1>
        <p className="mt-2.5 text-[15px] leading-[1.45] text-ink-soft">
          La ruleta necesita internet para sortear el premio de forma segura. Buscá un lugar con mejor señal e intentá de
          nuevo.
        </p>
      </div>

      <div className="mt-[22px] flex items-center gap-2.5 rounded-[16px] bg-green-light px-4 py-3.5 text-left text-[14px] font-semibold text-green-dark">
        <ShieldCheck size={22} strokeWidth={2.4} aria-hidden="true" className="shrink-0" />
        <p>Tranquilo: el giro de {cliente.nombre} está guardado y no se pierde.</p>
      </div>

      <div className="min-h-8 grow" />

      <Button href="/ruleta" icon={<RotateCw size={22} strokeWidth={2.6} aria-hidden="true" />}>
        Reintentar
      </Button>
      <Link
        href="/inicio"
        className="mx-auto mt-2 flex min-h-11 items-center px-3 text-[15px] font-semibold text-white underline underline-offset-2 hover:text-gold-light focus-visible:outline-3 focus-visible:outline-white"
      >
        Volver al inicio
      </Link>
    </Screen>
  );
}
