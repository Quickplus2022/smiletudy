"use client";
import { useState } from "react";

interface OnboardingProps {
  nome: string;
  totalMissoes: number;
  tempoTotal: number;
  onStart: () => void;
}

const STEPS = [
  {
    emoji: "⚡",
    titulo: "Bem-vinda à sua Base de Comando!",
    texto: "Aqui é o seu quartel general de estudos. Cada dia tem novas missões esperando por você.",
    btn: "Continuar →",
  },
  {
    emoji: "🎯",
    titulo: "Como funcionam as missões",
    texto: "Cada missão é uma matéria da escola transformada em desafio. Você escolhe por onde começar.",
    btn: "Entendi →",
  },
  {
    emoji: "⚡",
    titulo: "Ganhe XP ao concluir",
    texto: "Cada missão concluída dá XP. Pedir ajuda também dá XP — porque isso é inteligente!",
    btn: "Incrível →",
  },
];

export default function Onboarding({ nome, totalMissoes, tempoTotal, onStart }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const atual = STEPS[step];
  const isUltimo = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        {/* Indicador de passos */}
        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-primary" : i < step ? "w-4 bg-primary/40" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Conteúdo */}
        <div className="space-y-4">
          <div className="text-7xl">{atual.emoji}</div>
          <h1 className="text-2xl font-bold text-ink leading-tight">{atual.titulo}</h1>
          <p className="text-muted text-lg leading-relaxed">{atual.texto}</p>
        </div>

        {/* Card de resumo no último passo */}
        {isUltimo && (
          <div className="bg-card border border-primary/40 rounded-2xl p-5 shadow-neon space-y-3">
            <p className="text-sm text-muted">Hoje para {nome}:</p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{totalMissoes}</p>
                <p className="text-xs text-muted mt-1">missões</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">{tempoTotal}</p>
                <p className="text-xs text-muted mt-1">minutos</p>
              </div>
            </div>
          </div>
        )}

        {/* Botão */}
        <button
          onClick={() => (isUltimo ? onStart() : setStep((s) => s + 1))}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-neon hover:bg-primary/80 active:scale-95 transition-all"
        >
          {isUltimo ? `🚀 Começar Stage!` : atual.btn}
        </button>

        {step > 0 && (
          <button onClick={() => setStep((s) => s - 1)} className="text-sm text-muted hover:text-ink transition-colors">
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}
