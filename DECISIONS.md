# Decisions Log

Material decisions and strong recommendations. Include rationale.

---

### 2026-02-01 — AI Governance Model Decisions (BSL-268)

**Decision Maker:** CEO (Ryan)

**Context:** Defining authority boundaries and escalation behavior for Mission Control's AI workforce.

**Decisions Made:**

1. **Escalation Classes**
   - Two types: Awareness (FYI, non-blocking) and Action (requires intervention)
   - Default posture is autonomy; CEO is informed, not burdened
   - *Rationale:* Preserves CEO attention for what matters; prevents bottleneck

2. **Signature Authority**
   - Tiered: Worker → Manager → Chief → CEO
   - Some issues approved at lower tiers; others escalate by severity
   - Executive issues via periodic C-Suite reviews, not constant interruption
   - *Rationale:* Mirrors real corporate governance; enables autonomous operation

3. **Spending Authority**
   - Default budget system-wide: $0
   - Any real-world spend auto-escalates to CEO
   - Future department budgets CEO-configurable only
   - *Rationale:* Maximum protection until trust is established; CEO controls purse strings

4. **Cross-Domain Disputes**
   - Chiefs escalate directly to CEO
   - No Board mediation layer
   - *Rationale:* Board is advisory only; decision authority rests with CEO

**Open Items (Not Yet Decided):**
- Escalation timeout behavior (pause vs. proceed after delay)
- Specific spending thresholds per department
- Signature authority tier requirements per issue type

---

### 2026-02-01 — Open Thread Resolution & Future Extensions (BSL-268)

**Decision Maker:** CEO (Ryan)

**Context:** Resolving open threads from governance model and adding future extension documentation.

**Decisions Made:**

1. **Escalation Timeout**
   - No fixed timeout in Phase 0
   - Escalations surface and wait; system continues operating
   - Blocking applies only to affected thread, never entire company
   - Formalize later when UX and notification mechanics exist
   - *Rationale:* Avoid over-engineering before implementation reality is known

2. **Department Budgets**
   - Default remains $0 system-wide
   - When enabled: set at Chief level by CEO with CFO support
   - Until configured, all real-world spend escalates to CEO
   - *Rationale:* Maintain tight fiscal control; delegate only when trust is established

3. **Signature Tier Requirements**
   - Tiered signature authority concept approved
   - Exact tier mappings (issue types, enforcement) deferred
   - Capture concept, not mechanics
   - *Rationale:* Preserve flexibility; avoid premature rule-making

**Future Extensions Documented (Intent Only):**
- Expanded hierarchy including Leads (between Managers and Workers)
- Universal escalation as routing (not failure)
- Tiered signature authority (concept approved, mechanics deferred)
- Budget delegation model (CEO → Chiefs with CFO support)
- Same-level conflict escalation (up one level)
- AI self-auditing as future capability

**Additional Work:**
- Table of Contents added to VISION.md for human and AI navigation

---

### 2026-02-01 — Vision Doc v1 Locked (BSL-279)

**Decision:** Vision Doc v1 locked  
**Artifact:** `VISION.md` v4  
**Rationale:** Phase 1 vision freeze  
**Authority:** CEO

All downstream work must conform to this locked vision. Changes require CEO approval and a new version.

---

### 2026-02-02 — AI Workforce Architecture Spec v1 Locked (BSL-282)

**Decision:** AI Workforce Architecture Spec v1 locked  
**Artifact:** `/specs/AI-WORKFORCE-ARCHITECTURE-v1.md`  
**Owner:** Fred Smart  
**Authority:** CEO

**Key Architectural Decisions:**

1. **5-Tier Hierarchy**
   - CEO → C-Suite → Managers → Leads → Workers
   - Leads are first-class (Tier 4), not deferred
   - *Rationale:* Leads coordinate Workers and own workstreams; essential for scalable task management

2. **Board Exclusion from Operations**
   - Board is advisory-only
   - Never appears in escalation paths, approval paths, or operational communications
   - *Rationale:* Clean separation between advisory and operational authority

3. **Default Autonomy = A1 (Auto-Execute)**
   - All tiers operate autonomously within their mandate
   - Escalation is the exception, not the rule
   - *Rationale:* System should run without permission; CEO intervenes only when necessary

