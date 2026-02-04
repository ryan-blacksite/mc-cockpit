/**
 * Purpose: Renders the large Metrics & Health panel at bottom-center of L1.
 * Owns: Primary data-dense region showing financial health, goals, and operational metrics.
 * Notes: Canonical type constant is METRICS; display label is "Metrics & Health" (spec 1.3).
 *        This is the largest region at L1 (INV-LAYOUT-001).
 */

import { useNavigate } from 'react-router-dom';
import type { RegionSummary } from '../data/types';
import { HealthIndicator } from './HealthIndicator';
import { DataElementRenderer } from './DataElementRenderer';

interface Props {
  region: RegionSummary;
}

export function MetricsHealthPanel({ region }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/zoom/METRICS')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-xl)',
        cursor: 'pointer',
        transition: 'var(--transition-normal)',
        width: '100%',
        height: '100%',
        color: 'inherit',
        textAlign: 'left',
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
      aria-label="Navigate to Metrics & Health sector"
    >
      {/* Header */}
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
              fontWeight: 'var(--font-weight-semibold)' as unknown as number,
              color: 'var(--color-text-heading)',
            }}
          >
            Metrics &amp; Health
          </span>
        </div>
        {region.attentionCount > 0 && (
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              backgroundColor: 'var(--color-badge-warning)20',
              color: 'var(--color-badge-warning)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 'var(--font-weight-medium)' as unknown as number,
            }}
          >
            {region.attentionCount} attention
          </span>
        )}
      </div>

      {/* KPI headline strip */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-lg)',
          flexWrap: 'wrap',
        }}
      >
        {region.stats.map((stat, i) => (
          <div key={i}>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{stat.label}</div>
            <div
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-semibold)' as unknown as number,
                color: 'var(--color-text-heading)',
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Data elements grid — 2-column layout for the large panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 'var(--space-md)',
          flex: 1,
        }}
      >
        {region.dataElements.map((el, i) => (
          <DataElementRenderer key={i} element={el} />
        ))}
      </div>
    </button>
  );
}
