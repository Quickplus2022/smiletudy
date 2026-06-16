import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { criarToken, verificarSenha, COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();
    if (!email || !senha) return NextResponse.json({ erro: "Campos obrigatórios" }, { status: 400 });

    const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } });
    if (!usuario || !usuario.ativo) return NextResponse.json({ erro: "Email ou senha incorretos" }, { status: 401 });

    const ok = await verificarSenha(senha, usuario.senha_hash);
    if (!ok) return NextResponse.json({ erro: "Email ou senha incorretos" }, { status: 401 });

    const token = await criarToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
      tenant_id: usuario.tenant_id,
    });

    const res = NextResponse.json({ ok: true, role: usuario.role });
    res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
