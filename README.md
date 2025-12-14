# CSV Plot Studio

A powerful CSV visualization tool built with Next.js and Plotly.js. Upload CSV files and create interactive, publication-ready charts directly in your browser.

## Features

- 📊 **Multiple Chart Types**: Scatter, Line, Bar, Histogram, Box, 3D Scatter, and Surface plots
- 🚀 **Web Worker CSV Parsing**: Non-blocking parsing for large files (up to 50MB)
- 💾 **Smart Persistence**: Charts are saved and restored when you re-upload the same dataset
- 🎯 **Deterministic Sampling**: Handle datasets with millions of rows without performance issues
- 🎨 **Dark Brutalist Theme**: Clean, modern UI with financial-grade aesthetics
- 📱 **Fully Static**: Deployable to Netlify, Vercel, or any static host
- 🔒 **Privacy-First**: All processing happens in your browser—no data sent to servers

## Tech Stack

- **Next.js 16** (App Router, Static Export)
- **TypeScript** (Strict mode)
- **Plotly.js** (Interactive charts)
- **PapaParse** (CSV parsing)
- **Zustand** (State management)
- **SCSS Modules** (Styling)
- **Vitest** (Testing)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory.

### Run Tests

```bash
npm test
```

## Project Structure

```
csv-plot-studio/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── plot/            # Plotly chart wrapper
│   ├── upload/          # File upload UI
│   └── workspace/       # Chart editing & preview
├── lib/
│   ├── constants/       # Configuration & limits
│   ├── stores/          # Zustand state stores
│   ├── types/           # TypeScript types
│   └── utils/           # CSV processing utilities
├── workers/             # Web Workers for CSV parsing
├── public/              # Static assets
└── __tests__/           # Test files
```

## Deployment to Netlify

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Netlify**

   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your GitHub repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `out`
   - Click "Deploy site"

3. **Custom Domain** (optional)
   - Go to Site settings → Domain management
   - Add your custom domain

## CSV Requirements

- **Format**: Valid CSV with headers
- **Max file size**: 50MB
- **Max rows**: 1,000,000
- **Max columns**: 100

## Features in Detail

### Automatic Type Detection

The app intelligently detects column types:

- **Numbers**: Statistical summaries (min, max, NaN count)
- **Dates**: ISO 8601 and US formats
- **Booleans**: true/false, yes/no, 1/0
- **Text**: String values
- **Mixed**: Columns with multiple types

### Smart Sampling

For datasets over 50,000 rows, deterministic sampling keeps charts responsive while maintaining data distribution.

### Chart Persistence

Charts are stored in browser localStorage using a signature derived from column headers. When you re-upload the same dataset structure, your charts are restored automatically.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

Built with ❤️ using Next.js and Plotly.js
