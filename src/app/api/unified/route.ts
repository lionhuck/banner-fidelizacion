import { NextResponse } from "next/server";
import { ReportEntidadesEquipos } from "@/lib/types";
import { unifyAll } from "@/lib/unify";
import { filterRows } from "@/lib/search";

export const dynamic = "force-dynamic";

async function getBannerData(origin: string, which: 1 | 2): Promise<ReportEntidadesEquipos[]> {
  try {
    const url = `${origin}/api/report-entidades-equipos/${which}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`banner${which} fetch failed: ${res.status}`);
    return (await res.json()) as ReportEntidadesEquipos[];
  } catch (e) {
    console.warn(`Banner ${which} fetch failed`, e);
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);

  const q = searchParams.get("q") ?? "";
  const lastSeenDays = Number(searchParams.get("lastSeenDays") ?? "30");
  const activeOnly = (searchParams.get("activeOnly") ?? "0") === "1";
  const limit = Number(searchParams.get("limit") ?? "0");

  const safeLastSeenDays = Number.isFinite(lastSeenDays) ? lastSeenDays : 30;

  const [b1, b2] = await Promise.all([
    getBannerData(origin, 1),
    getBannerData(origin, 2),
  ]);

  const unified = unifyAll([...b1, ...b2], safeLastSeenDays);

  let filtered = filterRows(unified, q);
  if (activeOnly) filtered = filtered.filter(r => r.isActive);
  if (limit > 0) filtered = filtered.slice(0, limit);

  // Date → string para JSON
  const jsonSafe = filtered.map(r => ({
    ...r,
    lastSeen: r.lastSeen ? r.lastSeen.toISOString() : null,
  }));

  return NextResponse.json({
    params: { q, lastSeenDays: safeLastSeenDays, activeOnly, limit },
    count: jsonSafe.length,
    rows: jsonSafe,
  });
}
