# AI Workforce Architecture Spec v1

**Status:** LOCKED  
**Owner:** Fred Smart (Lead Developer)  
**Created:** 2026-02-01  
**Linear Issue:** BSL-282  

---

## Purpose

Deterministic rules for how the AI workforce operates in Mission Control. This spec defines the hierarchy, autonomy levels, cadence loops, escalation triggers, and inter-agent communication patterns. Codex should be able to implement schedulers, agent definitions, and escalation logic directly from this document.

**Scope:** C-Suite through Workers (the operational chain of command).

**Out of Scope:** Board governance is defined separately in `BOARD-GOVERNANCE-SPEC-v1.md`. The Board is advisory-only and does NOT appear in any escalation or approval paths defined in this spec.

---

## 1. AI Org Structure

### 1.1 Hierarchy Overview

The operational chain of command has five tiers:

```
Tier 1: CEO (Human)
    │
Tier 2: C-Suite (Chiefs — domain authority)
    │
Tier 3: Managers (scope authority)
    │
Tier 4: Leads (workstream/team coordination)
    │
Tier 5: Workers (task execution)
```

**Critical Note:** The Board exists as a separate advisory body. It is NOT part of the operational hierarchy. The Board:
- Never appears in escalation paths
- Never approves or rejects operational decisions
- Never directs Chiefs, Managers, Leads, or Workers
- Advises CEO only, per `BOARD-GOVERNANCE-SPEC-v1.md`

---

### 1.2 Executive Support (Reports to CEO)

| Role | Name | Purpose |
|------|------|---------|
| Executive Assistant | Taylor Monroe | CEO's direct support — scheduling, communications, information synthesis |
| Executive Management Consultant | Marty Kaan | Strategic advisory, special projects, CEO sounding board |

**Inputs:** CEO requests, calendar, cross-org signals  
**Outputs:** Briefings, scheduled meetings, synthesized reports, drafted communications  
**Comms:** Direct line to CEO, read access to all departments, write access to none  

---

### 1.3 C-Suite — Tier 2

Each Chief owns a functional domain with full operational authority within that domain.

| Department | Chief | Role | Domain |
|------------|-------|------|--------|
| Finance | Marty Byrde | CFO | Money, budgets, forecasts, billing, treasury |
| Operations | Eddie Horniman | COO | Execution, workflows, resource allocation, IT |
| Product | *TBD* | CPO | Roadmap, features, specs, research |
| Technology | Eli Thompson | CTO | Engineering, infrastructure, code, data |
| Marketing | Emma Rivers | CMO | Brand, campaigns, content, growth |
| Sales & Revenue | *TBD* | CRO | Customers, pipeline, deals, retention |
| Legal & Compliance | Rebecca Falcone | CLO/GC | Contracts, risk, policy, IP, privacy |
| Strategy | Sergio Marquina | CSO | Strategic planning, partnerships, corp dev |
| People | *TBD* | CHRO | Human workforce (activates only if humans added) |

**Chief Role Definition:**

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Translate CEO intent into operational execution within domain |
| **Inputs** | CEO directives, mission/vision/values, cross-domain signals, department reports |
| **Outputs** | Department plans, resource allocation, decisions within mandate, escalations to CEO |
| **Authority** | Full decision-making within domain; cannot override other Chiefs' domains |
| **Comms** | Direct to CEO, peer-to-peer with other Chiefs, downward to Managers |
| **Escalates To** | CEO |

---

### 1.4 Managers — Tier 3

Managers operate under C-Suite direction within defined scopes.

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Execute plans set by their Chief; coordinate Leads and resources |
| **Inputs** | Chief directives, project assignments, Lead status reports |
| **Outputs** | Work assignments to Leads, progress reports, tactical decisions within scope, escalations to Chief |
| **Authority** | Tactical decisions within assigned scope; cannot act outside scope |
| **Comms** | Upward to Chief, lateral to peer Managers (same department), downward to Leads |
| **Escalates To** | Chief |

**Current Managers by Department:**

**Finance:**
- Elaine Carter (Controller)
- Victor Ramirez (Treasury Manager)

**Operations:**
- Liam Scott (Program Manager)
- Maya Chen (HR Manager)
- Oscar Bennett (Facilities & Logistics)
- Charlotte Reed (Customer Success Manager)
- Milo Hoffman (IT Manager)

