/**
 * Purpose: Renders a single department tile within the Organization region.
 * Owns: Department name, health dot, open-item count, risk count.
 * Notes: Navigates to /org/<departmentId> on click. Displayed directly under the
 *        "Organization" title with no outer container box (INV-LAYOUT-005).
 */

import { useNavigate } from 'react-router-dom';
import type { DepartmentTileSummary } from '../data/types';
import { HealthIndicator } from './HealthIndicator';

interface Props {
  department: DepartmentTileSummary;
}

export function OrgDepartmentTile({ department }: Props) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/org/${department.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-sm) var(--space-md)',
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
      aria-label={`Navigate to ${department.name} department`}
    >
      <HealthIndicator status={department.health} />
      <span
        style={{
          flex: 1,
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)' as unknown as number,
          color: 'var(--color-text-primary)',
        }}
      >
        {department.name}
      </span>
      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
        {department.headcount}
      </span>
      {department.risks > 0 && (
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-badge-critical)',
            backgroundColor: 'var(--color-badge-critical)15',
            padding: '1px 5px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {department.risks} risk{department.risks > 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
}
