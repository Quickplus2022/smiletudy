import type { Comunicado } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseComunicados = require("@/data/json/classapp_base_comunicados.json");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const novosHoje = require("@/data/json/classapp_novos_hoje.json");

function resolverImagem(comunicado: Comunicado): string | null {
  if (!comunicado.arquivo_imagem_agenda) return null;
  return `/agendas/${comunicado.id}.png`;
}

function normalizarComunicado(c: Comunicado): Comunicado {
  return { ...c, arquivo_imagem_agenda: resolverImagem(c) ?? undefined };
}

export function lerComunicados(): { comunicados: Comunicado[] } {
  const lista: Comunicado[] = (baseComunicados.comunicados ?? []).map(normalizarComunicado);
  return { comunicados: lista };
}

export function lerNovosHoje(): { comunicados: Comunicado[] } {
  const lista: Comunicado[] = (novosHoje.novos ?? []).map(normalizarComunicado);
  return { comunicados: lista };
}
