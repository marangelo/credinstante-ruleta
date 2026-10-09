import Image from "next/image";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { SOPORTE_TEL } from "@/lib/mock-data";

const inputCls =
  "h-[54px] w-full rounded-2xl border-2 border-green-light bg-white px-4 text-[16px] text-ink placeholder:text-ink-soft focus:border-green focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const labelCls = "font-display text-[14px] font-extrabold text-brand-blue";

export default function LoginPage() {
  return (
    <Screen className="items-stretch">
      <div className="flex flex-1 flex-col items-center px-1 pt-4">
        <Image
          src="/logo.png"
          alt="Credin$tante, creciendo con vos"
          width={190}
          height={190}
          priority
          className="size-[190px] object-contain"
        />
        <h1 className="mt-3.5 text-center font-display text-[30px] font-black text-brand-blue">¡Hola, promotor!</h1>
        <p className="mt-1.5 text-center text-[15px] text-ink-soft">Ingresá para llevar premios a tus clientes</p>

        <div className="mt-7 flex w-full flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="usuario" className={labelCls}>
              Usuario
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              placeholder="Tu usuario de promotor"
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
              placeholder="••••••••"
              className={inputCls}
            />
          </div>
          <a
            href="#"
            className="-my-2 flex min-h-11 items-center self-end text-[14px] font-semibold text-green-dark underline-offset-2 hover:text-brand-blue hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <Button href="/inicio" className="mt-[22px]">
          Ingresar
        </Button>

        <div className="flex-1" />
        <p className="mt-8 font-display text-[14px] font-extrabold text-white">Creciendo con vos</p>
        <p className="mt-1 text-[13px] text-green-light">Soporte: TEL {SOPORTE_TEL}</p>
      </div>
    </Screen>
  );
}
