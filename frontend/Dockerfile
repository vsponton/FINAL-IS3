# Etapa 1: build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

# --ignore-scripts: omite los lifecycle hooks de los paquetes (ej: descarga del
# binario de Cypress vía postinstall). Es seguro en esta etapa porque sólo se
# ejecuta `vite build`; Cypress no se invoca dentro del contenedor de producción.
RUN npm ci --ignore-scripts

# Copia el resto del código fuente.
# .dockerignore excluye node_modules del host, tests, coverage, dist previo, etc.
COPY . .

# --- INYECTAR VITE_API_URL EN EL BUILD ---
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
# Vite lee import.meta.env.VITE_API_URL en tiempo de build
RUN VITE_API_URL="${VITE_API_URL}" npm run build

# Etapa 2: nginx no-root para servir estáticos.
# nginxinc/nginx-unprivileged corre como usuario nginx (UID 101), sin root.
# CAMBIO DE PUERTO: usa 8080 en lugar de 80 (los puertos <1024 requieren root).
# Si el servicio de Render estaba configurado para el puerto 80, actualizar
# la configuración del servicio en Render para que apunte al puerto 8080.
FROM nginxinc/nginx-unprivileged:alpine
COPY <<'NGINX' /etc/nginx/conf.d/default.conf
server {
  listen 8080;
  server_name _;
  root /usr/share/nginx/html;

  location / {
    try_files $uri /index.html;
  }

  location /assets/ {
    try_files $uri =404;
  }
}
NGINX

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
