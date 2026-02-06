"use client";

import { CustomerGroup } from "@/lib/grouping";
import { ChevronRight, Building2, MapPin, Boxes } from "lucide-react";

export default function ReportsDashboardView({
  isLoading,
  groups,
  onOpenCustomer,
}: {
  isLoading: boolean;
  groups: CustomerGroup[];
  onOpenCustomer: (g: CustomerGroup) => void;
}) {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-400" />
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Clientes
            </div>
          </div>
          <div className="mt-2 text-xl font-bold text-zinc-50">
            Vista consolidada de clientes y parque de equipos
          </div>
          <div className="mt-1 text-sm text-zinc-400">
            Hacé click en una fila para ver el detalle completo del cliente
          </div>
        </div>
        <div className="shrink-0 rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm">
          {isLoading ? "Cargando…" : `${groups.length} ${groups.length === 1 ? 'cliente' : 'clientes'}`}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-2xl shadow-black/20 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            {/* Table Header */}
            <thead className="border-b border-white/10 bg-zinc-900/80 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Cliente
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-300">
                  <div className="flex items-center justify-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Ubicaciones</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-300">
                  <div className="flex items-center justify-center gap-1.5">
                    <Boxes className="h-3.5 w-3.5" />
                    <span>Sistemas</span>
                  </div>
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Total
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Activos
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Inactivos
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-amber-400">
                  Libres
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-blue-400">
                  Ocupados
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-zinc-300">
                  % Activo
                </th>
                <th className="w-32 px-4 py-4"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/5">
              {isLoading &&
                skeletonItems.map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-6 w-48 rounded-lg bg-white/5" />
                      <div className="mt-2 h-4 w-32 rounded bg-white/5" />
                    </td>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="mx-auto h-6 w-16 rounded-lg bg-white/5" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!isLoading &&
                groups.map((g, index) => {
                  const activePercentage = g.total ? Math.round((g.active / g.total) * 100) : 0;
                  
                  return (
                    <tr
                      key={g.id}
                      onClick={() => onOpenCustomer(g)}
                      className="group cursor-pointer transition-all hover:bg-gradient-to-r hover:from-emerald-500/5 hover:via-emerald-500/3 hover:to-transparent"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Cliente Name */}
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-1 ring-emerald-500/20 transition-all group-hover:scale-110 group-hover:ring-emerald-400/40">
                            <Building2 className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-zinc-50 transition-colors group-hover:text-emerald-400">
                              {g.name}
                            </div>
                            <div className="mt-1 text-xs text-zinc-500">
                              ID: {g.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ubicaciones */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center justify-center rounded-lg bg-blue-500/10 px-3 py-1.5 font-mono text-sm font-bold text-blue-300 ring-1 ring-blue-500/20">
                          {g.locations.length}
                        </div>
                      </td>

                      {/* Sistemas */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center justify-center rounded-lg bg-purple-500/10 px-3 py-1.5 font-mono text-sm font-bold text-purple-300 ring-1 ring-purple-500/20">
                          {Object.keys(g.systems).length}
                        </div>
                      </td>

                      {/* Total Equipos */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 px-4 py-2 text-base font-black text-emerald-300 ring-2 ring-emerald-500/30 transition-all group-hover:scale-105 group-hover:ring-emerald-400/50">
                          {g.total}
                        </div>
                      </td>

                      {/* Activos */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center justify-center rounded-lg bg-emerald-500/10 px-3 py-1.5 font-mono text-sm font-bold text-emerald-300 ring-1 ring-emerald-500/20">
                          {g.free}
                        </div>
                      </td>

                      {/* Inactivos */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center justify-center rounded-lg bg-zinc-700/20 px-3 py-1.5 font-mono text-sm font-bold text-zinc-400 ring-1 ring-zinc-600/20">
                          {g.inactive}
                        </div>
                      </td>

                      {/* Libres */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center justify-center rounded-lg bg-amber-500/10 px-3 py-1.5 font-mono text-sm font-bold text-amber-300 ring-1 ring-amber-500/20">
                          {g.free}
                        </div>
                      </td>

                      {/* Ocupados */}
                      <td className="px-4 py-5 text-center">
                        <div className="inline-flex items-center justify-center rounded-lg bg-blue-500/10 px-3 py-1.5 font-mono text-sm font-bold text-blue-300 ring-1 ring-blue-500/20">
                          {g.occupied}
                        </div>
                      </td>

                      {/* Porcentaje Activo */}
                      <td className="px-4 py-5 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="font-mono text-base font-bold text-zinc-100">
                            {activePercentage}%
                          </span>
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                              style={{ width: `${activePercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Acción */}
                      <td className="px-4 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-60 transition-all group-hover:opacity-100">
                          <span className="text-xs font-medium text-zinc-400 group-hover:text-emerald-400">
                            Ver detalle
                          </span>
                          <div className="rounded-lg bg-emerald-500/10 p-1.5 transition-all group-hover:bg-emerald-500/20">
                            <ChevronRight className="h-4 w-4 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              {/* Empty State */}
              {!isLoading && groups.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-16">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50 ring-1 ring-white/10">
                        <Building2 className="h-8 w-8 text-zinc-600" />
                      </div>
                      <div className="text-base font-semibold text-zinc-400">
                        No hay clientes para mostrar
                      </div>
                      <div className="mt-2 text-sm text-zinc-500">
                        Intentá ajustar los filtros de búsqueda
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Footer */}
      {!isLoading && groups.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-gradient-to-r from-zinc-950/80 to-zinc-900/60 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Total equipos:</span>
              <span className="font-mono text-base font-bold text-zinc-100">
                {groups.reduce((sum, g) => sum + g.total, 0).toLocaleString()}
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">Equipos activos:</span>
              <span className="font-mono text-base font-bold text-emerald-300">
                {groups.reduce((sum, g) => sum + g.active, 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 ring-1 ring-emerald-500/20">
            <span className="text-xs font-medium text-zinc-400">Promedio activo:</span>
            <span className="font-mono text-lg font-black text-emerald-300">
              {groups.length > 0
                ? Math.round(
                    (groups.reduce((sum, g) => sum + g.active, 0) / 
                    groups.reduce((sum, g) => sum + g.total, 0)) * 100
                  )
                : 0}
              %
            </span>
          </div>
        </div>
      )}
    </div>
  );
}