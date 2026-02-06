import { UnifiedDeviceRow } from "./types";

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function matchesRow(row: UnifiedDeviceRow, q: string): boolean {
  const query = norm(q);
  if (!query) return true;

  const haystack: string[] = [
    row.entityName ?? "",
    row.entityTaxId ?? "",
    row.groupName ?? "",
    row.locationName ?? "",
    row.locationCode ?? "",
    row.city ?? "",
    row.province ?? "",
    row.country ?? "",
    row.uid ?? "",
    row.deviceType ?? "",
    row.model ?? "",
    ...(row.macs ?? []),
  ].map(norm);

  return haystack.some(v => v.includes(query));
}

export function filterRows(rows: UnifiedDeviceRow[], q: string): UnifiedDeviceRow[] {
  if (!q.trim()) return rows;
  return rows.filter(r => matchesRow(r, q));
}
