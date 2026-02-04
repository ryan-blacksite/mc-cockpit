/**
 * Purpose: Renders a standard sector region card at L1 (Command, Operations, Intelligence).
 * Owns: Card chrome, header with health indicator and attention badge, data element grid.
 * Notes: Clickable — navigates to /zoom/<SECTOR> placeholder route (UI-7 observation + click-to-zoom).
 */

import { useNavigate } from 'react-router-dom';
import type { RegionSummary } from '../data/types';
import { HealthIndicator } from './HealthIndicator';
import { DataElementRenderer } from './DataElementRenderer';

interface Props {
  region: RegionSummary;
}

export function RegionCard({ region }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/zoom/${region.sectorType}`)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg)',
        cursor: 'pointer',
        transition: 'var(--transition-normal)',
        textAlign: 'left',
        width: '100%',
        color: 'inherit',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-card-hover)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      aria-label={`Navigate to ${region.displayLabel} sector`}
    >
      {/* Header row: label + health + attention badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <HealthIndicator status={region.health} size="md" />
          <span
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 'var(--font-weight-semibold)' as unknown as number,
              color: 'var(--color-text-heading)',
            }}
          >
            {region.displayLabel}
          </span>
        </div>
        {region.attentionCount > 0 && (
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              backgroundColor: 'var(--color-badge-warning)20',
              color: 'var(--color-badge-warning)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 'var(--font-weight-medium)' as unknown as number,
            }}
          >
            {region.attentionCount}
          </span>
        )}
      </div>

      {/* Headline KPI */}
      <div
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-md)',
          fontWeight: 'var(--font-weight-medium)' as unknown as number,
        }}
      >
        {region.headlineKpi}
      </div>

      {/* Data elements */}
      <div style={{ flex: 1 }}>
        {region.dataElements.map((el, i) => (
          <DataElementRenderer key={i} element={el} compact />
        ))}
      </div>
    </button>
  );
}
