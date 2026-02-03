# Mission Control Cockpit & Zoom Execution Spec v1

**Status:** DRAFT  
**Owner:** Avery James (UI/UX Designer)  
**Created:** 2026-02-02  
**Linear Issue:** BSL-290  

---

## Purpose

Execution-grade specification for Mission Control's cockpit layout and zoom interaction mechanics. Claude Code should be able to render a functional cockpit and implement zoom navigation directly from this document.

**This is NOT a vision document.** No prose. No philosophy. Just deterministic rules.

**Dependencies:**
- `VISION.md` (LOCKED) — conceptual zoom model, sector definitions, authority principles
- `MC-RUNTIME-SPEC-v1.md` (LOCKED) — runtime objects (Sector, Agent, Task, Escalation, etc.)

---

## 1. Cockpit Layout Structure

### 1.1 Layout Type

**Decision:** Spatial dashboard layout (NOT grid, NOT radial)

| Property | Value |
|----------|-------|
| Layout style | Flexible spatial arrangement |
| Sector count | 6 (fixed) |
| Sector sizing | Unequal (variable by content importance) |
| Center gravity | Organization sector (top-center) |
| Aesthetic | Dense executive analytics dashboard |

### 1.2 Sector Arrangement

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           COCKPIT VIEWPORT                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌───────────────┐   ┌───────────────────┐   ┌───────────────────┐     │
│   │               │   │                   │   │                   │     │
│   │    COMMAND    │   │   Organization    │   │  Customers        │     │
│   │  (CEO Intent) │   │  (region title;   │   │  Growth           │     │
│   │   [medium]    │   │   dept tiles      │   │  Product &        │     │
│   │               │   │   shown directly, │   │   Delivery        │     │
│   │               │   │   no container)   │   │  People           │     │
│   └───────────────┘   │     [medium]      │   │     [medium]      │     │
│                       └───────────────────┘   └───────────────────┘     │
│                                                                         │
│   ┌─────────┐   ┌─────────────────────────────────┐   ┌─────────────┐   │
│   │         │   │                                 │   │             │   │
│   │OPERATIONS│   │        METRICS & HEALTH         │   │ INTELLIGENCE│   │
│   │         │   │                                 │   │             │   │
│   │ [small] │   │            [large]              │   │   [small]   │   │
│   │         │   │                                 │   │             │   │
│   └─────────┘   └─────────────────────────────────┘   └─────────────┘   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                 FINANCE SETTINGS [collapsed bar]                 │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Note:** This is a conceptual arrangement. Exact pixel positions are implementation-flexible, but relative sizing and Organization's top-center position MUST be preserved. Command occupies top-left; Metrics & Health occupies the large bottom-center region.

### 1.3 Sector Definitions

| Sector | Type Constant | Default Size | Position Hint | Content Domain |
|--------|---------------|--------------|---------------|----------------|
| Command | `COMMAND` | Medium | Top-left | CEO intent, priorities, pending decisions, overrides, Board advisory panel |
| Organization | `ORGANIZATION` | Medium | Top-center | Region title ("Organization"); department tiles shown directly, no outer container |
| Operations | `OPERATIONS` | Small | Bottom-left | Board advisory records (stored), operational oversight |
| Metrics | `METRICS` | Large | Bottom-center | Goals, metrics, health signals, attention items |
| Intelligence | `INTELLIGENCE` | Small | Bottom-right | Decisions, audit logs, knowledge base, advisory feed |
| Finance | `FINANCE` | Collapsed | Bottom bar | Platform settings, cadence, cost controls |

**Top-right region (medium):** Displays four business-category tiles — **Customers**, **Growth**, **Product & Delivery**, **People**. These tiles provide an at-a-glance view of key operational dimensions at L1.

### 1.4 Sector Size Classes

```typescript
SectorSizeClass = 'large' | 'medium' | 'small' | 'collapsed'

SectorSizeConfig {
  large: {
    min_width: 400px
    min_height: 300px
    flex_grow: 2
  }
  medium: {
    min_width: 300px
    min_height: 200px
    flex_grow: 1
  }
  small: {
    min_width: 250px
    min_height: 150px
    flex_grow: 0.5
  }
  collapsed: {
    min_width: full_viewport_width
    min_height: 48px
    expanded_height: 400px
  }
}
```

### 1.5 Responsive Behavior

