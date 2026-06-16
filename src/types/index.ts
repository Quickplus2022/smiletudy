export interface Tenant {
  tenant_id: string;
  nome_exibicao: string;
  aluna: string;
  escola: string;
  serie: string;
  turma: string;
  turno: string;
  tema: string;
}

export type ModoEstudo = "idol" | "chill" | "anime" | "calma" | "prova";

export interface Missao {
  id: string;
  titulo: string;
  materia: string;
  mundo: string;
  duracao: number;
  xp: number;
  objetivo: string;
  modo: ModoEstudo;
  status: "pendente" | "em_andamento" | "concluida";
  comunicado_id?: string;
}

export interface Comunicado {
  id: string;
  url: string;
  titulo_lista: string;
  data_detectada: string;
  dias_desde_publicacao: number;
  coletado_em: string;
  tipo_estimado: string;
  materia_estimada: string;
  tamanho_texto: number;
  texto: string;
  arquivo_imagem_agenda?: string | null;
}

export interface AulaGrade {
  horario_inicio: string;
  horario_fim: string;
  materia: string;
  mundo: string;
}

export interface DiaSemana {
  dia: string;
  nome_ludico: string;
  aulas: AulaGrade[];
}
