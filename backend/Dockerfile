# ─── Stage 1: builder / compilar dependencias nativas ────────────────────────
# Esta etapa instala paquetes y compila sqlite3.
# El resultado (node_modules compilado) se copia al stage de runtime;
# ninguna herramienta de compilación llega a la imagen final.
FROM node:20-alpine AS builder
WORKDIR /app

# Herramientas de compilación necesarias para node-gyp (sqlite3)
RUN apk add --no-cache g++ make python3

COPY package*.json ./

# --ignore-scripts: los paquetes NO ejecutan sus lifecycle hooks al instalarse.
# Luego compilamos explícitamente sqlite3 con npm rebuild (operación controlada
# y separada del paso de instalación; sqlite3 requiere node-gyp para el binding nativo).
RUN npm ci --omit=dev --ignore-scripts && npm rebuild sqlite3

# ─── Stage 2: runtime limpio ─────────────────────────────────────────────────
# Imagen final sin herramientas de compilación ni archivos fuente innecesarios.
FROM node:20-alpine
WORKDIR /app

# Copiar node_modules ya compilado desde el builder.
COPY --from=builder /app/node_modules ./node_modules

# Copiar explícitamente sólo los archivos necesarios para ejecutar la aplicación.
# SECURITY: No se usa COPY . . para evitar incluir tests, .git, .env u otros archivos sensibles.
COPY package.json ./
COPY index.js ./
COPY db.js ./

# Transferir propiedad al usuario node (no-root)
RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
# Render inyecta PORT; el servidor usa process.env.PORT || 4000.
EXPOSE 4000
CMD ["node", "index.js"]