| Viewport Width | Behavior |
|----------------|----------|
| ≥ 1440px | Full 6-sector layout as shown |
| 1024–1439px | Stack to 2 columns, Command spans full width |
| 768–1023px | Single column, scroll vertical |
| < 768px | Not supported (desktop-first) |

---

## 2. Zoom State Model

### 2.1 Zoom State Object

Zoom state is UI-owned. Runtime objects do NOT store zoom; they react to it.

```typescript
ZoomState {
  // Current position
  current_level: 1 | 2 | 3 | 4  // L1=Global View, L2=Sector, L3=Detail, L4+=Deep
  current_sector: SectorType | null  // null at L1
  current_target: UUID | null  // ID of focused element (agent, dept, task, etc.)
  
  // Navigation history (breadcrumb stack)
  zoom_stack: ZoomStackEntry[]
  
  // Transition state
  is_transitioning: boolean
  transition_direction: 'in' | 'out' | null
}

ZoomStackEntry {
  level: number
  sector: SectorType | null
  target_id: UUID | null
  target_type: string | null  // 'department', 'agent', 'task', etc.
  label: string  // Human-readable breadcrumb text
}
```

### 2.2 Initial State

On cockpit load:

```typescript
ZoomState {
  current_level: 1
  current_sector: null
  current_target: null
  zoom_stack: [
    { level: 1, sector: null, target_id: null, target_type: null, label: 'Cockpit' }
  ]
  is_transitioning: false
  transition_direction: null
}
```

### 2.3 Zoom Stack Rules

```
RULE: zoom_stack[0] is always L1 ('Cockpit')
RULE: zoom_stack.length = current_level
RULE: Zoom in → push to stack
RULE: Zoom out → pop from stack
RULE: Direct navigation → rebuild stack to target
RULE: Max stack depth = 10 (safety limit)
```

### 2.4 State Mutations

```typescript
// Zoom In
function zoomIn(sector: SectorType, target_id?: UUID, target_type?: string, label?: string) {
  if (zoom_state.is_transitioning) return  // Block during transition
  
  const new_level = zoom_state.current_level + 1
  if (new_level > 10) return  // Max depth
  
  zoom_state.is_transitioning = true
  zoom_state.transition_direction = 'in'
  
  zoom_state.zoom_stack.push({
    level: new_level,
    sector: sector,
    target_id: target_id ?? null,
    target_type: target_type ?? null,
    label: label ?? sector
  })
  
  zoom_state.current_level = new_level
  zoom_state.current_sector = sector
  zoom_state.current_target = target_id ?? null
  
  // Transition completes via animation callback
}

// Zoom Out
function zoomOut() {
  if (zoom_state.is_transitioning) return
  if (zoom_state.current_level <= 1) return  // Can't zoom out from L1
  
  zoom_state.is_transitioning = true
  zoom_state.transition_direction = 'out'
  
  zoom_state.zoom_stack.pop()
  const previous = zoom_state.zoom_stack[zoom_state.zoom_stack.length - 1]
  
  zoom_state.current_level = previous.level
  zoom_state.current_sector = previous.sector
  zoom_state.current_target = previous.target_id
}

// Jump to specific stack entry (breadcrumb click)
function zoomTo(stack_index: number) {
  if (zoom_state.is_transitioning) return
  if (stack_index < 0 || stack_index >= zoom_state.zoom_stack.length) return
  
  zoom_state.is_transitioning = true
  zoom_state.transition_direction = stack_index < zoom_state.current_level - 1 ? 'out' : 'in'
  
  // Trim stack to target
  zoom_state.zoom_stack = zoom_state.zoom_stack.slice(0, stack_index + 1)
  const target = zoom_state.zoom_stack[stack_index]
  
  zoom_state.current_level = target.level
  zoom_state.current_sector = target.sector
  zoom_state.current_target = target.target_id
}
```

---

## 3. Zoom Level Definitions

### 3.1 Level Summary

| Level | Name | Scope | Visibility | Controllability |
|-------|------|-------|------------|-----------------|
| L1 | Global View | Full cockpit | All 6 sectors, summary data | Navigation only |
| L2 | Sector View | Single sector | Expanded sector, sub-areas visible | Sector-scoped actions |
| L3 | Detail View | Single element | Full element detail | Full element control |
| L4+ | Deep Dive | Nested element | Child elements | Child element control |

