// Arma dist/ a partir del build standalone de Next.js.
// dist/ es lo único que monta el contenedor: server.js + .next/static + public.
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");
const dist = join(root, "dist");

if (!existsSync(join(standalone, "server.js"))) {
  console.error("No se encontró .next/standalone/server.js. Corré `next build` primero.");
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
cpSync(standalone, dist, { recursive: true });
cpSync(join(root, ".next", "static"), join(dist, ".next", "static"), { recursive: true });
cpSync(join(root, "public"), join(dist, "public"), { recursive: true });
// Punto de montaje para la caché en memoria (tmpfs) del contenedor.
mkdirSync(join(dist, ".next", "cache"), { recursive: true });

console.log("dist/ listo. Reiniciá el contenedor: docker compose restart web");
