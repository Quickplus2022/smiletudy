"use client";
import Link from "next/link";

interface CelebracaoProps {
  xpTotal: number;
  totalMissoes: number;
  nome: string;
}

export default function Celebracao({ xpTotal, totalMissoes, nome }: CelebracaoProps) {
  return (
    <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">

        {/* Estrelas animadas */}
        <div className="text-6xl animate-bounce">🎉</div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-ink text-glow-purple">
            Incrível, {nome}!
          </h1>
          <p className="text-muted text-lg">
            Você concluiu todas as missões de hoje!
          </p>
        </div>

        {/* XP ganho */}
        <div className="bg-card border border-primary/40 rounded-2xl p-6 shadow-neon">
          <p className="text-xs text-muted uppercase tracking-widest mb-3">Resultado de hoje</p>
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">+{xpTotal}</p>
              <p className="text-xs text-muted mt-1">XP conquistados</p>
            </div>
            <div className="w-px bg-border" />
            <div className="text-center">
              <p className="text-4xl font-bold text-success">{totalMissoes}</p>
              <p className="text-xs text-muted mt-1">missões feitas</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted italic">
            "Um passo de cada vez. Você está construindo algo incrível."
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/pais"
            className="block w-full py-4 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary font-semibold"
          >
            📊 Ver resumo dos pais
          </Link>
          <Link
            href="/"
            className="block w-full py-3 rounded-2xl bg-card border border-border text-muted text-sm"
          >
            ← Voltar para a Base
          </Link>
        </div>
      </div>
    </div>
  );
}
