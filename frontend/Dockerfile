
# Build stage
FROM node:24-alpine as build

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
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy frontend_txt directory for curl user agents
COPY frontend_txt /usr/share/nginx/txt

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create SSL certificates
RUN apk add --no-cache openssl
RUN mkdir -p /etc/nginx/ssl
RUN openssl req -x509 -nodes \
    -out /etc/nginx/ssl/certificate.crt \
    -keyout /etc/nginx/ssl/certificate.key \
    -subj "/C=FI/ST=UUSIMA/L=HELSINKI/O=OPOKA/OU=LUCAS/CN=ItzAMeMario"

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]