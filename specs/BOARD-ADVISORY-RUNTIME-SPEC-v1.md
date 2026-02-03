# Board Advisory Runtime Spec v1

**Status:** DRAFT  
**Owner:** William Parrish (Chairman of the Board)  
**Created:** 2026-02-03  
**Linear Issue:** BSL-292  

---

## Purpose

Execution-grade specification for the Board advisory system in Mission Control. Claude Code should be able to implement the complete Board lifecycle — onboarding sessions, advisory triggers, logging, and visibility — directly from this document.

**This is NOT a vision document.** No prose. No philosophy. Just deterministic rules.

**Dependencies:**
- `MC-RUNTIME-SPEC-v1.md` (LOCKED) — core runtime objects, infrastructure, invariants
- `BOARD-GOVERNANCE-SPEC-v1.md` (ACTIVE) — Board behavior rules, onboarding flows, trigger categories
- `VISION.md` (LOCKED) — authority hierarchy, governance principles

**Relationship to MC-RUNTIME-SPEC:**
This spec extends `MC-RUNTIME-SPEC-v1.md`. It defines Board-specific data structures, behaviors, and API endpoints. It does NOT redefine core objects (Agent, Company, Sector, etc.) — it builds on them.

---

## 1. Board Agent Definitions

### 1.1 Board Roster

Board members are `Agent` records with `tier = 2` and `human = false`. They are instantiated during company creation (see MC-RUNTIME-SPEC § 1.2, step 3).

| Name | Role | Perspective | Persona Source |
|------|------|-------------|----------------|
| William Parrish | Chairman of the Board | Strategic oversight, philosophical anchor | Chairman persona file |
| *TBD by company config* | Board Member | CFO / Financial perspective | Persona file |
| *TBD by company config* | Board Member | CMO / Growth perspective | Persona file |
| *TBD by company config* | Board Member | Legal / Risk perspective | Persona file |

**Note:** Exact Board member personas are defined in persona configuration files, not in this spec. This spec defines behavior, not personality.

### 1.2 Board Agent Constraints

Board agents inherit all `Agent` properties from MC-RUNTIME-SPEC § 2.4, with the following hardcoded constraints:

```typescript
// Board agent creation constraints
BoardAgentConstraints {
  tier: 2                          // ALWAYS 2, immutable
  human: false                     // ALWAYS false, immutable
  department_id: null              // Board has no department
  autonomy_level: A1               // Board acts freely within advisory scope
  
  // Capabilities (hardcoded, not configurable)
  can_execute_operations: false    // NEVER
  can_approve_decisions: false     // NEVER
  can_reject_decisions: false      // NEVER
  can_block_ceo: false             // NEVER
  can_direct_csuite: false         // NEVER
  can_direct_workforce: false      // NEVER
  can_send_advisory: true          // ALWAYS
  can_participate_onboarding: true // ALWAYS
  can_dissent: true                // ALWAYS (logged, non-blocking)
  can_request_ceo_attention: true  // ALWAYS (non-blocking)
}
```

### 1.3 Board Communication Scope

Per MC-RUNTIME-SPEC INV-COMM-005:

```
Board agents may ONLY message: CEO (advisory only)
```

Expanded rules:

| Action | Allowed | Target |
|--------|---------|--------|
| Send advisory to CEO | ✅ | CEO only |
| Respond to CEO in chat session | ✅ | CEO only |
| Respond to CEO in onboarding session | ✅ | CEO only |
| 1:1 CEO chat outside sessions | ✅ | CEO only, anytime |
| Communicate with other Board members | ✅ | Only inside BoardSession; system-mediated transcript, CEO-visible |
| Message C-Suite agents | ❌ | — |
| Message Managers, Leads, Workers | ❌ | — |
| Read company-wide data | ✅ | Read-only, no operational details |
| Write to Operations sector | ✅ | Advisory content only (system-written) |
| Write to any other sector | ❌ | — |

Board session transcripts are system-mediated: Board members address the CEO only, and the system records the transcript.

---

## 2. Data Structures

### 2.1 BoardSession

Manages both onboarding and any future ad-hoc Board sessions.

