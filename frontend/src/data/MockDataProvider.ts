/**
 * Purpose: Mock implementation of the DataProvider interface.
 * Owns: Returns mock data loaded from mock.json for all cockpit views (L1, L2, L3).
 * Notes: Data is centralized in mock.json and loaded via loadMockData.ts.
 *        Replace with ApiDataProvider when the backend is ready. No Supabase here.
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
  regionSummaries,
  departmentTiles,
  businessCategoryTiles,
  financeSettingsBar,
  businessWindowKpis,
  orgSectorContent,
  agents,
  getAgentDetailById,
  getDepartmentDetailById,
} from './loadMockData';

// Re-export KPIs for components that need direct access (e.g., BusinessWindowPanel)
export { businessWindowKpis };

export class MockDataProvider implements DataProvider {
  // ─── L1 (Global View) Queries ───

  getAllRegionSummaries(): RegionSummary[] {
    return regionSummaries;
  }

  getRegionSummary(sector: SectorType): RegionSummary | undefined {
    return regionSummaries.find((r) => r.sectorType === sector);
  }

  getDepartmentTiles(): DepartmentTileSummary[] {
    return departmentTiles;
  }

  getBusinessCategoryTiles(): BusinessCategoryTile[] {
    return businessCategoryTiles;
  }

  getFinanceSettingsBar(): FinanceSettingsBarData {
    return financeSettingsBar;
  }

  getBusinessWindowKpis(): { label: string; value: string; trend: string }[] {
    return businessWindowKpis;
  }

  // ─── L2 (Sector View) Queries ───

  getOrganizationSectorContent(): L2SectorContent {
    return orgSectorContent;
  }

  // ─── L3 (Detail View) Queries ───

  getDepartmentDetail(departmentId: string): DepartmentDetail | undefined {
    return getDepartmentDetailById(departmentId);
  }

  getAgentsByDepartment(departmentId: string, tierFilter?: number): AgentSummary[] {
    let filtered = agents.filter((a) => a.departmentId === departmentId);
    if (tierFilter !== undefined) {
      filtered = filtered.filter((a) => a.tier === tierFilter);
    }
    return filtered;
  }

  getAgentDetail(agentId: string): AgentDetail | undefined {
    return getAgentDetailById(agentId);
  }

  getAllAgents(): AgentSummary[] {
    return agents;
  }
}
