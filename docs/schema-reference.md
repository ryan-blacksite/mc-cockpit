# Mission Control — Schema Reference

> **Source:** `supabase/migrations/001_mc_runtime_schema.sql`
> **Spec:** MC-RUNTIME-SPEC-v1 §2 (Core Runtime Objects), §8.3.2 (Chat)
> **Author:** Kori Willis — 2026-02-04
> **Linear:** BSL-302 (K-1 — Database Schema & RLS)

---

## Quick Index

| # | Table | Purpose | Spec Section |
|---|-------|---------|-------------|
| 1 | `companies` | Root object — one per user account | §2.1 |
| 2 | `sectors` | 6 fixed cockpit divisions | §2.2 |
| 3 | `departments` | Business units within Organization | §2.3 |
| 4 | `agents` | AI personas at all tiers (1–5) | §2.4 |
| 5 | `tasks` | Work units assigned to agents | §2.5 |
| 6 | `escalations` | Issues requiring higher authority | §2.6 |
| 7 | `pulses` | Agent execution cycles | §2.7 |
| 8 | `messages` | Inter-agent communication | §2.8 |
| 9 | `memory_entries` | Persistent organizational knowledge | §2.9 |
| 10 | `chat_sessions` | User ↔ Agent chat sessions | §8.3.2 |
| 11 | `chat_messages` | Individual messages within chat | §8.3.2 |

---

## Enum Types

### Status & State

| Enum | Values |
|------|--------|
| `company_status` | `ONBOARDING`, `ACTIVE`, `SUSPENDED` |
| `agent_status` | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `task_status` | `PENDING`, `IN_PROGRESS`, `BLOCKED`, `COMPLETE`, `CANCELLED` |
| `escalation_status` | `PENDING`, `ACKNOWLEDGED`, `RESOLVED` |
| `pulse_status` | `RUNNING`, `COMPLETE`, `FAILED` |
| `chat_session_status` | `ACTIVE`, `CLOSED` |
| `health_status` | `GREEN`, `YELLOW`, `RED` |

### Classification

| Enum | Values |
|------|--------|
| `sector_type` | `COMMAND`, `ORGANIZATION`, `OPERATIONS`, `FINANCE`, `INTELLIGENCE`, `METRICS` |
| `department_type` | `FINANCE`, `OPERATIONS`, `PRODUCT`, `TECHNOLOGY`, `MARKETING`, `SALES`, `LEGAL`, `EXTERNAL`, `PEOPLE` |
| `autonomy_level` | `A1`, `A2`, `A3` |
| `task_priority` | `URGENT`, `HIGH`, `NORMAL`, `LOW` |
| `escalation_type` | `AWARENESS`, `ACTION_REQUIRED` |
| `message_priority` | `SYNC`, `ASYNC` |
| `message_type` | `DIRECTIVE`, `REPORT`, `ESCALATION`, `COORDINATION`, `DELEGATION` |
| `memory_entry_type` | `DECISION`, `ACTION`, `ESCALATION`, `COMMUNICATION`, `PULSE`, `AUDIT`, `KNOWLEDGE` |
| `memory_importance` | `HIGH`, `MEDIUM`, `LOW` |
| `chat_message_role` | `USER`, `AGENT` |

### Execution

| Enum | Values |
|------|--------|
| `pulse_phase` | `SCAN`, `ASSESS`, `DECIDE`, `EXECUTE`, `LOG`, `COMPLETE` |
| `pulse_decision_outcome` | `QUEUED`, `PROPOSED`, `ESCALATED` |
| `pulse_action_type` | `TASK_PROGRESS`, `COMMUNICATION`, `STATUS_UPDATE`, `ESCALATION`, `DELEGATION`, `DOCUMENTATION` |
| `escalation_trigger` | `TASK_BLOCKED`, `SCOPE_UNCLEAR`, `CONFLICTING_INSTRUCTIONS`, `RESOURCE_CONSTRAINT`, `CROSS_TEAM_DEPENDENCY`, `SCOPE_EXCEEDED`, `CROSS_DOMAIN_CONFLICT`, `IRREVERSIBLE_DECISION`, `BUDGET_REQUEST`, `EXTERNAL_COMMITMENT`, `MISSION_DRIFT`, `MATERIAL_RISK`, `TIMELINE_RISK`, `PERFORMANCE_ISSUE`, `MILESTONE`, `OPPORTUNITY`, `TASK_COMPLETE`, `ANOMALY`, `QUALITY_ISSUE`, `WORKSTREAM_COMPLETE` |

