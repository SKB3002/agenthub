---
name: sqlalchemy-expert
description: SQLAlchemy 2.0 async patterns, session management, query optimization, and Alembic migrations. Use when designing Python data access layers with SQLAlchemy.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# SQLAlchemy 2.0 Expert

> Modern async-first SQLAlchemy patterns for production Python services.
> **Learn to THINK about the session lifecycle, not copy query strings.**

---

## ⚠️ How to Use This Skill

- ASK whether the service is async or sync before choosing the API
- Default to SQLAlchemy 2.0 style (`select()`, `Mapped[]`, typed) — NOT the legacy 1.4 Query API
- If raw SQL fits better, use it — an ORM isn't mandatory

---

## 1. When to Use SQLAlchemy vs Raw SQL

### Decision Matrix

| Use SQLAlchemy when… | Use Raw SQL when… |
|----------------------|-------------------|
| Multi-table ORM relationships | Complex analytics / window functions |
| Migrations via Alembic | Bulk ETL / data pipelines |
| Schema-driven app | Single known query, perf critical |
| Team wants type safety | DB-specific features (CTE, LATERAL) |

### Hybrid Pattern (Recommended)

```
ORM for CRUD + relationships.
Raw SQL (via session.execute(text(...))) for reports and hot paths.
Both share the same session + transaction.
```

---

## 2. Async Setup (SQLAlchemy 2.0)

### Engine & Session

```python
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

engine = create_async_engine(
    settings.database_url,       # postgresql+asyncpg://... or mysql+aiomysql://...
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,          # detect stale connections
    echo=settings.debug,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,      # keep objects usable after commit
)
```

### Driver Matrix

| DB | Sync Driver | Async Driver | Dialect |
|----|-------------|--------------|---------|
| PostgreSQL | psycopg2 / psycopg3 | **asyncpg** | `postgresql+asyncpg` |
| MySQL | PyMySQL | **aiomysql** | `mysql+aiomysql` |
| SQLite | sqlite3 | **aiosqlite** | `sqlite+aiosqlite` |
| SQL Server | pyodbc | aioodbc | `mssql+aioodbc` |

---

## 3. Session Management

### The Golden Rule

**One session per request, one transaction per logical unit of work.**

### FastAPI Dependency

```python
async def get_db() -> AsyncIterator[AsyncSession]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

### Transactions

| Pattern | Use |
|---------|-----|
| `async with session.begin():` | Explicit transaction block |
| `async with session.begin_nested():` | Savepoint (nested transaction) |
| Auto-commit on dep yield | Default request lifecycle |

---

## 4. Modern Model Style (SQLAlchemy 2.0)

### Typed `Mapped[]` Syntax

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, ForeignKey

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    posts: Mapped[list["Post"]] = relationship(back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    author: Mapped[User] = relationship(back_populates="posts")
```

### Benefits Over 1.4 Style

- `mypy` catches type errors at declaration
- No more `Column(Integer, primary_key=True)` — types come from annotations
- Relationship types flow through queries

---

## 5. Querying (2.0 API)

### SELECT — always use `select()`

```python
from sqlalchemy import select

# One
stmt = select(User).where(User.email == email)
user = (await session.execute(stmt)).scalar_one_or_none()

# Many
stmt = select(User).where(User.active.is_(True)).order_by(User.created_at.desc())
users = (await session.execute(stmt)).scalars().all()
```

### INSERT / UPDATE / DELETE

```python
from sqlalchemy import insert, update, delete

# Insert (returning)
stmt = insert(User).values(email=email).returning(User.id)
new_id = (await session.execute(stmt)).scalar_one()

# Update
await session.execute(
    update(User).where(User.id == uid).values(last_seen=now())
)

# Delete
await session.execute(delete(User).where(User.id == uid))
```

### Eager Loading — the N+1 Fix

| Pattern | When |
|---------|------|
| `selectinload(User.posts)` | Many-to-many, one-to-many (issues 2nd query) |
| `joinedload(User.profile)` | One-to-one, one-to-few (single JOIN) |
| `.options(contains_eager(...))` | Manual JOIN with explicit load |

```python
stmt = select(User).options(selectinload(User.posts)).where(User.active)
```

---

## 6. Relationships

### Cardinality Map

