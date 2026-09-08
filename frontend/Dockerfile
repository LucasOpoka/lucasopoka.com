
# Build stage
FROM node:26-alpine AS build

WORKDIR /app

# Copy package files from frontend_react directory
COPY frontend_react/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code from frontend_react directory
COPY frontend_react/ .

# Build the application
RUN npm run build

# Production stage
FROM caddy:2-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /srv/dist

# Copy frontend_txt directory for curl user agents
COPY frontend_txt /srv/txt

# Copy Caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080