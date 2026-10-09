import type { Metadata, Viewport } from "next";
import { Heebo, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nunito",
});

const heebo = Heebo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "Ruleta de Premios · Credin$tante",
  description: "App del promotor para entregar premios con la ruleta de Credin$tante.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2E8B47",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${nunito.variable} ${heebo.variable}`}>
      <body className="min-h-dvh bg-bg antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-bg">{children}</div>
      </body>
    </html>
  );
}