| Relationship | Pattern |
|--------------|---------|
| One-to-one | `relationship(..., uselist=False)` + unique FK |
| One-to-many | FK on child, `relationship` on parent |
| Many-to-many | Association table with two FKs |
| Self-referential | `remote_side=[id]` for tree structures |

### Cascades — Be Explicit

```python
posts: Mapped[list[Post]] = relationship(
    back_populates="author",
    cascade="all, delete-orphan",   # delete posts when user deleted
    passive_deletes=True,           # let DB ON DELETE CASCADE do the work
)
```

---

## 7. Alembic Migrations

### Setup

```bash
alembic init alembic
# Edit alembic.ini + env.py for async + target_metadata = Base.metadata
```

### Common Flow

```bash
alembic revision --autogenerate -m "add users table"
# REVIEW the generated file — autogenerate misses enum renames, index changes
alembic upgrade head
```

### Migration Hygiene

| Rule | Why |
|------|-----|
| Number sequentially (`001_`, `002_`, …) | Predictable ordering in teams |
| Small migrations | Easier to review + roll back |
| Never edit a merged migration | Write a new one |
| Review autogenerated output | Autogen is a draft, not truth |
| Test rollback | `alembic downgrade -1` should work |

### Zero-Downtime Strategy

```
Adding column:    nullable → deploy → backfill → NOT NULL
Removing column:  stop using in app → deploy → drop column
Renaming column:  add new → migrate data → deploy → drop old
Adding index:     use CREATE INDEX CONCURRENTLY (Postgres)
```

---

## 8. Performance

### Connection Pool Tuning

| Setting | Default | Typical Prod |
|---------|---------|--------------|
| `pool_size` | 5 | 10–20 |
| `max_overflow` | 10 | 20 |
| `pool_timeout` | 30 | 30 |
| `pool_recycle` | -1 | 1800 (30 min) |
| `pool_pre_ping` | False | **True** |

### Query Optimization

```
Steps:
1. Identify slow query (APM, echo=True in dev)
2. Run EXPLAIN ANALYZE
3. Check index usage
4. Fix N+1 with selectinload / joinedload
5. Profile in prod with sample queries
```

### Batching

```python
# Bad: N round-trips
for email in emails:
    await session.execute(insert(User).values(email=email))

# Good: one round-trip
await session.execute(insert(User), [{"email": e} for e in emails])
```

---

## 9. Testing

### Transactional Fixtures

```python
@pytest.fixture
async def db_session():
    async with engine.connect() as conn:
        trans = await conn.begin()
        session = AsyncSession(bind=conn)
        try:
            yield session
        finally:
            await session.close()
            await trans.rollback()   # rollback → test isolation
```

Every test starts from a clean DB state without re-creating the schema.

### Don't Mock the ORM

Use a real SQLite (`sqlite+aiosqlite:///:memory:`) or Postgres test container. Mocking the session is fragile and hides bugs.

---

## 10. Anti-Patterns

### ❌ DON'T
- Mix sync and async drivers in the same app
- Use `session.query()` (legacy 1.4 API)
- Rely on `autocommit=True` (removed in 2.0)
- Share a session across threads or async tasks
- Use `expire_on_commit=True` (default) with long-lived objects
- Skip `pool_pre_ping` in production
- Forget to review Alembic autogenerated migrations

### ✅ DO
- Use `select()`, `insert()`, `update()`, `delete()` functions
- One session per request, commit once at boundary
- Eager-load relationships with `selectinload` / `joinedload`
- Keep migrations small and reversible
- Test with real DB, not mocks
- Type models with `Mapped[]`

---

## 11. SQLAlchemy vs Alternatives

| Library | Best For | Why pick it |
|---------|----------|-------------|
| **SQLAlchemy 2.0** | Production apps, complex schemas | Mature, typed, async, any DB |
| **SQLModel** | FastAPI-heavy, Pydantic-first | Wraps SQLAlchemy with Pydantic models |
| **Tortoise ORM** | Async-native, Django-like API | Simpler API, smaller ecosystem |
| **Piccolo** | Async + ORM + admin UI | Built-in admin, smaller scope |
| **asyncpg direct** | Hot paths, known queries | No ORM overhead, raw speed |

---

> **Remember:** SQLAlchemy is a tool for managing **sessions and transactions**, not just queries. Master the session lifecycle and the rest follows.
