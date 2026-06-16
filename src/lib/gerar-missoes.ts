import type { Comunicado, Missao, ModoEstudo } from "@/types";
import { getMundo } from "@/data/mundos";

// Duration per mode (in minutes) - affects timer, not which missions appear
const DURACAO_MODO: Record<ModoEstudo, number> = {
  idol: 45,
  chill: 25,
  anime: 40,
  calma: 20,
  prova: 60,
};

const TITULOS_LUDICOS: Record<string, string[]> = {
  matemática: ["Portal dos Códigos", "Missão Numérica", "Desafio Algébrico"],
  gramática: ["Biblioteca dos Encantos", "Scroll Gramatical", "Missão Literária"],
  redação: ["Script Room", "Missão Narrativa", "Criação de Texto"],
  história: ["Linha do Tempo dos Heróis", "Arquivo Secreto", "Missão Histórica"],
  geografia: ["Mapa dos Mundos", "Expedição Cartográfica", "Missão Geográfica"],
  ciências: ["Laboratório Secreto", "Experiência do Dia", "Missão Científica"],
  bilíngue: ["Arena Global", "Desafio Internacional", "Missão de Idiomas"],
  paradidático: ["Arco da História", "Leitura Especial", "Missão Cultural"],
  "educação física": ["Energy Break", "Power Stage", "Missão Ativa"],
  religião: ["Espaço de Paz", "Reflexão do Dia", "Missão Espiritual"],
};

function tituloLudico(materia: string): string {
  const key = Object.keys(TITULOS_LUDICOS).find((k) =>
    materia.toLowerCase().includes(k)
  );
  const opcoes = TITULOS_LUDICOS[key ?? ""] ?? ["Missão do Dia"];
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

function xpPorTipo(tipo: string): number {
  if (tipo === "prova") return 60;
  if (tipo === "importante") return 40;
  if (tipo === "agenda") return 25;
  return 20;
}

// ALL comunicados become mandatory missions - no time cap, no filtering
export function gerarMissoesFromComunicados(
  comunicados: Comunicado[],
  modo: ModoEstudo = "chill"
): Missao[] {
  const duracao = DURACAO_MODO[modo];

  return comunicados
    .filter((c) => c.dias_desde_publicacao <= 7)
    .map((com) => {
      const primeiraMat = (com.materia_estimada ?? "").split(";")[0].trim();
      const mundo = getMundo(primeiraMat);

      return {
        id: com.id,
        titulo: tituloLudico(primeiraMat || "geral"),
        materia: com.materia_estimada ?? "",
        mundo: mundo.nome,
        duracao,
        xp: xpPorTipo(com.tipo_estimado),
        objetivo: (com.texto ?? "").slice(0, 150),
        modo,
        status: "pendente" as const,
        comunicado_id: com.id,
      };
    });
}
