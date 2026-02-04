-- ============================================================
-- Mission Control Runtime Schema — Migration 001
-- Source: MC-RUNTIME-SPEC-v1 §2 (Core Runtime Objects)
-- Author: Kori Willis — 2026-02-04
-- Linear: BSL-302 (K-1 — Database Schema & RLS)
--
-- EXCEPTION (CS-15): This migration exceeds the 500-line hard limit.
-- Reason: DDL migration scripts are atomic database transactions, not
-- application source modules. Splitting would change execution semantics
-- (partial schema states between migrations) and violate Postgres
-- transactional DDL guarantees. conventions.md §7 scopes CS-14/CS-15
-- to source files, services, and modules — not SQL migrations.
-- See conventions.md §3.2 for database-specific conventions.
-- ============================================================

-- ============================================================
-- SECTION 1: ENUM TYPES
-- ============================================================

-- Company status
CREATE TYPE company_status AS ENUM ('ONBOARDING', 'ACTIVE', 'SUSPENDED');

-- Autonomy levels
CREATE TYPE autonomy_level AS ENUM ('A1', 'A2', 'A3');

-- Sector types (fixed set of 6)
CREATE TYPE sector_type AS ENUM (
  'COMMAND', 'ORGANIZATION', 'OPERATIONS',
  'FINANCE', 'INTELLIGENCE', 'METRICS'
);

-- Health signals
CREATE TYPE health_status AS ENUM ('GREEN', 'YELLOW', 'RED');

-- Department types (fixed set)
CREATE TYPE department_type AS ENUM (
  'FINANCE', 'OPERATIONS', 'PRODUCT', 'TECHNOLOGY',
  'MARKETING', 'SALES', 'LEGAL', 'EXTERNAL', 'PEOPLE'
);

-- Agent status
CREATE TYPE agent_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- Task status
CREATE TYPE task_status AS ENUM ('PENDING', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE', 'CANCELLED');

-- Task priority
CREATE TYPE task_priority AS ENUM ('URGENT', 'HIGH', 'NORMAL', 'LOW');

-- Escalation type
CREATE TYPE escalation_type AS ENUM ('AWARENESS', 'ACTION_REQUIRED');

-- Escalation trigger
CREATE TYPE escalation_trigger AS ENUM (
  'TASK_BLOCKED', 'SCOPE_UNCLEAR', 'CONFLICTING_INSTRUCTIONS',
  'RESOURCE_CONSTRAINT', 'CROSS_TEAM_DEPENDENCY', 'SCOPE_EXCEEDED',
  'CROSS_DOMAIN_CONFLICT', 'IRREVERSIBLE_DECISION', 'BUDGET_REQUEST',
  'EXTERNAL_COMMITMENT', 'MISSION_DRIFT', 'MATERIAL_RISK',
  'TIMELINE_RISK', 'PERFORMANCE_ISSUE', 'MILESTONE', 'OPPORTUNITY',
  'TASK_COMPLETE', 'ANOMALY', 'QUALITY_ISSUE', 'WORKSTREAM_COMPLETE'
);

-- Escalation status
CREATE TYPE escalation_status AS ENUM ('PENDING', 'ACKNOWLEDGED', 'RESOLVED');

-- Pulse phase
CREATE TYPE pulse_phase AS ENUM ('SCAN', 'ASSESS', 'DECIDE', 'EXECUTE', 'LOG', 'COMPLETE');

-- Pulse status
CREATE TYPE pulse_status AS ENUM ('RUNNING', 'COMPLETE', 'FAILED');

-- Pulse decision outcome
CREATE TYPE pulse_decision_outcome AS ENUM ('QUEUED', 'PROPOSED', 'ESCALATED');

-- Pulse action type
CREATE TYPE pulse_action_type AS ENUM (
  'TASK_PROGRESS', 'COMMUNICATION', 'STATUS_UPDATE',
  'ESCALATION', 'DELEGATION', 'DOCUMENTATION'
);

-- Message priority
CREATE TYPE message_priority AS ENUM ('SYNC', 'ASYNC');

-- Message type
CREATE TYPE message_type AS ENUM (
  'DIRECTIVE', 'REPORT', 'ESCALATION', 'COORDINATION', 'DELEGATION'
);

-- Memory entry type
CREATE TYPE memory_entry_type AS ENUM (
  'DECISION', 'ACTION', 'ESCALATION', 'COMMUNICATION',
  'PULSE', 'AUDIT', 'KNOWLEDGE'
);

-- Memory importance
CREATE TYPE memory_importance AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- Chat session status
CREATE TYPE chat_session_status AS ENUM ('ACTIVE', 'CLOSED');

-- Chat message role
CREATE TYPE chat_message_role AS ENUM ('USER', 'AGENT');

-- ============================================================
-- SECTION 2: TABLES
-- ============================================================

-- -----------------------------------------------------------
-- 2.1 Company (Root object — one per user account)
-- -----------------------------------------------------------
CREATE TABLE companies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  status      company_status NOT NULL DEFAULT 'ONBOARDING',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Populated during onboarding
  mission               TEXT,
  vision                TEXT,
  "values"              TEXT[] DEFAULT '{}',
  strategic_priorities   TEXT[] DEFAULT '{}',

  -- Configuration
  pulse_interval_minutes INTEGER NOT NULL DEFAULT 15,
  default_autonomy       autonomy_level NOT NULL DEFAULT 'A2',
  spending_authority_usd NUMERIC(12,2) NOT NULL DEFAULT 0,

  -- Owner (Supabase Auth user)
  owner_user_id UUID NOT NULL REFERENCES auth.users(id),

  -- CEO agent reference (set after agent creation)
  ceo_id UUID  -- FK added after agents table exists
);

