import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackButton({ href, label = "Volver" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-brand-blue shadow-card focus-visible:outline-3 focus-visible:outline-brand-blue"
    >
      <ArrowLeft size={22} strokeWidth={2.5} aria-hidden="true" />
    </Link>
  );
}
