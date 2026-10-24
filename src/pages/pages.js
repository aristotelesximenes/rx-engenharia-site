import {
  BimWorkflow,
  CheckList,
  CtaSection,
  EmptyState,
  FAQ,
  Gallery,
  InstagramCTA,
  Layout,
  PageHeader,
  PolicyNotice,
  PortfolioCard,
  ProjectCard,
  ProjectFilters,
  SectionTitle,
  TeamCard,
  TechnicalService,
  TechnicalSheet,
} from "../components/index.js";
import { generalFaq, readyProjectsFaq } from "../data/faq.js";
import {
  homeShowcase,
  homeFocusAreas,
} from "../data/home.js";
import { portfolioFilters, publishedPortfolio } from "../data/portfolio.js";
import { readyProjectNotice, readyProjectPolicies } from "../data/policies.js";
import { publishedProjects } from "../data/projects.js";
import {
  projectServices,
  projectServiceGroups,
  bimProcess,
  servicePages,
} from "../data/services.js";
import { siteConfig, withBase } from "../data/site-config.js";
import { team } from "../data/team.js";
import { whatsappMessages } from "../data/whatsapp-messages.js";
import { escapeHtml, icon, whatsappUrl } from "../lib/html.js";

function homePage() {
  const hero = homeShowcase[0];
  const featured = ["celesc", "museu-tre-ac", "igreja-batista-maanaim"].map((slug) => publishedPortfolio.find((item) => item.slug === slug)).filter(Boolean);
  const ready = publishedProjects.filter((project) => project.destaque).slice(0, 3);
  const directors = team.filter((member) => member.publicar && member.tipoVinculo !== "parceria técnica");
  const content = `
    <section class="studio-hero" aria-labelledby="home-title">
      <div class="container studio-hero-grid">
        <div class="studio-hero-copy">
          <span class="studio-kicker"><i aria-hidden="true"></i> Projetos integrados em BIM</span>
          <h1 id="home-title">Arquitetura<br>e engenharia.<br><span>Em sintonia.</span></h1>
          <p>Da primeira ideia ao detalhe construtivo. Conectamos espaços, estruturas e instalações para planejar melhor cada etapa da sua obra.</p>
          <div class="studio-hero-actions"><a class="button button-primary" href="${withBase("/portfolio/")}">Conheça nossos projetos ${icon("arrow", "icon icon-sm")}</a><a class="studio-secondary-link" href="${withBase("/projetos-tecnicos/")}">O que fazemos ${icon("arrow", "icon icon-sm")}</a></div>
          <div class="studio-hero-note">${icon("layers")}<p><strong>Uma visão integrada do seu projeto.</strong><span>Modelagem, compatibilização e informação para executar.</span></p></div>
        </div>
        <div class="studio-showcase" data-showcase>
          <div class="showcase-topline"><span>Em foco · Portfólio RX</span><span data-showcase-counter>01 / 03</span></div>
          <div class="showcase-image-wrap"><img data-showcase-image src="${withBase(hero.imagem)}" alt="${escapeHtml(hero.alt)}" width="1100" height="900" fetchpriority="high"></div>
          <a class="showcase-caption" data-showcase-link href="${withBase(`/portfolio/${hero.slug}/`)}"><div><span data-showcase-location>${hero.local}</span><h2 data-showcase-title>${hero.titulo}</h2></div><span class="showcase-open">${icon("arrow")}</span></a>
          <div class="showcase-controls" role="group" aria-label="Explorar projetos em destaque">${homeShowcase.map((item, index) => `<button type="button" data-showcase-select data-image="${withBase(item.imagem)}" data-alt="${escapeHtml(item.alt)}" data-title="${escapeHtml(item.titulo)}" data-location="${escapeHtml(item.local)}" data-href="${withBase(`/portfolio/${item.slug}/`)}" data-index="${index + 1}" aria-pressed="${index === 0 ? "true" : "false"}"><span>0${index + 1}</span>${item.categoria}</button>`).join("")}</div>
        </div>
      </div>
      <div class="container studio-disciplines"><span>Uma equipe.<br><strong>Múltiplas perspectivas.</strong></span><p>Arquitetura</p><i aria-hidden="true">+</i><p>Estruturas</p><i aria-hidden="true">+</i><p>Instalações</p><i aria-hidden="true">+</i><p>Compatibilização BIM</p></div>
    </section>

    <section class="section home-portfolio" id="projetos"><div class="container"><div class="featured-projects-heading">${SectionTitle({ eyebrow: "Projetos selecionados", title: "Cada projeto, uma resposta ao seu contexto.", text: "Trabalhos reais da RX em arquitetura, interiores e engenharia. Conheça as soluções e o escopo desenvolvido em cada case." })}<a class="studio-secondary-link" href="${withBase("/portfolio/")}">Ver portfólio completo ${icon("arrow", "icon icon-sm")}</a></div><div class="portfolio-grid portfolio-grid-featured">${featured.map((item) => PortfolioCard(item, "h3")).join("")}</div></div></section>

    <section class="section home-expertise" id="servicos"><div class="container"><div class="expertise-intro">${SectionTitle({ eyebrow: "O que fazemos", title: "Da concepção ao projeto que orienta a obra.", text: "Uma disciplina ou um conjunto integrado. O escopo é definido a partir das condições reais e das prioridades de cada cliente." })}<a class="button button-secondary" href="${withBase("/projetos-tecnicos/")}">Todas as especialidades ${icon("arrow", "icon icon-sm")}</a></div><div class="expertise-grid">${homeFocusAreas.map((area) => `<a class="expertise-card" href="${withBase(area.href)}"><div class="expertise-card-top"><span>${area.numero}</span>${icon(area.icon)}</div><h3>${area.titulo}</h3><p>${area.texto}</p><span class="expertise-card-link">Explorar especialidade ${icon("arrow", "icon icon-sm")}</span></a>`).join("")}</div><div class="support-services"><span>Também acompanhamos as suas decisões.</span><a href="${withBase("/laudos-e-vistorias/")}">Laudos e vistorias ${icon("arrow", "icon icon-sm")}</a><a href="${withBase("/fiscalizacao-e-gerenciamento/")}">Fiscalização de obras ${icon("arrow", "icon icon-sm")}</a><a href="${withBase("/engenharia-consultiva/")}">Consultoria técnica ${icon("arrow", "icon icon-sm")}</a></div></div></section>

    <section class="section section-dark home-method" id="bim"><div class="container method-layout"><div class="method-visual"><div class="method-visual-label"><span>Uma construção. Várias disciplinas.</span>${icon("layers")}</div><img src="${withBase("/assets/portfolio/igreja-maanaim/estrutura-3d.webp")}" alt="Modelo BIM da estrutura da Igreja Batista Maanaim, do portfólio real da RX" loading="lazy" width="1053" height="743"><div class="method-visual-caption"><span>Projeto real · Igreja Batista Maanaim</span><span>Timon / MA</span></div></div><div class="method-copy"><span class="eyebrow">Nossa forma de projetar</span><h2>Antes da obra,<br>as disciplinas conversam.</h2><p>O BIM conecta a visão espacial à informação técnica. Assim, o projeto pode ser analisado, coordenado e documentado com mais clareza.</p><ol class="method-steps">${bimProcess.map((step) => `<li><span>${step.indice}</span><div><h3>${step.titulo}</h3><p>${step.texto}</p></div></li>`).join("")}</ol></div></div></section>

    ${ready.length ? `<section class="section home-projects-section"><div class="container"><div class="featured-projects-heading">${SectionTitle({ eyebrow: "Seu ponto de partida", title: "Uma casa para começar a imaginar.", text: "Conheça nossos modelos de 50 a 85 m². Compare plantas, ambientes e possibilidades de adaptação ao seu terreno." })}<a class="studio-secondary-link" href="${withBase("/projetos-prontos/")}">Explorar o catálogo ${icon("arrow", "icon icon-sm")}</a></div><div class="projects-grid">${ready.map(ProjectCard).join("")}</div></div></section>` : ""}

    <section class="section home-team"><div class="container home-team-layout"><div><span class="eyebrow">Quem está por trás</span><h2>Engenharia próxima.<br>Conversa direta.</h2><p>Aristóteles Campelo e Fábio Batista Ribeiro conduzem a RX com formações complementares e atenção ao desenvolvimento de cada demanda.</p><a class="studio-secondary-link" href="${withBase("/sobre/")}">Conheça a RX ${icon("arrow", "icon icon-sm")}</a></div><div class="studio-directors">${directors.map((member) => `<article><span class="director-avatar" aria-hidden="true">${member.nome.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><h3>${member.nome}</h3><p>${member.funcao}</p></div>${icon("arrow", "icon icon-sm")}</article>`).join("")}<p class="team-footnote">Engenharia civil, sanitária e ambiental, com parceria técnica em Arquitetura conforme o projeto.</p></div></div></section>

    ${FAQ(generalFaq.slice(0, 4), "Vamos esclarecer o primeiro passo.")}
    ${CtaSection({ eyebrow: "Vamos conversar", title: "Seu próximo projeto começa com uma boa conversa.", text: "Conte o que você precisa, onde será o projeto e em que etapa está. Vamos organizar juntos o próximo passo.", label: "Conversar com a RX", message: whatsappMessages.geral, secondary: { label: "Ver contatos", href: "/contato/" } })}
  `;
  return Layout({ title: "Arquitetura, engenharia e projetos integrados em BIM", description: "Projetos reais de arquitetura, interiores, estruturas e instalações com coordenação BIM. Conheça o portfólio e as soluções da RX Engenharia e Projetos.", path: "/", content, image: hero.imagem, bodyClass: "home-page" });
}

function technicalProjectsPage() {
  const content = `
    ${PageHeader({ eyebrow: "Especialidades da RX", title: "Arquitetura e engenharia conectadas em BIM", text: "Projetos arquitetônicos, de interiores, estruturais e de instalações, com modelagem, compatibilização e informações para planejar a obra." })}
    <section class="section"><div class="container intro-grid"><div><span class="eyebrow">Base para executar</span><h2>Informação técnica antes da obra</h2></div><p>Projetos bem definidos reduzem improvisos, ajudam a compatibilizar disciplinas e tornam o escopo de execução mais claro. Cada contratação é estruturada conforme os dados disponíveis e a finalidade do cliente.</p></div></section>
    <section class="section section-muted"><div class="container">${SectionTitle({ eyebrow: "O que elaboramos", title: "Encontre o tipo de projeto para sua demanda", text: "Contrate uma disciplina ou um conjunto integrado. Os exemplos de cada especialidade levam a projetos reais do nosso portfólio." })}<nav class="specialty-nav" aria-label="Especialidades de projeto">${projectServiceGroups.map((group) => `<a href="#${group.slug}"><span>${group.indice}</span><strong>${group.nome}</strong>${icon("arrow", "icon icon-sm")}</a>`).join("")}</nav></div></section>
    ${projectServiceGroups.map((group) => `<section class="section specialty-section" id="${group.slug}"><div class="container"><div class="specialty-heading"><span class="specialty-number">${group.indice}</span><div><h2>${group.nome}</h2><p>${group.descricao}</p></div></div><div class="technical-services-list">${group.servicos.map((slug) => projectServices.find((service) => service.slug === slug)).map((service) => TechnicalService(service, publishedPortfolio.filter((item) => item.servicos.includes(service.slug)))).join("")}</div></div></section>`).join("")}
    ${BimWorkflow(bimProcess)}
    ${CtaSection({ title: "Precisa combinar mais de uma disciplina?", text: "A RX pode avaliar arquitetura, estrutura, instalações, drenagem e compatibilização em um escopo integrado.", label: "Solicitar projeto técnico", message: whatsappMessages.projetoTecnico, secondary: { label: "Projetos personalizados", href: "/projetos-personalizados/" } })}
  `;
  return Layout({
    title: "Projetos técnicos de engenharia",
    description:
      "Arquitetura, interiores, estruturas, instalações, modelagem e compatibilização BIM, quantitativos, planejamento e orçamento. Veja cases reais da RX.",
    path: "/projetos-tecnicos/",
    content,
  });
}

function readyProjectsPage() {
  const projectsHtml = publishedProjects.length
    ? `<div class="projects-grid" data-project-results>${publishedProjects.map(ProjectCard).join("")}</div><p class="filter-empty" data-filter-empty hidden>Nenhum projeto corresponde aos filtros selecionados.</p>`
    : EmptyState({
        title: "Catálogo em preparação editorial",
        text: "Os modelos disponíveis estão sendo revisados antes da publicação de imagens, ficha técnica, itens inclusos e condições comerciais. Nenhum projeto incompleto é exibido como produto.",
        label: "Pedir atendimento personalizado",
        message: whatsappMessages.projetoPersonalizado,
      });
  const content = `
    ${PageHeader({ eyebrow: "Linha comercial", title: "Projetos prontos e adaptáveis", text: "Modelos para quem busca um ponto de partida mais ágil, sempre sujeitos à avaliação do terreno, legislação, topografia e necessidade do cliente." })}
    <section class="section"><div class="container">
      <div class="catalog-intro"><div>${SectionTitle({ eyebrow: "Catálogo RX", title: "Escolha, adapte ou crie sob medida", text: "A área de projetos prontos é uma linha comercial da RX — não substitui análise técnica nem transforma o modelo em solução universal." })}</div>
      <div class="catalog-steps"><span><b>01</b> Escolher modelo</span><span><b>02</b> Verificar terreno</span><span><b>03</b> Avaliar adaptação</span></div></div>
      ${publishedProjects.length ? ProjectFilters(publishedProjects) : ""}
      ${projectsHtml}
    </div></section>
    <section class="section section-muted"><div class="container">${PolicyNotice(readyProjectNotice)}<div class="policy-link-row"><a class="text-link" href="${withBase("/politica-comercial/")}">Ler política comercial completa ${icon("arrow", "icon icon-sm")}</a></div></div></section>
    ${FAQ(readyProjectsFaq, "Dúvidas sobre projetos prontos")}
    ${CtaSection({ eyebrow: "Alternativa sob medida", title: "Seu terreno pede uma solução específica?", text: "Quando o modelo pronto não atende às condições locais ou ao programa, o projeto personalizado é o caminho mais seguro.", label: "Solicitar projeto personalizado", message: whatsappMessages.projetoPersonalizado, secondary: { label: "Entender o processo", href: "/projetos-personalizados/" } })}
  `;
  return Layout({
    title: "Projetos prontos e adaptáveis",
    description:
      "Catálogo de projetos prontos e adaptáveis da RX, com ficha técnica, avisos de adaptação e atendimento para projeto personalizado.",
    path: "/projetos-prontos/",
    content,
  });
}

function personalizedProjectsPage() {
  const packages = [
    ["Arquitetura", "Organização dos espaços, implantação e linguagem da edificação."],
    ["Complementares", "Estrutural, elétrico, hidrossanitário, drenagem e luminotécnico."],
    ["Coordenação", "Compatibilização e integração das disciplinas previstas no escopo."],
  ];
  const content = `
    ${PageHeader({ eyebrow: "Sob medida", title: "Projetos personalizados para seu terreno, sua necessidade e seu orçamento", text: "Soluções desenvolvidas considerando programa de necessidades, dimensões do terreno, estilo desejado, orçamento disponível, exigências técnicas e legislação aplicável." })}
    <section class="section"><div class="container split-content"><div>${SectionTitle({ eyebrow: "Projeto exclusivo", title: "As condições reais orientam a solução", text: "O ponto de partida é entender o uso, o terreno, as prioridades e as informações técnicas disponíveis." })}${CheckList(["Projeto arquitetônico personalizado", "Projeto estrutural", "Projeto elétrico de baixa tensão", "Projeto hidrossanitário e drenagem", "Urbanização e luminotécnico", "Compatibilização e pacote integrado conforme escopo"])}</div><div class="quote-panel"><span>“</span><p>Projetar sob medida é transformar condicionantes em critérios — e critérios em uma solução que pode ser executada com mais clareza.</p></div></div></section>
    <section class="section section-muted"><div class="container"><div class="feature-grid">${packages.map(([title, text], index) => `<article><span>0${index + 1}</span><h2>${title}</h2><p>${text}</p></article>`).join("")}</div></div></section>
    ${CtaSection({ title: "Comece pelas informações que você já tem.", text: "Envie cidade/UF, medidas ou documentos do terreno, referências e uma descrição da necessidade. A equipe indicará o próximo passo.", label: "Solicitar projeto personalizado", message: whatsappMessages.projetoPersonalizado, secondary: { label: "Ver projetos técnicos", href: "/projetos-tecnicos/" } })}
  `;
  return Layout({ title: "Projetos personalizados", description: "Projetos personalizados de arquitetura e engenharia conforme terreno, uso, orçamento e exigências técnicas.", path: "/projetos-personalizados/", content });
}

function slugifyLabel(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function serviceLanding({
  path,
  eyebrow,
  title,
  description,
  introTitle,
  introText,
  services,
  whatToSend,
  mensagemWhatsApp,
  contactService,
  cta,
  safeguards = "",
}) {
  const message = whatsappMessages[mensagemWhatsApp] || whatsappMessages.geral;
  const content = `
    ${PageHeader({ eyebrow, title, text: description })}
    <section class="section"><div class="container service-landing-grid"><div>${SectionTitle({ eyebrow: "Atuação técnica", title: introTitle, text: introText })}${safeguards ? `<p class="scope-note">${safeguards}</p>` : ""}</div><div class="service-list-panel">${services.map((service, index) => `<div id="${slugifyLabel(service)}"><span>${String(index + 1).padStart(2, "0")}</span><p>${service}</p></div>`).join("")}</div></div></section>
    <section class="section section-dark"><div class="container decision-strip"><div><span class="eyebrow">Quando contratar</span><h2>Antes que a dúvida técnica se transforme em retrabalho, custo ou conflito.</h2></div><p>A análise prévia ajuda a definir o serviço adequado, os dados necessários e os limites do escopo. Cada caso exige avaliação própria.</p></div></section>
    <section class="section section-muted"><div class="container service-preparation-grid">
      <div>${SectionTitle({ eyebrow: "Primeiro contato", title: "O que enviar para uma avaliação inicial", text: "Não é necessário ter toda a documentação pronta. Comece pelas informações disponíveis e a equipe orientará o que precisa ser complementado." })}${CheckList(whatToSend)}</div>
      <div class="engagement-panel">
        <span class="eyebrow">Definição do atendimento</span>
        <ol>
          <li><span>01</span><div><h3>Enquadramento</h3><p>Entendimento do objetivo, localização, estágio e informações existentes.</p></div></li>
          <li><span>02</span><div><h3>Escopo</h3><p>Definição dos entregáveis, premissas, limites e responsabilidades.</p></div></li>
          <li><span>03</span><div><h3>Proposta</h3><p>Formalização de prazo, condições comerciais e forma de acompanhamento.</p></div></li>
        </ol>
        <p class="privacy-reminder">No primeiro contato, evite enviar documentos com assinaturas, senhas ou dados pessoais desnecessários.</p>
      </div>
    </div></section>
    ${CtaSection({ title: "Apresente a situação para uma avaliação inicial.", text: "Envie uma descrição, cidade, objetivo e os materiais disponíveis. A RX retornará com as orientações para definir o atendimento.", label: cta, message, secondary: { label: "Organizar informações no formulário", href: `/contato/?servico=${encodeURIComponent(contactService)}` } })}
  `;
  return Layout({ title, description, path, content });
}

function portfolioPage() {
  const content = `
    ${PageHeader({ eyebrow: "Projetos reais · Portfólio 2026", title: "Da concepção ao detalhe. Conheça o trabalho da RX.", text: "Projetos desenvolvidos para clientes de diferentes setores: arquitetura, interiores, estruturas e instalações com documentação e coordenação em BIM." })}
    <section class="section"><div class="container"><div class="portfolio-intro"><div><span class="eyebrow">Experiência aplicada</span><h2>Diferentes usos. A mesma atenção a cada disciplina.</h2></div><p>Explore os modelos, as plantas e as perspectivas de cada trabalho. Em cada case, apresentamos o contexto, o escopo desenvolvido e as entregas da RX.</p></div>
    <div class="portfolio-filter-bar"><div class="portfolio-filters" role="group" aria-label="Filtrar portfólio por especialidade">${portfolioFilters.map((filter) => `<button type="button" data-portfolio-filter="${filter.value}" aria-pressed="${filter.value === ""}">${filter.label}</button>`).join("")}</div><p class="portfolio-count" data-portfolio-count aria-live="polite">${publishedPortfolio.length} projetos</p></div>
    <div class="portfolio-grid" id="portfolio-results">${publishedPortfolio.map((item) => PortfolioCard(item)).join("")}</div></div></section>
    ${BimWorkflow(bimProcess)}
    ${CtaSection({ title: "O próximo projeto pode ser o seu.", text: "Conte o uso da edificação, a cidade e a etapa em que você está. A RX organiza as disciplinas e os entregáveis necessários para a sua demanda.", label: "Conversar sobre meu projeto", message: whatsappMessages.projetoTecnico, secondary: { label: "Conhecer as especialidades", href: "/projetos-tecnicos/" } })}
  `;
  return Layout({ title: "Portfólio de projetos reais em BIM", description: "Conheça os projetos da RX para TRE-AC, Celesc, Museu do TRE-AC, Mercado Público de Domingos Mourão e Igreja Batista Maanaim.", path: "/portfolio/", content, image: publishedPortfolio[0]?.imagem });
}

export function portfolioDetailPage(item) {
  const message = `Olá, conheci o projeto ${item.titulo} no portfólio da RX e gostaria de conversar sobre uma demanda semelhante.`;
  const services = item.servicos.map((slug) => projectServices.find((service) => service.slug === slug));
  const related = publishedPortfolio.filter((other) => other.slug !== item.slug).slice(0, 3);
  const content = `
    ${PageHeader({ eyebrow: item.categoria, title: item.titulo, text: item.descricao, breadcrumbs: [{ label: "Portfólio", href: "/portfolio/" }] })}
    <section class="section case-section"><div class="container"><dl class="case-meta"><div><dt>Localização</dt><dd>${item.localGenerico}</dd></div><div><dt>Ano do projeto</dt><dd>${item.ano}</dd></div><div><dt>Escopo desenvolvido pela RX</dt><dd>${item.escopo}</dd></div></dl>
    <div class="case-layout"><div><div class="case-gallery">${item.galeria.map((photo, index) => `<figure${index === 0 ? ' class="case-gallery-cover"' : ""}><a href="${withBase(photo.src)}" target="_blank" rel="noopener" aria-label="Ampliar: ${escapeHtml(photo.legenda)}"><img src="${withBase(photo.src)}" alt="${escapeHtml(photo.alt)}" ${index ? 'loading="lazy"' : 'fetchpriority="high"'}></a><figcaption><span>${photo.tipo}</span>${photo.legenda}</figcaption></figure>`).join("")}</div><p class="case-gallery-note">Imagens de apresentação do projeto. Toque em uma imagem para ampliar.</p></div>
    <aside class="case-summary"><span class="eyebrow">Atuação da RX</span><h2>Disciplinas que se conectam.</h2><ul class="discipline-tags">${item.disciplinas.map((label) => `<li>${label}</li>`).join("")}</ul><p>Conheça os serviços relacionados a este case:</p><ul class="case-service-links">${services.map((service) => `<li><a href="${withBase(`/projetos-tecnicos/#${service.slug}`)}">${service.nome}${icon("arrow", "icon icon-sm")}</a></li>`).join("")}</ul><a class="button button-primary button-block" href="${whatsappUrl(message)}" target="_blank" rel="noopener">${icon("whatsapp")} Conversar sobre meu projeto</a></aside></div></div></section>
    <section class="section section-muted"><div class="container case-story"><div><span class="eyebrow">Contexto do projeto</span><h2>O desafio</h2><p>${item.desafio}</p><h2>A solução desenvolvida</h2><p>${item.solucao}</p></div><div class="case-deliverables"><span class="eyebrow">Escopo do case</span><h2>O que a RX desenvolveu</h2>${CheckList(item.entregaveis)}</div></div></section>
    <section class="section"><div class="container">${SectionTitle({ eyebrow: "Outros trabalhos", title: "Mais projetos do portfólio" })}<div class="portfolio-grid portfolio-grid-featured">${related.map((other) => PortfolioCard(other, "h3")).join("")}</div></div></section>
    ${CtaSection({ title: "Vamos desenvolver uma solução para sua demanda?", text: "Cada projeto começa pelas condições reais do cliente. Apresente o objetivo, o local e as disciplinas de que precisa.", label: "Solicitar proposta", message, secondary: { label: "Voltar ao portfólio", href: "/portfolio/" } })}
  `;
  return Layout({ title: item.titulo, description: item.descricao, path: `/portfolio/${item.slug}/`, image: item.imagem, content });
}

function aboutPage() {
  const content = `
    ${PageHeader({ eyebrow: "Institucional", title: "Sobre a RX Engenharia e Projetos", text: "Engenharia civil, sanitária e ambiental integrada à parceria técnica em Arquitetura para projetos, obras, documentação e consultoria." })}
    <section class="section"><div class="container about-statement"><span class="statement-index">RX</span><div><span class="eyebrow">Quem somos</span><h2>Soluções claras, documentadas e tecnicamente consistentes.</h2><p>A RX atua no desenvolvimento de projetos técnicos, engenharia consultiva, laudos, vistorias, fiscalização de obras, gerenciamento técnico, instalações e soluções sanitárias e ambientais. O trabalho atende clientes residenciais, comerciais, empresas e instituições, conforme a natureza e o escopo de cada demanda.</p></div></div></section>
    <section class="section section-dark"><div class="container"><div class="values-grid"><article><span>01</span><h2>Precisão</h2><p>Informação organizada para reduzir ambiguidades e apoiar a execução.</p></article><article><span>02</span><h2>Responsabilidade</h2><p>Escopo e linguagem técnica compatíveis com as condições reais do serviço.</p></article><article><span>03</span><h2>Clareza</h2><p>Comunicação direta sobre entregáveis, limites e próximos passos.</p></article></div></div></section>
    <section class="section"><div class="container">${SectionTitle({ eyebrow: "Equipe", title: "Atuação multidisciplinar", text: "Formações complementares e parceria técnica permitem estruturar soluções integradas." })}<div class="team-grid">${team.filter((member) => member.publicar).map(TeamCard).join("")}</div><p class="registry-note">Registros profissionais são informados nos documentos de contratação quando aplicáveis ao escopo.</p></div></section>
    ${CtaSection({ title: "Engenharia próxima, comunicação objetiva.", text: "Fale diretamente com a RX e apresente a sua necessidade.", label: "Entrar em contato", message: whatsappMessages.geral, secondary: { label: "Ver áreas de atuação", href: "/projetos-tecnicos/" } })}
  `;
  return Layout({ title: "Sobre a RX", description: "Conheça a RX Engenharia e Projetos e sua atuação em engenharia civil, sanitária, ambiental e parceria técnica em Arquitetura.", path: "/sobre/", content });
}

function contactPage() {
  const content = `
    ${PageHeader({ eyebrow: "Contato", title: "Vamos entender sua demanda", text: "Envie as informações iniciais. O formulário organiza a mensagem e abre o WhatsApp — nenhum dado fica armazenado no site." })}
    <section class="section"><div class="container contact-layout">
      <div class="contact-aside">
        <span class="eyebrow">Atendimento técnico</span><h2>Informações que ajudam na análise</h2>
        ${CheckList(["Tipo de serviço desejado", "Cidade/UF da obra ou imóvel", "Estágio atual da demanda", "Objetivo e prazo esperado", "Fotos ou documentos disponíveis"]) }
        <div class="direct-contact">${siteConfig.whatsappContacts.map((contact) => `<a href="${whatsappUrl(whatsappMessages.geral, contact.number)}" target="_blank" rel="noopener">${icon("whatsapp")}<span><small>${contact.label}</small>${contact.display}</span></a>`).join("")}<a href="mailto:${siteConfig.email}">${icon("mail")}<span><small>E-mail</small>${siteConfig.email}</span></a><p>${icon("pin")}<span><small>Base de atendimento</small>${siteConfig.city}</span></p></div>
      </div>
      <form class="contact-form" data-contact-form>
        <div><label for="canal">Canal de atendimento</label><select id="canal" name="canal" required>${siteConfig.whatsappContacts.map((contact) => `<option value="${contact.number}">${contact.label} · ${contact.display}</option>`).join("")}</select></div>
        <div class="form-grid"><div><label for="nome">Nome</label><input id="nome" name="nome" autocomplete="name" required></div><div><label for="whatsapp">WhatsApp</label><input id="whatsapp" name="whatsapp" inputmode="tel" autocomplete="tel" required></div></div>
        <div class="form-grid"><div><label for="email">E-mail</label><input id="email" name="email" type="email" autocomplete="email"></div><div><label for="cidade">Cidade/UF</label><input id="cidade" name="cidade" autocomplete="address-level2" required></div></div>
        <div><label for="servico">Tipo de serviço</label><select id="servico" name="servico" required><option value="">Selecione</option><option>Projeto técnico</option><option>Projeto pronto</option><option>Projeto personalizado</option><option>Laudo ou vistoria</option><option>Fiscalização ou gerenciamento de obra</option><option>Instalações</option><option>Engenharia sanitária e ambiental</option><option>Consultoria técnica</option><option>Outro</option></select></div>
        <div><label for="demanda">Descrição da demanda</label><textarea id="demanda" name="demanda" rows="6" required placeholder="Explique brevemente o que você precisa e em que etapa está."></textarea></div>
        <label class="consent"><input type="checkbox" required><span>Autorizo a abertura do WhatsApp com os dados preenchidos para iniciar o atendimento.</span></label>
        <button class="button button-primary" type="submit">${icon("whatsapp")} Enviar pelo WhatsApp</button>
        <p class="form-status" data-form-status aria-live="polite"></p>
      </form>
    </div></section>
    ${InstagramCTA()}
  `;
  return Layout({ title: "Contato", description: `Solicite atendimento em projetos, laudos, vistorias, fiscalização e engenharia em ${siteConfig.city}.`, path: "/contato/", content });
}

function commercialPolicyPage() {
  const content = `
    ${PageHeader({ eyebrow: "Transparência comercial", title: "Política comercial dos projetos prontos", text: "Condições gerais para compreender o uso, a adaptação, a entrega e os limites dos modelos comercializados pela RX." })}
    <section class="section"><div class="container policy-layout"><div class="policy-summary">${icon("warning")}<h2>Leia antes de contratar</h2><p>A ficha individual e a proposta comercial definem o que efetivamente está incluído em cada projeto.</p></div><ol class="policy-list">${readyProjectPolicies.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${item}</p></li>`).join("")}</ol></div></section>
    <section class="section section-muted"><div class="container">${PolicyNotice(readyProjectNotice)}</div></section>
    ${CtaSection({ title: "Ficou com alguma dúvida sobre um modelo?", text: "Envie o nome do projeto e pergunte sobre arquivos, adaptações e condições comerciais antes de contratar.", label: "Falar sobre projeto pronto", message: whatsappMessages.projetoPronto, secondary: { label: "Voltar ao catálogo", href: "/projetos-prontos/" } })}
  `;
  return Layout({ title: "Política comercial dos projetos prontos", description: "Condições comerciais, limitações, adaptações, entrega e responsabilidades aplicáveis aos projetos prontos da RX.", path: "/politica-comercial/", content });
}

export function projectDetailPage(project) {
  const message = project.mensagemWhatsApp || whatsappMessages.projetoPronto.replace("[NOME DO PROJETO]", project.nome);
  const related = publishedProjects.filter((item) => item.slug !== project.slug && item.categoria === project.categoria).slice(0, 3);
  const content = `
    ${PageHeader({ eyebrow: project.categoria, title: project.nome, text: project.descricaoCurta, breadcrumbs: [{ label: "Projetos prontos", href: "/projetos-prontos/" }] })}
    <section class="section"><div class="container project-detail-grid"><div>${Gallery(project.imagens, project.nome, project.legendasImagens)}</div><aside class="project-buybox"><span class="card-kicker">${project.codigo || "Projeto RX"}</span><h2>Ficha técnica</h2>${TechnicalSheet(project)}<span class="project-price-label">Investimento</span><p class="project-price">${project.preco ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(project.preco) : "Valor sob consulta"}</p><a class="button button-primary button-block" href="${whatsappUrl(message)}" target="_blank" rel="noopener">${icon("whatsapp")} Consultar este projeto</a></aside></div></section>
    <section class="section section-muted"><div class="container project-description"><div><span class="eyebrow">Sobre o modelo</span><h2>Descrição</h2><p>${project.descricaoCompleta}</p><h3 class="project-subtitle">Ambientes previstos</h3>${CheckList(project.ambientes)}</div><div class="included-grid"><div><h2>O que está incluso</h2>${CheckList(project.itensInclusos)}</div><div><h2>O que não está incluso</h2>${CheckList(project.itensNaoInclusos)}</div></div></div></section>
    <section class="section"><div class="container project-notices"><aside class="model-note"><span class="eyebrow">Condições do modelo</span><h2>Verificação antes de contratar</h2><p>${project.observacoesTecnicas}</p></aside>${PolicyNotice(readyProjectNotice)}<div class="policy-link-row"><a class="text-link" href="${withBase("/politica-comercial/")}">Ler política comercial ${icon("arrow", "icon icon-sm")}</a></div></div></section>
    ${related.length ? `<section class="section section-muted"><div class="container">${SectionTitle({ eyebrow: "Veja também", title: "Projetos relacionados" })}<div class="projects-grid">${related.map(ProjectCard).join("")}</div></div></section>` : ""}
    ${CtaSection({ title: "Precisa adaptar este modelo?", text: "Envie cidade, terreno e alterações desejadas para análise técnica.", label: "Solicitar avaliação", message })}
  `;
  return Layout({ title: project.nome, description: project.descricaoCurta, path: `/projetos-prontos/${project.slug}/`, content, image: project.imagens[0] });
}

export const pages = [
  { path: "/", render: homePage },
  { path: "/projetos-tecnicos/", render: technicalProjectsPage },
  { path: "/projetos-prontos/", render: readyProjectsPage },
  { path: "/projetos-personalizados/", render: personalizedProjectsPage },
  ...servicePages.map((servicePage) => ({
    path: servicePage.path,
    render: () => serviceLanding(servicePage),
  })),
  { path: "/portfolio/", render: portfolioPage },
  { path: "/sobre/", render: aboutPage },
  { path: "/contato/", render: contactPage },
  { path: "/politica-comercial/", render: commercialPolicyPage },
];
