/**
 * Purpose: Renders individual L1 data elements (metrics, badges, sparklines, etc.).
 * Owns: Visual display of all L1DataElement variants from the zoom spec.
 * Notes: Used inside RegionCard and MetricsHealthPanel to display sector content at L1.
 *        Premium typography: generous spacing, muted labels, bold numbers.
 *        Charts use subtle lines + faint fill (no bright colors dominating data).
 */

import type { L1DataElement, TrendDirection } from '../data/types';

function TrendArrow({ trend }: { trend?: TrendDirection }) {
  if (!trend || trend === 'flat')
    return <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>-</span>;
  if (trend === 'up')
    return <span style={{ color: 'var(--color-health-green)', fontSize: 'var(--font-size-xs)' }}>&#9650;</span>;
  return <span style={{ color: 'var(--color-health-red)', fontSize: 'var(--font-size-xs)' }}>&#9660;</span>;
}

function MiniBar({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 28 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: `${(v / max) * 100}%`,
            backgroundColor: 'var(--color-accent)',
            opacity: 0.5,
            borderRadius: 2,
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
  const w = 64;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');

  // Build fill polygon
  const fillPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polygon points={fillPoints} fill="var(--color-accent-glow)" />
      <polyline points={points} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

interface Props {
  element: L1DataElement;
  compact?: boolean;
}

export function DataElementRenderer({ element, compact = false }: Props) {
  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    marginBottom: 'var(--space-xs)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    lineHeight: 'var(--line-height-relaxed)',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: compact ? 'var(--font-size-base)' : 'var(--font-size-md)',
    color: 'var(--color-text-number)',
    fontWeight: 600,
    lineHeight: 'var(--line-height-tight)',
  };

  switch (element.type) {
    case 'metric':
      return (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div style={labelStyle}>{element.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
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
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div style={labelStyle}>{element.label}</div>
          <span
            style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: `${severityColor}15`,
              color: severityColor,
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
            }}
          >
            {element.count}
          </span>
        </div>
      );
    }

    case 'priority_list':
      return (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div style={labelStyle}>{element.label}</div>
          <ol style={{ paddingLeft: 16, margin: 0 }}>
            {element.items.slice(0, compact ? 2 : 3).map((item) => (
              <li
                key={item.rank}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 4,
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {item.text}
              </li>
            ))}
          </ol>
        </div>
      );

    case 'status_list':
      return (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div style={labelStyle}>{element.label}</div>
          {element.items.slice(0, compact ? 2 : 3).map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 4,
              }}
            >
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
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      );

    case 'avatar_row':
      return (
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <div style={labelStyle}>{element.label}</div>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            {element.avatars.map((a) => (
              <span
                key={a.id}
                title={`${a.name} (${a.status})`}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-panel)',
                  border: `2px solid ${a.status === 'active' ? 'var(--color-health-green)' : 'var(--color-text-muted)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  boxShadow: 'var(--shadow-inset)',
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
        <div style={{ marginBottom: 'var(--space-md)' }}>
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
