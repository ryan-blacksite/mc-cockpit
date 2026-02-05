/**
 * Purpose: Global zoom state management for the cockpit camera-based navigation.
 * Owns: Zoom level tracking, breadcrumb stack, transition state per MC-COCKPIT-ZOOM-SPEC-v1.
 * Notes: Zoom levels L1-L4+. L1=Global View, L2=Sector, L3=Detail, L4+=Deep Dive.
 *        All zoom operations follow INV-ZOOM-001 through INV-ZOOM-006.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SectorType } from '../data/types';

// _______________________________________________
//               ZOOM STATE TYPES
// _______________________________________________

export interface ZoomStackEntry {
  level: number;
  sector: SectorType | null;
  targetId: string | null;
  targetType: string | null; // 'department', 'agent', 'task', etc.
  label: string;
}

export interface ZoomState {
  currentLevel: 1 | 2 | 3 | 4;
  currentSector: SectorType | null;
  currentTarget: string | null;
  zoomStack: ZoomStackEntry[];
  isTransitioning: boolean;
  transitionDirection: 'in' | 'out' | null;
}

interface ZoomContextValue {
  state: ZoomState;
  zoomIn: (sector: SectorType, targetId?: string, targetType?: string, label?: string) => void;
  zoomOut: () => void;
  zoomTo: (stackIndex: number) => void;
  zoomToElement: (sector: SectorType, elementId: string, elementType: string, label: string) => void;
  completeTransition: () => void;
  getBreadcrumbs: () => ZoomStackEntry[];
}

// _______________________________________________
//              INITIAL STATE (Spec 2.2)
// _______________________________________________

const INITIAL_STATE: ZoomState = {
  currentLevel: 1,
  currentSector: null,
  currentTarget: null,
  zoomStack: [
    { level: 1, sector: null, targetId: null, targetType: null, label: 'Cockpit' },
  ],
  isTransitioning: false,
  transitionDirection: null,
};

// _______________________________________________
//                 CONTEXT
// _______________________________________________

const ZoomContext = createContext<ZoomContextValue | null>(null);

export function ZoomProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ZoomState>(INITIAL_STATE);

  /**
   * Zoom in to a sector or element. Pushes to the zoom stack.
   * Blocks if already transitioning (INV-ZOOM-004).
   */
  const zoomIn = useCallback(
    (sector: SectorType, targetId?: string, targetType?: string, label?: string) => {
      setState((prev) => {
        if (prev.isTransitioning) return prev; // Block during transition
        if (prev.currentLevel >= 10) return prev; // Max depth safety limit

        const newLevel = Math.min(prev.currentLevel + 1, 4) as 1 | 2 | 3 | 4;

        const newEntry: ZoomStackEntry = {
          level: newLevel,
          sector,
          targetId: targetId ?? null,
          targetType: targetType ?? null,
          label: label ?? sector,
        };

        return {
          ...prev,
          currentLevel: newLevel,
          currentSector: sector,
          currentTarget: targetId ?? null,
          zoomStack: [...prev.zoomStack, newEntry],
          isTransitioning: true,
          transitionDirection: 'in',
        };
      });
    },
    []
  );

  /**
   * Zoom out one level. Pops from the zoom stack.
   * Cannot zoom out from L1 (INV-ZOOM-003).
   */
  const zoomOut = useCallback(() => {
    setState((prev) => {
      if (prev.isTransitioning) return prev;
      if (prev.currentLevel <= 1) return prev; // Can't zoom out from L1

      const newStack = prev.zoomStack.slice(0, -1);
      const previous = newStack[newStack.length - 1];

      // Safety check: should never happen since we check currentLevel > 1
      if (!previous) return prev;

      return {
        ...prev,
        currentLevel: previous.level as 1 | 2 | 3 | 4,
        currentSector: previous.sector,
        currentTarget: previous.targetId,
        zoomStack: newStack,
        isTransitioning: true,
        transitionDirection: 'out',
      };
    });
  }, []);

  /**
   * Jump to a specific stack index (breadcrumb click).
   */
  const zoomTo = useCallback((stackIndex: number) => {
    setState((prev) => {
      if (prev.isTransitioning) return prev;
      if (stackIndex < 0 || stackIndex >= prev.zoomStack.length) return prev;

      const newStack = prev.zoomStack.slice(0, stackIndex + 1);
      const target = newStack[stackIndex];

      // Safety check: should never happen due to bounds check above
      if (!target) return prev;

      return {
        ...prev,
        currentLevel: target.level as 1 | 2 | 3 | 4,
        currentSector: target.sector,
        currentTarget: target.targetId,
        zoomStack: newStack,
        isTransitioning: true,
        transitionDirection: stackIndex < prev.currentLevel - 1 ? 'out' : 'in',
      };
    });
  }, []);

  /**
   * Direct navigation to a specific element (builds full stack path).
   */
  const zoomToElement = useCallback(
    (sector: SectorType, elementId: string, elementType: string, label: string) => {
      setState((prev) => {
        if (prev.isTransitioning) return prev;

        // Build the stack from L1 to L3
        const newStack: ZoomStackEntry[] = [
          { level: 1, sector: null, targetId: null, targetType: null, label: 'Cockpit' },
          { level: 2, sector, targetId: null, targetType: null, label: sector },
          { level: 3, sector, targetId: elementId, targetType: elementType, label },
        ];

        return {
          ...prev,
          currentLevel: 3,
          currentSector: sector,
          currentTarget: elementId,
          zoomStack: newStack,
          isTransitioning: true,
          transitionDirection: 'in',
        };
      });
    },
    []
  );

  /**
   * Called when zoom animation completes.
   */
  const completeTransition = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isTransitioning: false,
      transitionDirection: null,
    }));
  }, []);

  /**
   * Returns breadcrumb items for rendering.
   */
  const getBreadcrumbs = useCallback((): ZoomStackEntry[] => {
    return state.zoomStack;
  }, [state.zoomStack]);

  return (
    <ZoomContext.Provider
      value={{
        state,
        zoomIn,
        zoomOut,
        zoomTo,
        zoomToElement,
        completeTransition,
        getBreadcrumbs,
      }}
    >
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom(): ZoomContextValue {
  const context = useContext(ZoomContext);
  if (!context) {
    throw new Error('useZoom must be used within a ZoomProvider');
  }
  return context;
}
