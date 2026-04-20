# Contributing to AgentHub

Thanks for your interest in improving AgentHub. All contributions are welcome — bug fixes, new agents, new skills, better workflows, or just sharper descriptions.

## Ways to contribute

- **Fix a typo or improve a description** — go straight to a PR
- **Add a new skill** — open an issue first describing the domain, then PR
- **Add a new subagent** — open an issue with the intended role and which skills it would load
- **Propose a new slash command** — open an issue with the intended workflow
- **Port a validation script** — PR welcome; include a brief note on what it validates

## Development workflow

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-change`
3. Test locally against Claude Code:
   ```bash
   claude --plugin-dir ./agenthub
   ```
4. If you modified any agent in `agents/`, sync the Codex TOML files:
   ```bash
   python tools/generate_codex.py --write
   ```
5. Commit with a descriptive message
6. Open a PR against `main`

## Where things live

| Primitive | Claude Code path | Codex path |
|---|---|---|
| Agents | `agents/*.md` (YAML frontmatter) | `codex/agents/*.toml` (auto-generated) |
| Commands | `commands/*.md` | `codex/commands/*.md` (manually kept in sync) |
| Skills | `skills/<name>/SKILL.md` | same — skills are shared |
| Validation scripts | `skills/<name>/scripts/*.py` | same — shared |
| Hooks | `claude/hooks/` | n/a |
| MCP examples | `claude/mcp.example.json` | n/a |

- **Subagents** are flat `.md` files with YAML frontmatter (`name`, `description`, `tools`, `model`, `skills`). Claude Code namespaces them as `hub:<name>`.
- **Slash commands** are flat `.md` files. Claude Code namespaces them as `/hub:<name>` — do not prefix filenames.
- **Validation scripts** are co-located with the skill. Keep them dependency-light; prefer stdlib.
- **Hooks** (optional, off by default) — ship examples in `claude/hooks/hooks.example.json`. Never write to `hooks.json` itself.
- **MCP servers** (optional, off by default) — examples in `claude/mcp.example.json`. Never write to a live `.mcp.json`.

## Style

- Descriptions: tell the model **when** to use the thing, not **what it does**.
- Agents: frame as a persona with a clear philosophy, not a feature list.
- Skills: lead with a content map if the skill has sub-files.
- Token estimates in docs: always prefix `~`, never convert to dollars.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