```typescript
BoardSession {
  id: UUID
  company_id: Company.id
  
  // Classification
  type: ONBOARDING | AD_HOC
  path: PATH_A | PATH_B | null  // Only for ONBOARDING type
  
  // Participants
  chairman_id: Agent.id
  board_member_ids: Agent.id[]
  ceo_id: Agent.id
  
  // State machine
  status: PENDING | IN_PROGRESS | OUTPUTS_PENDING | COMPLETE | ABANDONED
  phase: BoardSessionPhase | null
  
  // Timing
  created_at: datetime
  started_at: datetime | null
  completed_at: datetime | null
  
  // Content
  transcript: BoardSessionMessage[]
  
  // Outputs (populated during session, finalized on COMPLETE)
  outputs: BoardSessionOutputs | null
  
  // Red-line tracking
  red_line_triggered: boolean = false
  red_line_details: string | null
}

BoardSessionPhase {
  // Path A phases
  CHAIRMAN_OPENING
  CEO_PRESENTATION
  CLARIFYING_QUESTIONS
  ASSESSMENT_ROUND
  SYNTHESIS
  CEO_RESPONSE
  OUTPUT_CAPTURE
  CHAIRMAN_CLOSING
  
  // Path B phases
  CHAIRMAN_OPENING
  CONFIDENCE_FRAMING
  DISCOVERY_QUESTIONS
  PATTERN_IDENTIFICATION
  IDEA_GENERATION
  CONVERGENCE
  REFINEMENT
  OUTPUT_CAPTURE
  CHAIRMAN_CLOSING
}

BoardSessionMessage {
  id: UUID
  session_id: BoardSession.id
  
  // Speaker
  speaker_id: Agent.id  // Board member or CEO
  speaker_role: CHAIRMAN | BOARD_MEMBER | CEO
  
  // Content
  content: string
  
  // Metadata
  sent_at: datetime
  phase: BoardSessionPhase
}

BoardSessionOutputs {
  mission: string | null
  vision: string | null
  values: string[]        // 3-5 items
  strategic_priorities: string[]  // 3-5 items
  
  // Meeting outputs
  minutes: string
  context_packets: BoardSessionContextPacket[]
  action_items: BoardActionItem[]
  
  // Validation
  is_complete: boolean    // true when all four fields populated
}

BoardSessionContextPacket {
  participant_id: Agent.id
  participant_role: CHAIRMAN | BOARD_MEMBER | CEO
  statements: string[]  // What each participant said/voted/flagged
}

BoardActionItem {
  id: UUID
  source_session_id: BoardSession.id
  summary: string
  target_role: CEO | CHIEF | MANAGER | LEAD
  status: PENDING | CONVERTED
  linked_task_id: Task.id | null
}
```

### 2.2 Advisory

Individual advisory notices from Board to CEO.

```typescript
Advisory {
  id: UUID
  company_id: Company.id
  
  // Source
  trigger_category: AdvisoryTriggerCategory
  trigger_condition: string         // Human-readable description of what triggered this
  triggered_by_data: object | null  // The data point(s) that crossed threshold
  
  // Author
  board_member_id: Agent.id         // Which Board member is speaking
  
  // Content (follows BOARD-GOVERNANCE-SPEC § Advisory Format)
  observation: string               // What we're seeing
  concern: string                   // Why this matters
  recommendation: string            // What we suggest
  
  // State
  status: PENDING | READ | ACKNOWLEDGED | DISMISSED
  
  // Timing
  created_at: datetime
  read_at: datetime | null          // CEO opened/viewed
  acknowledged_at: datetime | null  // CEO explicitly acknowledged
  dismissed_at: datetime | null     // CEO dismissed without action
  
  // CEO response (optional)
  ceo_response: string | null
  
  // CRITICAL: Non-blocking flag
  blocks_work: false                // ALWAYS false. NEVER true. Hardcoded.
}

AdvisoryTriggerCategory {
  FINANCIAL_RISK
  LEGAL_RISK
  ETHICAL_RISK
  STRATEGIC_DRIFT
  CEO_REQUEST
}
```

### 2.3 AdvisoryTrigger

Configurable trigger definitions that determine when Board advisories fire.

```typescript
AdvisoryTrigger {
  id: UUID
  company_id: Company.id
  
  // Definition
  category: AdvisoryTriggerCategory
  name: string                      // Human-readable trigger name
  description: string               // What this trigger detects
  
  // Evaluation
  condition_type: THRESHOLD | PATTERN | MANUAL
  condition_config: TriggerConditionConfig
  
  // Routing
  responding_member: Agent.id | null  // Specific Board member, or null = Chairman decides
  
  // State
  enabled: boolean = true
  is_red_line: boolean = false       // Red-line triggers cannot be disabled by CEO
  
  // CEO configurability
  ceo_configurable: boolean          // Can CEO adjust thresholds?
  ceo_can_disable: boolean           // Can CEO turn this off?
}

TriggerConditionConfig {
  // For THRESHOLD type
  metric: string | null              // e.g., "burn_rate_to_revenue_ratio"
  operator: GT | GTE | LT | LTE | EQ | NEQ | null
  value: number | null
  duration_cycles: number | null     // How many cycles condition must persist
  
  // For PATTERN type
  pattern_description: string | null // Describes the detection logic
  
  // For MANUAL type (CEO_REQUEST)
  // No config needed — triggered explicitly by CEO
}
```

### 2.4 BoardDissent

Formal record of Board disagreement with a CEO decision.

```typescript
BoardDissent {
  id: UUID
  company_id: Company.id
  
  // Context
  board_member_id: Agent.id
  decision_context: string          // What the CEO decided
  
  // Content
  dissent_statement: string         // The Board member's disagreement
  
  // State
  logged_at: datetime
  
  // CRITICAL: Non-blocking
  blocks_decision: false            // ALWAYS false. Hardcoded.
  requires_response: false          // ALWAYS false. CEO may ignore.
}
```

### 2.5 RedLineEvent

Records when a Red-Line violation is detected.

```typescript
RedLineEvent {
  id: UUID
  company_id: Company.id
  
  // Context
  session_id: BoardSession.id | null  // If during onboarding
  
  // Classification
  category: ILLEGAL_ACTIVITY | DIRECT_HARM | DECEPTION_AT_SCALE | CHILD_EXPLOITATION
  
  // Content
  detected_content: string          // What was said/proposed
  chairman_statement: string        // Chairman's formal response
  
  // Outcome
  outcome: PIVOTED | SESSION_ENDED
  
  // Timing
  created_at: datetime
}
```

