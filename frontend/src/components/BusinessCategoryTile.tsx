/**
 * Purpose: Renders one of the four business-category tiles in the top-right region.
 * Owns: Tile label, health indicator, and summary stat (Customers, Growth, Product & Delivery, People).
 * Notes: These tiles provide at-a-glance operational dimensions at L1 (spec 6.3.1, INV-LAYOUT-006).
 *        Compact metal module: small physical module with lighter shadow, smaller radius.
 */

import { useNavigate } from 'react-router-dom';
import type { BusinessCategoryTile as TileData } from '../data/types';
import { HealthIndicator } from './HealthIndicator';

interface Props {
  tile: TileData;
}

export function BusinessCategoryTile({ tile }: Props) {
  const navigate = useNavigate();
  const routeSlug = tile.label.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');

  return (
    <button
      onClick={() => navigate(`/zoom/ORGANIZATION/${routeSlug}`)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        background: 'var(--color-bg-card)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-md) var(--space-lg)',
        cursor: 'pointer',
        transition: 'var(--transition-lift)',
        width: '100%',
        color: 'inherit',
        textAlign: 'left',
        outline: 'none',
        boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-active)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--shadow-glow-blue), var(--panel-inner-highlight)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient), var(--panel-inner-highlight)';
      }}
      aria-label={`Navigate to ${tile.label}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <HealthIndicator status={tile.health} />
        <span
          style={{
            fontSize: 'var(--font-size-label)',
            fontWeight: 600,
            color: 'var(--color-text-heading)',
          }}
        >
          {tile.label}
        </span>
      </div>
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          lineHeight: 'var(--line-height-relaxed)',
        }}
      >
        {tile.summaryStat}
      </span>
    </button>
  );
}
