import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashSenha } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token, senha } = await req.json();
    if (!token || !senha || senha.length < 6) {
      return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
    }

    const registro = await prisma.tokenReset.findUnique({ where: { token } });
    if (!registro || registro.expira_em < new Date()) {
      return NextResponse.json({ erro: "Link inválido ou expirado" }, { status: 400 });
    }

    const hash = await hashSenha(senha);
    await prisma.usuario.update({ where: { id: registro.usuario_id }, data: { senha_hash: hash } });
    await prisma.tokenReset.delete({ where: { token } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
