/**
 * Purpose: Renders one of the four business-category tiles in the top-right region.
 * Owns: Tile label, health indicator, and summary stat (Customers, Growth, Product & Delivery, People).
 * Notes: These tiles provide at-a-glance operational dimensions at L1 (spec 6.3.1, INV-LAYOUT-006).
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
        gap: 'var(--space-xs)',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        width: '100%',
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
      aria-label={`Navigate to ${tile.label}`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
        <HealthIndicator status={tile.health} />
        <span
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)' as unknown as number,
            color: 'var(--color-text-heading)',
          }}
        >
          {tile.label}
        </span>
      </div>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
        {tile.summaryStat}
      </span>
    </button>
  );
}
