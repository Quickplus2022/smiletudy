import NeonCard from "@/components/ui/NeonCard";
import Badge from "@/components/ui/Badge";
import { TENANT_JULIA } from "@/data/tenant-julia";

const campos = [
  { label: "Tenant ID", valor: TENANT_JULIA.tenant_id },
  { label: "Nome de exibição", valor: TENANT_JULIA.nome_exibicao },
  { label: "Aluna", valor: TENANT_JULIA.aluna },
  { label: "Escola", valor: TENANT_JULIA.escola },
  { label: "Série", valor: TENANT_JULIA.serie },
  { label: "Turma", valor: TENANT_JULIA.turma },
  { label: "Turno", valor: TENANT_JULIA.turno },
  { label: "Tema", valor: TENANT_JULIA.tema },
];

export default function ConfigPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <header>
        <p className="text-xs text-muted uppercase tracking-widest">Sistema</p>
        <h1 className="text-2xl font-bold text-ink mt-1">Configuração do Tenant</h1>
        <p className="text-muted text-sm mt-1">Dados do perfil ativo</p>
      </header>

      <NeonCard glow="primary">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl">⚡</div>
          <div>
            <h2 className="font-bold text-ink text-lg">{TENANT_JULIA.nome_exibicao}</h2>
            <Badge label="Tenant ativo" color="success" />
          </div>
        </div>

        <div className="space-y-3">
          {campos.map((c) => (
            <div key={c.label} className="flex items-start gap-4 py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted w-36 flex-shrink-0 pt-0.5">{c.label}</span>
              <span className="text-sm text-ink font-medium">{c.valor}</span>
            </div>
          ))}
        </div>
      </NeonCard>

      <NeonCard glow="none">
        <h3 className="font-semibold text-ink mb-3">Fonte de dados</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted">classapp_base_comunicados.json</span>
            <Badge label="local" color="cyan" />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted">classapp_novos_hoje.json</span>
            <Badge label="local" color="cyan" />
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-muted">Banco MySQL Hostinger</span>
            <Badge label="em breve" color="muted" />
          </div>
        </div>
      </NeonCard>

      <NeonCard glow="none" className="border-border/50">
        <h3 className="font-semibold text-ink mb-2">Próximas etapas</h3>
        <ul className="space-y-1.5 text-sm text-muted">
          <li className="flex items-center gap-2"><span className="text-success">✓</span> Tenant Julia configurado</li>
          <li className="flex items-center gap-2"><span className="text-success">✓</span> Leitura de JSONs locais</li>
          <li className="flex items-center gap-2"><span className="text-success">✓</span> Grade semanal configurada</li>
          <li className="flex items-center gap-2"><span className="text-warn">○</span> Integração MySQL Hostinger</li>
          <li className="flex items-center gap-2"><span className="text-warn">○</span> Geração de missões por IA</li>
          <li className="flex items-center gap-2"><span className="text-warn">○</span> Multi-tenant (Luisa)</li>
        </ul>
      </NeonCard>
    </div>
  );
}
