# Installing AgentHub as a Codex Plugin

The Codex plugin lives in the `codex/` subfolder of this repo — **not the repo root**. The plugin name is `hub`.

**How to invoke after install:** type `@hub` in the Codex composer. Do NOT use `/hub:` — the `/` prefix is reserved for Codex built-in commands and plugin commands typed that way are rejected.

---

## What's in the repo (nothing missing)

| Path | Purpose |
|---|---|
| `codex/.codex-plugin/plugin.json` | Manifest — name `hub`, paths relative to manifest location |
| `codex/agents/*.toml` | 20 agent definitions |
| `codex/commands/*.md` | 17 workflow templates (invoked via `@hub`, not `/hub:`) |
| `codex/AGENTS.md` | Session protocol — loaded automatically at start |
| `skills/*/SKILL.md` | 42 skills — shared with Claude Code, lives at repo root |

The only thing not shipped in the repo is a user's global marketplace file (`~/.agents/plugins/marketplace.json`) — that's per-machine and belongs to each user.

---

## Option A — Simple install (recommended)

```bash
git clone https://github.com/SKB3002/agenthub.git
codex plugin install ./agenthub/codex
```

Restart Codex (or open a new session), then type `@hub help` to verify.

> **Important:** install from `./agenthub/codex`, not from `./agenthub`. The Codex manifest is inside the `codex/` subfolder.

---

## Option B — Global install via marketplace file

Good for keeping the plugin available across all projects on your machine.

**1. Clone the repo** to a stable location:

```bash
# Windows
git clone https://github.com/SKB3002/agenthub.git C:\dev\agenthub

# macOS / Linux
git clone https://github.com/SKB3002/agenthub.git ~/dev/agenthub
```

**2. Create a stable `hub` pointer** to the `codex/` subfolder:

```powershell
# Windows — junction
New-Item -ItemType Junction -Path C:\Users\<you>\plugins\hub -Target C:\dev\agenthub\codex
```

```bash
# macOS / Linux — symlink
ln -s ~/dev/agenthub/codex ~/plugins/hub
```

**3. Create `~/.agents/plugins/marketplace.json`** (or add to it if it exists):

```json
{
  "name": "My Plugins",
  "interface": { "displayName": "My Plugins" },
  "plugins": [
    {
      "name": "hub",
      "source": { "source": "local", "path": "./plugins/hub" },
      "policy": { "installation": "AVAILABLE", "authentication": "ON_INSTALL" },
      "category": "Productivity"
    }
  ]
}
```

**4.** Restart Codex and type `@hub help` to verify.

---

## Keeping it up to date

```bash
cd ~/dev/agenthub   # or wherever you cloned it
git pull
```

No reinstall needed — Codex reads the files on each session start.

---

## Using the plugin

Type `@hub` in the Codex composer — autocomplete will show available workflows and skills.

```
@hub help                    — list all workflows, agents, and skills
@hub help commands           — workflows only
@hub help agents             — agents only
@hub help skills             — skills only
@hub help <name>             — details on a specific item

@hub brainstorm <idea>       — explore options before writing code
@hub plan <feature>          — generate a plan file in docs/
@hub create <app>            — scaffold a new app
@hub enhance <change>        — add/update features in an existing app
@hub debug <symptom>         — systematic root-cause investigation
@hub test [generate|run]     — write or run tests
@hub deploy [staging|prod]   — pre-flight + deploy
```

Skills are also available directly via the `$` picker: `$hub-debug`, `$hub-plan`, etc.
