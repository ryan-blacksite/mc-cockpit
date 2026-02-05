/**
 * Purpose: Core type definitions for Mission Control cockpit data layer.
 * Owns: All shared TypeScript interfaces used by DataProvider, components, and screens.
 * Notes: Sector type constants match conventions.md S-2. Display labels match zoom spec v1 section 1.3.
 */

// _______________________________________________
//               SECTOR TYPES (S-2)
// _______________________________________________
// The 6 fixed sectors per conventions.md. These are canonical type constants.

export type SectorType =
  | 'COMMAND'
  | 'ORGANIZATION'
  | 'OPERATIONS'
  | 'METRICS'
  | 'INTELLIGENCE'
  | 'FINANCE';

/** Maps canonical type constants to their L1 display labels (zoom spec 1.3). */
export const SECTOR_DISPLAY_LABELS: Record<SectorType, string> = {
  COMMAND: 'Command',
  ORGANIZATION: 'Organization',
  OPERATIONS: 'Operations',
  METRICS: 'Metrics & Health',
  INTELLIGENCE: 'Intelligence',
  FINANCE: 'Finance Settings',
};

/** Size classes for L1 layout (zoom spec 1.4). */
export type SectorSizeClass = 'large' | 'medium' | 'small' | 'collapsed';

export const SECTOR_SIZES: Record<SectorType, SectorSizeClass> = {
  COMMAND: 'medium',
  ORGANIZATION: 'medium',
  OPERATIONS: 'small',
  METRICS: 'large',
  INTELLIGENCE: 'small',
  FINANCE: 'collapsed',
};

// _______________________________________________
//             HEALTH INDICATORS
// _______________________________________________

export type HealthStatus = 'green' | 'yellow' | 'red';

export type TrendDirection = 'up' | 'down' | 'flat';

// _______________________________________________
//            L1 DATA ELEMENTS (Spec 3.2)
// _______________________________________________

export type L1DataElement =
  | { type: 'metric'; label: string; value: string | number; trend?: TrendDirection }
  | { type: 'chart_mini'; label: string; data: number[]; chart_type: 'line' | 'bar' | 'sparkline' }
  | { type: 'status_list'; label: string; items: { text: string; status: string }[] }
  | { type: 'count_badge'; label: string; count: number; severity?: 'normal' | 'warning' | 'critical' }
  | { type: 'avatar_row'; label: string; avatars: { id: string; name: string; status: string }[] }
  | { type: 'priority_list'; label: string; items: { rank: number; text: string }[] };

// _______________________________________________
//             REGION SUMMARIES
// _______________________________________________
// Used to render sector panels at L1 (Global View).

export interface RegionSummary {
  sectorType: SectorType;
  displayLabel: string;
  health: HealthStatus;
  attentionCount: number;
  headlineKpi: string;
  stats: RegionStat[];
  dataElements: L1DataElement[];
}

export interface RegionStat {
  label: string;
  value: string | number;
}

// _______________________________________________
//           DEPARTMENT TILE SUMMARY
// _______________________________________________
// Used by the Organization region to render department tiles.

export interface DepartmentTileSummary {
  id: string;
  name: string;
  health: HealthStatus;
  openItems: number;
  risks: number;
  headcount: number;
}

// _______________________________________________
//          BUSINESS CATEGORY TILES
// _______________________________________________
// The four top-right tiles: Customers, Growth, Product & Delivery, People.

export interface BusinessCategoryTile {
  label: string;
  health: HealthStatus;
  summaryStat: string;
}

// _______________________________________________
//            FINANCE SETTINGS BAR
// _______________________________________________

export interface FinanceSettingsBarData {
  label: string;
  quickStats: string;
}

// _______________________________________________
//            L2 SECTOR CONTENT (Spec 3.3)
// _______________________________________________
// Used to render sector detail views at L2.

export interface L2SectorContent {
  header: {
    label: string;
    subtitle: string | null;
    health: HealthStatus;
    healthDetail: string;
  };
  summaryCards: L2SummaryCard[];
  subAreas: L2SubArea[];
  sectorActions: L2Action[];
}

