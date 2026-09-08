
# Disk image stage — fetches the WebVM's chunked ext2 disk image (~611MB, 4881 files) from a
# GitHub Release. This asset is gitignored (too large for git) and regenerated locally, rarely,
# by ../process_ext2.sh, then published via ../deploy/publish-disk-image.sh. Kept as its own
# stage so its own cache layer only invalidates when DISK_IMAGE_VERSION actually changes, not on
# every app source code change.
FROM alpine:3.24 AS disk-images

ARG DISK_IMAGE_VERSION=disk-image-v1

# hadolint ignore=DL3018
RUN apk add --no-cache curl && \
    curl -fsSL -o /tmp/disk-images.tar.gz \
      "https://github.com/LucasOpoka/lucasopoka.com/releases/download/${DISK_IMAGE_VERSION}/disk-images.tar.gz" && \
    mkdir -p /disk-images && \
    tar -xzf /tmp/disk-images.tar.gz -C /disk-images && \
    rm /tmp/disk-images.tar.gz

# Build stage. Uses glibc (not node:24-alpine/musl) because the committed package-lock.json
# has a platform-specific optional-dependency resolution that only validates cleanly under
# glibc — confirmed by reproducing the failure in a plain node:24-alpine container and it
# passing in node:24. Doesn't affect the shipped image size, since only this build stage uses
# it; the final stage is still caddy:2-alpine.
FROM node:24 AS build

WORKDIR /app

# Copy package files from frontend_react directory
COPY frontend_react/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code from frontend_react directory
COPY frontend_react/ .

# Drop in the disk image assets alongside the rest of the static content
COPY --from=disk-images /disk-images ./public/disk-images

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
