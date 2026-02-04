/**
 * Purpose: Renders a standard sector region card at L1 (Command, Operations, Intelligence).
 * Owns: Card chrome, header with health indicator and attention badge, data element grid.
 * Notes: Clickable — navigates to /zoom/<SECTOR> placeholder route.
 *        Metal panel style: gradient fill, sheen, soft shadow, inner highlight.
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
        background: 'var(--color-bg-card)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-xl)',
        cursor: 'pointer',
        transition: 'var(--transition-lift)',
        textAlign: 'left',
        width: '100%',
        color: 'inherit',
        outline: 'none',
        boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundImage = 'var(--panel-gradient-hover)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--panel-inner-highlight)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundImage = 'var(--panel-gradient)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient), var(--panel-inner-highlight)';
      }}
      aria-label={`Navigate to ${region.displayLabel} sector`}
    >
      {/* Header row: label + health + attention badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <HealthIndicator status={region.health} size="md" />
          <span
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              letterSpacing: '0.01em',
            }}
          >
            {region.displayLabel}
          </span>
        </div>
        {region.attentionCount > 0 && (
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              backgroundColor: 'rgba(201,160,32,0.12)',
              color: 'var(--color-badge-warning)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 500,
            }}
          >
            {region.attentionCount}
          </span>
        )}
      </div>

      {/* Headline KPI */}
      <div
        style={{
          fontSize: 'var(--font-size-label)',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-lg)',
          fontWeight: 500,
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
