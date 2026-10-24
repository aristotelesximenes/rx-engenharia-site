import { DatabaseSync } from "node:sqlite";

export class Store {
  constructor(filename) {
    this.db = new DatabaseSync(filename);
    this.db.exec(`PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS inbox (id TEXT PRIMARY KEY, line TEXT NOT NULL, sender TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'queued', created INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (line TEXT NOT NULL, sender TEXT NOT NULL, state TEXT NOT NULL, updated INTEGER NOT NULL, PRIMARY KEY(line,sender));
      CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, line TEXT NOT NULL, sender TEXT NOT NULL, service TEXT NOT NULL, details TEXT NOT NULL, created INTEGER NOT NULL);
    `);
    // A request interrupted during sending has an uncertain outcome: never resend automatically.
    this.db.exec("UPDATE inbox SET status='uncertain' WHERE status='processing'");
  }
  enqueue(message, now = Date.now()) {
    return this.db.prepare("INSERT OR IGNORE INTO inbox(id,line,sender,body,created) VALUES (?,?,?,?,?)")
      .run(message.id, message.line, message.sender, JSON.stringify(message), now).changes > 0;
  }
  claim() {
    const row = this.db.prepare("SELECT * FROM inbox WHERE status='queued' ORDER BY created,rowid LIMIT 1").get();
    if (!row) return null;
    if (!this.db.prepare("UPDATE inbox SET status='processing' WHERE id=? AND status='queued'").run(row.id).changes) return null;
    return JSON.parse(row.body);
  }
  status(id, status) { this.db.prepare("UPDATE inbox SET status=? WHERE id=?").run(status, id); }
  state(line, sender, now = Date.now()) {
    const row = this.db.prepare("SELECT state,updated FROM sessions WHERE line=? AND sender=?").get(line, sender);
    if (!row) return {};
    const state = JSON.parse(row.state);
    return state.mode === "stopped" || now - row.updated < 86400000 ? state : {};
  }
  save(line, sender, state, now = Date.now()) {
    this.db.prepare("INSERT INTO sessions VALUES (?,?,?,?) ON CONFLICT(line,sender) DO UPDATE SET state=excluded.state,updated=excluded.updated")
      .run(line, sender, JSON.stringify(state), now);
  }
  lead(message, lead, now = Date.now()) {
    this.db.prepare("INSERT OR IGNORE INTO leads VALUES (?,?,?,?,?,?)").run(message.id, message.line, message.sender, lead.service, lead.details, now);
  }
  leads() { return this.db.prepare("SELECT * FROM leads ORDER BY created DESC LIMIT 100").all(); }
  uncertain() { return this.db.prepare("SELECT id,line,sender,status,created FROM inbox WHERE status IN ('uncertain','failed') ORDER BY created DESC LIMIT 100").all(); }
  cleanup(now = Date.now()) {
    this.db.prepare("DELETE FROM inbox WHERE created<? AND status NOT IN ('uncertain','failed')").run(now - 7 * 86400000);
    this.db.prepare("DELETE FROM inbox WHERE created<?").run(now - 30 * 86400000);
    this.db.prepare("DELETE FROM leads WHERE created<?").run(now - 30 * 86400000);
    this.db.prepare("DELETE FROM sessions WHERE updated<? AND json_extract(state,'$.mode')!='stopped'").run(now - 86400000);
  }
  close() { this.db.close(); }
}
