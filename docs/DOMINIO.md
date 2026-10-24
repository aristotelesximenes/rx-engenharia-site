# Domínio registrado: rxprojetosbim.eng.br

Publicado e verificado em 24/10/2026: **https://rxprojetosbim.eng.br/**, na Hospedagem GO Linux da Locaweb. O domínio raiz e `www` respondem por HTTPS. As páginas usam canonical no domínio raiz; nenhum registro de e-mail ou DNS foi alterado.

A publicação contém 74 arquivos: 73 arquivos públicos comparados byte a byte com o pacote local, mais `.htaccess`, protegido por HTTP 403. A raiz, o portfólio e o contato respondem com 200; páginas inexistentes e caminhos privados testados retornam 404. O envio foi concluído por FTP com autorização expressa do responsável, após instabilidade do WebFTP. A senha não foi salva em arquivos; recomenda-se trocá-la após a publicação.

`src/data/site-config.js` centraliza o domínio. `registered: true` registra a confirmação do usuário. O build `RX_DEPLOY_TARGET=locaweb` gera URLs na raiz do domínio, sem alterar o build padrão de prévia do GitHub.

## Publicação na Locaweb

1. Execute `npm run build:locaweb`. O processo valida as 24 páginas e gera `dist-locaweb/` com URLs na raiz de `https://rxprojetosbim.eng.br`.
2. Acesse Arquivos e FTP / WebFTP na hospedagem correta. O responsável deve realizar a autenticação FTP quando solicitada, sem enviar a senha pelo chat.
3. Preserve os arquivos existentes antes de substituí-los. Publique **o conteúdo** de `dist-locaweb/` dentro de `public_html`, sem criar um nível extra `dist-locaweb`.
4. Envie somente a saída pública. Não envie a pasta geral de engenharia, `.git`, fontes do gerador, documentos integrais, `automation/whatsapp` ou credenciais.
5. Confira DNS e certificado no painel. Preserve MX, SPF, DKIM e demais registros de e-mail. Use os destinos reais informados pela Locaweb, nunca os antigos endereços de exemplo do GitHub Pages.
6. Verifique HTTPS, página inicial, navegação, portfólio, imagens, fontes, formulário e os dois contatos. Confira `www` e páginas inexistentes.

O `.htaccess` do pacote configura `index.html`, página 404, MIME de WebP/fontes e bloqueio de listagem de diretórios. Ative o redirecionamento HTTPS somente depois de o certificado estar funcionando.

## Prévia independente no GitHub Pages

O build padrão continua gerando `dist/` para o link existente do GitHub, com `/rx-engenharia-site`. Isso mantém a prévia independente da produção. O workflow atual não envia arquivos à Locaweb; novas alterações precisam gerar e publicar o pacote próprio lá também. `domainConfig.active` registra a confirmação de produção, mas não altera o destino do build: somente `RX_DEPLOY_TARGET=locaweb` seleciona o pacote Locaweb.

O assistente de WhatsApp é um serviço separado, ainda pendente de configuração oficial da Meta e hospedagem compatível. Ele não faz parte dos arquivos públicos do site.

Referências oficiais: [WebFTP](https://www.locaweb.com.br/ajuda/wiki/como-acessar-o-webftp-hospedagem-de-sites/), [pasta public_html em Linux](https://www.locaweb.com.br/ajuda/wiki/como-usar-o-filezilla-hospedagem-de-sites/).