---

## Table Schemas

### 1. `companies`

Root object. One per user account. Every other table links back here via `company_id`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `name` | `TEXT` | — | Required |
| `status` | `company_status` | `'ONBOARDING'` | |
| `created_at` | `TIMESTAMPTZ` | `now()` | |
| `mission` | `TEXT` | `NULL` | Set during onboarding |
| `vision` | `TEXT` | `NULL` | Set during onboarding |
| `values` | `TEXT[]` | `'{}'` | |
| `strategic_priorities` | `TEXT[]` | `'{}'` | |
| `pulse_interval_minutes` | `INTEGER` | `15` | |
| `default_autonomy` | `autonomy_level` | `'A2'` | |
| `spending_authority_usd` | `NUMERIC(12,2)` | `0` | |
| `owner_user_id` | `UUID` | — | FK → `auth.users(id)` · Required |
| `ceo_id` | `UUID` | `NULL` | FK → `agents(id)` · Set after agent creation |

**RLS:** Filtered by `owner_user_id = auth.uid()`. Full CRUD.

---

### 2. `sectors`

Six fixed cockpit divisions per company. Unique constraint on `(company_id, type)`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `type` | `sector_type` | — | Required |
| `health` | `health_status` | `'GREEN'` | |
| `data` | `JSONB` | `'{}'` | Polymorphic sector data |

**Unique:** `(company_id, type)` — one sector per type per company.
**RLS:** Scoped to company owner. Full CRUD.

---

### 3. `departments`

Business units within the Organization sector. Unique on `(company_id, type)`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `type` | `department_type` | — | Required |
| `health` | `health_status` | `'GREEN'` | |
| `key_metric` | `JSONB` | `'{}'` | |
| `chief_id` | `UUID` | `NULL` | FK → `agents(id)` SET NULL |
| `memory` | `JSONB` | `'{}'` | |

**Unique:** `(company_id, type)` — one department per type per company.
**RLS:** Scoped to company owner. Full CRUD.

---

### 4. `agents`

AI personas at all tiers (1–5). Self-referencing via `reports_to`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `name` | `TEXT` | — | Required |
| `role` | `TEXT` | — | Required |
| `tier` | `SMALLINT` | — | Required · CHECK 1–5 |
| `human` | `BOOLEAN` | `false` | |
| `department_id` | `UUID` | `NULL` | FK → `departments(id)` SET NULL |
| `reports_to` | `UUID` | `NULL` | FK → `agents(id)` SET NULL · Self-ref |
| `autonomy_level` | `autonomy_level` | `'A2'` | |
| `mandate` | `TEXT` | `NULL` | |
| `status` | `agent_status` | `'ACTIVE'` | |
| `last_pulse` | `TIMESTAMPTZ` | `NULL` | |
| `created_at` | `TIMESTAMPTZ` | `now()` | |

**RLS:** Scoped to company owner. Full CRUD.

---

### 5. `tasks`

Work units assigned to agents. Supports hierarchy via `parent_task_id`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `assignee_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `assigned_by` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `department_id` | `UUID` | `NULL` | FK → `departments(id)` SET NULL |
| `project_id` | `UUID` | `NULL` | Future FK |
| `title` | `TEXT` | — | Required |
| `description` | `TEXT` | `NULL` | |
| `parameters` | `JSONB` | `'{}'` | |
| `status` | `task_status` | `'PENDING'` | |
| `priority` | `task_priority` | `'NORMAL'` | |
| `created_at` | `TIMESTAMPTZ` | `now()` | |
| `started_at` | `TIMESTAMPTZ` | `NULL` | |
| `completed_at` | `TIMESTAMPTZ` | `NULL` | |
| `blocked_reason` | `TEXT` | `NULL` | |
| `parent_task_id` | `UUID` | `NULL` | FK → `tasks(id)` SET NULL · Self-ref |

**RLS:** Scoped to company owner. Full CRUD.

---

### 6. `escalations`

Issues requiring higher authority. Links `from_agent` → `to_agent`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `from_agent_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `to_agent_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `type` | `escalation_type` | — | Required |
| `trigger` | `escalation_trigger` | — | Required |
| `context` | `TEXT` | — | Required |
| `impact` | `TEXT` | — | Required |
| `recommendation` | `TEXT` | — | Required |
| `status` | `escalation_status` | `'PENDING'` | |
| `created_at` | `TIMESTAMPTZ` | `now()` | |
| `acknowledged_at` | `TIMESTAMPTZ` | `NULL` | |
| `resolved_at` | `TIMESTAMPTZ` | `NULL` | |
| `resolution` | `TEXT` | `NULL` | |
| `related_task_id` | `UUID` | `NULL` | FK → `tasks(id)` SET NULL |
| `related_project_id` | `UUID` | `NULL` | Future FK |

**RLS:** Scoped to company owner. Full CRUD.

---

### 7. `pulses`

Agent execution cycles (SCAN → ASSESS → DECIDE → EXECUTE → LOG → COMPLETE).

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `agent_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `started_at` | `TIMESTAMPTZ` | `now()` | |
| `completed_at` | `TIMESTAMPTZ` | `NULL` | |
| `phase` | `pulse_phase` | `'SCAN'` | |
| `scanned_state` | `JSONB` | `'{}'` | |
| `decisions` | `JSONB` | `'[]'` | |
| `actions` | `JSONB` | `'[]'` | |
| `status` | `pulse_status` | `'RUNNING'` | |
| `error` | `TEXT` | `NULL` | |

