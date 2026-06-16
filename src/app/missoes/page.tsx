"use client";
import { useState } from "react";
import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import XpBar from "@/components/ui/XpBar";
import MissaoTimer from "@/components/missoes/MissaoTimer";
import Celebracao from "@/components/missoes/Celebracao";
import { useMissoes } from "@/hooks/useMissoes";
import { MOCK_MISSOES } from "@/data/mock-missoes";
import type { ModoEstudo } from "@/types";

const MODOS: { id: ModoEstudo; label: string; emoji: string; cor: string }[] = [
  { id: "idol", label: "Idol Mode", emoji: "🎤", cor: "Foco total — 45 min" },
  { id: "chill", label: "Chill Mode", emoji: "🎧", cor: "Leve e calmo — 25 min" },
  { id: "anime", label: "Anime Focus", emoji: "⚡", cor: "Concentrado — 45 min" },
  { id: "calma", label: "Modo Calma", emoji: "🌿", cor: "Suave — 20 min" },
];

const CARTAS = [
  { emoji: "🎧", label: "Playlist Focus" },
  { emoji: "🌿", label: "Modo Calma" },
  { emoji: "⚡", label: "Power Start" },
  { emoji: "🧠", label: "Sensei da Revisão" },
  { emoji: "💬", label: "Pedir Ajuda" },
];

export default function MissoesPage() {
  const [modo, setModo] = useState<ModoEstudo>("chill");
  const [missaoAtiva, setMissaoAtiva] = useState<string | null>(null);
  const { estado, concluirMissao, missionFeita } = useMissoes();

  const missoes = MOCK_MISSOES;
  const pendentes = missoes.filter((m) => !missionFeita(m.id));
  const concluidas = missoes.filter((m) => missionFeita(m.id));
  const xpTotal = missoes.reduce((a, m) => a + m.xp, 0);
  const missaoEmTimer = missoes.find((m) => m.id === missaoAtiva);
  const tudoPronto = pendentes.length === 0;

  if (tudoPronto) {
    return <Celebracao xpTotal={estado.xpTotal} totalMissoes={concluidas.length} nome="Julia" />;
  }

  if (missaoEmTimer) {
    return (
      <MissaoTimer
        titulo={missaoEmTimer.titulo}
        duracaoMinutos={missaoEmTimer.duracao}
        xp={missaoEmTimer.xp}
        onConcluir={() => { concluirMissao(missaoEmTimer.id, missaoEmTimer.xp); setMissaoAtiva(null); }}
        onCancelar={() => setMissaoAtiva(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Jornada de hoje</p>
        <h1 className="text-2xl font-bold text-ink mt-1">Missões</h1>
        <div className="mt-3">
          <XpBar atual={estado.xpTotal} total={xpTotal} label={`${concluidas.length}/${missoes.length} missões · XP`} />
        </div>
      </header>

      {/* Modo */}
      <section>
        <h2 className="text-xs text-muted uppercase tracking-widest mb-3">Seu modo hoje</h2>
        <div className="flex gap-2 flex-wrap">
          {MODOS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModo(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                modo === m.id
                  ? "bg-primary/20 border-primary text-primary shadow-neon"
                  : "bg-card border-border text-muted hover:text-ink"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </section>

      {/* Cartas */}
      <section>
        <h2 className="text-xs text-muted uppercase tracking-widest mb-3">Cartas de poder</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CARTAS.map((c) => (
            <div key={c.label} className="flex-shrink-0 flex flex-col items-center gap-1 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/50 cursor-pointer transition-all active:scale-95">
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-xs text-muted whitespace-nowrap">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Missões pendentes */}
      {pendentes.length > 0 && (
        <section>
          <h2 className="text-xs text-muted uppercase tracking-widest mb-3">
            Missões ativas <span className="text-primary">({pendentes.length})</span>
          </h2>
          <div className="space-y-4">
            {pendentes.map((m) => (
              <NeonCard key={m.id} glow="primary">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl flex-shrink-0">📚</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-ink">{m.titulo}</h3>
                      <Badge label={m.mundo} color="primary" />
                    </div>
                    <p className="text-sm text-muted">{m.objetivo}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted">
                      <span>⏱ {m.duracao} min</span>
                      <span>⚡ +{m.xp} XP</span>
                      <span>📖 {m.materia}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => setMissaoAtiva(m.id)}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-neon active:scale-95 transition-all"
                  >
                    ▶ Iniciar missão
                  </button>
                  <button
                    onClick={() => concluirMissao(m.id, m.xp + 10)}
                    className="px-4 py-3 rounded-xl bg-kpop/10 border border-kpop/30 text-kpop text-sm active:scale-95 transition-all"
                  >
                    💬 Pedir ajuda +{m.xp + 10} XP
                  </button>
                </div>
              </NeonCard>
            ))}
          </div>
        </section>
      )}

      {/* Concluídas */}
      {concluidas.length > 0 && (
        <section>
          <h2 className="text-xs text-muted uppercase tracking-widest mb-3">Concluídas hoje ✓</h2>
          <div className="space-y-2">
            {concluidas.map((m) => (
              <NeonCard key={m.id} glow="none" className="opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-success/20 flex items-center justify-center text-success text-sm">✓</div>
                  <div>
                    <p className="text-sm font-medium text-ink line-through">{m.titulo}</p>
                    <p className="text-xs text-muted">+{m.xp} XP</p>
                  </div>
                </div>
              </NeonCard>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
