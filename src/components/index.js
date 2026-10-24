import { navigation } from "../data/navigation.js";
import { absoluteUrl, siteConfig, withBase } from "../data/site-config.js";
import { whatsappMessages } from "../data/whatsapp-messages.js";
import {
  escapeHtml,
  icon,
  jsonLd,
  linkTo,
  metaTags,
  whatsappUrl,
} from "../lib/html.js";

function isCurrent(path, href) {
  const cleanHref = href.split("#")[0];
  if (cleanHref === "/") return path === "/";
  return path.startsWith(cleanHref);
}

export function Header(path = "/") {
  const items = navigation
    .map((item) => {
      const active = isCurrent(path, item.href);
      if (!item.children) {
        return `<li><a class="nav-link${active ? " is-active" : ""}" href="${linkTo(item.href)}"${active ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
      }

      const children = item.children
        .map(
          (child) =>
            `<li><a href="${linkTo(child.href)}">${child.label}${icon("arrow", "icon icon-xs")}</a></li>`,
        )
        .join("");

      return `<li class="nav-has-children">
        <details${active ? ' class="is-active"' : ""}>
          <summary>${item.label}${icon("chevron", "icon icon-xs")}</summary>
          <ul class="nav-submenu">${children}</ul>
        </details>
      </li>`;
    })
    .join("");

  return `<header class="site-header" data-header>
    <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
    <div class="container header-inner">
      <a class="brand" href="${withBase("/")}" aria-label="RX Engenharia e Projetos — início">
        <img src="${withBase(siteConfig.logo)}" alt="RX Engenharia e Projetos" width="180" height="120">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-navigation" aria-label="Abrir menu" data-menu-toggle>
        ${icon("menu")}<span aria-hidden="true">Menu</span>
      </button>
      <nav class="main-nav" id="main-navigation" aria-label="Navegação principal" data-main-nav>
        <ul>${items}</ul>
        <a class="button button-sm button-primary nav-cta" href="${whatsappUrl(whatsappMessages.geral)}" target="_blank" rel="noopener">${icon("whatsapp")} Falar com a RX</a>
      </nav>
    </div>
  </header>`;
}

export function Footer() {
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="${withBase(siteConfig.logo)}" alt="RX Engenharia e Projetos" width="200" height="133" loading="lazy">
        <p>Engenharia e soluções técnicas para projetos, laudos, fiscalização, gerenciamento, instalações e demandas sanitárias e ambientais.</p>
      </div>
      <div>
        <h2>Atuação</h2>
        <ul class="footer-links">
          <li><a href="${withBase("/projetos-tecnicos/")}">Projetos técnicos</a></li>
          <li><a href="${withBase("/laudos-e-vistorias/")}">Laudos e vistorias</a></li>
          <li><a href="${withBase("/fiscalizacao-e-gerenciamento/")}">Fiscalização de obras</a></li>
          <li><a href="${withBase("/engenharia-sanitaria-e-ambiental/")}">Sanitária e ambiental</a></li>
        </ul>
      </div>
      <div>
        <h2>Institucional</h2>
        <ul class="footer-links">
          <li><a href="${withBase("/sobre/")}">Sobre a RX</a></li>
          <li><a href="${withBase("/portfolio/")}">Portfólio</a></li>
          <li><a href="${withBase("/politica-comercial/")}">Política comercial</a></li>
          <li><a href="${withBase("/contato/")}">Contato</a></li>
        </ul>
      </div>
      <div>
        <h2>Contato</h2>
        <ul class="contact-list">
          ${siteConfig.whatsappContacts.map((contact) => `<li>${icon("whatsapp")}<a href="${whatsappUrl(whatsappMessages.geral, contact.number)}" target="_blank" rel="noopener">${contact.display}</a></li>`).join("")}
          <li>${icon("mail")}<a href="mailto:${siteConfig.email}">${siteConfig.email}</a></li>
          <li>${icon("pin")}<span>${siteConfig.city}</span></li>
          <li>${icon("instagram")}<a href="${siteConfig.instagram.url}" target="_blank" rel="noopener">${siteConfig.instagram.handle}</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span data-current-year>2026</span> ${siteConfig.name}. Todos os direitos reservados.</p>
      <p>Conteúdo técnico sujeito à análise de escopo e condições locais.</p>
    </div>
  </footer>`;
}

export function Layout({
  title,
  description,
  path,
  content,
  bodyClass = "",
  image = "",
}) {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.siteUrl ? { url: siteConfig.siteUrl } : {}),
    ...(siteConfig.siteUrl ? { logo: absoluteUrl(siteConfig.logo) } : {}),
    telephone: siteConfig.whatsappContacts.map((contact) => `+${contact.number}`),
    contactPoint: siteConfig.whatsappContacts.map((contact) => ({ "@type": "ContactPoint", telephone: `+${contact.number}`, contactType: "customer service", availableLanguage: "Portuguese" })),
    email: siteConfig.email,
    areaServed: siteConfig.serviceArea,
    sameAs: [siteConfig.instagram.url],
  };

  return `<!doctype html>
<html lang="${siteConfig.language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#090a0b">
  ${metaTags({ title, description, path, image })}
  ${jsonLd(businessSchema)}
  <link rel="icon" href="${withBase(siteConfig.logo)}">
  <link rel="stylesheet" href="${withBase("/assets/site.css")}">
  <script type="module" src="${withBase("/assets/main.js")}" defer></script>
</head>
<body class="${bodyClass}" data-page="${escapeHtml(path)}" data-whatsapp="${siteConfig.whatsappNumber}" data-whatsapp-allowed="${siteConfig.whatsappContacts.map((contact) => contact.number).join(" ")}">
  ${Header(path)}
  <main id="conteudo">${content}</main>
  ${Footer()}
  <a class="floating-whatsapp" href="${whatsappUrl(whatsappMessages.geral)}" target="_blank" rel="noopener" aria-label="Falar com a RX pelo WhatsApp">
    ${icon("whatsapp")}<span>WhatsApp</span>
  </a>
</body>
</html>`;
}

export function SectionTitle({ eyebrow = "", title, text = "", align = "left" }) {
  return `<div class="section-title section-title-${align}">
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}
    <h2>${title}</h2>
    ${text ? `<p>${text}</p>` : ""}
  </div>`;
}

export function PageHeader({ eyebrow, title, text, breadcrumbs = [] }) {
  const breadcrumbItems = [
    { label: "Início", href: "/" },
    ...breadcrumbs,
    { label: title, href: "" },
  ];
  const breadcrumbHtml = breadcrumbItems
    .map((item, index) => {
      const current = index === breadcrumbItems.length - 1;
      return `<li>${current ? `<span aria-current="page">${item.label}</span>` : `<a href="${linkTo(item.href)}">${item.label}</a>`}${current ? "" : icon("chevron", "icon icon-xs")}</li>`;
    })
    .join("");

  return `<section class="page-header technical-grid">
    <div class="container page-header-inner">
      <nav aria-label="Trilha de navegação"><ol class="breadcrumbs">${breadcrumbHtml}</ol></nav>
      <span class="eyebrow">${eyebrow}</span>
      <h1>${title}</h1>
      <p>${text}</p>
    </div>
  </section>`;
}

export function ServiceCard(service) {
  const message = whatsappMessages[service.mensagemWhatsApp] || whatsappMessages.geral;
  return `<article class="service-card" id="${service.slug}">
    <div class="card-icon">${icon(service.icon)}</div>
    <div class="service-card-body">
      <span class="card-kicker">${service.categoria || "Engenharia"}</span>
      <h3>${service.nome}</h3>
      <p>${service.descricaoCurta || service.descricao}</p>
    </div>
    <div class="card-actions">
      ${service.href ? `<a class="text-link" href="${linkTo(service.href)}">Ver detalhes ${icon("arrow", "icon icon-sm")}</a>` : ""}
      <a class="text-link text-link-muted" href="${whatsappUrl(message)}" target="_blank" rel="noopener">${service.cta} ${icon("whatsapp", "icon icon-sm")}</a>
    </div>
  </article>`;
}

export function TechnicalService(service, examples = []) {
  const message = whatsappMessages[service.mensagemWhatsApp] || whatsappMessages.geral;
  return `<article class="technical-service" id="${service.slug}">
    <div class="technical-service-heading">
      <div class="card-icon">${icon(service.icon)}</div>
      <div><span class="card-kicker">${service.categoria}</span><h3>${service.nome}</h3></div>
    </div>
    <p class="lead-small">${service.descricaoCompleta}</p>
    <div class="technical-columns">
      <div><h4>Quando contratar</h4><p>${service.quandoContratar}</p></div>
      <div><h4>Principais entregáveis</h4>${CheckList(service.entregaveis)}</div>
    </div>
    ${examples.length ? `<div class="service-evidence"><span>Experiência neste serviço</span>${examples.slice(0, 2).map((item) => `<a href="${withBase(`/portfolio/${item.slug}/`)}">${escapeHtml(item.titulo)} ${icon("arrow", "icon icon-sm")}</a>`).join("")}</div>` : ""}
    <a class="button button-secondary" href="${whatsappUrl(message)}" target="_blank" rel="noopener">${icon("whatsapp")} ${service.cta}</a>
  </article>`;
}

export function CheckList(items, className = "check-list") {
  return `<ul class="${className}">${items.map((item) => `<li>${icon("check", "icon icon-sm")}<span>${item}</span></li>`).join("")}</ul>`;
}

export function CtaSection({ eyebrow = "Próximo passo", title, text, label, message, secondary }) {
  return `<section class="cta-section technical-grid">
    <div class="container cta-inner">
      <div>
        <span class="eyebrow">${eyebrow}</span>
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
      <div class="cta-actions">
        <a class="button button-primary" href="${whatsappUrl(message)}" target="_blank" rel="noopener">${icon("whatsapp")} ${label}</a>
        ${secondary ? `<a class="button button-ghost" href="${linkTo(secondary.href)}">${secondary.label} ${icon("arrow", "icon icon-sm")}</a>` : ""}
      </div>
    </div>
  </section>`;
}

export function FAQ(items, heading = "Perguntas frequentes") {
  return `<section class="section section-muted">
    <div class="container faq-layout">
      ${SectionTitle({ eyebrow: "FAQ", title: heading, text: "Respostas objetivas para organizar seu primeiro contato com a RX." })}
      <div class="faq-list">${items
        .map(
          (item, index) => `<details${index === 0 ? " open" : ""}>
            <summary>${item.question}${icon("chevron", "icon icon-sm")}</summary>
            <div class="faq-answer"><p>${item.answer}</p></div>
          </details>`,
        )
        .join("")}</div>
    </div>
  </section>`;
}

export function PolicyNotice(text) {
  return `<aside class="policy-notice" aria-label="Aviso técnico">
    <div class="card-icon">${icon("warning")}</div>
    <div><h2>Aviso técnico</h2><p>${text}</p></div>
  </aside>`;
}

export function TeamCard(member) {
  return `<article class="team-card">
    <div class="team-monogram" aria-hidden="true">${member.nome.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("")}</div>
    <span class="card-kicker">${member.tipoVinculo}</span>
    <h3>${member.nome}</h3>
    <p class="team-role">${member.funcao}</p>
    <ul>${member.formacao.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p>${member.descricaoCurta}</p>
  </article>`;
}

export function InstagramCTA() {
  return `<section class="section instagram-section">
    <div class="container instagram-card technical-grid">
      <div class="instagram-mark">${icon("instagram")}</div>
      <div>
        <span class="eyebrow">Conteúdo técnico</span>
        <h2>Acompanhe a RX no Instagram</h2>
        <p>Vistorias, prevenção, projetos, execução e decisões técnicas explicadas de forma direta.</p>
      </div>
      <a class="button button-light" href="${siteConfig.instagram.url}" target="_blank" rel="noopener">${siteConfig.instagram.handle} ${icon("arrow", "icon icon-sm")}</a>
    </div>
  </section>`;
}

export function EmptyState({ title, text, label, message }) {
  return `<div class="empty-state technical-grid">
    <span class="empty-index">00</span>
    <div><span class="eyebrow">Em curadoria</span><h2>${title}</h2><p>${text}</p></div>
    <a class="button button-primary" href="${whatsappUrl(message)}" target="_blank" rel="noopener">${icon("whatsapp")} ${label}</a>
  </div>`;
}

export function PortfolioCard(item, heading = "h2") {
  const href = withBase(`/portfolio/${item.slug}/`);
  return `<article class="portfolio-card" data-portfolio-card data-disciplines="${escapeHtml(item.filtros.join(" "))}">
    <a class="portfolio-image" href="${href}" aria-label="Ver projeto: ${escapeHtml(item.titulo)}"><img src="${withBase(item.imagem)}" alt="${escapeHtml(item.alt)}" loading="lazy" width="1200" height="800"><span class="portfolio-image-label">Projeto desenvolvido · ${item.ano}</span></a>
    <div class="portfolio-card-body"><span class="card-kicker">${escapeHtml(item.categoria)}</span><${heading}><a href="${href}">${escapeHtml(item.titulo)}</a></${heading}><p>${escapeHtml(item.descricao)}</p>
    <ul class="discipline-tags" aria-label="Disciplinas do projeto">${item.disciplinas.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
    <div class="portfolio-card-footer"><span>${icon("pin", "icon icon-sm")}${escapeHtml(item.localGenerico)}</span><a class="text-link" href="${href}">Ver projeto ${icon("arrow", "icon icon-sm")}</a></div></div>
  </article>`;
}

export function BimWorkflow(steps) {
  return `<section class="section section-dark"><div class="container">${SectionTitle({ eyebrow: "Como trabalhamos em BIM", title: "Do levantamento à informação para a obra", text: "As disciplinas e as entregas são combinadas conforme a necessidade de cada projeto." })}<ol class="bim-process">${steps.map((step) => `<li><span>${step.indice}</span><h3>${step.titulo}</h3><p>${step.texto}</p></li>`).join("")}</ol></div></section>`;
}

export function ProjectCard(project) {
  const message = project.mensagemWhatsApp || whatsappMessages.projetoPronto.replace("[NOME DO PROJETO]", project.nome);
  const priceLabel = project.preco
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.preco)
    : "Valor sob consulta";
  return `<article class="project-card" data-project-card data-category="${escapeHtml(project.categoria)}" data-area="${project.areaConstruida || ""}" data-rooms="${project.quartos || ""}" data-floors="${project.pavimentos || ""}" data-style="${escapeHtml(project.estilo || "")}">
    <a class="project-image" href="${withBase(`/projetos-prontos/${project.slug}/`)}">
      <img src="${withBase(project.imagens[0])}" alt="${escapeHtml(project.nome)}" loading="lazy">
    </a>
    <div class="project-card-body">
      <span class="card-kicker">${project.codigo || project.categoria}</span>
      <h2><a href="${withBase(`/projetos-prontos/${project.slug}/`)}">${project.nome}</a></h2>
      <p>${project.descricaoCurta}</p>
      <dl class="project-specs">
        ${project.areaConstruida ? `<div><dt>Área</dt><dd>${project.areaConstruida} m²</dd></div>` : ""}
        ${project.quartos ? `<div><dt>Quartos</dt><dd>${project.quartos}</dd></div>` : ""}
        ${project.banheiros ? `<div><dt>Banheiros</dt><dd>${project.banheiros}</dd></div>` : ""}
        ${project.pavimentos ? `<div><dt>Pavimentos</dt><dd>${project.pavimentos}</dd></div>` : ""}
      </dl>
      <p class="project-card-price">${priceLabel}</p>
      <div class="card-actions">
        <a class="button button-secondary button-sm" href="${withBase(`/projetos-prontos/${project.slug}/`)}">Ver detalhes</a>
        <a class="text-link" href="${whatsappUrl(message)}" target="_blank" rel="noopener">WhatsApp ${icon("whatsapp", "icon icon-sm")}</a>
      </div>
    </div>
  </article>`;
}

