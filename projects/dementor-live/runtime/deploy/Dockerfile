FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    DEMENTOR_HOST=0.0.0.0 \
    DEMENTOR_PORT=4173 \
    DEMENTOR_STATE=/app/data/world.json

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-cairosvg python3-pil && rm -rf /var/lib/apt/lists/*
COPY --chown=node:node . .
RUN python3 icons-v2/install-v2.py /app /app/icons-v2
RUN python3 tools/install-new-icons-v3.py /app
RUN python3 tools/build-terrain.py
RUN npm run doctor && npm run check && npm run check:icons && npm run check:icons-new && install -d -o node -g node /app/data

USER node
EXPOSE 4173
VOLUME ["/app/data"]
CMD ["node", "server.mjs"]
