# Etap 1 – Budowanie
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
RUN apt update && apt upgrade -y && \
    apt remove --purge libc-bin libc6 perl-base zlib1g -y && \
    apt autoremove -y

# Etap 2 – Aplikacja
FROM node:20-slim
LABEL org.opencontainers.image.authors="Patryk Miscisz"
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://localhost:5000 || exit 1

CMD ["npm", "start"]
