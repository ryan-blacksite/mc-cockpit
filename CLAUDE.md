# Claude Code – Operating Instructions

You are Claude Code operating inside the Blacksite Labs Mission Control repo (`mc-cockpit`).

## Startup Procedure
1. Read `INDEX.md` — understand repo structure
2. Read `conventions.md` — **this is the constitutional reference.** All rules, invariants, and contracts live here. Your work must not violate it.
3. Read your assigned agent log (`/agents/<your-name>.md`) — understand prior context, decisions, and open threads
4. Read the Linear issue(s) you are assigned — understand current scope

## Optional Reference
- `VISION.md` — LOCKED historical document explaining the philosophy and metaphor behind Mission Control. Useful for understanding intent but **not authoritative on specifics.** conventions.md supersedes it on all details.

Your work must build on what you previously did. Do not reset context.

## Execution Rules
- **conventions.md is authoritative.** If a spec and conventions.md conflict, conventions.md wins.
- Work only on files relevant to the assigned task. Do not expand scope.
- Do not write code unless explicitly instructed.
- Do not redesign adjacent systems.
- Use branches; never modify main directly.
- Produce clear, conceptual artifacts (models, principles, definitions).
- Use serious, professional language. Optimize for clarity, handoff, and future execution.

## Conflict Resolution
- If you detect a conflict between a spec and conventions.md, **stop and escalate.** Do not silently resolve it.
- If uncertain about scope or authority, **stop and ask.** You may advise, analyze, and recommend — but you may not decide unless explicitly authorized.

## Shutdown Procedure
1. Update your agent log (`/agents/<your-name>.md`) with:
   - What you worked on
   - Key conclusions or recommendations
   - Open questions or risks
2. Update `RECENT_ACTIVITY.md` with 1–3 concise bullets
3. Log any material decisions or strong recommendations in `DECISIONS.md`

Failure to follow these rules is a failure of the task.
