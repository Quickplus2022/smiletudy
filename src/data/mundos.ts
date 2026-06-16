export const MUNDOS: Record<string, { nome: string; emoji: string; cor: string }> = {
  "Matemática": { nome: "Portal dos Códigos", emoji: "⚡", cor: "primary" },
  "Gramática": { nome: "Biblioteca dos Encantos", emoji: "📖", cor: "secondary" },
  "Redação": { nome: "Script Room", emoji: "🎤", cor: "kpop" },
  "História": { nome: "Linha do Tempo dos Heróis", emoji: "⏳", cor: "warn" },
  "Geografia": { nome: "Mapa dos Mundos", emoji: "🗺️", cor: "success" },
  "Ciências": { nome: "Laboratório Secreto", emoji: "🔬", cor: "secondary" },
  "Bilíngue": { nome: "Arena Global", emoji: "🌐", cor: "primary" },
  "Paradidático / Arte / Socioemocional": { nome: "Arco da História", emoji: "🎨", cor: "kpop" },
  "Educação Física": { nome: "Energy Break", emoji: "💪", cor: "success" },
  "Religião": { nome: "Espaço de Paz", emoji: "🌿", cor: "success" },
  "Prova": { nome: "Final Stage", emoji: "🎯", cor: "warn" },
};

export function getMundo(materia: string) {
  const key = Object.keys(MUNDOS).find((k) =>
    materia.toLowerCase().includes(k.toLowerCase())
  );
  return MUNDOS[key ?? ""] ?? { nome: materia, emoji: "📚", cor: "muted" };
}
