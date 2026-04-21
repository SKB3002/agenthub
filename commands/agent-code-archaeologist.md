---
description: Dispatch hub:code-archaeologist — Expert in legacy code, refactoring, and understanding undocumented systems.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-code-archaeologist

Direct dispatch shim for the `hub:code-archaeologist` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:code-archaeologist to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:code-archaeologist", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
