import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Screen } from "@/components/Screen";

const pantallas = [
  { href: "/login", nombre: "Ingreso", desc: "El promotor entra con su usuario y contraseña." },
  { href: "/inicio", nombre: "Inicio", desc: "Promoción activa, resumen del día y acceso a un nuevo giro." },
  { href: "/cliente", nombre: "Buscar cliente", desc: "Verificá que el cliente pueda participar." },
  { href: "/ruleta", nombre: "Ruleta", desc: "El cliente gira la ruleta para ganar su premio." },
  { href: "/premio", nombre: "Premio", desc: "Celebración con el monto ganado y el código." },
  { href: "/historial", nombre: "Historial", desc: "Todos los giros que entregaste hoy." },
  { href: "/ya-participo", nombre: "Cliente ya participó", desc: "Aviso cuando el cliente ya giró en esta promoción." },
  { href: "/sin-conexion", nombre: "Sin conexión", desc: "Qué pasa si se corta internet antes del sorteo." },
  { href: "/voucher", nombre: "Voucher", desc: "Comprobante del premio para imprimir o compartir." },
];

export default function IndicePage() {
  return (
    <Screen>
      <header className="flex flex-col items-center text-center">
        <Image src="/logo.png" alt="Credin$tante" width={96} height={96} priority />
        <h1 className="mt-3 font-display text-[26px] font-black leading-tight text-brand-blue">
          Ruleta de Premios · Pantallas
        </h1>
        <p className="mt-1 text-[15px] text-ink-soft">Elegí una pantalla para verla.</p>
      </header>

      <nav aria-label="Pantallas de la app" className="mt-6 mb-[110px]">
        <ol className="stagger-list flex flex-col gap-2.5">
          {pantallas.map((p, i) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="flex min-h-[68px] items-center gap-3.5 rounded-[20px] bg-white px-4 py-3 no-underline shadow-card transition-transform active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                <span
                  aria-hidden="true"
                  className="coin flex size-10 shrink-0 items-center justify-center rounded-full font-display text-[17px] font-black text-navy"
                >
                  {i + 1}
                </span>
                <span className="flex min-w-0 grow flex-col">
                  <span className="font-display text-[17px] font-black text-brand-blue">{p.nombre}</span>
                  <span className="text-[13px] leading-snug text-ink-soft">{p.desc}</span>
                </span>
                <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-green" />
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </Screen>
  );
}
