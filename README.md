# Onoma

> Live transcript first. Keep the context.

Onoma is an open product experiment for lower-compute AI conversations about YouTube videos. It turns the spoken layer into timestamped, searchable context and reserves visual inspection for explicit moments such as “look at 10 seconds” or “what is on screen at 1:20?”

## What is working in this prototype

The public frontend includes a transcript-first workspace with a YouTube URL loader, embedded player, clickable transcript windows, timestamp seeking, transcript search, and live backend transcript loading with cache-state feedback.

Onoma now retrieves timestamped YouTube captions server-side and caches normalized segments for 24 hours. If a video has no accessible captions, the UI keeps the demo transcript visible and explains the limitation. AI model invocation and visual frame inspection are intentionally deferred for now.

## Future AI boundary

The future AI integration can expose three small tools, but they are not connected in this milestone:

- `get_video_context`: return relevant timestamped transcript passages.
- `inspect_video_timestamp`: inspect visual evidence near an explicit timestamp.
- `get_video_timeline`: return a compact topic outline with timestamps.

The detailed architecture and JSON contracts are documented in `youtube-video-tool-design.md` at the project root when developing locally, alongside the implementation notes in `ideas.md`.

## Local development

```bash
pnpm install
pnpm dev
```

The app is a React 19 + Vite + Tailwind 4 static frontend. It can be hosted as a static site today; a later backend can add caption providers, transcript caching, permissions, and visual adapters without changing the core workspace interaction.

## Product principles

1. **Transcript first:** spoken content is the default context source.
2. **Vision on request:** visual processing is explicit and narrow.
3. **Timestamped evidence:** answers should point back to the original video.
4. **Honest capability labels:** previews, exact frames, and unavailable sources remain distinct.

## Roadmap

1. Add a provider interface for permitted caption retrieval and transcript normalization.
2. Add a persistent transcript cache and full-text search endpoint.
3. Connect the three tool schemas to an AI client.
4. Add an authorized visual adapter for exact frame inspection.
5. Add transcript provenance, confidence labels, and user corrections.

## License

MIT
