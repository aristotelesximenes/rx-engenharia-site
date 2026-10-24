# Assistente de atendimento RX para dois WhatsApps

## Estado desta entrega

Código implementado e testado localmente. **Não está conectado aos números reais e não está ativo em produção.** A RX informou que ambos já usam o aplicativo WhatsApp Business e que ainda não possui acesso administrativo à conta empresarial na Meta.

O serviço atende as linhas cadastradas em `src/data/site-config.js`:

- Linha 1: (86) 98817-1719.
- Linha 2: (86) 99513-6645.

Cada linha precisa do seu próprio `phone_number_id` da Meta. As conversas e os estados são separados por linha e cliente. Tokens, segredos, mensagens de clientes e banco SQLite ficam somente no servidor privado, fora de `public/`, `dist/` e do Git.

## O que está programado

1. Identificação como assistente automático e menu de serviços.
2. Projetos e BIM; laudos/vistorias; fiscalização; sanitária/ambiental; consulta ao portfólio.
3. Coleta de nome, cidade e descrição da necessidade após informar a finalidade do uso.
4. Registro do pedido e pausa do robô para atendimento humano pelo aplicativo conectado ou caixa de entrada compatível.
5. Comando `0` para solicitar a equipe; `9`/`PARAR` para encerrar; `MENU` para reiniciar.

Não há respostas de engenharia geradas por IA, orçamento automático ou promessa de prazo. A fila local registra o pedido, mas não substitui uma caixa de entrada operacional. A equipe precisa acompanhar as solicitações e responder pelo aplicativo em coexistência ou por uma plataforma conectada.

## Pré-requisitos de ativação

- Conta empresarial da RX na Meta com administrador autorizado.
- Aplicativo com WhatsApp Cloud API, números vinculados e permissões necessárias.
- Para preservar o uso do aplicativo Business, verificar a elegibilidade do fluxo oficial de coexistência, possivelmente via parceiro com esse suporte. Não excluir contas nem migrar linhas sem revisar o fluxo escolhido.
- Servidor Node.js 24.14 ou superior com HTTPS, armazenamento persistente e acesso à Graph API.
- Versão da Graph API confirmada no painel atual da Meta.
- Segredo do aplicativo, token de verificação, tokens de acesso e IDs das duas linhas configurados de modo privado.

Não contratar serviços pagos nem alterar o cadastro dos números apenas por executar este código. A opção de hospedagem e eventual fornecedor de coexistência ainda precisam ser definidos pelo responsável pela RX.

## Execução

Na raiz `site-rx`, criar uma cópia privada de `.env.example` como `automation/whatsapp/.env` e preencher os valores no computador/servidor autorizado. O arquivo real está ignorado pelo Git. Nunca enviar tokens pelo chat nem incluí-los no JavaScript do site.

```powershell
npm run bot:test
npm run bot:start
```

Não há dependências externas de produção. Para hospedar em contêiner, usar o contexto de build na raiz `site-rx` e o Dockerfile `automation/whatsapp/Dockerfile`, injetando as variáveis no servidor e montando um volume privado persistente em `/data`.

Executar uma única instância por banco. O SQLite mantém a fila e as sessões entre reinícios. A cópia persistente e seus backups precisam ter acesso restrito. O servidor HTTP local deve ficar atrás do proxy HTTPS da hospedagem.

## Conexão com a Meta

- Callback: `https://ENDERECO-DO-SERVIDOR/webhook` (o domínio/host ainda será escolhido).
- Verificação `GET`: desafio `hub.challenge` e `META_VERIFY_TOKEN`.
- Eventos `POST`: HMAC SHA-256 do corpo bruto, validado com `META_APP_SECRET`.
- Assinar os eventos de mensagens nas contas WhatsApp correspondentes às duas linhas.
- Testar primeiro com número de teste autorizado da Meta; depois validar cada linha real com o responsável presente.

O webhook confirma recebimento somente após persistir a mensagem. O processador responde pela linha que recebeu o contato. Eventos de entrega e linhas não cadastradas são ignorados. Nenhuma mensagem é enviada apenas por iniciar o servidor.

## Operação e recuperação

- `GET /health`: verifica se o processo está respondendo.
- `GET /admin/leads`: fila de solicitações e envios a revisar, protegida por `Authorization: Bearer BOT_ADMIN_TOKEN`. Não colocar esse token no navegador público.
- Mensagens recebidas são deduplicadas pelo ID da Meta. Envios com erro ou resultado incerto ficam na fila `review`; não há reenvio automático que possa duplicar mensagens.
- Se o processo reiniciar durante um envio, a mensagem fica como `uncertain`. Conferir a conversa antes de qualquer reenvio manual.
- O bot responde apenas a eventos recentes recebidos, dentro da janela de atendimento; não dispara campanhas nem inicia conversas.
- Fila processada é expurgada após 7 dias; solicitações e pendências após 30 dias; sessões comuns após 24 horas. A preferência `PARAR` é preservada até novo `MENU` do cliente. Rever retenção conforme a política aprovada pela RX e o tratamento dos backups.

## Referências oficiais

- [WhatsApp Business Platform — coleção oficial da Meta](https://www.postman.com/meta/whatsapp-business-platform/overview).
- [Mensagens pela API — Meta](https://www.postman.com/meta/whatsapp-business-platform/folder/o48mro7/messages).
- [Integração de usuários do aplicativo Business — Meta](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users).
- [SQLite do Node.js](https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html).
