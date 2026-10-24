# Auditoria inicial

Data da auditoria: 29/06/2026.

Revisão técnica e visual: 03/07/2026.

## Diagnóstico técnico

- **Stack encontrado:** não havia aplicação web, manifesto de dependências ou estrutura de site.
- **Estrutura do acervo:** o diretório principal reúne documentos empresariais, contratos, propostas, ARTs, laudos, projetos CAD/BIM, planilhas e fotografias de vistorias.
- **Identidade visual:** logotipo RX, base preta e branca, laranja de destaque, tipografia geométrica em caixa alta, linhas finas e grafismos ligados a desenho técnico.
- **Mídias publicáveis selecionadas:** logotipo institucional e uma arte institucional genérica de construção. Nenhuma prancha, relatório, foto de vistoria ou arquivo de cliente foi copiado para o site.
- **Contato confirmado:** e-mail institucional, Instagram e atendimento em Teresina/PI. O WhatsApp fica centralizado em `src/data/site-config.js`.
- **Equipe:** foram mantidos apenas nomes, funções e formações informados no briefing. Números de registro profissional não foram publicados.

## Lacunas de conteúdo

- domínio público final;
- horário de atendimento;
- nome e apresentação da arquiteta parceira;
- definição de preço, arquivos finais entregáveis e condições comerciais dos projetos prontos;
- itens de portfólio com autorização explícita de publicação;
- definição pública da área geográfica de atendimento além de Teresina/PI.

## Riscos e decisões

O acervo contém dados pessoais, assinaturas, endereços, números de documentos, arquivos técnicos editáveis e informações contratuais. Por isso:

1. o site foi isolado em `site-rx/`;
2. a pasta pública contém somente assets selecionados;
3. projetos e portfólio usam status editorial;
4. registros em `rascunho` não são gerados em páginas públicas;
5. não há links para documentos do acervo;
6. não há backend, checkout ou entrega pública de arquivos.

## Arquitetura implementada

Gerador estático em Node.js, sem dependências externas, com dados em `src/data/`, componentes em `src/components/`, páginas em `src/pages/`, assets em `public/` e saída de deploy em `dist/`.

## Verificação complementar

- build e verificação estrutural executados com sucesso;
- 14 páginas HTML geradas, incluindo a página 404;
- navegação e layout revisados em desktop e celular;
- correção de largura intrínseca do hero em telas pequenas;
- botão do menu móvel identificado para leitores de tela e fechamento por `Esc`;
- filtros do catálogo ocultados enquanto não houver projetos publicados;
- publicação de portfólio condicionada também a `anonimizado: true` e validada no build.

## Evolução de desenvolvimento — 04/07/2026

- conteúdos das páginas de serviços centralizados em `src/data/services.js`;
- páginas de consultoria, laudos, fiscalização, instalações e engenharia sanitária/ambiental enriquecidas com preparação do primeiro contato;
- fluxo de enquadramento, escopo e proposta apresentado de forma reutilizável;
- lembrete de privacidade incluído antes do envio de documentos;
- links de regularização e pareceres direcionados para os respectivos trechos da página consultiva.
- públicos da home separados em residencial, comercial/empresarial, urbano/empreendimentos e institucional;
- textos de público, processo e diferenciais centralizados em `src/data/home.js`;
- catálogo preparado com filtros dinâmicos de categoria, área, quartos, pavimentos e estilo;
- validação de códigos, slugs, status, ficha técnica e diretórios permitidos reforçada no build;
- formulário de contato recebe o serviço pré-selecionado pelas páginas técnicas;
- dados estruturados `ProfessionalService` gerados automaticamente a partir de `siteConfig`;
- saída `dist/` sincronizada com a versão validada.

## Evolução de desenvolvimento — 05/07/2026

- catálogo de casas populares auditado visualmente a partir do PDF e dos renders da pasta de origem;
- cinco modelos publicados: 50 m², 60 m², dois modelos de 70 m² e um modelo de 85 m²;
- fachadas, plantas humanizadas e vistas internas organizadas por modelo em `public/assets/projetos/`;
- páginas comerciais individuais geradas com ficha técnica, ambientes, galeria legendada e consulta via WhatsApp;
- campos não comprovados, como preço, suítes, vagas e terreno mínimo, mantidos explicitamente sob consulta;
- vitrine incluída na página inicial e catálogo completo mantido com filtros de categoria, metragem, quartos, pavimentos e estilo;
- validação ampliada para exigir correspondência entre imagens e legendas, ambientes e diretórios públicos permitidos;
- 19 páginas HTML verificadas, sem documentos técnicos sensíveis na saída;
- catálogo e página individual revisados visualmente em desktop e celular, sem rolagem horizontal.

## Evolução de desenvolvimento — 24/10/2026

