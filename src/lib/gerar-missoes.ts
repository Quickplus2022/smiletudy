import type { Comunicado, Missao, ModoEstudo } from "@/types";
import { getMundo } from "@/data/mundos";

const LIMITES: Record<ModoEstudo, number> = {
  idol: 45,
  chill: 25,
  anime: 45,
  calma: 20,
  prova: 75,
};

const TITULOS_LUDICOS: Record<string, string[]> = {
  matemática: ["Portal dos Códigos", "Missão Numérica", "Desafio Algébrico"],
  gramática: ["Biblioteca dos Encantos", "Missão Literária", "Scroll Gramatical"],
  redação: ["Script Room", "Criação de Texto", "Missão Narrativa"],
  história: ["Linha do Tempo", "Missão Histórica", "Arquivo dos Heróis"],
  geografia: ["Mapa dos Mundos", "Expedição Geográfica", "Missão Cartográfica"],
  ciências: ["Laboratório Secreto", "Experiência do Dia", "Missão Científica"],
  bilíngue: ["Arena Global", "Missão Internacional", "Desafio de Idiomas"],
  paradidático: ["Arco da História", "Leitura Especial", "Missão Cultural"],
  "educação física": ["Energy Break", "Missão Ativa", "Power Stage"],
};

function tituloLudico(materia: string): string {
  const key = Object.keys(TITULOS_LUDICOS).find((k) =>
    materia.toLowerCase().includes(k)
  );
  const opcoes = TITULOS_LUDICOS[key ?? ""] ?? ["Missão do Dia"];
  return opcoes[Math.floor(Math.random() * opcoes.length)];
}

export function gerarMissoesFromComunicados(
  comunicados: Comunicado[],
  modo: ModoEstudo = "chill"
): Missao[] {
  const limite = LIMITES[modo];
  let totalMinutos = 0;
  const missoes: Missao[] = [];

  const recentes = comunicados
    .filter((c) => c.dias_desde_publicacao <= 3)
    .slice(0, 5);

  for (const com of recentes) {
    if (totalMinutos >= limite) break;

    const materias = com.materia_estimada
      .split(";")
      .map((m) => m.trim())
      .filter(Boolean)
      .slice(0, 2);

    for (const materia of materias) {
      if (totalMinutos >= limite) break;
      const duracao = Math.min(15, limite - totalMinutos);
      const mundo = getMundo(materia);

      missoes.push({
        id: `${com.id}-${materia.replace(/\s/g, "")}`,
        titulo: tituloLudico(materia),
        materia,
        mundo: mundo.nome,
        duracao,
        xp: duracao < 15 ? 10 : 20,
        objetivo: `Revisar conteúdo de ${materia} da agenda de ${com.data_detectada}`,
        modo,
        status: "pendente",
        comunicado_id: com.id,
      });

      totalMinutos += duracao;
    }
  }

  return missoes;
}
