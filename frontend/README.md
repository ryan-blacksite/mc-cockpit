# Mission Control – Frontend (B-1 Cockpit Shell)

Frontend-only cockpit shell rendering the Global View (L1) as defined in `MC-COCKPIT-ZOOM-SPEC-v1.md`.

## Quick Start

```bash
cd frontend
npm install
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # TypeScript check + production build
```

## Structure

| Path | Purpose |
|------|---------|
| `src/screens/` | Screen-level components (GlobalView, placeholders) |
| `src/components/` | UI components (RegionCard, MetricsHealthPanel, etc.) |
| `src/data/` | Types, mock data, DataProvider abstraction |
| `src/routes/` | React Router configuration |
| `src/styles/` | Design tokens and global CSS |
| `src/lib/` | Shared helpers |

## Data Layer

All data flows through a `DataProvider` interface (`src/data/DataProvider.ts`). The current implementation is `MockDataProvider` (hardcoded JSON). To connect to a real API, implement `ApiDataProvider` and swap it in `src/data/DataContext.tsx`.

## Notes

- Desktop-first (viewport < 768px not supported)
- No backend/Supabase dependencies — pure frontend sandbox
- Routing stubs navigate to placeholder screens for L2+ views
