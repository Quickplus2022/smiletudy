import type { DiaSemana } from "@/types";
import { getMundo } from "./mundos";

function aula(inicio: string, fim: string, materia: string) {
  return { horario_inicio: inicio, horario_fim: fim, materia, mundo: getMundo(materia).nome };
}

export const GRADE_JULIA: DiaSemana[] = [
  {
    dia: "Segunda",
    nome_ludico: "Matemática Stage",
    aulas: [
      aula("07:10", "08:00", "Matemática"),
      aula("08:00", "08:50", "Matemática"),
      aula("09:30", "10:20", "Religião"),
      aula("10:20", "11:10", "História"),
      aula("11:10", "12:00", "Bilíngue"),
    ],
  },
  {
    dia: "Terça",
    nome_ludico: "Humanas Quest",
    aulas: [
      aula("07:10", "08:00", "Matemática"),
      aula("08:00", "08:50", "Matemática"),
      aula("09:30", "10:20", "Bilíngue"),
      aula("10:20", "11:10", "História"),
      aula("11:10", "12:00", "Geografia"),
    ],
  },
  {
    dia: "Quarta",
    nome_ludico: "Biblioteca Anime",
    aulas: [
      aula("07:10", "08:00", "Gramática"),
      aula("08:00", "08:50", "Paradidático / Arte / Socioemocional"),
      aula("09:30", "10:20", "Bilíngue"),
      aula("10:20", "11:10", "Geografia"),
      aula("11:10", "12:00", "Gramática"),
    ],
  },
  {
    dia: "Quinta",
    nome_ludico: "Laboratório Secreto",
    aulas: [
      aula("07:10", "08:00", "Matemática"),
      aula("08:00", "08:50", "Matemática"),
      aula("09:30", "10:20", "Redação"),
      aula("10:20", "11:10", "Ciências"),
      aula("11:10", "12:00", "Educação Física"),
    ],
  },
  {
    dia: "Sexta",
    nome_ludico: "Final Stage",
    aulas: [
      aula("07:10", "08:50", "Prova"),
      aula("09:30", "10:20", "Ciências"),
      aula("10:20", "11:10", "Bilíngue"),
      aula("11:10", "12:00", "Ciências"),
    ],
  },
];
