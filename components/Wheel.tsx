"use client";

import Image from "next/image";
import { formatMonto, GRAN_PREMIO, premiosRuleta } from "@/lib/mock-data";

const SEGMENTOS = premiosRuleta.length;
const PASO = 360 / SEGMENTOS;

// Ciclo de colores de los segmentos; el gran premio va siempre en dorado.
const paleta = [
  { fill: "#2E8B47", ink: "#FFFFFF" },
  { fill: "#FFF1BF", ink: "#123E8C" },
  { fill: "#123E8C", ink: "#FFFFFF" },
  { fill: "#CFEFC9", ink: "#123E8C" },
];
const dorado = { fill: "#F2B705", ink: "#0A1F4A" };

const segmentos = premiosRuleta.map((monto, i) => {
  const gran = monto === GRAN_PREMIO;
  return { monto, gran, mid: i * PASO + PASO / 2, ...(gran ? dorado : paleta[i % paleta.length]) };
});

const conic = `conic-gradient(${segmentos
  .map((s, i) => `${s.fill} ${i * PASO}deg ${(i + 1) * PASO}deg`)
  .join(", ")})`;

const hojas = Array.from({ length: 16 }, (_, i) => ({ deg: i * 22.5 + 11, fill: i % 2 ? "#2E8B47" : "#7FC98B" }));

/** Índice del segmento que queda bajo el indicador (arriba) para una rotación dada en grados. */
export function segmentoEn(rotation: number) {
  const local = (((-rotation % 360) + 360) % 360);
  return Math.floor(local / PASO) % SEGMENTOS;
}

/**
 * Rotación final (siempre mayor que `actual`) que deja el segmento `indice` bajo el indicador,
 * después de `vueltas` vueltas completas. `desvio` (-1..1) corre el punto dentro del segmento.
 */
export function rotacionHacia(actual: number, indice: number, vueltas: number, desvio = 0) {
  const local = indice * PASO + PASO / 2 + desvio * PASO * 0.35;
  const destino = ((-local % 360) + 360) % 360;
  const resto = ((destino - (actual % 360)) % 360 + 360) % 360;
  return actual + vueltas * 360 + resto;
}

type WheelProps = {
  /** Diámetro del aro blanco en px (las hojas sobresalen ~17px por lado). */
  size?: number;
  /** Rotación acumulada en grados (sentido horario). */
  rotation?: number;
  /** Duración de la transición hacia `rotation`, en ms. */
  durationMs?: number;
  /** Se llama cuando termina la transición de giro. */
  onSpinEnd?: () => void;
};

export function Wheel({ size = 340, rotation = 0, durationMs = 5000, onSpinEnd }: WheelProps) {
  const k = size / 340;
  const centro = 112 * k;
  const lista = premiosRuleta.map(formatMonto).join(", ");

  return (
    <div
      role="img"
      aria-label={`Ruleta de premios con ${SEGMENTOS} montos: ${lista}`}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      {hojas.map((h) => (
        <div
          key={h.deg}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-0"
          style={{ transform: `rotate(${h.deg}deg)` }}
        >
          <svg
            width={34 * k}
            height={22 * k}
            viewBox="0 0 34 22"
            className="absolute"
            style={{ left: -17 * k, top: -187 * k }}
          >
            <path d="M2 11 C 8 0, 26 0, 32 11 C 26 22, 8 22, 2 11 Z" fill={h.fill} />
            <text x="17" y="15" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF">
              $
            </text>
          </svg>
        </div>
      ))}

      <div className="absolute inset-0 rounded-full bg-white shadow-[0_16px_40px_rgba(31,107,53,0.28)]" />

      <div
        aria-hidden="true"
        className="absolute overflow-hidden rounded-full border-4 border-gold"
        style={{
          inset: 10 * k,
          background: conic,
          transform: `rotate(${rotation}deg)`,
          transition: `transform ${durationMs}ms cubic-bezier(.12,.72,.08,1)`,
        }}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && e.propertyName === "transform") onSpinEnd?.();
        }}
      >
        {segmentos.map((s) => (
          <div
            key={s.monto}
            className="absolute inset-0 flex justify-center"
            style={{ transform: `rotate(${s.mid}deg)` }}
          >
            <div
              className="flex flex-col items-center text-center"
              style={{ marginTop: 16 * k, width: 60 * k, color: s.ink }}
            >
              <span className="font-display font-black leading-none" style={{ fontSize: 20 * k }}>
                {formatMonto(s.monto)}
              </span>
              {s.gran && (
                <span className="mt-0.5 font-bold tracking-[0.5px]" style={{ fontSize: 9 * k }}>
                  GRAN PREMIO
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Centro: árbol del logo, recortado para que no se vea el texto. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 box-border -translate-1/2 overflow-hidden rounded-full border-gold bg-white shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
        style={{ width: centro, height: centro, borderWidth: 5 * k }}
      >
        <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 102 * k, height: 94 * k }}>
          <Image
            src="/logo.png"
            alt=""
            width={700}
            height={700}
            className="absolute max-w-none"
            style={{ left: -7 * k, top: 5 * k, width: 117 * k, height: 117 * k }}
          />
        </div>
      </div>

      {/* Indicador: moneda que se balancea sobre el aro. */}
      <div
        aria-hidden="true"
        className="coin animate-sway absolute left-1/2 flex items-center justify-center rounded-full border-3 border-white font-display font-black text-white shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
        style={{
          top: -20 * k,
          width: 46 * k,
          height: 46 * k,
          marginLeft: -23 * k,
          fontSize: 21 * k,
          transformOrigin: "50% 100%",
        }}
      >
        $
      </div>
    </div>
  );
}
