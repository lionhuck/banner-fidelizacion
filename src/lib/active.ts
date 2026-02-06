import { ReportEntidadesEquipos } from "@/models/types";

export function parseDate(d: string | null): Date | null {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function isActiveRecord(r: ReportEntidadesEquipos, lastSeenDays: number): boolean {
  // regla: actualizado OR lastSeen dentro de X días
  if (r.actualizado) return true;
  const last = parseDate(r.ultima_conexion);
  if (!last) return false;
  const diffDays = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= lastSeenDays;
}
