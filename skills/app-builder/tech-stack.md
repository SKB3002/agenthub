# Tech Stack Selection (2026)

> Default and alternative technology choices for web applications.

## Default Stack (Web App - 2026)

```yaml
Frontend:
  framework: Next.js 16 (Stable)
  language: TypeScript 5.7+
  styling: Tailwind CSS v4
  state: React 19 Actions / Server Components
  caching: Next.js 16 Cache Components (Stable)
  bundler: Turbopack (Stable for Dev & Build)

Backend:
  runtime: Node.js 23
  framework: Next.js API Routes / Hono (for Edge)
  validation: Zod / TypeBox

Database:
  primary: PostgreSQL
  orm: Prisma / Drizzle
  hosting: Supabase / Neon

Auth:
  provider: Auth.js (v5) / Clerk

Monorepo:
  tool: Turborepo 2.0
```

## Alternative Options

| Need | Default | Alternative |
|------|---------|-------------|
| Real-time | - | Supabase Realtime, Socket.io |
| File storage | - | Cloudinary, S3 |
| Payment | Stripe | LemonSqueezy, Paddle |
| Email | - | Resend, SendGrid |
| Search | - | Algolia, Typesense |

---

## Python Default Stack (API / AI services - 2026)

```yaml
Backend:
  framework: FastAPI
  runtime: Python 3.12+
  server: uvicorn (dev) / gunicorn + uvicorn workers (prod)
  validation: Pydantic v2

Database:
  primary: PostgreSQL
  orm: SQLAlchemy 2.0 (async)
  migrations: Alembic
  drivers: asyncpg (PG) / aiomysql (MySQL)

Auth:
  tokens: python-jose (JWT)
  oauth: authlib / fastapi-users

Background work:
  simple: FastAPI BackgroundTasks
  distributed: Celery / ARQ / Dramatiq

Testing:
  runner: pytest (+ pytest-asyncio, asyncio_mode="auto")
  client: httpx AsyncClient / FastAPI TestClient

Observability:
  tracing: OpenTelemetry
  LLM: Langfuse / LangSmith / Arize Phoenix
```

### Alternative Python Frameworks

| Need | Pick |
|------|------|
| Full-stack + admin | Django 5+ (async views, built-in admin) |
| Minimal / scripts | Flask or Starlette directly |
| Async-native ORM | SQLModel, Tortoise ORM |
| ML model serving | FastAPI + BentoML / Ray Serve |
