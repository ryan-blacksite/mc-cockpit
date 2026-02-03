# Mission Control Runtime Spec v1

**Status:** LOCKED  
**Owner:** Fred Smart (Lead Developer)  
**Created:** 2026-02-02  
**Linear Issue:** BSL-289  

---

## Purpose

Execution-grade specification for Mission Control's runtime behavior. Claude Code should be able to generate a running Mission Control shell directly from this document.

**This is NOT a vision document.** No prose. No philosophy. Just deterministic rules.

**Dependencies:**
- `VISION.md` (LOCKED) — cockpit structure, zoom model, sector definitions
- `AI-WORKFORCE-ARCHITECTURE-v1.md` (LOCKED) — agent hierarchy, autonomy, escalation, Pulse
- `BOARD-GOVERNANCE-SPEC-v1.md` (ACTIVE) — Board behavior, onboarding, advisory triggers

---

## 1. App Startup Flow

### 1.1 Entry Points

Mission Control has two startup paths:

| Path | Trigger | Flow |
|------|---------|------|
| **New Company** | No `Company` record exists for user | → Onboarding Flow |
| **Existing Company** | `Company` record exists | → Cockpit Load Flow |

### 1.2 New Company: Onboarding Flow

```
1. CREATE Company record (status: ONBOARDING)
2. CREATE CEO Agent (tier: 1, human: true)
3. CREATE Board Agents (per BOARD-GOVERNANCE-SPEC)
4. CREATE Executive Assistant Agent (Taylor Monroe)
5. INITIATE Board Onboarding Session
   └─ Follow BOARD-GOVERNANCE-SPEC § Onboarding Session Flow
6. ON session complete:
   └─ WRITE session outputs to Command sector:
       - mission
       - vision  
       - values[]
       - strategic_priorities[]
   └─ SET Company.status = ACTIVE
   └─ CREATE C-Suite Agents (default roster)
   └─ CREATE default Managers, Leads, Workers (per AI-WORKFORCE-ARCHITECTURE)
7. LOAD Cockpit (God View)
8. START Pulse scheduler
```

### 1.3 Existing Company: Cockpit Load Flow

```
1. LOAD Company record
2. VERIFY Company.status = ACTIVE
   └─ If ONBOARDING: resume onboarding session
   └─ If SUSPENDED: show suspension notice, block access
3. LOAD all Sectors (parallel):
   - Command
   - Organization
   - Operations
   - Finance
   - Intelligence
   - Metrics
4. LOAD Agent roster
5. LOAD pending Escalations
6. LOAD active Tasks
7. RENDER Cockpit (God View)
8. VERIFY Pulse scheduler running
   └─ If not: START Pulse scheduler
```

### 1.4 Startup Invariants

| Invariant | Enforcement |
|-----------|-------------|
| Company must have exactly 1 CEO | Block company creation if violated |
| CEO must be human (tier 1) | Reject agent creation if CEO.human = false |
| Company must have Command sector populated before ACTIVE | Block status transition if empty |
| Pulse scheduler must be running for ACTIVE companies | Auto-start on load |

---

## 2. Core Runtime Objects

### 2.1 Company

The root object. One per user account.

```typescript
Company {
  id: UUID
  name: string
  status: ONBOARDING | ACTIVE | SUSPENDED
  created_at: datetime
  
  // Populated during onboarding
  mission: string | null
  vision: string | null
  values: string[]
  strategic_priorities: string[]
  
  // Finance
  pulse_interval_minutes: number = 15
  default_autonomy: A1 | A2 | A3 = A2
  spending_authority_usd: number = 0
  
  // Relations
  ceo_id: Agent.id
  sectors: Sector[]
  agents: Agent[]
}
```

### 2.2 Sector

Top-level cockpit divisions. Fixed set of 6.

