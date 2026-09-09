#!/usr/bin/env bash
# Publishes a new version of the WebVM's chunked disk image as a GitHub Release, for
# frontend/Dockerfile's disk-images build stage to fetch. Run this after regenerating
# frontend/frontend_react/public/disk-images/ with ../process_ext2.sh (needs root/mount, so
# that part stays a separate, manual step on your own machine).
#
# Usage: ./publish-disk-image.sh <version>   (e.g. ./publish-disk-image.sh disk-image-v2)
#
# After this succeeds, bump `ARG DISK_IMAGE_VERSION=...` in frontend/Dockerfile to match and
# open a normal PR — the new image ships through the regular CI/CD path from there.

set -euo pipefail

VERSION="${1:?Usage: publish-disk-image.sh <version>, e.g. disk-image-v2}"
REPO="LucasOpoka/lucasopoka.com"
SRC_DIR="$(dirname "$0")/../frontend/frontend_react/public/disk-images"
ARCHIVE="$(mktemp -t disk-images-XXXXXX.tar.gz)"

if [[ ! -d "$SRC_DIR" ]]; then
  echo "No disk-images directory at $SRC_DIR — run process_ext2.sh first." >&2
  exit 1
fi

trap 'rm -f "$ARCHIVE"' EXIT

echo "Archiving $SRC_DIR..."
tar -czf "$ARCHIVE" -C "$SRC_DIR" .
echo "Archive size: $(du -h "$ARCHIVE" | cut -f1)"

gh release create "$VERSION" "$ARCHIVE#disk-images.tar.gz" \
  --repo "$REPO" \
  --title "WebVM disk image assets ($VERSION)" \
  --notes "Chunked ext2 disk image for the WebVM feature. Fetched by frontend/Dockerfile's disk-images build stage."

echo
echo "Published. Next: bump ARG DISK_IMAGE_VERSION=$VERSION in frontend/Dockerfile and open a PR."
