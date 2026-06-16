interface XpBarProps {
  atual: number;
  total: number;
  label?: string;
}

export default function XpBar({ atual, total, label = "XP" }: XpBarProps) {
  const pct = Math.min(100, Math.round((atual / total) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted mb-1">
        <span>{label}</span>
        <span>{atual}/{total}</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
