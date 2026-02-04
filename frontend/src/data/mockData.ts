/**
 * Purpose: Hardcoded mock data for the L1 Global View.
 * Owns: All placeholder data used before the real API is available.
 * Notes: Structure mirrors zoom spec v1 sections 6.1–6.7. Data is realistic but fictional.
 */

import type {
  RegionSummary,
  DepartmentTileSummary,
  BusinessCategoryTile,
  FinanceSettingsBarData,
} from './types';

// _______________________________________________
//              REGION SUMMARIES (L1)
// _______________________________________________

export const MOCK_REGION_SUMMARIES: RegionSummary[] = [
  {
    sectorType: 'COMMAND',
    displayLabel: 'Command',
    health: 'green',
    attentionCount: 2,
    headlineKpi: '3 Active Priorities',
    stats: [
      { label: 'Pending Decisions', value: 2 },
      { label: 'Active Overrides', value: 0 },
    ],
    dataElements: [
      {
        type: 'priority_list',
        label: 'Active Priorities',
        items: [
          { rank: 1, text: 'Launch v2 platform by Q2' },
          { rank: 2, text: 'Close Series A extension' },
          { rank: 3, text: 'Hire VP Engineering' },
        ],
      },
      { type: 'count_badge', label: 'Pending Decisions', count: 2, severity: 'normal' },
      { type: 'metric', label: 'Board Status', value: '2 sessions / 1 advisory' },
      { type: 'count_badge', label: 'Active Overrides', count: 0, severity: 'normal' },
    ],
  },
  {
    sectorType: 'ORGANIZATION',
    displayLabel: 'Organization',
    health: 'yellow',
    attentionCount: 3,
    headlineKpi: '24 agents across 5 depts',
    stats: [
      { label: 'Active Blockers', value: 3 },
      { label: 'Departments', value: '5 active / 6 total' },
    ],
    dataElements: [
      {
        type: 'avatar_row',
        label: 'C-Suite',
        avatars: [
          { id: 'cto', name: 'CTO', status: 'active' },
          { id: 'cfo', name: 'CFO', status: 'active' },
          { id: 'coo', name: 'COO', status: 'idle' },
          { id: 'cmo', name: 'CMO', status: 'active' },
        ],
      },
      { type: 'metric', label: 'Total Headcount', value: 24 },
      { type: 'count_badge', label: 'Active Blockers', count: 3, severity: 'warning' },
      { type: 'chart_mini', label: 'Staffing Trend', data: [18, 20, 21, 22, 24], chart_type: 'sparkline' },
      { type: 'metric', label: 'Departments', value: '5 active / 6 total' },
    ],
  },
  {
    sectorType: 'OPERATIONS',
    displayLabel: 'Operations',
    health: 'green',
    attentionCount: 1,
    headlineKpi: '2 Open Advisories',
    stats: [
      { label: 'Board Members', value: 3 },
      { label: 'Operations Health', value: 'Stable' },
    ],
    dataElements: [
      {
        type: 'avatar_row',
        label: 'Board',
        avatars: [
          { id: 'board-1', name: 'Sarah Chen', status: 'active' },
          { id: 'board-2', name: 'James Wright', status: 'active' },
          { id: 'board-3', name: 'Maria Lopez', status: 'idle' },
        ],
      },
      { type: 'metric', label: 'Open Advisories', value: 2 },
      {
        type: 'status_list',
        label: 'Recent Sessions',
        items: [
          { text: 'Q1 Strategy Review', status: 'completed' },
          { text: 'Risk Assessment', status: 'in_progress' },
        ],
      },
      { type: 'metric', label: 'Operations Health', value: 'Stable', trend: 'flat' },
    ],
  },
  {
    sectorType: 'METRICS',
    displayLabel: 'Metrics & Health',
    health: 'yellow',
    attentionCount: 4,
    headlineKpi: '$42K MRR',
    stats: [
      { label: 'North Star', value: '$42K MRR' },
      { label: 'Burn Rate', value: '$85K/mo' },
      { label: 'Runway', value: '14 months' },
    ],
    dataElements: [
      { type: 'metric', label: 'North Star', value: '$42K MRR', trend: 'up' },
      { type: 'chart_mini', label: 'Goal Progress', data: [45, 62, 78, 55, 90], chart_type: 'bar' },
      { type: 'count_badge', label: 'Attention Items', count: 4, severity: 'warning' },
      { type: 'metric', label: 'Health', value: 'Moderate' },
      {
        type: 'status_list',
        label: 'Key Metrics',
        items: [
          { text: 'Revenue Growth +18%', status: 'green' },
          { text: 'Churn Rate 4.2%', status: 'yellow' },
          { text: 'NPS Score 62', status: 'green' },
        ],
      },
      { type: 'metric', label: 'Burn Rate', value: '$85K/mo', trend: 'down' },
      { type: 'metric', label: 'Runway', value: '14 months', trend: 'up' },
      { type: 'chart_mini', label: 'Spend', data: [72, 78, 85, 82, 88, 85], chart_type: 'line' },
    ],
  },
  {
    sectorType: 'INTELLIGENCE',
    displayLabel: 'Intelligence',
    health: 'green',
    attentionCount: 0,
    headlineKpi: '47 Decisions Logged',
    stats: [
      { label: 'Knowledge Entries', value: 128 },
    ],
    dataElements: [
      { type: 'metric', label: 'Decisions Logged', value: 47 },
      { type: 'metric', label: 'Knowledge Entries', value: 128 },
      {
        type: 'status_list',
        label: 'Recent Activity',
        items: [
          { text: 'Budget reallocation approved', status: 'completed' },
          { text: 'Hiring freeze memo logged', status: 'completed' },
          { text: 'Vendor contract review', status: 'in_progress' },
        ],
      },
    ],
  },
  {
    sectorType: 'FINANCE',
    displayLabel: 'Finance Settings',
    health: 'green',
    attentionCount: 0,
    headlineKpi: 'Pulse: 15min',
    stats: [
      { label: 'Integrations', value: '3 active' },
      { label: 'Budget Utilization', value: '72%' },
    ],
    dataElements: [],
  },
];

