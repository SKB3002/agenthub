#!/usr/bin/env python3
"""
generate_agent_shims.py — create /hub:agent-<name> shim commands for every agent.

For each file in agents/*.md, writes commands/agent-<name>.md that dispatches
the agent with the user's arguments. Also mirrors into plugins/hub/commands/
so Codex users get the same shims.

Usage: python tools/generate_agent_shims.py
"""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).parent.parent
AGENTS_DIR = REPO / "agents"
CLAUDE_CMDS = REPO / "commands"
CODEX_CMDS = REPO / "plugins" / "hub" / "commands"


def read_frontmatter(md: Path) -> dict[str, str]:
    text = md.read_text(encoding="utf-8")
    m = re.match(r"---\s*\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, _, v = line.partition(":")
            fm[k.strip()] = v.strip()
    return fm


def first_sentence(desc: str) -> str:
    # grab up to first period, strip trailing triggers hint
    desc = re.sub(r"\s+Triggers\s+on[^.]*\.?", "", desc, flags=re.IGNORECASE).strip()
    m = re.match(r"([^.]+?\.)", desc)
    return (m.group(1) if m else desc).strip().rstrip(".") + "."


def shim_body(agent_name: str, desc: str) -> str:
    one_line = first_sentence(desc)
    return f"""---
description: Dispatch hub:{agent_name} — {one_line}
argument-hint: <task or prompt for the agent>
---

# /hub:agent-{agent_name}

Direct dispatch shim for the `hub:{agent_name}` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:{agent_name} to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:{agent_name}", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
"""


def main() -> None:
    CLAUDE_CMDS.mkdir(parents=True, exist_ok=True)
    CODEX_CMDS.mkdir(parents=True, exist_ok=True)

    count = 0
    for agent_file in sorted(AGENTS_DIR.glob("*.md")):
        if agent_file.name.startswith("."):
            continue
        fm = read_frontmatter(agent_file)
        name = fm.get("name") or agent_file.stem
        desc = fm.get("description", "")
        if not desc:
            print(f"skip {agent_file.name}: no description")
            continue

        body = shim_body(name, desc)
        target_claude = CLAUDE_CMDS / f"agent-{name}.md"
        target_codex = CODEX_CMDS / f"agent-{name}.md"
        target_claude.write_text(body, encoding="utf-8")
        target_codex.write_text(body, encoding="utf-8")
        count += 1
        print(f"  wrote agent-{name}.md")

    print(f"\n{count} shim commands generated in commands/ and plugins/hub/commands/")


if __name__ == "__main__":
    main()
