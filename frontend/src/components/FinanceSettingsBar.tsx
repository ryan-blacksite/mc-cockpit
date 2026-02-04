/**
 * Purpose: Renders the collapsed Finance Settings bar at the bottom of L1.
 * Owns: Collapsed bar display with label, expand icon, and quick stats as pill controls.
 * Notes: Finance is NOT a main region tile — it renders as a collapsed bottom bar (INV-LAYOUT-002).
 *        Cockpit control strip style: minimal height, pill-like stat segments, subtle separators.
 */

import { useNavigate } from 'react-router-dom';
import type { FinanceSettingsBarData } from '../data/types';

interface Props {
  data: FinanceSettingsBarData;
}

export function FinanceSettingsBar({ data }: Props) {
  const navigate = useNavigate();

  // Split quickStats into pill segments
  const statSegments = data.quickStats.split('|').map((s) => s.trim());

  return (
    <button
      onClick={() => navigate('/zoom/FINANCE')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: 44,
        background: 'var(--color-bg-collapsed)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0 var(--space-xl)',
        cursor: 'pointer',
        transition: 'var(--transition-lift)',
        color: 'inherit',
        outline: 'none',
        boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--panel-inner-highlight)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient), var(--panel-inner-highlight)';
      }}
      aria-label="Expand Finance Settings"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {/* Expand chevron */}
        <span
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-xs)',
            lineHeight: 1,
          }}
        >
          &#9662;
        </span>
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            letterSpacing: '0.02em',
          }}
        >
          {data.label}
        </span>
      </div>

      {/* Pill-like stat segments */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {statSegments.map((seg, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            {i > 0 && (
              <span
                style={{
                  width: 1,
                  height: 14,
                  background: 'var(--color-border)',
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}
            >
              {seg}
            </span>
          </span>
        ))}
      </div>
    </button>
  );
}
