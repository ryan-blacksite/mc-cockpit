# Mission Control – Conventions

**Status:** CANONICAL  
**Authority:** This file is the single source of truth for all rules, invariants, conventions, and contracts governing Mission Control. Referenced by `CLAUDE.md` as authoritative.  
**Rule:** No spec, agent, or code may contradict this file. If a locked spec and this file conflict, this file wins. Specs define *how* — this file defines *what must always be true*.

---

## 1. System Invariants (Non-Negotiables)

These rules are absolute. They cannot be overridden by any agent, spec, feature, or future design decision. Breaking any of these is a critical defect.

### 1.1 Authority Hierarchy

| # | Rule |
|---|------|
| A-1 | The CEO is tier=1, human=true, and holds final authority on all decisions. |
| A-2 | CEO.reports_to = null. Always. |
| A-3 | One CEO per company. No exceptions. |
| A-4 | Every non-CEO agent MUST have a defined reports_to field. |
| A-5 | The 5-tier hierarchy is fixed: CEO → C-Suite → Managers → Leads → Workers. |
| A-6 | Agent tier determines authority. No exceptions, no overrides. |
| A-7 | The CEO may override any decision at any time without justification. |
| A-8 | No AI agent may block a CEO action. Ever. |
| A-9 | Escalation follows the reporting chain. Cross-domain conflicts escalate to CEO. |
| A-10 | The Board never mediates cross-domain conflicts. That's the CEO's job. |

### 1.2 Board Constraints

| # | Rule |
|---|------|
| B-1 | Board agents are tier=2, advisory-only. They never execute and never block. |
| B-2 | Advisory.blocks_work = false. Hardcoded. Non-negotiable. |
| B-3 | BoardDissent.blocks_decision = false. Hardcoded. Non-negotiable. |
| B-4 | Board agents are excluded from the operational chain of command. |
| B-5 | Board agents do NOT execute Pulse cycles. |
| B-6 | Board agents may message the CEO (advisory-only). CEO may message Board members 1:1 at any time. |
| B-7 | Board advisory triggers are evaluated by the system, not self-initiated. |
| B-8 | Red-Line triggers are immutable. The CEO cannot disable them. |
| B-9 | Board onboarding session is required for every new company. No skip. |
| B-10 | Onboarding outputs are mandatory: mission, vision, values, strategic priorities. |
| B-11 | Board tone follows Roberts Rules: structured, professional, respectful. |
| B-12 | Board-to-Board communication is allowed only inside a BoardSession as a system-mediated transcript that is CEO-visible and logged. No private side channels. |

**Board storage vs surfacing:** Board advisory records are stored under Operations as oversight/governance records. Board advisories are surfaced via Command (Board Advisory panel) and Intelligence (Advisory feed). This does not create a 7th sector and does not make Operations the Board sector.

### 1.3 Spending & Financial Authority

| # | Rule |
|---|------|
| F-1 | Default spending authority = $0 for all agents, system-wide. |
| F-2 | Any real-world spend escalates to CEO. No exceptions. |
| F-3 | Department budgets are CEO-configurable only. |
| F-4 | No agent may commit external funds without explicit CEO authorization. |

### 1.4 Memory & Logging

| # | Rule |
|---|------|
| M-1 | Memory is append-only. No edits. No deletes. |
| M-2 | Memory entries are immutable after creation. |
| M-3 | All state mutations are logged with actor_id. |
| M-4 | All escalations are logged to Memory. |
| M-5 | All communications are logged to Memory. |
| M-6 | All Pulse executions are logged to Memory. |
| M-7 | Memory ownership: system owns, all agents read, system writes. |

### 1.5 Structural Invariants

| # | Rule |
|---|------|
| S-1 | A company has exactly 6 sectors. The set is fixed. |
| S-2 | The 6 sectors are: Command, Organization, Operations, Finance, Intelligence, Metrics. |
| S-3 | Department types are fixed. No custom department types. |
| S-4 | Sector types are enum, not user-defined strings. |
| S-5 | Every company begins with a Board onboarding session before any operational activity. |

---

## 2. Domain & Naming Conventions

### 2.1 Entity Naming

