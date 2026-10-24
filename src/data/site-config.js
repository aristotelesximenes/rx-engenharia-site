export const whatsappContacts = [
  { id: "atendimento-1", label: "WhatsApp 1", number: "5586988171719", display: "(86) 98817-1719" },
  { id: "atendimento-2", label: "WhatsApp 2", number: "5586995136645", display: "(86) 99513-6645" },
];

// Registro, DNS, HTTPS e publicação conferidos em 24/10/2026.
export const domainConfig = { name: "rxprojetosbim.eng.br", registered: true, active: true, hosting: "Locaweb" };
// Dois builds independentes preservam a prévia do GitHub durante a migração.
export const deploymentTarget = process.env.RX_DEPLOY_TARGET === "locaweb" ? "locaweb" : "github";
export const outputDirectory = deploymentTarget === "locaweb" ? "dist-locaweb" : "dist";
const customDomainBuild = deploymentTarget === "locaweb";

export const siteConfig = {
  name: "RX Engenharia e Projetos",
  shortName: "RX Engenharia",
  description:
    "Engenharia técnica, projetos e consultoria para obras, imóveis e empreendimentos.",
  language: "pt-BR",
  locale: "pt_BR",
  siteUrl: customDomainBuild ? `https://${domainConfig.name}` : "https://aristotelesximenes.github.io",
  basePath: customDomainBuild ? "" : "/rx-engenharia-site",
  whatsappContacts,
  whatsappNumber: whatsappContacts[0].number,
  phoneDisplay: whatsappContacts[0].display,
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
