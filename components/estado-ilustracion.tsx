import type { ReactNode } from "react";

type Tone = "cream" | "blue";

const tones: Record<Tone, { ring: string; shadow: string }> = {
  cream: { ring: "bg-cream", shadow: "shadow-[0_8px_20px_rgba(181,125,5,0.25)]" },
  blue: { ring: "bg-[#DCE6F7]", shadow: "shadow-[0_8px_20px_rgba(18,62,140,0.2)]" },
};

// Ilustración circular de las pantallas de estado (ya participó, sin conexión).
export function EstadoIlustracion({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = tones[tone];
  return (
    <div aria-hidden="true" className={`flex size-[170px] items-center justify-center rounded-full ${t.ring}`}>
      <div className={`flex size-[120px] items-center justify-center rounded-full bg-white ${t.shadow}`}>{children}</div>
    </div>
  );
}
