---
description: Dispatch hub:security-auditor — Elite cybersecurity expert.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-security-auditor

Direct dispatch shim for the `hub:security-auditor` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:security-auditor to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:security-auditor", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
