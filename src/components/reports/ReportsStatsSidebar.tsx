"use client";

import { CustomerGroup } from "@/lib/grouping";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Checkbox } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="border-0 bg-white/5">
      <CardBody className="gap-1 px-3 py-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          {label}
        </span>
        <span className="text-lg font-semibold text-zinc-100">{value}</span>
      </CardBody>
    </Card>
  );
}

export default function ReportsStatsSidebar({
  isLoading,
  rawCount,
  filteredCount,
  q,
  setQ,
  activeOnly,
  setActiveOnly,
  lastSeenDays,
  setLastSeenDays,
  groups,
}: {
  isLoading: boolean;
  rawCount: number;
  filteredCount: number;

  q: string;
  setQ: (v: string) => void;

  activeOnly: boolean;
  setActiveOnly: (v: boolean) => void;

  lastSeenDays: number;
  setLastSeenDays: (v: number) => void;

  groups: CustomerGroup[];
}) {
  const totals = groups.reduce(
    (acc, g) => {
      acc.customers += 1;
      acc.total += g.total;
      acc.active += g.active;
      acc.inactive += g.inactive;
      acc.free += g.free;
      acc.occupied += g.occupied;
      return acc;
    },
    { customers: 0, total: 0, active: 0, inactive: 0, free: 0, occupied: 0 }
  );

  const top = groups.slice(0, 6);

  return (
    <aside className="space-y-4">
      <Card className="border-0 bg-zinc-900/60">
        <CardHeader className="flex flex-col items-start gap-1 px-4 pt-4 pb-0">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Resumen
          </span>
          <span className="text-[11px] text-zinc-500">
            {isLoading ? "Cargando..." : `Clientes: ${totals.customers}`}
          </span>
        </CardHeader>
        <CardBody className="gap-3 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Equipos (total)" value={totals.total} />
            <StatPill label="Activos" value={totals.active} />
            <StatPill label="Inactivos" value={totals.inactive} />
            <StatPill label="Libres" value={totals.free} />
          </div>
        </CardBody>
      </Card>

      <Card className="border-0 bg-zinc-900/60">
        <CardHeader className="flex flex-col items-start gap-1 px-4 pt-4 pb-0">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Filtros
          </span>
          <span className="text-[11px] text-zinc-500">
            Ajustá la búsqueda para acotar el parque visible.
          </span>
        </CardHeader>
        <CardBody className="gap-3 px-4 pb-4 pt-3">
          <Input
            size="sm"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Nombre, cliente, entidad..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>Cargados: {rawCount}</span>
            <span>Visibles: {filteredCount}</span>
          </div>
        </CardBody>
      </Card>

      <Card className="border-0 bg-zinc-900/60">
        <CardHeader className="flex items-center justify-between px-4 pt-4 pb-0">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Top clientes
            </span>
            <span className="text-[11px] text-zinc-500">
              Los más grandes por cantidad de equipos.
            </span>
          </div>
        </CardHeader>
        <CardBody className="gap-2 px-4 pb-4 pt-3">
          {top.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{g.name}</div>
                <div className="mt-1 text-[11px] text-zinc-400">
                  Total {g.total} · Activos {g.active} · Inactivos {g.inactive}
                </div>
              </div>
              <Chip size="sm" variant="flat" color="success" className="shrink-0">
                {g.total} equipos
              </Chip>
            </div>
          ))}
        </CardBody>
      </Card>
    </aside>
  );
}
