"use client";

import { useState } from "react";
import type { GroupedData } from "@/lib/grouping";
import DevicesTable from "./DevicesTable";

type Props = {
  entity: GroupedData[number];
};

export default function EntityAccordion({ entity }: Props) {
  const [open, setOpen] = useState(false);

  const title = `${entity.entityName} · ${entity.activeDevices}/${entity.totalDevices} activos`;
  const subtitleParts = [
    entity.entityTaxId ? `CUIT/Código: ${entity.entityTaxId}` : null,
    entity.groupName ? `Grupo: ${entity.groupName}` : null,
  ].filter(Boolean);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: 12,
          background: "#fff",
          border: "none",
          cursor: "pointer",
          display: "grid",
          gap: 4,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <b>{title}</b>
          <span style={{ opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
        </div>
        {subtitleParts.length > 0 && (
          <div style={{ fontSize: 12, opacity: 0.75 }}>{subtitleParts.join(" · ")}</div>
        )}
      </button>

      {open && (
        <div style={{ padding: 12, borderTop: "1px solid #eee", display: "grid", gap: 12 }}>
          {entity.locations.map(loc => (
            <div key={loc.locationKey} style={{ border: "1px solid #eee", borderRadius: 10 }}>
              <div style={{ padding: 10, display: "flex", justifyContent: "space-between" }}>
                <div>
                  <b>{loc.locationName}</b>
                  {loc.locationCode && (
                    <div style={{ fontSize: 12, opacity: 0.75 }}>
                      Código: {loc.locationCode}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: 600 }}>
                  {loc.activeDevices}/{loc.totalDevices} activos
                </div>
              </div>

              <div style={{ padding: 10, borderTop: "1px solid #f2f2f2" }}>
                <DevicesTable devices={loc.devices} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