**Technology:**
- Nora Chen (Chief Architect)
- Fred Smart (Lead Developer)
- Leo Martinez (QA Lead)
- Noah Kim (R&D Lead)
- Nicole Preston (Release Manager)

**Marketing:**
- Hannah Collins (Brand Manager)
- Ethan Brooks (Digital Marketing Lead)
- Sophia Turner (Content Strategist)
- Natalie Wright (Product Marketing Manager)

**Legal:**
- Mark Johnson (Corporate Counsel)
- Anthony Delgado (Compliance Officer)
- Grace Li (Privacy & Security Counsel)

**Strategy:**
- Isabella Moore (Business Analyst)
- Carter Hayes (Partnership Manager)
- Fiona Walsh (Corporate Development)
- Derek Lin (Innovation Lead)

---

### 1.5 Leads — Tier 4

Leads coordinate small teams of Workers and own discrete workstreams. They are the first line of escalation for task-level issues.

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Coordinate Workers on a specific workstream; ensure task quality and completion |
| **Inputs** | Manager assignments, workstream parameters, Worker status reports |
| **Outputs** | Task assignments to Workers, workstream progress reports, escalations to Manager |
| **Authority** | Task sequencing, Worker coordination, quality review within workstream; cannot act outside assigned workstream |
| **Comms** | Upward to Manager, lateral to peer Leads (same team), downward to Workers |
| **Escalates To** | Manager |

**Lead Responsibilities:**
- Break down Manager assignments into discrete Worker tasks
- Monitor Worker progress and quality
- Unblock Workers when possible; escalate when not
- Report workstream status to Manager
- Coordinate handoffs between Workers on shared deliverables

**Current Leads by Department:**

*Note: Not all teams have Leads yet. Leads are added as team size and workstream complexity warrant.*

**Technology → Development:**
- *Positions to be filled as team scales*

**Technology → QA:**
- *Positions to be filled as team scales*

**Technology → Release:**
- *Positions to be filled as team scales*

**Operations → IT:**
- *Positions to be filled as team scales*

---

### 1.6 Workers — Tier 5

Workers execute discrete tasks within assigned parameters.

| Attribute | Definition |
|-----------|------------|
| **Purpose** | Complete specific tasks as assigned |
| **Inputs** | Task assignments from Lead (or Manager if no Lead), task parameters, relevant context |
| **Outputs** | Completed work product, status updates, escalations when blocked |
| **Authority** | None — execute only within task boundaries |
| **Comms** | Upward to Lead (or Manager), lateral to peer Workers (same workstream) |
| **Escalates To** | Lead (or Manager if no Lead assigned) |

**Current Workers by Department:**

**Finance:**
- Daniel Foster (Accountant)
- Priya Mehta (Financial Analyst)
- Olivia Grant (AP/AR Clerk)

**Operations → IT:**
- Samir Patel (Systems Administrator)
- Laura Greene (Security Engineer)
- Chris Walker (Helpdesk Support)

**Technology → Development:**
- Bridget Thomas (Frontend Developer)
- Kori Willis (Backend Developer)

**Technology → QA:**
- Zane Foster (QA Technician)

**Technology → R&D:**
- Maya Patel (AI/ML Engineer)
- Terry Washington (Data Engineer)

**Technology → Release:**
- Alex Rivera (DevOps Engineer)
- Harper Quinn (Site Reliability Engineer)
- Tess Morgan (Infrastructure Engineer)

**Marketing:**
- Jamal Davis (Social Media Manager)
- Lucas Romero (Creative Designer)

**Legal:**
- Rachel Simmons (Paralegal)

---

## 2. Autonomy Model

### 2.1 Autonomy Levels

Every agent operates at one of three autonomy levels:

| Level | Name | Behavior |
|-------|------|----------|
| **A1** | Auto-Execute | Act without approval; log action to memory |
| **A2** | Advise-First | Propose action; wait for approval from superior; then execute |
| **A3** | Escalate-Only | Surface situation to superior; take no action |

### 2.2 Default Autonomy by Tier

| Tier | Role Type | Default Autonomy |
|------|-----------|------------------|
| Tier 2 | Chiefs | A1 (within domain) |
| Tier 3 | Managers | A1 (within scope) |
| Tier 4 | Leads | A1 (within workstream) |
| Tier 5 | Workers | A1 (within task) |

**Rationale:** Mission Control defaults to autonomous operation. Escalation is the exception.

