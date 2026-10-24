export const whatsappMessages = {
  geral:
    "Olá, vim pelo site da RX Engenharia e Projetos e gostaria de atendimento.",
  projetoTecnico:
    "Olá, preciso de um projeto técnico. Gostaria de informar o tipo de projeto, cidade e características da demanda.",
  interiores: "Olá, tenho interesse em um projeto de interiores. Gostaria de apresentar os ambientes e as necessidades de uso.",
  bim: "Olá, preciso de modelagem e documentação BIM. Gostaria de explicar as disciplinas e as informações disponíveis.",
  visualizacao: "Olá, preciso de visualização 3D para um projeto. Gostaria de conversar sobre plantas humanizadas e perspectivas.",
  planejamento: "Olá, preciso de quantitativos, planejamento ou orçamento de obra. Gostaria de apresentar a demanda.",
  projetoPronto:
    "Olá, tenho interesse no projeto [NOME DO PROJETO] disponível no site da RX. Gostaria de saber valores, arquivos inclusos e possibilidade de adaptação.",
  projetoPersonalizado:
    "Olá, tenho interesse em um projeto personalizado. Meu terreno fica em [cidade/UF] e gostaria de conversar sobre minha necessidade.",
  arquitetonico:
    "Olá, tenho interesse em um projeto arquitetônico. Gostaria de conversar sobre minha necessidade e o terreno.",
  estrutural:
    "Olá, preciso de um projeto estrutural. Posso enviar informações do imóvel/obra para avaliação?",
  eletrico:
    "Olá, preciso de um projeto elétrico de baixa tensão. Gostaria de explicar a demanda.",
  luminotecnico:
    "Olá, preciso de um projeto luminotécnico. Gostaria de explicar a demanda e o tipo de ambiente.",
  hidrossanitario:
    "Olá, preciso de projeto hidrossanitário ou drenagem. Posso enviar as informações da obra?",
  urbanizacao:
    "Olá, preciso de projeto de urbanização. Gostaria de apresentar a área e o escopo pretendido.",
  instalacoes:
    "Olá, preciso de apoio técnico para instalações elétricas, hidrossanitárias, luminotécnicas ou drenagem. Gostaria de explicar a demanda.",
  ambiental:
    "Olá, preciso de apoio técnico em engenharia sanitária ou ambiental. Gostaria de explicar a demanda para avaliação.",
  laudo:
    "Olá, preciso de um laudo ou vistoria técnica. Posso enviar fotos e explicar a situação?",
  fiscalizacao:
    "Olá, preciso de fiscalização, acompanhamento ou gerenciamento técnico de obra. Gostaria de explicar o caso.",
  consultoria:
    "Olá, preciso de uma consultoria técnica em engenharia. Gostaria de explicar a demanda para avaliação.",
};

export function projectReadyMessage(projectName) {
  return whatsappMessages.projetoPronto.replace(
    "[NOME DO PROJETO]",
    projectName,
  );
}
