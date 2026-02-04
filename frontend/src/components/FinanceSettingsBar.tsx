/**
 * Purpose: Renders the collapsed Finance Settings bar at the bottom of L1.
 * Owns: Collapsed bar display with label, expand icon, and quick stats.
 * Notes: Finance is NOT a main region tile — it renders as a collapsed bottom bar (INV-LAYOUT-002).
 *        Canonical type constant is FINANCE; display label is "Finance Settings" (spec 1.3).
 */

import { useNavigate } from 'react-router-dom';
import type { FinanceSettingsBarData } from '../data/types';

interface Props {
  data: FinanceSettingsBarData;
}

export function FinanceSettingsBar({ data }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/zoom/FINANCE')}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: 48,
        backgroundColor: 'var(--color-bg-collapsed)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '0 var(--space-lg)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        color: 'inherit',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-bg-collapsed)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      aria-label="Expand Finance Settings"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        {/* Expand icon (chevron) */}
        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>&#9662;</span>
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)' as unknown as number,
            color: 'var(--color-text-secondary)',
          }}
        >
          {data.label}
        </span>
      </div>
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {data.quickStats}
      </span>
    </button>
  );
}