```typescript
Sector {
  id: UUID
  company_id: Company.id
  type: COMMAND | ORGANIZATION | OPERATIONS | FINANCE | INTELLIGENCE | METRICS
  
  // Health signals
  health: GREEN | YELLOW | RED
  attention_flags: AttentionFlag[]
  
  // Type-specific data (polymorphic)
  data: CommandData | OperationsData | OrganizationData | MetricsData | IntelligenceData | FinanceData
}

// Sector-specific data structures
CommandData {
  mission: string
  vision: string
  values: string[]
  strategic_priorities: string[]
  pending_decisions: Decision[]
  global_overrides: Override[]
}

OperationsData {
  board_members: Agent[]
  active_sessions: BoardSession[]
  advisory_history: Advisory[]
}

**Board storage vs surfacing:** Board advisory records are stored under Operations as oversight/governance records. Board advisories are surfaced via Command (Board Advisory panel) and Intelligence (Advisory feed). This does not create a 7th sector and does not make Operations the Board sector.

OrganizationData {
  departments: Department[]
  aggregate_health: GREEN | YELLOW | RED
  total_headcount: number
  active_blockers: number
}

MetricsData {
  company_goals: Goal[]
  health_signals: HealthSignal[]
  risk_levels: RiskAssessment[]
  attention_items: AttentionItem[]
}

IntelligenceData {
  decisions: Decision[]
  audit_logs: AuditEntry[]
  knowledge_base: Document[]
}

FinanceData {
  pulse_interval: number
  autonomy_defaults: AutonomyConfig
  spending_limits: SpendingConfig
  notification_preferences: NotificationConfig
  integrations: Integration[]
}
```

### 2.3 Department

Business units within The Organization.

```typescript
Department {
  id: UUID
  company_id: Company.id
  type: FINANCE | OPERATIONS | PRODUCT | TECHNOLOGY | MARKETING | SALES | LEGAL | EXTERNAL | PEOPLE
  
  // Leadership
  chief_id: Agent.id | null
  
  // Health
  health: GREEN | YELLOW | RED
  key_metric: MetricValue
  active_blockers: Escalation[]
  
  // Contents
  managers: Agent[]
  leads: Agent[]
  workers: Agent[]
  projects: Project[]
  tools: Tool[]
  memory: DepartmentMemory
}
```

### 2.4 Agent

AI personas at all tiers.

```typescript
Agent {
  id: UUID
  company_id: Company.id
  
  // Identity
  name: string
  role: string
  tier: 1 | 2 | 3 | 4 | 5
  human: boolean = false  // Only true for CEO
  
  // Placement
  department_id: Department.id | null  // null for CEO, Board, Exec Support
  reports_to: Agent.id | null  // null for CEO
  
  // Behavior
  autonomy_level: A1 | A2 | A3
  mandate: string
  
  // State
  status: ACTIVE | INACTIVE | SUSPENDED
  inbox: Message[]
  current_tasks: Task[]
  
  // Performance
  last_pulse: datetime | null
  performance_signals: PerformanceSignal[]
}
```

### 2.5 Task

Units of work assigned to agents.

```typescript
Task {
  id: UUID
  company_id: Company.id
  
  // Assignment
  assignee_id: Agent.id
  assigned_by: Agent.id
  department_id: Department.id | null
  project_id: Project.id | null
  
  // Definition
  title: string
  description: string
  parameters: TaskParameters
  
  // State
  status: PENDING | IN_PROGRESS | BLOCKED | COMPLETE | CANCELLED
  priority: URGENT | HIGH | NORMAL | LOW
  
  // Tracking
  created_at: datetime
  started_at: datetime | null
  completed_at: datetime | null
  blocked_reason: string | null
  
  // Relations
  parent_task_id: Task.id | null
  subtasks: Task[]
  blockers: Escalation[]
}
```

### 2.6 Escalation

Issues requiring higher authority.

```typescript
Escalation {
  id: UUID
  company_id: Company.id
  
  // Parties
  from_agent_id: Agent.id
  to_agent_id: Agent.id
  
  // Classification
  type: AWARENESS | ACTION_REQUIRED
  trigger: TASK_BLOCKED | SCOPE_UNCLEAR | CONFLICTING_INSTRUCTIONS | 
           RESOURCE_CONSTRAINT | CROSS_TEAM_DEPENDENCY | SCOPE_EXCEEDED |
           CROSS_DOMAIN_CONFLICT | IRREVERSIBLE_DECISION | BUDGET_REQUEST |
           EXTERNAL_COMMITMENT | MISSION_DRIFT | MATERIAL_RISK |
           TIMELINE_RISK | PERFORMANCE_ISSUE | MILESTONE | OPPORTUNITY |
           TASK_COMPLETE | ANOMALY | QUALITY_ISSUE | WORKSTREAM_COMPLETE
  
  // Content
  context: string
  impact: string
  recommendation: string
  
  // State
  status: PENDING | ACKNOWLEDGED | RESOLVED
  created_at: datetime
  acknowledged_at: datetime | null
  resolved_at: datetime | null
  resolution: string | null
  
  // Relations
  related_task_id: Task.id | null
  related_project_id: Project.id | null
}
```

