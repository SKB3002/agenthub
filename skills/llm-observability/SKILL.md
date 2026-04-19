---
name: llm-observability
description: LLM observability, tracing, evaluation, and cost tracking. Use when instrumenting LLM-powered apps with Langfuse, LangSmith, OpenTelemetry, or Arize Phoenix.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# LLM Observability

> You can't ship an LLM product without observability. Logs aren't enough — you need traces, evals, and cost tracking.
> **Learn to THINK about what to observe, not copy SDK snippets.**

---

## ⚠️ How to Use This Skill

- ASK which platform (Langfuse, LangSmith, Phoenix, OTel) before picking examples
- Instrument at the **trace boundary**, not inside prompt templates
- Don't send raw PII to third-party platforms without masking

---

## 1. What to Observe

### The Five Signals

| Signal | Why it matters |
|--------|----------------|
| **Latency** | p50 / p95 / p99 per model call + end-to-end trace |
| **Cost** | Token usage × unit price, per user / feature / model |
| **Quality** | Eval scores: factuality, groundedness, format adherence |
| **Errors** | Timeouts, rate limits, validation failures, tool-call errors |
| **Usage** | Which prompts run, how often, by whom |

### Granularity

```
Trace          — one end-to-end user interaction (may span minutes)
  └── Span     — one logical step (retrieval, LLM call, tool call)
        └── Event — one observation (token count, score)
```

One user request → one trace → N spans → M events.

---

## 2. Platform Selection

| Platform | Best for | Trade-offs |
|----------|----------|------------|
| **Langfuse** | Self-hostable, full features, OSS | Requires infra (Postgres + ClickHouse) |
| **LangSmith** | Tight LangChain integration | Hosted only, LangChain-centric |
| **Arize Phoenix** | Open-source, strong eval focus | Newer, less opinionated |
| **OpenTelemetry + GenAI** | Vendor-neutral, standard protocol | Fewer LLM-specific features |
| **Weights & Biases Weave** | ML teams already on W&B | Broader ML focus, not LLM-only |
| **Helicone** | Proxy-based, zero code changes | Less rich than SDK-based |

### Decision Shortcut

```
Self-hosted + full control?        → Langfuse
LangChain stack, managed?          → LangSmith
Eval-heavy research loop?          → Arize Phoenix
Polyglot / infra team owns APM?    → OpenTelemetry GenAI
Zero integration lift?             → Helicone (proxy)
```

---

## 3. Langfuse Integration (Python)

### Decorator-Based Tracing

```python
from langfuse.decorators import observe, langfuse_context

@observe()
async def answer_question(question: str) -> str:
    retrieved = await retrieve(question)
    response = await call_llm(question, retrieved)
    return response

@observe(as_type="generation")
async def call_llm(question: str, context: list[str]) -> str:
    langfuse_context.update_current_observation(
        model="gemini-2.0-flash",
        input={"question": question, "context": context},
    )
    result = await llm.generate(...)
    langfuse_context.update_current_observation(
        usage={"input": result.prompt_tokens, "output": result.completion_tokens},
        output=result.text,
    )
    return result.text
```

### Manual API (when decorators don't fit)

```python
trace = langfuse.trace(name="answer", user_id=user_id, session_id=session_id)
generation = trace.generation(
    name="gemini-call",
    model="gemini-2.0-flash",
    input=prompt,
    metadata={"temperature": 0.2},
)
# ... make the call ...
generation.end(
    output=response.text,
    usage={"input": n_in, "output": n_out},
)
```

---

## 4. OpenTelemetry (Vendor-Neutral)

### GenAI Semantic Conventions

```python
from opentelemetry import trace

tracer = trace.get_tracer("llm")

with tracer.start_as_current_span("llm.call") as span:
    span.set_attribute("gen_ai.system", "google")
    span.set_attribute("gen_ai.request.model", "gemini-2.0-flash")
    span.set_attribute("gen_ai.request.temperature", 0.2)

    response = await client.generate(prompt)

    span.set_attribute("gen_ai.response.finish_reasons", ["stop"])
    span.set_attribute("gen_ai.usage.input_tokens", response.prompt_tokens)
    span.set_attribute("gen_ai.usage.output_tokens", response.completion_tokens)
```

### Standard Attributes (OTel GenAI)

| Attribute | Example |
|-----------|---------|
| `gen_ai.system` | `openai`, `google`, `anthropic` |
| `gen_ai.request.model` | `gpt-4o`, `gemini-2.0-flash` |
| `gen_ai.request.temperature` | `0.2` |
| `gen_ai.request.max_tokens` | `1024` |
| `gen_ai.response.id` | vendor response ID |
| `gen_ai.usage.input_tokens` | int |
| `gen_ai.usage.output_tokens` | int |

---

## 5. Cost Tracking

### Per-Request Cost

Compute cost at the span level:

```python
COST_PER_1K = {
    "gemini-2.0-flash": {"input": 0.000075, "output": 0.0003},
    "gpt-4o":           {"input": 0.0025,   "output": 0.01},
    "claude-opus-4-7":  {"input": 0.015,    "output": 0.075},
}

def cost(model: str, in_tokens: int, out_tokens: int) -> float:
    rates = COST_PER_1K[model]
    return (in_tokens / 1000) * rates["input"] + (out_tokens / 1000) * rates["output"]
```

