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
