#!/bin/bash

# Script to copy ASCII art files from AsciiArt to frontend directories
# Usage: ./copy_ascii_art.sh

set -e  # Exit on error

# Get the script directory (AsciiArt directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ASCII_ART_DIR="$SCRIPT_DIR"

# Check if AsciiArt directory exists
if [[ ! -d "$ASCII_ART_DIR" ]]; then
    echo "Error: AsciiArt directory not found at $ASCII_ART_DIR"
    exit 1
fi

# Function to copy a file
copy_file() {
    local source_file="$1"
    local dest_file="$2"
    
    if [[ ! -f "$source_file" ]]; then
        echo "Warning: Source file $source_file does not exist, skipping..."
        return 1
    fi
    
    # Create destination directory if it doesn't exist
    mkdir -p "$(dirname "$dest_file")"
    
    # Copy the file
    cp "$source_file" "$dest_file"
    echo "Copied: $source_file -> $dest_file"
}

# Copy files to frontend_txt
echo "Copying files to frontend_txt..."
copy_file "${ASCII_ART_DIR}/pong" "${PROJECT_ROOT}/frontend/frontend_txt/pong"
copy_file "${ASCII_ART_DIR}/home" "${PROJECT_ROOT}/frontend/frontend_txt/home"
copy_file "${ASCII_ART_DIR}/contact" "${PROJECT_ROOT}/frontend/frontend_txt/contact"

# Copy files to frontend_react/public
echo ""
echo "Copying files to frontend_react/public..."
copy_file "${ASCII_ART_DIR}/pong" "${PROJECT_ROOT}/frontend/frontend_react/public/pong/pong"
copy_file "${ASCII_ART_DIR}/home" "${PROJECT_ROOT}/frontend/frontend_react/public/home/home"
copy_file "${ASCII_ART_DIR}/contact" "${PROJECT_ROOT}/frontend/frontend_react/public/contact/contact"

echo ""
echo "All files copied successfully!"

