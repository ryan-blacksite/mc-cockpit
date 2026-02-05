/**
 * Purpose: Mock data for L2/L3 views (Organization sector drill-down).
 * Owns: Departments, agents, pulses, and tasks mock data per MC-RUNTIME-SPEC-v1.
 * Notes: Follows agent roster from runtime spec section 6. Data is demo-grade but structurally correct.
 */

import type {
  L2SectorContent,
  DepartmentDetail,
  AgentSummary,
  AgentDetail,
  PulseSummary,
} from './types';

// _______________________________________________
//          L2 ORGANIZATION SECTOR CONTENT
// _______________________________________________

export const MOCK_ORG_SECTOR_CONTENT: L2SectorContent = {
  header: {
    label: 'Organization',
    subtitle: 'Workforce structure and department health',
    health: 'yellow',
    healthDetail: '3 departments healthy, 1 needs attention, 1 at risk',
  },
  summaryCards: [
    { label: 'Total Headcount', value: 24, detail: '+2 this month' },
    { label: 'Departments', value: '5 active', detail: '1 inactive' },
    { label: 'Active Blockers', value: 6, detail: 'Across all departments' },
    { label: 'Pulse Compliance', value: '94%', detail: 'Last 24h', chartData: [88, 92, 95, 91, 94] },
  ],
  subAreas: [
    { id: 'dept-eng', type: 'department', label: 'Engineering', health: 'green', summary: '8 agents • 1 blocker • 12 open tasks', attentionCount: 1 },
    { id: 'dept-mkt', type: 'department', label: 'Marketing', health: 'yellow', summary: '4 agents • 2 blockers • 7 open tasks', attentionCount: 2 },
    { id: 'dept-fin', type: 'department', label: 'Finance', health: 'green', summary: '3 agents • 0 blockers • 3 open tasks', attentionCount: 0 },
    { id: 'dept-ops', type: 'department', label: 'Operations', health: 'green', summary: '4 agents • 0 blockers • 5 open tasks', attentionCount: 0 },
    { id: 'dept-sales', type: 'department', label: 'Sales', health: 'red', summary: '5 agents • 3 blockers • 9 open tasks', attentionCount: 3 },
  ],
  sectorActions: [
    { id: 'ack-all', label: 'Acknowledge All Alerts', actionType: 'acknowledge', targetId: null, requiresConfirmation: false },
    { id: 'pulse-all', label: 'Trigger Manual Pulse', actionType: 'quick_action', targetId: null, requiresConfirmation: true },
  ],
};

// _______________________________________________
//              MOCK AGENTS
// _______________________________________________
// Based on MC-RUNTIME-SPEC-v1 section 6 (default agent roster).