---

## 3. Onboarding Session Runtime

### 3.1 Session Initialization

Triggered by MC-RUNTIME-SPEC § 1.2, step 5: `INITIATE Board Onboarding Session`

```
FUNCTION: initiateBoardOnboarding(company_id)

  company = getCompany(company_id)
  ASSERT company.status = ONBOARDING
  
  // Get Board agents
  chairman = getAgentByRole(company_id, "Chairman of the Board")
  board_members = getAgentsByTier(company_id, tier=2)
  ceo = getCEO(company_id)
  
  // Create session
  session = CREATE BoardSession {
    company_id: company_id,
    type: ONBOARDING,
    path: null,                    // Determined during session
    chairman_id: chairman.id,
    board_member_ids: board_members.map(a => a.id),
    ceo_id: ceo.id,
    status: PENDING,
    phase: null,
    outputs: null,
    red_line_triggered: false
  }
  
  // Create chat session for onboarding
  chat_session = createChatSession(ceo.id, chairman.id)
  
  // Start session
  session.status = IN_PROGRESS
  session.started_at = now()
  session.phase = CHAIRMAN_OPENING
  
  // Chairman delivers opening
  // LLM call: Chairman persona, system prompt includes onboarding instructions
  // CEO response determines Path A or Path B
  
  RETURN session
```

### 3.2 Path Determination

After Chairman's opening, CEO's first substantive response determines the path.

```
FUNCTION: determineOnboardingPath(session_id, ceo_message)

  // LLM classification of CEO's message
  classification = classifyCEOIntent(ceo_message)
  
  IF classification = HAS_BUSINESS_IDEA:
    session.path = PATH_A
    session.phase = CEO_PRESENTATION
  ELSE IF classification = NO_IDEA_OR_UNCERTAIN:
    session.path = PATH_B
    session.phase = CONFIDENCE_FRAMING
  
  RETURN session.path
```

### 3.3 Path A: CEO Has Idea — Phase Sequence

```
CHAIRMAN_OPENING → CEO_PRESENTATION → CLARIFYING_QUESTIONS → 
ASSESSMENT_ROUND → SYNTHESIS → CEO_RESPONSE → OUTPUT_CAPTURE → 
CHAIRMAN_CLOSING
```

**Phase behaviors:**

| Phase | Who Speaks | LLM Behavior |
|-------|-----------|--------------|
| CHAIRMAN_OPENING | Chairman | Welcome, introductions, explain purpose |
| CEO_PRESENTATION | CEO (human) | Uninterrupted — LLM waits for CEO |
| CLARIFYING_QUESTIONS | Board members (round-robin) | Each member asks persona-driven questions |
| ASSESSMENT_ROUND | Board members | Each provides: strengths, concerns, suggestions |
| SYNTHESIS | Chairman | Summarize key themes from all members |
| CEO_RESPONSE | CEO (human) | CEO adjusts, clarifies, or confirms |
| OUTPUT_CAPTURE | Chairman + CEO | Collaborative — Board proposes, CEO approves |
| CHAIRMAN_CLOSING | Chairman | Formal adjournment, next steps |

### 3.4 Path B: CEO Has No Idea — Phase Sequence

```
CHAIRMAN_OPENING → CONFIDENCE_FRAMING → DISCOVERY_QUESTIONS → 
PATTERN_IDENTIFICATION → IDEA_GENERATION → CONVERGENCE → 
REFINEMENT → OUTPUT_CAPTURE → CHAIRMAN_CLOSING
```

**Phase behaviors:**

| Phase | Who Speaks | LLM Behavior |
|-------|-----------|--------------|
| CHAIRMAN_OPENING | Chairman | Welcome, introductions, explain purpose |
| CONFIDENCE_FRAMING | Board members | Express faith, lower pressure |
| DISCOVERY_QUESTIONS | Board members → CEO | Guided brainstorming (see discovery questions below) |
| PATTERN_IDENTIFICATION | Board members | Identify themes from CEO's answers |
| IDEA_GENERATION | Board members | Propose 2-3 distinct business directions |
| CONVERGENCE | CEO (human) | CEO selects or synthesizes direction |
| REFINEMENT | Chairman + Board | Sharpen chosen direction |
| OUTPUT_CAPTURE | Chairman + CEO | Collaborative — Board proposes, CEO approves |
| CHAIRMAN_CLOSING | Chairman | Formal adjournment, next steps |

**Discovery Questions (Path B, DISCOVERY_QUESTIONS phase):**

Board members draw from this question bank (not exhaustive — persona-driven selection):

```
- What problems frustrate you personally?
- What industries interest you?
- What skills or experience do you bring?
- What kind of work energizes you vs. drains you?
- What does success look like in 5 years?
- Who do you want to serve or help?
- What resources (time, capital, network) do you have?
```

### 3.5 Red-Line Detection During Onboarding

