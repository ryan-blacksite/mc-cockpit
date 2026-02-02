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
