import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import { MOCK_MISSOES, MOCK_COMUNICADOS } from "@/data/mock-missoes";
import { TENANT_JULIA } from "@/data/tenant-julia";

export default function PaisPage() {
  const missoes = MOCK_MISSOES;
  const comunicados = MOCK_COMUNICADOS;

  const novos = comunicados.filter((c) => c.dias_desde_publicacao === 0);
  const pendentes = missoes.filter((m) => m.status === "pendente");
  const concluidas = missoes.filter((m) => m.status === "concluida");
  const tempoTotal = missoes.reduce((acc, m) => acc + m.duracao, 0);
  const materias = [...new Set(missoes.map((m) => m.materia))];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Acompanhamento familiar</p>
        <h1 className="text-2xl font-bold text-ink mt-1">Painel dos Pais</h1>
        <p className="text-muted text-sm mt-1">
          {TENANT_JULIA.aluna} · {TENANT_JULIA.turma} · {TENANT_JULIA.escola}
        </p>
      </header>

      {/* Resumo do dia */}
      <NeonCard glow="cyan">
        <h2 className="font-semibold text-ink mb-4">Resumo de hoje</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-secondary">{comunicados.length}</p>
            <p className="text-xs text-muted mt-1">Comunicados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{missoes.length}</p>
            <p className="text-xs text-muted mt-1">Missões geradas</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">{tempoTotal}</p>
            <p className="text-xs text-muted mt-1">Min. estimados</p>
          </div>
        </div>
      </NeonCard>

      {/* Novidades */}
      {novos.length > 0 && (
        <NeonCard glow="pink">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-kpop">📢</span>
            <h2 className="font-semibold text-ink">Novidades de hoje</h2>
            <Badge label={`${novos.length} novo${novos.length > 1 ? "s" : ""}`} color="pink" />
          </div>
          <div className="space-y-2">
            {novos.map((c) => (
              <div key={c.id} className="bg-bg rounded-xl p-3">
                <p className="text-sm font-medium text-ink">{c.titulo_lista}</p>
                <p className="text-xs text-muted mt-1">{c.materia_estimada}</p>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {/* Matérias em foco */}
      <NeonCard glow="primary">
        <h2 className="font-semibold text-ink mb-3">Matérias em foco</h2>
        <div className="flex flex-wrap gap-2">
          {materias.map((m) => (
            <Badge key={m} label={m} color="primary" />
          ))}
        </div>
      </NeonCard>

      {/* Plano sugerido */}
      <NeonCard glow="none">
        <h2 className="font-semibold text-ink mb-3">Plano sugerido</h2>
        <div className="space-y-2">
          {missoes.map((m, i) => (
            <div key={m.id} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-border flex items-center justify-center text-xs text-muted flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-sm text-ink">{m.titulo}</p>
                <p className="text-xs text-muted">{m.materia} · {m.duracao} min</p>
              </div>
              <div className="ml-auto">
                <Badge
                  label={m.status === "pendente" ? "Pendente" : "Feita"}
                  color={m.status === "pendente" ? "warn" : "success"}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted">
            Tempo total estimado: <span className="text-ink font-semibold">{tempoTotal} minutos</span>
          </p>
        </div>
      </NeonCard>

      {/* Pontos de atenção */}
      {pendentes.length > 0 && (
        <NeonCard glow="none" className="border-warn/30">
          <div className="flex items-center gap-2 mb-3">
            <span>⚠️</span>
            <h2 className="font-semibold text-ink">Pontos de atenção</h2>
          </div>
          <ul className="space-y-1.5">
            {pendentes.map((m) => (
              <li key={m.id} className="text-sm text-muted flex items-center gap-2">
                <span className="text-warn">·</span>
                {m.materia} — missão ainda não concluída
              </li>
            ))}
          </ul>
        </NeonCard>
      )}

      {/* Frase de abordagem */}
      <NeonCard glow="cyan" className="text-center">
        <p className="text-xs text-muted uppercase tracking-widest mb-2">Sugestão de abordagem</p>
        <p className="text-lg font-semibold text-ink">
          "Hoje tem {tempoTotal} minutos de estudo planejados.<br />
          Bora ver qual missão a Julia escolhe começar?"
        </p>
        <p className="text-xs text-muted mt-3">
          Deixe ela escolher a ordem — autonomia é parte do processo.
        </p>
      </NeonCard>
    </div>
  );
}
