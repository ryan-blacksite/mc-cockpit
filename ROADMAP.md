# Mission Control — Roadmap

**Last Updated:** 2026-02-03 (patched: sector names, authority refs, added TL;DR)
**Maintained By:** Fred Smart (Lead Developer)

---

## Phase Overview

| Phase | Focus | Status |
|-------|-------|--------|
| Phase 1 | Vision & Architecture (specs) | ✅ COMPLETE |
| Phase 2 | Runtime Spec & Infrastructure Decisions | ✅ COMPLETE |
| **Phase 3** | **First Functional Build — Cockpit Shell + Backend Wiring** | **🔵 ACTIVE** |
| Phase 4 | Intelligence Layer (LLM-powered Pulse, real agent logic) | 🔲 PLANNED |
| Phase 5 | Full Sector Build-Out & Multi-Tenancy Hardening | 🔲 PLANNED |

---

## Phase 3 — First Functional Build

### TL;DR (7 bullets)

1. **User signs in** → sees Global View with 6 live sectors (Command, Organization, Operations, Finance, Intelligence, Metrics)
2. **Organization sector** gets full drill-down (Business Units → Departments → Agents) — other 5 are tiles only
3. **Pulse runs mechanically** (pg_cron → Edge Function → Pulse records) — no LLM, proves the infra loop
4. **AI chat streams** via dedicated channel (not Supabase Realtime) with agent context switching
5. **Supabase Realtime** pushes dashboard updates live — no manual refresh
6. **All data from Supabase** — no hardcoded frontend data, demo-grade but structurally correct
7. **Scope is locked:** no LLM Pulse, no Board Onboarding, no multi-company, no other sector deep-dives

---

### Objective

Build a running Mission Control cockpit backed by real infrastructure. A user can log in, see the Global View with 6 sectors, drill into the Organization sector, watch live data updates, and interact with the AI chat interface. Pulse runs mechanically (no LLM). All data is demo-grade but structurally correct against the locked specs.

### Guiding Principles

- **Spec compliance first.** Everything built must conform to `conventions.md` (system invariants), `MC-RUNTIME-SPEC-v1` (runtime objects & infrastructure), and `MC-COCKPIT-ZOOM-SPEC-v1` (zoom behavior). No cowboy architecture.
- **Demo-grade fidelity.** Data is seeded/mocked but structurally matches the real schema. No lorem ipsum garbage.
- **Mechanical before intelligent.** Pulse proves the execution loop works end-to-end. LLM calls come in Phase 4.
- **One deep-dive sector.** Organization gets full drill-down. The other 5 sectors render as tiles with health indicators but show placeholder content on click.

### Authoritative References (Phase 3)

These are the active authorities for Phase 3 implementation. If a locked spec and `conventions.md` conflict, `conventions.md` wins.

| Document | File | Role | Status |
|----------|------|------|--------|
| **Conventions** | `conventions.md` | System invariants, naming, sector definitions (S-2), data ownership | CANONICAL |
| **Runtime Spec** | `specs/MC-RUNTIME-SPEC-v1.md` | Runtime objects, infrastructure, Pulse pseudocode | LOCKED |
| **Cockpit Zoom Spec** | `specs/MC-COCKPIT-ZOOM-SPEC-v1.md` | Zoom levels, transition behavior, visual invariants | LOCKED |
| **Board Governance** | `specs/BOARD-GOVERNANCE-SPEC-v1.md` | Board constraints, onboarding (Phase 4+) | ACTIVE |
| Vision | `specs/VISION.md` | Historical origin doc — conceptual reference only | LOCKED |
| AI Workforce Architecture | `specs/AI-WORKFORCE-ARCHITECTURE-v1.md` | Agent hierarchy, tier model | LOCKED |

---

## Ownership Map

