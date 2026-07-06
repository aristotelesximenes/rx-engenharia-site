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