**RLS:** Scoped to company owner. Full CRUD.

---

### 8. `messages`

Inter-agent communication. Always `from_agent` → `to_agent`.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `from_agent_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `to_agent_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `subject` | `TEXT` | — | Required |
| `body` | `TEXT` | — | Required |
| `priority` | `message_priority` | `'ASYNC'` | |
| `type` | `message_type` | — | Required |
| `sent_at` | `TIMESTAMPTZ` | `now()` | |
| `read_at` | `TIMESTAMPTZ` | `NULL` | |
| `processed_at` | `TIMESTAMPTZ` | `NULL` | |

**RLS:** Scoped to company owner. Full CRUD.

---

### 9. `memory_entries`

Persistent organizational knowledge. **Append-only** — no UPDATE or DELETE at RLS level (INV-MEM-001).

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `type` | `memory_entry_type` | — | Required |
| `summary` | `TEXT` | — | Required |
| `details` | `JSONB` | `'{}'` | |
| `agent_id` | `UUID` | `NULL` | FK → `agents(id)` SET NULL |
| `department_id` | `UUID` | `NULL` | FK → `departments(id)` SET NULL |
| `related_ids` | `UUID[]` | `'{}'` | |
| `created_at` | `TIMESTAMPTZ` | `now()` | |
| `importance` | `memory_importance` | `'MEDIUM'` | |
| `tags` | `TEXT[]` | `'{}'` | |

**RLS:** SELECT + INSERT only. **No UPDATE. No DELETE.** Append-only by design.

---

### 10. `chat_sessions`

User ↔ Agent conversations.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `user_id` | `UUID` | — | FK → `auth.users(id)` · Required |
| `agent_id` | `UUID` | — | FK → `agents(id)` CASCADE · Required |
| `status` | `chat_session_status` | `'ACTIVE'` | |
| `created_at` | `TIMESTAMPTZ` | `now()` | |
| `closed_at` | `TIMESTAMPTZ` | `NULL` | |

**RLS:** Scoped to company owner. SELECT + INSERT + UPDATE (no DELETE).

---

### 11. `chat_messages`

Individual messages in a chat session. **Immutable** — no UPDATE or DELETE at RLS level.

| Column | Type | Default | Notes |
|--------|------|---------|-------|
| `id` | `UUID` | `gen_random_uuid()` | PK |
| `session_id` | `UUID` | — | FK → `chat_sessions(id)` CASCADE · Required |
| `company_id` | `UUID` | — | FK → `companies(id)` CASCADE · Required |
| `role` | `chat_message_role` | — | Required |
| `content` | `TEXT` | — | Required |
| `sent_at` | `TIMESTAMPTZ` | `now()` | |
| `tokens_used` | `INTEGER` | `NULL` | |

**RLS:** SELECT + INSERT only. **No UPDATE. No DELETE.** Immutable by design.

---

## Relationship Map

