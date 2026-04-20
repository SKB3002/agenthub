# ORM Selection (2025)

> Choose ORM based on deployment and DX needs.

## Decision Tree

```
What's the context?
│
├── Edge deployment / Bundle size matters
│   └── Drizzle (smallest, SQL-like)
│
├── Best DX / Schema-first
│   └── Prisma (migrations, studio)
│
├── Maximum control
│   └── Raw SQL with query builder
│
└── Python ecosystem
    └── SQLAlchemy 2.0 (async support)
```

## Comparison

| ORM | Stack | Best For | Trade-offs |
|-----|-------|----------|------------|
| **Drizzle** | Node/TS | Edge, TypeScript | Newer, less examples |
| **Prisma** | Node/TS | DX, schema management | Heavier, not edge-ready |
| **Kysely** | Node/TS | Type-safe SQL builder | Manual migrations |
| **Raw SQL** | Any | Complex queries, control | Manual type safety |
| **SQLAlchemy 2.0** | Python | Mature, async + sync, any DB | Verbose, steep learning curve |
| **SQLModel** | Python | FastAPI + Pydantic integration | Less flexible than SQLAlchemy directly |
| **Tortoise ORM** | Python | Async-native, Django-like | Smaller ecosystem |
| **Django ORM** | Python/Django | Full-stack Django apps | Tied to Django lifecycle |

## Python Async ORM Notes

```
SQLAlchemy 2.0 async:
├── Use AsyncEngine + AsyncSession
├── await session.execute(select(...))
├── Pair with asyncpg (PostgreSQL) or aiomysql (MySQL)
└── Mature, production-ready

Raw async SQL (no ORM):
├── asyncpg directly (PostgreSQL)
├── aiomysql + named parameters (MySQL)
├── Fastest, full control
└── Requires manual schema/type management
```

## Migration Tooling by Stack

| Tool | Stack | Best For |
|------|-------|----------|
| **Prisma Migrate** | Node/TS | Prisma-managed schemas |
| **Drizzle Kit** | Node/TS | Drizzle-managed schemas |
| **Alembic** | Python | SQLAlchemy + any Python stack |
| **Django migrations** | Python/Django | Django ORM |
| **Flyway / Liquibase** | Any | Polyglot teams, version-controlled SQL |