-- -----------------------------------------------------------
-- 2.2 Sector (6 fixed cockpit divisions per company)
-- -----------------------------------------------------------
CREATE TABLE sectors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type        sector_type NOT NULL,
  health      health_status NOT NULL DEFAULT 'GREEN',

  -- Polymorphic sector data stored as JSONB
  data        JSONB NOT NULL DEFAULT '{}',

  -- Constraints
  UNIQUE (company_id, type)
);

-- -----------------------------------------------------------
-- 2.3 Department (Business units within Organization)
-- -----------------------------------------------------------
CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type        department_type NOT NULL,
  health      health_status NOT NULL DEFAULT 'GREEN',
  key_metric  JSONB DEFAULT '{}',

  -- Leadership (FK added after agents table)
  chief_id    UUID,

  -- Memory
  memory      JSONB DEFAULT '{}',

  -- Constraints
  UNIQUE (company_id, type)
);

-- -----------------------------------------------------------
-- 2.4 Agent (AI personas at all tiers)
-- -----------------------------------------------------------
CREATE TABLE agents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Identity
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  tier        SMALLINT NOT NULL CHECK (tier BETWEEN 1 AND 5),
  human       BOOLEAN NOT NULL DEFAULT false,

  -- Placement
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  reports_to    UUID REFERENCES agents(id) ON DELETE SET NULL,

  -- Behavior
  autonomy_level autonomy_level NOT NULL DEFAULT 'A2',
  mandate        TEXT,

  -- State
  status      agent_status NOT NULL DEFAULT 'ACTIVE',

  -- Performance
  last_pulse  TIMESTAMPTZ,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Now add deferred FKs
ALTER TABLE companies
  ADD CONSTRAINT fk_companies_ceo
  FOREIGN KEY (ceo_id) REFERENCES agents(id) ON DELETE SET NULL;

ALTER TABLE departments
  ADD CONSTRAINT fk_departments_chief
  FOREIGN KEY (chief_id) REFERENCES agents(id) ON DELETE SET NULL;

-- -----------------------------------------------------------
-- 2.5 Task (Units of work assigned to agents)
-- -----------------------------------------------------------
CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Assignment
  assignee_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  assigned_by     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  department_id   UUID REFERENCES departments(id) ON DELETE SET NULL,
  project_id      UUID,  -- Future: FK to projects table

  -- Definition
  title           TEXT NOT NULL,
  description     TEXT,
  parameters      JSONB DEFAULT '{}',

  -- State
  status          task_status NOT NULL DEFAULT 'PENDING',
  priority        task_priority NOT NULL DEFAULT 'NORMAL',

  -- Tracking
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  blocked_reason  TEXT,

  -- Hierarchy
  parent_task_id  UUID REFERENCES tasks(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------
-- 2.6 Escalation (Issues requiring higher authority)
-- -----------------------------------------------------------
CREATE TABLE escalations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Parties
  from_agent_id   UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  to_agent_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,

  -- Classification
  type            escalation_type NOT NULL,
  trigger         escalation_trigger NOT NULL,

  -- Content
  context         TEXT NOT NULL,
  impact          TEXT NOT NULL,
  recommendation  TEXT NOT NULL,

  -- State
  status          escalation_status NOT NULL DEFAULT 'PENDING',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  resolution      TEXT,

  -- Relations
  related_task_id    UUID REFERENCES tasks(id) ON DELETE SET NULL,
  related_project_id UUID  -- Future: FK to projects table
);

