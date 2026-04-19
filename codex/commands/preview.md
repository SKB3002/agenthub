---
name: preview
description: Start/stop the dev server and show the local URL.
argument-hint: [start|stop|url]
tier: LIGHT
estimated-tokens: "<2k"
platform: codex
---

# /hub:preview — Dev Server

$ARGUMENTS

Stack-aware: `uvicorn` for FastAPI, `npm run dev` for Next.js/Vite, `cargo run` for Rust, `go run .` for Go.

- `start` (default) → detect stack, start server, print URL
- `stop` → kill the dev process
- `url` → print the URL without starting

No agent dispatch.
