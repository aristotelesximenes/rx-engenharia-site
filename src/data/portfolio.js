/**
 * Um item só deve ser marcado como "publicado" depois de confirmar autorização,
 * anonimização, imagem segura e dados descritivos.
 *
 * Campos por item:
 * slug, titulo, categoria, descricao, imagem, alt, localGenerico, ano,
 * escopo, status e anonimizado.
 */
export const portfolio = [];

export const publishedPortfolio = portfolio.filter(
  (item) =>
    item.status === "publicado" && item.imagem && item.anonimizado === true,
);

export const portfolioCategories = [
  "Projetos residenciais",
  "Projetos comerciais",
  "Renders 3D",
  "Projetos técnicos",
  "Urbanização",
  "Drenagem",
  "Instalações",
  "Laudos e vistorias",
  "Fiscalização de obras",
  "Engenharia sanitária e ambiental",
];