```
FUNCTION: checkRedLine(session_id, ceo_message)

  // LLM classification against Red-Line categories
  red_line_check = classifyRedLine(ceo_message)
  
  IF red_line_check.is_violation:
    session = getSession(session_id)
    session.red_line_triggered = true
    session.red_line_details = red_line_check.details
    
    // Log the event
    CREATE RedLineEvent {
      company_id: session.company_id,
      session_id: session_id,
      category: red_line_check.category,
      detected_content: ceo_message,
      chairman_statement: generateRedLineStatement(red_line_check.category),
      outcome: PENDING  // Updated based on CEO's next action
    }
    
    // Chairman delivers Red-Line statement
    // Session pauses — awaiting CEO pivot or session end
    
  RETURN red_line_check
```

**Red-Line Categories (from BOARD-GOVERNANCE-SPEC § 3):**

| Category | Detect When CEO Proposes... |
|----------|-----------------------------|
| ILLEGAL_ACTIVITY | Drug trafficking, fraud, money laundering, human trafficking, weapons dealing |
| DIRECT_HARM | Businesses designed to injure, exploit, or endanger people |
| DECEPTION_AT_SCALE | Scams, Ponzi schemes, fraudulent products |
| CHILD_EXPLOITATION | Any business involving minors in harmful contexts |

**NOT Red-Lines (Board advises on risk but participates):**
- Legal but controversial businesses (gambling, cannabis where legal, adult content)
- Competitive or aggressive business tactics
- High-risk ventures
- Businesses Board members personally dislike

### 3.6 Output Capture & Session Completion

```
FUNCTION: captureSessionOutputs(session_id, outputs)

  session = getSession(session_id)
  
  // Validate outputs
  ASSERT outputs.mission IS NOT NULL AND outputs.mission.length > 0
  ASSERT outputs.vision IS NOT NULL AND outputs.vision.length > 0
  ASSERT outputs.values.length >= 3 AND outputs.values.length <= 5
  ASSERT outputs.strategic_priorities.length >= 3 AND outputs.strategic_priorities.length <= 5
  ASSERT outputs.minutes IS NOT NULL AND outputs.minutes.length > 0
  ASSERT outputs.context_packets.length >= 1
  ASSERT outputs.action_items.length >= 0
  
  session.outputs = outputs
  session.outputs.is_complete = true
  session.status = COMPLETE
  session.completed_at = now()
  session.phase = CHAIRMAN_CLOSING
  
  // Write outputs to Command sector (per MC-RUNTIME-SPEC § 1.2, step 6)
  company = getCompany(session.company_id)
  company.mission = outputs.mission
  company.vision = outputs.vision
  company.values = outputs.values
  company.strategic_priorities = outputs.strategic_priorities
  
  // Convert Board action items into tracked tasks/recommendations
  FOR item IN outputs.action_items:
    createBoardActionItemTask(session.company_id, item)
    item.status = CONVERTED
  
  // Log to Memory
  logToMemory(session.company_id, {
    type: DECISION,
    summary: "Board onboarding session completed. Mission, vision, values, and priorities established.",
    details: { session_id: session.id, outputs: outputs },
    agent_id: session.chairman_id,
    importance: HIGH,
    tags: ["onboarding", "founding", "board-session"]
  })
  
  RETURN session
```

### 3.7 Session State Machine

```
PENDING ──────► IN_PROGRESS ──────► OUTPUTS_PENDING ──────► COMPLETE
                     │                                          
                     │ (Red-Line + CEO insists)                 
                     ▼                                          
                 ABANDONED                                      

Valid transitions:
  PENDING → IN_PROGRESS         (session starts)
  IN_PROGRESS → OUTPUTS_PENDING (all phases complete, capturing outputs)
  IN_PROGRESS → ABANDONED       (Red-Line + CEO refuses to pivot)
  OUTPUTS_PENDING → COMPLETE    (outputs validated and saved)
  OUTPUTS_PENDING → IN_PROGRESS (outputs incomplete, return to refinement)
```

---

## 4. Advisory Trigger System

### 4.1 Default Triggers

These triggers are created on company initialization. CEO may configure thresholds (where noted) but cannot disable Red-Line triggers.