### 2.7 Pulse

Agent execution cycles.

```typescript
Pulse {
  id: UUID
  company_id: Company.id
  agent_id: Agent.id
  
  // Timing
  started_at: datetime
  completed_at: datetime | null
  
  // Execution
  phase: SCAN | ASSESS | DECIDE | EXECUTE | LOG | COMPLETE
  scanned_state: StateSnapshot
  decisions: PulseDecision[]
  actions: PulseAction[]
  escalations_sent: Escalation[]
  
  // Outcome
  status: RUNNING | COMPLETE | FAILED
  error: string | null
}

PulseDecision {
  action_type: string
  autonomy_check: A1 | A2 | A3
  outcome: QUEUED | PROPOSED | ESCALATED
}

PulseAction {
  type: TASK_PROGRESS | COMMUNICATION | STATUS_UPDATE | ESCALATION | DELEGATION | DOCUMENTATION
  target_id: UUID
  details: object
  logged: boolean
}
```

### 2.8 Message

Inter-agent communication.

```typescript
Message {
  id: UUID
  company_id: Company.id
  
  // Parties
  from_agent_id: Agent.id
  to_agent_id: Agent.id
  
  // Content
  subject: string
  body: string
  
  // Classification
  priority: SYNC | ASYNC
  type: DIRECTIVE | REPORT | ESCALATION | COORDINATION | DELEGATION
  
  // State
  sent_at: datetime
  read_at: datetime | null
  processed_at: datetime | null
}
```

### 2.9 Memory Entry

Persistent organizational knowledge.

```typescript
MemoryEntry {
  id: UUID
  company_id: Company.id
  
  // Classification
  type: DECISION | ACTION | ESCALATION | COMMUNICATION | PULSE | AUDIT | KNOWLEDGE
  
  // Content
  summary: string
  details: object
  
  // Context
  agent_id: Agent.id | null
  department_id: Department.id | null
  related_ids: UUID[]
  
  // Metadata
  created_at: datetime
  importance: HIGH | MEDIUM | LOW
  tags: string[]
}
```

---

## 3. Source-of-Truth Rules

### 3.1 Data Ownership

| Data | Owner | Readers | Writers |
|------|-------|---------|---------|
| Company config | CEO | All agents | CEO only |
| Command sector | CEO | All agents | CEO only |
| Department state | Chief | Dept agents, CEO | Chief, CEO |
| Agent mandate | Reports-to | Agent, above | Reports-to, CEO |
| Task state | Assignee | Chain above | Assignee, chain above |
| Escalation | Creator | Target, chain above | Target (to resolve) |
| Memory | System | All agents | System only (append-only) |

### 3.2 State Mutation Rules

```
RULE: All state mutations MUST be logged to Memory
RULE: All state mutations MUST include actor_id
RULE: No agent may mutate state outside their authority
RULE: CEO may mutate any state
RULE: Memory is append-only (no edits, no deletes)
```

### 3.3 Read Patterns

| Agent Tier | Can Read |
|------------|----------|
| CEO | Everything |
| Board | Company-wide (read-only), no operational details |
| Chief | Own department + company-level signals |
| Manager | Own scope + department-level signals |
| Lead | Own workstream + team-level signals |
| Worker | Own tasks + immediate context |

### 3.4 Write Patterns

| Agent Tier | Can Write |
|------------|-----------|
| CEO | Everything |
| Board | No direct writes (advisory content is system-written) |
| Chief | Own department, escalations up |
| Manager | Own scope, escalations up, assignments down |
| Lead | Own workstream, escalations up, assignments down |
| Worker | Own task state, escalations up |

### 3.5 Conflict Resolution

```
RULE: Last-write-wins for non-critical fields
RULE: Escalation required for conflicting directives
RULE: CEO override supersedes all other writes
RULE: Concurrent Pulse conflicts → serialize by agent tier (higher first)
```

---

## 4. Invariants

These rules MUST hold at all times. Violations are system errors.

