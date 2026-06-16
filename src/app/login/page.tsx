"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro ?? "Erro ao entrar");
        return;
      }

      if (data.role === "MASTER") {
        router.push("/master");
      } else if (data.role === "PAI") {
        router.push("/pais");
      } else {
        router.push("/");
      }
    } catch {
      setErro("Erro de conexao. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-3xl mx-auto mb-4 shadow-neon">
            ⚡
          </div>
          <h1 className="text-2xl font-bold text-ink">SMILETUDY</h1>
          <p className="text-sm text-muted mt-1">Entre na sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Email</label>
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

          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
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
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-neon active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/esqueci-senha" className="text-sm text-muted hover:text-primary transition-colors">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  );
}
