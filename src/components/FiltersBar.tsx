"use client";

type Props = {
  q: string;
  setQ: (v: string) => void;
  onSearch: () => void;

  lastSeenDays: number;
  setLastSeenDays: (v: number) => void;

  activeOnly: boolean;
  setActiveOnly: (v: boolean) => void;

  loading: boolean;
};

export default function FiltersBar({
  q,
  setQ,
  onSearch,
  lastSeenDays,
  setLastSeenDays,
  activeOnly,
  setActiveOnly,
  loading,
}: Props) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        gridTemplateColumns: "1fr 160px 160px 120px",
        alignItems: "end",
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 10,
      }}
    >
      <div>
        <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Búsqueda</label>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Ej: sarkany, 3071..., ABasto, 80:e4..., uid..."
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
          onKeyDown={e => {
            if (e.key === "Enter") onSearch();
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Activo si vio en</label>
        <select
          value={lastSeenDays}
          onChange={e => setLastSeenDays(Number(e.target.value))}
          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        >
          <option value={7}>7 días</option>
          <option value={15}>15 días</option>
          <option value={30}>30 días</option>
          <option value={60}>60 días</option>
          <option value={90}>90 días</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Solo activos</label>
        <label style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 0" }}>
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={e => setActiveOnly(e.target.checked)}
          />
          <span>{activeOnly ? "Sí" : "No"}</span>
        </label>
      </div>

      <button
        onClick={onSearch}
        disabled={loading}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "1px solid #222",
          background: loading ? "#eee" : "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Cargando..." : "Buscar"}
      </button>
    </div>
  );
}
