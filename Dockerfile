# --- STAGE 1: Install dependencies ---
    FROM node:20-alpine AS deps
    WORKDIR /app
    
    # Копируем только файлы зависимостей для кэширования этого слоя
    COPY package*.json ./
    # Устанавливаем все зависимости (включая dev для сборки)
    RUN npm ci
    
    # --- STAGE 2: Build ---
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Копируем node_modules из этапа deps
    COPY --from=deps /app/node_modules ./node_modules
    # Копируем исходный код монорепозитория
    COPY . .
    
    # Аргумент, какой сервис собирать (передается через --build-arg)
    ARG SERVICE_NAME
    RUN npx nest build ${SERVICE_NAME}
    
    # --- STAGE 3: Production Image ---
    FROM node:20-alpine AS runner
    WORKDIR /app
    
    ENV NODE_ENV=production
    
    # Копируем package.json и устанавливаем ТОЛЬКО prod-зависимости
    COPY package*.json ./
    RUN npm ci --omit=dev && npm cache clean --force
    
    # Копируем только билд конкретного сервиса из этапа builder
    # В NestJS Monorepo результат билда лежит в dist/apps/SERVICE_NAME
    ARG SERVICE_NAME
    COPY --from=builder /app/dist/apps/${SERVICE_NAME} ./dist
    
    # Если сервис использует общие ассеты или конфиги, их тоже нужно скопировать здесь
    
    EXPOSE 3000
    
    # Запуск скомпилированного кода
    CMD ["node", "dist/main"]