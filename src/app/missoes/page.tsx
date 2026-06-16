"use client";
import { useState, useEffect } from "react";
import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import XpBar from "@/components/ui/XpBar";
import MissaoTimer from "@/components/missoes/MissaoTimer";
import Celebracao from "@/components/missoes/Celebracao";
import { useMissoes } from "@/hooks/useMissoes";
import { MOCK_MISSOES } from "@/data/mock-missoes";
import type { ModoEstudo } from "@/types";

const MODOS: { id: ModoEstudo; label: string; emoji: string; desc: string; duracao: string; cor: string }[] = [
  { id: "chill", label: "Ritmo Chill", emoji: "🎧", desc: "Blocos de 25 min com pausas frequentes", duracao: "25 min", cor: "from-secondary/20 to-secondary/5 border-secondary/40" },
  { id: "idol", label: "Idol Mode", emoji: "🎤", desc: "Foco total, 45 min de imersao completa", duracao: "45 min", cor: "from-kpop/20 to-kpop/5 border-kpop/40" },
  { id: "anime", label: "Anime Focus", emoji: "⚡", desc: "Concentracao intensa, ritmo de mangá", duracao: "40 min", cor: "from-primary/20 to-primary/5 border-primary/40" },
  { id: "calma", label: "Modo Calma", emoji: "🌿", desc: "Suave e sem pressao, blocos de 20 min", duracao: "20 min", cor: "from-success/20 to-success/5 border-success/40" },
];

function getEstado(): "recarga" | "estudo" | "off" {
  const agora = new Date();
  const min = agora.getHours() * 60 + agora.getMinutes();
  if (min < 13 * 60 + 30) return "recarga";
  if (min >= 17 * 60) return "off";
  return "estudo";
}

