
# Disk image stage — fetches the WebVM's chunked ext2 disk image (~611MB, 4881 files) from a
# GitHub Release. This asset is gitignored (too large for git) and regenerated locally, rarely,
# by ../process_ext2.sh, then published via ../deploy/publish-disk-image.sh. Kept as its own
# stage so its own cache layer only invalidates when DISK_IMAGE_VERSION actually changes, not on
# every app source code change.
FROM alpine:3.24 AS disk-images

ARG DISK_IMAGE_VERSION=disk-image-v1

# hadolint ignore=DL3018
RUN apk add --no-cache curl && \
    curl -fsSL --proto '=https' --tlsv1.2 -o /tmp/disk-images.tar.gz \
      "https://github.com/LucasOpoka/lucasopoka.com/releases/download/${DISK_IMAGE_VERSION}/disk-images.tar.gz" && \
    mkdir -p /disk-images && \
    tar -xzf /tmp/disk-images.tar.gz -C /disk-images && \
    rm /tmp/disk-images.tar.gz

# Build stage. Uses glibc (not node:24-alpine/musl) because the committed package-lock.json
# has a platform-specific optional-dependency resolution that only validates cleanly under
# glibc — confirmed by reproducing the failure in a plain node:24-alpine container and it
# passing in node:24. Doesn't affect the shipped image size, since only this build stage uses
# it; the final stage is still caddy:2-alpine.
FROM node:26 AS build

WORKDIR /app

# Copy package files from frontend_react directory
COPY frontend_react/package*.json ./

# Install all dependencies (including dev dependencies for build). --ignore-scripts blocks
# arbitrary lifecycle scripts from a compromised/malicious dependency running at install time —
# confirmed no dependency here actually needs its install scripts to function (esbuild's
# platform binary still resolves fine via optionalDependencies without it).
RUN npm ci --ignore-scripts

# Copy source code from frontend_react directory
COPY frontend_react/ .

# Drop in the disk image assets alongside the rest of the static content
COPY --from=disk-images /disk-images ./public/disk-images

# Build the application
RUN npm run build

# Production stage
FROM caddy:2-alpine

# The base image has no non-root user built in; create one so this container doesn't run as
# root. Port 8080 doesn't need root to bind, and this app is served entirely from static files
# plus a config file it never writes to, so it needs no elevated privileges at runtime.
RUN addgroup -S caddy && adduser -S caddy -G caddy

# Copy built assets from build stage
COPY --from=build --chown=caddy:caddy /app/dist /srv/dist

# Copy frontend_txt directory for curl user agents
COPY --chown=caddy:caddy frontend_txt /srv/txt

# Copy Caddy configuration
COPY --chown=caddy:caddy Caddyfile /etc/caddy/Caddyfile

# Caddy's default /data and /config dirs are for TLS state/autosave this app never uses (the
# edge proxy handles TLS, not this container), but Caddy still wants to write there on startup.
RUN mkdir -p /data /config && chown -R caddy:caddy /data /config

USER caddy

EXPOSE 8080
