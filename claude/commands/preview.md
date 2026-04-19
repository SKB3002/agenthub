---
description: Start, stop, or check the local dev / preview server.
argument-hint: [start|stop|restart|check]
tier: LIGHT
tier-rationale: Process management only — no agents, runs a single background command.
estimated-tokens: "2k–8k"
risk: None at this tier; if the dev server itself is costly to start that's outside our scope.
---

# /preview — Local Preview Management

$ARGUMENTS

---

## Task

Manage the local dev / preview server. This command reads the repo's conventions (package.json scripts, pyproject.toml, Makefile, etc.) and runs the right command.

### Sub-commands

```
/preview           — show current status
/preview start     — start server
/preview stop      — stop server
/preview restart   — restart
/preview check     — health check
```

---

## Server Selection

| Stack | Dev Command |
|-------|-------------|
| Next.js | `npm run dev` (port 3000) |
| Vite / Nuxt | `npm run dev` (port 5173 / 3000) |
| Express / Fastify | `npm run dev` or `node index.js` |
| FastAPI | `uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload` |
| Django | `python manage.py runserver 0.0.0.0:8000` |
| Flask | `flask --app app run --debug` |
| React Native | `npx expo start` |

---

## Usage

### Start

```
/preview start

🚀 Starting preview…
   Port: 8080
   Stack: FastAPI (uvicorn)

✅ Preview ready: http://localhost:8080
   Docs: http://localhost:8080/docs
```

### Status

```
/preview

=== Preview Status ===
🌐 URL: http://localhost:8080
📁 Project: <cwd>
🏷 Stack: fastapi
💚 Health: OK (GET /health → 200)
```

### Port Conflict

```
/preview start

⚠ Port 8080 is in use.
Options:
  1. Start on port 8081
  2. Kill process on 8080
  3. Specify different port

Which? (default: 1)
```

---

## Health Check

After starting, verify the server is live:

| Stack | Health URL |
|-------|-----------|
| Any | `GET /health` if the app exposes it |
| Next.js | `GET /` returns HTML |
| FastAPI | `GET /docs` or `/health` |

Report failures with the HTTP status and the last 20 lines of server logs.

---

## Notes

- Prefer the repo's own dev script if one exists (`npm run dev`, `make dev`)
- Never start two dev servers on the same port
- Stop cleanly — don't leave orphaned `uvicorn` / `node` processes
