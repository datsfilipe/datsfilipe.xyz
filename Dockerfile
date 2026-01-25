FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build:prod

FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app/.dist .

EXPOSE 3000

CMD ["./server"]
