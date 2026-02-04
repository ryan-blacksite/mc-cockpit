/**
 * Purpose: Hero "Business Window" panel — the dominant top-center viewport at L1.
 * Owns: Glass-overlay visualization placeholder with headline KPIs beneath.
 * Notes: This is the most premium-looking element on the screen.
 *        Acts as the "cockpit main viewport" behind/above the Organization dept tiles.
 *        Contains a visualization placeholder (grid/glow) + 3-5 headline KPI pills.
 */

import { useNavigate } from 'react-router-dom';
import type { RegionSummary } from '../data/types';
import { HealthIndicator } from './HealthIndicator';

interface Props {
  organization: RegionSummary;
}

export function BusinessWindowPanel({ organization }: Props) {
  const navigate = useNavigate();

  const kpis = [
    { label: 'MRR', value: '$42K', trend: '+18%' },
    { label: 'Headcount', value: '24', trend: '+3' },
    { label: 'Runway', value: '14mo', trend: 'Stable' },
    { label: 'NPS', value: '62', trend: '+4' },
  ];

  return (
    <button
      onClick={() => navigate('/zoom/ORGANIZATION')}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: 220,
        padding: 0,
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'var(--transition-lift)',
        color: 'inherit',
        textAlign: 'left',
        outline: 'none',
        background: 'var(--color-bg-card)',
        boxShadow: 'var(--shadow-ambient)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--shadow-glow-blue)';
        e.currentTarget.style.borderColor = 'var(--color-border-active)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      aria-label="Navigate to Organization sector — Business Window"
    >
      {/* ── Viewport visualization area ── */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: 140,
          background: 'linear-gradient(170deg, #0e1628 0%, #121d35 40%, #0a1020 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Grid lines */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(56,152,255,0.06)" />
              <stop offset="100%" stopColor="rgba(56,152,255,0)" />
            </linearGradient>
          </defs>
          {/* Horizontal grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line key={`h-${y}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
              stroke="rgba(56,152,255,0.05)" strokeWidth="1" />
          ))}
          {/* Vertical grid lines */}
          {[16, 33, 50, 66, 83].map((x) => (
            <line key={`v-${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
              stroke="rgba(56,152,255,0.04)" strokeWidth="1" />
          ))}
          {/* Subtle center glow ellipse */}
          <ellipse cx="50%" cy="55%" rx="40%" ry="35%"
            fill="rgba(56,152,255,0.03)" />
          {/* Horizon line */}
          <line x1="0%" y1="65%" x2="100%" y2="65%"
            stroke="rgba(56,152,255,0.08)" strokeWidth="1" />
        </svg>

        {/* Glass overlay sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Header overlay: Organization title + health */}
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-lg)',
            left: 'var(--space-xl)',
            right: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <HealthIndicator status={organization.health} size="md" />
            <span
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                letterSpacing: '0.01em',
              }}
            >
              Organization
            </span>
          </div>
          {organization.attentionCount > 0 && (
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                backgroundColor: 'rgba(201,160,32,0.15)',
                color: 'var(--color-badge-warning)',
                padding: '3px 8px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 500,
              }}
            >
              {organization.attentionCount} items
            </span>
          )}
        </div>

        {/* Edge bloom glow (very subtle blue edge light) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'inset 0 0 40px rgba(56,152,255,0.04)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Headline KPI strip ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 'var(--space-md) var(--space-xl)',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--panel-gradient)',
        }}
      >
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 700,
                color: 'var(--color-text-number)',
                lineHeight: 'var(--line-height-tight)',
              }}
            >
              {kpi.value}
            </span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {kpi.label}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)' }}>
                {kpi.trend}
              </span>
            </span>
          </div>
        ))}
      </div>
    </button>
  );
}
