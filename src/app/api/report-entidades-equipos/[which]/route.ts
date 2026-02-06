import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

const BANNER1_URL =
  "https://sistema.bannerdirector.com/webservice/equipo/report-entidades-equipos";

// Ruta al archivo JSON local (en /public)
const BANNER2_JSON_PATH = path.join(process.cwd(), "public", "data", "report-b2.json");

type Ctx = { params: Promise<{ which?: string[] }> };

async function readBanner2FromFile() {
  const raw = await fs.readFile(BANNER2_JSON_PATH, "utf-8");
  const data = JSON.parse(raw);
  // Soporta que el json sea array directo o que venga envuelto tipo {rows: [...]}
  if (Array.isArray(data)) return data;
  if (data?.rows && Array.isArray(data.rows)) return data.rows;
  return data;
}

async function safeText(res: Response) {
  return await res.text().catch(() => "");
}

export async function GET(_req: Request, ctx: Ctx) {
  const { which } = await ctx.params; // Next 16: params es Promise
  const target = which?.[0]; // "1" o "2"

  try {
    // -------------------------
    // Banner 1 (API real)
    // -------------------------
    if (target === "1") {
      const res = await fetch(BANNER1_URL, { cache: "no-store" });

      if (!res.ok) {
        const detail = (await safeText(res)).slice(0, 500);
        return NextResponse.json(
          { error: "Banner1 upstream failed", status: res.status, detail },
          { status: 502 }
        );
      }

      const data = await res.json();
      return NextResponse.json(data);
    }

    // -------------------------
    // Banner 2 (JSON local)
    // -------------------------
    if (target === "2") {
      const data = await readBanner2FromFile();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: "Usá /api/report-entidades-equipos/1 o /2" },
      { status: 404 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "report-entidades-equipos error",
        detail: e?.message ?? String(e),
        hint:
          target === "2"
            ? `Chequeá que exista: ${BANNER2_JSON_PATH}`
            : undefined,
      },
      { status: 500 }
    );
  }
}