4. **Escalation Chain**
   - Worker → Lead → Manager → Chief → CEO
   - Material Risk escalates direct to CEO (copy chain)
   - *Rationale:* Preserve chain of command while allowing critical issues to surface immediately

5. **Pulse Cadence = 15 minutes**
   - Default interval for agent execution cycles
   - Configurable in Configuration sector
   - *Rationale:* Balance between responsiveness and system load

All downstream implementation must conform to this locked spec. Changes require CEO approval and a version bump.

---

### 2026-02-02 — Cockpit & Zoom Spec v1 Finalized (BSL-290)

**Decision:** Cockpit & Zoom Execution Spec v1 finalized  
**Artifact:** `/specs/MC-COCKPIT-ZOOM-SPEC-v1.md`  
**Owner:** Avery James  
**Authority:** CEO

**Layout Decisions:**

1. **Sector Sizing**
   - Finance: Large, bottom-center
   - Governance: Small, bottom-left
   - Command, Organization, Outcomes: Medium (top row)
   - Memory: Small, bottom-right
   - *Rationale:* Finance (burn/runway) is daily-driver data; deserves visual prominence. Command's top-center *position* signals importance without needing size dominance.

**UX Decisions:**

2. **Camera-Based Zoom Model**
   - Zoom is literal camera approach, not view switching
   - Same pixels persist during zoom motion; layout scales toward target
   - No new panels or controls appear during motion
   - *Rationale:* Spatial continuity creates sense of place, not a dashboard with tabs

3. **Staged Detail Reveal**
   - Detail content reveals AFTER zoom motion completes
   - L2/L3 content appears as overlay/expansion, not full reflow
   - *Rationale:* Progressive disclosure prevents cognitive overload; feels like approaching a surface

**Core Principle Locked:**
```
Zoom = spatial continuity + progressive disclosure
Never teleport. Never hard-swap screens.
```

All downstream implementation must conform to this spec. Changes require designer (Avery) + CEO approval.

---

### 2026-02-02 — Mission Control Runtime Spec v1 Locked (BSL-289)

**Decision:** MC Runtime Spec v1 locked  
**Artifact:** `/specs/MC-RUNTIME-SPEC-v1.md`  
**Owner:** Fred Smart  
**Authority:** CEO

**Infrastructure Decisions:**

1. **Persistence Layer: Supabase (Postgres)**
   - All runtime objects stored in Postgres
   - Row-level security (RLS) for multi-tenancy by company_id
   - Supabase Auth for user management
   - *Rationale:* Mission Control's data model is heavily relational; Postgres handles hierarchical relationships cleanly

2. **Real-time Architecture: Dual Channels**
   - **Supabase Realtime** → Data subscriptions (tasks, alerts, escalations, dashboard sync)
   - **Dedicated WebSocket/SSE** → AI chat streaming (token-by-token LLM responses)
   - *Rationale:* Supabase Realtime is optimized for database changes, not arbitrary streaming; chat requires dedicated low-latency bidirectional channel

3. **Pulse Execution: Backend-Owned**
   - pg_cron triggers Pulse scheduler on interval
   - Supabase Edge Functions execute Pulse logic
   - *Rationale:* Pulse is the company's heartbeat; cannot depend on browser being open

4. **AI Chat as First-Class Feature**
   - ChatSession and ChatMessage data structures defined
   - Chat API surface documented (session ops, message ops, streaming endpoint)
   - Chat invariants established (6 rules)
   - *Rationale:* Real-time chat with every AI agent is fundamental to Mission Control

5. **Board Personas: Out of Scope**
   - Personas defined in BOARD-GOVERNANCE-SPEC, not runtime spec
   - *Rationale:* Runtime spec defines mechanics, not content

All downstream implementation must conform to this locked spec. Changes require CEO approval and a version bump.

---

### 2026-02-03 — Board Advisory Runtime Spec v1 Drafted (BSL-292)

**Decision:** Board Advisory Runtime Spec v1 drafted for CEO review  
**Artifact:** `/specs/BOARD-ADVISORY-RUNTIME-SPEC-v1.md`  
**Owner:** William Parrish  
**Authority:** Pending CEO review

**Key Architectural Decisions:**

1. **Board Agents Do NOT Pulse**
   - Board agents are excluded from the Pulse execution loop
   - Advisory triggers evaluated by the system on Board’s behalf, after agent Pulses
   - *Rationale:* Board is reactive, not proactive. It watches and responds to triggers — it does not scan, assess, decide, or execute.

