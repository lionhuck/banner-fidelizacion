"use client";

import { useEffect, useState } from "react";
import { ReportEntidadesEquipos } from "@/models/types";
import { ReportsExplorerPage } from "@/components/reports/ReportsExplorerPage";

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

export default function Page() {
  const [data, setData] = useState<ReportEntidadesEquipos[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return <ReportsExplorerPage data={data} isLoading={isLoading} />;
}
