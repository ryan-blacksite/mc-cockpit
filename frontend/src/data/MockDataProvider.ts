/**
 * Purpose: Mock implementation of the DataProvider interface.
 * Owns: Returns hardcoded mock data for all cockpit views (L1, L2, L3).
 * Notes: Replace with ApiDataProvider when the backend is ready. No Supabase here.
 */

import type { DataProvider } from './DataProvider';
import type {
  RegionSummary,
  DepartmentTileSummary,
  BusinessCategoryTile,
  FinanceSettingsBarData,
  SectorType,
  L2SectorContent,
  DepartmentDetail,
  AgentSummary,
  AgentDetail,
} from './types';
import {
  MOCK_REGION_SUMMARIES,
  MOCK_DEPARTMENT_TILES,
  MOCK_BUSINESS_CATEGORY_TILES,
  MOCK_FINANCE_SETTINGS_BAR,
} from './mockData';
import {
  MOCK_ORG_SECTOR_CONTENT,
  MOCK_DEPARTMENT_DETAILS,
  MOCK_AGENTS,
  MOCK_AGENT_DETAILS,
} from './mockDataL2L3';

export class MockDataProvider implements DataProvider {
  // ─── L1 (Global View) Queries ───

  getAllRegionSummaries(): RegionSummary[] {
    return MOCK_REGION_SUMMARIES;
  }

  getRegionSummary(sector: SectorType): RegionSummary | undefined {
    return MOCK_REGION_SUMMARIES.find((r) => r.sectorType === sector);
  }

  getDepartmentTiles(): DepartmentTileSummary[] {
    return MOCK_DEPARTMENT_TILES;
  }

  getBusinessCategoryTiles(): BusinessCategoryTile[] {
    return MOCK_BUSINESS_CATEGORY_TILES;
  }

  getFinanceSettingsBar(): FinanceSettingsBarData {
    return MOCK_FINANCE_SETTINGS_BAR;
  }

  // ─── L2 (Sector View) Queries ───

  getOrganizationSectorContent(): L2SectorContent {
    return MOCK_ORG_SECTOR_CONTENT;
  }

  // ─── L3 (Detail View) Queries ───

  getDepartmentDetail(departmentId: string): DepartmentDetail | undefined {
    return MOCK_DEPARTMENT_DETAILS[departmentId];
  }

  getAgentsByDepartment(departmentId: string, tierFilter?: number): AgentSummary[] {
    let agents = MOCK_AGENTS.filter((a) => a.departmentId === departmentId);
    if (tierFilter !== undefined) {
      agents = agents.filter((a) => a.tier === tierFilter);
    }
    return agents;
  }

  getAgentDetail(agentId: string): AgentDetail | undefined {
    // Return detailed version if available, otherwise construct from summary
    if (MOCK_AGENT_DETAILS[agentId]) {
      return MOCK_AGENT_DETAILS[agentId];
    }
    // Fallback: return basic detail from agent summary
    const agent = MOCK_AGENTS.find((a) => a.id === agentId);
    if (!agent) return undefined;
    return {
      ...agent,
      mandate: 'Execute assigned tasks within scope and escalate blockers.',
      autonomyLevel: 'A2',
      reportsTo: null,
      reportsToName: null,
      inbox: 0,
      performanceSignals: [],
    };
  }

  getAllAgents(): AgentSummary[] {
    return MOCK_AGENTS;
  }
}
