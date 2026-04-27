# musicapp Architecture

musicapp is being built as a free local development app first, with clear replacement points for paid production services later.

## Current Development Choices

- Next.js owns the web app, routes, and product screens.
- PostgreSQL stores users, songs, messages, comments, follows, and product events.
- Prisma defines the database shape in one readable file.
- Local filesystem storage holds music files during development.
- Local email preview handles verification emails during development.
- Redis and BullMQ handle background work such as media processing.
- PostgreSQL search supports archive, public, and shared search first.

## Replacement Points

The app uses internal provider files so the product code calls one business action instead of a specific vendor.

- `lib/storage` can move from local files to AWS S3.
- `lib/email` can move from local preview to Resend.
- `lib/events` can move from local event records to PostHog.
- `lib/search` can move from PostgreSQL search to OpenSearch.
- `lib/queue` can move from local Redis to hosted Redis.
- `lib/lastfm` can move from mocked local status to real Last.fm scrobbling once keys are configured.

## Product Rules Captured In The Foundation

- Users must have verified email before product actions are enabled.
- Music upload types are limited to `.mp3`, `.mp4`, `.wav`, and `.flac`.
- Image media for social use is separated from music media.
- Search is separated into From Your Personal Archive, Public Uploads, and Shared With You.
- Messages can contain playable song cards.
- Group chat rules and verification badge review are represented in the data model for later implementation.
- Usernames are represented as unique profile identifiers.
- Profile banners are limited to `.png`, `.jpg`, `.jpeg`, and `.gif`.
- Membership entitlements separate Free and Plus behavior before billing is added.
- Free members can receive banner and between-song ads.
- Plus members are represented as ad-free, with doubled message file limits and custom emoji access.
- Last.fm listening status supports musicapp now-playing first, then Last.fm recent-track fallback.
