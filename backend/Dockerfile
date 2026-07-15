FROM node:20-alpine
WORKDIR /app

# Instalar sólo dependencias de producción.
# NOTA DE SEGURIDAD: --ignore-scripts NO puede usarse aquí porque sqlite3
# requiere compilación nativa (node-gyp) que se activa mediante lifecycle
# scripts (install/postinstall). Usarlo rompería sqlite3.
# Mitigación aplicada: usuario no-root + .dockerignore estricto que excluye
# .git, .env, node_modules, tests, *.sqlite y archivos temporales.
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el código fuente.
# .dockerignore excluye archivos sensibles y no necesarios en producción.
COPY . .

# Transferir propiedad del directorio al usuario node (no-root).
# Se hace antes de USER node para que chown corra con permisos de root.
RUN chown -R node:node /app

# Cambiar a usuario no-root para la ejecución del proceso.
USER node

ENV NODE_ENV=production
# Render inyecta PORT; el servidor usa process.env.PORT || 4000.
EXPOSE 4000

CMD ["node", "index.js"]
