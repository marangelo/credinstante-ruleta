"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Gift } from "lucide-react";
import { formatMonto } from "@/lib/mock-data";
import type { Premio } from "@/lib/premios";

// Mínimo de rebanadas: con pocos premios se repiten para que la rueda no quede con 2 o 3 gajos enormes.
const MIN_SEGMENTOS = 8;

/** Rebanada de la rueda: el premio y su arco en grados (sentido horario desde arriba). */
export type Segmento = { premio: Premio; inicio: number; fin: number };

/**
 * Rebanadas de la rueda a partir de los premios de la promoción. Todas miden lo mismo (rueda
 * simétrica) aunque los premios tengan pesos distintos: el peso solo cambia la probabilidad del
 * sorteo en Laravel, no el dibujo. Con pocos premios la lista se repite y se alternan bajos y altos.
 */
export function armarSegmentos(premios: Premio[]): Segmento[] {
  if (premios.length === 0) return [];
  // Dinero de menor a mayor y los objetos al final; luego se intercala bajo/alto
  const orden = [...premios].sort((a, b) => (a.monto ?? Infinity) - (b.monto ?? Infinity));
  const mezcla: Premio[] = [];
  for (let i = 0, j = orden.length - 1; i <= j; i++, j--) {
    mezcla.push(orden[i]);
    if (i !== j) mezcla.push(orden[j]);
  }

  const vueltas = Math.ceil(MIN_SEGMENTOS / mezcla.length);
  const lista = Array.from({ length: vueltas }, () => mezcla).flat();
  const paso = 360 / lista.length;
  return lista.map((premio, i) => ({ premio, inicio: i * paso, fin: (i + 1) * paso }));
}

/**
 * Rotación final (siempre mayor que `actual`) que deja la rebanada bajo el indicador (arriba),
 * después de `vueltas` vueltas completas. `desvio` (-1..1) corre el punto dentro de la rebanada.
 */
export function rotacionHacia(actual: number, seg: Segmento, vueltas: number, desvio = 0) {
  const local = (seg.inicio + seg.fin) / 2 + desvio * ((seg.fin - seg.inicio) / 2) * 0.7;
  const destino = ((-local % 360) + 360) % 360;
  const resto = ((destino - (actual % 360)) % 360 + 360) % 360;
  return actual + vueltas * 360 + resto;
}

// Ciclo de colores de los segmentos; el gran premio va en dorado y los objetos en lima.
const paleta = [
  { fill: "#2E8B47", ink: "#FFFFFF" },
  { fill: "#FFF1BF", ink: "#123E8C" },
  { fill: "#123E8C", ink: "#FFFFFF" },
  { fill: "#CFEFC9", ink: "#123E8C" },
];
const dorado = { fill: "#F2B705", ink: "#0A1F4A" };
const objeto = { fill: "#86B817", ink: "#FFFFFF" };

const hojas = Array.from({ length: 16 }, (_, i) => ({ deg: i * 22.5 + 11, fill: i % 2 ? "#2E8B47" : "#7FC98B" }));

// Ancho de referencia de una rebanada (12 por rueda): con menos grados el texto se achica.
const ANCHO_REFERENCIA = 30;
// Por debajo de este ancho no entra texto: la rebanada queda solo con su color.
const ANCHO_MINIMO_TEXTO = 9;

type WheelProps = {
  /** Rebanadas de la rueda (ver armarSegmentos). */
  segmentos: Segmento[];
  /** Diámetro del aro blanco en px (las hojas sobresalen ~17px por lado). */
  size?: number;
  /** Rotación acumulada en grados (sentido horario). */
  rotation?: number;
  /** Duración de la transición hacia `rotation`, en ms. */
  durationMs?: number;
  /** Se llama cuando termina la transición de giro. */
  onSpinEnd?: () => void;
};

export function Wheel({ segmentos, size = 340, rotation = 0, durationMs = 10000, onSpinEnd }: WheelProps) {
  const k = size / 340;
  const centro = 112 * k;

  const { gajos, conic, lista } = useMemo(() => {
    const montos = segmentos.flatMap((s) => (s.premio.tipo === "DINERO" ? [s.premio.monto ?? 0] : []));
    const mayor = new Set(montos).size > 1 ? Math.max(...montos) : null;
    const g = segmentos.map((s, i) => {
      const esObjeto = s.premio.tipo === "OBJETO";
      const gran = !esObjeto && s.premio.monto === mayor;
      return {
        ...s,
        gran,
        ancho: s.fin - s.inicio,
        mid: (s.inicio + s.fin) / 2,
        ...(esObjeto ? objeto : gran ? dorado : paleta[i % paleta.length]),
      };
    });
    const unicos = new Map(segmentos.map((s) => [s.premio.id, s.premio]));
    return {
      gajos: g,
      conic: `conic-gradient(${g.map((s) => `${s.fill} ${s.inicio}deg ${s.fin}deg`).join(", ")})`,
      lista: [...unicos.values()].map((p) => (p.tipo === "OBJETO" ? p.nombre : formatMonto(p.monto ?? 0))).join(", "),
    };
  }, [segmentos]);

  return (
    <div
      role="img"
      aria-label={`Ruleta de premios: ${lista}`}
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
          // ease-out cúbica: arranca rápido y la velocidad baja de forma pareja hasta detenerse suave
          transition: `transform ${durationMs}ms cubic-bezier(.22,.61,.36,1)`,
        }}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && e.propertyName === "transform") onSpinEnd?.();
        }}
      >
        {gajos.map((s, i) => {
          if (s.ancho < ANCHO_MINIMO_TEXTO) return null;
          const escala = Math.min(1, s.ancho / ANCHO_REFERENCIA);
          return (
            <div
              key={i}
              className="absolute inset-0 flex justify-center"
              style={{ transform: `rotate(${s.mid}deg)` }}
            >
              <div
                className="flex flex-col items-center text-center"
                style={{ marginTop: 16 * k, width: 64 * k * Math.max(escala, 0.7), color: s.ink }}
              >
                {s.premio.tipo === "OBJETO" ? (
                  <>
                    <Gift size={18 * k * escala} strokeWidth={2.4} />
                    <span
                      className="mt-0.5 line-clamp-2 font-display font-black leading-[1.05] [overflow-wrap:anywhere]"
                      style={{ fontSize: 12 * k * escala }}
                    >
                      {s.premio.nombre}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-display font-black leading-none" style={{ fontSize: 20 * k * escala }}>
                      {formatMonto(s.premio.monto ?? 0)}
                    </span>
                    {s.gran && (
                      <span className="mt-0.5 font-bold tracking-[0.5px]" style={{ fontSize: 9 * k * escala }}>
                        GRAN PREMIO
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
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
