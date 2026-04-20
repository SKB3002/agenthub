#!/usr/bin/env python3
"""
generate_codex.py — Sync agenthub source → codex/ distribution.

Run on every release to keep codex/agents/*.toml in sync with agents/*.md.
Skills (skills/*/SKILL.md) are shared verbatim — no conversion needed.

Usage:
    python tools/generate_codex.py             # dry-run, shows diff
    python tools/generate_codex.py --write     # write files to codex/agents/
    python tools/generate_codex.py --check     # exit 1 if any file is stale (CI mode)
"""

import sys
import re
import tomllib  # stdlib from Python 3.11+; use `pip install tomli` for older
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
AGENTS_SRC = REPO_ROOT / "claude" / "agents"
AGENTS_DEST = REPO_ROOT / "codex" / "agents"

# Fields extracted from Claude Code YAML frontmatter → mapped to TOML keys
FRONTMATTER_MAP = {
    "name": "name",
    "description": "description",
    "model": "model",
    "tools": None,          # Claude Code specific — dropped
    "skills": "skills",     # → [skills] config array
}

# Codex defaults when fields are absent in the source
CODEX_DEFAULTS = {
    "model": "o3",
    "sandbox_mode": "workspace",
}

# Tool name translation table (Claude Code → Codex)
TOOL_TRANSLATION = {
    "Read": "file_read",
    "Write": "file_write",
    "Edit": "file_edit",
    "Bash": "shell",
    "Glob": "file_glob",
    "Grep": "file_search",
    "WebSearch": "web_search",
    "WebFetch": "web_fetch",
    "Agent": "subagent",
}


def parse_frontmatter(md_text: str) -> tuple[dict, str]:
    """Extract YAML frontmatter from a markdown file. Returns (meta, body)."""
    if not md_text.startswith("---"):
        return {}, md_text
    end = md_text.index("---", 3)
    raw_yaml = md_text[3:end].strip()
    body = md_text[end + 3:].strip()

    meta = {}
    for line in raw_yaml.splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            meta[key.strip()] = val.strip().strip('"')
    return meta, body


def md_to_toml(src_path: Path) -> str:
    """Convert a Claude Code agent .md file to Codex .toml format."""
    text = src_path.read_text(encoding="utf-8")
    meta, body = parse_frontmatter(text)

    name = meta.get("name", src_path.stem)
    description = meta.get("description", "")
    model = CODEX_DEFAULTS["model"]
    sandbox_mode = CODEX_DEFAULTS["sandbox_mode"]

    # Parse skills list from frontmatter (format: "hub:skill1, hub:skill2")
    skills_raw = meta.get("skills", "")
    if isinstance(skills_raw, str):
        skills = [s.strip().strip('"') for s in skills_raw.split(",") if s.strip()]
    else:
        skills = skills_raw or []

    # Build TOML output
    lines = [
        f'name = "{name}"',
        f'description = "{description}"',
        f'model = "{model}"',
        f'sandbox_mode = "{sandbox_mode}"',
        "",
        "[skills]",
        f'config = {repr(skills)}',
        "",
        "[instructions]",
        'content = """',
    ]

    # Strip markdown headers and Claude-specific protocol references from body
    clean_body = re.sub(r"^#{1,3} .*$", "", body, flags=re.MULTILINE)
    clean_body = re.sub(r"\$\{CLAUDE_PLUGIN_ROOT\}", "${CODEX_PLUGIN_ROOT}", clean_body)
    clean_body = re.sub(r"CLAUDE\.md", "AGENTS.md", clean_body)
    lines.append(clean_body.strip())
    lines.append('"""')

    return "\n".join(lines) + "\n"


def run(write: bool = False, check: bool = False) -> int:
    stale = []
    AGENTS_DEST.mkdir(parents=True, exist_ok=True)

    for src in sorted(AGENTS_SRC.glob("*.md")):
        dest = AGENTS_DEST / (src.stem + ".toml")
        generated = md_to_toml(src)

        if dest.exists() and dest.read_text(encoding="utf-8") == generated:
            print(f"  ok   {dest.name}")
            continue

        stale.append(dest.name)
        print(f"  STALE {dest.name}")

        if write:
            dest.write_text(generated, encoding="utf-8")
            print(f"  wrote {dest}")

    if check and stale:
        print(f"\n{len(stale)} stale Codex agent file(s). Run: python tools/generate_codex.py --write")
        return 1

    if not write and stale:
        print(f"\n{len(stale)} file(s) need updating. Run with --write to apply.")

    return 0


if __name__ == "__main__":
    write = "--write" in sys.argv
    check = "--check" in sys.argv
    sys.exit(run(write=write, check=check))