Attach to the trace as metadata so you can aggregate later by user / feature / model.

### Aggregation Dimensions

| Dimension | Use |
|-----------|-----|
| `user_id` | Per-user billing, abuse detection |
| `feature` | Which product area consumes most budget |
| `model` | Cost per model, drives routing |
| `session_id` | Full conversation cost |
| `environment` | dev vs staging vs prod |

---

## 6. Evaluation (Offline + Online)

### Offline Evals

Run against a labeled dataset. Gate deploys on regression.

| Eval Type | Metric |
|-----------|--------|
| **Factuality** | Does output match ground truth? |
| **Groundedness** | Is output supported by retrieved context? |
| **Format adherence** | Does output parse as expected JSON / schema? |
| **Toxicity / safety** | Content policy violations |
| **Task success** | Did the tool call succeed? |

### Online Evals

Sample traces in production, run evaluators (LLM-as-judge, rule-based, classifiers).

```
Pattern:
├── Sample 1-5% of production traces
├── Run LLM-as-judge evaluator
├── Store score as trace score
└── Alert on score regression (e.g. factuality drops from 0.9 → 0.7)
```

### LLM-as-Judge Caveats

- Use a **stronger** model as judge, not the same one
- Calibrate with human-labeled examples
- Check judge-human agreement quarterly
- Don't use judge scores for life-safety decisions

---

## 7. What to Log (and NOT Log)

### ✅ Log
- Full prompt + response (with PII masking)
- Model, temperature, max_tokens, other params
- Input/output token counts
- Latency (first-token, total)
- Tool calls and arguments
- User ID, session ID, feature tag
- Retrieved context (for RAG)

### ❌ Don't Log
- Raw API keys or tokens
- Unmasked PII (emails, phone, credit cards)
- Private data the user hasn't consented to share externally
- Internal system prompts if they're IP-sensitive (mask or hash)

### PII Masking Pattern

```python
def mask_pii(text: str) -> str:
    text = re.sub(r"[\w.-]+@[\w.-]+", "<EMAIL>", text)
    text = re.sub(r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b", "<PHONE>", text)
    return text

langfuse_context.update_current_observation(
    input=mask_pii(user_message),
)
```

---

## 8. Tracing RAG Pipelines

### Span Structure

```
trace: "answer_question"
├── span: "retrieve"
│     ├── event: "embed_query" (tokens, latency)
│     ├── event: "vector_search" (k, latency, hits)
│     └── event: "rerank" (model, scores)
├── span: "generate"
│     ├── attr: model, temperature
│     └── attr: tokens_in/out, cost
└── span: "evaluate" (optional, async)
```

### What to Capture at Each Step

| Step | Attributes |
|------|------------|
| Embed | model, dimensions, tokens |
| Search | k, filter, latency, hit count |
| Rerank | model, scores distribution |
| Generate | model, params, tokens, cost |
| Tool call | tool name, args, result, success |

---

## 9. Alerts & Dashboards

### Must-Have Alerts

| Alert | Threshold (example) |
|-------|---------------------|
| Error rate | > 2% over 5 min |
| p95 latency | > 10s |
| Cost spike | 2× rolling avg over 1 hour |
| Eval score drop | Factuality < 0.85 rolling 24h |
| Rate limit hits | > 10/min |

### Dashboard Essentials

- Traces per minute + error rate
- p50 / p95 / p99 latency (total + per-model)
- Cost by feature / model / user
- Token usage trends
- Eval scores over time

---

## 10. Privacy & Compliance

| Concern | Practice |
|---------|----------|
| PII in prompts | Mask before sending to observability platform |
| GDPR right-to-delete | Platform must support per-user deletion |
| Data residency | Self-host (Langfuse) or pick regional vendor |
| Retention | Set reasonable TTL (30-90 days is common) |
| Access control | Separate dev/prod projects, RBAC on dashboards |

---

## 11. Anti-Patterns

### ❌ DON'T
- Log only successes (failures are where the signal is)
- Send unmasked PII to third-party platforms
- Track cost only globally (you can't optimize what you can't slice)
- Trust a single eval score — combine rule-based + LLM-as-judge
- Sample observations at 100% forever (cost adds up)
- Instrument inside prompt templates (couples code to vendor)

### ✅ DO
- Instrument at service boundaries
- Mask PII before egress
- Correlate traces with user / session IDs
- Run offline evals in CI; online evals on sampled traffic
- Alert on eval regressions, not just errors
- Keep an internal cost-per-request budget per feature

---

## 12. Migration Between Platforms

Common reasons to migrate:
- Self-hosting for compliance
- Cost
- Feature gaps (e.g., missing eval support)
- Consolidating on OTel

### Migration Strategy

```
1. Write an observability ABC (abstract base class) in your app.
2. Each platform = one concrete implementation.
3. Swap via config, run both in parallel for 1-2 weeks.
4. Compare traces, confirm parity, cut over.
```

This keeps your code independent of any single vendor's SDK.

---

## 13. Related Skills

| Need | Skill |
|------|-------|
| FastAPI integration | `@[skills/fastapi-expert]` |
| Python patterns | `@[skills/python-patterns]` |
| Systematic debugging | `@[skills/systematic-debugging]` |

---

> **Remember:** LLM apps fail in ways traditional apps don't — silent quality degradation, model drift, prompt regressions. Observability is how you catch them before users do.
