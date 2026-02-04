/**
 * Purpose: Routing configuration for the cockpit app.
 * Owns: Route definitions mapping URLs to screens.
 * Notes: All L2+ routes are stubs pointing to PlaceholderScreen. Will be replaced
 *        when sector views are implemented in future tickets.
 */

import { createBrowserRouter } from 'react-router-dom';
import { GlobalView } from '../screens/GlobalView';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalView />,
  },
  {
    path: '/zoom/:sectorType',
    element: <PlaceholderScreen />,
  },
  {
    path: '/zoom/:sectorType/:subTarget',
    element: <PlaceholderScreen />,
  },
  {
    path: '/org/:departmentId',
    element: <PlaceholderScreen />,
  },
]);