function tempoParaEstudo(): string {
  const agora = new Date();
  const alvo = new Date();
  alvo.setHours(13, 30, 0, 0);
  const diff = alvo.getTime() - agora.getTime();
  if (diff <= 0) return "";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

function emojioMundo(mundo: string): string {
  const map: Record<string, string> = {
    "Portal dos Codigos": "⚡",
    "Biblioteca dos Encantos": "📖",
    "Script Room": "✍️",
    "Linha do Tempo dos Herois": "⚔️",
    "Mapa dos Mundos": "🗺️",
    "Laboratorio Secreto": "🔬",
    "Arena Global": "🌍",
    "Arco da Historia": "📚",
    "Energy Break": "💪",
    "Espaco de Paz": "🌸",
  };
  return map[mundo] ?? "📚";
}

function pedirAjuda(missao: { id: string; titulo: string; materia: string }) {
  try {
    const pedidos = JSON.parse(localStorage.getItem("smiletudy_pedidos") || "[]");
    const jaExiste = pedidos.some((p: { id: string }) => p.id === missao.id);
    if (!jaExiste) {
      pedidos.push({ id: missao.id, titulo: missao.titulo, materia: missao.materia, ts: Date.now(), visto: false });
      localStorage.setItem("smiletudy_pedidos", JSON.stringify(pedidos));
    }
  } catch {/* ignore */}
}

export default function MissoesPage() {
  const [modo, setModo] = useState<ModoEstudo>("chill");
  const [missaoAtiva, setMissaoAtiva] = useState<string | null>(null);
  const [modoSelecionando, setModoSelecionando] = useState(true);
  const [estado, setEstado] = useState<"recarga" | "estudo" | "off">("estudo");
  const [tempo, setTempo] = useState("");
  const [mostrarPausa, setMostrarPausa] = useState(false);
  const { estado: xpEstado, concluirMissao, missionFeita } = useMissoes();

  useEffect(() => {
    setEstado(getEstado());
    setTempo(tempoParaEstudo());
    const id = setInterval(() => {
      setEstado(getEstado());
      setTempo(tempoParaEstudo());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  const missoes = MOCK_MISSOES;
  const pendentes = missoes.filter((m) => !missionFeita(m.id));
  const concluidas = missoes.filter((m) => missionFeita(m.id));
  const xpTotal = missoes.reduce((a, m) => a + m.xp, 0);
  const missaoEmTimer = missoes.find((m) => m.id === missaoAtiva);
  const tudoPronto = pendentes.length === 0;

  // Divide missoes em blocos de 2
  const blocos: Array<typeof missoes> = [];
  for (let i = 0; i < pendentes.length; i += 2) {
    blocos.push(pendentes.slice(i, i + 2));
  }

  if (tudoPronto && concluidas.length > 0) {
    return <Celebracao xpTotal={xpEstado.xpTotal} totalMissoes={concluidas.length} nome="Julia" />;
  }

  if (missaoEmTimer) {
    return (
      <MissaoTimer
        titulo={missaoEmTimer.titulo}
        duracaoMinutos={missaoEmTimer.duracao}
        xp={missaoEmTimer.xp}
        onConcluir={() => {
          concluirMissao(missaoEmTimer.id, missaoEmTimer.xp);
          setMissaoAtiva(null);
        }}
        onCancelar={() => setMissaoAtiva(null)}
      />
    );
  }

  // Tela de selecao de modo
  if (modoSelecionando) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <header className="mb-8">
          <p className="text-xs text-muted uppercase tracking-widest">Antes de comecar</p>
          <h1 className="text-2xl font-bold text-ink mt-1">Como voce esta hoje?</h1>
          <p className="text-sm text-muted mt-2">Escolha o seu ritmo. O sistema adapta os blocos de estudo para voce.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {MODOS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModo(m.id)}
              className={`bg-gradient-to-br ${m.cor} border rounded-2xl p-5 text-left transition-all active:scale-95 ${
                modo === m.id ? "ring-2 ring-offset-2 ring-offset-bg scale-[1.02]" : "opacity-80 hover:opacity-100"
              } ${
                m.id === "chill" ? "ring-secondary" :
                m.id === "idol" ? "ring-kpop" :
                m.id === "anime" ? "ring-primary" : "ring-success"
              }`}
            >
              <span className="text-4xl block mb-3">{m.emoji}</span>
              <p className="font-bold text-ink text-base">{m.label}</p>
              <p className="text-xs text-muted mt-1">{m.desc}</p>
              <div className="mt-3 inline-block px-2.5 py-1 rounded-lg bg-white/5 text-xs text-ink font-mono">
                {m.duracao} por bloco
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setModoSelecionando(false)}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-neon active:scale-95 transition-all"
        >
          Comecar a jornada de hoje
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Jornada de hoje</p>
        <h1 className="text-2xl font-bold text-ink mt-1">Missoes</h1>
        <div className="mt-3 flex items-center gap-3">
          <XpBar atual={xpEstado.xpTotal} total={xpTotal > 0 ? xpTotal : 100} label={`${concluidas.length}/${missoes.length} missoes`} />
          <button
            onClick={() => setModoSelecionando(true)}
            className="text-xs text-muted border border-border rounded-xl px-3 py-1.5 hover:text-ink whitespace-nowrap"
          >
            {MODOS.find(m => m.id === modo)?.emoji} Trocar modo
          </button>
        </div>
      </header>

      {/* Estado do horario */}
      {estado === "recarga" && (
        <NeonCard glow="cyan" className="bg-gradient-to-r from-secondary/10 to-card">
          <div className="flex items-center gap-4">
            <span className="text-4xl">😴</span>
            <div>
              <h2 className="font-bold text-ink">Zona de Recarga</h2>
              <p className="text-sm text-muted mt-0.5">
                Voce acabou de sair da escola. O cerebro precisa descansar para aprender melhor.
              </p>
              <p className="text-xs text-secondary mt-2">Estudo libera daqui {tempo}</p>
            </div>
          </div>
          <button
            onClick={() => setEstado("estudo")}
            className="mt-4 text-xs text-muted underline"
          >
            Quero estudar assim mesmo
          </button>
        </NeonCard>
      )}

      {estado === "off" && (
        <NeonCard glow="primary" className="bg-gradient-to-r from-primary/10 to-card text-center py-6">
          <span className="text-4xl block mb-2">🌙</span>
          <h2 className="font-bold text-ink">Modo OFF ativado</h2>
          <p className="text-sm text-muted mt-1">17h passou. Dever cumprido por hoje. Hora de relaxar!</p>
          <p className="text-xs text-muted mt-3">Missoes nao completadas aparecem amanha.</p>
        </NeonCard>
      )}

      {/* Pausa ativa */}
      {mostrarPausa && (
        <NeonCard glow="none" className="border-success/30 bg-success/5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">☕</span>
            <div>
              <h2 className="font-semibold text-ink">Pausa Ativa</h2>
              <p className="text-xs text-muted">15 minutos de descanso. Levanta, bebe agua, estica o corpo.</p>
            </div>
          </div>
          <button
            onClick={() => {
              concluirMissao("pausa-" + Date.now(), 15);
              setMostrarPausa(false);
            }}
            className="w-full py-2.5 rounded-xl bg-success text-white text-sm font-semibold active:scale-95 transition-all"
          >
            Descansou! +15 XP
          </button>
        </NeonCard>
      )}

      {/* Blocos de estudo */}
      {(estado === "estudo" || estado === "off") && pendentes.length > 0 && (
        <div className="space-y-6">
          {blocos.map((bloco, bi) => (
            <div key={bi}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {bi + 1}
                </div>
                <h2 className="text-xs text-muted uppercase tracking-widest font-semibold">
                  Bloco {bi + 1}
                </h2>
                {bi === 0 && <span className="text-xs text-secondary">13:30</span>}
                {bi === 1 && <span className="text-xs text-secondary">14:30</span>}
                {bi >= 2 && <span className="text-xs text-secondary">15:30</span>}
              </div>

              <div className="space-y-3">
                {bloco.map((m) => (
                  <NeonCard key={m.id} glow="primary">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl flex-shrink-0">
                        {emojioMundo(m.mundo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-ink">{m.titulo}</h3>
                          <Badge label={m.mundo} color="primary" />
                        </div>
                        <p className="text-sm text-muted line-clamp-2">{m.objetivo}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted">
                          <span>Timer {m.duracao} min</span>
                          <span>+{m.xp} XP</span>
                          {m.materia && <span>{m.materia.split(";")[0].trim()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <button
                        onClick={() => setMissaoAtiva(m.id)}
                        className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-neon active:scale-95 transition-all"
                      >
                        Iniciar missao
                      </button>
                      <button
                        onClick={() => {
                          pedirAjuda(m);
                          concluirMissao(m.id, m.xp + 10);
                        }}
                        className="px-4 py-3 rounded-xl bg-kpop/10 border border-kpop/30 text-kpop text-sm active:scale-95 transition-all"
                      >
                        Pedir ajuda +{m.xp + 10} XP
                      </button>
                    </div>
                  </NeonCard>
                ))}
              </div>

              {bi < blocos.length - 1 && (
                <div
                  onClick={() => setMostrarPausa(true)}
                  className="mt-4 rounded-xl border border-dashed border-success/30 bg-success/5 px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-success/10 transition-colors"
                >
                  <span className="text-xl">☕</span>
                  <div className="flex-1">
                    <p className="text-sm text-success font-medium">Pausa Ativa (15 min)</p>
                    <p className="text-xs text-muted">Levante, respire, beba agua. Ganha +15 XP pelo descanso.</p>
                  </div>
                  <span className="text-xs text-success">+15 XP</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pendentes.length === 0 && concluidas.length === 0 && (
        <NeonCard glow="none" className="text-center py-8">
          <span className="text-4xl block mb-3">📭</span>
          <p className="text-muted">Nenhuma missao por hoje. Aproveite!</p>
        </NeonCard>
      )}

      {/* Concluidas */}
      {concluidas.length > 0 && (
        <section>
          <h2 className="text-xs text-muted uppercase tracking-widest mb-3">Concluidas hoje</h2>
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
