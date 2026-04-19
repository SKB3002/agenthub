# Installing AgentHub as a Codex Plugin

The Codex plugin lives in the `codex/` subfolder of this repo — **not the repo root**. The plugin name is `hub` (so all commands are `/hub:*`, all agents `hub:*`).

---

## What's in the repo (nothing missing)

| Path | Purpose |
|---|---|
| `codex/.codex-plugin/plugin.json` | Manifest — name `hub`, points to `codex/agents/`, `codex/commands/`, `skills/` |
| `codex/agents/*.toml` | 20 agent definitions |
| `codex/commands/*.md` | 17 slash commands |
| `codex/AGENTS.md` | Session protocol — loaded automatically at start |
| `skills/*/SKILL.md` | 42 skills — shared with Claude Code, lives at repo root |

The only thing not shipped in the repo is a user's global marketplace file (`~/.agents/plugins/marketplace.json`) — that's per-machine and belongs to each user.

---

## Option A — Simple install (recommended)

```bash
git clone https://github.com/SKB3002/agenthub.git
codex plugin install ./agenthub/codex
```

Restart Codex (or open a new session), then run `/hub:help` to verify.

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

**4.** Restart Codex and run `/hub:help`.

---

## Keeping it up to date

```bash
cd ~/dev/agenthub   # or wherever you cloned it
git pull
```

No reinstall needed — Codex reads the files on each session start.

---

## Using the plugin

```
/hub:help                    — list all commands, agents, and skills
/hub:help commands           — commands only
/hub:help agents             — agents only
/hub:help skills             — skills only
/hub:help <name>             — details on a specific item

/hub:brainstorm <idea>       — explore options before writing code
/hub:plan <feature>          — generate a plan file in docs/
/hub:create <app>            — scaffold a new app
/hub:enhance <change>        — add/update features in an existing app
/hub:debug <symptom>         — systematic root-cause investigation
/hub:test [generate|run]     — write or run tests
/hub:deploy [staging|prod]   — pre-flight + deploy
```
