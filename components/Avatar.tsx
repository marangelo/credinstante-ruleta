import { iniciales } from "@/lib/mock-data";

type Tone = "blue" | "green";

const tones: Record<Tone, string> = {
  blue: "bg-brand-blue text-white",
  green: "bg-green-light text-green-dark",
};

export function Avatar({ nombre, size = 48, tone = "green" }: { nombre: string; size?: number; tone?: Tone }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-black ${tones[tone]}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {iniciales(nombre)}
    </span>
  );
}
