import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { lerNovosHoje } from "@/lib/read-json";
import { MOCK_COMUNICADOS } from "@/data/mock-missoes";

export async function GET() {
  const data = lerNovosHoje();
  const comunicados = data.comunicados.length > 0 ? data.comunicados : MOCK_COMUNICADOS.slice(0, 1);
  return NextResponse.json({ comunicados });
}