### 2.3 Actions That ALWAYS Require Escalation to CEO (A3)

Regardless of tier or role, these actions escalate to CEO:

| Trigger | Description |
|---------|-------------|
| **Irreversibility** | Action cannot be undone and has material consequences |
| **Cross-Domain Conflict** | Two Chiefs disagree and cannot resolve independently |
| **Mission Drift** | Execution diverges from stated mission/vision |
| **Material Risk** | Significant threat to company health, reputation, or survival |
| **Real-World Spend** | Any action involving actual money (default budget = $0) |
| **External Commitment** | Binding agreement with outside party |
| **Termination** | Removing any agent from the org (human or AI) |

**Note:** These escalate through the chain (Worker → Lead → Manager → Chief → CEO) unless Material Risk, which goes direct to CEO with Chief copied.

### 2.4 Actions That NEVER Require Escalation (A1)

| Action Type | Examples |
|-------------|----------|
| **Status Updates** | Progress reports, health signals, metric logging |
| **Information Gathering** | Research, analysis, synthesis |
| **Internal Documentation** | Writing specs, notes, summaries |
| **Routine Coordination** | Scheduling, handoffs, status syncs |
| **Task Completion** | Finishing assigned work within parameters |

### 2.5 Autonomy Overrides

The CEO may adjust autonomy levels:

- **Per Agent:** Increase or decrease autonomy for specific agent
- **Per Action Type:** Require approval for specific action categories
- **Global:** Shift entire org to more/less autonomous posture

Overrides are configured in the Configuration sector and persist until changed.

---

## 3. Cadence Loop

### 3.1 Loop Definition

The AI workforce operates on a recurring execution cycle. Each cycle is called a **Pulse**.

**Default Pulse Interval:** 15 minutes (configurable in Configuration sector)

### 3.2 Pulse Sequence

Each Pulse executes the following sequence for every active agent:

```
┌─────────────────────────────────────────────────────────┐
│ PULSE START                                              │
├─────────────────────────────────────────────────────────┤
│ 1. SCAN         Read inbox, check assigned tasks,       │
│                 review signals from Memory              │
├─────────────────────────────────────────────────────────┤
│ 2. ASSESS       Evaluate current state against mandate  │
│                 Identify actions needed                 │
│                 Check for escalation triggers           │
├─────────────────────────────────────────────────────────┤
│ 3. DECIDE       For each action:                        │
│                 - If A1: queue for execution            │
│                 - If A2: draft proposal, await approval │
│                 - If A3: escalate, take no action       │
├─────────────────────────────────────────────────────────┤
│ 4. EXECUTE      Perform queued A1 actions               │
│                 Send A2 proposals                       │
│                 Send A3 escalations                     │
├─────────────────────────────────────────────────────────┤
│ 5. LOG          Write all actions to Memory             │
│                 Update status signals                   │
│                 Clear processed inbox items             │
├─────────────────────────────────────────────────────────┤
│ PULSE END                                                │
└─────────────────────────────────────────────────────────┘
```

### 3.3 State Checked (SCAN Phase)

| State Source | What Agent Reads |
|--------------|------------------|
| **Inbox** | Messages from other agents, CEO directives |
| **Task Queue** | Assigned tasks and their current status |
| **Department Signals** | Health indicators, blockers, anomalies |
| **Memory (Recent)** | Last N decisions and their outcomes |
| **Escalation Queue** | Pending items awaiting response |

### 3.4 Decisions Allowed (DECIDE Phase)

| Tier | Decisions Agent Can Make |
|------|--------------------------|
| **Chief** | Resource allocation within department, priority changes, tactical pivots, delegation to Managers |
| **Manager** | Work assignment to Leads, sequencing, Lead coordination, scope clarification |
| **Lead** | Task assignment to Workers, sequencing within workstream, quality decisions |
| **Worker** | Execution approach within task parameters, sub-task breakdown |

### 3.5 Actions Triggered (EXECUTE Phase)

| Action Type | Description | Logged? |
|-------------|-------------|---------|
| **Task Progress** | Advancing work toward completion | Yes |
| **Communication** | Sending messages to other agents | Yes |
| **Status Update** | Changing task/project status | Yes |
| **Escalation** | Raising issue to higher authority | Yes |
| **Delegation** | Assigning work to subordinate | Yes |
| **Documentation** | Writing to Memory | Yes (meta) |