- dois portfólios de apresentação fornecidos pelo usuário revisados: a versão original de 25 páginas e a versão 2026 v2 de 30 páginas;
- cinco cases reais cadastrados, com escopo atribuído à RX conforme os documentos: interiores TRE-AC, Celesc, Museu TRE-AC, Mercado Público de Domingos Mourão e Igreja Batista Maanaim;
- 25 imagens extraídas e selecionadas para apresentação comercial, em WebP, com cerca de 1,9 MB no total;
- páginas individuais de cases incluídas no gerador e no sitemap, com validação das galerias e dos serviços relacionados;
- página de portfólio com filtros de arquitetura/interiores, estruturas, instalações e compatibilização BIM;
- especialidades organizadas em quatro grupos: arquitetura e espaços; estruturas e instalações; BIM e planejamento; infraestrutura e projetos sob medida;
- serviços de interiores, modelagem/documentação BIM, visualização 3D e quantitativos/planejamento/orçamento acrescentados a partir do escopo documentado;
- referências a cases reais incluídas na home e nas especialidades correspondentes;
- nomes de instituições mantidos conforme autorização do usuário; registros profissionais, endereços precisos e documentos integrais não foram incorporados;
- descrições preservam a distinção entre projeto desenvolvido e obra executada.
- geração de 24 páginas HTML validada; cinco filtros do portfólio, cinco galerias e 13 especialidades testados em navegador, nas larguras de 1440 e 390 pixels, sem erros de execução ou rolagem lateral.

## Ajustes de identidade, contato e atendimento — 24/10/2026

- imagem de campanha do Dia do Trabalhador removida dos assets e substituída na home por modelo BIM real do portfólio;
- contatos atualizados para (86) 98817-1719 e (86) 99513-6645, com ambos no rodapé/contato e seleção de canal no formulário;
- dados estruturados e verificação de links atualizados para reconhecer somente os dois canais cadastrados;
- domínio futuro `rxprojetosbim.eng.br` preparado em configuração central, sem ativação antes do registro e do DNS;
- assistente de WhatsApp implementado em serviço separado, com dois canais, menu de serviços, coleta de solicitação e pausa para equipe;
- 12 testes locais do assistente aprovados, incluindo verificação do webhook, deduplicação, separação entre números e falha de envio;
- ativação real do assistente pendente: ambos os números usam Business, mas o responsável informou ainda não ter acesso administrativo à conta empresarial da Meta; hospedagem e credenciais também precisam ser configuradas.

## Renovação visual e preparação Locaweb — 24/10/2026

- página inicial recomposta em linguagem editorial: projetos reais na primeira tela, seleção manual de arquitetura/interiores/estruturas, especialidades, processo BIM, catálogo e diretores;
- tipografia Manrope variável hospedada localmente, com licença SIL OFL, superfícies claras, cartões e navegação renovados também nas páginas internas;
- imagens e escopos reais preservados, sem reintroduzir campanha do Dia do Trabalhador, preços não comprovados ou identificação dos diretores como sócios;
- vitrine manual e filtros do portfólio conferidos no navegador: contagens 5, 3, 1, 2 e 2; home revista visualmente em computador e celular;
- builds independentes: `dist/` para a prévia GitHub e `dist-locaweb/` com URLs na raiz do domínio, sem dependências nem dados do robô;
- registro do domínio confirmado pelo usuário; hospedagem GO Linux conferida como Ativo no painel;
- DNS público conferido: domínio raiz apontando ao mesmo IP exibido na hospedagem e `www` apontando ao domínio raiz; nenhum registro DNS foi alterado;
- HTTPS responde, mas a raiz ainda retorna 403 antes da publicação dos arquivos; isso não foi tratado como site publicado;
- autenticação WebFTP concluída; após instabilidade do gerenciador, o responsável autorizou o envio direto por FTP, ciente da ausência de criptografia desse serviço;
- 74 arquivos publicados na pasta pública; 73 arquivos comparados byte a byte via HTTPS, sem divergências, e `.htaccess` protegido por 403;
- raiz, portfólio, contato e `www` respondendo por HTTPS; caminhos privados verificados como não acessíveis e página inexistente com 404;
- 25 arquivos comerciais temporários da etapa WebFTP movidos para pasta privada em `tmp/`, sem exclusão de dados ou alteração de arquivos preexistentes do usuário;
- 15 imagens do catálogo convertidas para WebP: cerca de 15,4 MB reduzidos a 2,1 MB, preservando os originais; o build evita publicar versões duplicadas;
- vitrine manual, menu móvel e ausência de rolagem lateral conferidos em produção; interface revisada em 1440, 390 e 320 pixels;
- credenciais não salvas no código, no repositório ou no pacote. Robô de WhatsApp permanece separado e não foi ativado por esta publicação.
- versões de CSS e JavaScript calculadas pelo conteúdo para invalidar cache antigo após novas publicações.

## E-mail profissional de atendimento — 24/10/2026

- domínio adicionado ao serviço de e-mail da Locaweb, com configuração automática dos registros; MX e SPF públicos conferidos;
- caixa `atendimento@rxprojetosbim.eng.br` criada pelo responsável e confirmada na listagem de caixas postais, com 3 GB;
- contato público atualizado na configuração central e publicado no contato, rodapé e dados estruturados das 24 páginas;
- verificação automatizada dos links de e-mail incluída nos dois builds; 73 arquivos públicos comparados por HTTPS sem divergências;
- não foi realizado teste de envio/recebimento dentro da caixa postal;
- plano atual permite uma caixa. Fábio e Aristóteles permanecem pendentes de capacidade e definição de senhas pelo responsável;
- painel apresentou pacote de 10 caixas adicionais por R$ 372,00/ano; nenhuma contratação foi realizada e nenhum apelido foi criado como substituto das caixas independentes;
- senhas de e-mail não foram solicitadas pelo chat nem armazenadas no projeto.
