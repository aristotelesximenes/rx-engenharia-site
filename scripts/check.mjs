import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { siteConfig } from "../src/data/site-config.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const build = spawnSync(process.execPath, [path.join(root, "scripts", "build.mjs")], {
  cwd: root,
  encoding: "utf8",
});
if (build.status !== 0) {
  process.stderr.write(build.stderr || build.stdout);
  process.exit(build.status || 1);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else files.push(fullPath);
  }
  return files;
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const errors = [];
const forbiddenExtensions = /\.(pdf|docx?|xlsx?|dwg|dxf|rvt|rfa|zip|rar|sqlite(?:-\w+)?)$/i;

for (const file of files) {
  if (forbiddenExtensions.test(file)) {
    errors.push(`Arquivo técnico/sensível na saída: ${path.relative(dist, file)}`);
  }
  if (/^\.env(?:\.|$)/i.test(path.basename(file))) errors.push(`Arquivo de ambiente na saída: ${path.relative(dist,file)}`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(dist, file);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${relative}: sem title`);
  if (!/<meta name="description" content="[^"]+">/.test(html)) errors.push(`${relative}: sem description`);
  if (!/<script type="application\/ld\+json">/.test(html)) errors.push(`${relative}: sem dados estruturados`);
  if (!/<h1[ >]/.test(html)) errors.push(`${relative}: sem h1`);
  const h1Count = (html.match(/<h1[ >]/g) || []).length;
  if (h1Count !== 1) errors.push(`${relative}: deve conter exatamente um h1 (encontrados: ${h1Count})`);
  if (/INSERIR_|>A DEFINIR<|\bCPF\b|ASSINATURA:/i.test(html)) errors.push(`${relative}: placeholder ou dado indevido exposto`);
  if (/target="_blank"(?![^>]*rel="[^"]*noopener)/g.test(html)) errors.push(`${relative}: link externo sem rel=noopener`);

  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const link of links) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(link)) continue;
    const clean = link.split(/[?#]/)[0];
    if (!clean) continue;
    const normalized = siteConfig.basePath && clean.startsWith(siteConfig.basePath)
      ? clean.slice(siteConfig.basePath.length) || "/"
      : clean;
    let target = path.join(dist, normalized.replace(/^\//, ""));
    try {
      const info = await stat(target);
      if (info.isDirectory()) target = path.join(target, "index.html");
      await stat(target);
    } catch {
      errors.push(`${relative}: link local ausente ${link}`);
    }
  }
}

const allHtml = (await Promise.all(htmlFiles.map((file) => readFile(file, "utf8")))).join("\n");
const unexpectedNumbers = [...allHtml.matchAll(/wa\.me\/(\d+)/g)]
  .map((match) => match[1])
  .filter((number) => !siteConfig.whatsappContacts.some((contact) => contact.number === number));
if (unexpectedNumbers.length) errors.push("Há um número de WhatsApp não cadastrado na saída.");

if (errors.length) {
  console.error(`Falhas encontradas (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Verificação concluída: ${htmlFiles.length} páginas, ${files.length} arquivos e nenhum acervo sensível na saída.`);