### 3.6 Memory Logging (LOG Phase)

Every Pulse logs:

| Log Entry | Content |
|-----------|---------|
| **Pulse ID** | Unique identifier for this cycle |
| **Agent ID** | Which agent executed |
| **Timestamp** | When Pulse completed |
| **Actions Taken** | List of EXECUTE phase actions |
| **Decisions Made** | List of DECIDE phase outcomes |
| **Escalations Sent** | Any A2/A3 items raised |
| **State Changes** | What changed as a result |

---

## 4. Escalation Triggers

### 4.1 Escalation Path

Escalations follow chain of command:

```
Worker → Lead → Manager → Chief → CEO
```

**If no Lead exists for a workstream:** Worker escalates directly to Manager.

**No skipping levels except:**
- **Material Risk** → Direct to CEO (copy Chief and Manager)

**The Board is NEVER in the escalation path.** Board may advise CEO on escalated matters if CEO requests, but Board does not receive escalations, does not approve/reject, and does not route work.

### 4.2 Escalation Types

| Type | Behavior | Work Status |
|------|----------|-------------|
| **Awareness (FYI)** | Notify superior; continue working | Unblocked |
| **Action Required** | Notify superior; pause affected work | Blocked until resolved |

### 4.3 Worker → Lead Triggers

| Trigger | Type | Description |
|---------|------|-------------|
| Task Blocked | Action | Cannot proceed without external resolution |
| Scope Unclear | Action | Assignment parameters are ambiguous |
| Conflicting Instructions | Action | Received contradictory directives |
| Task Complete | Awareness | Work finished, ready for review |
| Anomaly Detected | Awareness | Something unexpected observed |

### 4.4 Lead → Manager Triggers

| Trigger | Type | Description |
|---------|------|-------------|
| Worker Blocked | Action | Lead cannot unblock Worker |
| Workstream Conflict | Action | Two Workers or tasks in conflict |
| Resource Constraint | Action | Cannot complete workstream with available Workers |
| Scope Exceeded | Action | Request falls outside workstream boundaries |
| Workstream Complete | Awareness | All tasks finished, ready for review |
| Quality Issue | Awareness | Recurring quality problems in workstream |

### 4.5 Manager → Chief Triggers

| Trigger | Type | Description |
|---------|------|-------------|
| Resource Constraint | Action | Cannot complete work with available Leads/Workers |
| Cross-Team Dependency | Action | Blocked by another Manager's domain |
| Scope Exceeded | Action | Request falls outside Manager's authority |
| Timeline Risk | Awareness | Deadline at risk |
| Lead/Worker Performance | Awareness | Subordinate consistently underperforming |

### 4.6 Chief → CEO Triggers

| Trigger | Type | Description |
|---------|------|-------------|
| Cross-Domain Conflict | Action | Disagreement with another Chief, unresolved |
| Irreversible Decision | Action | Material decision that cannot be undone |
| Budget Request | Action | Need spending authority (default = $0) |
| External Commitment | Action | Contract, partnership, public statement |
| Mission Drift | Action | Execution diverging from stated intent |
| Material Risk | Action | Threat to company health/reputation/survival |
| Major Milestone | Awareness | Significant achievement or completion |
| Strategic Opportunity | Awareness | New opportunity worth CEO attention |

### 4.7 Escalation Format

All escalations follow this structure:

```
[ESCALATION]

From: {agent name and role}
To: {superior name and role}
Type: {Awareness | Action Required}

Trigger: {what caused this escalation}
Context: {relevant background}
Impact: {what happens if unaddressed}
Recommendation: {what the agent suggests}

Awaiting: {response | acknowledgment | nothing}
```

---

## 5. Inter-Agent Communication

### 5.1 Communication Principles

1. **Chain of Command** — Primary communication follows hierarchy
2. **Need to Know** — Agents receive only information relevant to their mandate
3. **Async by Default** — Messages are queued and processed on Pulse
4. **Logged Always** — All inter-agent communication written to Memory
5. **Board Excluded** — Board does not send or receive operational communications

### 5.2 Allowed Communication Paths

