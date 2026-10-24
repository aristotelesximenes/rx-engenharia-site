export const navigation = [
  { label: "Início", href: "/" },
  {
    label: "Projetos",
    href: "/projetos-tecnicos/",
    children: [
      { label: "Projetos técnicos", href: "/projetos-tecnicos/" },
      { label: "Arquitetônicos", href: "/projetos-tecnicos/#arquitetonico" },
      { label: "Interiores e visualização 3D", href: "/projetos-tecnicos/#arquitetura-espacos" },
      { label: "Estruturais", href: "/projetos-tecnicos/#estrutural" },
      { label: "Elétricos", href: "/projetos-tecnicos/#eletrico" },
      { label: "Hidrossanitários", href: "/projetos-tecnicos/#hidrossanitario" },
      { label: "Drenagem", href: "/projetos-tecnicos/#drenagem" },
      { label: "Urbanização", href: "/projetos-tecnicos/#urbanizacao" },
      { label: "Luminotécnicos", href: "/projetos-tecnicos/#luminotecnico" },
      { label: "BIM e planejamento", href: "/projetos-tecnicos/#bim-planejamento" },
      { label: "Personalizados", href: "/projetos-personalizados/" },
    ],
  },
  {
    label: "Serviços técnicos",
    href: "/engenharia-consultiva/",
    children: [
      { label: "Engenharia consultiva", href: "/engenharia-consultiva/" },
      { label: "Laudos e vistorias", href: "/laudos-e-vistorias/" },
      {
        label: "Fiscalização e gerenciamento",
        href: "/fiscalizacao-e-gerenciamento/",
      },
      {
        label: "Sanitária e ambiental",
        href: "/engenharia-sanitaria-e-ambiental/",
      },
      { label: "Instalações", href: "/instalacoes/" },
      {
        label: "Regularização técnica",
        href: "/engenharia-consultiva/#regularizacao-tecnica",
      },
      {
        label: "Pareceres técnicos",
        href: "/engenharia-consultiva/#pareceres-e-relatorios-tecnicos",
      },
    ],
  },
  { label: "Projetos prontos", href: "/projetos-prontos/" },
  { label: "Portfólio", href: "/portfolio/" },
  { label: "Sobre", href: "/sobre/" },
  { label: "Contato", href: "/contato/" },
];
