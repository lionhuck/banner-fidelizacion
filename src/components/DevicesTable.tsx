"use client";

import { UnifiedDeviceRow } from "@/lib/types";

function badge(text: string, variant: "ok" | "warn" | "muted") {
  const styles: Record<string, any> = {
    ok: { border: "1px solid #2a6", color: "#2a6" },
    warn: { border: "1px solid #c63", color: "#c63" },
    muted: { border: "1px solid #999", color: "#666" },
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        ...styles[variant],
      }}
    >
      {text}
    </span>
  );
}

export default function DevicesTable({ devices }: { devices: UnifiedDeviceRow[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
            <th style={{ padding: "8px 6px" }}>Activo</th>
            <th style={{ padding: "8px 6px" }}>Equipo ID</th>
            <th style={{ padding: "8px 6px" }}>Tipo</th>
            <th style={{ padding: "8px 6px" }}>UID</th>
            <th style={{ padding: "8px 6px" }}>MACs</th>
            <th style={{ padding: "8px 6px" }}>Últ. conexión</th>
            <th style={{ padding: "8px 6px" }}>Sistema</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(d => (
            <tr key={`${d.system}-${d.deviceId ?? d.uid ?? Math.random()}`} style={{ borderBottom: "1px solid #f5f5f5" }}>
              <td style={{ padding: "8px 6px" }}>
                {d.isActive
                  ? badge(d.activeReason === "updated" ? "Activo (actualizado)" : "Activo (conexión)", "ok")
                  : badge("Inactivo", "muted")}
              </td>
              <td style={{ padding: "8px 6px" }}>{d.deviceId ?? "-"}</td>
              <td style={{ padding: "8px 6px" }}>{d.deviceType ?? "-"} {d.model ? `(${d.model})` : ""}</td>
              <td style={{ padding: "8px 6px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                {d.uid ?? "-"}
              </td>
              <td style={{ padding: "8px 6px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                {d.macs.length ? d.macs.join(", ") : "-"}
              </td>
              <td style={{ padding: "8px 6px" }}>
                {d.lastSeen ? d.lastSeen.toLocaleString() : "-"}
              </td>
              <td style={{ padding: "8px 6px" }}>{d.system}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
