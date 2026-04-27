# musicapp

musicapp is a private-first social music platform.

The first product milestone is **Verified Music Sharing**:

A verified user can upload an approved music file, see it in **From Your Personal Archive**, play it in the app, and share it in a direct message as a playable music card.

This repository is designed for a free local development phase first. The code is structured so local tools can later be replaced with paid production services without rebuilding the product.

## What This App Is Building Toward

musicapp should feel like:

- 50% social media
- 50% music platform

Core product rules:

- Users must verify email before using the app.
- Music uploads are limited to `.mp3`, `.mp4`, `.wav`, and `.flac`.
- Search is grouped by **From Your Personal Archive**, **Public Uploads**, and **Shared With You**.
- Music shared in messages must appear as a playable card, not a generic attachment.
- Reactions can be added to messages.
- Social media image files are separate from music uploads.

## Free Development Stack

| Area | Tool | Why It Exists |
|---|---|---|
| Web app | Next.js | Main website and app framework |
| Language | TypeScript | Helps prevent code mistakes before runtime |
| Styling | Tailwind CSS | Consistent app styling |
| UI components | Local shadcn-style components | Reusable buttons, cards, inputs, badges, and layout pieces |
| Database | PostgreSQL | Stores users, songs, messages, comments, likes, reposts, and events |
| Database access | Prisma | Keeps the data model readable and controlled |
| Local file storage | Filesystem | Stores uploaded music during development |
| Background jobs | BullMQ | Prepares the app for media processing work |
| Queue engine | Redis | Supports background job processing |
| Local email preview | Mailpit | Lets developers view verification emails without sending real email |
| Testing | Playwright | Supports browser-based product flow tests |
| Code quality | ESLint and TypeScript | Checks code before it is merged |
| Local services | Docker Compose | Starts PostgreSQL, Redis, and Mailpit together |

## Future Production Replacements

The app uses internal provider files so we can start free and switch later.

| Current Development Tool | Future Production Tool |
|---|---|
| Local file storage | AWS S3 |
| Local file delivery | CloudFront |
| Mailpit email preview | Resend |
| Local PostgreSQL | Managed PostgreSQL |
| Local Redis | Hosted Redis |
| PostgreSQL search | OpenSearch later |
| Local event logging | PostHog |
| Local logs | Sentry and Axiom |

## Required Software

Install these before running the app:

1. **Git**

   Used to clone the repository and manage code changes.

2. **Node.js**

   Used to run the Next.js app and development tools.

   Recommended: Node.js 24 or newer.

3. **pnpm**

   Used as the package manager.

   If pnpm is not installed, install it with:

   ```powershell
   npm install -g pnpm
   ```

4. **Docker Desktop**

   Used to run PostgreSQL, Redis, and Mailpit locally.

5. **GitHub account access**

   Required if you want to push changes back to this repository.

## Clone The Repository

```powershell
git clone https://github.com/simulatetheplanet/musicapp.git
cd musicapp
```

If you are already working from the local Codex workspace, the project is here:

```powershell
C:\Users\pnden\OneDrive\Documents\New project
```

## Install Dependencies

Run:

```powershell
pnpm install
```

If Windows blocks the `pnpm` command, run pnpm through Node directly:

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" install
```

Decision context:

The project uses `pnpm-lock.yaml` so every developer installs the same dependency versions.

## Create The Local Environment File

Copy the example file:

```powershell
Copy-Item .env.example .env
```

The `.env` file is local only and must not be committed to GitHub.

Expected local values:

```env
DATABASE_URL="postgresql://musicapp:musicapp@localhost:5432/musicapp?schema=public"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-local-development-secret"
STORAGE_PROVIDER="local"
EMAIL_PROVIDER="local"
ANALYTICS_PROVIDER="local"
```

Why this exists:

- `DATABASE_URL` connects the app to local PostgreSQL.
- `REDIS_URL` connects the app to local Redis.
- `NEXTAUTH_URL` tells auth flows where the local app runs.
- `NEXTAUTH_SECRET` is required by the auth system.
- Provider settings keep local development separate from future paid production tools.

## Start Local Services

Make sure Docker Desktop is running.

Then start the local services:

```powershell
docker compose up -d
```

This starts:

- PostgreSQL at `localhost:5432`
- Redis at `localhost:6379`
- Mailpit at `http://localhost:8025`

