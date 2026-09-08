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

## Checks

All run from `frontend/frontend_react`, and are what CI runs on every PR:
```bash
npm run lint          # eslint
npm run format:check  # prettier
npm run typecheck     # tsc -b
npm run test          # vitest
```
`npm run format` applies Prettier's fixes; `npm run test:coverage` also writes `coverage/`.

## Git hooks

One-time per clone (not automated via `npm install` since `package.json` and the git root live in
different directories):
```bash
git config core.hooksPath .husky
```
This wires up a pre-commit hook that runs `lint-staged` (eslint + prettier on staged files only).
It's a convenience — CI is the actual authority and runs everything regardless.

## Docker

Build and run the full stack (app + a local Caddy edge proxy) with Docker Compose:
```bash
docker compose -f docker-compose.local.yml up --build
```

The site will be available at:
- HTTPS: https://localhost:8443 (React version — Caddy issues its own local certificate
  automatically via `tls internal`; your browser will warn about it being untrusted, which is
  expected for local dev)
- HTTP: http://localhost:8080 (redirects browsers to HTTPS; `curl http://localhost:8080` gets the
  text version)

## Deployment

Production (`lucasopoka.com`) and staging (`staging.lucasopoka.com`) both run on the same VPS,
each as its own Docker Compose project, behind a shared Caddy reverse proxy that automatically
provisions and renews HTTPS certificates — see the separate, private
[`vps-infra`](https://github.com/LucasOpoka/vps-infra) repo for that shared proxy config; it isn't
part of this repo since it isn't specific to this site. Deploys happen via GitHub Actions: pushing
to `develop` deploys to staging, pushing to `main` (via a reviewed `develop` → `main` pull
request, opened automatically by the `release` workflow) deploys to production. See
`deploy/deploy.sh` for the health-check-and-rollback logic used on every deploy — it's meant to be
runnable by hand identically to how CI runs it.

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