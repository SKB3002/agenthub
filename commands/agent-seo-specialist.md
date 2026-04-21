---
description: Dispatch hub:seo-specialist — SEO and GEO (Generative Engine Optimization) expert.
argument-hint: <task or prompt for the agent>
---

# /hub:agent-seo-specialist

Direct dispatch shim for the `hub:seo-specialist` agent.

## Flow

1. If `$ARGUMENTS` is empty, ask the user: *"What would you like hub:seo-specialist to do?"* Wait for a reply, then continue with the reply as the prompt.
2. Dispatch the agent with the user's input:

   ```
   Agent(subagent_type="hub:seo-specialist", prompt="$ARGUMENTS")
   ```

3. Pass the agent's response through verbatim. Do not pre-summarise or edit its output.

## Notes

- This is a LIGHT wrapper — no approval gate. The agent itself may refuse or escalate.
- For multi-agent coordination, use `/hub:orchestrate` instead.
- For the recommended workflow (brainstorm → plan → create), use the top-level workflow commands.
