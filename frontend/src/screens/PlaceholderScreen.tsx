/**
 * Purpose: Placeholder screen for L2+ zoom routes (not yet implemented).
 * Owns: Displays the current route params so navigation stubs are testable.
 * Notes: Will be replaced with real sector/detail views in future tickets.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { SECTOR_DISPLAY_LABELS } from '../data/types';
import type { SectorType } from '../data/types';

export function PlaceholderScreen() {
  const params = useParams();
  const navigate = useNavigate();

  const sectorType = params.sectorType as SectorType | undefined;
  const subTarget = params.subTarget ?? params.departmentId ?? null;
  const displayLabel = sectorType ? SECTOR_DISPLAY_LABELS[sectorType] ?? sectorType : 'Unknown';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 'var(--space-lg)',
        color: 'var(--color-text-primary)',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-semibold)' as unknown as number,
          color: 'var(--color-text-heading)',
        }}
      >
        {displayLabel}
      </h1>
      {subTarget && (
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
          Target: {subTarget}
        </p>
      )}
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        L2+ view — not yet implemented
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: 'var(--space-sm) var(--space-lg)',
          backgroundColor: 'var(--color-accent-dim)',
          color: 'var(--color-text-primary)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
        }}
      >
        Back to Cockpit
      </button>
    </div>
  );
}
