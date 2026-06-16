"use client";
import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setErro("Erro ao enviar. Tente novamente.");
        return;
      }
      setEnviado(true);
    } catch {
      setErro("Erro de conexao. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-3xl mx-auto mb-4 shadow-neon">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-ink">SMILETUDY</h1>
          <p className="text-sm text-muted mt-1">Recuperar senha</p>
        </div>

        {enviado ? (
          <div className="text-center space-y-4">
            <div className="rounded-2xl border border-success/30 bg-success/10 px-6 py-8">
              <span className="text-4xl block mb-3">📬</span>
              <p className="font-semibold text-ink">Email enviado!</p>
              <p className="text-sm text-muted mt-2">
                Se esse email estiver cadastrado, voce recebera um link para redefinir sua senha.
              </p>
            </div>
            <Link href="/login" className="block text-sm text-muted hover:text-primary transition-colors mt-4">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-muted uppercase tracking-widest mb-2">Seu email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-ink placeholder-muted text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {erro && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-neon active:scale-95 transition-all disabled:opacity-50"
            >
              {carregando ? "Enviando..." : "Enviar link de recuperacao"}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-muted hover:text-primary transition-colors">
                Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
