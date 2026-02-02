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
