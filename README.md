# SMILETUDY — Stage da Julia

MVP visual do sistema de estudos gamificado para Julia (8º ano 03 — Ari de Sá).

## Como rodar

```bash
cd 04_APP_ESTUDO
npm install
npm run dev
```

Acesse: http://localhost:3000

## Telas disponíveis

| Rota | Descrição |
|------|-----------|
| `/` | Base de Comando — dashboard principal |
| `/missoes` | Missões de hoje com XP e modos |
| `/classapp` | Comunicados coletados do ClassApp |
| `/semana` | Mapa semanal com grade de aulas |
| `/pais` | Painel dos pais com resumo e sugestão |
| `/config` | Configuração do tenant Julia |

## Dados

O app lê automaticamente os JSONs de `02_BASE_EXTRAIDA/json/`.
Se os arquivos não existirem ou estiverem vazios, usa dados mockados.

## APIs internas

| Endpoint | Retorno |
|----------|---------|
| `GET /api/comunicados` | Lista completa de comunicados |
| `GET /api/novos-hoje` | Comunicados de hoje |
| `GET /api/missoes?modo=chill` | Missões geradas para o modo |
| `GET /api/imagem-agenda?path=...` | Serve imagem da agenda local |

## Próximas fases

- Integração MySQL Hostinger
- Geração de missões por IA (Claude)
- Multi-tenant (adicionar Luisa)