2. **Non-Blocking Is Structural, Not Configurable**
   - `Advisory.blocks_work` hardcoded to `false`
   - `BoardDissent.blocks_decision` hardcoded to `false`
   - No field, flag, or configuration can make Board output blocking
   - *Rationale:* VISION.md and BOARD-GOVERNANCE-SPEC are unambiguous: Board advises, CEO decides. Making this a data constraint (not just a policy) prevents implementation drift.

3. **Red-Line Triggers Are Immutable**
   - CEO cannot disable Red-Line triggers (ILLEGAL_ACTIVITY, DIRECT_HARM, DECEPTION_AT_SCALE, CHILD_EXPLOITATION)
   - CEO cannot disable ethical risk triggers
   - CEO cannot disable CEO_REQUEST trigger mechanism
   - *Rationale:* Ethical guardrails are non-negotiable. These are the company’s moral floor.

4. **Pattern-Based Triggers Use LLM Classification**
   - Legal risk, ethical risk, and strategic drift detection use LLM classifiers during Pulse
   - Confidence threshold: >0.7 to fire
   - Rate limit: Same trigger fires at most once per 24 hours
   - *Rationale:* These risks are contextual and require judgment, not threshold math. Rate limiting prevents advisory fatigue.

5. **Governance Sector Health Model**
   - RED: Active Red-Line event, 3+ unacknowledged advisories, or pending ethical risk advisory
   - YELLOW: Any pending advisory, or dissent logged in past 7 days
   - GREEN: No pending advisories, no recent Red-Lines
   - *Rationale:* CEO needs at-a-glance health of the governance system. Color-coded signals match cockpit UX.

6. **Onboarding Session State Machine**
   - PENDING → IN_PROGRESS → OUTPUTS_PENDING → COMPLETE
   - ABANDONED path only via Red-Line + CEO refusal to pivot
   - Exactly one onboarding session per company (invariant)
   - *Rationale:* Clean, deterministic lifecycle. No ambiguous states.

**Strong Recommendations (Not Yet Decided):**
- Board member persona files should be created before implementation begins
- Advisory rate limiting (24hr) should become CEO-configurable in a future phase
- Metric names in financial triggers need alignment with Finance data model spec (when it exists)

---

### 2026-02-03 — VISION.md Demoted from Mandatory Claude Code Startup

**Decision:** VISION.md removed from mandatory startup sequence in CLAUDE.md; moved to Optional Reference section  
**Artifact:** `CLAUDE.md` (updated)  
**Decision Maker:** CEO (Ryan)  
**Recommended By:** Fred Smart

**Context:** VISION.md was step 2 of Claude Code's 5-step mandatory startup. It contains outdated specifics (old sector names, structures) that conflict with conventions.md. Claude Code was reading VISION.md first and conventions.md second, creating a conflict window where incorrect details could be internalized.

**Rationale:**
1. VISION.md is LOCKED as a historical document — it will never be updated to match current specifics
2. conventions.md is the constitutional reference and supersedes VISION.md on all details
3. Claude Code executing tasks (migrations, Edge Functions, UI components) does not need philosophical context
4. The dev team (Fred, Bridget, Kori) carries the vision and translates it into specs and Linear tickets
5. Removing VISION.md from mandatory startup saves tokens and eliminates conflict risk

**New Startup Sequence (4 steps):**
1. INDEX.md — repo structure
2. conventions.md — constitutional reference
3. Agent worklog — prior context
4. Linear issues — current scope

VISION.md remains in the repo and is documented as optional reference for agents needing philosophical context.

---

### 2026-02-03 — INDEX.md Redesigned as Pure Repo Map

**Decision:** INDEX.md rewritten to contain only file pointers; all governance content removed  
**Artifact:** `INDEX.md` (rewritten)  
**Decision Maker:** CEO (Ryan)  
**Recommended By:** Fred Smart

**Context:** INDEX.md contained a "Rules" section duplicating instructions from CLAUDE.md (shutdown procedures, update requirements). It also described conventions.md as generic "code and system rules" and listed VISION.md as "Product north star" — both inconsistent with their actual roles.

**Problems Solved:**
1. Duplicate Rules section eliminated — CLAUDE.md owns operating procedures, conventions.md owns invariants
2. conventions.md upgraded to "Constitutional source of truth" — matches actual authority
3. VISION.md reframed as "LOCKED — historical reference" — matches CLAUDE.md
4. ROADMAP.md flagged as empty — honest instead of pointing at blank file

