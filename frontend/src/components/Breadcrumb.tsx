/**
 * Purpose: Breadcrumb navigation for zoom levels L2+.
 * Owns: Renders clickable breadcrumb trail per MC-COCKPIT-ZOOM-SPEC-v1 section 5.3.
 * Notes: Max 4 visible items with ellipsis for deeper stacks. Hidden at L1 (INV-VIS-003).
 */

import { useZoom, type ZoomStackEntry } from '../zoom/ZoomContext';

const MAX_VISIBLE = 4;

export function Breadcrumb() {
  const { state, zoomTo } = useZoom();

  // Hidden at L1 (INV-VIS-003)
  if (state.currentLevel === 1) {
    return null;
  }

  const breadcrumbs = state.zoomStack;
  const showEllipsis = breadcrumbs.length > MAX_VISIBLE;

  // Show first + last 3 if longer than MAX_VISIBLE
  const firstBreadcrumb = breadcrumbs[0];
  const visibleBreadcrumbs: (ZoomStackEntry | 'ellipsis')[] = showEllipsis && firstBreadcrumb
    ? [firstBreadcrumb, 'ellipsis', ...breadcrumbs.slice(-3)]
    : breadcrumbs;

  return (
    <nav
      aria-label="Breadcrumb navigation"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        padding: 'var(--space-md) var(--space-lg)',
        background: 'var(--color-bg-panel)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--space-lg)',
      }}
    >
      {visibleBreadcrumbs.map((item, idx) => {
        if (item === 'ellipsis') {
          return (
            <span
              key="ellipsis"
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              ...
            </span>
          );
        }

        const isLast = idx === visibleBreadcrumbs.length - 1;
        const actualIndex = item === breadcrumbs[0] ? 0 : breadcrumbs.indexOf(item);

        return (
          <span key={item.level + '-' + item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            {idx > 0 && (
              <ChevronRight />
            )}
            {isLast ? (
              <span
                style={{
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 500,
                }}
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => zoomTo(actualIndex)}
                disabled={state.isTransitioning}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: 'var(--color-accent)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: state.isTransitioning ? 'not-allowed' : 'pointer',
                  opacity: state.isTransitioning ? 0.5 : 1,
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!state.isTransitioning) {
                    e.currentTarget.style.textDecoration = 'underline';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function ChevronRight() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ color: 'var(--color-text-muted)' }}
    >
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
