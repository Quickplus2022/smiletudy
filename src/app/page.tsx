"use client";
import { useState } from "react";
import Link from "next/link";
import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import XpBar from "@/components/ui/XpBar";
import Onboarding from "@/components/onboarding/Onboarding";
import { useMissoes } from "@/hooks/useMissoes";
import { TENANT_JULIA } from "@/data/tenant-julia";
import { MOCK_MISSOES, MOCK_COMUNICADOS } from "@/data/mock-missoes";
import { GRADE_JULIA } from "@/data/grade-julia";
import { getAvaliacoesProximas } from "@/data/avaliacoes-julia";
import type { Missao } from "@/types";

const COR_URGENCIA = {
  critica: "border-red-500 bg-red-500/10 text-red-400",
  alta: "border-orange-500 bg-orange-500/10 text-orange-400",
  media: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
  baixa: "border-border bg-card text-muted",
};

function diasAteLabel(data: string): string {
  const hoje = new Date(); hoje.setHours(0,0,0,0);
  const d = Math.ceil((new Date(data+"T00:00:00").getTime() - hoje.getTime()) / 86400000);
  if (d === 0) return "HOJE";
  if (d === 1) return "amanhã";
  return `em ${d} dias`;
}

const MODOS = [
  { id: "idol", label: "Idol Mode", emoji: "🎤", desc: "45 min" },
  { id: "chill", label: "Chill Mode", emoji: "🎧", desc: "25 min" },
  { id: "anime", label: "Anime Focus", emoji: "⚡", desc: "45 min" },
  { id: "calma", label: "Modo Calma", emoji: "🌿", desc: "20 min" },
];

function getSaudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function hhmm(h: string) {
  const [hh, mm] = h.split(":").map(Number);
  return hh * 60 + mm;
}

type Fase =
  | "fim_de_semana"
  | "antes_escola"
  | "na_escola"
  | "almoco"
  | "tarde_estudo"
  | "tarde_livre"
  | "revisao_noturna"
  | "hora_dormir";

function getContextoDia(): { fase: Fase; titulo: string; mensagem: string; emoji: string } {
  const now = new Date();
  const min = now.getHours() * 60 + now.getMinutes();
  const dia = now.getDay();

  if (dia === 0 || dia === 6) {
    return { fase: "fim_de_semana", titulo: "Fim de semana", mensagem: "Descanse e aproveite o dia livre!", emoji: "🌟" };
  }

  const gradeHoje = GRADE_JULIA[dia - 1];
  if (!gradeHoje) {
    return { fase: "fim_de_semana", titulo: "Dia livre", mensagem: "Sem aulas hoje!", emoji: "🌟" };
  }

  const inicio = hhmm(gradeHoje.aulas[0].horario_inicio);
  const fim = hhmm(gradeHoje.aulas[gradeHoje.aulas.length - 1].horario_fim);

  if (min < inicio) return { fase: "antes_escola", titulo: "Antes da escola", mensagem: `Escola começa às ${gradeHoje.aulas[0].horario_inicio}. Prepare a mochila!`, emoji: "🎒" };
  if (min <= fim) return { fase: "na_escola", titulo: "Na escola agora", mensagem: `${gradeHoje.nome_ludico} — foco nas aulas, a tarde é sua!`, emoji: "🏫" };
  if (min < fim + 75) return { fase: "almoco", titulo: "Almoço e descanso", mensagem: "Recarregue as energias antes das missões.", emoji: "🍽️" };
  if (min < 17 * 60) return { fase: "tarde_estudo", titulo: "Hora das missões", mensagem: "Melhor hora para estudar — fresco da escola!", emoji: "⚡" };
  if (min < 19 * 60) return { fase: "tarde_livre", titulo: "Tempo livre", mensagem: "Missões concluídas? Anime, K-pop, o que quiser!", emoji: "🎧" };
  if (min < 21 * 60) return { fase: "revisao_noturna", titulo: "Revisão noturna", mensagem: "Revisão leve e rápida — 20 minutinhos.", emoji: "🌙" };
  return { fase: "hora_dormir", titulo: "Hora de descansar", mensagem: "Boa noite! Você foi incrível hoje.", emoji: "😴" };
}

interface BlocoPlano {
  horario: string;
  titulo: string;
  emoji: string;
  tipo: "escola" | "descanso" | "estudo" | "livre" | "refeicao" | "dormir";
  duracao: string;
  ativo?: boolean;
}

