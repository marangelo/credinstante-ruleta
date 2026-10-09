"use client";

import { Printer } from "lucide-react";

export function VoucherPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex h-11 items-center gap-2 rounded-[14px] bg-gold px-5 font-display text-[17px] font-black text-navy shadow-[0_4px_0_#B57D05] active:translate-y-[2px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
    >
      <Printer size={20} strokeWidth={2.4} aria-hidden="true" />
      Imprimir
    </button>
  );
}