| Entity | Convention | Example |
|--------|-----------|---------|
| Sectors | PascalCase, fixed enum | `Command`, `Organization`, `Operations`, `Finance`, `Intelligence`, `Metrics` |
| Department types | PascalCase, fixed enum | `Engineering`, `Marketing`, `Finance` |
| Agent roles | snake_case identifiers | `cto`, `vp_engineering`, `lead_frontend` |
| Runtime objects | PascalCase types | `Agent`, `Task`, `Escalation`, `PulseLog` |
| Database tables | snake_case plural | `agents`, `tasks`, `escalations`, `pulse_logs` |
| Edge Functions | kebab-case | `execute-pulse`, `process-escalation` |
| Spec files | UPPER-KEBAB-CASE with version | `MC-RUNTIME-SPEC-v1.md` |

### 2.2 File & Directory Conventions

| Location | Convention |
|----------|-----------|
| Specs | `/specs/` — Locked specs are immutable. Active specs may be revised. |
| Agent worklogs | `/agents/<name>.md` — One per agent. Append-only log format. |
| Decisions | `DECISIONS.md` — Chronological. Never delete entries. |
| Recent activity | `RECENT_ACTIVITY.md` — Rolling summary. May be trimmed to last N entries. |

### 2.3 Status Labels

| Label | Meaning |
|-------|---------|
| LOCKED | Spec is ratified. No modifications permitted. |
| ACTIVE | Spec is in development. May be revised through proper process. |
| DRAFT | Spec is exploratory. Not authoritative. |
| CANONICAL | File is the single source of truth for its domain. |

---

## 3. API Conventions

### 3.1 General API Rules

- All APIs are RESTful unless a specific technical requirement demands otherwise.
- Every endpoint has explicit inputs and outputs. No hidden side effects.
- All mutations return the mutated object.
- All list endpoints support pagination.
- Error responses include: error code, human-readable message, and correlation ID.

### 3.2 Supabase / Database Conventions

- Supabase (Postgres) is the persistence layer. This is a locked decision.
- Row Level Security (RLS) enforces data ownership rules defined in Section 4.
- All tables include: `id` (UUID, PK), `created_at` (timestamptz), `updated_at` (timestamptz).
- Soft deletes where applicable (archived_at field). Memory is never soft-deleted (see M-1).
- Foreign keys enforce referential integrity. No orphaned records.

### 3.3 Edge Function Conventions

- Backend logic runs in Supabase Edge Functions (Deno runtime).
- Pulse execution is backend-owned: `pg_cron` triggers Edge Functions. Not client-initiated.
- Edge Functions are stateless. All state lives in Postgres.
- Edge Functions authenticate via service_role key for system operations.

---

## 4. Data Ownership & Authority Rules

Data ownership determines who can read and write each category of data. These rules are enforced at the database level via RLS and at the application level via authorization checks.

### 4.1 Ownership Matrix

| Data Category | Owner | Read Access | Write Access |
|---------------|-------|-------------|--------------|
| Company config | CEO | All agents | CEO only |
| Command sector state | CEO | All agents | CEO only |
| Department state | Department Chief | Dept agents + CEO | Chief + CEO |
| Agent mandate | Agent's reports_to | Chain above + agent | reports_to + CEO |
| Task state | Assignee | Chain above assignee | Assignee + chain above |
| Memory | System | All agents | System only (append) |
| Board advisory records | System | CEO + Board | System only |

### 4.2 Ownership Principles

- **Ownership flows down.** The CEO can write to anything. A Chief can write within their department. A Lead can write within their team. A Worker can write only their own task state.
- **Visibility flows up.** Status information bubbles up the chain. A CEO sees everything. A Worker sees their own scope.
- **No lateral writes.** An agent cannot modify state in a peer's domain without escalation.
- **System-owned data is sacred.** No agent — including CEO — can edit Memory or system logs directly. The system writes on their behalf and the record is immutable.

---

## 5. UI & Interaction Principles

### 5.1 Spatial Dashboard (Cockpit)

| # | Rule |
|---|------|
| UI-1 | The dashboard is a spatial cockpit with exactly 6 sectors (see S-1, S-2). |
| UI-2 | Navigation uses camera-based zoom. Continuous motion, not hard cuts. |
| UI-3 | 4 zoom levels: L1 Global View → L2 Sector → L3 Detail → L4+ Deep Dive. |
| UI-4 | Zoom = Authority. Deeper zoom unlocks more control. |
| UI-5 | Visibility ≠ Controllability. Status bubbles up; control requires descent. |
| UI-6 | Detail reveal is staged — content appears after zoom motion completes, not during. |
| UI-7 | L1 (Global View) is observation only. No direct manipulation at the top level. |
| UI-8 | L2 (Sector) enables orientation and light control (acknowledge alerts, quick actions). |
| UI-9 | L3 (Detail) enables full control of the selected entity. |
| UI-10 | L4+ (Deep Dive) enables fractal depth — drilling into sub-entities. |