-- -----------------------------------------------------------
-- 2.7 Pulse (Agent execution cycles)
-- -----------------------------------------------------------
CREATE TABLE pulses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  agent_id        UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,

  -- Timing
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ,

  -- Execution
  phase           pulse_phase NOT NULL DEFAULT 'SCAN',
  scanned_state   JSONB DEFAULT '{}',
  decisions       JSONB DEFAULT '[]',
  actions         JSONB DEFAULT '[]',

  -- Outcome
  status          pulse_status NOT NULL DEFAULT 'RUNNING',
  error           TEXT
);

-- -----------------------------------------------------------
-- 2.8 Message (Inter-agent communication)
-- -----------------------------------------------------------
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Parties
  from_agent_id   UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  to_agent_id     UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,

  -- Content
  subject         TEXT NOT NULL,
  body            TEXT NOT NULL,

  -- Classification
  priority        message_priority NOT NULL DEFAULT 'ASYNC',
  type            message_type NOT NULL,

  -- State
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at         TIMESTAMPTZ,
  processed_at    TIMESTAMPTZ
);

-- -----------------------------------------------------------
-- 2.9 Memory Entry (Persistent organizational knowledge)
-- -----------------------------------------------------------
CREATE TABLE memory_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Classification
  type            memory_entry_type NOT NULL,

  -- Content
  summary         TEXT NOT NULL,
  details         JSONB DEFAULT '{}',

  -- Context
  agent_id        UUID REFERENCES agents(id) ON DELETE SET NULL,
  department_id   UUID REFERENCES departments(id) ON DELETE SET NULL,
  related_ids     UUID[] DEFAULT '{}',

  -- Metadata
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  importance      memory_importance NOT NULL DEFAULT 'MEDIUM',
  tags            TEXT[] DEFAULT '{}'
);

-- -----------------------------------------------------------
-- 2.10 Chat Session (AI agent conversations — from §8.3.2)
-- -----------------------------------------------------------
CREATE TABLE chat_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Participants
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  agent_id    UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,

  -- State
  status      chat_session_status NOT NULL DEFAULT 'ACTIVE',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at   TIMESTAMPTZ
);

-- -----------------------------------------------------------
-- 2.11 Chat Message (Messages within chat sessions)
-- -----------------------------------------------------------
CREATE TABLE chat_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Content
  role        chat_message_role NOT NULL,
  content     TEXT NOT NULL,

  -- Metadata
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  tokens_used INTEGER
);

-- ============================================================
-- SECTION 3: INDEXES
-- ============================================================

-- Company
CREATE INDEX idx_companies_owner ON companies(owner_user_id);
CREATE INDEX idx_companies_status ON companies(status);

-- Sector
CREATE INDEX idx_sectors_company ON sectors(company_id);

-- Department
CREATE INDEX idx_departments_company ON departments(company_id);
CREATE INDEX idx_departments_chief ON departments(chief_id);

-- Agent
CREATE INDEX idx_agents_company ON agents(company_id);
CREATE INDEX idx_agents_department ON agents(department_id);
CREATE INDEX idx_agents_reports_to ON agents(reports_to);
CREATE INDEX idx_agents_status ON agents(company_id, status);
CREATE INDEX idx_agents_tier ON agents(company_id, tier);

-- Task
CREATE INDEX idx_tasks_company ON tasks(company_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(company_id, status);
CREATE INDEX idx_tasks_created ON tasks(company_id, created_at);
CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);

-- Escalation
CREATE INDEX idx_escalations_company ON escalations(company_id);
CREATE INDEX idx_escalations_from ON escalations(from_agent_id);
CREATE INDEX idx_escalations_to ON escalations(to_agent_id);
CREATE INDEX idx_escalations_status ON escalations(company_id, status);
CREATE INDEX idx_escalations_created ON escalations(company_id, created_at);

