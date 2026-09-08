#!/bin/bash

# Script to process ext2 image and create chunked images for CheerpX

set -e  # Exit on any error

# Configuration
EXT2_IMAGE="disk-images/debian_mini_20230519_5022088024.ext2"
PUBLIC_DIR="frontend/frontend_react/public"
MOUNT_POINT="/tmp/ext2_mount"
OUTPUT_DIR="frontend/frontend_react/public/disk-images"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root (needed for mounting)
if [[ $EUID -ne 0 ]]; then
   echo_error "This script must be run as root (use sudo)"
   exit 1
fi

# Check if ext2 image exists
if [[ ! -f "$EXT2_IMAGE" ]]; then
    echo_error "Ext2 image not found: $EXT2_IMAGE"
    exit 1
fi

# Check if public directory exists
if [[ ! -d "$PUBLIC_DIR" ]]; then
    echo_error "Public directory not found: $PUBLIC_DIR"
    exit 1
fi

echo_info "Starting ext2 image processing..."

# Create mount point
echo_info "Creating mount point: $MOUNT_POINT"
mkdir -p "$MOUNT_POINT"

# Create output directory
echo_info "Creating output directory: $OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# Empty the output directory if it already exists and has content
if [[ -d "$OUTPUT_DIR" ]] && [[ "$(ls -A "$OUTPUT_DIR" 2>/dev/null)" ]]; then
    echo_info "Emptying existing disk-images directory..."
    rm -rf "${OUTPUT_DIR:?}"/*
fi

# Create a working copy of the ext2 image
echo_info "Creating working copy of ext2 image..."
WORKING_IMAGE="/tmp/working_ext2.ext2"
cp "$EXT2_IMAGE" "$WORKING_IMAGE"

# Unmount if already mounted
if mountpoint -q "$MOUNT_POINT"; then
    echo_info "Unmounting existing mount at: $MOUNT_POINT"
    umount "$MOUNT_POINT"
fi

# Add 10MB to the working copy to accommodate the directories
echo_info "Adding 10MB to ext2 image for directories..."
CURRENT_SIZE=$(stat -c%s "$WORKING_IMAGE")
NEW_SIZE=$((CURRENT_SIZE + 10485760))  # Add 10MB (10 * 1024 * 1024)

echo_info "Current size: $CURRENT_SIZE bytes"
echo_info "New size: $NEW_SIZE bytes"

# Check filesystem before resizing
echo_info "Checking filesystem before resize..."
e2fsck -f -y "$WORKING_IMAGE" || echo_warn "Filesystem check completed with warnings"

# Resize the image file
truncate -s "$NEW_SIZE" "$WORKING_IMAGE"

# Resize the filesystem
resize2fs "$WORKING_IMAGE"

# Mount the working copy
echo_info "Mounting working ext2 image: $WORKING_IMAGE"
mount -o loop "$WORKING_IMAGE" "$MOUNT_POINT"

# Copy only specific directories (home, contact, pong) to the /home/user directory in the mounted image
echo_info "Copying home, contact, and pong directories to /home/user in ext2 image..."
# Copy the specific directories
cp -r "$PUBLIC_DIR/home" "$MOUNT_POINT/home/user/"
cp -r "$PUBLIC_DIR/contact" "$MOUNT_POINT/home/user/"
cp -r "$PUBLIC_DIR/pong" "$MOUNT_POINT/home/user/"

# Set proper permissions
echo_info "Setting permissions..."
chmod -R 755 "$MOUNT_POINT"

# Sync filesystem to ensure all changes are written
echo_info "Syncing filesystem..."
sync

# Unmount the image
echo_info "Unmounting ext2 image..."
umount "$MOUNT_POINT"

# Create a backup of the original image
echo_info "Creating backup of original image..."
cp "$EXT2_IMAGE" "${EXT2_IMAGE}.backup"


# Create chunked images directly in the target directory
echo_info "Creating chunked images directly in frontend/frontend_react/public/disk-images..."
cd "$OUTPUT_DIR"
# Use exact same split command as GitHub workflow
split "$WORKING_IMAGE" "$(basename "$EXT2_IMAGE").c" -a 6 -b 128k -x --additional-suffix=.txt
# Create .meta file with file size
stat -c%s "$WORKING_IMAGE" > "$(basename "$EXT2_IMAGE").meta"
# Return to project root
cd - > /dev/null

# Clean up mount point and working image
rmdir "$MOUNT_POINT"
rm -f "$WORKING_IMAGE"

# Files are already created directly in the target directory
echo_info "Chunked files created directly in frontend/frontend_react/public/disk-images"

echo_info "Processing complete!"
echo_info "Chunked images created directly in:"
echo_info "  - frontend/frontend_react/public/disk-images/ (chunk files and .meta file)"
echo_info "Meta file: frontend/frontend_react/public/disk-images/$(basename "$EXT2_IMAGE").meta"
echo_info "Original image backed up as: ${EXT2_IMAGE}.backup"

# Display chunk count
echo_info "Chunk files created:"
if [[ -d "frontend/frontend_react/public/disk-images" ]]; then
    CHUNK_COUNT=$(find "frontend/frontend_react/public/disk-images" -maxdepth 1 -name '*.c*' | wc -l)
    echo_info "Number of chunk files: $CHUNK_COUNT"
else
    echo_error "public/disk-images directory not found"
fi

echo_info "Script completed successfully!"
