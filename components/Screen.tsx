import type { ReactNode } from "react";
import { Hills } from "./Hills";

// Contenedor de pantalla: alto completo, colinas al pie y contenido por encima.
export function Screen({
  children,
  hills = true,
  className = "",
}: {
  children: ReactNode;
  hills?: boolean;
  className?: string;
}) {
  return (
    <main className={`relative flex min-h-dvh flex-col overflow-hidden ${className}`}>
      {hills && <Hills />}
      <div className="stagger relative z-10 flex flex-1 flex-col px-5 pb-6 pt-6">{children}</div>
    </main>
  );
}
