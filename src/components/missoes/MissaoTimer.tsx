"use client";
import { useState, useEffect, useCallback } from "react";

interface MissaoTimerProps {
  duracaoMinutos: number;
  onConcluir: () => void;
  onCancelar: () => void;
  titulo: string;
  xp: number;
}

export default function MissaoTimer({ duracaoMinutos, onConcluir, onCancelar, titulo, xp }: MissaoTimerProps) {
  const total = duracaoMinutos * 60;
  const [restante, setRestante] = useState(total);
  const [rodando, setRodando] = useState(true);

  const terminou = restante <= 0;
  const pct = Math.max(0, Math.round((restante / total) * 100));
  const min = Math.floor(restante / 60).toString().padStart(2, "0");
  const seg = (restante % 60).toString().padStart(2, "0");

  useEffect(() => {
    if (!rodando || terminou) return;
    const t = setInterval(() => setRestante((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [rodando, terminou]);

  const circunferencia = 2 * Math.PI * 54;
  const offset = circunferencia * (1 - pct / 100);

  const handleConcluir = useCallback(() => {
    setRodando(false);
    onConcluir();
  }, [onConcluir]);

  return (
    <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <p className="text-xs text-muted uppercase tracking-widest">Missão em andamento</p>
        <h2 className="text-xl font-bold text-ink">{titulo}</h2>

        {/* Anel de progresso */}
        <div className="relative inline-flex items-center justify-center">
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r="54" fill="none" stroke="#1E2547" strokeWidth="8" />
            <circle
              cx="70" cy="70" r="54" fill="none"
              stroke={terminou ? "#34D399" : "#8B5CF6"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute text-center">
            {terminou ? (
              <span className="text-4xl">🎉</span>
            ) : (
              <>
                <p className="text-3xl font-bold text-ink font-mono">{min}:{seg}</p>
                <p className="text-xs text-muted mt-1">restando</p>
              </>
            )}
          </div>
        </div>

        {terminou ? (
          <div className="space-y-4">
            <p className="text-success font-semibold text-lg">Tempo finalizado!</p>
            <button
              onClick={handleConcluir}
              className="w-full py-4 rounded-2xl bg-success text-white font-bold text-lg active:scale-95 transition-all"
            >
              ✓ Missão concluída! +{xp} XP
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => setRodando((r) => !r)}
              className="w-full py-3 rounded-2xl bg-card border border-border text-ink font-medium"
            >
              {rodando ? "⏸ Pausar" : "▶ Continuar"}
            </button>
            <button
              onClick={handleConcluir}
              className="w-full py-3 rounded-2xl bg-success/20 border border-success/40 text-success font-medium"
            >
              ✓ Já terminei! +{xp} XP
            </button>
            <button onClick={onCancelar} className="text-sm text-muted hover:text-ink transition-colors">
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
