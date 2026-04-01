# AGENTS.md - Split Bill

## Project Overview

Vite + React 19 + TypeScript application for splitting bills among groups. All dependencies installed via npm (no CDN).

**Tech Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Tesseract.js (OCR), dom-to-image (export).

## Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing / Linting
- **No test framework** — manual testing in browser only
- **No linter** — no ESLint or Prettier config
- TypeScript strict mode is **disabled** (`strict: false` in tsconfig)

To verify changes, run `npm run dev` and test all features manually in the browser.

## Project Structure

```
split-bill/
├── index.html                  # Entry HTML (Vite, Google Fonts only)
├── index.copy.html             # Original single-file app (legacy)
├── package.json
├── vite.config.ts              # Vite + React + Tailwind plugins
├── tsconfig.json
├── AGENTS.md
└── src/
    ├── main.tsx                # React root entry point
    ├── App.tsx                 # Root component
    ├── SplitBill.tsx           # Main application component
    ├── translations.ts         # EN/ID translation strings + types
    ├── index.css               # Tailwind import + dark mode variant + animations
    ├── vite-env.d.ts           # Vite type declarations
    ├── types/
    │   └── index.ts            # TypeScript interfaces (BillItem, BankAccount, etc.)
    ├── icons/
    │   └── index.tsx           # All SVG icon components (22 icons)
    └── components/
        ├── FormattedInput.tsx  # Currency/percentage input with Rp/% prefix
        ├── AccountSelector.tsx # Bank account dropdown + custom account modal
        └── ConfirmModal.tsx    # Confirmation dialog modal
```

## Code Style & Conventions

### Architecture
- **Component-based**: Split into logical files (icons, components, types, translations)
- **Single root component**: `SplitBill` contains all state and logic
- **localStorage persistence**: All state auto-saves to `localStorage`

### Imports & Dependencies
- All dependencies from npm (no CDN):
  - `react`, `react-dom` — UI framework
  - `tesseract.js` — OCR engine
  - `dom-to-image` — image export
  - `tailwindcss`, `@tailwindcss/vite` — styling
- Use ES module imports with `.tsx`/`.ts` extensions omitted

### Naming Conventions
- **Components**: PascalCase (`SplitBill`, `AccountSelector`, `ConfirmModal`)
- **Icon components**: PascalCase, named after the icon (`Trash2`, `Plus`, `Users`)
- **State variables**: camelCase (`items`, `persons`, `darkMode`, `roundTo100`)
- **Event handlers**: camelCase, action-prefixed (`handleScanReceipt`, `addItem`)
- **Helper functions**: camelCase (`formatMoney`, `calculateSplit`, `parseReceiptText`)
- **Constants**: UPPER_SNAKE_CASE (`STORAGE_KEY`, `LANGUAGE_KEY`, `VERSION_KEY`)
- **Mixed language**: Indonesian variable names preserved (`ongkir`, `biayaLayanan`, `diskon`, `voucher`)

### State Management
- Heavy use of `useState` (30+ state variables)
- `useEffect` for: localStorage sync, dark mode, language persistence, clipboard paste, clock timer
- No context, no reducers
- Item shape: `{ id, name, price, persons: { [name]: quantity }, priceType: "unit" | "total" }`

### Styling
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- Dark mode via `class` strategy — configured with `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`
- Responsive: `sm:` prefix for mobile-first
- Custom animations: `animate-slide-down`, `animate-fade-in` (defined in `index.css`)
- Common patterns: `rounded-xl`, `shadow-lg`, `border`, `transition`, `focus:ring-1`
- Use `text-base sm:text-sm` for inputs to prevent iOS zoom
- Font: Google Fonts Roboto

### Formatting
- **2-space indentation**
- Semicolons used consistently
- Trailing commas in multi-line arrays/objects
- JSX attributes on separate lines when >2 props
- `Number(value || 0)` pattern for safe numeric conversion

### Error Handling
- `try/catch` around all `localStorage` access
- `console.error()` for OCR, image export, localStorage failures
- User-facing errors via temporary status messages (`setCaptureStatus` + `setTimeout` clear)
- Input validation in `AccountSelector` with per-field error state
- Graceful fallbacks: `Number(value || 0)`, `item.persons[person] || 0`

### Internationalization (i18n)
- `translations` object with `en` and `id` keys, typed via `Translations` interface
- Access via `t = translations[language]`
- All UI text must be translatable — add keys to both language objects

### Key Patterns
- When adding state, always add to the `dataToSave` object in the localStorage `useEffect`
- Use existing icon components before adding new SVGs
- Currency formatting: `toLocaleString("id-ID")`
- Item IDs: `Date.now() + Math.random() * 1000000`
- Status messages auto-clear after 2000ms via `setTimeout`