| Role | Person | Responsibility |
|------|--------|----------------|
| **Frontend** | Bridget Thomas | UI, interaction, visual feel, real-time data binding |
| **Backend** | Kori Willis | Services, schema, data, execution, streaming |
| **Lead / Integrator** | Fred Smart | API contracts, spec compliance, integration QA, scope gating |

---

## Backend Tasks — Kori Willis

### K-1: Database Schema & RLS

**Why first:** Every backend task depends on this. No schema = no Pulse, no chat, no APIs.

**Description:**
Translate the 9 runtime objects from MC-RUNTIME-SPEC-v1 §2 into Postgres tables inside Supabase. Apply Row-Level Security (RLS) policies scoped by `company_id` for multi-tenancy isolation.

**Runtime Objects to Translate:**
- §2.1 Company
- §2.2 Sector
- §2.3 Business Unit
- §2.4 Agent
- §2.5 Task
- §2.6 Escalation
- §2.7 Pulse
- §2.8 Message
- §2.9 Session (chat)

**Acceptance Criteria:**
1. All 9 tables created in Supabase with correct column types matching spec field definitions
2. RLS enabled on every table — all queries filtered by `company_id`
3. Foreign key relationships match spec hierarchy (Company → Sector → Business Unit → Agent, etc.)
4. Enum types created for all spec-defined enums (agent tiers, task statuses, escalation severities, etc.)
5. Indexes on frequently queried columns (`company_id`, `agent_id`, `status`, `created_at`)
6. Migration scripts committed and reproducible

**Spec References:** MC-RUNTIME-SPEC-v1 §2 (all subsections), §4.5 (data invariants)

**Dependencies:** None — this is the foundation.

**Blocks:** K-2, K-3, K-4, K-5, K-6

---

### K-2: Auth & Company Bootstrap

