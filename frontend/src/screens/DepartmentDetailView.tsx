/**
 * Purpose: L3 detail view for a department within the Organization sector.
 * Owns: Full department detail including agents, metrics, recent pulses, and tasks.
 * Notes: Per MC-COCKPIT-ZOOM-SPEC-v1 section 3.4, this is the element detail view showing
 *        full control over the department. Agent roster grouped by tier per runtime spec.
 *        Follows INV-CTRL-003 (element mutation controls appear at L3+).
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../data/DataContext';
import { useZoom } from '../zoom/ZoomContext';
import { Breadcrumb } from '../components/Breadcrumb';
import { HealthIndicator } from '../components/HealthIndicator';
import { AgentRoster } from '../components/AgentRoster';

export function DepartmentDetailView() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const data = useData();
  const { state, zoomOut } = useZoom();
  const navigate = useNavigate();

  const department = departmentId ? data.getDepartmentDetail(departmentId) : undefined;

  const handleBackClick = () => {
    zoomOut();
    navigate('/zoom/ORGANIZATION');
  };

  const handleBackToCockpit = () => {
    navigate('/');
  };

  if (!department) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}
      >
        <h1 style={{ color: 'var(--color-text-heading)', fontSize: 'var(--font-size-xl)' }}>
          Department Not Found
        </h1>
        <button
          onClick={handleBackToCockpit}
          style={{
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-sm) var(--space-lg)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Back to Cockpit
        </button>
      </div>
    );
  }

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
        Back to Organization
      </button>

      {/* Department Header */}
      <header style={{ marginBottom: 'var(--space-2xl)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
              <HealthIndicator status={department.health} size="large" />
              <h1
                style={{
                  fontSize: 'var(--font-size-3xl)',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  margin: 0,
                }}
              >
                {department.name}
              </h1>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  backgroundColor: 'var(--color-bg-panel)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {department.type}
              </span>
            </div>
            <p
              style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              {department.healthDetail}
            </p>
            {department.chiefName && (
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)',
                  marginTop: 'var(--space-xs)',
                }}
              >
                Led by {department.chiefName}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Two-column layout: Main content + Sidebar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 'var(--space-2xl)',
          alignItems: 'start',
        }}
      >
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
          {/* Key Metrics */}
          <section>
            <SectionHeader title="Key Metrics" />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 'var(--space-md)',
              }}
            >
              {department.keyMetrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </section>

          {/* Agent Roster */}
          <section>
            <SectionHeader title="Team" subtitle={`${department.headcount} agents`} />
            <AgentRoster agents={department.agents} />
          </section>

          {/* Recent Pulses */}
          <section>
            <SectionHeader title="Recent Pulses" />
            <div
              style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              {department.recentPulses.length === 0 ? (
                <div
                  style={{
                    padding: 'var(--space-xl)',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  No recent pulse activity.
                </div>
              ) : (
                department.recentPulses.map((pulse, idx) => (
                  <PulseRow key={pulse.id} pulse={pulse} isLast={idx === department.recentPulses.length - 1} />
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Quick Stats */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              backgroundImage: 'var(--panel-gradient)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
              boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Quick Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <StatRow label="Headcount" value={department.headcount} />
              <StatRow label="Open Tasks" value={department.openTasks} />
              <StatRow label="Completed" value={department.completedTasks} />
              <StatRow
                label="Active Blockers"
                value={department.activeBlockers}
                highlight={department.activeBlockers > 0}
              />
            </div>
          </div>

          {/* Actions Panel (L3 controls per INV-CTRL-003) */}
          <div
            style={{
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-lg)',
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              <ActionButton label="Trigger Department Pulse" />
              <ActionButton label="View All Tasks" />
              <ActionButton label="Export Report" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// _______________________________________________
//              SUB-COMPONENTS
// _______________________________________________

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
      <h2
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{subtitle}</span>
      )}
    </div>
  );
}

interface MetricCardProps {
  metric: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'flat';
  };
}

function MetricCard({ metric }: MetricCardProps) {
  return (
    <div
      style={{
        background: 'var(--color-bg-card)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
      }}
    >
      <span
        style={{
          display: 'block',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          marginBottom: 'var(--space-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {metric.label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <span
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 700,
            color: 'var(--color-text-number)',
          }}
        >
          {metric.value}
        </span>
        {metric.trend && <TrendIndicator trend={metric.trend} />}
      </div>
    </div>
  );
}

function TrendIndicator({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  const colors = {
    up: 'var(--color-health-green)',
    down: 'var(--color-health-red)',
    flat: 'var(--color-text-muted)',
  };
  const arrows = {
    up: '↑',
    down: '↓',
    flat: '→',
  };

  return (
    <span style={{ color: colors[trend], fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
      {arrows[trend]}
    </span>
  );
}

interface PulseRowProps {
  pulse: {
    id: string;
    agentName: string;
    completedAt: string;
    status: 'COMPLETE' | 'FAILED';
    actionCount: number;
  };
  isLast: boolean;
}

function PulseRow({ pulse, isLast }: PulseRowProps) {
  const time = formatTime(pulse.completedAt);
  const isFailed = pulse.status === 'FAILED';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md) var(--space-lg)',
        borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isFailed ? 'var(--color-health-red)' : 'var(--color-health-green)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          flex: 1,
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-primary)',
        }}
      >
        {pulse.agentName}
      </span>
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: isFailed ? 'var(--color-health-red)' : 'var(--color-text-secondary)',
          fontWeight: isFailed ? 500 : 400,
        }}
      >
        {isFailed ? 'FAILED' : `${pulse.actionCount} actions`}
      </span>
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {time}
      </span>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatRow({ label, value, highlight = false }: StatRowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{label}</span>
      <span
        style={{
          fontSize: 'var(--font-size-base)',
          fontWeight: 600,
          color: highlight ? 'var(--color-badge-warning)' : 'var(--color-text-number)',
          fontFamily: typeof value === 'number' ? 'var(--font-mono)' : 'inherit',
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
}

function ActionButton({ label }: ActionButtonProps) {
  return (
    <button
      style={{
        display: 'block',
        width: '100%',
        padding: 'var(--space-sm) var(--space-md)',
        background: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-accent)',
        fontSize: 'var(--font-size-sm)',
        textAlign: 'left',
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
      {label}
    </button>
  );
}

// _______________________________________________
//                   ICONS
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

// _______________________________________________
//                  HELPERS
// _______________________________________________

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
