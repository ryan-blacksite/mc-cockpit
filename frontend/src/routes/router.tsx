/**
 * Purpose: Routing configuration for the cockpit app.
 * Owns: Route definitions mapping URLs to screens.
 * Notes: Uses CockpitLayout as parent to provide ZoomProvider and ZoomTransition
 *        to all child routes. Organization sector has full drill-down (B-3).
 *        Other sectors use PlaceholderScreen until Phase 5.
 */

import { createBrowserRouter } from 'react-router-dom';
import { CockpitLayout } from '../components/CockpitLayout';
import { GlobalView } from '../screens/GlobalView';
import { OrganizationSectorView } from '../screens/OrganizationSectorView';
import { DepartmentDetailView } from '../screens/DepartmentDetailView';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

export const router = createBrowserRouter([
  {
    element: <CockpitLayout />,
    children: [
      // L1: Global View (Cockpit)
      {
        path: '/',
        element: <GlobalView />,
      },

      // L2: Organization Sector View — IMPLEMENTED (B-3)
      {
        path: '/zoom/ORGANIZATION',
        element: <OrganizationSectorView />,
      },

      // L3: Department Detail View — IMPLEMENTED (B-3)
      {
        path: '/org/:departmentId',
        element: <DepartmentDetailView />,
      },

      // L2: Other Sectors — PLACEHOLDER (Phase 5)
      {
        path: '/zoom/:sectorType',
        element: <PlaceholderScreen />,
      },

      // L3: Other Sector Sub-targets — PLACEHOLDER (Phase 5)
      {
        path: '/zoom/:sectorType/:subTarget',
        element: <PlaceholderScreen />,
      },
    ],
  },
]);
