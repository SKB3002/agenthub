---
name: fastapi-expert
description: FastAPI-specific patterns and principles. Use when designing FastAPI apps — layered architecture, dependency injection, async patterns, lifespan management, and Pydantic integration.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# FastAPI Expert

> Principles for building production-grade FastAPI services in 2026.
> **Learn to THINK, not copy boilerplate.**

---

## ⚠️ How to Use This Skill

- ASK about the deployment target (edge, container, serverless)
- Choose sync vs async per endpoint, not globally
- Don't copy from old tutorials — FastAPI evolved significantly 2023-2026

---

## 1. Layered Architecture

### The Boundary Rule

```
Router ─► Controller ─► Service ─► Persistence ─► DB
 (HTTP)    (orchestration)  (logic)   (SQL)       (async driver)

Each layer calls ONLY the one directly below it.
```

| Layer | Concern | Owns |
|-------|---------|------|
| **Router** | Route definition, `response_model=` on every route | `app/api/v1/*_router.py` |
| **Controller** | Orchestration, maps domain errors → HTTP status | `app/controllers/` |
| **Service** | Business logic, LLM calls, pure functions | `app/services/` |
| **Persistence** | Raw SQL, named parameters only | `app/services/*_persistence.py` |

### Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| SQL inside routers or controllers | SQL only in persistence layer |
| Business logic in routes | Route delegates to controller/service |
| `HTTPException` raised from services | Raise domain exception → controller maps to HTTP |
| Reach across layers | Follow Router → Controller → Service → Persistence |

---

## 2. Async vs Sync Per Endpoint

### Decision

```
async def endpoint — when the handler awaits I/O:
├── Database calls (asyncpg, aiomysql, SQLAlchemy async)
├── HTTP calls (httpx.AsyncClient)
├── LLM / streaming APIs
└── Redis / message queues

def endpoint — when the handler is CPU-only or uses sync libs:
├── Pure computation
├── Sync DB driver you can't swap (psycopg2 legacy)
└── FastAPI runs these in a thread pool automatically
```

### The Trap

Mixing `requests` (sync) inside an `async def` blocks the event loop. Either:
- Use `httpx.AsyncClient` (preferred), OR
- Make the endpoint `def` so FastAPI threadpools it.

---

## 3. Dependency Injection

### Common Dependencies

| Dependency | Scope | Lifecycle |
|------------|-------|-----------|
| `get_db()` | Per-request | Yield, close on exit |
| `get_current_user()` | Per-request | Validates JWT / session |
| `get_settings()` | Cached | `@lru_cache` once per process |
| `get_llm_client()` | Cached | Singleton, module-level |

### Yield-Based Cleanup

```python
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

Yield runs cleanup **after the response is sent** — perfect for DB sessions and file handles.

### When to Use Dependency Overrides

```
Testing: app.dependency_overrides[get_db] = get_test_db
Feature flags: Swap a service based on settings
Multi-tenancy: Per-tenant DB resolution
```

---

## 4. Pydantic v2 Integration

### Schema Placement

| Schema Type | Where | Why |
|-------------|-------|-----|
| Request body | `app/schemas/` | Validated BEFORE controller |
| Response | `app/schemas/` | Set `response_model=` on route |
| Internal service state | `@dataclass` in service file | No runtime validation overhead |
| Config | Pydantic `BaseSettings` | `.env` → typed settings |

### The `response_model` Rule

Every route declares `response_model=SomeSchema`. This:
- Strips fields not in the schema (security — no accidental leaks)
- Generates accurate OpenAPI
- Validates responses in tests

### ConfigDict (v2 syntax)

```python
class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # was orm_mode in v1
    id: int
    email: str
```

---

## 5. Error Handling

### Domain → HTTP Mapping

```
Service raises: UserNotFound(user_id)
Controller catches: → raise HTTPException(404, ...)

Service raises: DuplicateEmail(email)
Controller catches: → raise HTTPException(409, ...)
```

### Global Exception Handlers

Register handlers in `app/main.py` for cross-cutting concerns:

| Handler | Purpose |
|---------|---------|
| `RequestValidationError` | Consistent 422 format |
| `IntegrityError` (SQLAlchemy) | Map DB constraint → 409 |
| `Exception` (catch-all) | Log + return opaque 500 |

### Never Do

❌ Expose stack traces or internal error messages to clients.
❌ Return different error shapes from different routes.
✅ Use one canonical error envelope across the API.

---

## 6. Lifespan Management

### The `lifespan` Context

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.db = await create_db_pool()
    app.state.llm = create_llm_client()
    yield
    # Shutdown
    await app.state.db.close()

app = FastAPI(lifespan=lifespan)
```

