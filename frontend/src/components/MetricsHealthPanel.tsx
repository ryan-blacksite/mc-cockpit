/**
 * Purpose: Renders the large Metrics & Health panel at bottom-center of L1.
 * Owns: Primary data-dense region showing financial health, goals, and operational metrics.
 * Notes: Canonical type constant is METRICS; display label is "Metrics & Health" (spec 1.3).
 *        This is the largest region at L1 (INV-LAYOUT-001).
 *        Metal panel: gradient fill, sheen, deep shadow, premium number typography.
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
        background: 'var(--color-bg-card)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-2xl)',
        cursor: 'pointer',
        transition: 'var(--transition-lift)',
        width: '100%',
        height: '100%',
        color: 'inherit',
        textAlign: 'left',
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
      aria-label="Navigate to Metrics & Health sector"
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-xl)',
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
            Metrics &amp; Health
          </span>
        </div>
        {region.attentionCount > 0 && (
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              backgroundColor: 'rgba(201,160,32,0.12)',
              color: 'var(--color-badge-warning)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 500,
            }}
          >
            {region.attentionCount} attention
          </span>
        )}
      </div>

      {/* KPI headline strip — big bold numbers */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-xl)',
          paddingBottom: 'var(--space-lg)',
          borderBottom: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}
      >
        {region.stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {stat.label}
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 700,
                color: 'var(--color-text-number)',
                lineHeight: 'var(--line-height-tight)',
              }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Data elements grid — 2-column for the large panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 'var(--space-lg)',
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
