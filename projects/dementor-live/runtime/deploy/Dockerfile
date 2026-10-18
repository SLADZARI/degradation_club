# Separate Dementor Live game service, Node.js 22+, no npm install needed.
FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node . /app/
RUN mkdir -p /app/data && chown -R node:node /app/data
USER node
EXPOSE 14173
CMD ["node","server.mjs"]