export const MOCK_AGENTS: AgentSummary[] = [
  // C-Suite (Tier 2)
  { id: 'agent-cto', name: 'Eli Thompson', role: 'CTO', tier: 2, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:30:00Z', health: 'green', activeTasks: 3, avatarInitials: 'ET' },
  { id: 'agent-cfo', name: 'Marty Byrde', role: 'CFO', tier: 2, status: 'ACTIVE', departmentId: 'dept-fin', lastPulse: '2026-02-05T14:28:00Z', health: 'green', activeTasks: 2, avatarInitials: 'MB' },
  { id: 'agent-coo', name: 'Eddie Horniman', role: 'COO', tier: 2, status: 'ACTIVE', departmentId: 'dept-ops', lastPulse: '2026-02-05T14:25:00Z', health: 'green', activeTasks: 4, avatarInitials: 'EH' },
  { id: 'agent-cmo', name: 'Emma Rivers', role: 'CMO', tier: 2, status: 'ACTIVE', departmentId: 'dept-mkt', lastPulse: '2026-02-05T14:20:00Z', health: 'yellow', activeTasks: 5, avatarInitials: 'ER' },
  { id: 'agent-cro', name: 'Jordan Blake', role: 'CRO', tier: 2, status: 'ACTIVE', departmentId: 'dept-sales', lastPulse: '2026-02-05T14:15:00Z', health: 'red', activeTasks: 6, avatarInitials: 'JB' },

  // Engineering Department
  { id: 'agent-eng-mgr', name: 'Alex Chen', role: 'Engineering Manager', tier: 3, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:32:00Z', health: 'green', activeTasks: 4, avatarInitials: 'AC' },
  { id: 'agent-eng-lead-fe', name: 'Sam Rodriguez', role: 'Frontend Lead', tier: 4, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:33:00Z', health: 'green', activeTasks: 3, avatarInitials: 'SR' },
  { id: 'agent-eng-lead-be', name: 'Taylor Kim', role: 'Backend Lead', tier: 4, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:31:00Z', health: 'green', activeTasks: 2, avatarInitials: 'TK' },
  { id: 'agent-eng-dev-1', name: 'Chris Park', role: 'Senior Developer', tier: 5, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:29:00Z', health: 'green', activeTasks: 2, avatarInitials: 'CP' },
  { id: 'agent-eng-dev-2', name: 'Morgan Lee', role: 'Developer', tier: 5, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:28:00Z', health: 'green', activeTasks: 3, avatarInitials: 'ML' },
  { id: 'agent-eng-dev-3', name: 'Jamie Nguyen', role: 'Developer', tier: 5, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:27:00Z', health: 'yellow', activeTasks: 4, avatarInitials: 'JN' },
  { id: 'agent-eng-qa', name: 'Riley Thompson', role: 'QA Engineer', tier: 5, status: 'ACTIVE', departmentId: 'dept-eng', lastPulse: '2026-02-05T14:26:00Z', health: 'green', activeTasks: 2, avatarInitials: 'RT' },

  // Marketing Department
  { id: 'agent-mkt-mgr', name: 'Dana Mitchell', role: 'Marketing Manager', tier: 3, status: 'ACTIVE', departmentId: 'dept-mkt', lastPulse: '2026-02-05T14:22:00Z', health: 'yellow', activeTasks: 3, avatarInitials: 'DM' },
  { id: 'agent-mkt-lead', name: 'Casey Adams', role: 'Content Lead', tier: 4, status: 'ACTIVE', departmentId: 'dept-mkt', lastPulse: '2026-02-05T14:21:00Z', health: 'green', activeTasks: 2, avatarInitials: 'CA' },
  { id: 'agent-mkt-spc-1', name: 'Avery Collins', role: 'Growth Specialist', tier: 5, status: 'ACTIVE', departmentId: 'dept-mkt', lastPulse: '2026-02-05T14:19:00Z', health: 'yellow', activeTasks: 3, avatarInitials: 'AC' },

  // Finance Department
  { id: 'agent-fin-mgr', name: 'Quinn Foster', role: 'Finance Manager', tier: 3, status: 'ACTIVE', departmentId: 'dept-fin', lastPulse: '2026-02-05T14:26:00Z', health: 'green', activeTasks: 2, avatarInitials: 'QF' },
  { id: 'agent-fin-analyst', name: 'Drew Martinez', role: 'Financial Analyst', tier: 5, status: 'ACTIVE', departmentId: 'dept-fin', lastPulse: '2026-02-05T14:24:00Z', health: 'green', activeTasks: 1, avatarInitials: 'DM' },

  // Operations Department
  { id: 'agent-ops-mgr', name: 'Jordan Hayes', role: 'Operations Manager', tier: 3, status: 'ACTIVE', departmentId: 'dept-ops', lastPulse: '2026-02-05T14:23:00Z', health: 'green', activeTasks: 3, avatarInitials: 'JH' },
  { id: 'agent-ops-lead', name: 'Cameron White', role: 'Process Lead', tier: 4, status: 'ACTIVE', departmentId: 'dept-ops', lastPulse: '2026-02-05T14:22:00Z', health: 'green', activeTasks: 2, avatarInitials: 'CW' },
  { id: 'agent-ops-coord', name: 'Skyler Brown', role: 'Coordinator', tier: 5, status: 'ACTIVE', departmentId: 'dept-ops', lastPulse: '2026-02-05T14:21:00Z', health: 'green', activeTasks: 2, avatarInitials: 'SB' },

  // Sales Department
  { id: 'agent-sales-mgr', name: 'Reese Taylor', role: 'Sales Manager', tier: 3, status: 'ACTIVE', departmentId: 'dept-sales', lastPulse: '2026-02-05T14:18:00Z', health: 'red', activeTasks: 5, avatarInitials: 'RT' },
  { id: 'agent-sales-lead', name: 'Parker Green', role: 'Account Lead', tier: 4, status: 'ACTIVE', departmentId: 'dept-sales', lastPulse: '2026-02-05T14:17:00Z', health: 'yellow', activeTasks: 4, avatarInitials: 'PG' },
  { id: 'agent-sales-rep-1', name: 'Finley Scott', role: 'Sales Rep', tier: 5, status: 'ACTIVE', departmentId: 'dept-sales', lastPulse: '2026-02-05T14:16:00Z', health: 'green', activeTasks: 3, avatarInitials: 'FS' },
  { id: 'agent-sales-rep-2', name: 'Rowan Davis', role: 'Sales Rep', tier: 5, status: 'ACTIVE', departmentId: 'dept-sales', lastPulse: '2026-02-05T14:14:00Z', health: 'red', activeTasks: 4, avatarInitials: 'RD' },
];

// _______________________________________________
//          MOCK AGENT DETAILS (L3+)
// _______________________________________________

export const MOCK_AGENT_DETAILS: Record<string, AgentDetail> = {
  'agent-cto': {
    ...MOCK_AGENTS.find((a) => a.id === 'agent-cto')!,
    mandate: 'Own technical strategy, architecture decisions, and engineering team health. Ensure product velocity while maintaining code quality.',
    autonomyLevel: 'A1',
    reportsTo: null,
    reportsToName: 'CEO',
    inbox: 5,
    performanceSignals: [
      { label: 'Sprint Velocity', value: '+12%', trend: 'up' },
      { label: 'Code Quality', value: 'A', trend: 'flat' },
      { label: 'Team Health', value: 'Good', trend: 'up' },
    ],
  },
  'agent-eng-mgr': {
    ...MOCK_AGENTS.find((a) => a.id === 'agent-eng-mgr')!,
    mandate: 'Coordinate engineering execution. Manage sprint planning, resource allocation, and team productivity.',
    autonomyLevel: 'A2',
    reportsTo: 'agent-cto',
    reportsToName: 'Eli Thompson (CTO)',
    inbox: 8,
    performanceSignals: [
      { label: 'Tasks Completed', value: 47, trend: 'up' },
      { label: 'Blockers Resolved', value: 12, trend: 'flat' },
      { label: 'On-Time Delivery', value: '94%', trend: 'up' },
    ],
  },
};

// _______________________________________________
//           MOCK DEPARTMENT DETAILS
// _______________________________________________

const MOCK_PULSES_ENGINEERING: PulseSummary[] = [
  { id: 'pulse-1', agentId: 'agent-cto', agentName: 'Eli Thompson', completedAt: '2026-02-05T14:30:00Z', status: 'COMPLETE', actionCount: 3 },
  { id: 'pulse-2', agentId: 'agent-eng-mgr', agentName: 'Alex Chen', completedAt: '2026-02-05T14:32:00Z', status: 'COMPLETE', actionCount: 5 },
  { id: 'pulse-3', agentId: 'agent-eng-lead-fe', agentName: 'Sam Rodriguez', completedAt: '2026-02-05T14:33:00Z', status: 'COMPLETE', actionCount: 2 },
  { id: 'pulse-4', agentId: 'agent-eng-dev-3', agentName: 'Jamie Nguyen', completedAt: '2026-02-05T14:27:00Z', status: 'FAILED', actionCount: 0 },
];

const MOCK_PULSES_MARKETING: PulseSummary[] = [
  { id: 'pulse-5', agentId: 'agent-cmo', agentName: 'Emma Rivers', completedAt: '2026-02-05T14:20:00Z', status: 'COMPLETE', actionCount: 4 },
  { id: 'pulse-6', agentId: 'agent-mkt-mgr', agentName: 'Dana Mitchell', completedAt: '2026-02-05T14:22:00Z', status: 'COMPLETE', actionCount: 2 },
];

const MOCK_PULSES_FINANCE: PulseSummary[] = [
  { id: 'pulse-7', agentId: 'agent-cfo', agentName: 'Marty Byrde', completedAt: '2026-02-05T14:28:00Z', status: 'COMPLETE', actionCount: 2 },
  { id: 'pulse-8', agentId: 'agent-fin-mgr', agentName: 'Quinn Foster', completedAt: '2026-02-05T14:26:00Z', status: 'COMPLETE', actionCount: 3 },
];

const MOCK_PULSES_OPS: PulseSummary[] = [
  { id: 'pulse-9', agentId: 'agent-coo', agentName: 'Eddie Horniman', completedAt: '2026-02-05T14:25:00Z', status: 'COMPLETE', actionCount: 4 },
  { id: 'pulse-10', agentId: 'agent-ops-mgr', agentName: 'Jordan Hayes', completedAt: '2026-02-05T14:23:00Z', status: 'COMPLETE', actionCount: 2 },
];

const MOCK_PULSES_SALES: PulseSummary[] = [
  { id: 'pulse-11', agentId: 'agent-cro', agentName: 'Jordan Blake', completedAt: '2026-02-05T14:15:00Z', status: 'COMPLETE', actionCount: 5 },
  { id: 'pulse-12', agentId: 'agent-sales-mgr', agentName: 'Reese Taylor', completedAt: '2026-02-05T14:18:00Z', status: 'FAILED', actionCount: 0 },
];

export const MOCK_DEPARTMENT_DETAILS: Record<string, DepartmentDetail> = {
  'dept-eng': {
    id: 'dept-eng',
    name: 'Engineering',
    type: 'TECHNOLOGY',
    health: 'green',
    healthDetail: 'All systems operational. 1 minor blocker in progress.',
    chiefId: 'agent-cto',
    chiefName: 'Eli Thompson (CTO)',
    headcount: 8,
    activeBlockers: 1,
    openTasks: 12,
    completedTasks: 47,
    recentPulses: MOCK_PULSES_ENGINEERING,
    agents: MOCK_AGENTS.filter((a) => a.departmentId === 'dept-eng'),
    keyMetrics: [
      { label: 'Sprint Velocity', value: '+12%', trend: 'up' },
      { label: 'Bug Count', value: 8, trend: 'down' },
      { label: 'Code Coverage', value: '87%', trend: 'up' },
      { label: 'Deploy Frequency', value: '3/day', trend: 'flat' },
    ],
  },
  'dept-mkt': {
    id: 'dept-mkt',
    name: 'Marketing',
    type: 'MARKETING',
    health: 'yellow',
    healthDetail: '2 campaigns behind schedule. Resource constraint identified.',
    chiefId: 'agent-cmo',
    chiefName: 'Emma Rivers (CMO)',
    headcount: 4,
    activeBlockers: 2,
    openTasks: 7,
    completedTasks: 23,
    recentPulses: MOCK_PULSES_MARKETING,
    agents: MOCK_AGENTS.filter((a) => a.departmentId === 'dept-mkt'),
    keyMetrics: [
      { label: 'Lead Gen', value: '+18%', trend: 'up' },
      { label: 'CAC', value: '$142', trend: 'down' },
      { label: 'MQL Rate', value: '24%', trend: 'flat' },
      { label: 'Campaign ROI', value: '3.2x', trend: 'up' },
    ],
  },
  'dept-fin': {
    id: 'dept-fin',
    name: 'Finance',
    type: 'FINANCE',
    health: 'green',
    healthDetail: 'All reports on schedule. Runway healthy.',
    chiefId: 'agent-cfo',
    chiefName: 'Marty Byrde (CFO)',
    headcount: 3,
    activeBlockers: 0,
    openTasks: 3,
    completedTasks: 18,
    recentPulses: MOCK_PULSES_FINANCE,
    agents: MOCK_AGENTS.filter((a) => a.departmentId === 'dept-fin'),
    keyMetrics: [
      { label: 'Burn Rate', value: '$85K/mo', trend: 'down' },
      { label: 'Runway', value: '14 mo', trend: 'up' },
      { label: 'AR Days', value: 28, trend: 'flat' },
      { label: 'Budget Var', value: '-3%', trend: 'flat' },
    ],
  },
  'dept-ops': {
    id: 'dept-ops',
    name: 'Operations',
    type: 'OPERATIONS',
    health: 'green',
    healthDetail: 'Process efficiency at target. No blockers.',
    chiefId: 'agent-coo',
    chiefName: 'Eddie Horniman (COO)',
    headcount: 4,
    activeBlockers: 0,
    openTasks: 5,
    completedTasks: 31,
    recentPulses: MOCK_PULSES_OPS,
    agents: MOCK_AGENTS.filter((a) => a.departmentId === 'dept-ops'),
    keyMetrics: [
      { label: 'Process Eff', value: '94%', trend: 'up' },
      { label: 'SLA Compliance', value: '99.2%', trend: 'flat' },
      { label: 'Ticket Volume', value: 127, trend: 'down' },
      { label: 'Avg Resolution', value: '4.2h', trend: 'down' },
    ],
  },
  'dept-sales': {
    id: 'dept-sales',
    name: 'Sales',
    type: 'SALES',
    health: 'red',
    healthDetail: 'Pipeline at risk. 3 deals stalled. Q1 target may miss.',
    chiefId: 'agent-cro',
    chiefName: 'Jordan Blake (CRO)',
    headcount: 5,
    activeBlockers: 3,
    openTasks: 9,
    completedTasks: 14,
    recentPulses: MOCK_PULSES_SALES,
    agents: MOCK_AGENTS.filter((a) => a.departmentId === 'dept-sales'),
    keyMetrics: [
      { label: 'Pipeline', value: '$380K', trend: 'down' },
      { label: 'Win Rate', value: '22%', trend: 'down' },
      { label: 'Avg Deal Size', value: '$12K', trend: 'flat' },
      { label: 'Quota Attain', value: '68%', trend: 'down' },
    ],
  },
};
