import Image from "next/image";
import { Screen } from "@/components/Screen";
import { SOPORTE_TEL } from "@/lib/mock-data";
import { LoginForm } from "./login-form";

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
        <p className="mt-1.5 text-center text-[15px] text-ink-soft">¡Bienvenido a la ruleta regalona de credinstante! La suerte está de tu lado</p>

        <LoginForm />

        <div className="flex-1" />
        <p className="mt-8 font-display text-[14px] font-extrabold text-white">Creciendo con vos</p>
        <p className="mt-1 text-[13px] text-green-light">Soporte: TEL {SOPORTE_TEL}</p>
      </div>
    </Screen>
  );
}