function buildPlanoDia(missoes: Missao[]): BlocoPlano[] {
  const now = new Date();
  const min = now.getHours() * 60 + now.getMinutes();
  const dia = now.getDay();
  const gradeHoje = GRADE_JULIA[dia - 1];

  const plano: BlocoPlano[] = [];

  if (gradeHoje) {
    plano.push({ horario: gradeHoje.aulas[0].horario_inicio, titulo: `Escola — ${gradeHoje.nome_ludico}`, emoji: "🏫", tipo: "escola", duracao: "07:10 – 12:00" });
    plano.push({ horario: "12:00", titulo: "Chegou em casa! Almoço", emoji: "🍽️", tipo: "refeicao", duracao: "60 min" });
    plano.push({ horario: "13:00", titulo: "Tempo livre — anime/K-pop", emoji: "🎧", tipo: "livre", duracao: "30 min" });
  }

  let cursor = hhmm("13:30");
  missoes.forEach((m, i) => {
    const hh = String(Math.floor(cursor / 60)).padStart(2, "0");
    const mm = String(cursor % 60).padStart(2, "0");
    plano.push({ horario: `${hh}:${mm}`, titulo: m.titulo, emoji: "📚", tipo: "estudo", duracao: `${m.duracao} min` });
    cursor += m.duracao;
    if (i < missoes.length - 1) {
      const ph = String(Math.floor(cursor / 60)).padStart(2, "0");
      const pm = String(cursor % 60).padStart(2, "0");
      plano.push({ horario: `${ph}:${pm}`, titulo: "Pausa — respira, caminha", emoji: "🌿", tipo: "descanso", duracao: "10 min" });
      cursor += 10;
    }
  });

  const lhh = String(Math.floor(cursor / 60)).padStart(2, "0");
  const lmm = String(cursor % 60).padStart(2, "0");
  plano.push({ horario: `${lhh}:${lmm}`, titulo: "Você arrasou! Tempo livre", emoji: "⭐", tipo: "livre", duracao: `até 19:00` });
  plano.push({ horario: "19:00", titulo: "Revisão noturna leve", emoji: "🌙", tipo: "estudo", duracao: "20 min" });
  plano.push({ horario: "22:00", titulo: "Boa noite! Descanse bem.", emoji: "😴", tipo: "dormir", duracao: "" });

  return plano.map((b) => ({ ...b, ativo: hhmm(b.horario) <= min && min < hhmm(b.horario) + 60 }));
}

const COR_TIPO: Record<BlocoPlano["tipo"], string> = {
  escola: "border-l-4 border-primary bg-primary/10",
  estudo: "border-l-4 border-cyan-500 bg-cyan-500/10",
  descanso: "border-l-4 border-green-500 bg-green-500/10",
  livre: "border-l-4 border-pink-500 bg-pink-500/10",
  refeicao: "border-l-4 border-yellow-500 bg-yellow-500/10",
  dormir: "border-l-4 border-muted bg-card",
};

