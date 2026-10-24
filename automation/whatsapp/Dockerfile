FROM node:24-alpine
WORKDIR /app
COPY src/data/site-config.js ./src/data/site-config.js
COPY automation/whatsapp/*.mjs ./automation/whatsapp/
COPY package.json ./package.json
ENV HOST=0.0.0.0 PORT=3000 BOT_DATA_DIR=/data
EXPOSE 3000
# Mount a private persistent volume at /data and inject secrets via the host.
CMD ["node", "automation/whatsapp/server.mjs"]
