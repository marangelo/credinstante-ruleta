// Llamadas del servidor de la ruleta a la API de Credinstantes (Laravel). Solo usar en el servidor:
// lleva la clave compartida X-Ruleta-Key.
export async function laravelPost(path: string, body: unknown): Promise<Response> {
  return fetch(`${process.env.LARAVEL_API_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Ruleta-Key": process.env.RULETA_API_KEY ?? "",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
}

export const SIN_CONEXION = "No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.";
