/**
 * Purpose: Renders a single agent card showing key agent information.
 * Owns: Agent name, role, tier, status, health, last pulse, and active tasks.
 * Notes: Used in L3 department detail views and agent roster. Clickable to zoom to agent detail.
 *        Agent tiers: 2=C-Suite, 3=Manager, 4=Lead, 5=Worker per MC-RUNTIME-SPEC-v1.
 */

import type { AgentSummary, AgentTier } from '../data/types';
import { HealthIndicator } from './HealthIndicator';

const TIER_LABELS: Record<AgentTier, string> = {
  1: 'CEO',
  2: 'C-Suite',
  3: 'Manager',
  4: 'Lead',
  5: 'Worker',
};

const TIER_COLORS: Record<AgentTier, string> = {
  1: 'var(--color-accent)',
  2: 'var(--color-accent)',
  3: 'var(--color-text-secondary)',
  4: 'var(--color-text-secondary)',
  5: 'var(--color-text-muted)',
};

interface Props {
  agent: AgentSummary;
  onClick?: () => void;
  compact?: boolean;
}

export function AgentCard({ agent, onClick, compact = false }: Props) {
  const isClickable = !!onClick;
  const lastPulseFormatted = agent.lastPulse ? formatRelativeTime(agent.lastPulse) : 'Never';

  if (compact) {
    return (
      <div
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onClick={onClick}
        onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-sm) var(--space-md)',
          background: 'var(--color-bg-panel)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          if (isClickable) {
            e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <Avatar initials={agent.avatarInitials} tier={agent.tier} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {agent.name}
            </span>
            <HealthIndicator status={agent.health} size="sm" />
          </div>
          <span
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            {agent.role}
          </span>
        </div>
        <span
          style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {agent.activeTasks} tasks
        </span>
      </div>
    );
  }

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        padding: 'var(--space-lg)',
        background: 'var(--color-bg-card)',
        backgroundImage: 'var(--panel-gradient)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'var(--transition-lift)',
        boxShadow: 'var(--shadow-ambient), var(--panel-inner-highlight)',
      }}
      onMouseEnter={(e) => {
        if (isClickable) {
          e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lift), var(--panel-inner-highlight)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-ambient), var(--panel-inner-highlight)';
      }}
      aria-label={`View ${agent.name}'s details`}
    >
      {/* Top row: Avatar + Name + Health */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
        <Avatar initials={agent.avatarInitials} tier={agent.tier} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: '2px' }}>
            <span
              style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 600,
                color: 'var(--color-text-heading)',
              }}
            >
              {agent.name}
            </span>
            <HealthIndicator status={agent.health} />
          </div>
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {agent.role}
          </span>
        </div>
        <TierBadge tier={agent.tier} />
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-lg)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <StatItem label="Tasks" value={agent.activeTasks} />
        <StatItem label="Last Pulse" value={lastPulseFormatted} />
        <StatItem label="Status" value={agent.status} highlight={agent.status !== 'ACTIVE'} />
      </div>
    </div>
  );
}

// _______________________________________________
//              SUB-COMPONENTS
// _______________________________________________

interface AvatarProps {
  initials: string;
  tier: AgentTier;
  size?: 'sm' | 'md';
}

function Avatar({ initials, tier, size = 'md' }: AvatarProps) {
  const dimensions = size === 'sm' ? 32 : 44;
  const fontSize = size === 'sm' ? 'var(--font-size-xs)' : 'var(--font-size-sm)';

  return (
    <div
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: 'var(--radius-sm)',
        background: `linear-gradient(135deg, ${TIER_COLORS[tier]}20, ${TIER_COLORS[tier]}10)`,
        border: `1px solid ${TIER_COLORS[tier]}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 600,
        color: TIER_COLORS[tier],
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

interface TierBadgeProps {
  tier: AgentTier;
}

function TierBadge({ tier }: TierBadgeProps) {
  return (
    <span
      style={{
        fontSize: 'var(--font-size-xs)',
        fontWeight: 500,
        color: TIER_COLORS[tier],
        backgroundColor: `${TIER_COLORS[tier]}15`,
        padding: '2px 8px',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
      }}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}

interface StatItemProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

function StatItem({ label, value, highlight = false }: StatItemProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span
        style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 500,
          color: highlight ? 'var(--color-badge-warning)' : 'var(--color-text-primary)',
          fontFamily: typeof value === 'number' ? 'var(--font-mono)' : 'inherit',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// _______________________________________________
//                 HELPERS
// _______________________________________________

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
