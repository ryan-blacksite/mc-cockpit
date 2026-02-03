# Blacksite Labs – Repo Index

## Purpose
This file is the map. It tells you what exists in this repo and where to find it.
For operating instructions, read `CLAUDE.md`. For rules and invariants, read `conventions.md`.

## Canonical Files

| File | What It Is |
|------|-----------|
| `CLAUDE.md` | Operating instructions for Claude Code. Defines startup sequence, execution rules, shutdown procedure. Start here if you are an AI agent. |
| `conventions.md` | **Constitutional source of truth.** All invariants, contracts, naming conventions, and system rules. Supersedes specs on conflicts. |
| `DECISIONS.md` | Append-only log of material decisions and architectural choices. |
| `RECENT_ACTIVITY.md` | Short summary of recent work across all agents. Updated after each session. |
| `VISION.md` | **LOCKED — historical reference.** Explains the philosophy and metaphor behind Mission Control. Not authoritative on current specifics; conventions.md supersedes on all details. |
| `ROADMAP.md` | ⚠️ **Empty — not yet populated.** Reserved for high-level sequencing and phases. |

## Specs (`/specs/`)
Locked and active specification documents. These define *how* systems work. Where a spec and `conventions.md` conflict, `conventions.md` wins.

## Agent Logs (`/agents/`)
One markdown file per AI persona. Agents read their own log at startup and append a summary at shutdown. See `CLAUDE.md` for the full procedure.
