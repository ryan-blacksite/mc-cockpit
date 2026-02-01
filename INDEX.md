# Blacksite Labs – Repo Index

## Purpose
This file is the entry point for all AI agents and humans.
Read this first.

## Canonical Files
- VISION.md — Product north star (read-only unless CEO-approved)
- ROADMAP.md — High-level sequencing and phases
- DECISIONS.md — Append-only log of major decisions
- RECENT_ACTIVITY.md — Short, AI-optimized summary of recent changes
- conventions.md — Code and system rules
- CLAUDE.md — Operating instructions for Claude Code

## Agent Logs
/agents/
- One markdown file per AI persona
- Each agent must:
  - Read its own log at startup
  - Append a short summary at shutdown

## Rules
- Do not modify VISION.md without explicit approval
- Update RECENT_ACTIVITY.md after meaningful work
- Log major choices in DECISIONS.md