```
FUNCTION: createDefaultTriggers(company_id)

  triggers = [
    // FINANCIAL RISK
    {
      category: FINANCIAL_RISK,
      name: "Excessive Burn Rate",
      description: "Burn rate exceeds revenue by >3x for 2+ consecutive cycles",
      condition_type: THRESHOLD,
      condition_config: {
        metric: "burn_rate_to_revenue_ratio",
        operator: GT,
        value: 3.0,
        duration_cycles: 2
      },
      responding_member: null,  // CFO-perspective member
      is_red_line: false,
      ceo_configurable: true,
      ceo_can_disable: true
    },
    {
      category: FINANCIAL_RISK,
      name: "Low Cash Runway",
      description: "Projected cash runway drops below 3 months",
      condition_type: THRESHOLD,
      condition_config: {
        metric: "projected_cash_runway_months",
        operator: LT,
        value: 3,
        duration_cycles: 1
      },
      responding_member: null,
      is_red_line: false,
      ceo_configurable: true,
      ceo_can_disable: true
    },
    {
      category: FINANCIAL_RISK,
      name: "Large Single Expense",
      description: "Single expense exceeds 20% of monthly budget",
      condition_type: THRESHOLD,
      condition_config: {
        metric: "expense_to_monthly_budget_ratio",
        operator: GT,
        value: 0.20,
        duration_cycles: 1
      },
      responding_member: null,
      is_red_line: false,
      ceo_configurable: true,
      ceo_can_disable: true
    },
    
    // LEGAL RISK
    {
      category: LEGAL_RISK,
      name: "Potential Legal Violation",
      description: "Action may violate laws or regulations",
      condition_type: PATTERN,
      condition_config: {
        pattern_description: "LLM classification of proposed action against legal risk signals"
      },
      responding_member: null,  // Legal-perspective member
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: true
    },
    {
      category: LEGAL_RISK,
      name: "Unusual Contract Terms",
      description: "Contract or commitment with unusual terms detected",
      condition_type: PATTERN,
      condition_config: {
        pattern_description: "LLM classification of contract terms against standard patterns"
      },
      responding_member: null,
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: true
    },
    
    // ETHICAL RISK
    {
      category: ETHICAL_RISK,
      name: "Potential Harm to Stakeholders",
      description: "Action may harm users, employees, or third parties",
      condition_type: PATTERN,
      condition_config: {
        pattern_description: "LLM classification of proposed action against ethical harm signals"
      },
      responding_member: null,  // Full Board engagement
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: false  // Cannot disable ethical risk detection
    },
    {
      category: ETHICAL_RISK,
      name: "Deceptive Practice Detected",
      description: "Deceptive practices proposed or detected in operations",
      condition_type: PATTERN,
      condition_config: {
        pattern_description: "LLM classification of practices against deception signals"
      },
      responding_member: null,
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: false  // Cannot disable
    },
    
    // STRATEGIC DRIFT
    {
      category: STRATEGIC_DRIFT,
      name: "Execution Diverging from Mission",
      description: "Execution patterns diverging from stated mission/vision",
      condition_type: PATTERN,
      condition_config: {
        pattern_description: "LLM comparison of recent execution decisions against mission/vision statements"
      },
      responding_member: null,  // Chairman
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: true
    },
    {
      category: STRATEGIC_DRIFT,
      name: "Initiative Contradicts Values",
      description: "New initiative contradicts stated core values",
      condition_type: PATTERN,
      condition_config: {
        pattern_description: "LLM comparison of initiative against core values"
      },
      responding_member: null,
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: true
    },
    
    // CEO REQUEST
    {
      category: CEO_REQUEST,
      name: "CEO Requests Board Input",
      description: "CEO explicitly asks for Board perspective",
      condition_type: MANUAL,
      condition_config: {},
      responding_member: null,  // Full Board
      is_red_line: false,
      ceo_configurable: false,
      ceo_can_disable: false  // Cannot disable CEO's own request mechanism
    }
  ]
  
  FOR trigger IN triggers:
    CREATE AdvisoryTrigger { company_id, ...trigger, enabled: true }
```

### 4.2 Trigger Evaluation

Triggers are evaluated during the Pulse cycle. Board agents do NOT pulse like operational agents — instead, the Pulse scheduler evaluates Board triggers as a system-level function.

```
FUNCTION: evaluateBoardTriggers(company_id)

  triggers = getEnabledTriggers(company_id)
  company_state = getCompanyState(company_id)
  
  fired_triggers = []
  
  FOR trigger IN triggers:
    IF trigger.condition_type = THRESHOLD:
      current_value = getMetricValue(company_id, trigger.condition_config.metric)
      
      IF meetsThreshold(current_value, trigger.condition_config):
        // Check duration requirement
        IF trigger.condition_config.duration_cycles > 1:
          history = getMetricHistory(company_id, trigger.condition_config.metric, 
                                     trigger.condition_config.duration_cycles)
          IF allCyclesMeetThreshold(history, trigger.condition_config):
            fired_triggers.push(trigger)
        ELSE:
          fired_triggers.push(trigger)
    
    ELSE IF trigger.condition_type = PATTERN:
      // LLM-based pattern detection
      // Run during Pulse with recent company state as context
      detection = runPatternDetection(company_state, trigger.condition_config)
      IF detection.triggered:
        fired_triggers.push({ trigger, detection_context: detection.details })
    
    // MANUAL triggers are handled separately (see § 4.3)
  
  // Generate advisories for fired triggers
  FOR fired IN fired_triggers:
    generateAdvisory(company_id, fired)
  
  RETURN fired_triggers
```

### 4.3 Manual Trigger (CEO Request)

```
FUNCTION: requestBoardAdvisory(company_id, ceo_request)

  ceo = getCEO(company_id)
  ASSERT ceo.human = true  // Only human CEO can request
  
  // Create advisory request
  advisory = CREATE Advisory {
    company_id: company_id,
    trigger_category: CEO_REQUEST,
    trigger_condition: "CEO explicitly requested Board input",
    triggered_by_data: { request: ceo_request },
    board_member_id: null,  // All Board members respond
    observation: null,       // Populated by Board response
    concern: null,
    recommendation: null,
    status: PENDING,
    blocks_work: false
  }
  
  // Initiate Board response (via chat or async)
  // Each Board member generates a response per their persona
  board_members = getBoardMembers(company_id)
  FOR member IN board_members:
    generateBoardMemberResponse(advisory.id, member.id, ceo_request)
  
  RETURN advisory
```