// _______________________________________________
//           DEPARTMENT TILES (Organization)
// _______________________________________________

export const MOCK_DEPARTMENT_TILES: DepartmentTileSummary[] = [
  { id: 'dept-eng', name: 'Engineering', health: 'green', openItems: 12, risks: 1, headcount: 8 },
  { id: 'dept-mkt', name: 'Marketing', health: 'yellow', openItems: 7, risks: 2, headcount: 4 },
  { id: 'dept-fin', name: 'Finance', health: 'green', openItems: 3, risks: 0, headcount: 3 },
  { id: 'dept-ops', name: 'Operations', health: 'green', openItems: 5, risks: 0, headcount: 4 },
  { id: 'dept-sales', name: 'Sales', health: 'red', openItems: 9, risks: 3, headcount: 5 },
];

// _______________________________________________
//         BUSINESS CATEGORY TILES (Top-Right)
// _______________________________________________

export const MOCK_BUSINESS_CATEGORY_TILES: BusinessCategoryTile[] = [
  { label: 'Customers', health: 'green', summaryStat: 'NPS 62 | 1,240 active' },
  { label: 'Growth', health: 'yellow', summaryStat: '+18% MoM | 3 campaigns' },
  { label: 'Product & Delivery', health: 'green', summaryStat: '92% on-track | 2 sprints' },
  { label: 'People', health: 'green', summaryStat: '24 agents | 1 open role' },
];

// _______________________________________________
//           FINANCE SETTINGS BAR
// _______________________________________________

export const MOCK_FINANCE_SETTINGS_BAR: FinanceSettingsBarData = {
  label: 'Finance Settings',
  quickStats: 'Pulse: 15min | Integrations: 3 active | Budget: 72%',
};