**Principle Established:** INDEX.md is a map, not a constitution. It tells you what exists and where to find it. It does not contain rules, governance, or authority claims. Those live in their canonical locations.

---

### 2026-02-03 — "God View" Replaced with "Global View" (Repo-Wide)

**Decision:** All references to "God View" replaced with "Global View" across the entire MC-Cockpit repo  
**Decision Maker:** CEO (Ryan)  
**Executed By:** Fred Smart

**Context:** The L1 zoom level (top-level cockpit view showing all 6 sectors) was referred to as "God View" in multiple documents. CEO requested removal of religious terminology.

**Replacement Term:** "Global View"  
**Rationale:** Maintains identical semantic meaning (top-level, everything visible, maximum overview) without religious connotation. Clean swap — no architectural or spec implications.

**Files Patched:**
- `ROADMAP.md` — 12 instances
- `conventions.md` — 3 instances (UI-3, UI-7, Section 5.2)
- `MC-COCKPIT-ZOOM-SPEC-v1.md` — 5 instances (Sections 3.1, 3.2, 4.2, 6)

**Verification:** Full repo sweep confirmed zero remaining instances across all agent files, spec files, and root documentation.

**Standing Rule:** "Global View" is the only approved term for L1 zoom level. "God View" must not appear in any future documentation or code.

---

### 2026-02-03 — Phase 3 ROADMAP Created

**Decision:** Phase 3 implementation roadmap authored and committed  
**Artifact:** `ROADMAP.md`  
**Owner:** Fred Smart  
**Authority:** CEO

**Key Structural Decisions:**

1. **15 Tasks, 3 Owners**
   - Kori Willis: 6 backend tasks (schema, auth, API, Realtime, Pulse, chat)
   - Bridget Thomas: 5 frontend tasks (Global View, sector L2, agent L3, chat UI, zoom navigation)
   - Fred Smart: 4 integration tasks (wiring, auth flow, vertical slice, acceptance testing)
   - *Rationale:* Clear ownership prevents overlap; dependency chains ensure correct build order

2. **Exit Condition**
   - Vertical slice: auth → Global View → Sector L2 → Agent L3 → live chat, running on Supabase with real data
   - *Rationale:* Proves the full stack works end-to-end before expanding breadth

3. **1:1 Linear Conversion**
   - Each task designed with title, owner, dependencies, deliverables, and acceptance criteria matching Linear issue format
   - *Rationale:* Eliminates translation step from roadmap to project tracker

All Phase 3 implementation work must follow this roadmap. Changes require CEO approval.

---

### 2026-02-03 — VISION.md v1.2: Mechanical Rename Damage Fixed

**Decision:** Fix mechanical rename damage in VISION.md v1.1 and align VISION/conventions on two disputed points
**Artifact:** `VISION.md` v1.2, `conventions.md` (disambiguation note added)
**Authority:** Executing task per CEO-approved issue

**Problems Fixed:**

1. **"Intelligence & Intelligence"** — The v1.1 session replaced "Memory" globally, turning "Memory & Intelligence" into "Intelligence & Intelligence" (12 occurrences). Corrected to "Intelligence" per conventions.md S-2.

2. **Prose damage from mechanical replacement** — Generic English words (memory, configuration, governance, outcomes) were replaced with sector names (Intelligence, Finance, Operations, Metrics) in ~20 locations where they appeared in ordinary prose, not as sector references. Restored correct English.

3. **Operations ≠ "The Board"** — VISION.md framed Operations as "Operations (The Board)". conventions.md §1.2 explicitly states "This does not make Operations the Board sector." VISION.md updated to remove "(The Board)" framing and add alignment note referencing conventions.md §1.2. conventions.md wins per conflict resolution rule.

4. **Finance sector/department name collision** — Both the sector enum (`Finance`) and a department type (`Finance`) share the same name. Added disambiguation language to VISION.md ("Finance (Platform Controls)" qualifier) and conventions.md (naming disambiguation note under §1.5). No enum change—context distinguishes them.

**Principle Applied:** Targeted phrase-level swaps instead of global word-boundary replacements. Sector names appear only where they are used *as sector names*, not where the same word appears in ordinary English.

---