Replaces the deprecated `@app.on_event("startup")` / `@app.on_event("shutdown")` pattern.

### What Goes Where

| Startup | Shutdown |
|---------|----------|
| DB connection pools | Close connections |
| LLM / HTTP clients | Close httpx clients |
| Background schedulers | Stop schedulers |
| Warm caches | Flush metrics |

---

## 7. Configuration via Pydantic Settings

```python
# app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    gemini_api_key: str
    llm_model: str = "gemini-2.0-flash"

    log_level: str = "INFO"

settings = Settings()
```

### Rules

- **One `Settings` class** — not scattered `os.getenv` calls.
- **All config from env** — never hardcode secrets or URLs.
- **Type everything** — `int`, `bool`, `Literal["dev", "prod"]` catch misconfiguration at startup.
- **`.env.example`** always matches the `Settings` class 1:1.

---

## 8. Background Tasks

### Selection

| Need | Pick |
|------|------|
| Fire-and-forget, in-process, <1s | `BackgroundTasks` (FastAPI built-in) |
| Distributed, retries, scheduling | Celery, ARQ, Dramatiq |
| Async-native, lightweight | ARQ (Redis-based) |
| Heavy compute, GPU | External worker + message queue |

### BackgroundTasks Gotcha

```python
@router.post("/users")
async def create_user(bg: BackgroundTasks, db: DB = Depends(get_db)):
    user = await create(db, ...)
    bg.add_task(send_welcome_email, user.email)  # runs AFTER response
    return user
```

If the task needs the DB session, **capture what you need before yielding** — the session will be closed by the time the task runs.

---

## 9. Streaming Responses

### When to Stream

| Scenario | Method |
|----------|--------|
| LLM token-by-token | `StreamingResponse` + SSE |
| Large file download | `StreamingResponse` with chunks |
| Server-sent events | `StreamingResponse` with `text/event-stream` |

### SSE Example

```python
async def token_stream():
    async for token in llm.stream(prompt):
        yield f"data: {json.dumps({'token': token})}\n\n"

return StreamingResponse(token_stream(), media_type="text/event-stream")
```

---

## 10. Testing

### The Async Test Stack

| Layer | Tool |
|-------|------|
| Runner | `pytest` + `pytest-asyncio` (`asyncio_mode = "auto"`) |
| HTTP client | `httpx.AsyncClient(app=app)` — in-process, no network |
| DB | Transactional fixtures that rollback per test |
| Mocks | `unittest.mock.AsyncMock` for async methods |

### Test Client Pattern

```python
@pytest.fixture
async def client(db_session):
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

async def test_create_user(client):
    r = await client.post("/users", json={"email": "a@b.com"})
    assert r.status_code == 201
```

---

## 11. Performance

| Bottleneck | Fix |
|------------|-----|
| Sync blocking in async path | Switch to async library or `run_in_threadpool` |
| N+1 queries | SQLAlchemy `selectinload()` / batch fetch |
| Large JSON serialization | `orjson` via `FastAPI(default_response_class=ORJSONResponse)` |
| Redundant validation | `response_model_exclude_unset=True` on partial updates |
| Too many DB connections | Pool size + `pool_pre_ping=True` |

---

## 12. Production Checklist

- [ ] `response_model=` on every route (never leak fields)
- [ ] All DB access through persistence layer
- [ ] Settings class typed + `.env.example` synced
- [ ] Global exception handlers registered
- [ ] `lifespan` handles startup/shutdown
- [ ] CORS configured (deny by default, allow-list in prod)
- [ ] Request size limits (uvicorn `--limit-max-requests`)
- [ ] Structured logging (JSON format for log aggregators)
- [ ] `/health` endpoint that checks downstream deps
- [ ] gunicorn + uvicorn workers in prod (not `uvicorn --reload`)

---

## 13. Anti-Patterns

### ❌ DON'T
- Mix SQL into controllers or routers
- Use `requests` inside `async def` (blocks the event loop)
- Skip `response_model` (leaks DB fields)
- Hardcode config values
- Use `@app.on_event` (deprecated — use `lifespan`)
- Run `uvicorn --reload` in production
- Catch `Exception` everywhere without logging

### ✅ DO
- Respect the layer boundary
- Pick async vs sync per endpoint
- Validate at the edge with Pydantic
- Separate domain exceptions from HTTP exceptions
- Stream LLM and large responses
- Use `asyncio_mode = "auto"` in tests

---

> **Remember:** FastAPI's power is enforcing contracts at boundaries. Use Pydantic, `response_model`, and dependency injection to make the app impossible to misuse.