### 3.2 L1: Global View (Cockpit)

**What's visible:**
- All 6 sector panels simultaneously
- 4–8 live data elements per sector (real metrics, not placeholders)
- Health indicators (GREEN/YELLOW/RED) per sector
- Attention badges (count of items needing attention)
- Sector labels

**What's controllable:**
- Click sector → zoom to L2
- Global controls: emergency kill switches in Command (exception to zoom-control rule)
- Nothing else

**L1 Sector Content Pattern:**

```typescript
L1SectorContent {
  header: {
    label: string
    health_indicator: 'green' | 'yellow' | 'red'
    attention_count: number | null
  }
  data_elements: L1DataElement[]  // 4–8 elements
}

L1DataElement = 
  | { type: 'metric', label: string, value: string | number, trend?: 'up' | 'down' | 'flat' }
  | { type: 'chart_mini', label: string, data: number[], chart_type: 'line' | 'bar' | 'sparkline' }
  | { type: 'status_list', label: string, items: { text: string, status: string }[] }
  | { type: 'count_badge', label: string, count: number, severity?: 'normal' | 'warning' | 'critical' }
  | { type: 'avatar_row', label: string, avatars: { id: string, name: string, status: string }[] }
  | { type: 'priority_list', label: string, items: { rank: number, text: string }[] }
```

### 3.3 L2: Sector View

**What's visible:**
- Single sector fills viewport (others hidden or minimized)
- Sector sub-areas (e.g., departments within Organization)
- Expanded summaries for each sub-area
- Health signals with detail
- Breadcrumb: `Cockpit > [Sector]`

**What's controllable:**
- Click sub-area → zoom to L3
- Sector-scoped actions:
  - Acknowledge alerts
  - Mark items as reviewed
  - Quick status toggles
  - Expand/collapse sub-sections
- Zoom out (Escape or back button)

**L2 Sector Content Pattern:**

```typescript
L2SectorContent {
  header: {
    label: string
    subtitle: string | null
    health_indicator: 'green' | 'yellow' | 'red'
    health_detail: string
  }
  summary_cards: L2SummaryCard[]
  sub_areas: L2SubArea[]
  sector_actions: L2Action[]  // Scoped actions available at this level
}

L2SummaryCard {
  label: string
  value: string | number
  detail: string | null
  chart_data?: number[]
}

L2SubArea {
  id: UUID
  type: string  // 'department', 'board_member', 'goal', etc.
  label: string
  health: 'green' | 'yellow' | 'red'
  summary: string
  attention_count: number
  clickable: true  // Always clickable to zoom to L3
}

L2Action {
  id: string
  label: string
  action_type: 'acknowledge' | 'toggle' | 'quick_action'
  target_id: UUID | null
  requires_confirmation: boolean
}
```

### 3.4 L3: Detail View

**What's visible:**
- Single element fills viewport (department, agent, task, etc.)
- Full detail panel with all attributes
- Related items list
- Action history / timeline
- Chat interface (if agent-type element)
- Breadcrumb: `Cockpit > [Sector] > [Element]`

**What's controllable:**
- Full element control:
  - Edit properties
  - Change status
  - Assign/reassign
  - Create sub-items
  - Initiate chat (for agents)
  - Resolve escalations
  - Execute actions within element scope
- Click nested item → zoom to L4
- Zoom out

**L3 Element Content Pattern:**

```typescript
L3ElementContent {
  header: {
    type: string  // 'department', 'agent', 'task', 'escalation', etc.
    id: UUID
    title: string
    subtitle: string | null
    status: string
    health: 'green' | 'yellow' | 'red' | null
  }
  
  // Type-specific detail sections
  detail_sections: L3DetailSection[]
  
  // Related items (clickable to L4)
  related_items: L3RelatedItem[]
  
  // Timeline / activity feed
  activity: L3ActivityEntry[]
  
  // Available actions at this level
  actions: L3Action[]
  
  // Chat interface (agents only)
  chat_enabled: boolean
  chat_session_id: UUID | null
}

L3DetailSection {
  label: string
  content_type: 'key_value' | 'text' | 'list' | 'chart' | 'custom'
  data: object
}

L3RelatedItem {
  id: UUID
  type: string
  label: string
  status: string | null
  clickable: true
}

L3Action {
  id: string
  label: string
  action_type: string
  dangerous: boolean  // Requires confirmation if true
  disabled: boolean
  disabled_reason: string | null
}
```

