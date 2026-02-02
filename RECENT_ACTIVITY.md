# Recent Activity

(Keep this short. Bullet points only.)

- Project initialized
- **2026-02-01 (Avery):** Expanded Zoom Model section in VISION.md — formalized zoom levels, visibility/controllability matrix, and "Zoom = Authority" principle. Reasoning documented in BSL-269, BSL-270, BSL-271 comments.
- **2026-02-01 (Avery):** BSL-280 reviewed — conceptually complete per existing VISION.md. Awaiting Fred's buildability confirmation.
- **2026-02-01 (Nicole):** Added "Sector Boundaries & Exclusions" section to VISION.md — explicit inclusions, exclusions, and boundary principles for all six cockpit sectors. Reasoning documented in BSL-272, BSL-273, BSL-274 comments.
- **2026-02-01 (William Parrish):** Added "AI Roles, Authority, and Governance Model" section to VISION.md — authority hierarchy, escalation model (Awareness vs Action), tiered signature authority, spending authority ($0 default), cross-domain disputes, override/veto rules. Reasoning documented in BSL-268, BSL-275, BSL-276 comments.
- **2026-02-01 (William Parrish):** Added Table of Contents and "Future Governance Extensions (Not Yet Implemented)" section to VISION.md — documents Leads tier, escalation-as-routing, tiered signature authority concept, budget delegation, same-level conflict escalation, AI self-auditing. Intent only, no mechanics.
- **2026-02-01 (Nicole):** Locked VISION.md as Vision Doc v1 (Final). Added LOCKED header, logged decision in DECISIONS.md, closed BSL-279.
- **2026-02-01 (Nicole):** Created HANDOFF-PHASE1.md — defines locked outputs, Phase 1 → Phase 2 boundary, and handoff recipients. Closed BSL-283. Phase 1 complete.
- **2026-02-01 (Sergio):** Created `/specs/BOARD-GOVERNANCE-SPEC-v1.md` — deterministic rules for Board onboarding, advisory triggers, Red-Lines, and disagreement handling. BSL-281.
- **2026-02-01 (Fred):** Confirmed BSL-280 buildability — VISION.md provides complete implementation guidance. Closed.
- **2026-02-02 (Fred):** Created `/specs/AI-WORKFORCE-ARCHITECTURE-v1.md` — 5-tier hierarchy (CEO→Chiefs→Managers→Leads→Workers), autonomy model, Pulse cadence, escalation triggers, inter-agent comms. Board explicitly excluded from operational paths. LOCKED. BSL-282.
- **2026-02-02 (Fred):** Created `/specs/MC-RUNTIME-SPEC-v1.md` — execution-grade spec for Claude Code. Infrastructure decisions: Supabase/Postgres persistence, dual real-time channels (Supabase Realtime for data, WebSocket/SSE for AI chat), backend-owned Pulse via Edge Functions + pg_cron. Chat streaming documented as first-class feature. LOCKED. BSL-289.
- **2026-02-02 (Avery):** Created `/specs/MC-COCKPIT-ZOOM-SPEC-v1.md` — execution-grade spec for cockpit layout and zoom mechanics. Spatial dashboard layout, zoom state model, visibility/controllability matrix, 17 invariants, L1 content patterns, API surface. DRAFT. BSL-290.
- **2026-02-02 (Avery):** Finalized MC-COCKPIT-ZOOM-SPEC-v1.md — CEO layout adjustments (Finance large/bottom-center, Governance small/bottom-left), added camera-based zoom with staged detail reveal (Section 5.5), added zoom continuity invariants (Section 8.5). Spec ready for Claude Code. BSL-290 closed.
