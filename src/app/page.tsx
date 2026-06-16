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

export default function HomePage() {
  const { estado, concluirOnboarding } = useMissoes();
  const [showOnboarding, setShowOnboarding] = useState(!estado.onboardingFeito);

  const missoes = MOCK_MISSOES;
  const comunicados = MOCK_COMUNICADOS;
  const novos = comunicados.filter((c) => c.dias_desde_publicacao === 0);
  const xpTotal = missoes.reduce((acc, m) => acc + m.xp, 0);

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
              {getSaudacao()}, {TENANT_JULIA.aluna}! ⚡
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
