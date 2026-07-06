import { access, cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Layout } from "../src/components/index.js";
import { portfolio } from "../src/data/portfolio.js";
import { projects, publishedProjects } from "../src/data/projects.js";
import { siteConfig } from "../src/data/site-config.js";
import { pages, projectDetailPage } from "../src/pages/pages.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

async function writeRoute(route, html) {
  const routePath = route === "/" ? "" : route.replace(/^\//, "").replace(/\/$/, "");
  const directory = path.join(dist, routePath);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, "index.html"), html, "utf8");
}

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "assets"), { recursive: true });

await cp(path.join(root, "public"), dist, { recursive: true });
await cp(path.join(root, "src", "styles", "site.css"), path.join(dist, "assets", "site.css"));
await cp(path.join(root, "src", "client", "main.js"), path.join(dist, "assets", "main.js"));

function duplicateValues(items, field) {
  const values = items.map((item) => item[field]).filter(Boolean);
  return values.filter((value, index) => values.indexOf(value) !== index);
}

for (const field of ["slug", "codigo"]) {
  const duplicates = duplicateValues(projects, field);
  if (duplicates.length) {
    throw new Error(`Projetos com ${field} duplicado: ${[...new Set(duplicates)].join(", ")}`);
  }
}

const portfolioDuplicates = duplicateValues(portfolio, "slug");
if (portfolioDuplicates.length) {
  throw new Error(
    `Portfólio com slug duplicado: ${[...new Set(portfolioDuplicates)].join(", ")}`,
  );
}

for (const project of projects) {
  if (!/^(publicado|rascunho)$/.test(project.status)) {
    throw new Error(`Status inválido no projeto ${project.nome || project.slug}: ${project.status}`);
  }
  if (project.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    throw new Error(`Slug inválido no projeto ${project.nome || project.slug}: ${project.slug}`);
  }
}

for (const item of portfolio) {
  if (!/^(publicado|rascunho)$/.test(item.status)) {
    throw new Error(`Status inválido no portfólio ${item.titulo || item.slug}: ${item.status}`);
  }
  if (item.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
    throw new Error(`Slug inválido no portfólio ${item.titulo || item.slug}: ${item.slug}`);
  }
}

const routeDuplicates = duplicateValues(pages, "path");
if (routeDuplicates.length) {
  throw new Error(`Rotas duplicadas: ${[...new Set(routeDuplicates)].join(", ")}`);
}

for (const project of publishedProjects) {
  const missing = [];
  if (!project.slug) missing.push("slug");
  if (!project.codigo) missing.push("codigo");
  if (!project.nome) missing.push("nome");
  if (!project.categoria) missing.push("categoria");
  if (!project.descricaoCurta) missing.push("descricaoCurta");
  if (!project.descricaoCompleta) missing.push("descricaoCompleta");
  if (!project.areaConstruida) missing.push("areaConstruida");
  if (!Number.isFinite(project.quartos)) missing.push("quartos");
  if (project.suites !== null && !Number.isFinite(project.suites)) missing.push("suites");
  if (!Number.isFinite(project.banheiros)) missing.push("banheiros");
  if (project.vagas !== null && !Number.isFinite(project.vagas)) missing.push("vagas");
  if (!project.pavimentos) missing.push("pavimentos");
  if (!project.terrenoMinimo) missing.push("terrenoMinimo");
  if (!project.estilo) missing.push("estilo");
  if (!project.imagens?.length) missing.push("imagens");
  if (project.legendasImagens?.length !== project.imagens?.length) missing.push("legendasImagens");
  if (!project.ambientes?.length) missing.push("ambientes");
  if (!project.itensInclusos?.length) missing.push("itensInclusos");
  if (!project.itensNaoInclusos?.length) missing.push("itensNaoInclusos");
  if (!project.observacoesTecnicas) missing.push("observacoesTecnicas");
  if (missing.length) {
    throw new Error(`Projeto publicado incompleto (${project.nome || project.slug}): ${missing.join(", ")}`);
  }
  for (const image of project.imagens) {
    if (!/^\/assets\/projetos\/.+\.(avif|jpe?g|png|webp)$/i.test(image)) {
      throw new Error(`Imagem de projeto fora da pasta pública permitida: ${image}`);
    }
    await access(path.join(root, "public", image.replace(/^\//, "")));
  }
}

for (const item of portfolio.filter((entry) => entry.status === "publicado")) {
  const missing = [];
  if (!item.slug) missing.push("slug");
  if (!item.titulo) missing.push("titulo");
  if (!item.categoria) missing.push("categoria");
  if (!item.descricao) missing.push("descricao");
  if (!item.imagem) missing.push("imagem");
  if (!item.escopo) missing.push("escopo");
  if (item.anonimizado !== true) missing.push("anonimizado: true");
  if (missing.length) {
    throw new Error(
      `Portfólio publicado incompleto (${item.titulo || item.slug}): ${missing.join(", ")}`,
    );
  }
  if (!/^\/assets\/portfolio\/.+\.(avif|jpe?g|png|webp)$/i.test(item.imagem)) {
    throw new Error(`Imagem de portfólio fora da pasta pública permitida: ${item.imagem}`);
  }
  await access(path.join(root, "public", item.imagem.replace(/^\//, "")));
}

for (const page of pages) {
  await writeRoute(page.path, page.render());
}

for (const project of publishedProjects) {
  await writeRoute(`/projetos-prontos/${project.slug}/`, projectDetailPage(project));
}

const notFound = Layout({
  title: "Página não encontrada",
  description: "A página solicitada não foi encontrada.",
  path: "/404.html",
  content: `<section class="not-found technical-grid"><div class="container"><span class="empty-index">404</span><h1>Página não encontrada</h1><p>O endereço pode ter mudado ou ainda não está disponível.</p><a class="button button-primary" href="${siteConfig.basePath || "/"}">Voltar ao início</a></div></section>`,
});
await writeFile(path.join(dist, "404.html"), notFound, "utf8");

await writeFile(
  path.join(dist, "robots.txt"),
  "User-agent: *\nAllow: /\n",
  "utf8",
);

if (siteConfig.siteUrl) {
  const routes = [
    ...pages.map((page) => page.path),
    ...publishedProjects.map((project) => `/projetos-prontos/${project.slug}/`),
  ];
  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const basePath = siteConfig.basePath.replace(/\/$/, "");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${baseUrl}${basePath}${route}</loc></url>`).join("\n")}\n</urlset>\n`;
  await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf8");
}

await writeFile(
  path.join(dist, "manifest.webmanifest"),
  JSON.stringify(
    {
      name: siteConfig.name,
      short_name: siteConfig.shortName,
      start_url: siteConfig.basePath || "/",
      display: "standalone",
      background_color: "#090a0b",
      theme_color: "#090a0b",
      icons: [],
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`Build concluído: ${pages.length + publishedProjects.length} páginas em ${dist}`);
