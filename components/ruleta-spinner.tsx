"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./Button";
import { rotacionHacia, segmentoEn, Wheel } from "./Wheel";
import { formatMonto, premiosRuleta } from "@/lib/mock-data";

type Estado = "listo" | "girando" | "terminado";

// En el mockup la rueda mide 340px en una pantalla de 390px: se mantiene esa proporción.
const PROPORCION = 340 / 390;
// Las hojas sobresalen del aro: el conjunto ocupa ~1.16 veces el diámetro.
const ALTO_CON_HOJAS = 396 / 340;
const MIN_SIZE = 240;
const PADDING_SUPERIOR = 26;

/** Diámetro de la rueda según el ancho de la pantalla y el alto disponible. */
function useWheelSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(340);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      const pantalla = el.closest("main")?.clientWidth ?? 390;
      const porAncho = pantalla * PROPORCION;
      const porAlto = (el.clientHeight - PADDING_SUPERIOR) / ALTO_CON_HOJAS;
      setSize(Math.round(Math.max(MIN_SIZE, Math.min(porAncho, porAlto))));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, size };
}

// Solo demo: el resultado se sortea en el cliente.
export function RuletaSpinner() {
  const [rotation, setRotation] = useState(0);
  const [duracion, setDuracion] = useState(5000);
  const [estado, setEstado] = useState<Estado>("listo");
  const [monto, setMonto] = useState<number | null>(null);
  const { ref, size } = useWheelSize();

  function girar() {
    if (estado !== "listo") return;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const indice = Math.floor(Math.random() * premiosRuleta.length);
    setDuracion(reducido ? 1200 : 5000);
    setRotation((r) => rotacionHacia(r, indice, reducido ? 1 : 6, Math.random() * 2 - 1));
    setEstado("girando");
  }

  function alTerminar() {
    if (estado !== "girando") return;
    setMonto(premiosRuleta[segmentoEn(rotation)]);
    setEstado("terminado");
  }

  // Respaldo: si el navegador no dispara transitionend (pestaña en segundo plano,
  // transición interrumpida), el resultado igual aparece al terminar el tiempo del giro.
  useEffect(() => {
    if (estado !== "girando") return;
    const t = window.setTimeout(() => {
      setMonto(premiosRuleta[segmentoEn(rotation)]);
      setEstado("terminado");
    }, duracion + 200);
    return () => window.clearTimeout(t);
  }, [estado, rotation, duracion]);

  return (
    <>
      {/* Área flexible: la rueda toma el tamaño que permite la pantalla. */}
      <div ref={ref} className="flex min-h-0 flex-1 items-start justify-center pt-[26px]">
        <Wheel size={size} rotation={rotation} durationMs={duracion} onSpinEnd={alTerminar} />
      </div>

      {/* Alto reservado para la pill del resultado, así la rueda no cambia de tamaño al aparecer. */}
      <div aria-live="polite" className="flex h-[58px] shrink-0 items-start justify-center">
        {estado === "terminado" && monto !== null && (
          <p className="pop-in flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-[18px] font-black text-brand-blue shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
            <Check size={18} strokeWidth={3} className="text-green" aria-hidden="true" />
            ¡Ganó {formatMonto(monto)}!
          </p>
        )}
      </div>

      {estado === "terminado" && monto !== null ? (
        <Button key="ver" href={`/premio?monto=${monto}`} className="swap-in [animation-delay:120ms]!">
          Ver premio
        </Button>
      ) : (
        <Button key="girar" onClick={girar} disabled={estado === "girando"}>
          {estado === "girando" ? "Girando…" : "¡Girar ahora!"}
        </Button>
      )}
    </>
  );
}
