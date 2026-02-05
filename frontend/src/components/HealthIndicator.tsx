/**
 * Purpose: Renders a colored health dot (green/yellow/red) with optional label.
 * Owns: Visual representation of health status across all cockpit regions.
 * Notes: Health indicators are visible at all zoom levels (INV-VIS-004).
 *        Colors are muted (not neon) to match the premium metal console aesthetic.
 */

import type { HealthStatus } from '../data/types';

const HEALTH_COLORS: Record<HealthStatus, string> = {
  green: 'var(--color-health-green)',
  yellow: 'var(--color-health-yellow)',
  red: 'var(--color-health-red)',
};

const HEALTH_LABELS: Record<HealthStatus, string> = {
  green: 'Healthy',
  yellow: 'Warning',
  red: 'Critical',
};

interface Props {
  status: HealthStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'large';
}

const DOT_SIZES: Record<'sm' | 'md' | 'large', number> = {
  sm: 8,
  md: 10,
  large: 14,
};

export function HealthIndicator({ status, showLabel = false, size = 'sm' }: Props) {
  const dotSize = DOT_SIZES[size];

  return (
    <span
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)' }}
      title={HEALTH_LABELS[status]}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: HEALTH_COLORS[status],
          display: 'inline-block',
          flexShrink: 0,
          boxShadow: `0 0 8px ${HEALTH_COLORS[status]}40`,
        }}
        aria-label={HEALTH_LABELS[status]}
      />
      {showLabel && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {HEALTH_LABELS[status]}
        </span>
      )}
    </span>
  );
}
