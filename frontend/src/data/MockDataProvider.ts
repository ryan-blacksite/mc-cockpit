/**
 * Purpose: Mock implementation of the DataProvider interface.
 * Owns: Returns hardcoded mock data for all cockpit views.
 * Notes: Replace with ApiDataProvider when the backend is ready. No Supabase here.
 */

import type { DataProvider } from './DataProvider';
import type {
  RegionSummary,
  DepartmentTileSummary,
  BusinessCategoryTile,
  FinanceSettingsBarData,
  SectorType,
} from './types';
import {
  MOCK_REGION_SUMMARIES,
  MOCK_DEPARTMENT_TILES,
  MOCK_BUSINESS_CATEGORY_TILES,
  MOCK_FINANCE_SETTINGS_BAR,
} from './mockData';

export class MockDataProvider implements DataProvider {
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
}