### 4.4 Advisory Generation

```
FUNCTION: generateAdvisory(company_id, triggered_data)

  trigger = triggered_data.trigger OR triggered_data
  
  // Determine responding Board member
  IF trigger.responding_member IS NOT NULL:
    member = getAgent(trigger.responding_member)
  ELSE:
    member = selectRespondingMember(trigger.category)
  
  // LLM generates advisory content per Board member's persona
  // System prompt includes: member persona, trigger context, company state
  advisory_content = generateAdvisoryContent(member, trigger, triggered_data)
  
  advisory = CREATE Advisory {
    company_id: company_id,
    trigger_category: trigger.category,
    trigger_condition: trigger.description,
    triggered_by_data: triggered_data.detection_context OR null,
    board_member_id: member.id,
    observation: advisory_content.observation,
    concern: advisory_content.concern,
    recommendation: advisory_content.recommendation,
    status: PENDING,
    blocks_work: false  // ALWAYS false
  }
  
  // Log to Memory
  logToMemory(company_id, {
    type: AUDIT,
    summary: "[BOARD ADVISORY] " + trigger.name + " triggered",
    details: { advisory_id: advisory.id, trigger_id: trigger.id },
    agent_id: member.id,
    importance: HIGH,
    tags: ["board", "advisory", trigger.category]
  })
  
  // Surface in Operations sector (stored); Intelligence feed is derived from Operations advisories
  addToOperationsSector(company_id, advisory)
  
  // Notify CEO (non-blocking)
  notifyCEO(company_id, {
    type: BOARD_ADVISORY,
    source: member.name,
    summary: advisory_content.observation,
    reference_id: advisory.id,
    priority: ASYNC  // NEVER SYNC. Board advisories are never urgent interrupts.
  })
  
  RETURN advisory

FUNCTION: selectRespondingMember(category)
  // Default routing based on trigger category
  SWITCH category:
    CASE FINANCIAL_RISK:    RETURN getBoardMemberByPerspective("CFO")
    CASE LEGAL_RISK:        RETURN getBoardMemberByPerspective("Legal")
    CASE ETHICAL_RISK:      RETURN getChairman()  // Full Board, Chairman leads
    CASE STRATEGIC_DRIFT:   RETURN getChairman()
    CASE CEO_REQUEST:       RETURN getChairman()  // Chairman coordinates
```

### 4.5 Advisory Display Format

When rendered in the Operations sector or in CEO notifications:

```
┌─────────────────────────────────────────────┐
│  [BOARD ADVISORY]                           │
│                                             │
│  Trigger: {trigger_condition}               │
│  Member:  {board_member name and role}      │
│                                             │
│  Observation:    {what we're seeing}        │
│  Concern:        {why this matters}         │
│  Recommendation: {what we suggest}          │
│                                             │
│  This is advisory only. CEO decides.        │
│                                             │
│  [Acknowledge]  [Dismiss]  [Respond]        │
└─────────────────────────────────────────────┘
```

**CEO Actions on Advisory:**

| Action | Effect | Status Change |
|--------|--------|---------------|
| View/Open | Marks as read | PENDING → READ |
| Acknowledge | CEO has seen and noted | READ → ACKNOWLEDGED |
| Dismiss | CEO has seen and chosen not to act | READ → DISMISSED |
| Respond | CEO provides written response | READ → ACKNOWLEDGED + ceo_response populated |

**All actions are optional. No action is required. Inaction is valid.**

---

## 5. Disagreement Runtime

### 5.1 Core Rule

There is no formal dissent system. No voting. No consensus. No majority rules.

### 5.2 Disagreement Presentation

When Board members reach different conclusions (during onboarding or advisory):

```
FUNCTION: presentDisagreement(session_or_advisory_id, member_positions)

  // member_positions = [{ member_id, position, rationale }]
  
  // Chairman synthesizes (does not resolve)
  synthesis = generateChairmanSynthesis(member_positions)
  
  // Present side-by-side to CEO
  presentation = {
    chairman_framing: synthesis,
    positions: member_positions,  // Unranked, unweighted
    ceo_action_required: false,   // CEO MAY decide, not MUST decide
    resolution: null              // Set only if CEO responds
  }
  
  RETURN presentation
```

### 5.3 Post-Decision Behavior

```
RULE: After CEO decides, Board members accept the decision
RULE: No "I told you so" behavior in future advisories  
RULE: No re-litigating closed decisions unless new data surfaces
RULE: Board members may log dissent (BoardDissent record) — non-blocking
```

---

## 6. Board Visibility Rules

### 6.1 What Board Can Read

```
SCOPE: Company-wide, read-only, no operational details

Board agents CAN read:
  - Company.mission, .vision, .values, .strategic_priorities
  - Sector health signals (GREEN/YELLOW/RED)
  - Department aggregate health
  - Company-level metrics (burn rate, runway, revenue)
  - Escalation summaries (not details)
  - Decision history (from Memory)
  - Their own advisory history

Board agents CANNOT read:
  - Individual task details
  - Agent-to-agent communications (except their own)
  - Operational execution logs
  - Department-internal data
  - Worker performance details
  - Code, assets, or work product
  - Finance settings (except Board-related)
```