### 3.5 L4+: Deep Dive (Fractal Depth)

L4 and beyond follow the same structural pattern as L3. Each level represents drilling into a child element.

**Invariant:** Every level maintains the same DNA:
- Header with type, title, status
- Detail sections
- Related items (clickable to next level)
- Activity feed
- Contextual actions
- Zoom out capability

**Max depth:** 10 levels (safety limit, not expected to be reached)

---

## 4. Visibility vs. Controllability Matrix

### 4.1 Core Rule

```
RULE: Status bubbles up. Control requires descent.
```

At any zoom level, you can SEE summary information from levels below, but you can only CONTROL elements at your current level or by zooming deeper.

### 4.2 Full Matrix

| Data Type | L1 (Global View) | L2 (Sector) | L3 (Detail) | L4+ (Deep) |
|-----------|---------------|-------------|-------------|------------|
| **Sector health** | See | See + Acknowledge | See | — |
| **Sub-area list** | See (count only) | See (full list) | — | — |
| **Element summary** | — | See | See | See |
| **Element properties** | — | — | See + Edit | See + Edit |
| **Element status** | — | — | See + Change | See + Change |
| **Element actions** | — | — | Execute | Execute |
| **Child items** | — | — | See (list) | See + Control |
| **Chat with agent** | — | — | Initiate | Continue |
| **Activity history** | — | — | See | See |

### 4.3 Exception: Emergency Controls

Command sector at L1 may expose emergency kill switches that violate the zoom-control rule. These are:
- Pause all AI activity
- Request Board Advisory (non-blocking, advisory-only)
- System-wide override

These controls require double-confirmation regardless of zoom level.

---

## 5. Interaction Mechanics

### 5.1 Zoom Triggers

| Input | Zoom Level | Action |
|-------|------------|--------|
| Click sector panel | L1 | Zoom to L2 (that sector) |
| Click sub-area | L2 | Zoom to L3 (that element) |
| Click related item | L3 | Zoom to L4 (that child) |
| Click nested child | L4+ | Zoom deeper |
| Press `Escape` | Any > L1 | Zoom out one level |
| Click background | L2+ | Zoom out one level |
| Click breadcrumb | Any | Jump to that level |
| Keyboard `[` | Any > L1 | Zoom out one level |
| Keyboard `]` | L1–L3 | Zoom in (if single valid target) |

### 5.2 Transition Animation

```typescript
ZoomTransition {
  duration_ms: 300
  easing: 'ease-out'
  
  zoom_in: {
    // Target element scales up from its position
    // Other elements fade out
    // New content fades in
  }
  
  zoom_out: {
    // Current content scales down toward origin position
    // Parent level fades in
    // Landing element highlighted briefly
  }
}
```

**Constraints:**
- Block all input during transition
- Cancel transition if user rapidly presses Escape (snap to target state)
- No transition if programmatic navigation (instant)

### 5.3 Breadcrumb Rendering

```typescript
Breadcrumb {
  items: BreadcrumbItem[]
  max_visible: 4  // Show first + last 3 if longer
  overflow_behavior: 'ellipsis'  // [Cockpit] > ... > [Parent] > [Current]
}

BreadcrumbItem {
  label: string
  level: number
  clickable: boolean  // All except current are clickable
  is_current: boolean
}
```

Render pattern: `Cockpit > Sector > Element > Child`

### 5.4 Snap-to-Level Behavior

Zoom is conceptually continuous but snaps to discrete levels for usability.

```
RULE: Zoom always lands on a defined level (L1, L2, L3, L4+)
RULE: No intermediate states are visible to user
RULE: Animation may pass through intermediate visual states but state always discrete
```

### 5.5 Camera-Based Zoom with Staged Detail Reveal

This section defines the visual continuity model for zoom transitions. Zoom is not "switching views"—it is approaching the same surface.

**Core Principle:**
```
Zoom = spatial continuity + progressive disclosure
Never teleport. Never hard-swap screens.
```

**Phase 1: Camera Zoom (during motion)**

| Behavior | Requirement |
|----------|-------------|
| Visual continuity | Same pixels persist; layout scales and recenters toward target |
| No content swap | L1 content remains visible throughout the zoom motion |
| No new controls | No panels, buttons, or affordances appear during motion |
| Feel | Literal camera approaching a surface |

