"use client";

import { useMemo, useState } from "react";
import { ReportEntidadesEquipos } from "@/models/types";
import { groupByCustomer, CustomerGroup } from "@/lib/grouping";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import ReportsStatsSidebar from "./ReportsStatsSidebar";
import ReportsDashboardView from "./ReportsDashboardView";
import ReportsTableView from "./ReportsTableView";
import CustomerModal from "./CustomerModal";

type Props = {
  data: ReportEntidadesEquipos[];
  isLoading: boolean;
};

export function ReportsExplorerPage({ data, isLoading }: Props) {
  // filtros
  const [q, setQ] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [lastSeenDays, setLastSeenDays] = useState(30);

  // vista
  const [view, setView] = useState<"dashboard" | "table">("dashboard");

  // drilldown
  const [selected, setSelected] = useState<CustomerGroup | null>(null);
  const [locationFilter, setLocationFilter] = useState<"all" | string | null>(null);

  const filtered = useMemo(() => {
    let rows = data;

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      rows = rows.filter(r => {
        const hay = [
          r.grupo_administracion_nombre,
          r.entidad_nombre,
          r.entidad_codigo_interno,
          r.ubicacion,
          r.ubicacion_codigo_interno,
          r.uid,
          r.macs,
          r.tipo_equipo,
          r.tipo_modelo,
          r.localidad,
          r.provincia,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(qq);
      });
    }

    return rows;
  }, [data, q]);

  const groups = useMemo(() => groupByCustomer(filtered, lastSeenDays), [filtered, lastSeenDays]);

  const handleCloseModal = () => {
    setSelected(null);
    setLocationFilter(null);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col gap-4 ">
        <Card className="border border-white/10 bg-gradient-to-br from-zinc-900/90 to-zinc-950/80 shadow-2xl backdrop-blur-sm">
          <CardHeader className="flex flex-col items-start justify-between gap-3 border-b border-white/10 px-6 pt-6 pb-4 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-300 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Panel de reportes
              </div>
              <div className="mt-3 text-2xl font-black tracking-tight text-zinc-50">
                Fidelización y parque de equipos
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                Clientes, ubicaciones y equipos en un único panel, con filtros en tiempo real.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={view === "dashboard" ? "solid" : "flat"}
                color={view === "dashboard" ? "success" : "default"}
                onPress={() => setView("dashboard")}
                className={`rounded-xl font-semibold transition-all ${
                  view === "dashboard" 
                    ? "shadow-lg shadow-emerald-500/20" 
                    : "hover:bg-white/5"
                }`}
              >
                Dashboard
              </Button>
              <Button
                size="sm"
                variant={view === "table" ? "solid" : "flat"}
                color={view === "table" ? "success" : "default"}
                onPress={() => setView("table")}
                className={`rounded-xl font-semibold transition-all ${
                  view === "table" 
                    ? "shadow-lg shadow-emerald-500/20" 
                    : "hover:bg-white/5"
                }`}
              >
                Tabla
              </Button>
            </div>
          </CardHeader>
          
          <CardBody className="px-6 pb-6 pt-4">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_1fr]">
              <ReportsStatsSidebar
                isLoading={isLoading}
                rawCount={data.length}
                filteredCount={filtered.length}
                q={q}
                setQ={setQ}
                activeOnly={activeOnly}
                setActiveOnly={setActiveOnly}
                lastSeenDays={lastSeenDays}
                setLastSeenDays={setLastSeenDays}
                groups={groups}
              />

              <div className="min-w-0 rounded-2xl bg-zinc-950/60 shadow-2xl shadow-black/30 ring-1 ring-white/10 backdrop-blur-sm">
                {view === "dashboard" ? (
                  <ReportsDashboardView
                    isLoading={isLoading}
                    groups={groups}
                    onOpenCustomer={(g) => {
                      setSelected(g);
                      setLocationFilter(null);
                    }}
                  />
                ) : (
                  <div className="p-6">
                    <ReportsTableView
                      title="Todos los equipos (según filtros)"
                      records={filtered}
                      lastSeenDays={lastSeenDays}
                      activeOnly={activeOnly}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal detalle cliente */}
      {selected && (
        <CustomerModal
          selected={selected}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          onClose={handleCloseModal}
          lastSeenDays={lastSeenDays}
          activeOnly={activeOnly}
        />
      )}
    </div>
  );
}
