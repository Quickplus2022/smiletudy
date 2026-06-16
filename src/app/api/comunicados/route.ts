import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { lerComunicados } from "@/lib/read-json";
import { MOCK_COMUNICADOS } from "@/data/mock-missoes";

export async function GET() {
  const data = lerComunicados();
  const comunicados = data.comunicados.length > 0 ? data.comunicados : MOCK_COMUNICADOS;
  return NextResponse.json({ comunicados });
}
