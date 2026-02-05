/**
 * Purpose: Renders a grouped list of agents organized by tier.
 * Owns: Agent grouping by tier (C-Suite → Manager → Lead → Worker) with expand/collapse.
 * Notes: Per MC-RUNTIME-SPEC-v1 section 2.4, agents have tiers 1-5. Tier 1 (CEO) is excluded
 *        from department rosters. Groups are ordered highest tier first (INV-AUTH-004).
 */

import { useState } from 'react';
import type { AgentSummary, AgentTier } from '../data/types';
import { AgentCard } from './AgentCard';

const TIER_GROUP_LABELS: Record<AgentTier, string> = {
  1: 'Executive',
  2: 'C-Suite',
  3: 'Managers',
  4: 'Leads',
  5: 'Workers',
};

const TIER_ORDER: AgentTier[] = [2, 3, 4, 5]; // Exclude CEO (tier 1)

interface Props {
  agents: AgentSummary[];
  onAgentClick?: (agentId: string) => void;
  compact?: boolean;
}

export function AgentRoster({ agents, onAgentClick, compact = false }: Props) {
  const [expandedTiers, setExpandedTiers] = useState<Set<AgentTier>>(new Set(TIER_ORDER));

  // Group agents by tier
  const groupedAgents = agents.reduce(
    (acc, agent) => {
      if (!acc[agent.tier]) {
        acc[agent.tier] = [];
      }
      acc[agent.tier].push(agent);
      return acc;
    },
    {} as Record<AgentTier, AgentSummary[]>
  );

  const toggleTier = (tier: AgentTier) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) {
        next.delete(tier);
      } else {
        next.add(tier);
      }
      return next;
    });
  };

  const nonEmptyTiers = TIER_ORDER.filter((tier) => groupedAgents[tier]?.length > 0);

  if (agents.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-xl)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        No agents in this department.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {nonEmptyTiers.map((tier) => {
        const tierAgents = groupedAgents[tier];
        const isExpanded = expandedTiers.has(tier);

        return (
          <div key={tier}>
            {/* Tier Group Header */}
            <button
              onClick={() => toggleTier(tier)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                width: '100%',
                padding: 'var(--space-sm) 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'inherit',
                marginBottom: 'var(--space-md)',
              }}
            >
              <ChevronIcon expanded={isExpanded} />
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {TIER_GROUP_LABELS[tier]}
              </span>
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  marginLeft: 'auto',
                }}
              >
                {tierAgents.length} agent{tierAgents.length !== 1 ? 's' : ''}
              </span>
            </button>

            {/* Agents in Tier */}
            {isExpanded && (
              <div
                style={{
                  display: compact ? 'flex' : 'grid',
                  flexDirection: compact ? 'column' : undefined,
                  gridTemplateColumns: compact ? undefined : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: compact ? 'var(--space-sm)' : 'var(--space-md)',
                  paddingLeft: 'var(--space-lg)',
                }}
              >
                {tierAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onClick={onAgentClick ? () => onAgentClick(agent.id) : undefined}
                    compact={compact}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        color: 'var(--color-text-muted)',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 150ms ease',
      }}
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
