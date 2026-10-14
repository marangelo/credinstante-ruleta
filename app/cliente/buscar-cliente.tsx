"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle, Search } from "lucide-react";
import { Button } from "@/components/Button";
import { ClientCard } from "@/components/ClientCard";
import { buscarCliente, type BusquedaState } from "./actions";

const labelCls = "font-display text-[14px] font-extrabold text-brand-blue";
const inputCls =
  "h-14 min-w-0 grow rounded-2xl border-2 border-green bg-white px-4 text-[17px] text-ink placeholder:normal-case placeholder:text-ink-soft aria-invalid:border-gold-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

function BotonBuscar() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={pending ? "Buscando cliente" : "Buscar cliente"}
      className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white transition-transform active:scale-95 disabled:opacity-70 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
    >
      {pending ? (
        <LoaderCircle size={22} strokeWidth={2.5} className="animate-spin" aria-hidden="true" />
      ) : (
        <Search size={22} strokeWidth={2.5} aria-hidden="true" />
      )}
    </button>
  );
}

export function BuscarCliente() {
  const [state, action] = useActionState<BusquedaState, FormData>(buscarCliente, {});
  const puedeGirar = state.cliente?.activo && state.promocion && !state.participacion && state.creditoActivo;

  // Un error sin campo (p.ej. el crédito no es de esa cédula) marca los dos campos
  const invalido = (campo: "cedula" | "credito") =>
    state.error && (!state.campoError || state.campoError === campo) ? true : undefined;
  const describedBy = state.error ? "busqueda-error" : undefined;

  return (
    <>
      <form action={action} className="mt-[18px] flex flex-col gap-1.5">
        <label htmlFor="cedula" className={labelCls}>
          Cédula de identidad
        </label>
        <input
          id="cedula"
          name="cedula"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
          defaultValue={state.cedula}
          placeholder="001-010190-0001A"
          aria-invalid={invalido("cedula")}
          aria-describedby={describedBy}
          className={`${inputCls} uppercase`}
        />

        <label htmlFor="credito" className={`${labelCls} mt-2.5`}>
          Número de crédito activo
        </label>
        <div className="flex gap-2">
          <input
            id="credito"
            name="credito"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            spellCheck={false}
            required
            defaultValue={state.credito}
            placeholder="Ej. 15234"
            aria-invalid={invalido("credito")}
            aria-describedby={describedBy}
            className={`${inputCls} tabular-nums`}
          />
          <BotonBuscar />
        </div>
      </form>

      <div aria-live="polite">
        {state.error && (
          <p id="busqueda-error" role="alert" className="mt-3 rounded-2xl bg-cream px-4 py-3 text-[14px] font-semibold text-navy">
            {state.error}
          </p>
        )}
        {state.cliente && (
          <section aria-label="Cliente encontrado" className="mt-[18px]">
            <ClientCard
              cliente={state.cliente}
              credito={state.creditoActivo ?? null}
              promocion={state.promocion ?? null}
              participacion={state.participacion ?? null}
            />
          </section>
        )}
      </div>

      <div className="min-h-8 flex-1" />
      {puedeGirar ? (
        // El crédito viaja hasta el giro: Laravel lo vuelve a validar y lo guarda con el premio
        <Button href={`/ruleta?cliente=${state.cliente!.id}&credito=${state.creditoActivo!.id}`}>Ir a la ruleta</Button>
      ) : (
        <Button disabled aria-disabled>
          Ir a la ruleta
        </Button>
      )}
    </>
  );
}
