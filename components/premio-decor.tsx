// Rayos dorados girando y hojas/monedas cayendo detrás del contenido de /premio.
// Ambas capas usan .motion-decor y desaparecen con prefers-reduced-motion.

const fills = ["#2E8B47", "#7FC98B", "#1F6B35"];

const gotas = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 53 + 17) % 360,
  moneda: i % 3 === 0,
  fill: fills[i % 3],
  dur: 5 + (i % 5),
  delay: -((i * 0.9) % 6),
}));

export function PremioDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="motion-decor animate-rays absolute left-1/2 top-[250px] -ml-[410px] -mt-[410px] size-[820px] rounded-full"
        style={{
          background: "repeating-conic-gradient(rgba(242,183,5,.18) 0deg 9deg, rgba(242,183,5,0) 9deg 22deg)",
        }}
      />
      {gotas.map((g) => (
        <div
          key={g.x}
          className="motion-decor animate-fall absolute top-0"
          style={{ left: g.x, animationDuration: `${g.dur}s`, animationDelay: `${g.delay}s` }}
        >
          {g.moneda ? (
            <div className="coin size-5 rounded-full border-2 border-white" />
          ) : (
            <svg width="26" height="17" viewBox="0 0 34 22">
              <path d="M2 11 C 8 0, 26 0, 32 11 C 26 22, 8 22, 2 11 Z" fill={g.fill} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
