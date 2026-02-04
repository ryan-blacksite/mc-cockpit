/**
 * Purpose: Root application component.
 * Owns: Provider tree setup (DataProvider, Router).
 * Notes: DataProviderRoot wraps the entire app so all components can use useData().
 */

import { RouterProvider } from 'react-router-dom';
import { DataProviderRoot } from './data/DataContext';
import { router } from './routes/router';

export function App() {
  return (
    <DataProviderRoot>
      <RouterProvider router={router} />
    </DataProviderRoot>
  );
}
