"use client";

import ReportsTableView from "./ReportsTableView";
import { ReportEntidadesEquipos } from "@/models/types";
import { CustomerGroup } from "@/lib/grouping";

type Props = {
  selected: CustomerGroup;
  locationFilter: string;
  lastSeenDays: number;
  activeOnly: boolean;
};

export default function CustomerDevicesView({
  selected,
  locationFilter,
  lastSeenDays,
  activeOnly,
}: Props) {
  const getRecords = (): ReportEntidadesEquipos[] => {
    if (locationFilter === "all") {
      return selected.records;
    }
    
    const location = selected.locations.find((l) => l.key === locationFilter);
    return location?.records ?? [];
  };

  const getTitle = (): string => {
    if (locationFilter === "all") {
      return "Equipos del cliente (todas las ubicaciones)";
    }
    
    const location = selected.locations.find((l) => l.key === locationFilter);
    return `Equipos en ${location?.name ?? "ubicación seleccionada"}`;
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 shadow-xl backdrop-blur-sm">
      <div className="flex-1 overflow-auto p-6">
        <ReportsTableView
          title={getTitle()}
          records={getRecords()}
          lastSeenDays={lastSeenDays}
          activeOnly={activeOnly}
        />
      </div>
    </div>
  );
}
