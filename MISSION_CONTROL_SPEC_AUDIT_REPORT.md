Confirmed Consistencies
- CEO authority is absolute, override permitted, and no AI can block CEO action across `conventions.md`, `specs/MC-RUNTIME-SPEC-v1.md`, `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`, `specs/BOARD-ADVISORY-RUNTIME-SPEC-v1.md`, and `VISION.md`.
- Board is advisory-only, non-blocking, and excluded from operational escalation paths in `conventions.md`, `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`, `specs/MC-RUNTIME-SPEC-v1.md`, `specs/BOARD-ADVISORY-RUNTIME-SPEC-v1.md`, and `VISION.md`.
- Escalation classes (Awareness vs Action Required) and ?blocks only affected work? align between `conventions.md`, `specs/MC-RUNTIME-SPEC-v1.md`, `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`, and `VISION.md`.
- Pulse phase order and logging requirements are consistent across `conventions.md`, `specs/MC-RUNTIME-SPEC-v1.md`, and `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`.
- Zoom = Authority and UI-owned zoom state are consistent between `conventions.md`, `VISION.md`, and `specs/MC-COCKPIT-ZOOM-SPEC-v1.md`.
- Chat streaming must be separate from Supabase Realtime in `conventions.md` and `specs/MC-RUNTIME-SPEC-v1.md`.

Warnings (Non-breaking)
- ?Unit? is in the audit checklist but is not defined in any authoritative spec; this is a scope gap that could cause future drift.
- `specs/MC-RUNTIME-SPEC-v1.md` Autonomy Checker references `agent.spending_authority`, but `Agent` schema does not define it; only `Company.spending_authority_usd` exists. This is ambiguous for per-agent spending authority.
- `VISION.md` is reference-only and contains ?Future Governance Extensions? (e.g., Lead tier) that are now implemented in `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`; this is not a conflict but could mislead unless clearly marked historical.

Conflicts (Must Fix)
1) Default autonomy level mismatch
- File A: `conventions.md`
- File B: `specs/MC-RUNTIME-SPEC-v1.md` and `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`
- Object / Section: Autonomy defaults
- Why it conflicts: `conventions.md` sets default autonomy for new agents to A2 (Supervised), while `MC-RUNTIME-SPEC` sets `Company.default_autonomy = A1` and `AI-WORKFORCE` defines default autonomy by tier as A1 and config default A1.
- Suggested resolution direction: Align defaults to A2 everywhere or update `conventions.md` explicitly (since it is canonical).

2) Sector count and schema drift (Finance as a sector)
- File A: `conventions.md` and `specs/MC-RUNTIME-SPEC-v1.md`
- File B: `specs/MC-COCKPIT-ZOOM-SPEC-v1.md`
- Object / Section: Sector definitions
- Why it conflicts: Canonical runtime defines exactly 6 sectors (Command, Governance, Organization, Outcomes, Memory, Configuration). Zoom spec declares sector count 6 but lists 7 sectors and adds `FINANCE` as its own sector, which is not in the runtime enum.
- Suggested resolution direction: Remove Finance as a sector and place finance data under Organization/Outcomes, or formally add Finance sector in runtime + conventions (the latter is a constitutional change).

3) Board communications scope
- File A: `conventions.md` and `specs/MC-RUNTIME-SPEC-v1.md`
- File B: `specs/BOARD-ADVISORY-RUNTIME-SPEC-v1.md`
- Object / Section: Board communication rules
- Why it conflicts: `conventions.md` and runtime invariants state Board agents may only message the CEO. Board advisory spec allows Board inter-member communication within Board sessions, which is still agent-to-agent messaging.
- Suggested resolution direction: Route inter-board discussion through a system-mediated transcript controlled by the Chairman (system write), or adjust `conventions.md` to explicitly allow Board-only session comms.

4) Board escalation path via UI ?Emergency escalation to Board?
- File A: `conventions.md` and `specs/MC-RUNTIME-SPEC-v1.md`
- File B: `specs/MC-COCKPIT-ZOOM-SPEC-v1.md`
- Object / Section: L1 emergency controls
- Why it conflicts: Zoom spec allows ?Emergency escalation to Board,? but canonical rules state Board is never in escalation paths and never blocks/mediates operational issues.
- Suggested resolution direction: Replace with ?Request Board Advisory? or ?Notify CEO? (non-blocking) and keep Board off escalation routes.

5) Board pulse participation
- File A: `specs/MC-RUNTIME-SPEC-v1.md`
- File B: `conventions.md` and `specs/BOARD-ADVISORY-RUNTIME-SPEC-v1.md`
- Object / Section: Pulse invariants
- Why it conflicts: Runtime invariant says every ACTIVE agent executes Pulse on schedule. Conventions and Board advisory spec explicitly state Board agents do not Pulse and must be skipped.
- Suggested resolution direction: Update runtime invariant and scheduler to explicitly exclude Board agents from Pulse execution.

6) Ownership/write authority for Board advisory records
- File A: `conventions.md`
- File B: `specs/MC-RUNTIME-SPEC-v1.md` and `specs/BOARD-ADVISORY-RUNTIME-SPEC-v1.md`
- Object / Section: Data ownership & write rules
- Why it conflicts: `conventions.md` states Board advisory records are system-owned and system-only writes, but runtime write patterns allow Board to write advisory content, and Board advisory spec says Board agents can write Advisory records.
- Suggested resolution direction: Make advisories system-written (Board provides content but system persists), or amend `conventions.md` (not recommended).

7) Core object schema drift (Agent/Pulse/Escalation)
- File A: `specs/MC-RUNTIME-SPEC-v1.md`
- File B: `specs/AI-WORKFORCE-ARCHITECTURE-v1.md`
- Object / Section: Data structures
- Why it conflicts: AI workforce ?Data Structures Needed? uses different field names and types (e.g., `reportsTo` vs `reports_to`, `department: string` vs `department_id: UUID | null`, Escalation missing `impact`, different enum casing). This breaks schema consistency for core objects.
- Suggested resolution direction: Update AI workforce schema snippets to match runtime object definitions exactly.

Final Verdict
BLOCKED  conflicts must be resolved before code
