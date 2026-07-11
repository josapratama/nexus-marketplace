# ─────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy manifests first for layer caching
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install all dependencies (including dev, needed for build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build client (Vite) + server (esbuild)
RUN pnpm build

# ─────────────────────────────────────────
# Stage 2: Production image
# ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Copy manifests
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Install production deps only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the production server
CMD ["node", "dist/index.js"]
