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
} from './types';

export interface DataProvider {
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
}
