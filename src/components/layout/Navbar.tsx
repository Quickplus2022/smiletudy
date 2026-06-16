"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Base", icon: "⚡" },
  { href: "/missoes", label: "Missões", icon: "🎯" },
  { href: "/classapp", label: "ClassApp", icon: "📋" },
  { href: "/semana", label: "Semana", icon: "🗺️" },
  { href: "/pais", label: "Pais", icon: "👥" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-card border-r border-border z-40">
        <div className="p-5 border-b border-border">
          <p className="text-xs text-muted tracking-widest uppercase">SMILETUDY</p>
          <h1 className="text-lg font-bold text-ink mt-0.5">Stage da Julia</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/20 text-primary border border-primary/40"
                    : "text-muted hover:text-ink hover:bg-border"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/config"
            className="flex items-center gap-2 text-xs text-muted hover:text-ink transition-colors"
          >
            <span>⚙️</span> Config
          </Link>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 flex">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2.5 text-xs transition-colors ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