**Phase 2: Detail Reveal (after motion settles)**

| Behavior | Requirement |
|----------|-------------|
| Timing | Begins after zoom animation completes (~300ms) |
| Trigger | Auto-reveal after short delay (100–200ms) OR subtle affordance appears |
| Reveal style | Fade / slide / expand—detail layers IN, not replaces |
| L2/L3 content | Appears as overlay/expansion on stable base, not full reflow |

**Constraints:**

```
CONSTRAINT: Base layout remains stable across zoom levels
CONSTRAINT: Detail layers are overlays/expansions, not full reflows
CONSTRAINT: Zoom-out reverses the sequence (details collapse, then camera pulls back)
```

**Implementation Flexibility:**

First implementation should prioritize *feel* over perfection:
- Camera zoom can be a simple scale transform centered on target
- Detail reveal can be a single fade-in of the L2/L3 panel
- Refinements (parallax, staggered reveals, spring physics) can come later

The goal is spatial continuity—the user should feel they are moving through a single environment, not clicking between screens.

---

## 6. Sector-Specific L1 Content

This section defines the 4–8 live data elements shown per sector at L1 (Global View).

### 6.1 Command Sector (L1)

```typescript
CommandL1Content {
  data_elements: [
    { type: 'priority_list', label: 'Active Priorities', items: top_3_priorities },
    { type: 'count_badge', label: 'Pending Decisions', count: pending_decisions_count, severity: based_on_count },
    { type: 'metric', label: 'Board Status', value: 'X sessions / Y advisories' },
    { type: 'count_badge', label: 'Active Overrides', count: override_count },
  ]
}
```

### 6.2 Operations Sector (L1)

```typescript
OperationsL1Content {
  data_elements: [
    { type: 'avatar_row', label: 'Board', avatars: board_members_with_status },
    { type: 'metric', label: 'Open Advisories', value: advisory_count },
    { type: 'status_list', label: 'Recent Sessions', items: last_2_sessions_summary },
    { type: 'metric', label: 'Operations Health', value: health_label, trend: trend_direction },
  ]
}
```

### 6.3 Organization Region (L1)

The Organization region at top-center displays as a region title ("Organization") with department tiles shown directly in the region. There is no visible outer container box wrapping the tiles.

```typescript
OrganizationL1Content {
  // Region title shown above department tiles (no enclosing container)
  region_title: 'Organization'
  show_container_box: false

  data_elements: [
    { type: 'avatar_row', label: 'C-Suite', avatars: chiefs_with_status },
    { type: 'metric', label: 'Total Headcount', value: total_agent_count },
    { type: 'count_badge', label: 'Active Blockers', count: blocker_count, severity: based_on_count },
    { type: 'chart_mini', label: 'Staffing Trend', data: headcount_over_time, chart_type: 'sparkline' },
    { type: 'metric', label: 'Departments', value: 'X active / Y total' },
  ]
}
```

### 6.3.1 Business-Category Tiles (L1 — Top-Right)

Adjacent to the Organization region, the top-right area displays four business-category tiles. These tiles provide an at-a-glance summary of key operational dimensions.

```typescript
BusinessCategoryTiles {
  tiles: [
    { label: 'Customers', health: 'green' | 'yellow' | 'red', summary_stat: string },
    { label: 'Growth', health: 'green' | 'yellow' | 'red', summary_stat: string },
    { label: 'Product & Delivery', health: 'green' | 'yellow' | 'red', summary_stat: string },
    { label: 'People', health: 'green' | 'yellow' | 'red', summary_stat: string },
  ]
}
```

### 6.4 Metrics & Health Region (L1 — Large, Bottom-Center)

The Metrics & Health region occupies the large bottom-center position. It is the primary data-dense region at L1, providing the CEO with financial health, goals, and operational metrics in one consolidated view.

```typescript
MetricsHealthL1Content {
  data_elements: [
    { type: 'metric', label: 'North Star', value: primary_metric_value, trend: trend },
    { type: 'chart_mini', label: 'Goal Progress', data: goal_completion_percentages, chart_type: 'bar' },
    { type: 'count_badge', label: 'Attention Items', count: attention_count, severity: based_on_severity },
    { type: 'metric', label: 'Health', value: aggregate_health_label },
    { type: 'status_list', label: 'Key Metrics', items: top_3_metrics_with_status },
    { type: 'metric', label: 'Burn Rate', value: monthly_burn, trend: trend },
    { type: 'metric', label: 'Runway', value: runway_months + ' months' },
    { type: 'chart_mini', label: 'Spend', data: spend_over_time, chart_type: 'line' },
  ]
}
```

