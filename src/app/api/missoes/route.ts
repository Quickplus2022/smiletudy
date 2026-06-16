import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { lerNovosHoje } from "@/lib/read-json";
import { gerarMissoesFromComunicados } from "@/lib/gerar-missoes";
import { MOCK_MISSOES, MOCK_COMUNICADOS } from "@/data/mock-missoes";
import type { Comunicado, ModoEstudo } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modo = (searchParams.get("modo") ?? "chill") as ModoEstudo;

  const data = lerNovosHoje();

  if (data.comunicados.length === 0) {
    return NextResponse.json({ missoes: MOCK_MISSOES, fonte: "mock" });
  }

  const missoes = gerarMissoesFromComunicados(data.comunicados as Comunicado[], modo);
  return NextResponse.json({ missoes, fonte: "json" });
}
