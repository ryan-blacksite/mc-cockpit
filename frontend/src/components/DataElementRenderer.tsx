/**
 * Purpose: Renders individual L1 data elements (metrics, badges, sparklines, etc.).
 * Owns: Visual display of all L1DataElement variants from the zoom spec.
 * Notes: Used inside RegionCard and MetricsHealthPanel to display sector content at L1.
 */

import type { L1DataElement, TrendDirection } from '../data/types';

function TrendArrow({ trend }: { trend?: TrendDirection }) {
  if (!trend || trend === 'flat') return <span style={{ color: 'var(--color-text-muted)' }}>-</span>;
  if (trend === 'up') return <span style={{ color: 'var(--color-health-green)' }}>&#9650;</span>;
  return <span style={{ color: 'var(--color-health-red)' }}>&#9660;</span>;
}

function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: `${(v / max) * 100}%`,
            backgroundColor: 'var(--color-accent)',
            borderRadius: 1,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 60;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
    </svg>
  );
}

interface Props {
  element: L1DataElement;
  compact?: boolean;
}

export function DataElementRenderer({ element, compact = false }: Props) {
  const labelStyle: React.CSSProperties = {
    fontSize: compact ? 'var(--font-size-xs)' : 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-xs)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: compact ? 'var(--font-size-sm)' : 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)' as unknown as number,
  };

  switch (element.type) {
    case 'metric':
      return (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={labelStyle}>{element.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            <span style={valueStyle}>{element.value}</span>
            {element.trend && <TrendArrow trend={element.trend} />}
          </div>
        </div>
      );

    case 'count_badge': {
      const severityColor =
        element.severity === 'critical'
          ? 'var(--color-badge-critical)'
          : element.severity === 'warning'
            ? 'var(--color-badge-warning)'
            : 'var(--color-badge-normal)';
      return (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={labelStyle}>{element.label}</div>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: `${severityColor}20`,
              color: severityColor,
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)' as unknown as number,
            }}
          >
            {element.count}
          </span>
        </div>
      );
    }

    case 'priority_list':
      return (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={labelStyle}>{element.label}</div>
          <ol style={{ paddingLeft: 16, margin: 0 }}>
            {element.items.slice(0, compact ? 2 : 3).map((item) => (
              <li key={item.rank} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', marginBottom: 2 }}>
                {item.text}
              </li>
            ))}
          </ol>
        </div>
      );

    case 'status_list':
      return (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={labelStyle}>{element.label}</div>
          {element.items.slice(0, compact ? 2 : 3).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 2 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor:
                    item.status === 'green' || item.status === 'completed'
                      ? 'var(--color-health-green)'
                      : item.status === 'red'
                        ? 'var(--color-health-red)'
                        : item.status === 'yellow' || item.status === 'in_progress'
                          ? 'var(--color-health-yellow)'
                          : 'var(--color-health-neutral)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)' }}>{item.text}</span>
            </div>
          ))}
        </div>
      );

    case 'avatar_row':
      return (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={labelStyle}>{element.label}</div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            {element.avatars.map((a) => (
              <span
                key={a.id}
                title={`${a.name} (${a.status})`}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: `2px solid ${a.status === 'active' ? 'var(--color-health-green)' : 'var(--color-text-muted)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {a.name.charAt(0)}
              </span>
            ))}
          </div>
        </div>
      );

    case 'chart_mini':
      return (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <div style={labelStyle}>{element.label}</div>
          {element.chart_type === 'bar' ? (
            <MiniBar data={element.data} />
          ) : (
            <Sparkline data={element.data} />
          )}
        </div>
      );

    default:
      return null;
  }
}
