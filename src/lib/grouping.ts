import { ReportEntidadesEquipos } from "@/models/types";
import { isActiveRecord } from "./active";

export type LocationGroup = {
  key: string;
  name: string;
  total: number;
  active: number;
  inactive: number;
  occupied: number;
  free: number;
  records: ReportEntidadesEquipos[];
};

export type CustomerGroup = {
  id: string;
  name: string;

  total: number;
  active: number;
  inactive: number;

  occupied: number;
  free: number;

  systems: Record<string, number>;
  locations: LocationGroup[];

  records: ReportEntidadesEquipos[];
};

function normKey(s: string) {
  return (s || "").trim().toLowerCase();
}

export function getCustomerName(r: ReportEntidadesEquipos) {
  return (
    r.grupo_administracion_nombre?.trim() ||
    r.entidad_nombre?.trim() ||
    r.entidad_codigo_interno?.trim() ||
    "(Sin cliente)"
  );
}

export function getLocationName(r: ReportEntidadesEquipos) {
  return r.ubicacion?.trim() || r.ubicacion_codigo_interno?.trim() || "(Sin ubicación)";
}

export function groupByCustomer(records: ReportEntidadesEquipos[], lastSeenDays: number): CustomerGroup[] {
  const map = new Map<string, any>();

  for (const r of records) {
    const name = getCustomerName(r);
    const id = normKey(name);

    if (!map.has(id)) {
      map.set(id, {
        id,
        name,
        total: 0,
        active: 0,
        inactive: 0,
        occupied: 0,
        free: 0,
        systems: {} as Record<string, number>,
        locationMap: new Map<string, any>(),
        records: [] as ReportEntidadesEquipos[],
      });
    }

    const c = map.get(id);
    c.total += 1;
    c.records.push(r);

    const active = isActiveRecord(r, lastSeenDays);
    if (active) c.active += 1;
    else c.inactive += 1;

    if (r.libre) c.free += 1;
    else c.occupied += 1;

    const sys = (r.sistema ?? "unknown").toString();
    c.systems[sys] = (c.systems[sys] ?? 0) + 1;

    const locName = getLocationName(r);
    const locKey = normKey(locName);

    if (!c.locationMap.has(locKey)) {
      c.locationMap.set(locKey, {
        key: locKey,
        name: locName,
        total: 0,
        active: 0,
        inactive: 0,
        occupied: 0,
        free: 0,
        records: [] as ReportEntidadesEquipos[],
      });
    }

    const loc = c.locationMap.get(locKey);
    loc.total += 1;
    loc.records.push(r);

    if (active) loc.active += 1;
    else loc.inactive += 1;

    if (r.libre) loc.free += 1;
    else loc.occupied += 1;
  }

  const groups: CustomerGroup[] = Array.from(map.values()).map((c: any) => ({
    id: c.id,
    name: c.name,
    total: c.total,
    active: c.active,
    inactive: c.inactive,
    occupied: c.occupied,
    free: c.free,
    systems: c.systems,
    locations: Array.from(c.locationMap.values()).sort((a: any, b: any) => b.total - a.total),
    records: c.records,
  }));

  groups.sort((a, b) => b.total - a.total);
  return groups;
}
