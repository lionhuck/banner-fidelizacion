"use client";

import { ReportEntidadesEquipos } from "@/models/types";
import { isActiveRecord, parseDate } from "@/lib/active";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Activity, MapPin, Wrench, Hash, Wifi, Clock, HardDrive } from "lucide-react";

function Badge({ children, tone }: { children: React.ReactNode; tone: "ok" | "muted" | "warn" }) {
  const variants = {
    ok: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
    warn: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30",
    muted: "bg-zinc-700/20 text-zinc-400 ring-1 ring-zinc-600/20",
  };

  return (
    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${variants[tone]}`}>
      {children}
    </span>
  );
}

export default function ReportsTableView({
  title,
  records,
  lastSeenDays,
  activeOnly,
}: {
  title: string;
  records: ReportEntidadesEquipos[];
  lastSeenDays: number;
  activeOnly: boolean;
}) {
  const rows = activeOnly ? records.filter(r => isActiveRecord(r, lastSeenDays)) : records;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <div className="text-base font-bold text-zinc-100">{title}</div>
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            Mostrando <span className="font-semibold text-emerald-300">{rows.length}</span> de{" "}
            <span className="font-semibold text-zinc-200">{records.length}</span> registros
          </div>
        </div>
        {activeOnly && (
          <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
            Mostrando solo activos
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950/40 shadow-xl">
        <div className="flex-1 overflow-auto">
          <Table
            aria-label={title}
            removeWrapper
            classNames={{
              table: "min-w-full text-sm",
              th: "bg-zinc-900/90 text-[11px] font-bold text-zinc-300 uppercase tracking-wider py-4 first:rounded-tl-xl last:rounded-tr-xl",
              td: "align-top py-4 border-b border-white/5",
            }}
          >
            <TableHeader>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" />
                  Estado
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Cliente
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Ubicación
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5" />
                  Equipo
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  UID
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3.5 w-3.5" />
                  MACs
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Últ. conexión
                </div>
              </TableColumn>
              <TableColumn>
                <div className="flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5" />
                  Sistema
                </div>
              </TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/50 ring-1 ring-white/10">
                    <Activity className="h-6 w-6 text-zinc-600" />
                  </div>
                  <div className="text-sm font-medium text-zinc-400">
                    No hay datos para mostrar
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    Intentá ajustar los filtros actuales
                  </div>
                </div>
              }
              items={rows}
            >
              {(r: ReportEntidadesEquipos) => {
                const active = isActiveRecord(r, lastSeenDays);
                const last = parseDate(r.ultima_conexion);
                const customer =
                  r.grupo_administracion_nombre?.trim() ||
                  r.entidad_nombre?.trim() ||
                  r.entidad_codigo_interno?.trim() ||
                  "(Sin cliente)";

                const key = `${r.equipo_id ?? r.uid ?? Math.random()}`;

                return (
                  <TableRow 
                    key={key}
                    className="transition-colors hover:bg-white/[0.02]"
                  >
                    {/* Estado */}
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {active ? (
                          <Badge tone="ok">✓ Activo</Badge>
                        ) : (
                          <Badge tone="muted">○ Inactivo</Badge>
                        )}
                        {r.libre ? <Badge tone="warn">⚠ Libre</Badge> : null}
                      </div>
                    </TableCell>

                    {/* Cliente */}
                    <TableCell>
                      <div className="max-w-[240px]">
                        <div className="truncate font-semibold text-zinc-100">
                          {customer}
                        </div>
                        {r.entidad_codigo_interno && (
                          <div className="mt-1 truncate text-xs text-zinc-500">
                            CUIT: {r.entidad_codigo_interno}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Ubicación */}
                    <TableCell>
                      <div className="max-w-[220px]">
                        <div className="truncate font-medium text-zinc-200">
                          {r.ubicacion ?? "-"}
                        </div>
                        {(r.localidad || r.provincia) && (
                          <div className="mt-1 truncate text-xs text-zinc-500">
                            {r.localidad ?? ""}
                            {r.provincia ? ` · ${r.provincia}` : ""}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Equipo */}
                    <TableCell>
                      <div className="max-w-[180px]">
                        <div className="truncate font-medium text-zinc-200">
                          {r.tipo_equipo ?? "-"}
                        </div>
                        {r.tipo_modelo && (
                          <div className="mt-1 truncate text-xs text-zinc-500">
                            {r.tipo_modelo}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* UID */}
                    <TableCell>
                      <div className="max-w-[120px] truncate font-mono text-xs text-emerald-300">
                        {r.uid ?? "-"}
                      </div>
                    </TableCell>

                    {/* MACs */}
                    <TableCell>
                      <div className="max-w-[160px] truncate font-mono text-xs text-blue-300">
                        {r.macs ?? "-"}
                      </div>
                    </TableCell>

                    {/* Última conexión */}
                    <TableCell>
                      <div className="text-xs text-zinc-300">
                        {last ? (
                          <>
                            <div className="font-medium">
                              {last.toLocaleDateString()}
                            </div>
                            <div className="text-zinc-500">
                              {last.toLocaleTimeString()}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    {/* Sistema */}
                    <TableCell>
                      <div className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300 ring-1 ring-purple-500/20">
                        {r.sistema ?? "-"}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}