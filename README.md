# Onoma

![Onoma banner](branding/onoma-banner.jpg)

> **Live transcript first. Keep the context.**
>
> Onoma turns YouTube’s spoken layer into searchable, timestamped context before heavier video processing is needed.

Onoma is a public prototype for transcript-first video exploration. Paste a YouTube URL, load its available captions, search the timestamped segments, and click a line to seek the embedded player. The current milestone deliberately stops before AI calls or visual frame inspection so the transcript and cache behavior can be tested independently.

## Start here

The shortest path for a new developer is:

```bash
git clone https://github.com/adnqcr7-code/onoma-video.git
cd onoma-video
pnpm install
pnpm setup
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). `pnpm setup` creates a local `.env`, starts the MySQL database with Docker Compose, and applies the Drizzle schema. The first database startup can take a little longer while MySQL initializes.

## Prerequisites

| Requirement | Recommended version | Why it is needed |
|---|---:|---|
| Node.js | 20 or newer | Runs the server, Vite, and setup scripts |
| pnpm | 10 or newer | Installs the locked dependency tree and runs project scripts |
| Docker Desktop | Current stable release | Runs the local MySQL database with one command |
| Git | Any recent version | Clones the repository and tracks changes |

Node.js can be installed from [nodejs.org](https://nodejs.org/), pnpm instructions are available in the [pnpm documentation](https://pnpm.io/installation), and Docker Desktop is available from [docker.com](https://www.docker.com/products/docker-desktop/).

## What the setup command does

The setup command is intentionally transparent. It creates `.env` from [`docs/local-environment.example`](docs/local-environment.example) if no local environment file exists, generates a random development-only JWT secret, starts the `db` service from [`docker-compose.yml`](docker-compose.yml), waits for the migration command to complete, and prints the local URL.

The generated `.env` is ignored by Git and should never be committed. Authentication variables are optional for exploring the public transcript workspace. The transcript provider only needs the local database and network access to YouTube captions.

## Daily development commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the full-stack development server with hot reload |
| `pnpm check` | Run the TypeScript compiler without emitting files |
| `pnpm test` | Run the Vitest unit test suite |
| `pnpm verify` | Run type checks, tests, and a production build |
| `pnpm db:start` | Start the local MySQL container |
| `pnpm db:stop` | Stop the local MySQL container without deleting data |
| `pnpm db:generate` | Generate migration SQL after editing `drizzle/schema.ts` |
| `pnpm db:migrate` | Apply generated migrations to the configured database |
| `pnpm format` | Format project files with Prettier |

For a normal work session, run `pnpm dev`. For a clean handoff, run `pnpm verify` before opening a pull request.

## Transcript architecture

The server exposes the public tRPC procedure `video.getTranscript`. It accepts a YouTube URL or video ID, fetches the selected caption language, normalizes caption offsets into millisecond timestamps, and stores the result in two database tables: `videos` for cache metadata and `transcriptSegments` for searchable segments.

Cached records last 24 hours. Cache keys include both the YouTube video ID and language, so English and other supported caption tracks remain isolated. If captions are unavailable, the procedure returns an honest unavailable state and the interface keeps its clearly labeled demo transcript visible for exploration.

> **Current boundary:** AI model invocation, frame extraction, and visual inspection are not connected yet. This makes the repository easy to test without requiring an AI key.

## Database changes

Edit [`drizzle/schema.ts`](drizzle/schema.ts), then generate and apply a migration:

```bash
pnpm db:generate
pnpm db:migrate
```

Do not edit an already-applied migration. Create a new migration for each schema change and review its SQL before applying it to a shared database.

## Troubleshooting

If `pnpm setup` says Docker Compose is missing, install Docker Desktop, make sure it is running, and run the command again. If port `3306` is already occupied, stop the other MySQL service or change the published port in `docker-compose.yml` and update `DATABASE_URL` in `.env`.

If the app starts but a video reports unavailable captions, try another public video or a different language. Some videos have captions disabled, restricted, or unavailable to automated clients; this is a provider limitation rather than a frontend failure.

If the schema and database drift, stop the app, confirm that the local MySQL container is running with `pnpm db:start`, and run `pnpm db:migrate`. Avoid deleting the Docker volume unless you intentionally want to discard local data.

## Repository map

| Path | Role |
|---|---|
| `client/src/pages/Home.tsx` | Public transcript-first workspace |
| `server/transcripts.ts` | YouTube caption provider and cache orchestration |
| `server/routers.ts` | Typed tRPC API procedures |
| `server/db.ts` | Drizzle database connection and user helpers |
| `drizzle/schema.ts` | Database model definitions |
| `scripts/setup.mjs` | One-command local bootstrap |
| `docs/local-environment.example` | Safe configuration reference |

## License

Onoma is released under the MIT License. See [`LICENSE`](LICENSE) if present in the repository.

## References

[1]: https://nodejs.org/ — Node.js official website
[2]: https://pnpm.io/installation — pnpm installation documentation
[3]: https://docs.docker.com/desktop/ — Docker Desktop documentation
