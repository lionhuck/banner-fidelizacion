"use client";

import { X, Building2 } from "lucide-react";
import { CustomerGroup } from "@/lib/grouping";
import LocationSelector from "./LocationSelector";
import LocationFilterBar from "./LocationFilterBar";
import CustomerDevicesView from "./CustomerDevicesView";

type Props = {
  selected: CustomerGroup;
  locationFilter: string | null;
  onLocationFilterChange: (filter: string | null) => void;
  onClose: () => void;
  lastSeenDays: number;
  activeOnly: boolean;
};

export default function CustomerModal({
  selected,
  locationFilter,
  onLocationFilterChange,
  onClose,
  lastSeenDays,
  activeOnly,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black shadow-2xl">
        
        {/* Header del Modal */}
        <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-zinc-900/90 to-zinc-950/90 px-6 py-5 backdrop-blur-sm">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 ring-2 ring-emerald-500/30">
                <Building2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-xl font-black text-zinc-50">
                  {selected.name}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span className="rounded-md bg-zinc-800/50 px-2 py-0.5 font-mono">
                    {selected.locations.length} ubicaciones
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="rounded-md bg-zinc-800/50 px-2 py-0.5 font-mono">
                    {selected.total} equipos
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 ring-1 ring-emerald-500/30">
                <span className="text-xs text-zinc-500">Activos:</span>
                <span className="font-mono text-sm font-bold text-emerald-300">{selected.free}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-zinc-700/20 px-3 py-1.5 ring-1 ring-zinc-600/30">
                <span className="text-xs text-zinc-500">Inactivos:</span>
                <span className="font-mono text-sm font-bold text-zinc-300">{selected.inactive}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 ring-1 ring-amber-500/30">
                <span className="text-xs text-amber-400">Libres:</span>
                <span className="font-mono text-sm font-bold text-amber-300">{selected.free}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-800/50 text-zinc-400 ring-1 ring-white/10 transition-all hover:bg-zinc-800 hover:text-zinc-100 hover:ring-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido del Modal */}
        {locationFilter === null ? (
          <LocationSelector
            selected={selected}
            onSelectLocation={onLocationFilterChange}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-6">
            <LocationFilterBar
              selected={selected}
              locationFilter={locationFilter}
              onLocationChange={onLocationFilterChange}
            />
            
            <CustomerDevicesView
              selected={selected}
              locationFilter={locationFilter}
              lastSeenDays={lastSeenDays}
              activeOnly={activeOnly}
            />
          </div>
        )}
      </div>
    </div>
  );
}
