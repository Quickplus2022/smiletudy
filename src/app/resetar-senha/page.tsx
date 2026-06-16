"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResetarForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";

  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!token) setErro("Link invalido. Solicite um novo.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas nao conferem.");
      return;
    }

    setCarregando(true);
    try {
      const res = await fetch("/api/auth/resetar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, senha }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.erro ?? "Link invalido ou expirado.");
        return;
      }
      setSucesso(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setErro("Erro de conexao. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-3xl mx-auto mb-4 shadow-neon">
          ⚡
        </div>
        <h1 className="text-2xl font-bold text-ink">SMILETUDY</h1>
        <p className="text-sm text-muted mt-1">Nova senha</p>
      </div>

      {sucesso ? (
        <div className="text-center space-y-4">
          <div className="rounded-2xl border border-success/30 bg-success/10 px-6 py-8">
            <span className="text-4xl block mb-3">✅</span>
            <p className="font-semibold text-ink">Senha redefinida!</p>
            <p className="text-sm text-muted mt-2">Redirecionando para o login...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Nova senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              placeholder="Minimo 6 caracteres"
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-ink placeholder-muted text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-2">Confirmar senha</label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              placeholder="Repita a senha"
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
            disabled={carregando || !token}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-neon active:scale-95 transition-all disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar nova senha"}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm text-muted hover:text-primary transition-colors">
              Voltar para o login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetarSenhaPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted text-sm">Carregando...</div>}>
        <ResetarForm />
      </Suspense>
    </div>
  );
}
