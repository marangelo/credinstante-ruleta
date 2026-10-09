// Colinas verdes decorativas que asoman desde abajo, detrás del contenido.
export function Hills({ height = 150 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
      style={{ height }}
    >
      <div className="absolute -left-20 -right-20 top-0 h-[420px] rounded-[50%] bg-green" />
      <div className="absolute -left-10 -right-30 top-10 h-[420px] rounded-[50%] bg-green-dark" />
    </div>
  );
}
