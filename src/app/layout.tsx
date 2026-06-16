import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "SMILETUDY — Stage da Julia",
  description: "Sua base de comando de estudos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-bg min-h-screen">
        <Navbar />
        <main className="md:ml-56 pb-20 md:pb-0 min-h-screen bg-grid">
          {children}
        </main>
      </body>
    </html>
  );
}
