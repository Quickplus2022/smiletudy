interface BadgeProps {
  label: string;
  color?: "primary" | "cyan" | "pink" | "success" | "warn" | "muted";
}

const colorMap: Record<string, string> = {
  primary: "bg-primary/20 text-primary border-primary/40",
  cyan: "bg-secondary/20 text-secondary border-secondary/40",
  pink: "bg-kpop/20 text-kpop border-kpop/40",
  success: "bg-success/20 text-success border-success/40",
  warn: "bg-warn/20 text-warn border-warn/40",
  muted: "bg-border text-muted border-border",
};

export default function Badge({ label, color = "primary" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[color]}`}>
      {label}
    </span>
  );
}