-- Pulse
CREATE INDEX idx_pulses_company ON pulses(company_id);
CREATE INDEX idx_pulses_agent ON pulses(agent_id);
CREATE INDEX idx_pulses_status ON pulses(company_id, status);
CREATE INDEX idx_pulses_started ON pulses(company_id, started_at);

-- Message
CREATE INDEX idx_messages_company ON messages(company_id);
CREATE INDEX idx_messages_from ON messages(from_agent_id);
CREATE INDEX idx_messages_to ON messages(to_agent_id);
CREATE INDEX idx_messages_sent ON messages(company_id, sent_at);

-- Memory Entry
CREATE INDEX idx_memory_company ON memory_entries(company_id);
CREATE INDEX idx_memory_agent ON memory_entries(agent_id);
CREATE INDEX idx_memory_type ON memory_entries(company_id, type);
CREATE INDEX idx_memory_created ON memory_entries(company_id, created_at);
CREATE INDEX idx_memory_importance ON memory_entries(company_id, importance);
CREATE INDEX idx_memory_department ON memory_entries(department_id);

-- Chat Session
CREATE INDEX idx_chat_sessions_company ON chat_sessions(company_id);
CREATE INDEX idx_chat_sessions_agent ON chat_sessions(agent_id);
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_status ON chat_sessions(company_id, status);

-- Chat Message
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_company ON chat_messages(company_id);
CREATE INDEX idx_chat_messages_sent ON chat_messages(session_id, sent_at);

-- ============================================================
-- SECTION 4: ROW-LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ----- COMPANIES -----
CREATE POLICY "companies_select_own"
  ON companies FOR SELECT
  USING (owner_user_id = auth.uid());

CREATE POLICY "companies_insert_own"
  ON companies FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "companies_update_own"
  ON companies FOR UPDATE
  USING (owner_user_id = auth.uid());

CREATE POLICY "companies_delete_own"
  ON companies FOR DELETE
  USING (owner_user_id = auth.uid());

-- ----- SECTORS -----
CREATE POLICY "sectors_select"
  ON sectors FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "sectors_insert"
  ON sectors FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "sectors_update"
  ON sectors FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "sectors_delete"
  ON sectors FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- DEPARTMENTS -----
CREATE POLICY "departments_select"
  ON departments FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "departments_insert"
  ON departments FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "departments_update"
  ON departments FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "departments_delete"
  ON departments FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- AGENTS -----
CREATE POLICY "agents_select"
  ON agents FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "agents_insert"
  ON agents FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "agents_update"
  ON agents FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "agents_delete"
  ON agents FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- TASKS -----
CREATE POLICY "tasks_select"
  ON tasks FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "tasks_insert"
  ON tasks FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "tasks_update"
  ON tasks FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "tasks_delete"
  ON tasks FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- ESCALATIONS -----
CREATE POLICY "escalations_select"
  ON escalations FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "escalations_insert"
  ON escalations FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "escalations_update"
  ON escalations FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "escalations_delete"
  ON escalations FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- PULSES -----
CREATE POLICY "pulses_select"
  ON pulses FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "pulses_insert"
  ON pulses FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "pulses_update"
  ON pulses FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "pulses_delete"
  ON pulses FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- MESSAGES -----
CREATE POLICY "messages_select"
  ON messages FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "messages_insert"
  ON messages FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "messages_update"
  ON messages FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "messages_delete"
  ON messages FOR DELETE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- MEMORY ENTRIES (append-only per INV-MEM-001) -----
CREATE POLICY "memory_entries_select"
  ON memory_entries FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "memory_entries_insert"
  ON memory_entries FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- No UPDATE or DELETE policies = append-only enforcement at RLS level

-- ----- CHAT SESSIONS -----
CREATE POLICY "chat_sessions_select"
  ON chat_sessions FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "chat_sessions_insert"
  ON chat_sessions FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "chat_sessions_update"
  ON chat_sessions FOR UPDATE
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- ----- CHAT MESSAGES (immutable once sent) -----
CREATE POLICY "chat_messages_select"
  ON chat_messages FOR SELECT
  USING (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

CREATE POLICY "chat_messages_insert"
  ON chat_messages FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_user_id = auth.uid()));

-- No UPDATE or DELETE policies = immutable enforcement at RLS level

-- ============================================================
-- END OF MIGRATION 001
-- ============================================================
