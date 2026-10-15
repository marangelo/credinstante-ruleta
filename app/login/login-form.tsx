"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/Button";
import { login, type LoginState } from "./actions";

const inputCls =
  "h-[54px] w-full rounded-2xl border-2 border-green-light bg-white px-4 text-[16px] text-ink placeholder:text-ink-soft focus:border-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue aria-invalid:border-gold-dark";

const labelCls = "font-display text-[14px] font-extrabold text-brand-blue";

function Ingresar() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} className="mt-[22px]">
      {pending ? "Ingresando…" : "Ingresar"}
    </Button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(login, {});
  const invalido = state.error ? true : undefined;

  return (
    <form action={action} className="mt-7 flex w-full flex-col">
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="usuario" className={labelCls}>
            Usuario
          </label>
          <input
            id="usuario"
            name="usuario"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            defaultValue={state.usuario}
            placeholder="Tu usuario de promotor"
            aria-invalid={invalido}
            aria-describedby={invalido && "login-error"}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="clave" className={labelCls}>
            Contraseña
          </label>
          <input
            id="clave"
            name="clave"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            aria-invalid={invalido}
            aria-describedby={invalido && "login-error"}
            className={inputCls}
          />
        </div>
      </div>

      <p
        id="login-error"
        role="alert"
        className={`rounded-2xl bg-cream px-4 text-[14px] font-semibold text-navy ${state.error ? "mt-3 py-3" : ""}`}
      >
        {state.error}
      </p>

      <Ingresar />
    </form>
  );
}