### 6.5 Finance Sector (L1 — Collapsed Bar)

Finance renders as a collapsed settings bar at the bottom of the viewport. Key financial metrics (Burn Rate, Runway, Spend) are surfaced in the Metrics & Health region (see 6.4). The Finance sector at L1 provides quick-glance platform settings only.

### 6.6 Intelligence Sector (L1)

```typescript
IntelligenceL1Content {
  data_elements: [
    { type: 'metric', label: 'Decisions Logged', value: decision_count },
    { type: 'metric', label: 'Knowledge Entries', value: knowledge_count },
    { type: 'status_list', label: 'Recent Activity', items: last_3_memory_entries },
  ]
}
```

### 6.7 Finance Settings Bar (L1 — Collapsed)

The Finance sector's sole L1 representation. When collapsed, shows only:

```typescript
FinanceSettingsBar {
  label: 'Finance Settings'
  expand_icon: true
  quick_stats: 'Pulse: 15min | Integrations: X active | Budget: X%'
}
```

---

## 7. Runtime Object Mapping

Zoom state drives which runtime objects are queried and displayed.

### 7.1 Object Resolution by Zoom Level

| Zoom Level | Primary Query | Secondary Queries |
|------------|---------------|-------------------|
| L1 | All Sectors (summary) | Aggregate counts, health signals |
| L2 (ORGANIZATION) | Sector + All Departments | Agent counts, blocker counts per dept |
| L2 (COMMAND) | Sector + Pending Decisions | Active priorities, overrides |
| L2 (OPERATIONS) | Sector + Board Agents | Advisory sessions, recommendations |
| L2 (METRICS) | Sector + Goals | Metrics, health signals, attention items |
| L2 (FINANCE) | Sector + Budget data | Spend tracking, burn calculations |
| L2 (INTELLIGENCE) | Sector + Recent entries | Decision log, audit log |
| L3 (Department) | Department + Agents | Tasks, escalations, projects |
| L3 (Agent) | Agent + Tasks | Inbox, performance, history |
| L3 (Task) | Task + Subtasks | Blockers, related items |
| L3 (Escalation) | Escalation | Related task, related agent |
| L4+ | Child object | Grandchildren |

### 7.2 Data Subscription Pattern

```typescript
// Subscribe to data based on current zoom state
function subscribeToZoomLevel(zoom_state: ZoomState) {
  unsubscribeAll()  // Clear previous subscriptions
  
  switch (zoom_state.current_level) {
    case 1:
      subscribe('sectors', { company_id })
      subscribe('aggregate_health', { company_id })
      subscribe('pending_escalations', { to_agent_id: ceo_id, count_only: true })
      break
      
    case 2:
      subscribe('sector', { sector_type: zoom_state.current_sector })
      subscribe('sector_children', { sector_type: zoom_state.current_sector })
      break
      
    case 3:
    case 4:
    default:
      subscribe('element', { id: zoom_state.current_target })
      subscribe('element_children', { parent_id: zoom_state.current_target })
      subscribe('element_activity', { target_id: zoom_state.current_target })
      break
  }
}
```

---

## 8. Invariants

These rules MUST hold at all times. Violations are UI bugs.

### 8.1 Zoom State Invariants

```
INV-ZOOM-001: zoom_stack.length = current_level
INV-ZOOM-002: zoom_stack[0].level = 1 AND zoom_stack[0].sector = null
INV-ZOOM-003: current_level >= 1 AND current_level <= 10
INV-ZOOM-004: is_transitioning = true blocks all zoom mutations
INV-ZOOM-005: current_sector = null IFF current_level = 1
INV-ZOOM-006: current_target = null IFF current_level <= 1
```

### 8.2 Visibility Invariants

```
INV-VIS-001: L1 shows all 6 sectors simultaneously
INV-VIS-002: L2+ shows only current sector/element (others hidden)
INV-VIS-003: Breadcrumb visible at L2+
INV-VIS-004: Health indicators visible at all levels
INV-VIS-005: No placeholder or fake data in any view
```