Check service status:

```powershell
docker compose ps
```

Stop services when done:

```powershell
docker compose down
```

## Generate Prisma Client

Run:

```powershell
pnpm db:generate
```

If Windows blocks pnpm:

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" db:generate
```

Why this exists:

Prisma reads `prisma/schema.prisma` and generates the database client used by the app.

## Run The App

Start the development server:

```powershell
pnpm dev
```

If Windows blocks pnpm:

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" dev
```

Open:

```text
http://localhost:3000
```

## Confirm The App Is Working

When the app loads, you should see:

- `musicapp` in the left navigation
- a search bar
- **From Your Personal Archive**
- **Public Uploads**
- **Shared With You**
- a **Messages** panel
- a **PEOPLE YOU SHOULD FOLLOW** section
- a bottom music player

Basic manual checks:

1. Search for `cloudrap`.
2. Confirm **Late Room Demo** remains visible.
3. Confirm unrelated songs disappear from the filtered list.
4. Click a playable song card.
5. Confirm the bottom music player updates.
6. Right-click a message.
7. Confirm reaction options appear.

## Quality Checks

Run TypeScript checks:

```powershell
pnpm typecheck
```

Run lint checks:

```powershell
pnpm lint
```

Run a production build:

```powershell
pnpm build
```

These checks should pass before pushing changes.

## Browser Tests

The project includes a Playwright test:

```text
tests/e2e/home.spec.ts
```

Run it with:

```powershell
pnpm test:e2e
```

If Playwright says the browser is missing, install Chromium:

```powershell
pnpm exec playwright install chromium
```

Decision context:

Playwright is used for repeatable product workflow testing. It is not required for manually running the app during early development.

## Important Files And Folders

| Path | Purpose |
|---|---|
| `app/` | Next.js app pages and layout |
| `components/` | Reusable app UI and product screen components |
| `lib/` | Business logic, service boundaries, validation, search, email, storage, and events |
| `prisma/schema.prisma` | Main data model |
| `prisma.config.ts` | Prisma 7 database configuration |
| `docker-compose.yml` | Local PostgreSQL, Redis, and Mailpit setup |
| `.env.example` | Safe example environment settings |
| `.env` | Local secrets and settings, never committed |
| `docs/architecture.md` | Architecture explanation and future replacement points |
| `.github/workflows/ci.yml` | GitHub quality checks |

## File Upload Rules

Music uploads are limited to:

- `.mp3`
- `.mp4`
- `.wav`
- `.flac`

Social image media is limited to:

- `.png`
- `.jpg`
- `.jpeg`
- `.gif`

Reason:

Music files and social image files are handled as separate categories. This keeps upload validation clear and safer.

## Do Not Commit These

Never commit:

- `.env`
- passwords
- API keys
- auth secrets
- uploaded music files
- local build output
- `node_modules`
- `.next`
- local test output

These are already covered by `.gitignore`.

## Common Issues

### `pnpm` Is Not Recognized

Install pnpm:

```powershell
npm install -g pnpm
```

Then close and reopen PowerShell.

### Windows Blocks `pnpm`

Use the direct Node command:

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" dev
```

### Docker Services Are Not Running

Start Docker Desktop first.

Then run:

```powershell
docker compose up -d
```

### Prisma Cannot Find `DATABASE_URL`

Confirm `.env` exists:

```powershell
Get-Content .env
```

If it does not exist:

```powershell
Copy-Item .env.example .env
```

### Port `3000` Is Already In Use

Run the app on another port:

```powershell
pnpm dev -- --port 3001
```

Then open:

```text
http://localhost:3001
```

## Current Project Status

Completed:

- Next.js app foundation
- TypeScript setup
- Tailwind styling
- first interactive product shell
- local upload validation
- searchable sample songs
- playable music cards
- message panel with playable song card
- right-click message reactions
- bottom music player
- Prisma data model
- Docker local services
- CI quality checks
- architecture documentation

Not completed yet:

- real authentication screens
- real email verification flow
- real file upload persistence through the UI
- database migrations
- real direct message persistence
- group chats
- comments
- artist verification review flow
- recommendation engine
