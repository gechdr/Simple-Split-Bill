# 💰 Split Bill

<div align="center">

![Version](https://img.shields.io/badge/version-2.8.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC.svg?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?logo=vite)

**Split bills easily and fairly among friends, family, or colleagues.**

[Live Demo](#demo) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Contributing](#contributing)

</div>

---

## 📖 Overview

Split Bill is a modern, feature-rich web application designed to make splitting expenses effortless. Whether you're dividing a restaurant bill, sharing vacation costs, or managing group purchases, Split Bill handles all the complex calculations so you don't have to.

Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**, it offers a clean, responsive interface that works seamlessly on both desktop and mobile devices.

> **Note**: The original single-file version (`index.copy.html`) is still available in the repository for reference. The current version uses a modern Vite + React + TypeScript architecture.

## ✨ Features

### Core Functionality

- **👥 People Management** - Add unlimited participants to split bills with
- **📝 Item Tracking** - Add multiple items with flexible pricing options
- **💵 Smart Splitting** - Automatically calculates each person's share based on what they ordered
- **💾 Auto-Save** - All data is automatically saved to localStorage
- **🌐 Multi-Language** - Full support for English and Indonesian (Bahasa Indonesia)

### Pricing Options

| Option | Description |
|--------|-------------|
| **Per Unit** | Each person pays the full item price (e.g., everyone ordered the same dish) |
| **Total** | Price is split equally among selected people (e.g., shared appetizer) |

### Additional Costs & Discounts

- 📦 **Shipping Fee** - Add delivery costs
- 🛎️ **Service Fee** - Include service charges
- 📊 **Tax** - Apply tax percentage automatically
- 🅿️ **Parking Fee** - Add parking expenses
- 🏷️ **Promo Discount** - Apply promotional discounts
- 🎫 **Voucher** - Deduct voucher amounts

### Receipt Scanning (OCR)

- 📸 **Image Upload** - Click to select or drag & drop receipt images
- 📋 **Clipboard Paste** - Paste images directly with Ctrl+V / Cmd+V
- 🔍 **Auto-Detection** - Automatically extracts items, prices, taxes, and discounts
- 🌏 **Multi-Language OCR** - Supports Indonesian and English receipts

### Bank Account Management

- 💳 **Save Accounts** - Store multiple bank/e-wallet accounts for quick access
- 🏦 **Quick Select** - Choose transfer destination from saved accounts
- 🗑️ **Manage Accounts** - Edit or delete saved payment accounts

### Export & Sharing

- 📥 **Download** - Save payment summary as high-quality PNG image
- 📋 **Copy to Clipboard** - One-click copy for easy sharing via chat apps

### User Experience

- 🌙 **Dark Mode** - Eye-friendly dark theme support
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- ↕️ **Drag & Drop** - Reorder items by dragging
- 🔢 **Rounding** - Option to round amounts to nearest 100
- 📊 **Detailed Breakdown** - Expandable view showing each person's itemized costs

### Desktop Widgets

- 🧮 **Floating Calculator** - Built-in calculator for quick math
- ✅ **Payment Tracker** - Track who has paid and who hasn't
- 🔤 **Bulk Insert** - Paste a list of Person : Item entries to add people and items at once

## 🚀 Installation

### Option 1: Vite Development (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/split-bill.git
cd split-bill

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

```bash
# Clone the repository
git clone https://github.com/yourusername/split-bill.git
```

### Option 2: Build for Production

```bash
# Build optimized production files
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting.

### Option 3: Deploy to GitHub Pages

1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/ (root)` folder
5. Your app will be live at `https://yourusername.github.io/split-bill`

## 📱 Usage

### Quick Start Guide

1. **Add People** - Enter names of everyone splitting the bill
2. **Add Items** - Input item names and prices
3. **Assign People** - Click on names to assign who ordered what
4. **Add Fees** - Include shipping, service fees, tax, etc.
5. **Review Summary** - Check the calculated split for each person
6. **Share** - Download or copy the summary image

### Detailed Walkthrough

#### Adding People

```
1. Type a name in the "Person name" field
2. Press Enter or click "Add"
3. Repeat for all participants
```

#### Adding Items

```
1. Enter the item name (e.g., "Nasi Goreng")
2. Enter the price
3. Select pricing type:
   - "Per Unit" - if each person pays full price
   - "Total" - if price is shared among selected people
4. Click on participant names to assign the item
```

#### Using Receipt Scanner

```
1. Click the eye icon to show OCR scanner
2. Upload a receipt image by:
   - Dragging and dropping
   - Clicking "Choose File"
   - Pasting from clipboard (Ctrl+V)
3. Wait for scanning to complete
4. Review and adjust detected items
```

### Bulk Insert

```
1. Click "Bulk Insert" in the People List section
2. Enter entries in the format "Person : Item" (one per line)
3. Click "Insert" — people and items are added automatically
```

### Using Desktop Widgets

On desktop screens, three floating widgets are available:

- **Calculator** — quick math operations
- **Clock** — analog + digital time display
- **Payment Tracker** — mark who has paid

All widgets are draggable and can be toggled from the header toolbar.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://reactjs.org/) | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Tesseract.js](https://tesseract.projectnaptha.com/) | OCR Engine |
| [dom-to-image](https://github.com/tsayen/dom-to-image) | Image Export |
| [Google Fonts - Roboto](https://fonts.google.com/specimen/Roboto) | Typography |

## 📂 Project Structure

```
split-bill/
├── index.html              # Entry HTML (Vite)
├── index.copy.html         # Original single-file app (legacy)
├── package.json
├── vite.config.ts          # Vite + React + Tailwind config
├── tsconfig.json
├── AGENTS.md               # Guidelines for AI coding agents
├── README.md
├── public/                 # Static assets
├── dist/                   # Production build output
└── src/
    ├── main.tsx            # React root entry point
    ├── App.tsx             # Root component
    ├── SplitBill.tsx       # Main application component
    ├── translations.ts     # EN/ID translation strings + types
    ├── index.css           # Tailwind import + custom animations
    ├── vite-env.d.ts       # Vite type declarations
    ├── types/
    │   └── index.ts        # TypeScript interfaces
    ├── icons/
    │   └── index.tsx       # SVG icon components (22 icons)
    └── components/
        ├── FormattedInput.tsx   # Currency/percentage input
        ├── AccountSelector.tsx  # Bank account dropdown + modal
        └── ConfirmModal.tsx     # Confirmation dialog
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run preview` | Preview production build locally |

## 🔧 Configuration

### Customizing Default Values

Edit the following in `index.html`:

```javascript
// Default language
const [language, setLanguage] = useState('en'); // 'en' or 'id'

// Default dark mode
const [darkMode, setDarkMode] = useState(false);

// Default rounding
const [roundTo100, setRoundTo100] = useState(false);
```

### Adding New Languages

1. Add translations to the `translations` object:

```javascript
const translations = {
    en: { /* English translations */ },
    id: { /* Indonesian translations */ },
    // Add new language:
    es: {
        title: "Dividir Cuenta",
        subtitle: "Divide las cuentas fácilmente",
        // ... other translations
    }
};
```

2. Update the language toggle button to cycle through languages.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines

- Maintain responsive design for all screen sizes
- Test in both light and dark modes
- Ensure all text is translatable (add to both EN and ID in `translations.ts`)
- Follow existing code style and TypeScript conventions
- When adding state, include it in the `dataToSave` object for localStorage persistence

### Feature Ideas

- [ ] Split by percentage
- [ ] Recurring bills
- [ ] Currency converter
- [ ] Export to PDF
- [ ] Share via link
- [ ] Group templates
- [ ] Bill history
- [ ] Cloud sync

## 📝 Changelog

### v2.8.0 (Current)
- Migrated to Vite + React 19 + TypeScript
- Replaced CDN dependencies with npm packages
- Component-based architecture (icons, components, types, translations)
- Added Bulk Insert feature for quick person/item entry
- Added Payment Tracker widget
- Improved dark mode with class-based strategy
- Enhanced People List with search, autocomplete, and duplicate detection
- Google Fonts Roboto typography

### v2.4.1
- Added floating calculator widget
- Added analog clock widget
- Improved drag-and-drop for items
- Enhanced dark mode support
- Bug fixes and performance improvements

### v2.4.0
- Added OCR receipt scanning
- Multi-language support (EN/ID)
- Bank account management
- Round to nearest 100 option

### v2.3.0
- Dark mode support
- Auto-save functionality
- Export as image

## ❓ FAQ

<details>
<summary><strong>Is my data stored online?</strong></summary>

No, all data is stored locally in your browser's localStorage. Nothing is sent to any server.
</details>

<details>
<summary><strong>Can I use this offline?</strong></summary>

The app is now a Vite + React + TypeScript project requiring npm install. After loading, most features work offline except OCR scanning.
</details>

<details>
<summary><strong>How accurate is the receipt scanner?</strong></summary>

OCR accuracy depends on image quality and receipt format. It works best with clear, well-lit photos of printed receipts. Always review and adjust detected items before using.
</details>

<details>
<summary><strong>Can I add more languages?</strong></summary>

Yes! See the [Configuration](#adding-new-languages) section for instructions on adding new translations.
</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) for the amazing framework
- [Tailwind Labs](https://tailwindcss.com/) for the utility-first CSS framework
- [Tesseract.js Contributors](https://github.com/naptha/tesseract.js) for the OCR engine
- All contributors and users of this project

---

<div align="center">

**Made for easier bill splitting**

[⬆ Back to Top](#-split-bill)

</div>
