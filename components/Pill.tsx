import type { ReactNode } from "react";

type Tone = "lime" | "white" | "green" | "greenLight" | "cream" | "blue";

const tones: Record<Tone, string> = {
  lime: "bg-lime text-ink",
  white: "bg-white text-green-dark shadow-card",
  green: "bg-green text-white",
  greenLight: "bg-green-light text-green-dark",
  cream: "bg-cream text-navy",
  blue: "bg-brand-blue text-white",
};

export function Pill({
  tone = "lime",
  icon,
  children,
  className = "",
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-display text-[13px] font-extrabold ${tones[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