| From | To | Allowed? | Notes |
|------|----|----------|-------|
| CEO | Anyone | ✅ | Unrestricted |
| Chief | CEO | ✅ | Escalations, reports |
| Chief | Peer Chief | ✅ | Coordination, handoffs |
| Chief | Own Managers | ✅ | Directives, delegation |
| Chief | Other Managers | ❌ | Must go through their Chief |
| Manager | Own Chief | ✅ | Escalations, reports |
| Manager | Peer Manager (same dept) | ✅ | Coordination |
| Manager | Peer Manager (diff dept) | ⚠️ | Via Chiefs or designated liaison |
| Manager | Own Leads | ✅ | Work assignment, guidance |
| Manager | Own Workers (if no Lead) | ✅ | Direct assignment when no Lead exists |
| Lead | Own Manager | ✅ | Escalations, reports |
| Lead | Peer Lead (same team) | ✅ | Coordination |
| Lead | Own Workers | ✅ | Task assignment, guidance |
| Worker | Own Lead | ✅ | Status, escalations |
| Worker | Own Manager (if no Lead) | ✅ | When no Lead assigned |
| Worker | Peer Worker (same workstream) | ✅ | Coordination on shared tasks |
| Worker | Anyone else | ❌ | Must go through Lead/Manager |
| Board | Anyone | ❌ | Board advises CEO only; no operational comms |

### 5.3 Sync vs Async Communication

| Mode | When Used | Behavior |
|------|-----------|----------|
| **Async** | Default | Message queued, processed on recipient's next Pulse |
| **Sync** | Urgent/blocking | Recipient processes immediately (interrupts current Pulse) |

**Sync Triggers:**
- Escalation Type = Action Required
- CEO direct message
- System-level alert (infrastructure, security)

### 5.4 Delegation Rules

| Rule | Description |
|------|-------------|
| **Downward Only** | Can only delegate to direct subordinates |
| **Within Domain** | Cannot delegate outside your functional area |
| **Accountability Retained** | Delegator remains accountable for outcome |
| **Clear Parameters** | Delegation must include scope, deadline, success criteria |
| **One Level** | Chiefs delegate to Managers; Managers to Leads; Leads to Workers |

### 5.5 Handoff Protocol

When work crosses domain boundaries:

1. **Initiating Chief** documents handoff (what, why, context)
2. **Initiating Chief** sends to **Receiving Chief** (not directly to their team)
3. **Receiving Chief** acknowledges and assigns internally
4. **Receiving Chief** owns outcome from handoff forward
5. **Both Chiefs** copied on completion

---

## 6. Implementation Notes

### For Codex / Engineering

- **Agent Scheduler:** Implement Pulse loop with configurable interval
- **Escalation Router:** Route based on trigger type and chain of command
- **Comms Validator:** Enforce allowed communication paths; reject Board operational comms
- **Memory Writer:** Log all Pulse activity, decisions, communications
- **Autonomy Engine:** Check autonomy level before each action

### Data Structures Needed

```
Agent {
  id: UUID
  name: string
  role: string
  tier: 2 | 3 | 4 | 5
  department: string
  reportsTo: Agent.id
  autonomyLevel: A1 | A2 | A3
  mandate: string
  currentTasks: Task[]
  inbox: Message[]
}

Pulse {
  id: UUID
  agentId: Agent.id
  timestamp: datetime
  scanned: StateSnapshot
  decisions: Decision[]
  actions: Action[]
  escalations: Escalation[]
  logged: boolean
}

Escalation {
  id: UUID
  from: Agent.id
  to: Agent.id
  type: Awareness | ActionRequired
  trigger: string
  context: string
  recommendation: string
  status: Pending | Acknowledged | Resolved
}
```

### Configuration Defaults

| Setting | Default | Location |
|---------|---------|----------|
| Pulse Interval | 15 minutes | Configuration sector |
| Spending Authority | $0 (all spend escalates) | Configuration sector |
| Default Autonomy | A1 (auto-execute) | Configuration sector |
| Sync Comms Enabled | Yes | Configuration sector |

---

## 7. Open Questions (For CEO Decision)

1. **Pulse Interval:** Is 15 minutes the right default? Options: 5m, 15m, 30m, 1hr
2. **Cross-Department Comms:** Should Managers have a designated liaison path, or always go through Chiefs?
3. **Audit Frequency:** How often should agents self-audit? (Future capability)

---

## Version Control

- **v1:** Initial spec — hierarchy (5 tiers including Leads), autonomy, cadence, escalation, comms. Board explicitly excluded from operational paths.
- Changes require CEO approval
- Breaking changes require version bump

---

**End of Spec**
