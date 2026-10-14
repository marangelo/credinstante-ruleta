"use client";

import Image from "next/image";
import { useId, useMemo } from "react";
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

// Las etiquetas van a lo largo del radio (verticales), del aro hacia el centro.
// Medidas en px para una rueda de 340 (se escalan con `k`):
const ARO = 15; // grosor del aro blanco, donde van las hojitas
const RADIO_DISCO = 170 - ARO - 4; // radio del área de color (340/2 - aro - borde dorado 4)
const CENTRO = 74; // diámetro del círculo del logo (chico, para dejar más lugar a los premios)
const MARGEN_ARO = 9; // separación entre el aro y el inicio del texto
const MARGEN_CENTRO = 5; // separación entre el final del texto y el círculo del logo
// Ancho medio de un carácter de Nunito 900 en relación al tamaño de letra (para que el texto entre a lo largo)
const ANCHO_CARACTER = 0.6;

/** Caracteres de la línea más larga si el nombre se reparte en hasta 2 líneas por palabras. */
function caracteresPorLinea(texto: string) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const total = texto.length;
  let mejor = total;
  // Se prueba cada corte entre palabras y se queda con el más parejo
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(" ").length;
    mejor = Math.min(mejor, Math.max(a, total - a - 1));
  }
  return mejor;
}
// Por debajo de este grosor (px a k=1) no entra texto: la rebanada queda solo con su color.
const GROSOR_MINIMO_TEXTO = 11;

type WheelProps = {
  /** Rebanadas de la rueda (ver armarSegmentos). */
  segmentos: Segmento[];
  /** Diámetro total de la rueda en px (la flecha asoma ~30px por arriba). */
  size?: number;
  /** Rotación acumulada en grados (sentido horario). */
  rotation?: number;
  /** Duración de la transición hacia `rotation`, en ms. */
  durationMs?: number;
  /** Se llama cuando termina la transición de giro. */
  onSpinEnd?: () => void;
  /** Índice de la rebanada ganadora: al indicarlo, las demás se oscurecen para destacarla. */
  ganador?: number | null;
};