### 8.3 Control Invariants

```
INV-CTRL-001: No element mutation controls visible at L1 (except emergency)
INV-CTRL-002: Sector-scoped actions appear at L2
INV-CTRL-003: Element mutation controls appear at L3+
INV-CTRL-004: Chat interface appears only at L3+ for Agent-type elements
INV-CTRL-005: Dangerous actions require confirmation at any level
```

### 8.4 Layout Invariants

```
INV-LAYOUT-001: Metrics & Health region has largest allocation at L1 (bottom-center, large)
INV-LAYOUT-002: Finance sector renders as collapsed settings bar at L1 (no standalone panel)
INV-LAYOUT-003: Sector arrangement stable (no dynamic reordering)
INV-LAYOUT-004: Viewport < 768px shows "Desktop required" message
INV-LAYOUT-005: Organization region displays as title + department tiles with no outer container box
INV-LAYOUT-006: Top-right region displays four business-category tiles (Customers, Growth, Product & Delivery, People)
```

### 8.5 Zoom Continuity Invariants

```
INV-CONT-001: Base layout persists visually during zoom motion (no hard swap)
INV-CONT-002: No new controls or panels appear during zoom animation
INV-CONT-003: Detail content reveals AFTER zoom motion completes
INV-CONT-004: Detail layers are overlays/expansions, not full layout reflows
```

---

## 9. API Surface (UI Layer)

### 9.1 Zoom Operations

```typescript
// Navigation
zoomIn(sector: SectorType, target_id?: UUID, target_type?: string, label?: string): void
zoomOut(): void
zoomTo(stack_index: number): void
zoomToElement(sector: SectorType, element_id: UUID, element_type: string): void  // Direct navigation

// State queries
getZoomState(): ZoomState
getCurrentLevel(): number
getCurrentSector(): SectorType | null
getCurrentTarget(): UUID | null
getBreadcrumbs(): BreadcrumbItem[]
isTransitioning(): boolean

// Events
onZoomChange(callback: (state: ZoomState) => void): Unsubscribe
onTransitionStart(callback: (direction: 'in' | 'out') => void): Unsubscribe
onTransitionComplete(callback: () => void): Unsubscribe
```

### 9.2 Content Queries

```typescript
// L1 content
getL1SectorContent(sector: SectorType): L1SectorContent
getAllL1Content(): Map<SectorType, L1SectorContent>

// L2 content
getL2SectorContent(sector: SectorType): L2SectorContent
getL2SubAreas(sector: SectorType): L2SubArea[]

// L3+ content
getL3ElementContent(element_id: UUID, element_type: string): L3ElementContent
getElementChildren(element_id: UUID): L3RelatedItem[]
getElementActivity(element_id: UUID, limit?: number): L3ActivityEntry[]

// Actions
getAvailableActions(level: number, context: ZoomState): Action[]
executeAction(action_id: string, params?: object): Promise<ActionResult>
```

### 9.3 Subscription Management

```typescript
subscribeToLevel(level: number, sector?: SectorType, target?: UUID): Subscription
unsubscribeAll(): void
refreshCurrentLevel(): void
```

---

## 10. Implementation Notes

### 10.1 State Management

Zoom state should be managed via a global state container (Provider, Riverpod, BLoC, etc.). It must be:
- Singleton per cockpit instance
- Persisted to local storage for session continuity
- Synchronized with URL for deep linking (optional)

### 10.2 Animation Framework

Use the platform's animation system with these constraints:
- All zoom transitions use same duration (300ms)
- Easing: ease-out for zoom-in, ease-in for zoom-out
- Interruptible: Escape cancels and snaps to target

### 10.3 Data Fetching Strategy

- L1: Fetch all sector summaries on cockpit load (parallel)
- L2: Fetch sector detail on zoom (lazy)
- L3+: Fetch element detail on zoom (lazy)
- Subscriptions: Establish on zoom, teardown on zoom-out

### 10.4 Accessibility

- All interactive elements keyboard-navigable
- Focus management on zoom transitions
- Screen reader announcements for level changes
- High contrast mode support for health indicators

---

## Version Control

- **v1:** Initial cockpit & zoom execution spec
- Changes require designer (Avery) + CEO approval
- Breaking changes require version bump

---

**End of Spec**
