import http from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { whatsappContacts } from "../../src/data/site-config.js";
import { nextReply } from "./flow.mjs";
import { Store } from "./store.mjs";

function same(a = "", b = "") {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function validSignature(body, signature = "", secret) {
  return /^sha256=[a-f0-9]{64}$/.test(signature) && same(signature, `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`);
}
export function configuration(env = process.env) {
  for (const name of ["META_APP_SECRET", "META_VERIFY_TOKEN", "META_GRAPH_API_VERSION", "BOT_ADMIN_TOKEN"]) {
    if (!env[name]) throw new Error(`Configure ${name} no ambiente privado do servidor.`);
  }
  if (!/^v\d+\.\d+$/.test(env.META_GRAPH_API_VERSION)) throw new Error("Versão da Graph API inválida.");
  const lines = whatsappContacts.map((contact, index) => {
    const id = env[`META_PHONE_NUMBER_ID_${index + 1}`];
    const token = env[`META_ACCESS_TOKEN_${index + 1}`] || env.META_ACCESS_TOKEN;
    if (!/^\d+$/.test(id || "") || !token) throw new Error(`Configure ID e token da linha ${index + 1}.`);
    return { ...contact, id, token };
  });
  if (lines[0].id === lines[1].id) throw new Error("As duas linhas precisam de IDs da Meta diferentes.");
  return { appSecret: env.META_APP_SECRET, verifyToken: env.META_VERIFY_TOKEN, version: env.META_GRAPH_API_VERSION, adminToken: env.BOT_ADMIN_TOKEN, lines };
}
export function extractMessages(payload, config) {
  const result = [];
  if (!payload || payload.object !== "whatsapp_business_account") return result;
  for (const entry of payload.entry || []) for (const change of entry.changes || []) {
    const value = change.value;
    const line = config.lines.find((item) => item.id === value?.metadata?.phone_number_id);
    if (!line) continue;
    for (const message of value.messages || []) {
      if (!message.id || message.id.length > 256 || !/^\d{8,15}$/.test(message.from || "")) continue;
      const timestamp = Number(message.timestamp) * 1000;
      if (!Number.isFinite(timestamp) || timestamp <= 0) continue;
      result.push({ id: message.id, line: line.id, sender: message.from, timestamp, kind: message.type === "interactive" ? "text" : message.type, text: String(message.text?.body || message.interactive?.button_reply?.id || message.interactive?.list_reply?.id || "").slice(0,4096) });
    }
  }
  return result;
}
export async function sendReply(config, line, sender, text, fetchImpl = fetch) {
  const response = await fetchImpl(`https://graph.facebook.com/${config.version}/${line.id}/messages`, {
    method: "POST", headers: { Authorization: `Bearer ${line.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: sender, type: "text", text: { preview_url: false, body: text } }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Meta HTTP ${response.status}`);
  const body = await response.json();
  if (!body.messages?.[0]?.id) throw new Error("Meta não confirmou o envio.");
}
export async function processNext(store, config, fetchImpl = fetch, now = Date.now()) {
  const message = store.claim();
  if (!message) return false;
  const line = config.lines.find((item) => item.id === message.line);
  if (!line || now - message.timestamp > 23.9 * 3600000 || message.timestamp > now + 300000) {
    store.status(message.id, "expired"); return true;
  }
  const answer = nextReply(store.state(message.line, message.sender, now), message.text, message.kind);
  store.save(message.line, message.sender, answer.state, now);
  if (answer.lead) store.lead(message, answer.lead, now);
  if (answer.text) {
    try { await sendReply(config, line, message.sender, answer.text, fetchImpl); }
    catch {
      // A timeout may occur after Meta accepted a message. Manual review avoids duplicate replies.
      store.status(message.id, "uncertain"); return true;
    }
  }
  store.status(message.id, "done");
  return true;
}
async function readBody(request) {
  let size = 0; const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 262144) throw new Error("BODY_LIMIT");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}
export function createBotServer(config, store, fetchImpl = fetch) {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://bot.local");
      if (request.method === "GET" && url.pathname === "/health") return json(response,200,{status:"ok",channels:config.lines.length});
      if (url.pathname === "/admin/leads" && request.method === "GET") {
        if (!same(request.headers.authorization || "", `Bearer ${config.adminToken}`)) return json(response,401,{error:"Unauthorized"});
        return json(response,200,{leads:store.leads(),review:store.uncertain()});
      }
      if (url.pathname !== "/webhook") return json(response,404,{error:"Not found"});
      if (request.method === "GET") {
        if (url.searchParams.get("hub.mode") !== "subscribe" || !same(url.searchParams.get("hub.verify_token") || "",config.verifyToken)) return json(response,403,{error:"Forbidden"});
        response.writeHead(200,{"Content-Type":"text/plain; charset=utf-8"}); response.end(url.searchParams.get("hub.challenge") || ""); return;
      }
      if (request.method !== "POST") return json(response,405,{error:"Method not allowed"});
      const raw = await readBody(request);
      if (!validSignature(raw,request.headers["x-hub-signature-256"],config.appSecret)) return json(response,403,{error:"Invalid signature"});
      let payload;
      try { payload = JSON.parse(raw); } catch { return json(response,400,{error:"Invalid JSON"}); }
      for (const message of extractMessages(payload,config)) store.enqueue(message);
      // Acknowledge only after SQLite persisted the incoming messages; sending happens in the worker.
      return json(response,200,{received:true});
    } catch (error) {
      return json(response,error.message === "BODY_LIMIT" ? 413 : 500,{error:"Request rejected"});
    }
  });
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const config = configuration();
  const dataDir = path.resolve(process.env.BOT_DATA_DIR || "automation/whatsapp/data");
  mkdirSync(dataDir,{recursive:true,mode:0o700});
  const store = new Store(path.join(dataDir,"bot.sqlite"));
  store.cleanup();
  const server = createBotServer(config,store);
  let running = false;
  const timer = setInterval(async () => {
    if (running) return;
    running = true;
    try { for(let i=0;i<20 && await processNext(store,config);i++); }
    catch { console.error("Falha interna no processamento; verificar saúde do serviço."); }
    finally { running = false; }
  },500);
  const cleanup = setInterval(() => { if (!running) store.cleanup(); },3600000);
  server.requestTimeout = 15000;
  server.listen(Number(process.env.PORT || 3000),process.env.HOST || "127.0.0.1",() => console.log("Assistente RX iniciado. Dois canais configurados; webhook aguardando mensagens assinadas."));
  for (const signal of ["SIGINT","SIGTERM"]) process.on(signal,() => {
    clearInterval(timer); clearInterval(cleanup);
    server.close(() => { store.close(); process.exit(0); });
  });
}
