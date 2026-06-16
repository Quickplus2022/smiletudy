import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmailResetSenha } from "@/lib/email";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const usuario = await prisma.usuario.findUnique({ where: { email: email.toLowerCase() } });

    // Sempre retorna ok para não revelar se o email existe
    if (!usuario) return NextResponse.json({ ok: true });

    const token = randomBytes(32).toString("hex");
    const expira_em = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.tokenReset.create({ data: { usuario_id: usuario.id, token, expira_em } });
    await enviarEmailResetSenha(usuario.email, token);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ erro: "Erro interno" }, { status: 500 });
  }
}