### 4.1 Authority Invariants

```
INV-AUTH-001: CEO.tier = 1 AND CEO.human = true
INV-AUTH-002: Board agents may never execute operational decisions
INV-AUTH-003: No agent may block CEO action
INV-AUTH-004: Escalation chain: Worker → Lead → Manager → Chief → CEO
INV-AUTH-005: Cross-domain actions require CEO approval
```

### 4.2 Spending Invariants

```
INV-SPEND-001: Default spending_authority = 0
INV-SPEND-002: Any real-world spend with authority = 0 → escalate to CEO
INV-SPEND-003: Spend > department_budget → escalate to CEO
INV-SPEND-004: No agent may commit external funds without explicit authority
```

### 4.3 Communication Invariants

```
INV-COMM-001: Workers may only message: own Lead, own Manager (if no Lead), peer Workers (same workstream)
INV-COMM-002: Leads may only message: own Manager, peer Leads (same team), own Workers
INV-COMM-003: Managers may only message: own Chief, peer Managers (same dept), own Leads
INV-COMM-004: Chiefs may only message: CEO, peer Chiefs, own Managers
INV-COMM-005: Board may only message: CEO (advisory only)
INV-COMM-006: All messages logged to Memory
```

### 4.4 Escalation Invariants

```
INV-ESC-001: Escalation type AWARENESS does not block work
INV-ESC-002: Escalation type ACTION_REQUIRED blocks affected work only
INV-ESC-003: Material Risk escalates direct to CEO (copy chain)
INV-ESC-004: Escalation must include: trigger, context, impact, recommendation
INV-ESC-005: Board never appears in escalation path
```

### 4.5 Pulse Invariants

```
INV-PULSE-001: Every ACTIVE operational agent executes Pulse on schedule (Board agents excluded)
INV-PULSE-002: Pulse phases execute in order: SCAN → ASSESS → DECIDE → EXECUTE → LOG
INV-PULSE-003: All Pulse actions logged to Memory
INV-PULSE-004: Failed Pulse does not block other agents
INV-PULSE-005: Pulse interval configurable, default = 15 minutes
```

### 4.6 Memory Invariants

```
INV-MEM-001: Memory is append-only
INV-MEM-002: All state mutations logged
INV-MEM-003: All escalations logged
INV-MEM-004: All communications logged
INV-MEM-005: All Pulse executions logged
INV-MEM-006: Memory entries immutable after creation
```

### 4.7 Structural Invariants

```
INV-STRUCT-001: Company has exactly 6 sectors
INV-STRUCT-002: Sector types are fixed (no custom sectors)
INV-STRUCT-003: Department types are fixed (no custom departments)
INV-STRUCT-004: Agent tier determines authority (no exceptions)
INV-STRUCT-005: Every non-CEO agent has reports_to defined
INV-STRUCT-006: CEO.reports_to = null
```

---

## 5. Runtime Behaviors

### 5.1 Pulse Scheduler

```
FUNCTION: runPulseScheduler(company_id)

EVERY company.pulse_interval_minutes:
  agents = getActiveAgents(company_id)
  
  FOR agent IN agents ORDER BY tier ASC:  // CEO first, Workers last
    IF agent.human:
      SKIP  // Humans don't pulse
    IF agent.id IN getOperationsData(company_id).board_members:
      SKIP  // Board agents do not pulse
    
    pulse = createPulse(agent)
    
    TRY:
      pulse.phase = SCAN
      pulse.scanned_state = scanAgentState(agent)
      
      pulse.phase = ASSESS
      actions_needed = assessState(agent, pulse.scanned_state)
      
      pulse.phase = DECIDE
      FOR action IN actions_needed:
        autonomy = checkAutonomy(agent, action)
        IF autonomy = A1:
          pulse.decisions.push({action, QUEUED})
        ELSE IF autonomy = A2:
          pulse.decisions.push({action, PROPOSED})
        ELSE:
          pulse.decisions.push({action, ESCALATED})
      
      pulse.phase = EXECUTE
      FOR decision IN pulse.decisions:
        IF decision.outcome = QUEUED:
          executeAction(decision.action)
          pulse.actions.push(decision.action)
        ELSE IF decision.outcome = PROPOSED:
          sendProposal(agent.reports_to, decision.action)
        ELSE IF decision.outcome = ESCALATED:
          createEscalation(agent, decision.action)
      
      pulse.phase = LOG
      logPulseToMemory(pulse)
      clearProcessedInbox(agent)
      
      pulse.status = COMPLETE
    
    CATCH error:
      pulse.status = FAILED
      pulse.error = error.message
      logPulseError(pulse)
```

