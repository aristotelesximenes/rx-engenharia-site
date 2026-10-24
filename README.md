# Site RX Engenharia e Projetos

Site institucional e comercial estático e responsivo. O build usa apenas Node.js e gera arquivos prontos para Cloudflare Pages, Vercel ou GitHub Pages. O assistente opcional de WhatsApp é um serviço separado, em `automation/whatsapp/`, e não é hospedado pelo GitHub Pages.

## Rodar localmente

Requisito: Node.js 20 ou superior.

```bash
npm run dev
```

Abra `http://127.0.0.1:4173`.

Outros comandos:

```bash
npm run build   # gera dist/
npm run check   # build + valida páginas, links e ausência de arquivos sensíveis
```

Não é necessário executar `npm install`: o projeto não usa dependências externas.

## Estrutura

```text
site-rx/
├── public/assets/          # somente imagens aprovadas para publicação
├── scripts/                # build, servidor local e verificações
├── src/
│   ├── client/             # interações no navegador
│   ├── components/         # Header, Footer, cards, FAQ, CTA, galeria etc.
│   ├── data/               # conteúdo centralizado
│   ├── lib/                # URLs, HTML, ícones e WhatsApp
│   ├── pages/              # páginas e template de projeto
│   └── styles/             # identidade visual responsiva
└── dist/                   # saída gerada; não editar manualmente
```

Os textos de público, processo e diferenciais da página inicial ficam em `src/data/home.js`. Assim, a home pode evoluir sem misturar conteúdo comercial com o template HTML.

## Configuração principal

Edite `src/data/site-config.js` para alterar:

- nome da empresa;
- lista `whatsappContacts` com os dois canais de WhatsApp (número e apresentação);
- e-mail;
- cidade;
- Instagram;
- domínio final e subdiretório de deploy.

Quando o domínio estiver definido, preencha `siteUrl`, por exemplo:

```js
siteUrl: "https://www.seudominio.com.br",
```

Para GitHub Pages em um repositório de projeto, use também:

```js
basePath: "/nome-do-repositorio",
```

Em domínio próprio, Cloudflare Pages ou Vercel, mantenha `basePath: ""`.

## WhatsApp

As mensagens ficam em `src/data/whatsapp-messages.js`. A lista dos dois canais é centralizada em `whatsappContacts`, exportada por `src/data/site-config.js`. Os botões principais usam o primeiro canal; o rodapé mostra ambos e o formulário permite escolher a linha. O verificador rejeita números que não estejam cadastrados.

O robô dos dois canais está programado e tem testes locais, mas aguarda conexão à Meta e hospedagem para ativação. Consulte `automation/whatsapp/README.md`. Credenciais e banco de atendimento nunca entram na área pública do site.

O domínio planejado é `rxprojetosbim.eng.br`, mantido com `domainConfig.active: false` até a compra e a configuração do DNS. A sequência de ativação está em `docs/DOMINIO.md`.

Para criar uma nova mensagem:

1. adicione uma chave ao objeto `whatsappMessages`;
2. informe essa chave em `mensagemWhatsApp` no serviço;
3. execute `npm run check`.

## Serviços

Edite `src/data/services.js`.

- `projectServices`: cards detalhados da página de projetos técnicos;
- `projectServiceGroups`: quatro grupos comerciais de especialidades, com os slugs dos serviços na ordem de apresentação;
- `bimProcess`: etapas do trabalho em BIM apresentadas no portfólio e na página de projetos;
- `serviceGroups`: frentes exibidas na home;
- `servicePages`: conteúdo, escopo, preparação do primeiro contato e SEO das páginas de serviços técnicos;
- listas finais: conteúdo das páginas de consultoria, laudos, fiscalização, ambiental e instalações.

Cada projeto técnico usa os campos `slug`, `nome`, `categoria`, descrições, `entregaveis`, `quandoContratar`, `cta`, `mensagemWhatsApp` e `icon`.

## Projetos prontos

Edite `src/data/projects.js`. O catálogo inicial possui cinco modelos residenciais publicados: 50 m², 60 m², 70 m² Modelo 01, 70 m² Modelo 02 e 85 m².

Cada registro reúne código comercial, descrições, área, quartos, banheiros, pavimentos, estilo, imagens, legendas, ambientes previstos, itens inclusos, itens não inclusos e observações técnicas. As imagens do catálogo ficam separadas por modelo em `public/assets/projetos/`.

Regras editoriais:

1. mantenha `status: "rascunho"` enquanto faltar qualquer informação;
2. use apenas imagens comerciais autorizadas dentro de `public/assets/projetos/`;
3. confirme metragem, ambientes, itens inclusos, preço e condições — não estime; use `null` quando suítes, vagas ou preço ainda dependerem de consulta;
4. troque para `status: "publicado"` somente após a revisão;
5. execute `npm run check`.

