/**
 * Roda depois do coletor ClassApp (03_CLASSAPP).
 * Copia JSONs e imagens para dentro do app e aciona rebuild no Vercel.
 *
 * Uso: node scripts/sync-dados.js
 */
const fs = require("fs");
const path = require("path");

const BASE_EXTRAIDA = path.resolve(__dirname, "../../02_BASE_EXTRAIDA/json");
const AGENDAS_SRC  = path.resolve(__dirname, "../../03_CLASSAPP/downloads/agendas_diarias");
const JSON_DST     = path.resolve(__dirname, "../src/data/json");
const IMG_DST      = path.resolve(__dirname, "../public/agendas");

// 1 — Copia JSONs
["classapp_base_comunicados.json", "classapp_novos_hoje.json"].forEach((f) => {
  const src = path.join(BASE_EXTRAIDA, f);
  const dst = path.join(JSON_DST, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✓ JSON copiado: ${f}`);
  } else {
    console.warn(`⚠ Não encontrado: ${src}`);
  }
});

// 2 — Copia imagens de agenda de todas as datas
if (fs.existsSync(AGENDAS_SRC)) {
  const datas = fs.readdirSync(AGENDAS_SRC);
  let total = 0;
  for (const data of datas) {
    const pasta = path.join(AGENDAS_SRC, data);
    if (!fs.statSync(pasta).isDirectory()) continue;
    const imgs = fs.readdirSync(pasta).filter((f) => f.endsWith(".png"));
    for (const img of imgs) {
      const id = img.split("_")[0];
      const dst = path.join(IMG_DST, `${id}.png`);
      if (!fs.existsSync(dst)) {
        fs.copyFileSync(path.join(pasta, img), dst);
        total++;
      }
    }
  }
  console.log(`✓ ${total} imagens novas copiadas`);
}

// 3 — Aciona rebuild no Vercel (se VERCEL_DEPLOY_HOOK estiver configurado)
const hook = process.env.VERCEL_DEPLOY_HOOK;
if (hook) {
  const https = require("https");
  const url = new URL(hook);
  https.get({ hostname: url.hostname, path: url.pathname + url.search }, (r) => {
    console.log(`✓ Rebuild Vercel acionado: HTTP ${r.statusCode}`);
  }).on("error", (e) => console.error("✗ Erro no webhook:", e.message));
} else {
  console.log("ℹ VERCEL_DEPLOY_HOOK não configurado — rebuild manual necessário");
}

console.log("\n✅ Sync concluído!");
