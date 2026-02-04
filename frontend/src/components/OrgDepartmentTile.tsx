/**
 * Purpose: Renders a single department tile within the Organization region.
 * Owns: Department name, health dot, open-item count, risk count.
 * Notes: Navigates to /org/<departmentId> on click. Displayed directly under the
 *        "Organization" title with no outer container box (INV-LAYOUT-005).
 *        Metal insert style: machined-in look with subtle shadow and sheen.
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
        gap: 'var(--space-md)',
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
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--panel-inner-highlight)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient), var(--panel-inner-highlight)';
      }}
      aria-label={`Navigate to ${department.name} department`}
    >
      <HealthIndicator status={department.health} />
      <span
        style={{
          flex: 1,
          fontSize: 'var(--font-size-label)',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
        }}
      >
        {department.name}
      </span>
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {department.headcount}
      </span>
      {department.risks > 0 && (
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-badge-critical)',
            backgroundColor: 'rgba(207,64,64,0.12)',
            padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 500,
          }}
        >
          {department.risks} risk{department.risks > 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
}
