/**
 * Purpose: React context that provides cockpit data to the component tree.
 * Owns: DataProvider injection. Components use the useData() hook, never import mock data directly.
 * Notes: Swap MockDataProvider for ApiDataProvider in this single file when backend is ready.
 */

import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { DataProvider } from './DataProvider';
import { MockDataProvider } from './MockDataProvider';

const DataContext = createContext<DataProvider | null>(null);

export function DataProviderRoot({ children }: { children: ReactNode }) {
  const provider = useMemo(() => new MockDataProvider(), []);
  return <DataContext.Provider value={provider}>{children}</DataContext.Provider>;
}

export function useData(): DataProvider {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used inside <DataProviderRoot>');
  }
  return ctx;
}
