# Etap 1 – Budowanie
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install

# Etap 2 – Aplikacja
FROM node:20-slim
LABEL org.opencontainers.image.authors="Jan Kowalski"
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://localhost:5000 || exit 1

CMD ["npm", "start"]
