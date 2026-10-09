import type { ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`rounded-[20px] bg-white shadow-card ${className}`} {...props} />;
}