**Description:**
Wire up Supabase Auth for user login. Build a seed script that creates a pre-built company with the full default agent roster from MC-RUNTIME-SPEC-v1 §6. Skip the full onboarding flow for Phase 3 — we need an authenticated session and a populated company, not the Board Onboarding experience (that's Phase 4+).

**Deliverables:**
1. Supabase Auth configured (email/password minimum)
2. Seed script that creates:
   - One Company record (status: ACTIVE)
   - CEO Agent (tier 1, human: true, linked to auth user)
   - Full default agent roster from §6 (Board members, Executive Assistant, C-Suite, Managers, Leads, Workers)
   - All 6 Sectors with default configuration
   - At least 2 Business Units under the Organization sector with plausible names
3. Seed script is idempotent (can re-run without duplicating data)
4. Auth session provides `company_id` context for all downstream queries

**Acceptance Criteria:**
1. User can sign up / sign in via Supabase Auth
2. On first login, seed script populates the full company structure
3. Authenticated requests carry `company_id` for RLS filtering
4. Agent roster matches §6 defaults exactly (names, tiers, departments)

**Spec References:** MC-RUNTIME-SPEC-v1 §1.1–1.3 (startup flow), §6 (default agent roster)

**Dependencies:** K-1 (schema must exist)

---

### K-3: Pulse Execution — Mechanical Loop

**Description:**
Implement the Pulse execution loop as a mechanical proof-of-concept. No LLM calls. No SCAN/ASSESS/DECIDE logic. The goal is to prove the infrastructure pattern works: cron fires → Edge Function executes → agents get Pulse records → state updates propagate.

**Scope — IN:**
- pg_cron job fires on configurable interval (default: every 5 minutes for demo)
- Supabase Edge Function receives trigger
- Edge Function queries all active agents for the company
- Creates one Pulse record per agent (status: COMPLETED, output: `{phase3: "mechanical"}`)
- Updates `agent.last_pulse` timestamp
- Pulse records are queryable via API

**Scope — OUT (Phase 4):**
- ❌ No LLM calls during Pulse
- ❌ No SCAN/ASSESS/DECIDE execution
- ❌ No task generation from Pulse output
- ❌ No escalation creation from Pulse output

**Acceptance Criteria:**
1. pg_cron job is registered and fires on schedule
2. Edge Function creates Pulse records for every active agent
3. `agent.last_pulse` updates on each cycle
4. Pulse history is queryable (GET /pulses?agent_id=X)
5. Supabase Realtime broadcasts Pulse writes to subscribed clients

**Spec References:** MC-RUNTIME-SPEC-v1 §2.7 (Pulse object), §5.1 (Pulse Scheduler pseudocode)

**Dependencies:** K-1 (schema), K-2 (agents must exist)

---

### K-4: AI Chat Backend

**Description:**
Build the server-side chat infrastructure. Chat uses a dedicated streaming channel (WebSocket or SSE) — NOT the Supabase Realtime channel used for database subscriptions. This is a critical architectural distinction from MC-RUNTIME-SPEC-v1.

**Deliverables:**
1. Chat session management (create, list, retrieve sessions per company)
2. Streaming endpoint for AI responses (SSE or WebSocket — dedicated channel)
3. Message persistence (user messages + AI responses stored in Messages table)
4. Agent context: chat sessions are scoped to a specific agent or "global" (CEO-level)
5. Basic prompt construction (system prompt includes agent persona + company context)

**Acceptance Criteria:**
1. User can start a chat session (global or agent-scoped)
2. Messages stream back in real-time via dedicated channel
3. Full conversation history persists and is retrievable
4. Session tracks which agent is the chat counterpart
5. Streaming channel is architecturally separate from Supabase Realtime data subscriptions

**Spec References:** MC-RUNTIME-SPEC-v1 §2.8 (Message), §2.9 (Session), §3 (infrastructure — dual channel architecture)

**Dependencies:** K-1 (schema), K-2 (agents + auth)

---

### K-5: Supabase Realtime Setup

**Description:**
Configure Supabase Realtime subscriptions so the cockpit frontend receives live updates when backend data changes. This is the database change channel — separate from the AI chat streaming channel.

**Deliverables:**
1. Realtime enabled on key tables: `agents`, `pulses`, `tasks`, `escalations`, `sectors`
2. Subscription channels scoped by `company_id` (RLS enforced)
3. Frontend can subscribe and receive INSERT/UPDATE events
4. Documented channel naming conventions for Bridget's integration

**Acceptance Criteria:**
1. When Pulse writes new records, subscribed clients receive the event within 2 seconds
2. When agent state changes (e.g., `last_pulse` update), cockpit receives the update
3. RLS ensures clients only see their own company's data
4. Channel docs handed off to Bridget with subscription examples

**Spec References:** MC-RUNTIME-SPEC-v1 §3 (infrastructure — dual channel architecture)

**Dependencies:** K-1 (schema), K-3 (Pulse writes data that triggers Realtime events)

---

### K-6: Demo-Grade Seed Data & APIs

**Description:**
Populate the seeded company with realistic demo data and expose REST APIs for the frontend to consume. Data should look real enough for a demo — plausible names, metrics, timestamps — not placeholder junk.

**Deliverables:**
1. Seed data for all 6 sectors with health scores and summary metrics
2. At least 2 Business Units with departments, agents, tasks
3. Sample Pulse history (last 24h worth of mechanical Pulse records)
4. Sample escalations (2–3 at varying severities)
5. REST API endpoints (or Supabase client queries) for:
   - GET company overview (sectors + health)
   - GET sector detail
   - GET business unit detail
   - GET agent roster (filterable by unit/department)
   - GET pulse history
   - GET escalations
   - GET tasks

**Acceptance Criteria:**
1. Frontend can render the full Global View from API data (no hardcoded UI data)
2. Organization sector drill-down is fully backed by real API responses
3. Data is consistent (agent counts match roster, Pulse timestamps are sequential, etc.)
4. All endpoints respect RLS / auth

**Spec References:** MC-RUNTIME-SPEC-v1 §2 (object shapes), §6 (agent roster)

**Dependencies:** K-1 through K-5 (builds on everything)

---

## Frontend Tasks — Bridget Thomas

### B-1: Render Cockpit Shell — Global View

**Description:**
Build the top-level cockpit layout showing all 6 sectors as a dense, information-rich dashboard. Dark blue / metallic aesthetic. Each sector rendered as a tile with health indicator, summary stats, and key metrics. This is the "mission control room" first impression.

**The 6 Sectors (conventions.md S-2 — canonical names):**
1. Command
2. Organization
3. Operations
4. Finance
5. Intelligence
6. Metrics

**Acceptance Criteria:**
1. All 6 sectors render as distinct visual tiles in a cohesive grid/layout
2. Each tile shows: sector name, health indicator (green/yellow/red), 2–3 summary stats
3. Dark blue / metallic design language — not generic Material Design
4. Layout is responsive but optimized for desktop-first
5. Tiles are clickable (Organization navigates to drill-down; others show placeholder)
6. Data comes from API (K-6), not hardcoded

**Spec References:** conventions.md S-2 (sector definitions), MC-COCKPIT-ZOOM-SPEC-v1 (Global View definition)

**Dependencies:** K-6 (API data), F-1 (API contract for data shapes)

---

### B-2: Camera-Based Zoom

**Description:**
Implement the zoom interaction model from MC-COCKPIT-ZOOM-SPEC-v1. When the user clicks into a sector (Organization), the view animates smoothly from Global View into the sector detail — like a camera zooming in. The transition should feel cinematic, not like a page navigation.

**Deliverables:**
1. Zoom-in animation from Global View → Sector View
2. Zoom-out animation from Sector View → Global View
3. Staged detail reveal (more information appears as you zoom closer)
4. Visual continuity — the sector tile "becomes" the full sector view during transition
5. Breadcrumb or back navigation to return to Global View

**Acceptance Criteria:**
1. Clicking Organization sector triggers smooth zoom animation (not a route change with blank screen)
2. Details reveal progressively during zoom (not all at once)
3. Zoom-out returns to Global View with sector tile in same position
4. Animation timing feels polished (300–500ms range, ease-in-out)
5. No layout jank during transitions

**Spec References:** MC-COCKPIT-ZOOM-SPEC-v1 (zoom levels, invariants, transition behavior), conventions.md UI-2 through UI-10 (zoom rules)

**Dependencies:** B-1 (shell must exist to zoom from)

---

### B-3: Organization Sector Deep-Dive

**Description:**
Build the full drill-down experience for the Organization sector. This is the only sector getting real depth in Phase 3 — it proves the zoom model works and the data hierarchy renders correctly.

**Views to Build:**
1. **Sector Overview** — List of Business Units as tiles with health scores and key metrics
2. **Business Unit Detail** — Departments within the unit, agent counts, active tasks, recent Pulses
3. **Department View** (stretch) — Individual agents, their status, last Pulse, active tasks

**Acceptance Criteria:**
1. Organization sector shows Business Unit tiles with health indicators
2. Clicking a Business Unit zooms into unit detail (departments, agents, metrics)
3. Agent roster visible within unit/department views
4. Data is live from API, not mocked in the UI layer
5. Drill-down follows same zoom animation pattern as B-2
6. Back navigation works at every level (Unit → Sector → Global View)

**Spec References:** conventions.md S-2 (Organization sector), MC-RUNTIME-SPEC-v1 §2.3 (Business Unit), §2.4 (Agent), MC-COCKPIT-ZOOM-SPEC-v1 (drill-down zoom levels)

**Dependencies:** B-2 (zoom), K-6 (API data for units/agents)

---

### B-4: AI Chat UI

**Description:**
Build the frontend chat interface for interacting with AI agents. The chat window should support streaming text display and context switching between global (CEO-level) and agent-specific conversations.

**Deliverables:**
1. Chat window component (expandable/collapsible, docked to cockpit)
2. Streaming text display (tokens appear progressively, not all-at-once)
3. Message history display (scrollable, timestamped)
4. Context switcher: "Talk to [Agent Name]" vs. "Global" chat
5. Agent avatar/name shown in chat header based on active context
6. Send message input with enter-to-send

**Acceptance Criteria:**
1. User can open chat, type a message, and see a streaming AI response
2. Chat persists across navigation (zooming in/out doesn't kill the session)
3. User can switch chat context to a specific agent
4. Message history loads when returning to an existing session
5. Streaming feels natural (no frozen UI while waiting for response)

**Spec References:** MC-RUNTIME-SPEC-v1 §2.8 (Message), §2.9 (Session)

**Dependencies:** K-4 (chat backend + streaming endpoint), F-1 (API contract for chat)

---

### B-5: Realtime Data Binding

**Description:**
Wire up Supabase Realtime subscriptions so the cockpit updates live without page refreshes. When Pulse writes new data or agent states change, the dashboard should reflect it automatically.

**Deliverables:**
1. Subscribe to Supabase Realtime channels for: agents, pulses, tasks, escalations
2. Dashboard health indicators update when new Pulse data arrives
3. Organization drill-down views refresh on data changes
4. Connection status indicator (connected / reconnecting / disconnected)

**Acceptance Criteria:**
1. When a Pulse cycle completes (K-3), cockpit health indicators update within 2 seconds
2. No manual refresh needed to see latest data
3. If Realtime connection drops, UI shows reconnecting state and auto-recovers
4. Subscriptions are scoped by company (no data leakage)

**Spec References:** MC-RUNTIME-SPEC-v1 §3 (dual-channel architecture)

**Dependencies:** K-5 (Realtime setup + channel docs), B-1 (shell to bind data into)

---

## Integrator Tasks — Fred Smart

### F-1: API Contract Document

**Why this exists:** If Bridget and Kori build against assumptions instead of a shared contract, we lose a week to integration mismatches. This gets produced FIRST, before integration work starts.

**Description:**
Author a formal API contract document defining every endpoint, request/response shape, and error code that the frontend and backend must agree on. This is the handshake spec.

**Deliverables:**
1. Endpoint inventory (method, path, description)
2. Request schemas (params, body, headers)
3. Response schemas (success shape, error shape)
4. Error code dictionary
5. Auth requirements per endpoint
6. Supabase Realtime channel naming + event shapes
7. Chat streaming protocol (SSE vs. WebSocket, message format)

**Acceptance Criteria:**
1. Bridget can build UI data fetching from this doc alone (no guessing)
2. Kori can build API responses from this doc alone (no guessing)
3. Document lives in `specs/` and is version-controlled
4. Both Bridget and Kori confirm they've read it before integration starts

**Spec References:** MC-RUNTIME-SPEC-v1 §2 (object shapes), §3 (infrastructure)

**Dependencies:** K-1 (schema informs response shapes)

**Blocks:** B-1, B-3, B-4, B-5 (frontend integration work)

---

### F-2: Spec Compliance Reviews

**Description:**
Review every frontend and backend deliverable against the authoritative specs before it's merged. Fred is the quality gate — nothing ships that contradicts `conventions.md`, `MC-RUNTIME-SPEC-v1`, or `MC-COCKPIT-ZOOM-SPEC-v1`.

**Ongoing Responsibilities:**
- Review Kori's schema against MC-RUNTIME-SPEC-v1 §2 runtime objects
- Review Bridget's cockpit against conventions.md S-2 sector definitions
- Review zoom implementation against MC-COCKPIT-ZOOM-SPEC-v1 invariants
- Review chat implementation against §2.8/§2.9 and dual-channel architecture
- Review Pulse loop against §5.1 pseudocode
- Flag any deviations before they become embedded

**Acceptance Criteria:**
1. Every PR/deliverable gets a spec compliance check before merge
2. Deviations are documented with spec reference and required fix
3. Zero spec violations ship to demo environment

---

### F-3: Integration QA

**Description:**
Verify that frontend and backend actually work together end-to-end. This is not unit testing — it's "does the whole thing function when you wire it up."

**Test Scenarios:**
1. User logs in → cockpit loads with live API data (not cached/mocked)
2. Pulse fires → cockpit health indicators update in real-time
3. User zooms into Organization → drill-down shows correct API-backed data
4. User opens chat → streaming response arrives via dedicated channel
5. User switches chat context → agent persona changes
6. Realtime subscription survives zoom navigation (no dropped connections)

**Acceptance Criteria:**
1. All 6 test scenarios pass in the demo environment
2. Integration bugs are filed with reproduction steps
3. No "works on my machine" deployments

---

### F-4: Scope Gating

**Description:**
Actively prevent Phase 3 from expanding beyond its defined boundaries. If someone wants to add LLM-powered Pulse, full onboarding, or 6-sector deep-dives, the answer is "Phase 4."

**Explicit Phase 3 Boundaries:**
- ✅ Mechanical Pulse (no LLM)
- ✅ Organization sector deep-dive only
- ✅ Seeded company (no onboarding flow)
- ✅ Demo-grade data (not production pipelines)
- ✅ Email/password auth (no SSO, no OAuth providers)
- ❌ No LLM calls in Pulse
- ❌ No Board Onboarding Session
- ❌ No deep-dive on Command, Operations, Finance, Intelligence, or Metrics sectors
- ❌ No multi-company support (single seeded company)
- ❌ No production monitoring / alerting
- ❌ No feature flags or error tracking (LaunchDarkly/Sentry deferred)

---

## Sequencing & Dependencies

```
K-1 (Schema)
 ├── K-2 (Auth + Seed) ──────────────────────┐
 │    ├── K-3 (Pulse Loop) ──┐               │
 │    │    └── K-5 (Realtime)│               │
 │    ├── K-4 (Chat Backend) │               │
 │    └── K-6 (Seed Data/APIs) ◄─────────────┘
 │
 └── F-1 (API Contracts) ◄── depends on K-1 schema
      ├── B-1 (Cockpit Shell) ◄── needs API contract + K-6 data
      │    ├── B-2 (Zoom) ◄── needs shell to zoom from
      │    │    └── B-3 (Org Deep-Dive) ◄── needs zoom + K-6 data
      │    └── B-5 (Realtime Binding) ◄── needs K-5 channels + shell
      └── B-4 (Chat UI) ◄── needs API contract + K-4 backend
```

**Critical Path:** K-1 → K-2 → K-6 → F-1 → B-1 → B-2 → B-3

**Parallel Tracks (after K-1):**
- Kori: K-2 → K-3/K-4/K-5 → K-6 (some can overlap)
- Fred: F-1 (as soon as K-1 schema is reviewed)
- Bridget: B-1 shell layout/styling can start with mock data while waiting for F-1, then swap to real APIs

---

## Phase 3 Exit Criteria

Phase 3 is **done** when:

1. A user can sign in and see the cockpit Global View with 6 sectors showing live data
2. Clicking Organization zooms smoothly into unit → department → agent views
3. Pulse mechanical loop is running and cockpit reflects Pulse writes in real-time
4. AI chat streams responses with agent context switching
5. All data comes from Supabase (no hardcoded frontend data)
6. Fred has signed off on spec compliance for all deliverables
7. Ryan and Bree can run through the demo without hitting broken states

---

## Future Phases (Placeholder)

### Phase 4 — Intelligence Layer
- LLM-powered Pulse (SCAN/ASSESS/DECIDE/ACT)
- Real task generation from Pulse output
- Escalation creation and routing
- Board Onboarding Session (full flow)
- Agent-to-agent communication

### Phase 5 — Full Sector Build-Out
- Deep-dive for all 6 sectors
- Multi-company / true multi-tenancy
- Production hardening (monitoring, alerting, error tracking)
- Feature flags (LaunchDarkly or similar)
- SSO / OAuth provider support
