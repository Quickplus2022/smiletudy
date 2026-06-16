"use client";
import { useState, useEffect } from "react";
import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import { MOCK_MISSOES, MOCK_COMUNICADOS } from "@/data/mock-missoes";
import { TENANT_JULIA } from "@/data/tenant-julia";

interface PedidoAjuda {
  id: string;
  titulo: string;
  materia: string;
  ts: number;
  visto: boolean;
}

function horaRelativa(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min atras`;
  return `${Math.floor(min / 60)}h atras`;
}

export default function PaisPage() {
  const [pedidos, setPedidos] = useState<PedidoAjuda[]>([]);
  const [feitas, setFeitas] = useState<string[]>([]);
  const [aprovados, setAprovados] = useState<string[]>([]);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("smiletudy_pedidos") || "[]");
      const estado = JSON.parse(localStorage.getItem("smiletudy_estado") || "{}");
      const ap = JSON.parse(localStorage.getItem("smiletudy_aprovados") || "[]");
      setPedidos(p);
      setFeitas(estado.missoesFeitas ?? []);
      setAprovados(ap);
    } catch {/* ignore */}
  }, []);

  function marcarVisto(id: string) {
    const atualizados = pedidos.map((p) => p.id === id ? { ...p, visto: true } : p);
    setPedidos(atualizados);
    localStorage.setItem("smiletudy_pedidos", JSON.stringify(atualizados));
  }

  function aprovarMissao(id: string) {
    const novos = [...aprovados, id];
    setAprovados(novos);
    localStorage.setItem("smiletudy_aprovados", JSON.stringify(novos));
  }

  const pendentes = pedidos.filter((p) => !p.visto);
  const missoes = MOCK_MISSOES;
  const comunicados = MOCK_COMUNICADOS;
  const missoesFeitas = missoes.filter((m) => feitas.includes(m.id));
  const missoesPendentes = missoes.filter((m) => !feitas.includes(m.id));
  const novos = comunicados.filter((c) => c.dias_desde_publicacao === 0);
  const xpTotal = missoesFeitas.reduce((a, m) => a + m.xp, 0);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Painel do Responsavel</p>
        <h1 className="text-2xl font-bold text-ink mt-1">Acompanhamento</h1>
        <p className="text-muted text-sm mt-1">
          {TENANT_JULIA.aluna} · {TENANT_JULIA.turma} · {TENANT_JULIA.escola}
        </p>
      </header>

      {/* Notificacoes de ajuda */}
      {pendentes.length > 0 ? (
        <NeonCard glow="pink">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-kpop text-xl">🔔</span>
            <h2 className="font-bold text-ink">Pedidos de ajuda</h2>
            <span className="ml-auto w-6 h-6 rounded-full bg-kpop flex items-center justify-center text-xs text-white font-bold">
              {pendentes.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendentes.map((p) => (
              <div key={p.id} className="bg-bg rounded-xl p-4 border border-kpop/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{p.titulo}</p>
                    <p className="text-xs text-muted mt-0.5">{p.materia} · {horaRelativa(p.ts)}</p>
                  </div>
                  <Badge label="Aguardando" color="pink" />
                </div>
                <button
                  onClick={() => marcarVisto(p.id)}
                  className="mt-3 w-full py-2 rounded-xl bg-kpop/10 border border-kpop/30 text-kpop text-sm font-medium active:scale-95 transition-all"
                >
                  Ja ajudei a Julia
                </button>
              </div>
            ))}
          </div>
        </NeonCard>
      ) : (
        <NeonCard glow="none" className="border-success/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-semibold text-ink">Sem pedidos de ajuda</p>
              <p className="text-xs text-muted">A Julia esta indo bem por conta propria hoje.</p>
            </div>
          </div>
        </NeonCard>
      )}

      {/* Resumo do dia */}
      <NeonCard glow="cyan">
        <h2 className="font-semibold text-ink mb-4">Resumo de hoje</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-success">{missoesFeitas.length}</p>
            <p className="text-xs text-muted mt-1">Missoes feitas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-warn">{missoesPendentes.length}</p>
            <p className="text-xs text-muted mt-1">Pendentes</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{xpTotal}</p>
            <p className="text-xs text-muted mt-1">XP ganhos</p>
          </div>
        </div>
      </NeonCard>

      {/* Missoes para revisar */}
      {missoesFeitas.length > 0 && (
        <NeonCard glow="primary">
          <h2 className="font-semibold text-ink mb-4">Missoes para revisar</h2>
          <div className="space-y-3">
            {missoesFeitas.map((m) => (
              <div key={m.id} className="bg-bg rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{m.titulo}</p>
                    <p className="text-xs text-muted mt-0.5">{m.materia} · {m.duracao} min · +{m.xp} XP</p>
                  </div>
                  {aprovados.includes(m.id) ? (
                    <Badge label="Aprovado" color="success" />
                  ) : (
                    <button
                      onClick={() => aprovarMissao(m.id)}
                      className="px-3 py-1.5 rounded-xl bg-success/10 border border-success/30 text-success text-xs font-medium active:scale-95 transition-all whitespace-nowrap"
                    >
                      Aprovar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {/* Novidades do ClassApp */}
      {novos.length > 0 && (
        <NeonCard glow="none">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📢</span>
            <h2 className="font-semibold text-ink">Novidades da escola hoje</h2>
          </div>
          <div className="space-y-2">
            {novos.map((c) => (
              <div key={c.id} className="bg-bg rounded-xl p-3">
                <p className="text-sm font-medium text-ink">{c.titulo_lista}</p>
                <p className="text-xs text-muted mt-1 line-clamp-2">{c.texto}</p>
              </div>
            ))}
          </div>
        </NeonCard>
      )}

      {/* Missoes pendentes */}
      {missoesPendentes.length > 0 && (
        <NeonCard glow="none" className="border-warn/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-warn">⏳</span>
            <h2 className="font-semibold text-ink">Ainda nao concluidas</h2>
          </div>
          <div className="space-y-2">
            {missoesPendentes.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-1">
                <span className="text-warn text-xs">·</span>
                <p className="text-sm text-muted">{m.titulo} — {m.materia}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-3 pt-3 border-t border-border">
            Sugestao: pergunte a Julia qual ela prefere comecar. Deixe ela escolher.
          </p>
        </NeonCard>
      )}

      {/* Config */}
      <NeonCard glow="none">
        <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
          <span>⚙️</span> Configuracoes
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm text-ink">Aluna</p>
              <p className="text-xs text-muted">{TENANT_JULIA.aluna}</p>
            </div>
            <Badge label={TENANT_JULIA.turma} color="primary" />
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm text-ink">Escola</p>
              <p className="text-xs text-muted">{TENANT_JULIA.escola}</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <p className="text-sm text-ink">Horario de estudo</p>
              <p className="text-xs text-muted">13h30 - 17h00 (apos descanso pos-escola)</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-ink">Notificacoes de ajuda</p>
              <p className="text-xs text-muted">Ativas</p>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end px-1">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </NeonCard>

      <div className="text-center pb-4">
        <a href="/master" className="text-xs text-muted hover:text-ink transition-colors">
          Painel Master &rarr;
        </a>
      </div>
    </div>
  );
}
