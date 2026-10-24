# Domínio planejado: rxprojetosbim.eng.br

Status em 24/10/2026: o responsável informou que comprará o domínio. A publicação atual continua no GitHub Pages e nenhum redirecionamento foi ativado para o domínio ainda não registrado.

`src/data/site-config.js` centraliza `domainConfig.name` e `domainConfig.active`. Com `active: false`, são mantidos os links do GitHub Pages. Com `active: true`, o gerador passa a usar `https://rxprojetosbim.eng.br` e remove o subdiretório `/rx-engenharia-site` dos links, metadados e sitemap.

## Após a compra

1. Confirmar registro e acesso administrativo ao DNS.
2. Verificar a propriedade do domínio no GitHub com o registro TXT fornecido pelo próprio GitHub. Não inventar o valor do desafio.
3. Cadastrar `rxprojetosbim.eng.br` como domínio personalizado em Settings → Pages do repositório `aristotelesximenes/rx-engenharia-site`.
4. Configurar os registros do DNS:

| Tipo | Nome | Destino |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | aristotelesximenes.github.io |

5. Alterar `domainConfig.active` para `true`, executar `npm run check` e publicar em coordenação com a configuração do Pages.
6. Aguardar propagação e emissão do certificado, ativar Enforce HTTPS e conferir página inicial, portfólio, imagens, contatos e redirecionamento de `www`.

O site usa um workflow de GitHub Actions: não é necessário criar um arquivo CNAME no diretório público. O domínio é definido nas configurações do Pages. A hospedagem do robô será um serviço separado, podendo usar um subdomínio futuramente; não apontar esse serviço para o GitHub Pages.

[Configuração oficial do GitHub Pages](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
