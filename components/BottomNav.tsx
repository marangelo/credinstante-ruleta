import Link from "next/link";
import { History, Home, PlusCircle } from "lucide-react";

const items = [
  { key: "inicio", href: "/inicio", label: "Inicio", Icon: Home },
  { key: "nuevo", href: "/cliente", label: "Nuevo giro", Icon: PlusCircle },
  { key: "historial", href: "/historial", label: "Historial", Icon: History },
] as const;

// Barra flotante fija. Las pantallas que la usan deben dejar ~100px de espacio inferior.
export function BottomNav({ active }: { active: "inicio" | "nuevo" | "historial" }) {
  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-4 z-20 mx-auto w-[calc(100%-40px)] max-w-[390px]">
      <ul className="flex h-[68px] items-center justify-around rounded-[24px] bg-white shadow-float">
        {items.map(({ key, href, label, Icon }) => {
          const on = key === active;
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-11 min-w-16 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-[12px] no-underline transition-[color,transform] duration-150 ease-out active:scale-95 ${
                  on ? "font-bold text-green-dark" : "font-semibold text-ink-soft"
                }`}
              >
                <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
