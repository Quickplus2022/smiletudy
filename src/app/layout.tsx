import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "SMILETUDY — Stage da Julia",
  description: "Sua base de comando de estudos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