export default function HomePage() {
  const { estado, concluirOnboarding } = useMissoes();
  const [showOnboarding, setShowOnboarding] = useState(!estado.onboardingFeito);

  const missoes = MOCK_MISSOES;
  const comunicados = MOCK_COMUNICADOS;
  const novos = comunicados.filter((c) => c.dias_desde_publicacao === 0);
  const xpTotal = missoes.reduce((acc, m) => acc + m.xp, 0);
  const contexto = getContextoDia();
  const plano = buildPlanoDia(missoes);
  const avaliacoes = getAvaliacoesProximas(10);

  function handleStartOnboarding() {
    concluirOnboarding();
    setShowOnboarding(false);
  }

  return (
    <>
      {showOnboarding && (
        <Onboarding
          nome={TENANT_JULIA.aluna}
          totalMissoes={missoes.length}
          tempoTotal={missoes.reduce((a, m) => a + m.duracao, 0)}
          onStart={handleStartOnboarding}
        />
      )}

      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-secondary/10 border border-border p-8">
          <div className="relative z-10">
            <p className="text-muted text-sm tracking-widest uppercase">{TENANT_JULIA.escola} · {TENANT_JULIA.turma}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-ink mt-2 text-glow-purple">
              {getSaudacao()}, {TENANT_JULIA.aluna}! {contexto.emoji}
            </h1>
            <p className="text-muted mt-1">
              {novos.length > 0
                ? `${novos.length} novidade${novos.length > 1 ? "s" : ""} chegaram do ClassApp.`
                : "Sua base de comando está pronta."}
            </p>
            <div className="mt-5 space-y-3">
              <XpBar atual={estado.xpTotal} total={xpTotal > 0 ? xpTotal : 100} label="XP de hoje" />
              <Link
                href="/missoes"
                className="inline-block px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-neon hover:bg-primary/80 active:scale-95 transition-all"
              >
                ⚡ Começar Stage
              </Link>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        </section>

        {/* Contexto atual */}
        <section>
          <NeonCard glow="primary" className="flex items-center gap-4">
            <div className="text-4xl">{contexto.emoji}</div>
            <div>
              <p className="text-xs text-muted uppercase tracking-widest">{contexto.titulo}</p>
              <p className="text-base font-semibold text-ink mt-0.5">{contexto.mensagem}</p>
            </div>
          </NeonCard>
        </section>

        {/* Alerta AG */}
        {avaliacoes.some(a => a.urgencia === "critica") && (
          <section>
            <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-4">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">⚠️ AG começando em 3 dias!</p>
              <p className="text-sm text-red-300">Redação + Paradidático <span className="font-bold">"Olhos para Mariella"</span> na sexta-feira 19/06. Foco total!</p>
            </div>
          </section>
        )}

        {/* Provas próximas */}
        {avaliacoes.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">Provas próximas</h2>
            <div className="space-y-2">
              {avaliacoes.map((av) => (
                <div key={av.id} className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${COR_URGENCIA[av.urgencia]}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold uppercase">{av.tipo}</span>
                      <span className="text-xs font-semibold">{av.materia}</span>
                    </div>
                    <p className="text-xs mt-0.5 opacity-80">{av.conteudos[0]}{av.conteudos.length > 1 ? ` +${av.conteudos.length - 1}` : ""}</p>
                  </div>
                  <span className="text-xs font-bold whitespace-nowrap shrink-0">{diasAteLabel(av.data)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Plano do dia */}
        <section>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">Plano do dia</h2>
          <div className="space-y-2">
            {plano.map((bloco, i) => (
              <div
                key={i}
                className={`rounded-xl px-4 py-3 flex items-center gap-3 ${COR_TIPO[bloco.tipo]} ${bloco.ativo ? "ring-2 ring-primary shadow-neon" : "opacity-80"}`}
              >
                <span className="text-xl">{bloco.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted">{bloco.horario}</span>
                    {bloco.ativo && <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 font-bold">agora</span>}
                  </div>
                  <p className="text-sm font-semibold text-ink truncate">{bloco.titulo}</p>
                </div>
                {bloco.duracao && <span className="text-xs text-muted whitespace-nowrap">{bloco.duracao}</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Modos */}
        <section>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-widest mb-3">Energia do dia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MODOS.map((modo) => (
              <Link key={modo.id} href={`/missoes?modo=${modo.id}`}>
                <NeonCard glow="primary" className="text-center active:scale-95 transition-transform">
                  <div className="text-3xl mb-2">{modo.emoji}</div>
                  <p className="text-sm font-semibold text-ink">{modo.label}</p>
                  <p className="text-xs text-muted mt-1">{modo.desc}</p>
                </NeonCard>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Missões */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-widest">Missões de hoje</h2>
              <Link href="/missoes" className="text-xs text-primary hover:underline">ver todas →</Link>
            </div>
            <div className="space-y-3">
              {missoes.map((m) => (
                <NeonCard key={m.id} glow="primary" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl flex-shrink-0">📚</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{m.titulo}</p>
                    <p className="text-xs text-muted">{m.duracao} min · +{m.xp} XP</p>
                  </div>
                  <Badge label="Pendente" color="warn" />
                </NeonCard>
              ))}
            </div>
          </section>

          {/* Comunicados */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-muted uppercase tracking-widest">
                ClassApp
                {novos.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-kpop text-xs text-white font-bold">{novos.length}</span>
                )}
              </h2>
              <Link href="/classapp" className="text-xs text-primary hover:underline">ver todos →</Link>
            </div>
            <div className="space-y-3">
              {comunicados.map((c) => (
                <NeonCard key={c.id} glow="pink" className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-kpop/20 flex items-center justify-center text-xl flex-shrink-0">📋</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink line-clamp-1">{c.titulo_lista}</p>
                    <p className="text-xs text-muted mt-0.5">{c.materia_estimada}</p>
                  </div>
                  {c.dias_desde_publicacao === 0 && <Badge label="Novo" color="pink" />}
                </NeonCard>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
