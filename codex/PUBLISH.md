# Installing AgentHub as a Codex Plugin

Codex does not have a public plugin marketplace. Installation is local — you clone the repo into a `plugins/` directory and register it in a marketplace JSON file.

---

## Repo-local install (recommended)

Makes the plugin available inside a specific project only.

**1. Clone into the project's plugins folder**

```bash
cd <your-project>
git clone https://github.com/SKB3002/agenthub.git plugins/agenthub
```

The folder name must be lower-case hyphen-case and match the plugin's `name` field (`hub`). Use `agenthub` as the folder name.

**2. Register in the marketplace file**

Create or update `<your-project>/.agents/plugins/marketplace.json`:

```json
[
  {
    "path": "./plugins/agenthub/codex"
  }
]
```

The path points to the `codex/` subfolder — that's where `.codex-plugin/plugin.json` lives.

**3. Verify**

Restart Codex in the project. Run `/hub:help` — it should list all 17 commands, 20 agents, and 42 skills.

---

## Home-local install

Makes the plugin available to Codex globally on this machine. Use the same steps but clone into your home-level Codex plugins directory instead of a project subfolder. Check your Codex installation docs for the exact home plugins path.

---

## Keeping it up to date

```bash
cd plugins/agenthub
git pull
```

No reinstall needed — Codex reads the files on each session start.

---

## What's in the `codex/` subfolder

| File | Purpose |
|---|---|
| `.codex-plugin/plugin.json` | Manifest — name, version, paths |
| `agents/*.toml` | 20 agent definitions (TOML format) |
| `commands/*.md` | 17 slash commands |
| `AGENTS.md` | Session protocol — loaded automatically at start |
| `PUBLISH.md` | This file |

Skills (`skills/*/SKILL.md`) are shared with the Claude Code platform and live at the repo root, not inside `codex/`. The manifest's `skills_dir` points back to `skills/` via relative path.
