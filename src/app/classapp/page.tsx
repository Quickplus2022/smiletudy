import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import { MOCK_COMUNICADOS } from "@/data/mock-missoes";

function tipoBadge(tipo: string): "warn" | "pink" | "cyan" | "muted" {
  if (tipo === "prova") return "warn";
  if (tipo === "importante") return "pink";
  if (tipo === "agenda") return "cyan";
  return "muted";
}

export default function ClassAppPage() {
  const comunicados = MOCK_COMUNICADOS;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Fonte de dados</p>
        <h1 className="text-2xl font-bold text-ink mt-1">ClassApp</h1>
        <p className="text-muted text-sm mt-1">{comunicados.length} comunicados coletados</p>
      </header>

      <div className="space-y-4">
        {comunicados.map((c) => (
          <NeonCard key={c.id} glow="pink">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-ink">{c.titulo_lista}</h3>
                <p className="text-xs text-muted mt-1">{c.data_detectada}</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Badge label={c.tipo_estimado} color={tipoBadge(c.tipo_estimado)} />
                {c.dias_desde_publicacao === 0 && <Badge label="Novo hoje" color="pink" />}
              </div>
            </div>

            {c.materia_estimada && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {c.materia_estimada.split(";").map((m) => (
                  <Badge key={m.trim()} label={m.trim()} color="cyan" />
                ))}
              </div>
            )}

            <p className="text-sm text-muted line-clamp-3">{c.texto}</p>

            {c.arquivo_imagem_agenda && (
              <div className="mt-4">
                <p className="text-xs text-muted mb-2">📸 Imagem da agenda</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/imagem-agenda?path=${encodeURIComponent(c.arquivo_imagem_agenda as string)}`}
                  alt="Agenda do dia"
                  className="rounded-xl border border-border w-full max-w-sm"
                />
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-primary text-xs hover:bg-primary/30 transition-colors">
                ⚡ Transformar em missão
              </button>
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}
