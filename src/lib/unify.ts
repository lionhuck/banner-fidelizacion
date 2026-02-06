import { ReportEntidadesEquipos, UnifiedDeviceRow } from "./types";

function parseMacs(macsRaw: string | null): string[] {
  if (!macsRaw) return [];
  return macsRaw
    .split("|")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
}

function parseDate(d: string | null): Date | null {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function computeIsActive(
  updated: boolean,
  lastSeen: Date | null,
  lastSeenDays: number
): { isActive: boolean; reason: UnifiedDeviceRow["activeReason"] } {
  if (updated) return { isActive: true, reason: "updated" };
  if (lastSeen) {
    const diffMs = Date.now() - lastSeen.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays <= lastSeenDays) return { isActive: true, reason: "lastSeen" };
  }
  return { isActive: false, reason: "inactive" };
}

export function unifyRow(row: ReportEntidadesEquipos, lastSeenDays = 30): UnifiedDeviceRow {
  const lastSeen = parseDate(row.ultima_conexion ?? null);
  const { isActive, reason } = computeIsActive(!!row.actualizado, lastSeen, lastSeenDays);

  return {
    system: row.sistema,

    entityId: row.entidad_id ?? null,
    entityName: row.entidad_nombre ?? null,
    entityTaxId: row.entidad_codigo_interno ?? null,
    groupName: row.grupo_administracion_nombre ?? null,

    locationId: row.ubicacion_id ?? null,
    locationName: row.ubicacion ?? null,
    locationCode: row.ubicacion_codigo_interno ?? null,

    city: row.localidad ?? null,
    province: row.provincia ?? null,
    country: row.pais ?? null,

    deviceId: row.equipo_id ?? null,
    uid: row.uid ?? null,
    macsRaw: row.macs ?? null,
    macs: parseMacs(row.macs ?? null),

    deviceType: row.tipo_equipo ?? null,
    model: row.tipo_modelo ?? null,

    updated: !!row.actualizado,
    lastSeen,

    isActive,
    activeReason: reason,
  };
}

export function unifyAll(rows: ReportEntidadesEquipos[], lastSeenDays = 30): UnifiedDeviceRow[] {
  return rows.map(r => unifyRow(r, lastSeenDays));
}
