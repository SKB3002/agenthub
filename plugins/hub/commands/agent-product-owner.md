---
description: Dispatch hub:product-owner — Strategic facilitator bridging business needs and technical execution.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-product-owner

Direct dispatch shim for the `hub:product-owner` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:product-owner to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:product-owner", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
