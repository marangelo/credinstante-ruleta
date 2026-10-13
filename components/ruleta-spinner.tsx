"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "./Button";
import { armarSegmentos, rotacionHacia, Wheel } from "./Wheel";
import { girar, type ResultadoGiro } from "@/app/ruleta/actions";
import { textoPremio, type Premio, type PremioGanado } from "@/lib/premios";

type Estado = "listo" | "pidiendo" | "girando" | "terminado";

// Giro largo que va frenando de a poco (la curva está en Wheel). Con movimiento reducido, giro corto.
const DURACION_GIRO = 10000;
const VUELTAS_GIRO = 10;

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

type Props = { idCliente: number; premios: Premio[] };

// El premio lo sortea y registra Laravel (acción `girar`); la rueda solo se anima hasta una
// rebanada de ese premio. Las rebanadas son todas iguales; la probabilidad de cada premio la
// define su peso en Laravel.
export function RuletaSpinner({ idCliente, premios }: Props) {
  const segmentos = useMemo(() => armarSegmentos(premios), [premios]);
  const [rotation, setRotation] = useState(0);
  const [duracion, setDuracion] = useState(DURACION_GIRO);
  const [estado, setEstado] = useState<Estado>("listo");
  const [premio, setPremio] = useState<{ premio: PremioGanado; codigo: string } | null>(null);
  const [error, setError] = useState<{ mensaje: string; codigo?: string } | null>(null);
  const { ref, size } = useWheelSize();

  async function iniciarGiro() {
    if (estado !== "listo") return;
    setEstado("pidiendo");
    setError(null);

    let r: ResultadoGiro;
    try {
      r = await girar(idCliente);
    } catch {
      r = { ok: false, error: "No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo." };
    }

    if (!r.ok) {
      setError({ mensaje: r.error, codigo: r.codigo });
      setEstado(r.codigo ? "terminado" : "listo");
      return;
    }

    // Cualquiera de las rebanadas del premio ganado
    const opciones = segmentos.filter((s) => s.premio.id === r.idPremio);
    const destino = opciones[Math.floor(Math.random() * opciones.length)] ?? segmentos[0];
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPremio({ premio: r.premio, codigo: r.codigo });
    setDuracion(reducido ? 1200 : DURACION_GIRO);
    setRotation((rot) => rotacionHacia(rot, destino, reducido ? 1 : VUELTAS_GIRO, Math.random() * 2 - 1));
    setEstado("girando");
  }

  function alTerminar() {
    if (estado === "girando") setEstado("terminado");
  }

  // Respaldo: si el navegador no dispara transitionend (pestaña en segundo plano,
  // transición interrumpida), el resultado igual aparece al terminar el tiempo del giro.
  useEffect(() => {
    if (estado !== "girando") return;
    const t = window.setTimeout(() => setEstado("terminado"), duracion + 200);
    return () => window.clearTimeout(t);
  }, [estado, duracion]);

  return (
    <>
      {/* Área flexible: la rueda toma el tamaño que permite la pantalla. */}
      <div ref={ref} className="flex min-h-0 flex-1 items-start justify-center pt-[26px]">
        <Wheel segmentos={segmentos} size={size} rotation={rotation} durationMs={duracion} onSpinEnd={alTerminar} />
      </div>

      {/* Alto reservado para la pill del resultado, así la rueda no cambia de tamaño al aparecer. */}
      <div aria-live="polite" className="flex min-h-[58px] shrink-0 items-start justify-center">
        {estado === "terminado" && premio && (
          <p className="pop-in flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-[18px] font-black text-brand-blue shadow-[0_4px_12px_rgba(0,0,0,0.18)]">
            <Check size={18} strokeWidth={3} className="text-green" aria-hidden="true" />
            ¡Ganó {textoPremio(premio.premio)}!
          </p>
        )}
        {error && (
          <p role="alert" className="mb-2 rounded-2xl bg-cream px-4 py-2.5 text-center text-[14px] font-semibold text-navy">
            {error.mensaje}
          </p>
        )}
      </div>

      {estado === "terminado" && (premio || error?.codigo) ? (
        <Button key="ver" href={`/premio?codigo=${premio?.codigo ?? error!.codigo}`} className="swap-in [animation-delay:120ms]!">
          {premio ? "Ver premio" : "Ver su premio"}
        </Button>
      ) : (
        <Button key="girar" onClick={iniciarGiro} disabled={estado !== "listo"}>
          {estado === "listo" ? (error ? "Intentar de nuevo" : "¡Girar ahora!") : "Girando…"}
        </Button>
      )}
    </>
  );
}
