import { Card } from "./Card";

export function StatCard({ label, value, accent = "blue" }: { label: string; value: string; accent?: "blue" | "green" }) {
  return (
    <Card className="p-4">
      <p className="text-[13px] text-ink-soft">{label}</p>
      <p className={`font-display text-[28px] font-black leading-tight ${accent === "green" ? "text-green" : "text-brand-blue"}`}>
        {value}
      </p>
    </Card>
  );
}
