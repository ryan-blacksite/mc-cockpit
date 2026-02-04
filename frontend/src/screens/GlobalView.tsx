/**
 * Purpose: L1 Global View screen — the full cockpit layout visible on load.
 * Owns: Spatial arrangement of all 6 regions per zoom spec section 1.2.
 * Notes: This file orchestrates layout only; child components handle their own rendering.
 *        Layout invariants enforced: INV-LAYOUT-001 through INV-LAYOUT-006.
 *
 *   Layout map (matches spec 1.2):
 *   ┌──────────────┬───────────────────┬──────────────────┐
 *   │  Command     │   Organization    │  Business Tiles  │
 *   │  (medium)    │   (medium)        │  (medium)        │
 *   ├──────┬───────┴───────────────────┴────────┬─────────┤
 *   │ Ops  │      Metrics & Health (large)      │  Intel  │
 *   │(sm)  │                                    │  (sm)   │
 *   ├──────┴────────────────────────────────────┴─────────┤
 *   │            Finance Settings [collapsed bar]          │
 *   └─────────────────────────────────────────────────────┘
 */

import { useData } from '../data/DataContext';
import { RegionCard } from '../components/RegionCard';
import { OrgDepartmentTile } from '../components/OrgDepartmentTile';
import { BusinessCategoryTile } from '../components/BusinessCategoryTile';
import { MetricsHealthPanel } from '../components/MetricsHealthPanel';
import { FinanceSettingsBar } from '../components/FinanceSettingsBar';
import { HealthIndicator } from '../components/HealthIndicator';

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
        padding: 'var(--space-xl)',
        gap: 'var(--space-lg)',
        maxWidth: 1600,
        margin: '0 auto',
      }}
    >
      {/* ─── TOP ROW: Command | Organization | Business Tiles ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 'var(--space-lg)',
          alignItems: 'start',
        }}
      >
        {/* Top-left: Command (medium) */}
        {command && <RegionCard region={command} />}

        {/* Top-center: Organization (medium) — title + dept tiles, no outer container (INV-LAYOUT-005) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-md)',
            }}
          >
            {organization && <HealthIndicator status={organization.health} size="md" />}
            <span
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-semibold)' as unknown as number,
                color: 'var(--color-text-heading)',
              }}
            >
              Organization
            </span>
            {organization && organization.attentionCount > 0 && (
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  backgroundColor: 'var(--color-badge-warning)20',
                  color: 'var(--color-badge-warning)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  marginLeft: 'auto',
                }}
              >
                {organization.attentionCount}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {departments.map((dept) => (
              <OrgDepartmentTile key={dept.id} department={dept} />
            ))}
          </div>
        </div>

        {/* Top-right: Four business-category tiles (INV-LAYOUT-006) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
          {businessTiles.map((tile) => (
            <BusinessCategoryTile key={tile.label} tile={tile} />
          ))}
        </div>
      </div>

      {/* ─── BOTTOM ROW: Operations | Metrics & Health | Intelligence ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 200px',
          gap: 'var(--space-lg)',
          flex: 1,
          minHeight: 300,
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
