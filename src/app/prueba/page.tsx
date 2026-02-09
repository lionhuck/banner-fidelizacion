"use client";

import { useEffect, useState } from "react";
import { ReportEntidadesEquipos } from "@/models/types";

async function getBanner1Data(): Promise<ReportEntidadesEquipos[]> {
  const response = await fetch("/api/report-entidades-equipos/1", { cache: "no-store" });
  if (!response.ok) return [];
  return (await response.json()) as ReportEntidadesEquipos[];
}

async function getBanner2Data(): Promise<ReportEntidadesEquipos[]> {
  const response = await fetch("/api/report-entidades-equipos/2", { cache: "no-store" });
  if (!response.ok) return [];
  return (await response.json()) as ReportEntidadesEquipos[];
}

export default function Prueba() {
  const [data, setData] = useState<ReportEntidadesEquipos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ReportEntidadesEquipos | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setIsLoading(true);
      const [b1, b2] = await Promise.all([getBanner1Data(), getBanner2Data()]);
      const merged = [...b1, ...b2];
      if (mounted) setData(merged);
      if (mounted) setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Filter data based on search term across all fields
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.entidad_nombre?.toLowerCase().includes(searchLower) ||
      item.ubicacion?.toLowerCase().includes(searchLower) ||
      item.ubicacion_codigo_interno?.toLowerCase().includes(searchLower) ||
      item.grupo_administracion_nombre?.toLowerCase().includes(searchLower) ||
      item.entidad_codigo_interno?.toLowerCase().includes(searchLower) ||
      item.sistema?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics based on filtered data
  const stats = {
    totalEntidades: new Set(filteredData.map(item => item.entidad_id).filter(Boolean)).size,
    totalUbicaciones: new Set(filteredData.map(item => item.ubicacion_id).filter(Boolean)).size,
    totalSistemas: new Set(filteredData.map(item => item.sistema).filter(Boolean)).size,
    totalGruposAdmin: new Set(filteredData.map(item => item.grupo_administracion_nombre).filter(Boolean)).size,
    bySistema: {} as Record<string, {
      entidades: number;
      ubicaciones: number;
      gruposAdmin: number;
      equipos: number;
    }>
  };

  // Calculate stats by sistema from filtered data
  const sistemas = Array.from(new Set(filteredData.map(item => item.sistema).filter(Boolean)));
  sistemas.forEach(sistema => {
    const sistemaData = filteredData.filter(item => item.sistema === sistema);
    stats.bySistema[sistema as string] = {
      entidades: new Set(sistemaData.map(item => item.entidad_id).filter(Boolean)).size,
      ubicaciones: new Set(sistemaData.map(item => item.ubicacion_id).filter(Boolean)).size,
      gruposAdmin: new Set(sistemaData.map(item => item.grupo_administracion_nombre).filter(Boolean)).size,
      equipos: new Set(sistemaData.map(item => item.equipo_id)).size,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${selectedItem ? 'mr-0' : ''}`}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Entidades y Equipos
              </h1>
              <p className="text-slate-600">
                {isLoading ? "Cargando..." : `${filteredData.length} de ${data.length} resultados`}
              </p>
            </div>

            {/* Statistics Cards */}
            {!isLoading && (
              <div className="mb-6 space-y-4">
                {/* Total Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="Entidades"
                    value={stats.totalEntidades}
                    icon="🏢"
                    color="blue"
                  />
                  <StatCard
                    label="Ubicaciones"
                    value={stats.totalUbicaciones}
                    icon="📍"
                    color="green"
                  />
                  <StatCard
                    label="Sistemas"
                    value={stats.totalSistemas}
                    icon="💻"
                    color="purple"
                  />
                  <StatCard
                    label="Grupos Admin"
                    value={stats.totalGruposAdmin}
                    icon="👥"
                    color="orange"
                  />
                </div>

                {/* Stats by Sistema */}
                <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Desglose por Sistema</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(stats.bySistema).map(([sistema, sistemaStats]) => (
                      <div key={sistema} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {sistema}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Entidades:</span>
                            <span className="font-semibold text-slate-800">{sistemaStats.entidades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Ubicaciones:</span>
                            <span className="font-semibold text-slate-800">{sistemaStats.ubicaciones}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Grupos Admin:</span>
                            <span className="font-semibold text-slate-800">{sistemaStats.gruposAdmin}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Equipos:</span>
                            <span className="font-semibold text-slate-800">{sistemaStats.equipos}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por cualquier campo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all placeholder:text-black text-black"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">
                  {searchTerm ? "No se encontraron resultados" : "No hay datos disponibles"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredData.map((item) => (
                  <div
                    key={item.uid}
                    onClick={() => setSelectedItem(item)}
                    className={`bg-white rounded-lg transition-all duration-200 p-5 border-2 cursor-pointer ${selectedItem?.uid === item.uid
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                      : 'border-slate-200 shadow-md'
                      }`}
                  >
                    <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b border-slate-200 pb-2">
                      {item.entidad_nombre}
                    </h2>

                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-500 font-medium">Ubicación:</span>
                        <span className="text-slate-700">{item.ubicacion || "N/A"}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-slate-500 font-medium">Grupo Administración:</span>
                        <span className="text-slate-700">{item.grupo_administracion_nombre || "N/A"}</span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-slate-500 font-medium">Código Interno:</span>
                        <span className="text-slate-700 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                          {item.ubicacion_codigo_interno || "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-slate-500 font-medium">Código Entidad:</span>
                        <span className="text-slate-700 font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                          {item.entidad_codigo_interno || "N/A"}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-slate-500 font-medium">Sistema:</span>
                        <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {item.sistema || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div
            className={`transition-all duration-300 ease-in-out ${selectedItem ? 'w-96 opacity-100' : 'w-0 opacity-0 overflow-hidden'
              }`}
          >
            {selectedItem && (
              <div className="bg-white rounded-lg shadow-xl border border-slate-200 h-fit sticky top-6 overflow-hidden">
                {/* Panel Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Detalles Completos</h3>
                    <p className="text-blue-100 text-sm">{selectedItem.entidad_nombre}</p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-white hover:bg-blue-800 rounded-full p-1 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Panel Content */}
                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Información de Entidad */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Entidad</h4>
                      <div className="space-y-2">
                        <DetailField label="Nombre" value={selectedItem.entidad_nombre} />
                        <DetailField label="ID Entidad" value={selectedItem.entidad_id} />
                        <DetailField label="Código Interno" value={selectedItem.entidad_codigo_interno} mono />
                      </div>
                    </div>

                    <div className="border-t border-slate-200"></div>

                    {/* Ubicación */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Ubicación</h4>
                      <div className="space-y-2">
                        <DetailField label="Ubicación" value={selectedItem.ubicacion} />
                        <DetailField label="Código Ubicación" value={selectedItem.ubicacion_codigo_interno} mono />
                        <DetailField label="ID Ubicación" value={selectedItem.ubicacion_id} />
                        <DetailField label="Localidad" value={selectedItem.localidad} />
                        <DetailField label="Provincia" value={selectedItem.provincia} />
                        <DetailField label="País" value={selectedItem.pais} />
                      </div>
                    </div>

                    <div className="border-t border-slate-200"></div>

                    {/* Equipo */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Equipo</h4>
                      <div className="space-y-2">
                        <DetailField label="ID Equipo" value={selectedItem.equipo_id} />
                        <DetailField label="Tipo Equipo" value={selectedItem.tipo_equipo} />
                        <DetailField label="Tipo Modelo" value={selectedItem.tipo_modelo} />
                        <DetailField label="Sistema" value={selectedItem.sistema} badge />
                        <DetailField label="UID" value={selectedItem.uid} mono />
                        <DetailField label="MACs" value={selectedItem.macs} mono />
                      </div>
                    </div>

                    <div className="border-t border-slate-200"></div>

                    {/* Posición */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Posición</h4>
                      <div className="space-y-2">
                        <DetailField label="ID Posición" value={selectedItem.posicion_id} />
                        <DetailField label="Número Posición" value={selectedItem.posicion_numero} />
                        <DetailField label="Fecha Alta" value={selectedItem.fecha_alta_posicion} />
                      </div>
                    </div>

                    <div className="border-t border-slate-200"></div>

                    {/* Plantilla */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Plantilla</h4>
                      <div className="space-y-2">
                        <DetailField label="Plantilla" value={selectedItem.plantilla} />
                        <DetailField label="ID Plantilla" value={selectedItem.plantilla_id} />
                        <DetailField label="Vertical" value={selectedItem.plantilla_vertical} boolean />
                      </div>
                    </div>

                    <div className="border-t border-slate-200"></div>

                    {/* Administración */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Administración</h4>
                      <div className="space-y-2">
                        <DetailField label="Grupo Administración" value={selectedItem.grupo_administracion_nombre} />
                        <DetailField label="Actualizado" value={selectedItem.actualizado} boolean />
                        <DetailField label="Libre" value={selectedItem.libre} boolean />
                        <DetailField label="Observaciones Libre" value={selectedItem.libre_observaciones} />
                        <DetailField label="Auditoría" value={selectedItem.auditoria} />
                        <DetailField label="Última Conexión" value={selectedItem.ultima_conexion} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for statistics cards
function StatCard({
  label,
  value,
  icon,
  color
}: {
  label: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 shadow-blue-200',
    green: 'from-green-500 to-green-600 shadow-green-200',
    purple: 'from-purple-500 to-purple-600 shadow-purple-200',
    orange: 'from-orange-500 to-orange-600 shadow-orange-200',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg p-4 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm font-medium opacity-90">{label}</p>
    </div>
  );
}

// Helper component for detail fields
function DetailField({
  label,
  value,
  mono = false,
  badge = false,
  boolean = false
}: {
  label: string;
  value: any;
  mono?: boolean;
  badge?: boolean;
  boolean?: boolean;
}) {
  const displayValue = value ?? "N/A";

  if (boolean && typeof value === 'boolean') {
    return (
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">{label}:</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {value ? 'Sí' : 'No'}
        </span>
      </div>
    );
  }

  if (badge) {
    return (
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">{label}:</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {displayValue}
        </span>
      </div>
    );
  }

  if (mono) {
    return (
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-600">{label}:</span>
        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">
          {displayValue}
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-xs text-slate-600 flex-shrink-0">{label}:</span>
      <span className="text-xs text-slate-800 text-right break-words">
        {displayValue}
      </span>
    </div>
  );
}
