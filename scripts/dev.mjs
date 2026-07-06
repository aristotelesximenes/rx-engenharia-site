import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const server = http.createServer((request, response) => {
  const urlPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  let filePath = path.join(dist, urlPath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  } else if (!path.extname(filePath)) {
    filePath = path.join(filePath, "index.html");
  }

  if (!filePath.startsWith(dist) || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(path.join(dist, "404.html")).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Content-Type": mime[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`RX Engenharia: http://127.0.0.1:${port}`);
});
