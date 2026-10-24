import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync(process.execPath, [path.join(root, "scripts", "check.mjs")], {
  cwd: root,
  env: { ...process.env, RX_DEPLOY_TARGET: "locaweb" },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log("Locaweb: arquivos validados em dist-locaweb/, com URLs na raiz de https://rxprojetosbim.eng.br.");
console.log("Publique somente o conteúdo dessa pasta na public_html, após liberar a hospedagem.");
