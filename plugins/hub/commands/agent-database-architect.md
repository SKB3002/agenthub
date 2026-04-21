---
description: Dispatch hub:database-architect — Expert database architect for schema design, query optimization, migrations, and modern serverless databases.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-database-architect

Direct dispatch shim for the `hub:database-architect` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:database-architect to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:database-architect", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
