export const siteConfig = {
  name: "RX Engenharia e Projetos",
  shortName: "RX Engenharia",
  description:
    "Engenharia técnica, projetos e consultoria para obras, imóveis e empreendimentos.",
  language: "pt-BR",
  locale: "pt_BR",
  siteUrl: "https://aristotelesximenes.github.io",
  basePath: "/rx-engenharia-site",
  whatsappNumber: "5586994086451",
  phoneDisplay: "(86) 99408-6451",
  email: "rxprojetoseng@gmail.com",
  city: "Teresina/PI",
  instagram: {
    handle: "@rxengproj",
    url: "https://www.instagram.com/rxengproj/",
  },
  logo: "/assets/logo-rx.png",
  socialImage: "/assets/logo-rx.png",
  serviceArea:
    "Atendimento residencial, comercial, urbano e institucional mediante análise da demanda.",
};

export function withBase(path = "/") {
  const base = siteConfig.basePath.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}` || "/";
}

export function absoluteUrl(path = "/") {
  if (!siteConfig.siteUrl) return "";
  return `${siteConfig.siteUrl.replace(/\/$/, "")}${withBase(path)}`;
}