### 5.2 Zoom Level Summary

| Level | Name | See | Do |
|-------|------|-----|----|
| L1 | Global View | All 6 sectors, health indicators, active alerts | Observe only |
| L2 | Sector | Sector contents, department summaries, agent statuses | Acknowledge alerts, quick actions |
| L3 | Detail | Full entity detail (agent profile, task breakdown, config panels) | Full CRUD, mandate editing, reassignment |
| L4+ | Deep Dive | Sub-entity internals (Pulse history, communication logs, task threads) | Granular edits, historical review |

### 5.3 Chat System

| # | Rule |
|---|------|
| CH-1 | Chat is a first-class feature, not an afterthought bolted onto the dashboard. |
| CH-2 | Chat has dedicated infrastructure separate from data subscriptions (see RT-2). |
| CH-3 | AI chat supports token-by-token streaming for responsive UX. |
| CH-4 | Chat messages are persisted and logged to Memory. |

---

## 6. Real-Time & Execution Rules

### 6.1 Real-Time Architecture

| # | Rule |
|---|------|
| RT-1 | Supabase Realtime handles data subscriptions: tasks, alerts, escalations, dashboard sync. |
| RT-2 | AI chat streaming uses a dedicated channel (WebSocket or SSE). NOT Supabase Realtime. |
| RT-3 | These two channels are architecturally separate. Do not merge them. Do not route AI chat tokens through Supabase Realtime. |
| RT-4 | Data subscriptions are row-level. Clients subscribe to relevant rows, not entire tables. |

### 6.2 Pulse Execution

| # | Rule |
|---|------|
| P-1 | Every ACTIVE operational agent executes a Pulse cycle on schedule (Board agents excluded). Default interval: 15 minutes. |
| P-2 | Pulse phases are fixed: SCAN → ASSESS → DECIDE → EXECUTE → LOG. |
| P-3 | Pulse execution is backend-owned. `pg_cron` triggers Edge Functions. |
| P-4 | Pulse is not client-initiated. The frontend never triggers a Pulse. |
| P-5 | All Pulse actions are logged to Memory (see M-6). |
| P-6 | A failed Pulse does not block other agents. Failures are isolated. |
| P-7 | Board agents do NOT Pulse. Their advisory triggers are system-evaluated. |

### 6.3 Escalation Rules

| # | Rule |
|---|------|
| E-1 | Two escalation types: AWARENESS (non-blocking) and ACTION_REQUIRED (blocks affected work only). |
| E-2 | ACTION_REQUIRED blocks only the specific work item, not the entire agent or department. |
| E-3 | Material Risk escalates directly to CEO, with a copy to the reporting chain. |
| E-4 | Board is never in the escalation path. |
| E-5 | Every escalation must include: trigger, context, impact, recommendation. |

### 6.4 Communication Rules

| Agent Tier | Can Message |
|------------|------------|
| Worker | Own Lead/Manager, peer Workers (same workstream only) |
| Lead | Own Manager, peer Leads, own Workers |
| Manager | Own Chief, peer Managers, own Leads |
| Chief (C-Suite) | CEO, peer Chiefs, own Managers |
| Board | CEO only |

| # | Rule |
|---|------|
| C-1 | All messages are logged to Memory (see M-5). |
| C-2 | Communication paths are enforced. An agent cannot message outside their permitted set. |
| C-3 | No non-CEO agent may message the Board directly. Board advisory is system-triggered. |

### 6.5 Agent Autonomy Model

| Level | Label | Meaning |
|-------|-------|---------|
| A1 | Autonomous | Agent acts within mandate. Logs results. No approval needed. |
| A2 | Supervised | Agent proposes action. Waits for approval from reports_to before executing. |
| A3 | Manual | Agent does nothing unless explicitly instructed. |

| # | Rule |
|---|------|
| AU-1 | Autonomy level is set per-agent by their reports_to (or CEO for C-Suite). |
| AU-2 | Default autonomy for new agents = A2 (Supervised). |
| AU-3 | CEO may override any agent's autonomy level at any time. |

---

## 7. Code Style & Readability

Mission Control code is read by humans who range from senior engineers to a CEO who doesn't write code. Comments and structure must be clear enough that a non-technical reader can understand *what* a file does and *why* decisions were made — without deciphering the code itself.

### 7.1 File Header Comments (Required)

Every source file must begin with a header comment (2–4 lines) explaining:
- What the file is responsible for
- What it owns (inputs, outputs, side effects)
- Any important invariants or gotchas

