# AGENTS.md - Split Bill

## Project Overview

Vite + React 19 + TypeScript application for splitting bills among groups. All dependencies from npm (no CDN).

**Tech Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Tesseract.js (OCR), dom-to-image (export), msgpack (data sharing).

## Commands

```bash
# Dev server
npm run dev

# Build (runs tests first via prebuild)
npm run build

# Preview production build
npm run preview

# Tests (watch mode)
npm test

# Tests once (CI mode)
npm run test:run

# Single test file
npx vitest run src/test/useBillCalculator.test.ts

# Test by pattern
npx vitest run -t "useBillCalculator"
```

- **Test framework**: Vitest + @testing-library/react (jsdom)
- **No linter** — no ESLint or Prettier config
- TypeScript strict mode is **disabled** (`strict: false` in tsconfig)
- Tests live in `src/test/`. Setup at `src/test/setup.ts` provides localStorage mock + imports `@testing-library/jest-dom`.

## Architecture

### Context Split (3 contexts)

State is split across three providers, each with its own hook:

| Hook | Source | Purpose |
|------|--------|---------|
| `useApp()` | `AppContext.tsx` | Language, dark mode, theme UI state |
| `useBillData()` | `BillDataContext.tsx` | All bill data (items, persons, costs, accounts, payment status) + split calculations |
| `useUI()` | `UIContext.tsx` | Modal visibility, widget toggles, OCR state, bulk insert |

All three are combined via `AppProvider` in `AppContext.tsx`. Components should use the most specific hook — `useBillData()` for bill logic, `useUI()` for modals/widgets, `useApp()` for theme/lang.

### Entry Points

- `src/main.tsx` — React root
- `src/App.tsx` — Wraps `SplitBill` in `AppProvider`
- `src/SplitBill.tsx` — Thin composition layer (no state/logic)

### Key Directories

```
src/
  context/          # BillDataContext.tsx (data + calc), UIContext.tsx (UI state), AppContext.tsx (combines all 3)
  hooks/            # useLocalStorage, useBillCalculator, useOCR, useDarkMode, useLanguage, useCalculator, useClipboard, useDragWidget
  components/       # All UI components + widgets/ subdirectory
  utils/            # constants.ts (APP_VERSION, changelog, defaults), formatters.ts, receiptParser.ts
  types/index.ts    # BillItem, BankAccount, TaxType, SplitResult, Translations
  icons/index.tsx   # 22 SVG icon components
  translations.ts   # EN/ID strings + Translations type
```

### New/Changed Components (since v2.8.0)

- `CustomAccountModal.tsx` — Standalone modal for adding bank accounts (extracted from AccountSelector to fix dialog bugs)
- `BillInfoSection.tsx` — Place/resto name display
- `TypewriterModal.tsx` — Data sharing via typewriter effect + msgpack encoding
- `DataWarningModal.tsx` — Data transfer warnings
- `AccountSelector.tsx` — Dropdown only (no longer contains custom modal inline; calls `onOpenCustomModal()` instead)

## Code Conventions

### State Management
- All state via context hooks — never duplicate state in components
- localStorage persistence via `useLocalStorage` hook
- Item shape: `{ id, name, price, persons: { [name]: quantity }, priceType: "unit" | "total" }`
- Item IDs: `Date.now() + Math.random() * 1000000`
- When adding state, include it in the appropriate context provider and `useLocalStorage` persisted data

### Imports
- Components access state via `useApp()`, `useBillData()`, or `useUI()` — avoid prop drilling
- Import types from `../types`, icons from `../icons`, utils/hooks from barrel exports
- Context barrel: `import { useApp, useBillData, useUI } from "../context"`

### Naming
- Indonesian variable names preserved: `ongkir`, `biayaLayanan`, `diskon`, `voucher`
- Components: PascalCase | Hooks: `use` prefix | Utils: camelCase | Constants: UPPER_SNAKE_CASE

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Dark mode via `class` strategy — `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`
- Custom animations: `animate-slide-down`, `animate-fade-in` (in `index.css`)
- Use `text-base sm:text-sm` for inputs to prevent iOS zoom

### Formatting
- 2-space indentation, semicolons, trailing commas
- `Number(value || 0)` pattern for safe numeric conversion
- JSX attributes on separate lines when >2 props

### i18n
- `translations` object with `en` and `id` keys, typed via `Translations` interface
- All UI text must be translatable — add keys to both language objects

### Error Handling
- `try/catch` around all `localStorage` access
- User-facing errors via temporary status messages (`setTimeout` clear after 2000ms)
- Graceful fallbacks: `Number(value || 0)`, `item.persons[person] || 0`