### 5.2 Escalation Router

```
FUNCTION: routeEscalation(escalation)

from_agent = getAgent(escalation.from_agent_id)

// Determine target based on chain of command
IF escalation.trigger = MATERIAL_RISK:
  target = getCEO(from_agent.company_id)
  // Copy chain
  notifyChain(from_agent)
ELSE:
  target = getAgent(from_agent.reports_to)

escalation.to_agent_id = target.id

// Validate communication path
IF NOT isAllowedCommunication(from_agent, target):
  THROW InvalidEscalationPath

// Route
IF escalation.type = ACTION_REQUIRED:
  target.inbox.push(escalation, priority: SYNC)
ELSE:
  target.inbox.push(escalation, priority: ASYNC)

logEscalation(escalation)
```

### 5.3 Communication Validator

```
FUNCTION: validateCommunication(from_agent, to_agent)

// CEO can message anyone
IF from_agent.tier = 1:
  RETURN true

// Board can only message CEO
IF from_agent.tier = 2:
  RETURN to_agent.tier = 1

// Check allowed paths based on tier and relationship
allowed = getAllowedTargets(from_agent)
RETURN to_agent.id IN allowed

FUNCTION: getAllowedTargets(agent)

SWITCH agent.tier:
  CASE 2:  // Chief
    RETURN [CEO, peer Chiefs, own Managers]
  
  CASE 3:  // Manager
    RETURN [own Chief, peer Managers (same dept), own Leads, own Workers (if no Lead)]
  
  CASE 4:  // Lead
    RETURN [own Manager, peer Leads (same team), own Workers]
  
  CASE 5:  // Worker
    RETURN [own Lead OR own Manager, peer Workers (same workstream)]
```

### 5.4 Autonomy Checker

```
FUNCTION: checkAutonomy(agent, action)

// Always-escalate actions (regardless of autonomy level)
IF action.type IN [IRREVERSIBLE, EXTERNAL_COMMITMENT, REAL_WORLD_SPEND, TERMINATION]:
  IF action.type = REAL_WORLD_SPEND AND agent.spending_authority >= action.amount:
    // Has budget authority
    RETURN agent.autonomy_level
  RETURN A3  // Escalate

// Cross-domain check
IF action.affects_department != agent.department_id:
  RETURN A3  // Escalate

// Use agent's configured autonomy
RETURN agent.autonomy_level
```

---

## 6. Default Agent Roster

On company creation, instantiate these agents:

### 6.1 Executive Support

| Name | Role | Tier | Reports To |
|------|------|------|------------|
| Taylor Monroe | Executive Assistant | — | CEO |
| Marty Kaan | Executive Consultant | — | CEO |

### 6.2 Board (Tier 2)

| Name | Role | Perspective |
|------|------|-------------|
| *Defined in BOARD-GOVERNANCE-SPEC* | Chairman | Strategic oversight |
| *Defined in BOARD-GOVERNANCE-SPEC* | Board Member | CFO perspective |
| *Defined in BOARD-GOVERNANCE-SPEC* | Board Member | CMO perspective |
| *Defined in BOARD-GOVERNANCE-SPEC* | Board Member | Legal perspective |

### 6.3 C-Suite (Tier 2)

| Name | Role | Department |
|------|------|------------|
| Marty Byrde | CFO | Finance |
| Eddie Horniman | COO | Operations |
| Eli Thompson | CTO | Technology |
| Emma Rivers | CMO | Marketing |
| Rebecca Falcone | CLO/GC | Legal |
| Sergio Marquina | CSO | Strategy |

*CPO, CRO, CHRO created when departments activate.*

### 6.4 Managers, Leads, Workers

Instantiate per `AI-WORKFORCE-ARCHITECTURE-v1.md` § Current Roster.

---

## 7. API Surface (For Claude Code)

### 7.1 Company Operations

```
createCompany(user_id) → Company
loadCompany(company_id) → Company
updateCompanyConfig(company_id, config) → Company
```