export function Wheel({ segmentos, size = 340, rotation = 0, durationMs = 10000, onSpinEnd, ganador = null }: WheelProps) {
  const k = size / 340;
  const centro = CENTRO * k;
  // El recorte del logo se diseñó para un centro de 112px: se escala al tamaño actual
  const c = centro / 112;
  // Largo disponible para el texto, desde el aro hasta el logo del centro
  const largo = (RADIO_DISCO - CENTRO / 2 - MARGEN_ARO - MARGEN_CENTRO) * k;
  // Radio donde se mide el grosor del gajo: el texto arranca en el aro, donde es más ancho
  const radioTexto = (RADIO_DISCO - MARGEN_ARO - largo / k * 0.45) * k;

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

  // useId trae ":" o "«»", que no sirven dentro de url(#...)
  const idGradiente = `flecha-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ganadora = ganador != null ? segmentos[ganador] : null;

  return (
    <div
      role="img"
      aria-label={`Ruleta de premios: ${lista}`}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 rounded-full bg-white shadow-[0_16px_40px_rgba(31,107,53,0.28)]" />

      {/* Hojitas sobre el aro blanco (como las luces de una ruleta): no sobresalen, así la rueda
          puede usar todo el ancho de la pantalla. */}
      {hojas.map((h) => (
        <div
          key={h.deg}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 size-0"
          style={{ transform: `rotate(${h.deg}deg)` }}
        >
          <svg
            width={18 * k}
            height={12 * k}
            viewBox="0 0 34 22"
            className="absolute"
            style={{ left: -9 * k, top: -(170 - ARO / 2 + 6) * k }}
          >
            <path d="M2 11 C 8 0, 26 0, 32 11 C 26 22, 8 22, 2 11 Z" fill={h.fill} />
          </svg>
        </div>
      ))}

      <div
        aria-hidden="true"
        className="absolute overflow-hidden rounded-full border-4 border-gold"
        style={{
          inset: ARO * k,
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
          // Ancho del gajo (cuerda) a la altura del texto: limita el tamaño de la letra
          const grosor = Math.min(44 * k, 2 * radioTexto * Math.sin(((s.ancho / 2) * Math.PI) / 180));
          if (grosor < GROSOR_MINIMO_TEXTO * k) return null;
          const esObjeto = s.premio.tipo === "OBJETO";
          const nombre = s.premio.nombre ?? "Premio";
          const monto = formatMonto(s.premio.monto ?? 0);
          return (
            <div key={i} className="absolute inset-0" style={{ transform: `rotate(${s.mid}deg)` }}>
              {/* Escritura vertical: el texto corre del aro hacia el centro */}
              <div
                className="absolute left-1/2 flex items-center overflow-hidden [writing-mode:vertical-rl]"
                style={{ top: MARGEN_ARO * k, height: largo, width: grosor, marginLeft: -grosor / 2, color: s.ink }}
              >
                {esObjeto ? (
                  // Hasta 2 líneas (columnas, en escritura vertical), cortadas por palabras
                  <span
                    className="line-clamp-2 font-display font-black leading-[1.05] [text-wrap:balance]"
                    style={{
                      fontSize: Math.min(14 * k, grosor * 0.44, largo / (caracteresPorLinea(nombre) * ANCHO_CARACTER)),
                    }}
                  >
                    {nombre}
                  </span>
                ) : (
                  // En escritura vertical cada bloque es una columna: "GRAN PREMIO" queda al lado del monto
                  <div className="whitespace-nowrap leading-none">
                    <div
                      className="font-display font-black"
                      style={{
                        fontSize: Math.min(22 * k, grosor * (s.gran ? 0.56 : 0.66), largo / (monto.length * ANCHO_CARACTER)),
                      }}
                    >
                      {monto}
                    </div>
                    {s.gran && (
                      <div
                        className="mr-0.5 font-bold tracking-[0.5px]"
                        style={{ fontSize: Math.min(8 * k, grosor * 0.24) }}
                      >
                        GRAN PREMIO
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Al detenerse: se oscurece todo menos la rebanada ganadora (gira junto con la rueda). */}
        {ganadora && (
          <div
            className="pop-fade absolute inset-0"
            style={{
              background: `conic-gradient(${SOMBRA} 0deg ${ganadora.inicio}deg, transparent ${ganadora.inicio}deg ${ganadora.fin}deg, ${SOMBRA} ${ganadora.fin}deg 360deg)`,
            }}
          />
        )}
      </div>

      {/* Centro: árbol del logo, recortado para que no se vea el texto. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 box-border -translate-1/2 overflow-hidden rounded-full border-gold bg-white shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
        style={{ width: centro, height: centro, borderWidth: 4 * k }}
      >
        <div className="absolute left-0 top-0 overflow-hidden" style={{ width: 102 * c, height: 94 * c }}>
          <Image
            src="/logo.png"
            alt=""
            width={700}
            height={700}
            className="absolute max-w-none"
            style={{ left: -7 * c, top: 5 * c, width: 117 * c, height: 117 * c }}
          />
        </div>
      </div>

      {/* Indicador: flecha dorada fija que entra en la rueda y señala la rebanada ganadora. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 50 64"
        className="absolute left-1/2 drop-shadow-[0_3px_4px_rgba(0,0,0,0.3)]"
        // La punta entra apenas en el área de color (~6px), sin tapar el texto del premio
        style={{ top: (ARO + 4 + 6 - 53) * k, width: 44 * k, height: 56 * k, marginLeft: -22 * k }}
      >
        <defs>
          <linearGradient id={idGradiente} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE7A3" />
            <stop offset="0.55" stopColor="#F2B705" />
            <stop offset="1" stopColor="#B57D05" />
          </linearGradient>
        </defs>
        {/* Cabeza redonda (moneda) y punta hacia abajo */}
        <path
          d="M25 61 L9.5 37 A21 21 0 1 1 40.5 37 Z"
          fill={`url(#${idGradiente})`}
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="25" cy="23" r="12.5" fill="#FFF1BF" stroke="#B57D05" strokeWidth="1.5" />
        <text x="25" y="29.5" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0A1F4A" fontFamily="var(--font-nunito), sans-serif">
          $
        </text>
      </svg>
    </div>
  );
}

// Oscurecido de las rebanadas que no ganaron (azul marino translúcido, en línea con la marca).
const SOMBRA = "rgba(10,31,74,0.55)";
