---
description: Dispatch hub:product-manager — Expert in product requirements, user stories, and acceptance criteria.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-product-manager

Direct dispatch shim for the `hub:product-manager` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:product-manager to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:product-manager", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
