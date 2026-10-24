import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { once } from "node:events";
import { configuration, validSignature, extractMessages, processNext, createBotServer } from "./server.mjs";
import { Store } from "./store.mjs";
import { nextReply } from "./flow.mjs";

const config = configuration({ META_APP_SECRET:"test-app-secret", META_VERIFY_TOKEN:"test-verification", META_GRAPH_API_VERSION:"v99.0", BOT_ADMIN_TOKEN:"test-admin", META_PHONE_NUMBER_ID_1:"111", META_PHONE_NUMBER_ID_2:"222", META_ACCESS_TOKEN:"test-token" });
const now = Date.now();
const message = (id, line="111", text="Olá") => ({id,line,sender:"5586999999999",timestamp:now,kind:"text",text});
const payload = (line="111") => ({object:"whatsapp_business_account",entry:[{changes:[{field:"messages",value:{metadata:{phone_number_id:line},messages:[{id:"wamid.test",from:"5586999999999",timestamp:String(Math.floor(now/1000)),type:"text",text:{body:"Olá"}}]}}]}]});
const success = async () => new Response(JSON.stringify({messages:[{id:"wamid.out"}]}),{status:200});

test("duas linhas configuradas; credenciais incompletas bloqueiam início",() => {
  assert.equal(config.lines.length,2);
  assert.notEqual(config.lines[0].id,config.lines[1].id);
  assert.throws(() => configuration({}),/META_APP_SECRET/);
});
test("assinatura valida corpo bruto; alteração e assinatura ausente são rejeitadas",() => {
  const body = Buffer.from('{"a":1}');
  const signature = `sha256=${createHmac("sha256",config.appSecret).update(body).digest("hex")}`;
  assert(validSignature(body,signature,config.appSecret));
  assert(!validSignature(Buffer.from('{"a":2}'),signature,config.appSecret));
  assert(!validSignature(body,"",config.appSecret));
});
test("webhook roteia apenas números cadastrados; eventos de status são ignorados",() => {
  assert.equal(extractMessages(payload("222"),config)[0].line,"222");
  assert.equal(extractMessages(payload("999"),config).length,0);
  assert.equal(extractMessages({object:"whatsapp_business_account",entry:[{changes:[{value:{metadata:{phone_number_id:"111"},statuses:[{status:"delivered"}]}}]}]},config).length,0);
  assert.deepEqual(extractMessages(null,config),[]);
});
test("recepção, coleta com finalidade informada e pedido registrado para equipe",() => {
  const welcome = nextReply({},"Olá");
  assert.match(welcome.text,/assistente automático/);
  const chosen = nextReply(welcome.state,"1");
  assert.match(chosen.text,/concorda com esse uso/);
  const details = nextReply(chosen.state,"Ana, Teresina/PI. Preciso de projeto estrutural para uma residência.");
  assert.equal(details.state.mode,"human");
  assert.match(details.lead.service,/Projetos/);
  assert.equal(nextReply(details.state,"outra mensagem").text,null);
});
test("parada é respeitada e somente MENU reinicia o atendimento",() => {
  const stop = nextReply({},"PARAR");
  assert.equal(stop.state.mode,"stopped");
  assert.equal(nextReply(stop.state,"Olá").text,null);
  assert.equal(nextReply(stop.state,"MENU").state.mode,"menu");
});
test("portfólio usa endereço publicado; mídia não é baixada pelo bot",() => {
  assert.match(nextReply({},"5").text,/\/portfolio\//);
  assert.match(nextReply({},"","audio").text,/texto/);
});
test("mensagens duplicadas não geram duas respostas e a linha de origem é preservada", async () => {
  const store = new Store(":memory:"); const sent = [];
  try {
    assert(store.enqueue(message("same","222")));
    assert(!store.enqueue(message("same","222")));
    await processNext(store,config,async (url,options) => {sent.push({url,body:JSON.parse(options.body)});return success();},now);
    assert.equal(await processNext(store,config,success,now),false);
    assert.equal(sent.length,1); assert.match(sent[0].url,/\/222\/messages$/);
    assert.equal(sent[0].body.to,"5586999999999");
  } finally {store.close();}
});
test("conversas do mesmo cliente nas duas linhas não compartilham estado",async () => {
  const store = new Store(":memory:");
  try {
    store.enqueue(message("stop","111","9")); await processNext(store,config,success,now);
    store.enqueue(message("hello","222","Olá")); await processNext(store,config,success,now);
    assert.equal(store.state("111","5586999999999",now).mode,"stopped");
    assert.equal(store.state("222","5586999999999",now).mode,"menu");
  } finally {store.close();}
});
test("pedido fica disponível para equipe e mensagens futuras não interrompem atendimento",async () => {
  const store = new Store(":memory:"); let sends = 0;
  try {
    store.enqueue(message("select","111","2")); await processNext(store,config,success,now);
    store.enqueue(message("details","111","Maria, Timon/MA, vistoria de apartamento antes da entrega.")); await processNext(store,config,success,now);
    assert.equal(store.leads().length,1);
    store.enqueue(message("follow","111","Segue outra informação"));
    await processNext(store,config,async () => { sends++; return success(); },now);
    assert.equal(sends,0);
  } finally {store.close();}
});
test("evento antigo não dispara mensagem fora da janela de atendimento",async () => {
  const store = new Store(":memory:"); let calls = 0;
  try {
    store.enqueue({...message("old"),timestamp:now-25*3600000});
    await processNext(store,config,async () => {calls++;return success();},now);
    assert.equal(calls,0);
  } finally {store.close();}
});
test("falha ambígua de envio fica para revisão e não é reenviada automaticamente",async () => {
  const store = new Store(":memory:");
  try {
    store.enqueue(message("timeout"));
    await processNext(store,config,async () => {throw new Error("timeout");},now);
    assert.equal(store.uncertain()[0].status,"uncertain");
    assert.equal(await processNext(store,config,success,now),false);
  } finally {store.close();}
});
test("servidor verifica desafio, assinatura, persistência e acesso privado à fila", async () => {
  const store = new Store(":memory:"); const server = createBotServer(config,store);
  server.listen(0,"127.0.0.1"); await once(server,"listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const verify = await fetch(`${base}/webhook?hub.mode=subscribe&hub.verify_token=test-verification&hub.challenge=123`);
    assert.equal(await verify.text(),"123");
    assert.equal((await fetch(`${base}/webhook?hub.mode=subscribe&hub.verify_token=wrong`)).status,403);
    const raw = JSON.stringify(payload());
    assert.equal((await fetch(`${base}/webhook`,{method:"POST",body:raw})).status,403);
    const signature = `sha256=${createHmac("sha256",config.appSecret).update(raw).digest("hex")}`;
    assert.equal((await fetch(`${base}/webhook`,{method:"POST",body:raw,headers:{"x-hub-signature-256":signature}})).status,200);
    assert(store.claim());
    assert.equal((await fetch(`${base}/admin/leads`)).status,401);
    assert.equal((await fetch(`${base}/admin/leads`,{headers:{Authorization:"Bearer test-admin"}})).status,200);
  } finally { server.closeAllConnections(); await new Promise((resolve)=>server.close(resolve)); store.close(); }
});
