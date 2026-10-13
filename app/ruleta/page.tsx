import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Pill } from "@/components/Pill";
import { RuletaSpinner } from "@/components/ruleta-spinner";
import { Screen } from "@/components/Screen";
import { resumenPremios } from "@/lib/premios";
import { prepararRuleta } from "@/lib/ruleta";

export const metadata: Metadata = { title: "Ruleta · Credin$tante" };

export default async function RuletaPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const id = Number((await searchParams).cliente);
  if (!Number.isInteger(id) || id <= 0) redirect("/cliente");

  const datos = await prepararRuleta(id);
  if (!datos) redirect("/cliente");

  const { cliente, promocion, yaParticipo } = datos;
  const motivo = !cliente.activo
    ? "Este cliente está inactivo y no puede participar."
    : !promocion
      ? "No hay una promoción activa hoy."
      : yaParticipo
        ? "Este cliente ya participó en la promoción."
        : promocion.premios.length === 0
          ? "La promoción no tiene premios configurados."
          : null;

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

      {motivo || !promocion ? (
        <>
          <Card className="mt-8 p-5 text-center shadow-card-lg">
            <p className="font-display text-[20px] font-black text-brand-blue">No se puede girar</p>
            <p className="mt-2 text-[15px] text-ink">{motivo}</p>
          </Card>
          <div className="min-h-8 flex-1" />
          <Button href="/cliente">Buscar otro cliente</Button>
        </>
      ) : (
        <>
          <h1 className="mt-5 text-center font-display text-[32px] font-black leading-[1.05] text-brand-blue">
            ¡Tu suerte
            <br />
            <span className="text-green">está creciendo!</span>
          </h1>
          <div className="mt-2 flex justify-center">
            <Pill tone="lime">
              {resumenPremios(
                promocion.premios.flatMap((p) => (p.tipo === "DINERO" ? [p.monto ?? 0] : [])),
                promocion.premios.flatMap((p) => (p.tipo === "OBJETO" ? [p.nombre ?? ""] : [])),
              )}
            </Pill>
          </div>

          <RuletaSpinner idCliente={cliente.id} premios={promocion.premios} />
        </>
      )}
    </Screen>
  );
}