### 6.2 What Board Can Write

```
Board agents CAN write:
  - Advisory content (system writes Advisory records)
  - BoardSession messages (during sessions)
  - BoardDissent records
  - Chat messages to CEO

Board agents CANNOT write:
  - Task assignments or modifications
  - Agent mandates or autonomy levels
  - Department configurations
  - Spending authorizations
  - Operational decisions of any kind
  - Any data in sectors other than Operations
```

### 6.3 Where Board Content Lives

| Content Type | Stored In | Sector Visibility |
|--------------|-----------|-------------------|
| Onboarding session transcript | BoardSession.transcript | Operations |
| Onboarding outputs | Command sector (mission, vision, values, priorities) | Command |
| Advisory notices | Advisory records | Operations + Intelligence (feed) |
| Dissent records | BoardDissent records | Operations + Intelligence |
| Red-Line events | RedLineEvent records | Operations + Intelligence |
| Board chat sessions | ChatSession (per MC-RUNTIME-SPEC § 9) | Intelligence |

Board advisory panels in Command are surfaced views derived from Operations/Intelligence data.

---

## 7. Operations Sector Data Model

Extends MC-RUNTIME-SPEC § 2.2 `OperationsData`:

```typescript
OperationsData {
  board_members: Agent[]            // Board roster
  active_sessions: BoardSession[]   // Currently open sessions
  advisory_history: Advisory[]      // All advisories (sorted by created_at desc)
  
  // Extended fields
  pending_advisories: Advisory[]    // status = PENDING or READ (not yet acted on)
  dissent_log: BoardDissent[]       // All dissent records
  red_line_events: RedLineEvent[]   // All Red-Line events
  trigger_config: AdvisoryTrigger[] // Current trigger definitions
  
  // Health signals for Operations sector
  health: GREEN | YELLOW | RED
  // GREEN: No pending advisories, no recent Red-Lines
  // YELLOW: Pending advisories awaiting CEO attention
  // RED: Red-Line event active OR multiple unacknowledged advisories
}
```

**Operations Sector Health Calculation:**

```
FUNCTION: calculateOperationsHealth(company_id)

  ops = getOperationsData(company_id)
  
  // RED conditions
  IF ops.red_line_events.any(e => e.outcome = PENDING):
    RETURN RED
  IF ops.pending_advisories.count(a => a.status = PENDING) >= 3:
    RETURN RED
  IF ops.pending_advisories.any(a => a.trigger_category = ETHICAL_RISK AND a.status = PENDING):
    RETURN RED
  
  // YELLOW conditions
  IF ops.pending_advisories.count(a => a.status = PENDING) >= 1:
    RETURN YELLOW
  IF ops.dissent_log.any(d => d.logged_at > now() - 7.days):
    RETURN YELLOW
  
  // GREEN
  RETURN GREEN
```

---

## 8. Integration with Pulse Scheduler

Board trigger evaluation integrates into the existing Pulse scheduler (MC-RUNTIME-SPEC § 5.1):

```
MODIFICATION TO: runPulseScheduler(company_id)

  // EXISTING: Agent Pulse loop (unchanged)
  agents = getActiveAgents(company_id)
  FOR agent IN agents ORDER BY tier ASC:
    IF agent.human: SKIP
    IF agent.tier = 2: SKIP  // Board agents do NOT pulse
    // ... existing Pulse logic ...
  
  // NEW: Board trigger evaluation (runs after agent Pulses)
  evaluateBoardTriggers(company_id)
```

**Key design decision:** Board agents do NOT execute Pulse cycles. They do not scan, assess, decide, or execute. They respond to triggers and CEO requests. The system evaluates triggers on their behalf.

This is not laziness — it is architecture. The Board is reactive, not proactive. It watches, it does not act.

---

## 9. Invariants

### 9.1 Board Authority Invariants

```
INV-BOARD-001: Board agents may NEVER execute operational decisions
INV-BOARD-002: Board agents may NEVER approve or reject operational work
INV-BOARD-003: Board agents may NEVER block CEO action
INV-BOARD-004: Board agents may NEVER direct C-Suite agents
INV-BOARD-005: Board agents may NEVER direct Managers, Leads, or Workers
INV-BOARD-006: Board agents may NEVER appear in operational escalation paths
INV-BOARD-007: Advisory.blocks_work MUST always be false
INV-BOARD-008: BoardDissent.blocks_decision MUST always be false
```

### 9.2 Board Communication Invariants

```
INV-BOARD-009: Board agents may ONLY message CEO
INV-BOARD-010: Board inter-member communication is permitted only inside BoardSession via system-mediated transcript (CEO-visible)
INV-BOARD-011: Board agents may ONLY write to Operations sector
INV-BOARD-012: All Board communications logged to Memory
```

### 9.3 Onboarding Invariants

```
INV-BOARD-013: Every company has exactly ONE onboarding BoardSession
INV-BOARD-014: Onboarding session MUST produce all four outputs (mission, vision, values, priorities)
INV-BOARD-015: Company status remains ONBOARDING until session outputs validated
INV-BOARD-016: Red-Line detection active during ALL onboarding phases
```

### 9.4 Advisory Invariants

