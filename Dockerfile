# ==========================================
# STAGE 1: BUILDER
# ==========================================
FROM node:18-alpine AS builder

# Set working directory di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json (kalau ada)
COPY package*.json ./

# Install SEMUA dependencies (termasuk devDependencies buat build)
RUN npm ci

# Copy semua source code ke dalam container
COPY . .

# Build aplikasi NestJS dari TypeScript ke JavaScript (masuk ke folder /dist)
RUN npm run build

# ==========================================
# STAGE 2: PRODUCTION
# ==========================================
FROM node:18-alpine

WORKDIR /app

# Copy package.json lagi buat install ulang dependencies
COPY package*.json ./

# Install CUMA dependencies untuk production (node_modules jadi lebih enteng)
RUN npm ci --omit=dev

# Copy hasil build JavaScript dari Stage 1 (builder) ke Stage 2 ini
COPY --from=builder /app/dist ./dist

# Kasih tau Docker kalau aplikasi jalan di port 3000
EXPOSE 3000

# Command utama buat nyalain servernya
CMD ["node", "dist/main"]