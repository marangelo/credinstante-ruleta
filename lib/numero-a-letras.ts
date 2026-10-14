// Monto en letras para el ticket: 500 -> "Quinientos córdobas netos", 1250.5 -> "Mil doscientos cincuenta córdobas con 50/100".

const UNIDADES = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const DIEZ_A_VEINTINUEVE = [
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
  "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const DECENAS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const CENTENAS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

/** 0..999 en letras ("uno" se ajusta a "un" afuera, antes de un sustantivo). */
function hastaMil(n: number): string {
  if (n === 100) return "cien";
  const c = Math.floor(n / 100);
  const resto = n % 100;
  let texto: string;
  if (resto < 10) texto = UNIDADES[resto];
  else if (resto < 30) texto = DIEZ_A_VEINTINUEVE[resto - 10];
  else texto = DECENAS[Math.floor(resto / 10)] + (resto % 10 ? ` y ${UNIDADES[resto % 10]}` : "");
  return [CENTENAS[c], texto].filter(Boolean).join(" ");
}

/** "uno" -> "un" y "veintiuno" -> "veintiún" cuando va antes de "mil", "millones" o "córdobas". */
const apocopar = (t: string) => t.replace(/veintiuno$/, "veintiún").replace(/uno$/, "un");

function entero(n: number): string {
  if (n === 0) return "cero";
  const millones = Math.floor(n / 1_000_000);
  const miles = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;
  const partes: string[] = [];
  if (millones) partes.push(millones === 1 ? "un millón" : `${apocopar(entero(millones))} millones`);
  if (miles) partes.push(miles === 1 ? "mil" : `${apocopar(hastaMil(miles))} mil`);
  if (resto) partes.push(hastaMil(resto));
  return partes.join(" ");
}

export function montoEnLetras(monto: number): string {
  const total = Math.round(monto * 100);
  const cordobas = Math.floor(total / 100);
  const centavos = total % 100;
  const uno = cordobas === 1;
  // "un millón de córdobas", pero "un millón doscientos mil córdobas"
  const de = cordobas >= 1_000_000 && cordobas % 1_000_000 === 0 ? " de" : "";
  const moneda = uno ? "córdoba" : "córdobas";
  const cola = centavos ? `con ${String(centavos).padStart(2, "0")}/100` : uno ? "neto" : "netos";
  const texto = `${apocopar(entero(cordobas))}${de} ${moneda} ${cola}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
