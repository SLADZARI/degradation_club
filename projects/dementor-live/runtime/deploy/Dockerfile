FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    DEMENTOR_HOST=0.0.0.0 \
    DEMENTOR_PORT=4173 \
    DEMENTOR_STATE=/app/data/world.json

WORKDIR /app
COPY --chown=node:node . .
RUN npm run doctor && npm run check && install -d -o node -g node /app/data

USER node
EXPOSE 4173
VOLUME ["/app/data"]
CMD ["node", "server.mjs"]