export interface L2SummaryCard {
  label: string;
  value: string | number;
  detail: string | null;
  chartData?: number[];
}

export interface L2SubArea {
  id: string;
  type: string; // 'department', 'board_member', 'goal', etc.
  label: string;
  health: HealthStatus;
  summary: string;
  attentionCount: number;
}

export interface L2Action {
  id: string;
  label: string;
  actionType: 'acknowledge' | 'toggle' | 'quick_action';
  targetId: string | null;
  requiresConfirmation: boolean;
}

// _______________________________________________
//            L3 ELEMENT CONTENT (Spec 3.4)
// _______________________________________________
// Used to render element detail views at L3+.

export interface L3ElementContent {
  header: {
    type: string;
    id: string;
    title: string;
    subtitle: string | null;
    status: string;
    health: HealthStatus | null;
  };
  detailSections: L3DetailSection[];
  relatedItems: L3RelatedItem[];
  activity: L3ActivityEntry[];
  actions: L3Action[];
  chatEnabled: boolean;
  chatSessionId: string | null;
}

export interface L3DetailSection {
  label: string;
  contentType: 'key_value' | 'text' | 'list' | 'chart' | 'custom';
  data: Record<string, unknown>;
}

export interface L3RelatedItem {
  id: string;
  type: string;
  label: string;
  status: string | null;
}

export interface L3ActivityEntry {
  id: string;
  timestamp: string;
  type: string;
  summary: string;
  actorName: string | null;
}

export interface L3Action {
  id: string;
  label: string;
  actionType: string;
  dangerous: boolean;
  disabled: boolean;
  disabledReason: string | null;
}

// _______________________________________________
//               AGENT TYPES
// _______________________________________________
// Agent data structures per MC-RUNTIME-SPEC-v1 section 2.4.

export type AgentTier = 1 | 2 | 3 | 4 | 5;

export type AgentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type AutonomyLevel = 'A1' | 'A2' | 'A3';

export interface AgentSummary {
  id: string;
  name: string;
  role: string;
  tier: AgentTier;
  status: AgentStatus;
  departmentId: string | null;
  lastPulse: string | null; // ISO timestamp
  health: HealthStatus;
  activeTasks: number;
  avatarInitials: string;
}

export interface AgentDetail extends AgentSummary {
  mandate: string;
  autonomyLevel: AutonomyLevel;
  reportsTo: string | null; // agent ID
  reportsToName: string | null;
  inbox: number;
  performanceSignals: PerformanceSignal[];
}

export interface PerformanceSignal {
  label: string;
  value: string | number;
  trend: TrendDirection;
}

// _______________________________________________
//          DEPARTMENT DETAIL (L3)
// _______________________________________________
// Extended department data for L3 detail views.

export interface DepartmentDetail {
  id: string;
  name: string;
  type: DepartmentType;
  health: HealthStatus;
  healthDetail: string;
  chiefId: string | null;
  chiefName: string | null;
  headcount: number;
  activeBlockers: number;
  openTasks: number;
  completedTasks: number;
  recentPulses: PulseSummary[];
  agents: AgentSummary[];
  keyMetrics: DepartmentMetric[];
}

export type DepartmentType =
  | 'FINANCE'
  | 'OPERATIONS'
  | 'PRODUCT'
  | 'TECHNOLOGY'
  | 'MARKETING'
  | 'SALES'
  | 'LEGAL'
  | 'EXTERNAL'
  | 'PEOPLE';

export interface DepartmentMetric {
  label: string;
  value: string | number;
  trend?: TrendDirection;
}

export interface PulseSummary {
  id: string;
  agentId: string;
  agentName: string;
  completedAt: string; // ISO timestamp
  status: 'COMPLETE' | 'FAILED';
  actionCount: number;
}

// _______________________________________________
//          TASK TYPES (from Runtime Spec)
// _______________________________________________

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETE' | 'CANCELLED';

export type TaskPriority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW';

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  createdAt: string;
  blockedReason: string | null;
}
