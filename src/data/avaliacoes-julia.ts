export interface Avaliacao {
  id: string;
  tipo: "AG" | "AP" | "AGP" | "TD" | "PA";
  materia: string;
  mundo: string;
  data: string; // YYYY-MM-DD
  conteudos: string[];
  urgencia: "critica" | "alta" | "media" | "baixa";
}

function diasAte(data: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(data + "T00:00:00");
  return Math.ceil((alvo.getTime() - hoje.getTime()) / 86400000);
}

function calcUrgencia(data: string): Avaliacao["urgencia"] {
  const d = diasAte(data);
  if (d <= 3) return "critica";
  if (d <= 7) return "alta";
  if (d <= 14) return "media";
  return "baixa";
}

const PROVAS_RAW: Omit<Avaliacao, "urgencia">[] = [
  // AG 2ª Etapa — semana 19-25/jun/2026
  {
    id: "ag2-redacao",
    tipo: "AG",
    materia: "Redação",
    mundo: "Script Room",
    data: "2026-06-19",
    conteudos: ["Artigo de opinião", "Anúncio publicitário em prosa"],
  },
  {
    id: "ag2-paradidatico",
    tipo: "AGP",
    materia: "Paradidático",
    mundo: "Script Room",
    data: "2026-06-19",
    conteudos: ["Livro: Olhos para Mariella"],
  },
  {
    id: "ag2-gramatica",
    tipo: "AG",
    materia: "Compreensão de Texto e Gramática",
    mundo: "Código da Língua",
    data: "2026-06-22",
    conteudos: [
      "Cap. 9: Concordância nominal",
      "Cap. 10: Concordância verbal",
      "LT páginas 95 a 109 e 128 a 138",
      "Gramática páginas 271, 280-281 e 286-290",
    ],
  },
  {
    id: "ag2-matematica",
    tipo: "AG",
    materia: "Matemática",
    mundo: "Portal dos Códigos",
    data: "2026-06-23",
    conteudos: [
      "Cap. 6: Produtos notáveis e fatoração",
      "Cap. 8: Triângulos",
      "Cap. 9: Segmentos e pontos notáveis nos triângulos",
      "Cap. 10: Quadriláteros",
      "Interpretação de dados em gráficos e tabelas",
    ],
  },
  {
    id: "ag2-historia",
    tipo: "AG",
    materia: "História",
    mundo: "Máquina do Tempo",
    data: "2026-06-24",
    conteudos: [
      "Cap. 9: O Brasil do começo do século XIX",
      "Cap. 10: A Regência e suas revoltas",
    ],
  },
  {
    id: "ag2-geografia",
    tipo: "AG",
    materia: "Geografia",
    mundo: "Atlas Secreto",
    data: "2026-06-24",
    conteudos: [
      "Cap. 9: África: economia",
      "Cap. 10: África: população",
    ],
  },
  {
    id: "ag2-ciencias",
    tipo: "AG",
    materia: "Ciências",
    mundo: "Laboratório Secreto",
    data: "2026-06-25",
    conteudos: [
      "Cap. 8: Sistemas genitais e reprodução humana",
      "Cap. 9: Métodos contraceptivos",
      "Cap. 10: Infecções sexualmente transmissíveis (ISTs)",
    ],
  },
];

export const AVALIACOES_JULIA: Avaliacao[] = PROVAS_RAW.map((p) => ({
  ...p,
  urgencia: calcUrgencia(p.data),
}));

export function getAvaliacoesProximas(dias = 14): Avaliacao[] {
  return AVALIACOES_JULIA.filter((a) => {
    const d = diasAte(a.data);
    return d >= 0 && d <= dias;
  }).sort((a, b) => a.data.localeCompare(b.data));
}
