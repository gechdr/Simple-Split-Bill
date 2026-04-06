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
├── index.html                  # Entry HTML (Vite, Google Fonts Roboto)
├── index.copy.html             # Original single-file app (legacy)
├── package.json
├── vite.config.ts              # Vite + React + Tailwind plugins
├── tsconfig.json
├── AGENTS.md
└── src/
    ├── main.tsx                # React root entry point
    ├── App.tsx                 # Wraps SplitBill in AppProvider
    ├── SplitBill.tsx           # Thin composition layer (no state/logic)
    ├── translations.ts         # EN/ID translation strings + Translations type
    ├── index.css               # Tailwind import + dark mode variant + animations
    ├── vite-env.d.ts           # Vite type declarations
    ├── types/
    │   └── index.ts            # TypeScript interfaces (BillItem, BankAccount, etc.)
    ├── icons/
    │   └── index.tsx           # All SVG icon components (22 icons)
    ├── context/
    │   └── AppContext.tsx      # Centralized state via React Context + useApp hook
    ├── hooks/
    │   ├── useLocalStorage.ts  # Generic localStorage persistence
    │   ├── useBillCalculator.ts# Split calculation logic
    │   ├── useDarkMode.ts      # Dark mode toggle with persistence
    │   ├── useLanguage.ts      # Language toggle with translations
    │   ├── useCalculator.ts    # Floating calculator widget state
    │   ├── useClipboard.ts     # Image capture (download/copy)
    │   ├── useDragWidget.ts    # Draggable widget positioning
    │   └── useOCR.ts           # Receipt scanning with Tesseract.js
    ├── utils/
    │   ├── constants.ts        # App constants, defaults, changelog
    │   ├── formatters.ts       # Money/calc display formatters
    │   └── receiptParser.ts    # OCR text parsing
    └── components/
        ├── FormattedInput.tsx  # Currency/percentage input with Rp/% prefix
        ├── AccountSelector.tsx # Bank account dropdown + custom account modal
        ├── ConfirmModal.tsx    # Confirmation dialog modal
        ├── Header.tsx          # Toolbar (lang, dark, OCR, reset toggles)
        ├── OCRZone.tsx         # Receipt scanner drag-drop zone
        ├── PeopleSection.tsx   # People list with search, autocomplete, bulk insert
        ├── ItemCard.tsx        # Single item with drag, price toggle, person assignment
        ├── ItemsSection.tsx    # Items list container with add button
        ├── AdditionalCosts.tsx # Shipping, tax, parking, discounts, bank, rounding
        ├── PersonAccordion.tsx # Expandable person bill breakdown
        ├── PaymentSummary.tsx  # Summary with export/download/copy buttons
        ├── StatusNotification.tsx  # OCR scanning overlay
        ├── WhatsNewModal.tsx   # Version changelog modal
        ├── BulkInsertModal.tsx # Bulk person:item paste modal
        └── widgets/
            ├── CalculatorWidget.tsx    # Floating calculator
            ├── ClockWidget.tsx         # Analog + digital clock
            └── PaymentTrackerWidget.tsx# Paid/unpaid tracker
```

## Code Style & Conventions

### Architecture
- **Context-driven**: All state managed via `AppContext` with `useApp()` hook
- **Custom hooks**: Business logic extracted into dedicated hooks (calc, OCR, dark mode, etc.)
- **Composition layer**: `SplitBill.tsx` is a thin component that assembles sections — no state or logic
- **localStorage persistence**: Handled by `useLocalStorage` hook + `AppContext` provider

### Imports & Dependencies
- All dependencies from npm (no CDN):
  - `react`, `react-dom` — UI framework
  - `tesseract.js` — OCR engine
  - `dom-to-image` — image export
  - `tailwindcss`, `@tailwindcss/vite` — styling
- Components access state via `useApp()` — avoid prop drilling
- Import types from `../types`, icons from `../icons`, utils/hooks from barrel exports

### Naming Conventions
- **Components**: PascalCase (`SplitBill`, `PersonAccordion`, `CalculatorWidget`)
- **Hooks**: camelCase with `use` prefix (`useBillCalculator`, `useOCR`)
- **Utils**: camelCase (`formatMoney`, `parseReceiptText`)
- **Constants**: UPPER_SNAKE_CASE (`STORAGE_KEY`, `APP_VERSION`)
- **State variables**: camelCase (`items`, `persons`, `darkMode`, `roundTo100`)
- **Event handlers**: camelCase, action-prefixed (`handleScanReceipt`, `addItem`)
- **Mixed language**: Indonesian variable names preserved (`ongkir`, `biayaLayanan`, `diskon`, `voucher`)

### State Management
- Centralized in `AppContext.tsx` via `useLocalStorage` hook
- Heavy use of `useState` (30+ state variables)
- `useEffect` for: localStorage sync, dark mode, language persistence, clipboard paste, clock timer
- No reducers, no external state libraries
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
- Access via `useLanguage()` hook which returns `t = translations[language]`
- All UI text must be translatable — add keys to both language objects

### Key Patterns
- When adding state, include it in `AppContext` provider and `useLocalStorage` persisted data
- Use existing icon components before adding new SVGs
- Currency formatting: `toLocaleString("id-ID")`
- Item IDs: `Date.now() + Math.random() * 1000000`
- Status messages auto-clear after 2000ms via `setTimeout`
- Components should use `useApp()` context — never duplicate state
