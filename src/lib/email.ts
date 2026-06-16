import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? "https://sm.romulobezerra.com";

export async function enviarEmailResetSenha(email: string, token: string) {
  const resend = getResend();
  const link = `${BASE_URL}/resetar-senha?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "SMILETUDY: redefinir sua senha",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#080A1A;color:#F8FAFC;padding:32px;border-radius:16px">
        <h1 style="color:#8B5CF6;margin-bottom:8px">SMILETUDY</h1>
        <p style="color:#CBD5E1;margin-bottom:24px">Recebemos um pedido para redefinir sua senha.</p>
        <a href="${link}"
           style="display:inline-block;background:#8B5CF6;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold">
          Redefinir senha
        </a>
        <p style="color:#CBD5E1;margin-top:24px;font-size:13px">
          O link expira em 1 hora. Se você não solicitou isso, pode ignorar este email.
        </p>
      </div>
    `,
  });
}

export async function enviarBoasVindas(email: string, nome: string) {
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Bem-vindo ao SMILETUDY!",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#080A1A;color:#F8FAFC;padding:32px;border-radius:16px">
        <h1 style="color:#8B5CF6">SMILETUDY</h1>
        <p>Olá, <strong>${nome}</strong>!</p>
        <p style="color:#CBD5E1">Sua conta foi criada. Acesse o sistema pelo link abaixo.</p>
        <a href="${BASE_URL}/login"
           style="display:inline-block;background:#8B5CF6;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold">
          Acessar SMILETUDY
        </a>
      </div>
    `,
  });
}
