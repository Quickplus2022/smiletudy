"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (senha.length < 6) {
      setErro("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro ?? "Erro ao criar conta.");
        return;
      }

      setSucesso("Conta criada! Redirecionando...");
      setTimeout(() => router.push("/"), 1200);
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
            ✨
          </div>
          <h1 className="text-2xl font-bold text-ink">SMILETUDY</h1>
          <p className="text-sm text-muted mt-1">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoComplete="name"
              placeholder="Seu nome completo"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-ink placeholder-muted text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

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
              autoComplete="new-password"
              placeholder="Min. 6 caracteres"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-ink placeholder-muted text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Confirmar Senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Repita a senha"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-ink placeholder-muted text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          {erro && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {sucesso}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-neon active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
