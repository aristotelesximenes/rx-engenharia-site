import { absoluteUrl } from "../../src/data/site-config.js";

const services = {
  "1": "Projetos de arquitetura, interiores, estrutura e instalações",
  "2": "Laudos, vistorias e consultoria técnica",
  "3": "Fiscalização e gerenciamento de obras",
  "4": "Engenharia sanitária, ambiental e infraestrutura",
};

export const menu = [
  "Olá! Sou o assistente automático da RX Engenharia e Projetos.",
  "Como podemos ajudar? Responda com o número:", "",
  "1 · Projetos e BIM", "2 · Laudos, vistorias e consultoria",
  "3 · Fiscalização e gerenciamento de obras", "4 · Sanitária, ambiental e infraestrutura",
  "5 · Ver portfólio e projetos prontos", "0 · Atendimento da equipe", "9 · Encerrar atendimento automático",
  "", "Você pode escrever MENU para voltar ao início. Não envie senhas, documentos pessoais ou assinaturas.",
].join("\n");

export function nextReply(state = {}, text = "", kind = "text") {
  const command = text.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (["9", "parar", "sair", "cancelar"].includes(command)) {
    return { state: { mode: "stopped" }, text: "Atendimento automático encerrado. Para iniciar novamente, escreva MENU." };
  }
  if (["menu", "inicio"].includes(command)) return { state: { mode: "menu" }, text: menu };
  if (state.mode === "stopped" || state.mode === "human") return { state, text: null };
  if (["0", "atendente", "humano", "falar com a equipe"].includes(command)) {
    return { state: { mode: "human" }, lead: { service: "Atendimento da equipe", details: "Cliente solicitou atendimento da equipe." }, text: "Sua solicitação ficou registrada para a equipe da RX. O atendimento automático está pausado nesta conversa. Para voltar ao menu, escreva MENU." };
  }
  if (kind !== "text") return { state, text: "Neste atendimento automático, descreva a necessidade em texto. Para solicitar atendimento da equipe, digite 0." };
  if (command === "5") {
    return { state: { mode: "menu" }, text: `Conheça nosso trabalho:\n\nPortfólio: ${absoluteUrl("/portfolio/")}\nProjetos prontos: ${absoluteUrl("/projetos-prontos/")}\n\nPara solicitar uma proposta, digite 1. Para falar com a equipe, digite 0.` };
  }
  if (services[command]) {
    return { state: { mode: "collect", service: services[command] }, text: `Vamos organizar seu pedido de ${services[command].toLowerCase()}.\n\nEnvie em uma mensagem:\n• Seu nome\n• Cidade/UF\n• Tipo de imóvel ou empreendimento\n• O que você precisa e o estágio atual\n• Prazo desejado, se houver\n\nUsaremos essas informações para tratar sua solicitação de atendimento. Ao responder, você concorda com esse uso. Evite dados pessoais desnecessários. Para falar com a equipe, digite 0; para cancelar, digite 9.` };
  }
  if (state.mode === "collect" && text.trim().length >= 10) {
    return { state: { mode: "human" }, lead: { service: state.service, details: text.trim().slice(0, 4096) }, text: "Obrigado! Seu pedido foi registrado para análise da equipe da RX. A proposta, os valores e os prazos dependem da avaliação do escopo. O atendimento automático ficará pausado nesta conversa. Para reiniciar, escreva MENU." };
  }
  if (state.mode === "collect") return { state, text: "Conte um pouco mais sobre a cidade, o imóvel e o serviço desejado. Se preferir atendimento da equipe, digite 0." };
  return { state: { mode: "menu" }, text: menu };
}