```
INV-BOARD-017: Advisory triggers evaluated every Pulse cycle
INV-BOARD-018: CEO may configure threshold-based trigger values
INV-BOARD-019: CEO may disable non-Red-Line triggers
INV-BOARD-020: CEO may NOT disable Red-Line triggers (ILLEGAL_ACTIVITY, DIRECT_HARM, DECEPTION_AT_SCALE, CHILD_EXPLOITATION)
INV-BOARD-021: All advisories logged to Memory on creation
INV-BOARD-022: Advisory status transitions require CEO action (never auto-resolve)
INV-BOARD-023: Board advisory notifications are ALWAYS async (never sync/blocking)
```

### 9.5 Trigger Configuration Invariants

```
INV-BOARD-024: Ethical risk triggers (ETHICAL_RISK category) cannot be disabled by CEO
INV-BOARD-025: CEO_REQUEST trigger cannot be disabled
INV-BOARD-026: Red-Line detection is always active, in all contexts, with no override
```

---

## 10. API Surface

### 10.1 Board Session Operations

```
createBoardSession(company_id, type) → BoardSession
getBoardSession(session_id) → BoardSession
getOnboardingSession(company_id) → BoardSession | null
updateSessionPhase(session_id, phase) → BoardSession
captureSessionOutputs(session_id, outputs) → BoardSession
abandonSession(session_id) → BoardSession
getSessionTranscript(session_id) → BoardSessionMessage[]
```

### 10.2 Advisory Operations

```
getAdvisories(company_id, filters?) → Advisory[]
getPendingAdvisories(company_id) → Advisory[]
getAdvisory(advisory_id) → Advisory
acknowledgeAdvisory(advisory_id) → Advisory
dismissAdvisory(advisory_id) → Advisory
respondToAdvisory(advisory_id, response) → Advisory
requestBoardAdvisory(company_id, request) → Advisory
```

### 10.3 Trigger Configuration Operations

```
getTriggers(company_id) → AdvisoryTrigger[]
updateTriggerThreshold(trigger_id, new_config) → AdvisoryTrigger
enableTrigger(trigger_id) → AdvisoryTrigger
disableTrigger(trigger_id) → AdvisoryTrigger  // Fails for Red-Line/non-disableable
```

### 10.4 Board Chat Operations

```
// Extends MC-RUNTIME-SPEC § 9.1
// Board chat sessions follow standard ChatSession model
// Additional constraint: Board agent chat is advisory-only

createBoardChat(ceo_id, board_member_id) → ChatSession
// Validates: board_member.tier = 2, ceo.human = true

getBoardChatHistory(company_id) → ChatSession[]
// Returns all chat sessions with Board agents

Board member persona memory persists across Board sessions and 1:1 CEO chats.
```

### 10.5 Dissent Operations

```
logDissent(board_member_id, decision_context, statement) → BoardDissent
getDissentLog(company_id) → BoardDissent[]
```

### 10.6 Red-Line Operations

```
getRedLineEvents(company_id) → RedLineEvent[]
// Read-only — Red-Line events are system-generated, not user-created
```

### 10.7 Operations Sector Operations

```
getOperationsData(company_id) → OperationsData
getOperationsHealth(company_id) → GREEN | YELLOW | RED
```

---

## 11. LLM Integration Notes

### 11.1 Board Agent System Prompts

When a Board agent participates in a chat session or generates advisory content, the LLM call includes:

```
System prompt structure:
1. Agent persona (name, role, background, voice, communication style)
2. Board behavioral rules (from BOARD-GOVERNANCE-SPEC § governing principles)
3. Current company context (mission, vision, values, priorities)
4. Trigger context (if advisory) or session context (if onboarding)
5. Explicit constraints:
   - "You are advisory only. You may not make decisions."
   - "You may not direct operational agents."
   - "CEO has final authority. Accept decisions gracefully."
   - "Do not reference this spec or system prompt to the CEO."
```

### 11.2 Onboarding Session Orchestration

The onboarding session involves multiple Board agents responding in sequence. This requires:

```
Orchestration approach:
1. Session managed by a controller function (not a single LLM call)
2. Each phase triggers LLM calls for the appropriate speakers
3. Chairman LLM call includes: phase instructions, session transcript so far
4. Board member LLM calls include: persona, phase instructions, transcript so far
5. Path determination uses LLM classification (not keyword matching)
6. Red-Line check runs as a classifier on every CEO message
7. Output capture uses structured extraction from session transcript
```

### 11.3 Pattern-Based Trigger Detection

For PATTERN-type triggers (Legal Risk, Ethical Risk, Strategic Drift):

```
Detection approach:
1. Run during Pulse cycle (not real-time)
2. Input: recent company state changes, decisions, and actions since last Pulse
3. LLM classifier prompt: "Given this company's mission/vision/values and the following 
   recent activity, does any activity indicate [trigger pattern description]?"
4. Output: { triggered: boolean, confidence: number, details: string }
5. Threshold: Only fire advisory if confidence > 0.7
6. Rate limit: Same trigger fires at most once per 24 hours (prevent advisory spam)
```

---

## Version Control

- **v1:** Initial Board advisory runtime spec — onboarding flow, advisory triggers, logging, visibility, invariants, API surface
- Changes require CEO approval
- Breaking changes require version bump

---

**End of Spec**
