---
description: Dispatch hub:qa-automation-engineer — Specialist in test automation infrastructure and E2E testing.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-qa-automation-engineer

Direct dispatch shim for the `hub:qa-automation-engineer` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:qa-automation-engineer to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:qa-automation-engineer", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
