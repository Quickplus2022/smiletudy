"use client";
import { useState, useEffect } from "react";
import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import { MOCK_MISSOES, MOCK_COMUNICADOS } from "@/data/mock-missoes";
import { TENANT_JULIA } from "@/data/tenant-julia";
import { getAvaliacoesProximas } from "@/data/avaliacoes-julia";
import type { Missao, ModoEstudo } from "@/types";

type Aba = "hoje" | "provas" | "missoes" | "config";

const COR_URGENCIA: Record<string, string> = {
  critica: "border-red-500/50 bg-red-500/10 text-red-400",
  alta: "border-orange-500/50 bg-orange-500/10 text-orange-400",
  media: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  baixa: "border-border bg-card text-muted",
};

function diasAteLabel(data: string): string {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const d = Math.ceil((new Date(data + "T00:00:00").getTime() - hoje.getTime()) / 86400000);
  if (d === 0) return "HOJE";
  if (d === 1) return "amanhã";
  return `${d} dias`;
}

const MATERIAS = [
  "Matemática", "Redação", "Compreensão de Texto e Gramática",
  "Inglês - Bilíngue", "História", "Geografia", "Ciências", "Paradidático",
];

const MUNDOS: Record<string, string> = {
  "Matemática": "Portal dos Códigos",
  "Redação": "Script Room",
  "Compreensão de Texto e Gramática": "Código da Língua",
  "Inglês - Bilíngue": "Arena Global",
  "História": "Máquina do Tempo",
  "Geografia": "Atlas Secreto",
  "Ciências": "Laboratório Secreto",
  "Paradidático": "Script Room",
};

const MODOS: ModoEstudo[] = ["chill", "idol", "anime", "calma"];

const MISSAO_VAZIA: Omit<Missao, "id" | "mundo"> = {
  titulo: "",
  materia: "Matemática",
  duracao: 20,
  xp: 25,
  objetivo: "",
  modo: "chill",
  status: "pendente",
};

