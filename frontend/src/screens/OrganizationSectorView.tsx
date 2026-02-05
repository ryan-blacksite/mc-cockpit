/**
 * Purpose: L2 sector view for the Organization sector.
 * Owns: Renders departments as sub-areas with health, summary cards, and sector actions.
 * Notes: Per MC-COCKPIT-ZOOM-SPEC-v1 section 3.3, this is the sector-level view showing
 *        all departments as clickable tiles that zoom to L3 detail views.
 *        Follows INV-VIS-002 (only current sector visible at L2+).
 */

import { useNavigate } from 'react-router-dom';
import { useData } from '../data/DataContext';
import { useZoom } from '../zoom/ZoomContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { HealthIndicator } from '../components/HealthIndicator';

export function OrganizationSectorView() {
  const data = useData();
  const { state, zoomOut } = useZoom();
  const navigate = useNavigate();
  const content = data.getOrganizationSectorContent();

  const handleDepartmentClick = (deptId: string) => {
    navigate(`/org/${deptId}`);
  };

  const handleBackClick = () => {
    zoomOut();
    navigate('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 'var(--space-2xl)',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Back Button */}
      <button
        onClick={handleBackClick}
        disabled={state.isTransitioning}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-sm)',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-accent)',
          fontSize: 'var(--font-size-sm)',
          cursor: state.isTransitioning ? 'not-allowed' : 'pointer',
          padding: 'var(--space-sm) 0',
          marginBottom: 'var(--space-lg)',
          opacity: state.isTransitioning ? 0.5 : 1,
        }}
      >
        <ChevronLeft />
        Back to Cockpit
      </button>

      {/* Sector Header */}
      <header
        style={{
          marginBottom: 'var(--space-xl)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <HealthIndicator status={content.header.health} size="large" />
          <h1
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              margin: 0,
            }}
          >
            {content.header.label}
          </h1>
        </div>
        {content.header.subtitle && (
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--color-text-secondary)',
              margin: 0,
            }}
          >
            {content.header.subtitle}
          </p>
        )}
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginTop: 'var(--space-xs)',
          }}
        >
          {content.header.healthDetail}
        </p>
      </header>

      {/* Summary Cards Row */}
      <section style={{ marginBottom: 'var(--space-2xl)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
          }}
        >
          {content.summaryCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: 'var(--color-bg-card)',
                backgroundImage: 'var(--panel-gradient)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)',
                boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 700,
                  color: 'var(--color-text-number)',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                {card.value}
              </span>
              {card.detail && (
                <span
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {card.detail}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Department Sub-Areas */}
      <section>
        <h2
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 'var(--space-lg)',
          }}
        >
          Departments
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--space-lg)',
          }}
        >
          {content.subAreas.map((dept) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onClick={() => handleDepartmentClick(dept.id)}
              disabled={state.isTransitioning}
            />
          ))}
        </div>
      </section>

      {/* Sector Actions */}
      {content.sectorActions.length > 0 && (
        <section style={{ marginTop: 'var(--space-2xl)' }}>
          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            {content.sectorActions.map((action) => (
              <button
                key={action.id}
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-sm) var(--space-lg)',
                  color: 'var(--color-accent)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// _______________________________________________
//           DEPARTMENT CARD COMPONENT
// _______________________________________________

interface DepartmentCardProps {
  department: {
    id: string;
    type: string;
    label: string;
    health: 'green' | 'yellow' | 'red';
    summary: string;
    attentionCount: number;
  };
  onClick: () => void;
  disabled: boolean;
}

function DepartmentCard({ department, onClick, disabled }: DepartmentCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        background: 'var(--color-bg-card)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-lg)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'var(--transition-lift)',
        textAlign: 'left',
        color: 'inherit',
        boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--panel-inner-highlight)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient), var(--panel-inner-highlight)';
      }}
      aria-label={`View ${department.label} department`}
    >
      {/* Header row: health + name + attention badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        <HealthIndicator status={department.health} />
        <span
          style={{
            flex: 1,
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            color: 'var(--color-text-heading)',
          }}
        >
          {department.label}
        </span>
        {department.attentionCount > 0 && (
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 500,
              color: department.health === 'red' ? 'var(--color-badge-critical)' : 'var(--color-badge-warning)',
              backgroundColor:
                department.health === 'red' ? 'rgba(207,64,64,0.12)' : 'rgba(201,160,32,0.12)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {department.attentionCount} {department.attentionCount === 1 ? 'alert' : 'alerts'}
          </span>
        )}
      </div>

      {/* Summary text */}
      <span
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--line-height-relaxed)',
        }}
      >
        {department.summary}
      </span>

      {/* Click hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: 'auto' }}>
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-accent)',
          }}
        >
          View details
        </span>
        <ChevronRight />
      </div>
    </button>
  );
}

// _______________________________________________
//               ICON COMPONENTS
// _______________________________________________

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 4L6 8L10 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--color-accent)' }}>
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