```
/**
 * Purpose: Handles agent Pulse scheduling + execution orchestration.
 * Owns: Pulse timing, job dispatch, and lifecycle logging.
 * Notes: Board agents are excluded from Pulse (see P-7).
 */
```

| # | Rule |
|---|------|
| CS-1 | Every source file must have a header comment. No exceptions. |
| CS-2 | Header comments are written in plain English for non-technical readers. |
| CS-3 | Header comments must reference relevant convention IDs (e.g., P-7, A-8) when invariants apply. |

### 7.2 Section Banners (Recommended for Long Files)

Files over ~200 lines or with multiple responsibilities should use clear section dividers so humans can scan without reading code:

```
// _______________________________________________
//                 DATA ACCESS LAYER
// _______________________________________________
// Reads/writes Agent + Pulse records. No business logic here.
```

| # | Rule |
|---|------|
| CS-4 | Section banners include a plain-English summary of what the section does. |
| CS-5 | Do not over-section small files. If a file is under ~200 lines with a single responsibility, the header comment is sufficient. |

### 7.3 Inline Comments (Use When Helpful)

Inline comments should explain things the code cannot:
- **Intent** — why this approach was chosen
- **Edge cases** — what breaks if assumptions change
- **Business context** — why this rule exists

Do NOT write comments that repeat what the code already says.

| # | Rule |
|---|------|
| CS-6 | Comments explain *why*, not *what*. If the code is clear, no comment needed. |
| CS-7 | Comments are written in plain English. No jargon without explanation. |
| CS-8 | Edge cases and non-obvious constraints must be commented. Silence on a gotcha is a bug. |

### 7.4 Code-Level Naming & Structure

| # | Rule |
|---|------|
| CS-9 | Prefer obvious names over clever names. `getActiveAgents()` not `fetchAA()`. |
| CS-10 | Group related functions together. Don't scatter related logic across a file. |
| CS-11 | Public API for a module goes near the top. Helpers and internals go below. |
| CS-12 | If a function name needs a comment to explain what it does, rename the function. |
| CS-13 | The readability test: if a non-technical reader cannot understand what a section of code does from the header, banners, and comments alone — it is under-commented. CEO readability is the benchmark, not developer familiarity. |

### 7.5 File Length & Splitting

Long files are a code smell. They hurt readability (CS-13), bloat AI context windows, and usually mean a file is doing more than one job. These limits enforce discipline.

**Thresholds:**
- Under 200 lines: Clean, focused, one job.
- 200–300 lines: Acceptable if cohesive. No action needed.
- 300–500 lines: Amber zone. Should split unless single-responsibility is documented.
- Over 500 lines: Must split or document exception in file header.

| # | Rule |
|---|------|
| CS-14 | Soft limit: 300 lines. If a file crosses 300 lines, review whether it should split. |
| CS-15 | Hard limit: 500 lines. Files exceeding 500 lines must be split or carry a documented exception in the file header explaining why. |
| CS-16 | One primary export per file. Do not stack unrelated components, classes, or modules in the same file. |
| CS-17 | Screen/page files orchestrate layout — they do not implement complex child components inline. Extract children into separate files. |
| CS-18 | Service files split by domain concern. A service doing two unrelated things is two services. |
| CS-19 | Model/type files: one model per file. Shared types may live in a common types file if it stays under the soft limit. |

---

## 8. How This File Is Used

### By Humans (CEO / Developers)
- This file is the constitutional reference for Mission Control.
- When designing a new feature, check conventions.md first. If your design violates a rule here, the design is wrong — not the rule.
- To change a convention, propose the change through proper process (DECISIONS.md), get CEO approval, and update this file. The old rule must be noted in DECISIONS.md as superseded.

### By AI Agents (Claude Code / Agent Personas)
- `CLAUDE.md` instructs all AI agents to read this file during startup.
- Agents MUST NOT produce code, designs, or recommendations that violate any rule in this file.
- If an agent detects a conflict between a spec and this file, the agent must flag it as an escalation — not silently resolve it.
- When in doubt about a design decision, search this file first. The answer is probably here.

### Amendment Process
1. Identify the rule to change and the reason.
2. Log the proposal in DECISIONS.md with rationale.
3. Get explicit CEO approval.
4. Update this file with the new rule.
5. Note the superseded rule in DECISIONS.md (never delete history).
6. Notify affected agents / update specs if needed.

---

*This file is maintained by the Mission Control architecture team. Last substantive update should be logged in RECENT_ACTIVITY.md.*