export function ProjectFilters(projects = []) {
  const categories = [...new Set(projects.map((project) => project.categoria).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const styles = [...new Set(projects.map((project) => project.estilo).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  const options = (items) =>
    items.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");

  return `<form class="project-filters" data-project-filters>
    <div><label for="filter-category">Categoria</label><select id="filter-category" name="category"><option value="">Todas</option>${options(categories)}</select></div>
    <div><label for="filter-area">Área construída</label><select id="filter-area" name="area"><option value="">Todas</option><option value="ate-80">Até 80 m²</option><option value="81-120">81 a 120 m²</option><option value="121-180">121 a 180 m²</option><option value="181-mais">Acima de 180 m²</option></select></div>
    <div><label for="filter-rooms">Quartos</label><select id="filter-rooms" name="rooms"><option value="">Todos</option><option value="1">1</option><option value="2">2</option><option value="3">3+</option></select></div>
    <div><label for="filter-floors">Pavimentos</label><select id="filter-floors" name="floors"><option value="">Todos</option><option value="1">Térreo</option><option value="2">2+</option></select></div>
    <div><label for="filter-style">Estilo</label><select id="filter-style" name="style"><option value="">Todos</option>${options(styles)}</select></div>
    <button class="button button-secondary button-sm" type="reset">Limpar filtros</button>
  </form>`;
}

export function Gallery(images, title, captions = []) {
  return `<div class="project-gallery">${images.map((image, index) => `<figure class="${index === 0 ? "gallery-main" : ""}"><img src="${withBase(image)}" alt="${escapeHtml(captions[index] || `${title} — imagem ${index + 1}`)}" ${index ? 'loading="lazy"' : ""}>${captions[index] ? `<figcaption>${escapeHtml(captions[index])}</figcaption>` : ""}</figure>`).join("")}</div>`;
}

export function TechnicalSheet(project) {
  const rows = [
    ["Área construída", project.areaConstruida ? `${project.areaConstruida} m²` : "Consulte"],
    ["Pavimentos", project.pavimentos || "Consulte"],
    ["Quartos", project.quartos || "Consulte"],
    ["Suítes", project.suites ?? "Consulte"],
    ["Banheiros", project.banheiros || "Consulte"],
    ["Vagas", project.vagas ?? "Consulte"],
    ["Terreno mínimo", project.terrenoMinimo || "Consulte"],
    ["Estilo", project.estilo || "Consulte"],
  ];
  return `<dl class="technical-sheet">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>`;
}
