## Development

Dev:
```bash
cd frontend/frontend_react
npm install
npm run dev
```

## Building

Build:
```bash
cd frontend/frontend_react
npm install
npm run build
```

## Docker

Build and run with Docker Compose:
```bash
docker compose up --build
```

The site will be available at:
- HTTPS: https://localhost:8000 (React version)
- HTTP: http://localhost:8000 (Text version for curl user agents)

## Disk Images

Download ext2 image with:
```bash
curl -L -O "https://github.com/leaningtech/webvm/releases/download/ext2_image/debian_mini_20230519_5022088024.ext2"
```

## ASCII Art

Copy ASCII art files from the `AsciiArt/` directory to the frontend directories:

```bash
./copy_ascii_art.sh
```

This script copies the ASCII art files (`pong`, `home`, `contact`) from `AsciiArt/` to:
- `frontend/frontend_txt/` (for the text version)
- `frontend/frontend_react/public/` (for the React version)

Run this script whenever you update the ASCII art files in the `AsciiArt/` directory.