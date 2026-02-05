/**
 * Purpose: Abstract data provider interface for cockpit data.
 * Owns: The contract between UI components and the data layer.
 * Notes: Start with MockDataProvider; swap to ApiDataProvider when backend is ready.
 *        No Supabase or backend calls should exist in this interface.
 */

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

export interface DataProvider {
  // ─── L1 (Global View) Queries ───

  /** Returns L1 summary data for all 6 regions. */
  getAllRegionSummaries(): RegionSummary[];

  /** Returns L1 summary for a single sector. */
  getRegionSummary(sector: SectorType): RegionSummary | undefined;

  /** Returns department tiles for the Organization region. */
  getDepartmentTiles(): DepartmentTileSummary[];

  /** Returns the four business-category tiles (Customers, Growth, Product & Delivery, People). */
  getBusinessCategoryTiles(): BusinessCategoryTile[];

  /** Returns collapsed Finance settings bar data. */
  getFinanceSettingsBar(): FinanceSettingsBarData;

  /** Returns headline KPIs for the Business Window panel. */
  getBusinessWindowKpis(): { label: string; value: string; trend: string }[];

  // ─── L2 (Sector View) Queries ───

  /** Returns L2 content for the Organization sector (departments as sub-areas). */
  getOrganizationSectorContent(): L2SectorContent;

  // ─── L3 (Detail View) Queries ───

  /** Returns full detail for a specific department. */
  getDepartmentDetail(departmentId: string): DepartmentDetail | undefined;

  /** Returns agent roster for a department, optionally filtered by tier. */
  getAgentsByDepartment(departmentId: string, tierFilter?: number): AgentSummary[];

  /** Returns full detail for a specific agent. */
  getAgentDetail(agentId: string): AgentDetail | undefined;

  /** Returns all agents across the organization. */
  getAllAgents(): AgentSummary[];
}
