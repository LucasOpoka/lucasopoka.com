#!/usr/bin/env bash
# Deploys one image tag to the environment this script lives in, with a health check
# and automatic rollback to the previous tag on failure.
#
# Runs on the VPS, in an environment directory that holds its own docker-compose.yml
# (copied from this repo's deploy/) and .env (from deploy/.env.example). CI calls this
# over SSH; you can run it by hand identically if CI is down.
#
# Usage: ./deploy.sh <image-tag>

set -euo pipefail

TAG="${1:?Usage: deploy.sh <image-tag>}"
cd "$(dirname "$0")"

set_tag() {
  local tag="$1"
  { grep -v '^IMAGE_TAG=' .env 2>/dev/null || true; echo "IMAGE_TAG=${tag}"; } > .env.new
  mv .env.new .env
}

PREV_TAG="$(grep '^IMAGE_TAG=' .env 2>/dev/null | cut -d= -f2 || true)"

set_tag "$TAG"
docker compose pull web
docker compose up -d --no-deps web

CONTAINER="$(docker compose ps -q web)"
for i in $(seq 1 30); do
  status="$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo starting)"
  if [[ "$status" == "healthy" ]]; then
    echo "Healthy on attempt $i (tag ${TAG})"
    docker image prune -f --filter 'until=168h' >/dev/null
    exit 0
  fi
  sleep 2
done

echo "Health check failed for tag ${TAG} — rolling back to ${PREV_TAG:-none}" >&2
if [[ -n "${PREV_TAG:-}" ]]; then
  set_tag "$PREV_TAG"
  docker compose up -d --no-deps web
fi
exit 1