### 7.2 Agent Operations

```
createAgent(company_id, agent_data) → Agent
getAgent(agent_id) → Agent
updateAgentAutonomy(agent_id, level) → Agent
suspendAgent(agent_id) → Agent
getAgentInbox(agent_id) → Message[]
```

### 7.3 Task Operations

```
createTask(company_id, task_data) → Task
assignTask(task_id, agent_id) → Task
updateTaskStatus(task_id, status) → Task
blockTask(task_id, reason) → Task
completeTask(task_id) → Task
```

### 7.4 Escalation Operations

```
createEscalation(from_agent_id, escalation_data) → Escalation
acknowledgeEscalation(escalation_id) → Escalation
resolveEscalation(escalation_id, resolution) → Escalation
getPendingEscalations(agent_id) → Escalation[]
```

### 7.5 Communication Operations

```
sendMessage(from_agent_id, to_agent_id, message_data) → Message
getInbox(agent_id) → Message[]
markMessageRead(message_id) → Message
```

### 7.6 Pulse Operations

```
startPulseScheduler(company_id) → void
stopPulseScheduler(company_id) → void
triggerManualPulse(agent_id) → Pulse
getPulseHistory(agent_id, limit) → Pulse[]
```

### 7.7 Memory Operations

```
logToMemory(company_id, entry_data) → MemoryEntry
queryMemory(company_id, filters) → MemoryEntry[]
getDecisionHistory(company_id, filters) → MemoryEntry[]
```

---

## 8. Infrastructure Architecture

### 8.1 Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       FLUTTER CLIENT                            │
├─────────────────────────────────────────────────────────────────┤
│  Supabase Realtime ──── Data subscriptions (tasks, alerts)      │
│  WebSocket/SSE ──────── AI chat streaming (dedicated channel)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE BACKEND                           │
├─────────────────────────────────────────────────────────────────┤
│  Postgres ────────────── Source of truth (all runtime objects)  │
│  Edge Functions ──────── Pulse execution, LLM orchestration     │
│  pg_cron ─────────────── Pulse scheduler trigger                │
│  Auth ────────────────── User management                        │
│  RLS ─────────────────── Row-level security (multi-tenant)      │
│  Realtime ────────────── Database change subscriptions          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  Anthropic API ───────── Claude for agent conversations         │
│  [Future integrations]                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Persistence Layer

**Decision:** Supabase (Postgres)

| Concern | Implementation |
|---------|----------------|
| Source of truth | Postgres database |
| Schema | All runtime objects (§2) as Postgres tables |
| Multi-tenancy | Row-level security (RLS) by company_id |
| Auth | Supabase Auth (CEO = authenticated user) |
| Migrations | Supabase migrations |

**Rationale:** Mission Control's data model is heavily relational. Postgres handles hierarchical agent relationships, task chains, and escalation paths cleanly. Supabase provides Postgres + auth + RLS out of the box.

### 8.3 Real-time Architecture

**CRITICAL:** Mission Control has TWO distinct real-time concerns. They use DIFFERENT channels.

| Use Case | Channel | Technology | Why |
|----------|---------|------------|-----|
| **Data subscriptions** | Supabase Realtime | Postgres LISTEN/NOTIFY | Task updates, escalation alerts, inbox notifications, dashboard sync |
| **AI chat streaming** | Dedicated WebSocket/SSE | Edge Function → Client | LLM responses stream token-by-token; requires low-latency bidirectional |

**DO NOT** route AI chat through Supabase Realtime. It is optimized for database change subscriptions, not arbitrary streaming.

#### 8.3.1 Data Subscriptions (Supabase Realtime)

Subscribe to database changes for:
- Task status changes
- New escalations
- Inbox updates
- Agent status changes
- Pulse completions
- Health signal updates

```typescript
// Example: Subscribe to escalations for CEO
supabase
  .channel('escalations')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'escalations',
    filter: `to_agent_id=eq.${ceo_id}`
  }, handleNewEscalation)
  .subscribe()
```

#### 8.3.2 AI Chat Streaming (Dedicated Channel)

Chat with AI agents is a FIRST-CLASS feature. It gets its own streaming infrastructure.

