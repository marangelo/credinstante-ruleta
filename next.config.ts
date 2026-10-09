import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera un servidor autocontenido en .next/standalone (lo empaqueta scripts/build-dist.mjs en dist/).
  output: "standalone",
  images: {
    // El build se hace en Windows y corre en Linux: sin optimizador no depende de binarios de `sharp`.
    unoptimized: true,
  },
};

export default nextConfig;
