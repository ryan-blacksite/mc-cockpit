/**
 * Purpose: Loads and normalizes mock data from the centralized JSON file.
 * Owns: JSON import, type validation, and data assembly for MockDataProvider.
 * Notes: TS types in types.ts remain authoritative. This loader transforms raw JSON
 *        into typed structures. Department details are assembled with their agents and pulses.
 */

import type {
  RegionSummary,
  DepartmentTileSummary,
  BusinessCategoryTile,
  FinanceSettingsBarData,
  L2SectorContent,
  DepartmentDetail,
  AgentSummary,
  AgentDetail,
  PulseSummary,
  PerformanceSignal,
  AutonomyLevel,
} from './types';

import mockJson from './mock.json';

// _______________________________________________
//              RAW JSON SHAPE
// _______________________________________________
// Defines the expected structure of mock.json for type-safe access.

interface RawAgentDetailExtension {
  mandate: string;
  autonomyLevel: string;
  reportsTo: string | null;
  reportsToName: string | null;
  inbox: number;
  performanceSignals: PerformanceSignal[];
}

interface RawDepartmentDetail {
  id: string;
  name: string;
  type: string;
  health: string;
  healthDetail: string;
  chiefId: string | null;
  chiefName: string | null;
  headcount: number;
  activeBlockers: number;
  openTasks: number;
  completedTasks: number;
  keyMetrics: { label: string; value: string | number; trend?: string }[];
}

interface MockDataJson {
  regionSummaries: RegionSummary[];
  departmentTiles: DepartmentTileSummary[];
  businessCategoryTiles: BusinessCategoryTile[];
  financeSettingsBar: FinanceSettingsBarData;
  businessWindowKpis: { label: string; value: string; trend: string }[];
  orgSectorContent: L2SectorContent;
  agents: AgentSummary[];
  agentDetails: Record<string, RawAgentDetailExtension>;
  pulses: Record<string, PulseSummary[]>;
  departmentDetails: Record<string, RawDepartmentDetail>;
}

// _______________________________________________
//              LOADED DATA
// _______________________________________________

const data = mockJson as MockDataJson;

// _______________________________________________
//              L1 DATA EXPORTS
// _______________________________________________

export const regionSummaries: RegionSummary[] = data.regionSummaries;

export const departmentTiles: DepartmentTileSummary[] = data.departmentTiles;

export const businessCategoryTiles: BusinessCategoryTile[] = data.businessCategoryTiles;

export const financeSettingsBar: FinanceSettingsBarData = data.financeSettingsBar;

export const businessWindowKpis: { label: string; value: string; trend: string }[] =
  data.businessWindowKpis;

// _______________________________________________
//              L2 DATA EXPORTS
// _______________________________________________

export const orgSectorContent: L2SectorContent = data.orgSectorContent;

// _______________________________________________
//              AGENT DATA
// _______________________________________________

export const agents: AgentSummary[] = data.agents;

/**
 * Returns agent detail by ID. Merges base agent data with extended detail if available,
 * otherwise returns a default detail structure.
 */
export function getAgentDetailById(agentId: string): AgentDetail | undefined {
  const baseAgent = data.agents.find((a) => a.id === agentId);
  if (!baseAgent) return undefined;

  const extension = data.agentDetails[agentId];
  if (extension) {
    return {
      ...baseAgent,
      mandate: extension.mandate,
      autonomyLevel: extension.autonomyLevel as AutonomyLevel,
      reportsTo: extension.reportsTo,
      reportsToName: extension.reportsToName,
      inbox: extension.inbox,
      performanceSignals: extension.performanceSignals,
    };
  }

  // Default detail for agents without explicit extension
  return {
    ...baseAgent,
    mandate: 'Execute assigned tasks within scope and escalate blockers.',
    autonomyLevel: 'A2',
    reportsTo: null,
    reportsToName: null,
    inbox: 0,
    performanceSignals: [],
  };
}

// _______________________________________________
//              DEPARTMENT DATA
// _______________________________________________

/**
 * Assembles a fully typed DepartmentDetail by combining raw detail data
 * with its associated agents and pulses from the JSON.
 */
export function getDepartmentDetailById(departmentId: string): DepartmentDetail | undefined {
  const raw = data.departmentDetails[departmentId];
  if (!raw) return undefined;

  const deptAgents = data.agents.filter((a) => a.departmentId === departmentId);
  const deptPulses = data.pulses[departmentId] || [];

  return {
    id: raw.id,
    name: raw.name,
    type: raw.type as DepartmentDetail['type'],
    health: raw.health as DepartmentDetail['health'],
    healthDetail: raw.healthDetail,
    chiefId: raw.chiefId,
    chiefName: raw.chiefName,
    headcount: raw.headcount,
    activeBlockers: raw.activeBlockers,
    openTasks: raw.openTasks,
    completedTasks: raw.completedTasks,
    recentPulses: deptPulses,
    agents: deptAgents,
    keyMetrics: raw.keyMetrics.map((m) => ({
      label: m.label,
      value: m.value,
      trend: m.trend as DepartmentDetail['keyMetrics'][0]['trend'],
    })),
  };
}

/**
 * Returns all department details, fully assembled.
 */
export function getAllDepartmentDetails(): Record<string, DepartmentDetail> {
  const result: Record<string, DepartmentDetail> = {};
  for (const deptId of Object.keys(data.departmentDetails)) {
    const detail = getDepartmentDetailById(deptId);
    if (detail) {
      result[deptId] = detail;
    }
  }
  return result;
}
