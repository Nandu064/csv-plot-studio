# CSV Plot Studio

A high-performance, browser-based CSV visualization tool. Upload any CSV and create interactive charts instantly. All processing runs locally — your data never leaves your machine.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript)
![Plotly](https://img.shields.io/badge/Plotly.js-3.x-3f4f75?logo=plotly)
![License](https://img.shields.io/badge/License-MIT-818cf8)

## Features

### Core

- **8 Chart Types** — Scatter, Line, Bar, Histogram, Box, Violin, 3D Scatter, Surface
- **WebGL Rendering** — Automatically switches to GPU-accelerated `scattergl` traces for datasets over 20K points, preventing UI freeze
- **Web Worker Parsing** — CSV files up to 50MB parsed off the main thread with progress updates
- **Virtual Table** — Data preview uses true virtual scrolling, rendering only visible rows for instant response even with 1M+ rows
- **Smart Sampling** — Deterministic sampling for large datasets preserves data distribution while keeping charts responsive
- **Chart Persistence** — Chart configs stored in localStorage keyed by column header signature; re-upload the same CSV structure and your charts restore automatically

### UI & Pages

- **Dashboard** — Aggregate stats (datasets, charts, rows processed), chart type breakdown, quick actions
- **Workspace** — Full chart editor with multi-series support, color-by column, sampling controls, point-click detail modals
- **Privacy Policy** — Full privacy page documenting local-only processing
- **Terms of Service** — Usage terms and disclaimers
- **Dark Theme** — Midnight Pro color scheme with indigo/violet accents and glow effects

### Data Intelligence

- **Auto Type Detection** — Numbers, dates (ISO 8601 & US formats), booleans (true/false/yes/no/1/0), text, mixed
- **Column Metadata** — Min/max, unique count, NaN count, date format detection
- **Filtering** — Numeric range, category selection, boolean toggle, date range filters
- **Export** — Download any chart as high-res PNG (1200x800)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Static Export) |
| Language | TypeScript (Strict) |
| Charts | Plotly.js + react-plotly.js |
| CSV Parsing | PapaParse (Web Worker) |
| State | Zustand (persisted) |
| Styling | SCSS Modules |
| Testing | Vitest + Testing Library |
| Icons | Lucide React |
| Alerts | SweetAlert2 |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # Development server (Turbopack)
npm run build      # Static export → /out
npm start          # Serve production build
npm run lint       # ESLint check
npm test           # Run Vitest suite
npm run test:watch # Watch mode
```

## Project Structure

```
csv-plot-studio/
├── app/
│   ├── page.tsx              # Home — upload & recents
│   ├── layout.tsx            # Root layout with Navbar + Footer
│   ├── error.tsx             # Error boundary
│   ├── workspace/page.tsx    # Chart editor & data preview
│   ├── dashboard/page.tsx    # Stats & overview
│   ├── privacy/page.tsx      # Privacy policy
│   └── terms/page.tsx        # Terms of service
├── components/
│   ├── layout/               # Navbar, Footer (shared)
│   ├── plot/                 # PlotlyChart, ChartLoader
│   ├── upload/               # UploadDropzone
│   ├── workspace/            # ChartGrid, ChartEditor, DataTable,
│   │                         # DatasetSummary, FilterPanel, PointDetailsModal
│   └── ui/                   # Portal
├── lib/
│   ├── constants/limits.ts   # File size, row, sampling thresholds
│   ├── stores/               # Zustand: dataset, charts, filters, recents
│   ├── types/                # TypeScript interfaces
│   ├── ui/alerts.ts          # Toast & confirm dialogs
│   └── utils/                # CSV building, type inference, chart builders,
│                             # sampling, filters, chart colors
├── workers/
│   └── csv-parser.worker.ts  # Background CSV parsing
├── __tests__/                # Vitest test suite
├── public/                   # Static assets (logo, icon, sample.csv)
└── types/                    # Plotly type declarations
```

## Performance Architecture

The app is built to handle large datasets without freezing the UI:

1. **Parsing** — A Web Worker reads and parses the CSV file off the main thread. The UI shows real-time progress messages.
2. **Type Inference** — Column types are inferred from a sample of 1,000 rows, not the full dataset.
3. **Chart Building** — `buildChartData()` output is memoized with `useMemo`. Chart cards are wrapped in `React.memo()`.
4. **WebGL** — For datasets exceeding 20K rows, scatter plots automatically use `scattergl` for GPU-accelerated rendering.
5. **Sampling** — Datasets over 30K rows use deterministic sampling (every nth row) to maintain distribution.
6. **Virtual Scrolling** — The data table renders only the rows visible in the viewport plus a small overscan buffer.

## CSV Requirements

| Constraint | Limit |
|-----------|-------|
| File size | 50 MB |
| Rows | 1,000,000 |
| Columns | 100 |
| Format | Valid CSV with header row |

## Deployment

The app builds to a fully static `/out` directory. Deploy anywhere:

```bash
npm run build
```

**Vercel** — Push to GitHub, import in Vercel. Zero config.

**Netlify** — Build command: `npm run build`, publish directory: `out`.

**Any static host** — Upload the contents of `/out`.

## Browser Support

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

---

Built with Next.js, Plotly.js, and PapaParse.