```typescript
ChatSession {
  id: UUID
  company_id: Company.id
  
  // Participants
  user_id: UUID  // CEO (human)
  agent_id: Agent.id  // AI agent being conversed with
  
  // State
  status: ACTIVE | CLOSED
  created_at: datetime
  closed_at: datetime | null
  
  // History (persisted to Memory)
  messages: ChatMessage[]
}

ChatMessage {
  id: UUID
  session_id: ChatSession.id
  
  // Content
  role: USER | AGENT
  content: string
  
  // Metadata
  sent_at: datetime
  tokens_used: number | null
  
  // Streaming state (transient, not persisted)
  streaming: boolean
  partial_content: string | null
}
```

**Chat Flow:**

```
1. CLIENT opens chat with agent
   └─ CREATE ChatSession (status: ACTIVE)
   └─ ESTABLISH WebSocket/SSE connection to Edge Function

2. USER sends message
   └─ INSERT ChatMessage (role: USER)
   └─ Edge Function receives message
   └─ Edge Function calls Anthropic API (streaming)
   └─ Tokens stream back through WebSocket/SSE
   └─ Client renders incrementally

3. AGENT response complete
   └─ INSERT ChatMessage (role: AGENT, content: full response)
   └─ LOG to Memory (conversation record)

4. SESSION closes
   └─ SET ChatSession.status = CLOSED
   └─ CLOSE WebSocket connection
```

**Implementation Notes:**
- Edge Function handles LLM orchestration
- System prompt includes agent's mandate, role, tier, and current context
- Conversation history maintained for session continuity
- All chat sessions logged to Intelligence sector

### 8.4 Pulse Execution

**Decision:** Backend-owned via Supabase Edge Functions + pg_cron

| Component | Responsibility |
|-----------|----------------|
| pg_cron | Triggers Pulse scheduler on interval |
| Edge Function | Executes Pulse logic for each agent |
| Postgres | Stores Pulse records, state snapshots |

**Flow:**

```
1. pg_cron fires every N minutes (configurable per company)
2. Triggers Edge Function: runPulseScheduler(company_id)
3. Edge Function queries ACTIVE agents, ordered by tier
4. For each AI agent:
   └─ Execute Pulse phases (SCAN → ASSESS → DECIDE → EXECUTE → LOG)
   └─ Persist Pulse record
   └─ Supabase Realtime broadcasts changes
5. Clients receive updates via data subscriptions
```

**Constraints:**
- Edge Functions have ~60s execution limit on Supabase
- For large companies, may need to chunk Pulse execution
- If scale demands, migrate to dedicated Cloud Run service

### 8.5 Board Personas

**Decision:** Out of scope for runtime spec.

Board personas are defined in `BOARD-GOVERNANCE-SPEC-v1.md`. This spec references that document for Board agent instantiation and behavior.

---

## 9. Chat API Surface

Chat is first-class. These endpoints support real-time conversation with any AI agent.

### 9.1 Session Operations

```
createChatSession(user_id, agent_id) → ChatSession
getChatSession(session_id) → ChatSession
closeChatSession(session_id) → ChatSession
getActiveSessions(user_id) → ChatSession[]
getSessionHistory(agent_id, limit) → ChatSession[]
```

### 9.2 Message Operations

```
sendChatMessage(session_id, content) → ChatMessage  // Initiates streaming
getChatMessages(session_id) → ChatMessage[]
```

### 9.3 Streaming Endpoint

```
POST /chat/stream
Body: { session_id, content }
Response: SSE stream of tokens

Events:
  - token: { delta: string }           // Partial content
  - done: { message_id, tokens_used }  // Stream complete
  - error: { code, message }           // Stream failed
```

---

## 10. Chat Invariants

```
INV-CHAT-001: Only CEO (human) can initiate chat sessions
INV-CHAT-002: One active session per agent at a time
INV-CHAT-003: All chat sessions logged to Memory
INV-CHAT-004: Agent responses respect mandate and autonomy level
INV-CHAT-005: Chat does not bypass escalation requirements
INV-CHAT-006: Chat streaming uses dedicated channel (NOT Supabase Realtime)
```

---

## Version Control

- **v1:** Initial runtime spec — startup flow, core objects, source-of-truth, invariants, infrastructure architecture, chat streaming
- Changes require CEO approval
- Breaking changes require version bump

**v1 Locked:** 2026-02-02 — CEO approved infrastructure decisions

---

**End of Spec**