export default function PaisPage() {
  const [aba, setAba] = useState<Aba>("hoje");
  const [feitas, setFeitas] = useState<string[]>([]);
  const [aprovados, setAprovados] = useState<string[]>([]);
  const [missoesManuais, setMissoesManuais] = useState<Missao[]>([]);
  const [criando, setCriando] = useState(false);
  const [editando, setEditando] = useState<Missao | null>(null);
  const [form, setForm] = useState<typeof MISSAO_VAZIA>({ ...MISSAO_VAZIA });

  useEffect(() => {
    try {
      const estado = JSON.parse(localStorage.getItem("smiletudy_estado") || "{}");
      const ap = JSON.parse(localStorage.getItem("smiletudy_aprovados") || "[]");
      const manuais = JSON.parse(localStorage.getItem("smiletudy_manuais") || "[]");
      setFeitas(estado.missoesFeitas ?? []);
      setAprovados(ap);
      setMissoesManuais(manuais);
    } catch {/* ignore */}
  }, []);

  function salvarManuais(lista: Missao[]) {
    setMissoesManuais(lista);
    localStorage.setItem("smiletudy_manuais", JSON.stringify(lista));
  }

  function aprovarMissao(id: string) {
    const novos = [...aprovados, id];
    setAprovados(novos);
    localStorage.setItem("smiletudy_aprovados", JSON.stringify(novos));
  }

  function criarMissao() {
    if (!form.titulo || !form.objetivo) return;
    const nova: Missao = {
      ...form,
      id: `manual-${Date.now()}`,
      mundo: MUNDOS[form.materia] ?? "Script Room",
    };
    salvarManuais([...missoesManuais, nova]);
    setForm({ ...MISSAO_VAZIA });
    setCriando(false);
  }

  function salvarEdicao() {
    if (!editando) return;
    const atualizada = { ...editando, ...form, mundo: MUNDOS[form.materia] ?? editando.mundo };
    salvarManuais(missoesManuais.map((m) => m.id === editando.id ? atualizada : m));
    setEditando(null);
    setForm({ ...MISSAO_VAZIA });
  }

  function excluirManual(id: string) {
    salvarManuais(missoesManuais.filter((m) => m.id !== id));
  }

  function abrirEdicao(m: Missao) {
    setEditando(m);
    setForm({ titulo: m.titulo, materia: m.materia, duracao: m.duracao, xp: m.xp, objetivo: m.objetivo, modo: m.modo, status: m.status });
    setCriando(false);
  }

  const todasMissoes = [...MOCK_MISSOES, ...missoesManuais];
  const missoesFeitas = todasMissoes.filter((m) => feitas.includes(m.id));
  const missoesPendentes = todasMissoes.filter((m) => !feitas.includes(m.id));
  const xpTotal = missoesFeitas.reduce((a, m) => a + m.xp, 0);
  const avaliacoes = getAvaliacoesProximas(14);
  const comunicados = MOCK_COMUNICADOS;
  const novos = comunicados.filter((c) => c.dias_desde_publicacao === 0);

  const ABAS: { id: Aba; label: string; badge?: number }[] = [
    { id: "hoje", label: "Hoje" },
    { id: "provas", label: "Provas", badge: avaliacoes.filter(a => a.urgencia === "critica" || a.urgencia === "alta").length },
    { id: "missoes", label: "Missões" },
    { id: "config", label: "Config" },
  ];

  const inputCls = "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors";

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <p className="text-xs text-muted uppercase tracking-widest">Painel do Responsável</p>
        <h1 className="text-xl font-bold text-ink mt-0.5">{TENANT_JULIA.aluna}</h1>
        <p className="text-xs text-muted">{TENANT_JULIA.escola} · {TENANT_JULIA.turma}</p>
      </div>

      {/* Abas */}
      <div className="flex border-b border-border bg-card overflow-x-auto">
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`relative flex items-center gap-1.5 px-5 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap ${
              aba === a.id ? "text-primary border-b-2 border-primary" : "text-muted hover:text-ink"
            }`}
          >
            {a.label}
            {a.badge ? (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {a.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-5">

        {/* ABA: HOJE */}
        {aba === "hoje" && (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Feitas", valor: missoesFeitas.length, cor: "text-green-400" },
                { label: "Pendentes", valor: missoesPendentes.length, cor: "text-yellow-400" },
                { label: "XP ganhos", valor: xpTotal, cor: "text-primary" },
              ].map((s) => (
                <NeonCard key={s.label} glow="none" className="text-center !py-4">
                  <p className={`text-2xl font-bold ${s.cor}`}>{s.valor}</p>
                  <p className="text-xs text-muted mt-1">{s.label}</p>
                </NeonCard>
              ))}
            </div>

            {/* AG alerta */}
            {avaliacoes.some(a => a.urgencia === "critica") && (
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-5 py-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Avaliação Global — 3 dias!</p>
                <p className="text-sm text-red-300">Redação + "Olhos para Mariella" na sexta 19/06. Verifique as missões de Redação.</p>
              </div>
            )}

            {/* Missoes feitas */}
            {missoesFeitas.length > 0 && (
              <NeonCard glow="primary">
                <h2 className="font-semibold text-ink mb-3">Para revisar e aprovar</h2>
                <div className="space-y-2">
                  {missoesFeitas.map((m) => (
                    <div key={m.id} className="bg-bg rounded-xl p-3 border border-border flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{m.titulo}</p>
                        <p className="text-xs text-muted">{m.materia} · {m.duracao} min · +{m.xp} XP</p>
                      </div>
                      {aprovados.includes(m.id) ? (
                        <Badge label="Aprovado" color="success" />
                      ) : (
                        <button onClick={() => aprovarMissao(m.id)} className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold active:scale-95 transition-all whitespace-nowrap">
                          Aprovar
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </NeonCard>
            )}

            {/* Pendentes */}
            <NeonCard glow="none">
              <h2 className="font-semibold text-ink mb-3">Missões pendentes hoje</h2>
              {missoesPendentes.length === 0 ? (
                <p className="text-sm text-muted">Todas concluídas!</p>
              ) : (
                <div className="space-y-2">
                  {missoesPendentes.slice(0, 5).map((m) => (
                    <div key={m.id} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                      <span className="text-muted text-xs">·</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink truncate">{m.titulo}</p>
                        <p className="text-xs text-muted">{m.materia} · {m.duracao} min</p>
                      </div>
                    </div>
                  ))}
                  {missoesPendentes.length > 5 && (
                    <p className="text-xs text-muted pt-1">+{missoesPendentes.length - 5} mais — veja aba Missões</p>
                  )}
                </div>
              )}
            </NeonCard>

            {/* ClassApp */}
            {novos.length > 0 && (
              <NeonCard glow="pink">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📢</span>
                  <h2 className="font-semibold text-ink">ClassApp hoje</h2>
                </div>
                {novos.map((c) => (
                  <div key={c.id} className="bg-bg rounded-xl p-3 border border-border">
                    <p className="text-sm font-medium text-ink">{c.titulo_lista}</p>
                    <p className="text-xs text-muted mt-1 line-clamp-2">{c.texto}</p>
                  </div>
                ))}
              </NeonCard>
            )}
          </>
        )}

        {/* ABA: PROVAS */}
        {aba === "provas" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Calendário de Avaliações</h2>
              <span className="text-xs text-muted">próximos 14 dias</span>
            </div>
            {avaliacoes.length === 0 ? (
              <NeonCard glow="none"><p className="text-sm text-muted text-center">Nenhuma prova nos próximos 14 dias.</p></NeonCard>
            ) : (
              <div className="space-y-3">
                {avaliacoes.map((av) => (
                  <div key={av.id} className={`rounded-2xl border px-5 py-4 ${COR_URGENCIA[av.urgencia]}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-current/10 px-2 py-0.5 rounded-full">{av.tipo}</span>
                          <span className="text-sm font-bold">{av.materia}</span>
                        </div>
                        <p className="text-xs opacity-70 mt-0.5">{av.data.split("-").reverse().join("/")}</p>
                      </div>
                      <span className="text-sm font-bold shrink-0">{diasAteLabel(av.data)}</span>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {av.conteudos.map((c, i) => (
                        <li key={i} className="text-xs opacity-80 flex gap-2">
                          <span>·</span><span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ABA: MISSOES */}
        {aba === "missoes" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Gestão de Missões</h2>
              <button
                onClick={() => { setCriando(true); setEditando(null); setForm({ ...MISSAO_VAZIA }); }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold active:scale-95 transition-all shadow-neon"
              >
                + Nova missão
              </button>
            </div>

            {/* Formulário criar/editar */}
            {(criando || editando) && (
              <NeonCard glow="primary">
                <h3 className="font-semibold text-ink mb-4">{editando ? "Editar missão" : "Nova missão manual"}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1">Título</label>
                    <input value={form.titulo} onChange={(e) => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Ex: Revisar concordância verbal" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted uppercase tracking-widest mb-1">Objetivo (instrução para a aluna)</label>
                    <textarea value={form.objetivo} onChange={(e) => setForm(f => ({ ...f, objetivo: e.target.value }))} rows={2} placeholder="O que ela deve fazer nessa missão?" className={inputCls + " resize-none"} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-1">Matéria</label>
                      <select value={form.materia} onChange={(e) => setForm(f => ({ ...f, materia: e.target.value }))} className={inputCls}>
                        {MATERIAS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-1">Modo</label>
                      <select value={form.modo} onChange={(e) => setForm(f => ({ ...f, modo: e.target.value as ModoEstudo }))} className={inputCls}>
                        {MODOS.map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-1">Duração (min)</label>
                      <input type="number" min={5} max={90} value={form.duracao} onChange={(e) => setForm(f => ({ ...f, duracao: Number(e.target.value) }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs text-muted uppercase tracking-widest mb-1">XP</label>
                      <input type="number" min={5} max={100} value={form.xp} onChange={(e) => setForm(f => ({ ...f, xp: Number(e.target.value) }))} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={editando ? salvarEdicao : criarMissao}
                      disabled={!form.titulo || !form.objetivo}
                      className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm active:scale-95 transition-all disabled:opacity-40"
                    >
                      {editando ? "Salvar" : "Criar missão"}
                    </button>
                    <button
                      onClick={() => { setCriando(false); setEditando(null); setForm({ ...MISSAO_VAZIA }); }}
                      className="px-4 py-2.5 rounded-xl border border-border text-muted text-sm font-medium active:scale-95 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </NeonCard>
            )}

            {/* Missões manuais */}
            {missoesManuais.length > 0 && (
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-2">Criadas manualmente</p>
                <div className="space-y-2">
                  {missoesManuais.map((m) => (
                    <div key={m.id} className="bg-card border border-primary/30 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">{m.titulo}</p>
                          <p className="text-xs text-muted mt-0.5">{m.materia} · {m.duracao} min · +{m.xp} XP</p>
                          <p className="text-xs text-muted/70 mt-1 line-clamp-1">{m.objetivo}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => abrirEdicao(m)} className="text-xs text-primary hover:underline">editar</button>
                          <button onClick={() => excluirManual(m.id)} className="text-xs text-red-400 hover:underline">excluir</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missões automáticas */}
            <div>
              <p className="text-xs text-muted uppercase tracking-widest mb-2">Geradas automaticamente (roteiros)</p>
              <div className="space-y-2">
                {MOCK_MISSOES.map((m) => (
                  <div key={m.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{m.titulo}</p>
                        <p className="text-xs text-muted mt-0.5">{m.materia} · {m.duracao} min · +{m.xp} XP</p>
                        <p className="text-xs text-muted/70 mt-1 line-clamp-1">{m.objetivo}</p>
                      </div>
                      <div className="shrink-0">
                        {feitas.includes(m.id) ? (
                          <Badge label="Feita" color="success" />
                        ) : (
                          <Badge label="Pendente" color="warn" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ABA: CONFIG */}
        {aba === "config" && (
          <NeonCard glow="none">
            <h2 className="font-semibold text-ink mb-5">Configurações do plano</h2>
            <div className="space-y-4">
              {[
                { label: "Aluna", valor: TENANT_JULIA.aluna },
                { label: "Escola", valor: TENANT_JULIA.escola },
                { label: "Série/Turma", valor: `${TENANT_JULIA.serie} · ${TENANT_JULIA.turma}` },
                { label: "Turno", valor: "Manhã (07:10 – 12:00)" },
                { label: "Horário de estudo", valor: "13:30 – 17:00 (após escola)" },
                { label: "Tema", valor: "K-pop + Anime" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm text-ink">{item.label}</p>
                    <p className="text-xs text-muted">{item.valor}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-border text-center">
              <a href="/master" className="text-xs text-muted hover:text-ink transition-colors">
                Ir para Painel Master →
              </a>
            </div>
          </NeonCard>
        )}

      </div>
    </div>
  );
}
