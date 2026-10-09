import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";

const base =
  "relative flex h-[60px] w-full items-center justify-center gap-3 rounded-[20px] font-display text-[21px] font-black no-underline transition-[transform,box-shadow,filter] duration-150 ease-out active:translate-y-[3px] disabled:active:translate-y-0 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue disabled:opacity-70";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-navy shadow-gold hover:brightness-105 active:shadow-[0_3px_0_#B57D05]",
  secondary: "bg-white text-green-dark shadow-card-lg active:shadow-card",
};

type Common = { variant?: Variant; icon?: ReactNode; children: ReactNode; className?: string };

type ButtonProps = Common & ({ href: string } | (Omit<ComponentProps<"button">, "children"> & { href?: undefined }));

export function Button({ variant = "primary", icon, children, className = "", ...rest }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={cls}>
        {icon}
        {children}
      </Link>
    );
  }
  const { type = "button", ...btn } = rest as ComponentProps<"button">;
  return (
    <button type={type} className={cls} {...btn}>
      {icon}
      {children}
    </button>
  );
}
