# musicapp

musicapp is a private-first social music platform. The first product milestone is verified music sharing: a verified user can upload an approved music file, see it in From Your Personal Archive, play it, and share it in a direct message as a playable music card.

## Development Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn-style local UI components
- PostgreSQL
- Prisma
- Auth.js-ready data model
- Local filesystem music storage
- Redis and BullMQ
- Local email preview
- Playwright

## Local Setup

1. Install dependencies.

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" install
```

2. Copy the environment example.

```powershell
Copy-Item .env.example .env
```

3. Start local services.

```powershell
docker compose up -d
```

4. Generate the Prisma client.

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" db:generate
```

5. Run the app.

```powershell
node "C:\Users\pnden\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" dev
```

## Local Service URLs

- App: `http://localhost:3000`
- Mail preview: `http://localhost:8025`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## File Rules

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
