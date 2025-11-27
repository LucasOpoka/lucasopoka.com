#!/bin/bash

# Script to bundle files needed for Docker deployment
# Usage: ./bundle_server.sh

set -e  # Exit on error

# Get the script directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
BUNDLE_DIR="${PROJECT_ROOT}/lucasopoka-server"

# Clean and create bundle directory
echo "Creating bundle directory: $BUNDLE_DIR"
if [ -d "$BUNDLE_DIR" ]; then
    echo "Removing existing bundle directory..."
    rm -rf "$BUNDLE_DIR"
fi
mkdir -p "$BUNDLE_DIR"

# Copy docker-compose.yml
echo ""
echo "Copying docker-compose.yml..."
if [ ! -f "${PROJECT_ROOT}/docker-compose.yml" ]; then
    echo "Error: docker-compose.yml not found at ${PROJECT_ROOT}/docker-compose.yml"
    exit 1
fi
cp "${PROJECT_ROOT}/docker-compose.yml" "${BUNDLE_DIR}/docker-compose.yml"
echo "Copied: docker-compose.yml"

# Create frontend directory in bundle
mkdir -p "${BUNDLE_DIR}/frontend"

# Copy Dockerfile
echo ""
echo "Copying frontend/Dockerfile..."
if [ ! -f "${PROJECT_ROOT}/frontend/Dockerfile" ]; then
    echo "Error: frontend/Dockerfile not found"
    exit 1
fi
cp "${PROJECT_ROOT}/frontend/Dockerfile" "${BUNDLE_DIR}/frontend/Dockerfile"
echo "Copied: frontend/Dockerfile"

# Copy nginx.conf
echo ""
echo "Copying frontend/nginx.conf..."
if [ ! -f "${PROJECT_ROOT}/frontend/nginx.conf" ]; then
    echo "Error: frontend/nginx.conf not found"
    exit 1
fi
cp "${PROJECT_ROOT}/frontend/nginx.conf" "${BUNDLE_DIR}/frontend/nginx.conf"
echo "Copied: frontend/nginx.conf"

# Copy frontend_txt directory
echo ""
echo "Copying frontend_txt/ directory..."
if [ ! -d "${PROJECT_ROOT}/frontend/frontend_txt" ]; then
    echo "Error: frontend/frontend_txt directory not found"
    exit 1
fi
cp -r "${PROJECT_ROOT}/frontend/frontend_txt" "${BUNDLE_DIR}/frontend/frontend_txt"
echo "Copied: frontend/frontend_txt/"

# Copy frontend_react directory excluding node_modules and dist
echo ""
echo "Copying frontend_react/ directory (excluding node_modules/ and dist/)..."
if [ ! -d "${PROJECT_ROOT}/frontend/frontend_react" ]; then
    echo "Error: frontend/frontend_react directory not found"
    exit 1
fi

# Use rsync to copy with exclusions
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude 'dist' \
    "${PROJECT_ROOT}/frontend/frontend_react/" "${BUNDLE_DIR}/frontend/frontend_react/"

echo "Copied: frontend/frontend_react/ (excluding node_modules/ and dist/)"

# Copy SSL certificates
echo ""
echo "Copying ssl/ directory..."
if [ ! -d "${PROJECT_ROOT}/ssl" ]; then
    echo "Warning: ssl/ directory not found. SSL certificates may be missing."
else
    mkdir -p "${BUNDLE_DIR}/ssl"
    if [ -f "${PROJECT_ROOT}/ssl/certificate.crt" ] && [ -f "${PROJECT_ROOT}/ssl/certificate.key" ]; then
        cp "${PROJECT_ROOT}/ssl/certificate.crt" "${BUNDLE_DIR}/ssl/certificate.crt"
        cp "${PROJECT_ROOT}/ssl/certificate.key" "${BUNDLE_DIR}/ssl/certificate.key"
        echo "Copied: ssl/certificate.crt and ssl/certificate.key"
    else
        echo "Warning: SSL certificate files not found in ssl/ directory."
    fi
fi

echo ""
echo "Bundle created successfully at: $BUNDLE_DIR"
echo ""
echo "To deploy, copy the lucasopoka-server directory to your server and run:"
echo "  docker-compose up -d"

