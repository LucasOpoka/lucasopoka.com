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