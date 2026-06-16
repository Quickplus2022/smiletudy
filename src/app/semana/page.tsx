import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import { GRADE_JULIA } from "@/data/grade-julia";
import { getMundo } from "@/data/mundos";

const COR_MAP: Record<string, "primary" | "cyan" | "pink" | "success" | "warn" | "muted"> = {
  primary: "primary",
  secondary: "cyan",
  kpop: "pink",
  success: "success",
  warn: "warn",
  muted: "muted",
};

const DIA_HOJE = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][new Date().getDay()];

export default function SemanaPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Grade semanal</p>
        <h1 className="text-2xl font-bold text-ink mt-1">Mapa da Semana</h1>
        <p className="text-muted text-sm mt-1">Sua jornada de Segunda a Sexta</p>
      </header>

      <div className="grid md:grid-cols-5 gap-4">
        {GRADE_JULIA.map((dia) => {
          const isHoje = dia.dia.toLowerCase() === DIA_HOJE;
          return (
            <div key={dia.dia} className="space-y-3">
              <div className={`text-center rounded-xl py-3 border ${isHoje ? "bg-primary/20 border-primary" : "bg-card border-border"}`}>
                <p className={`text-sm font-bold ${isHoje ? "text-primary text-glow-purple" : "text-muted"}`}>{dia.dia}</p>
                <p className="text-xs text-muted mt-0.5">{dia.nome_ludico}</p>
                {isHoje && <p className="text-xs text-primary mt-1">● hoje</p>}
              </div>

              <div className="space-y-2">
                {dia.aulas.map((aula, i) => {
                  const mundo = getMundo(aula.materia);
                  const cor = COR_MAP[mundo.cor] ?? "muted";
                  return (
                    <NeonCard key={i} glow="none" className="!p-3">
                      <p className="text-xs text-muted">{aula.horario_inicio} – {aula.horario_fim}</p>
                      <p className="text-sm font-medium text-ink mt-0.5">{mundo.emoji} {aula.materia}</p>
                      <div className="mt-1.5">
                        <Badge label={mundo.nome} color={cor} />
                      </div>
                    </NeonCard>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
