"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const ADMIN_ROUTES = ["/pais", "/master", "/login", "/cadastro", "/esqueci-senha", "/resetar-senha"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (isAdmin) {
    return <main className="min-h-screen bg-grid">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="md:ml-56 pb-20 md:pb-0 min-h-screen bg-grid">{children}</main>
    </>
  );
}
