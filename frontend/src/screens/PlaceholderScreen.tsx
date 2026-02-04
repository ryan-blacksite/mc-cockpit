/**
 * Purpose: Placeholder screen for L2+ zoom routes (not yet implemented).
 * Owns: Displays the current route params so navigation stubs are testable.
 * Notes: Will be replaced with real sector/detail views in future tickets.
 *        Styled to match the metal console aesthetic.
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
        gap: 'var(--space-xl)',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Sector title */}
      <h1
        style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          letterSpacing: '0.01em',
        }}
      >
        {displayLabel}
      </h1>

      {subTarget && (
        <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-secondary)' }}>
          Target: {subTarget}
        </p>
      )}

      {/* Status badge */}
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: 'var(--space-xs) var(--space-lg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
        }}
      >
        L2+ view — not yet implemented
      </span>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          padding: 'var(--space-sm) var(--space-xl)',
          background: 'var(--color-bg-card)',
          backgroundImage: 'var(--panel-gradient)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
          transition: 'var(--transition-lift)',
          boxShadow: 'var(--shadow-ambient)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lift)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
        }}
      >
        Back to Cockpit
      </button>
    </div>
  );
}
