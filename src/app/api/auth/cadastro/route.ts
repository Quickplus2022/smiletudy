import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { criarToken, hashSenha, COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json();

    if (!nome || !email || !senha) {
      return NextResponse.json({ erro: "Todos os campos são obrigatórios." }, { status: 400 });
    }
    if (senha.length < 6) {
      return NextResponse.json({ erro: "A senha deve ter ao menos 6 caracteres." }, { status: 400 });
    }

    const emailNorm = email.toLowerCase().trim();
    const existente = await prisma.usuario.findUnique({ where: { email: emailNorm } });
    if (existente) {
      return NextResponse.json({ erro: "Este email já está cadastrado." }, { status: 409 });
    }

    const senha_hash = await hashSenha(senha);
    const usuario = await prisma.usuario.create({
      data: { nome: nome.trim(), email: emailNorm, senha_hash, role: "ALUNA" },
    });

    const token = await criarToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
      tenant_id: usuario.tenant_id,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch {
    return NextResponse.json({ erro: "Erro interno." }, { status: 500 });
  }
}