O build bloqueia automaticamente projetos publicados sem ficha técnica, descrições, ambientes, listas de itens, observações, legendas ou imagens válidas. Cada imagem precisa ter uma legenda correspondente. `slug` e `codigo` também precisam ser únicos. Imagens comerciais devem ficar em `public/assets/projetos/`.

Projetos publicados entram no catálogo e geram automaticamente:

```text
/projetos-prontos/[slug]/
```

Nunca coloque DWG, DOCX, PDF técnico integral, planilhas, memoriais ou pacotes finais dentro de `public/`.

## Portfólio

Edite `src/data/portfolio.js` e use a estrutura indicada no comentário do arquivo.

O portfólio reúne cinco cases reais fornecidos pelo responsável pela RX: TRE-AC (interiores do 4º andar), Celesc, Museu do TRE-AC, Mercado Público de Domingos Mourão e Igreja Batista Maanaim. Cada case gera uma página em `/portfolio/[slug]/`, com galeria, contexto, solução, entregáveis e links para as especialidades relacionadas.

Além de título, categoria, descrição, ano e localização, mantenha `disciplinas`, `filtros`, `servicos`, `desafio`, `solucao`, `entregaveis` e `galeria`. Cada entrada da galeria usa `src`, `alt`, `legenda` e `tipo`. Os valores de `servicos` precisam corresponder a slugs de `projectServices`; os valores de `filtros` correspondem às opções de `portfolioFilters`. Use `destaque: true` para apresentar o case na home.

Antes de publicar, confirme:

- autorização de uso da imagem;
- remoção de dados pessoais, endereços precisos, placas, coordenadas e números de documentos; nomes de instituições e projetos podem ser usados quando autorizados;
- descrição sem cliente identificável, quando necessário;
- `anonimizado: true` quando o item tiver sido tratado;
- imagem segura dentro de `public/assets/portfolio/`.

Itens em rascunho, sem imagem ou sem `anonimizado: true` não aparecem no site. O build também interrompe a publicação se um item marcado como `publicado` estiver sem campos obrigatórios ou sem anonimização confirmada.

As imagens autorizadas do portfólio devem ficar exclusivamente em `public/assets/portfolio/`.

As 25 imagens iniciais são versões WebP selecionadas dos PDFs de apresentação, somando aproximadamente 1,9 MB. Os PDFs originais e os arquivos executivos não fazem parte do repositório público. Descreva as representações como modelos, plantas ou perspectivas e não infira execução ou conclusão da obra a partir delas.

## Equipe

Edite `src/data/team.js`. Use `publicar: false` para ocultar um registro. A arquiteta parceira deve continuar com `tipoVinculo: "parceria técnica"` até existir informação formal diferente.

Registros profissionais só devem ser incluídos após confirmação e decisão expressa de publicação.

## FAQ, navegação e política

- FAQ: `src/data/faq.js`;
- menu e submenus: `src/data/navigation.js`;
- política dos projetos prontos: `src/data/policies.js`.

## SEO

Cada página em `src/pages/pages.js` informa `title`, `description` e `path`. O componente `Layout` gera metadados básicos, Open Graph e canonical quando `siteUrl` estiver configurado.

O mesmo componente também gera dados estruturados `ProfessionalService` a partir de `siteConfig`. Nome, telefone, e-mail, área de atendimento e Instagram não devem ser repetidos manualmente nas páginas.

Ao criar uma página:

1. use uma URL curta e descritiva;
2. escreva um título específico;
3. mantenha a descrição objetiva;
4. inclua apenas um `h1`;
5. adicione a rota ao array `pages`;
6. execute `npm run check`.

## Formulário

O formulário de contato não armazena dados e não depende de backend. Ao enviar, ele formata a mensagem e abre o WhatsApp. Essa limitação é informada ao usuário na própria página.

As páginas técnicas podem abrir o formulário com o serviço pré-selecionado usando `?servico=Nome%20do%20serviço`. O valor precisa coincidir exatamente com uma opção do campo `servico`; valores desconhecidos são ignorados.

## Deploy

### GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` gera e publica `dist/` ao receber alterações na branch `main`. Antes do primeiro deploy:

1. configure `basePath`, se necessário;
2. em **Settings → Pages**, selecione **GitHub Actions**;
3. faça push para `main`.

### Cloudflare Pages ou Vercel

- comando de build: `npm run build`;
- diretório de saída: `dist`;
- versão do Node: 20 ou superior.

## Segurança do acervo

O site foi intencionalmente isolado do diretório geral de engenharia. Não copie automaticamente pastas, documentos ou fotos do acervo para `public/`. Em caso de dúvida sobre autorização ou sensibilidade, mantenha o item fora do site.