```
auth.users
  └── companies (owner_user_id)
        ├── sectors (company_id)
        ├── departments (company_id)
        │     └── agents.department_id
        ├── agents (company_id)
        │     ├── companies.ceo_id ←
        │     ├── departments.chief_id ←
        │     ├── agents.reports_to (self-ref)
        │     ├── tasks (assignee_id, assigned_by)
        │     ├── escalations (from_agent_id, to_agent_id)
        │     ├── pulses (agent_id)
        │     ├── messages (from_agent_id, to_agent_id)
        │     ├── memory_entries (agent_id)
        │     └── chat_sessions (agent_id)
        ├── tasks (company_id)
        │     ├── tasks.parent_task_id (self-ref)
        │     └── escalations.related_task_id
        ├── escalations (company_id)
        ├── pulses (company_id)
        ├── messages (company_id)
        ├── memory_entries (company_id)
        ├── chat_sessions (company_id)
        │     └── chat_messages (session_id)
        └── chat_messages (company_id)
```

---

## RLS Summary

All tables have RLS enabled. Every query is scoped to `company_id` via the owning user's `auth.uid()`.

| Table | SELECT | INSERT | UPDATE | DELETE | Notes |
|-------|--------|--------|--------|--------|-------|
| `companies` | ✅ | ✅ | ✅ | ✅ | Direct `owner_user_id` check |
| `sectors` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `departments` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `agents` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `tasks` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `escalations` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `pulses` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `messages` | ✅ | ✅ | ✅ | ✅ | Via company owner |
| `memory_entries` | ✅ | ✅ | ❌ | ❌ | **Append-only** (INV-MEM-001) |
| `chat_sessions` | ✅ | ✅ | ✅ | ❌ | No delete |
| `chat_messages` | ✅ | ✅ | ❌ | ❌ | **Immutable** |

---

## Index Coverage

42 indexes total. Key patterns:

- **Every table** has `idx_[table]_company` on `company_id`
- **Status columns** indexed as `(company_id, status)` for filtered queries
- **Timestamps** indexed as `(company_id, created_at)` or `(company_id, sent_at)` for time-range queries
- **Foreign keys** indexed individually for JOIN performance
- **Chat messages** indexed on `(session_id, sent_at)` for ordered message retrieval

---

## TypeScript Types

Auto-generated types available at: `docs/database.types.ts`

Import pattern:
```typescript
import { Database, Tables, TablesInsert, TablesUpdate, Enums } from './database.types';

// Row type
type Agent = Tables<'agents'>;

// Insert type (only required fields mandatory)
type NewTask = TablesInsert<'tasks'>;

// Update type (all fields optional)
type TaskUpdate = TablesUpdate<'tasks'>;

// Enum type
type TaskStatus = Enums<'task_status'>;
```

---

## Design Invariants

1. **INV-MEM-001** — Memory entries are append-only. No updates. No deletes.
2. **Chat messages are immutable.** Once sent, never modified or deleted.
3. **All queries filter by `company_id`** — enforced at RLS level, not application level.
4. **`companies.ceo_id` and `departments.chief_id`** are deferred FKs — set after agent creation during onboarding.
5. **Sectors and departments use unique constraints** on `(company_id, type)` — exactly one of each type per company.
6. **Agents use a self-referencing `reports_to`** — hierarchy is NOT enforced by DB; tier logic lives in application layer.

### Immutability Enforcement (Migration 002)

Immutability on `memory_entries` and `chat_messages` is enforced at **two layers**:

| Layer | Mechanism | Protects Against |
|-------|-----------|------------------|
| **RLS policies** | No UPDATE/DELETE policies defined | Authenticated client mutations via Supabase JS SDK |
| **Postgres triggers** | `BEFORE UPDATE/DELETE → RAISE EXCEPTION` | **Everything** — including `service_role` key, direct connections, Edge Functions, cron jobs, and migration scripts |

The trigger function `prevent_mutation()` fires before any UPDATE or DELETE on these tables and raises a hard exception with the table name and operation. This makes immutability **service-role safe** — no client, role, or connection method can mutate these rows.

**Triggers:**

| Trigger | Table | Blocks |
|---------|-------|--------|
| `trg_memory_entries_no_update` | `memory_entries` | UPDATE |
| `trg_memory_entries_no_delete` | `memory_entries` | DELETE |
| `trg_chat_messages_no_update` | `chat_messages` | UPDATE |
| `trg_chat_messages_no_delete` | `chat_messages` | DELETE |

> **Note:** If a legitimate need arises to correct a memory entry or chat message, the pattern is to INSERT a new corrective record (e.g., a superseding memory entry) rather than mutating the original. To bypass triggers in an emergency, a superadmin would need to `ALTER TABLE ... DISABLE TRIGGER` explicitly — which is auditable and intentional.

---

*Generated from migration `001_mc_runtime_schema.sql` by Kori Willis*
