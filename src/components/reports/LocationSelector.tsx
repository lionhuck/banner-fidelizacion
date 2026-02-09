"use client";

import { MapPin, Activity, ChevronLeft } from "lucide-react";
import { CustomerGroup } from "@/lib/grouping";

type Props = {
  selected: CustomerGroup;
  onSelectLocation: (key: string) => void;
};

export default function LocationSelector({ selected, onSelectLocation }: Props) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-blue-500/10 px-4 py-3 ring-1 ring-blue-500/30">
          <MapPin className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-blue-300">
            Seleccioná una ubicación o elegí ver todas para explorar los equipos de este cliente.
          </span>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Opción "Ver todas" */}
          <button
            type="button"
            onClick={() => onSelectLocation("all")}
            className="group flex flex-col justify-between rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-5 text-left transition-all hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                <div className="font-bold text-emerald-200">
                  Ver todas las ubicaciones
                </div>
              </div>
              <div className="mt-2 text-sm text-emerald-100/80">
                {selected.locations.length} ubicaciones · {selected.total} equipos
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/60">
              <span>Ideal para una vista global de todo el parque</span>
              <ChevronLeft className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Ubicaciones individuales */}
          {selected.locations.map((loc) => (
            <button
              key={loc.key}
              type="button"
              onClick={() => onSelectLocation(loc.key)}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/70 to-zinc-950/90 p-5 text-left ring-1 ring-white/5 transition-all hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
            >
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                  <div className="truncate font-bold text-zinc-100 group-hover:text-emerald-400">
                    {loc.name}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="text-zinc-400">
                    {loc.total} equipos
                  </span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-emerald-300">
                    {loc.occupied} ocupados
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 group-hover:text-emerald-400">
                <span>Ver equipos de esta ubicación</span>
                <ChevronLeft className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
