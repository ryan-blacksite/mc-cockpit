# Session Changes

This file captures the changes made in this session, including per-file intent and unified diffs.

## VISION.md (v1.1 → v1.2)
Intent: Fix mechanical rename damage from v1.1 sector-name sweep. Targeted phrase-level corrections instead of global word-boundary replacements.

### Fixes applied:
1. **"Intelligence & Intelligence" → "Intelligence"** — 12 occurrences. Original "Memory & Intelligence" was mechanically broken by replacing the word "Memory" globally.
2. **Restored generic prose words** — Words like "memory", "configuration", "governance", "outcomes" were incorrectly replaced with sector names ("Intelligence", "Finance", "Operations", "Metrics") in mid-sentence prose where they were used as ordinary English, not sector references. ~20 locations fixed.
3. **Operations ≠ "The Board"** — Removed "(The Board)" framing from Operations sector per conventions.md §1.2. Operations houses Board advisory records but is not the Board sector.
4. **Finance sector/department disambiguation** — Added "Finance (Platform Controls)" qualifier and disambiguation notes to distinguish the Finance sector (platform settings, cost controls) from the Finance department (CFO — money, budgets).

```diff
diff --git a/VISION.md b/VISION.md
--- a/VISION.md (v1.1)
+++ b/VISION.md (v1.2)

 # Sector label fix: "Intelligence & Intelligence" → "Intelligence"
 # Applied to 12 locations (ToC, sector table, section headers, boundary references, appendix)

-Intelligence & Intelligence	Decisions, history, knowledge, logs
+Intelligence	Decisions, history, knowledge, logs

 # Prose restoration: generic words incorrectly replaced with sector names

-Mission Control supplies the structure, execution, Operations, Intelligence, and cadence...
+Mission Control supplies the structure, execution, oversight, institutional knowledge, and cadence...

-•	Operations rhythms
+•	Governance rhythms

-•	Organizational Intelligence
+•	Organizational memory

-An agent contains Intelligence and action logs.
+An agent contains memory and action logs.

-history, logs, Intelligence, Finance, relationships, state
+history, logs, memory, configuration, relationships, state

-edit Intelligence
+edit memory

-System settings and technical Finance → Finance
+System settings and technical configuration → Finance

-not monitoring Metrics or managing
+not monitoring metrics or managing

-System Finance and preferences → Finance
+System configuration and preferences → Finance

-Board-level Operations and advisory content → Operations
+Board-level oversight and advisory content → Operations

-Cross-cutting institutional Intelligence and audit logs
+Cross-cutting institutional memory and audit logs

-Global system settings and platform Finance → Finance
+Global system settings and platform configuration → Finance

-System Finance or platform settings → Finance
+System configuration or platform settings → Finance

-Decision history or institutional Intelligence
+Decision history or institutional memory

-Risk Operations or approval workflows → Operations
+Risk oversight or approval workflows → Operations

-Department-specific tool Finance
+Department-specific tool configuration

-See their mandate, recent actions, Intelligence
+See their mandate, recent actions, memory

-•	Persistent Intelligence
+•	Persistent memory

-- Accountable for Metrics in their domain  (2 occurrences)
+- Accountable for outcomes in their domain

-They see the Metrics: work completed, risks surfaced, decisions queued.
+They see the results: work completed, risks surfaced, decisions queued.

-Cadence Finance
-Cadence settings live in Finance:
+Cadence Settings
+Cadence settings live in the Finance sector:

-Self-auditing would feed into Intelligence & Intelligence, creating
+Self-auditing would feed into the Intelligence sector, creating

 # Operations/Board alignment with conventions.md §1.2

-Operations	The Board, strategic challenges, approvals
+Operations	Oversight, governance, Board advisory records

-Operations (The Board)
-•	Advisory challenges and strategic pressure-testing
+Operations
+•	Oversight and governance records
+•	Board advisory challenges and strategic pressure-testing
 ...
-The Board advises. The CEO decides. Dissent is always on the record.
+Operations houses Board advisory records and governance oversight. The Board advises. The CEO decides. Operations is not "the Board sector"—it is where oversight and governance records live (see conventions.md §1.2).

-**Operations (The Board)**
+**Operations**
 *What Belongs:*
+- Oversight and governance records
+- Board advisory challenges and strategic pressure-testing
 ...
-*Boundary Principle:* Operations is for deliberation and challenge...
+*Boundary Principle:* Operations is for oversight, governance, and deliberation—not direction or execution. Board advisory records are stored here, but Operations is not "the Board sector" (see conventions.md §1.2).

-├── Operations (Board)
+├── Operations

 # Finance sector/department disambiguation

-Finance
+Finance (Platform Controls)
 •	Cadence settings...
-This is not a department—it's the control panel for the cockpit itself.
+This is not the Finance department (CFO)—it's the control panel for the cockpit itself. The canonical sector enum is `Finance`; use "Finance (Platform Controls)" in prose where the department collision creates ambiguity.

-**Finance**
+**Finance (Platform Controls)**
+*Note: The Finance sector (platform settings, cost controls, cadence) is distinct from the Finance department (CFO — money, budgets, forecasts, billing)...*

-*Boundary Principle:* Finance is the control panel for the cockpit itself—not the company.
+*Boundary Principle:* The Finance sector is the control panel for the cockpit itself—not the company.
```

## conventions.md
Intent: Add Finance sector/department naming disambiguation note under §1.5 Structural Invariants.

```diff
diff --git a/conventions.md b/conventions.md
--- a/conventions.md
+++ b/conventions.md
@@ -75,6 +75,8 @@
 | S-4 | Sector types are enum, not user-defined strings. |
 | S-5 | Every company begins with a Board onboarding session before any operational activity. |

+**Naming disambiguation:** The `Finance` sector (platform settings, cadence, cost controls) shares a name with the `Finance` department type (CFO — money, budgets, forecasts). Context always distinguishes them: the sector controls the cockpit platform; the department manages company finances. In prose where ambiguity is possible, qualify as "Finance sector (platform controls)" vs "Finance department (CFO)."
+
 ---
```

## Verification
- `grep -r "Intelligence & Intelligence"` → 0 hits (excluding this file)
- All prose reads naturally — no sector names injected mid-sentence
- VISION.md Operations sector aligned with conventions.md §1.2 (not "the Board sector")
- Finance sector vs Finance department disambiguated in both VISION.md and conventions.md
