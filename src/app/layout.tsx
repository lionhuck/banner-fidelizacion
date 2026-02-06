import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema de Fidelización",
  description: "Gestión de clientes, entidades y equipos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617)] text-zinc-100">
            <header className="border-b border-white/10 bg-zinc-950/60 backdrop-blur">
              <div className="mx-auto flex items-center justify-between gap-3 px-6 py-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
                    Banner Director
                  </div>
                  <div className="mt-1 text-lg font-semibold tracking-tight">
                    Sistema de fidelización
                  </div>
                </div>
                <div className="hidden text-xs text-zinc-400 md:block">
                  Panel unificado de clientes, entidades y equipos
                </div>
              </div>
            </header>

            {/* Cambiado: Removí max-w-6xl para permitir que el contenido use todo el ancho */}
            <main className="page-shell w-full !p-0">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}