/**
 * Purpose: Root layout wrapper for the cockpit application.
 * Owns: ZoomProvider context and ZoomTransition wrapper for all routes.
 * Notes: This layout wraps all routed screens to provide zoom state management
 *        and transition animations per MC-COCKPIT-ZOOM-SPEC-v1.
 */

import { Outlet } from 'react-router-dom';
import { ZoomProvider } from '../zoom/ZoomContext';
import { ZoomTransition } from '../zoom/ZoomTransition';

export function CockpitLayout() {
  return (
    <ZoomProvider>
      <ZoomTransition>
        <Outlet />
      </ZoomTransition>
    </ZoomProvider>
  );
}
