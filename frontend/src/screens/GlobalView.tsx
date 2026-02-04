/**
 * Purpose: L1 Global View screen — the full cockpit layout visible on load.
 * Owns: Spatial arrangement of all 6 regions per zoom spec section 1.2.
 * Notes: This file orchestrates layout only; child components handle their own rendering.
 *        Layout invariants enforced: INV-LAYOUT-001 through INV-LAYOUT-006.
 *
 *   Layout map (premium metal console):
 *   ┌──────────┬──────────────────────────┬─────────────┐
 *   │ Command  │   Business Window (hero)  │  Biz Tiles  │
 *   │ (medium) │   + Organization overlay  │  (stacked)  │
 *   │          ├──────────────────────────┤             │
 *   │          │   Department tiles        │             │
 *   ├──────────┼──────────────────────────┼─────────────┤
 *   │   Ops    │   Metrics & Health (lg)   │    Intel    │
 *   │   (sm)   │                          │    (sm)     │
 *   ├──────────┴──────────────────────────┴─────────────┤
 *   │           Finance Settings [collapsed bar]         │
 *   └───────────────────────────────────────────────────┘
 */

import { useData } from '../data/DataContext';
import { RegionCard } from '../components/RegionCard';
import { OrgDepartmentTile } from '../components/OrgDepartmentTile';
import { BusinessCategoryTile } from '../components/BusinessCategoryTile';
import { MetricsHealthPanel } from '../components/MetricsHealthPanel';
import { FinanceSettingsBar } from '../components/FinanceSettingsBar';
import { BusinessWindowPanel } from '../components/BusinessWindowPanel';

export function GlobalView() {
  const data = useData();

  const regions = data.getAllRegionSummaries();
  const command = regions.find((r) => r.sectorType === 'COMMAND');
  const organization = regions.find((r) => r.sectorType === 'ORGANIZATION');
  const operations = regions.find((r) => r.sectorType === 'OPERATIONS');
  const metrics = regions.find((r) => r.sectorType === 'METRICS');
  const intelligence = regions.find((r) => r.sectorType === 'INTELLIGENCE');

  const departments = data.getDepartmentTiles();
  const businessTiles = data.getBusinessCategoryTiles();
  const financeBar = data.getFinanceSettingsBar();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 'var(--space-2xl)',
        gap: 'var(--space-xl)',
        maxWidth: 1600,
        margin: '0 auto',
      }}
    >
      {/* ─── TOP ROW: Command | Business Window + Dept Tiles | Business Tiles ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr 220px',
          gap: 'var(--space-xl)',
          alignItems: 'start',
        }}
      >
        {/* Top-left: Command (medium) */}
        {command && <RegionCard region={command} />}

        {/* Top-center: Business Window hero + Department tiles beneath */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Hero Business Window — the cockpit's main viewport */}
          {organization && <BusinessWindowPanel organization={organization} />}

          {/* Department tiles row beneath the hero panel */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: 'var(--space-md)',
            }}
          >
            {departments.map((dept) => (
              <OrgDepartmentTile key={dept.id} department={dept} />
            ))}
          </div>
        </div>

        {/* Top-right: Business category tiles stacked (INV-LAYOUT-006) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }}
        >
          {businessTiles.map((tile) => (
            <BusinessCategoryTile key={tile.label} tile={tile} />
          ))}
        </div>
      </div>

      {/* ─── BOTTOM ROW: Operations | Metrics & Health | Intelligence ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr 220px',
          gap: 'var(--space-xl)',
          flex: 1,
          minHeight: 280,
        }}
      >
        {/* Bottom-left: Operations (small) */}
        {operations && <RegionCard region={operations} />}

        {/* Bottom-center: Metrics & Health (large) — INV-LAYOUT-001 */}
        {metrics && <MetricsHealthPanel region={metrics} />}

        {/* Bottom-right: Intelligence (small) */}
        {intelligence && <RegionCard region={intelligence} />}
      </div>

      {/* ─── BOTTOM BAR: Finance Settings [collapsed] ─── */}
      {/* Finance is NOT a main region tile (INV-LAYOUT-002) */}
      <FinanceSettingsBar data={financeBar} />
    </div>
  );
}
