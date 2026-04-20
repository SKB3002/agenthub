# Publishing the Codex plugin

The Codex plugin lives at `plugins/hub/` in this repo. The plugin name is `hub`.

**How to invoke after install:** type `@hub` in the Codex composer. Do NOT use `/hub:` — the `/` prefix is reserved for Codex built-in commands and plugin commands typed that way are rejected.

## Plugin layout

| Path | Purpose |
|---|---|
| `plugins/hub/.codex-plugin/plugin.json` | Manifest — name `hub` |
| `plugins/hub/agents/*.toml` | 20 agent definitions |
| `plugins/hub/commands/*.md` | 17 workflow templates (invoked via `@hub`, not `/hub:`) |
| `plugins/hub/skills/*/SKILL.md` | 42 skills |
| `plugins/hub/AGENTS.md` | Session protocol — loaded automatically at start |
| `.agents/plugins/marketplace.json` | Marketplace manifest at repo root — points Codex at `./plugins/hub` |

## Install for end users

```bash
npm install -g @openai/codex
codex marketplace add https://github.com/SKB3002/agenthub
codex
```

Inside Codex: press `/plugin` → search **hub** → **Install**.

## Development

Before committing agent changes, regenerate the TOML files:

```bash
python tools/generate_codex.py --write
```

This syncs `plugins/hub/agents/*.toml` from the Claude source at `agents/*.md`.

Skills and commands do not have a generator — copy changes into `plugins/hub/skills/` and `plugins/hub/commands/` manually when editing the Claude-side sources.
