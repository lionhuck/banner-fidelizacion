"use client";

import { ChevronLeft, Activity, MapPin } from "lucide-react";
import { CustomerGroup } from "@/lib/grouping";

type Props = {
  selected: CustomerGroup;
  locationFilter: string;
  onLocationChange: (filter: string | null) => void;
};

export default function LocationFilterBar({
  selected,
  locationFilter,
  onLocationChange,
}: Props) {
  return (
    <div className="flex flex-shrink-0 flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/50 p-4">
      <button
        type="button"
        onClick={() => onLocationChange(null)}
        className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-1.5 text-xs font-medium text-zinc-400 ring-1 ring-white/10 transition-all hover:bg-zinc-800 hover:text-zinc-100"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Volver a ubicaciones
      </button>
      
      <div className="h-4 w-px bg-white/10" />
      
      <span className="text-xs font-medium text-zinc-500">Filtrando por:</span>
      
      <button
        type="button"
        onClick={() => onLocationChange("all")}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-all ${
          locationFilter === "all"
            ? "bg-emerald-500/20 text-emerald-100 ring-emerald-400/40 shadow-lg shadow-emerald-500/10"
            : "bg-zinc-800/50 text-zinc-300 ring-white/10 hover:bg-zinc-800"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          Todas
        </div>
      </button>
      
      {selected.locations.map((loc) => (
        <button
          key={loc.key}
          type="button"
          onClick={() => onLocationChange(loc.key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition-all ${
            locationFilter === loc.key
              ? "bg-emerald-500/20 text-emerald-100 ring-emerald-400/40 shadow-lg shadow-emerald-500/10"
              : "bg-zinc-800/50 text-zinc-300 ring-white/10 hover:bg-zinc-800"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            {loc.name}
          </div>
        </button>
      ))}
    </div>
  );
}
