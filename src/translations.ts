export interface Translations {
  title: string;
  subtitle: string;
  autoSaved: string;
  scanReceipt: string;
  scanReceiptDesc: string;
  scanReceiptFormat: string;
  chooseFile: string;
  dropToScan: string;
  scanningReceipt: string;
  scanSuccess: string;
  scanFailed: string;
  items: string;
  noteTitle: string;
  noteDesc: string;
  peopleList: string;
  personNamePlaceholder: string;
  add: string;
  noPeopleAdded: string;
  duplicatePerson: string;
  searchPeoplePlaceholder: string;
  noSearchResults: string;
  bulkInsert: string;
  bulkInsertTitle: string;
  bulkInsertPlaceholder: string;
  bulkInsertConfirm: string;
  bulkInsertCancel: string;
  itemsList: string;
  itemPlaceholder: string;
  deleteItem: string;
  addPeopleFirst: string;
  addItem: string;
  pricePerUnit: string;
  priceTotal: string;
  priceTypeLabel: string;
  additionalCosts: string;
  shipping: string;
  serviceFee: string;
  tax: string;
  taxPercentage: string;
  taxNominal: string;
  parking: string;
  promoDiscount: string;
  voucher: string;
  bankAccount: string;
  selectAccount: string;
  addNewAccount: string;
  addNewAccountDesc: string;
  accountHolderName: string;
  accountHolderPlaceholder: string;
  accountNumber: string;
  accountNumberPlaceholder: string;
  bankEwallet: string;
  bankEwalletPlaceholder: string;
  cancel: string;
  save: string;
  deleteAccount: string;
  accountSaved: string;
  accountExists: string;
  accountDeleted: string;
  paymentSummary: string;
  orderSubtotal: string;
  totalDiscount: string;
  sharedFees: string;
  otherFees: string;
  total: string;
  transferTo: string;
  splitPerPerson: string;
  viewDetails: string;
  hideDetails: string;
  orderDetails: string;
  itemsOrdered: string;
  noItems: string;
  download: string;
  copyImage: string;
  processing: string;
  downloaded: string;
  copied: string;
  failedToCopy: string;
  failedToProcess: string;
  resetTitle: string;
  resetMessage: string;
  reset: string;
  dataReset: string;
  fileMustBeImage: string;
  tooltipLanguage: string;
  tooltipOCR: string;
  tooltipReset: string;
  tooltipAddPerson: string;
  tooltipRemovePerson: string;
  tooltipDeleteItem: string;
  tooltipAddItem: string;
  tooltipDeleteAccount: string;
  tooltipDownload: string;
  tooltipCopy: string;
  tooltipViewDetails: string;
  tooltipPricePerUnit: string;
  tooltipPriceTotal: string;
  tooltipPersonSelect: string;
  tooltipPersonName: string;
  tooltipItemName: string;
  tooltipItemPrice: string;
  tooltipShipping: string;
  tooltipServiceFee: string;
  tooltipTax: string;
  tooltipTaxPercentage: string;
  tooltipTaxNominal: string;
  tooltipParking: string;
  tooltipDiscount: string;
  tooltipVoucher: string;
  tooltipAccountName: string;
  tooltipAccountNumber: string;
  tooltipBankName: string;
  roundTo100: string;
  tooltipRounding: string;
  rounded: string;
  notRounded: string;
  errorNameRequired: string;
  errorNameTooShort: string;
  errorNumberRequired: string;
  errorNumberTooShort: string;
  errorNumberInvalid: string;
  errorVendorRequired: string;
  errorVendorTooShort: string;
  tooltipCalculator: string;
  tooltipClock: string;
  tooltipPaymentTracker: string;
  whatsNew: string;
  whatsNewClose: string;
  whatsNewNew: string;
  whatsNewImproved: string;
  whatsNewRemoved: string;
  authorLabel: string;
  authorContact: string;
  authorReach: string;
  widgetCalculator: string;
  widgetClock: string;
  widgetPaymentTracker: string;
  paymentUnpaid: string;
  paymentPaid: string;
  paymentAllSettled: string;
  paymentNoPeople: string;
}

export interface TranslationSet {
  en: Translations;
  id: Translations;
}

export const translations: TranslationSet = {
  en: {
    title: "Split Bill",
    subtitle: "Split bills easily and fairly",
    autoSaved: "Auto-saved",
    scanReceipt: "Scan Receipt",
    scanReceiptDesc: "Drag & drop, paste (Ctrl+V), or click to upload",
    scanReceiptFormat: "Supports JPG, PNG (max 10MB)",
    chooseFile: "Choose File",
    dropToScan: "Drop to scan",
    scanningReceipt: "Scanning receipt...",
    scanSuccess: "Success! Found",
    scanFailed: "Failed to scan receipt",
    items: "items",
    noteTitle: "Note:",
    noteDesc:
      "The receipt scanning feature uses OCR and may not be 100% accurate. Please double-check the detected data before using it.",
    peopleList: "People List",
    personNamePlaceholder: "Person name (Press Enter)",
    add: "Add",
    noPeopleAdded: "No people added yet.",
    duplicatePerson: "This name is already in the list.",
    searchPeoplePlaceholder: "Search people...",
    noSearchResults: "No people match your search.",
    bulkInsert: "Bulk Insert",
    bulkInsertTitle: "Bulk Insert",
    bulkInsertPlaceholder: `How to use:\nType one entry per line in this format:\n\n  Person : Item\n\nExample:\n  Alice : Nasi Goreng\n  Bob : Mie Ayam\n  Charlie : Nasi Goreng\n  Diana : Es Teh\n\nPeople and items will be added automatically.\nDuplicate names are handled — no worries.\nYou can fill in the prices after.`,
    bulkInsertConfirm: "Insert",
    bulkInsertCancel: "Cancel",
    itemsList: "Items List",
    itemPlaceholder: "Item #",
    deleteItem: "Delete Item",
    addPeopleFirst: "Add people first",
    addItem: "Add Item",
    pricePerUnit: "Per Unit",
    priceTotal: "Total",
    priceTypeLabel: "Price is",
    additionalCosts: "Additional Costs",
    shipping: "Shipping Fee",
    serviceFee: "Service Fee",
    tax: "Tax Percentage",
    taxPercentage: "Tax Percentage",
    taxNominal: "Tax Amount",
    parking: "Parking Fee",
    promoDiscount: "Shipping Discount",
    voucher: "Voucher Discount",
    bankAccount: "Bank Account",
    selectAccount: "Select transfer destination account",
    addNewAccount: "Add New Account",
    addNewAccountDesc: "Save account for later use",
    accountHolderName: "Account Holder Name",
    accountHolderPlaceholder: "e.g. John Doe",
    accountNumber: "Account Number",
    accountNumberPlaceholder: "e.g. 1234567890",
    bankEwallet: "Bank / E-Wallet",
    bankEwalletPlaceholder: "e.g. BCA, Mandiri, GoPay",
    cancel: "Cancel",
    save: "Save",
    deleteAccount: "Delete account",
    accountSaved: "Account saved successfully!",
    accountExists: "Account already exists!",
    accountDeleted: "Account deleted successfully!",
    paymentSummary: "Payment Summary",
    orderSubtotal: "Order Subtotal:",
    totalDiscount: "Total Discount:",
    sharedFees: "Shared Fees:",
    otherFees: "Other Fees:",
    total: "Total:",
    transferTo: "Transfer to:",
    splitPerPerson: "Split Per Person:",
    viewDetails: "View Details",
    hideDetails: "Hide Details",
    orderDetails: "Order Details",
    itemsOrdered: "Items Ordered",
    noItems: "No items",
    download: "Download",
    copyImage: "Copy to Clipboard",
    processing: "Processing...",
    downloaded: "Downloaded successfully!",
    copied: "Copied successfully!",
    failedToCopy: "Failed to copy",
    failedToProcess: "Failed to process",
    resetTitle: "Reset All Data?",
    resetMessage:
      "This action will delete all data including items, people, and costs. Data cannot be recovered.",
    reset: "Reset",
    dataReset: "Data reset successfully!",
    fileMustBeImage: "File must be an image",
    tooltipLanguage: "Switch language between English and Indonesian",
    tooltipOCR: "Toggle OCR scanner to scan receipt images",
    tooltipReset: "Reset all data including items, people, and costs",
    tooltipAddPerson: "Add a new person to split the bill with",
    tooltipRemovePerson: "Remove this person from the list",
    tooltipDeleteItem: "Delete this item from the list",
    tooltipAddItem: "Add a new item to the bill",
    tooltipDeleteAccount: "Delete this saved account",
    tooltipDownload: "Download payment summary as image",
    tooltipCopy: "Copy payment summary image to clipboard",
    tooltipViewDetails: "Show/hide detailed breakdown for this person",
    tooltipPricePerUnit:
      "Price is per unit - each person pays this amount",
    tooltipPriceTotal:
      "Price is total - split equally among selected people",
    tooltipPersonSelect:
      "Click to include/exclude this person for this item",
    tooltipPersonName: "Enter person's name and press Enter to add",
    tooltipItemName: "Enter the name of the item",
    tooltipItemPrice: "Enter the price amount (numbers only)",
    tooltipShipping: "Enter shipping/delivery cost",
    tooltipServiceFee: "Enter service fee amount",
    tooltipTax: "Enter tax percentage (e.g. 10 for 10%)",
    tooltipTaxPercentage: "Enter tax percentage (e.g. 10 for 10%)",
    tooltipTaxNominal: "Enter tax amount",
    tooltipParking: "Enter parking fee amount",
    tooltipDiscount: "Enter shipping discount amount",
    tooltipVoucher: "Enter voucher discount amount",
    tooltipAccountName: "Enter the account holder's full name",
    tooltipAccountNumber: "Enter the account number",
    tooltipBankName: "Enter bank or e-wallet name (e.g. BCA, GoPay)",
    roundTo100: "Round to 100",
    tooltipRounding: "Round each person's bill to nearest 100",
    rounded: "Rounded",
    notRounded: "Not Rounded",
    errorNameRequired: "Account holder name is required",
    errorNameTooShort: "Must be at least 2 characters",
    errorNumberRequired: "Account number is required",
    errorNumberTooShort: "Must be at least 3 digits",
    errorNumberInvalid: "Must contain only numbers",
    errorVendorRequired: "Bank/E-Wallet name is required",
    errorVendorTooShort: "Must be at least 2 characters",
    tooltipCalculator: "Toggle calculator widget",
    tooltipClock: "Toggle clock widget",
    tooltipPaymentTracker: "Toggle payment tracker",
    whatsNew: "What's New",
    whatsNewClose: "Got it!",
    whatsNewNew: "New",
    whatsNewImproved: "Improved",
    whatsNewRemoved: "Removed",
    authorLabel: "Author",
    authorContact: "MS Teams",
    authorReach:
      "Have suggestions or found a bug? Don't hesitate to reach out!",
    widgetCalculator: "Calculator",
    widgetClock: "Clock",
    widgetPaymentTracker: "Payment Tracker",
    paymentUnpaid: "Unpaid",
    paymentPaid: "Paid",
    paymentAllSettled: "All settled up!",
    paymentNoPeople: "No people added yet.",
  },
  id: {
    title: "Patungan",
    subtitle: "Bagi biaya dengan mudah dan adil",
    autoSaved: "Tersimpan otomatis",
    scanReceipt: "Pindai Struk",
    scanReceiptDesc:
      "Seret & lepas, tempel (Ctrl+V), atau klik untuk upload",
    scanReceiptFormat: "Mendukung JPG, PNG (maks 10MB)",
    chooseFile: "Pilih File",
    dropToScan: "Lepas untuk memindai",
    scanningReceipt: "Memindai struk...",
    scanSuccess: "Berhasil! Ditemukan",
    scanFailed: "Gagal memindai struk",
    items: "item",
    noteTitle: "Catatan:",
    noteDesc:
      "Fitur pemindaian struk menggunakan OCR dan mungkin tidak 100% akurat. Mohon periksa kembali data yang terdeteksi sebelum digunakan.",
    peopleList: "Daftar Orang",
    personNamePlaceholder: "Nama orang (Tekan Enter)",
    add: "Tambah",
    noPeopleAdded: "Belum ada orang yang ditambahkan.",
    duplicatePerson: "Nama ini sudah ada di daftar.",
    bulkInsert: "Masukkan Massal",
    bulkInsertTitle: "Masukkan Massal",
    bulkInsertPlaceholder: `Cara penggunaan:\nTulis satu entri per baris dengan format:\n\n  Orang : Barang\n\nContoh:\n  Alice : Nasi Goreng\n  Bob : Mie Ayam\n  Charlie : Nasi Goreng\n  Diana : Es Teh\n\nOrang dan barang akan ditambahkan otomatis.\nNama duplikat ditangani — tidak perlu khawatir.\nHarga bisa diisi setelah ini.`,
    bulkInsertConfirm: "Masukkan",
    bulkInsertCancel: "Batal",
    searchPeoplePlaceholder: "Cari orang...",
    noSearchResults: "Tidak ada orang yang cocok dengan pencarian.",
    itemsList: "Daftar Barang",
    itemPlaceholder: "Barang #",
    deleteItem: "Hapus Barang",
    addPeopleFirst: "Tambahkan orang terlebih dahulu",
    addItem: "Tambah Barang",
    pricePerUnit: "Per Satuan",
    priceTotal: "Total",
    priceTypeLabel: "Harga adalah",
    additionalCosts: "Biaya Tambahan",
    shipping: "Biaya Ongkir",
    serviceFee: "Biaya Layanan",
    tax: "Persentase Pajak",
    taxPercentage: "Persentase Pajak",
    taxNominal: "Nominal Pajak",
    parking: "Biaya Parkir",
    promoDiscount: "Diskon Ongkir",
    voucher: "Diskon Voucher",
    bankAccount: "Rekening Bank",
    selectAccount: "Pilih rekening tujuan transfer",
    addNewAccount: "Tambah Rekening Baru",
    addNewAccountDesc: "Simpan rekening untuk digunakan nanti",
    accountHolderName: "Nama Pemilik Rekening",
    accountHolderPlaceholder: "contoh: John Doe",
    accountNumber: "Nomor Rekening",
    accountNumberPlaceholder: "contoh: 1234567890",
    bankEwallet: "Bank / E-Wallet",
    bankEwalletPlaceholder: "contoh: BCA, Mandiri, GoPay",
    cancel: "Batal",
    save: "Simpan",
    deleteAccount: "Hapus rekening",
    accountSaved: "Rekening berhasil disimpan!",
    accountExists: "Rekening sudah ada!",
    accountDeleted: "Rekening berhasil dihapus!",
    paymentSummary: "Ringkasan Pembayaran",
    orderSubtotal: "Subtotal Pesanan:",
    totalDiscount: "Total Diskon:",
    sharedFees: "Biaya Bersama:",
    otherFees: "Biaya Lainnya:",
    total: "Total:",
    transferTo: "Transfer ke:",
    splitPerPerson: "Bagi Per Orang:",
    viewDetails: "Lihat Detail",
    hideDetails: "Sembunyikan Detail",
    orderDetails: "Detail Pesanan",
    itemsOrdered: "Barang yang Dipesan",
    noItems: "Tidak ada barang",
    download: "Unduh",
    copyImage: "Salin ke Clipboard",
    processing: "Memproses...",
    downloaded: "Berhasil diunduh!",
    copied: "Berhasil disalin!",
    failedToCopy: "Gagal menyalin",
    failedToProcess: "Gagal memproses",
    resetTitle: "Reset Semua Data?",
    resetMessage:
      "Tindakan ini akan menghapus semua data termasuk barang, orang, dan biaya. Data tidak dapat dikembalikan.",
    reset: "Reset",
    dataReset: "Data berhasil direset!",
    fileMustBeImage: "File harus berupa gambar",
    tooltipLanguage: "Ganti bahasa antara English dan Indonesian",
    tooltipOCR: "Toggle scanner OCR untuk memindai gambar struk",
    tooltipReset: "Reset semua data termasuk barang, orang, dan biaya",
    tooltipAddPerson: "Tambah orang baru untuk patungan",
    tooltipRemovePerson: "Hapus orang ini dari daftar",
    tooltipDeleteItem: "Hapus barang ini dari daftar",
    tooltipAddItem: "Tambah barang baru ke tagihan",
    tooltipDeleteAccount: "Hapus rekening tersimpan ini",
    tooltipDownload: "Unduh ringkasan pembayaran sebagai gambar",
    tooltipCopy: "Salin gambar ringkasan pembayaran ke clipboard",
    tooltipViewDetails:
      "Tampilkan/sembunyikan rincian detail untuk orang ini",
    tooltipPricePerUnit:
      "Harga per satuan - setiap orang bayar sejumlah ini",
    tooltipPriceTotal:
      "Harga total - dibagi rata di antara orang yang dipilih",
    tooltipPersonSelect:
      "Klik untuk sertakan/kecualikan orang ini untuk barang ini",
    tooltipPersonName:
      "Masukkan nama orang dan tekan Enter untuk menambah",
    tooltipItemName: "Masukkan nama barang",
    tooltipItemPrice: "Masukkan jumlah harga (angka saja)",
    tooltipShipping: "Masukkan biaya ongkos kirim",
    tooltipServiceFee: "Masukkan jumlah biaya layanan",
    tooltipTax: "Masukkan persentase pajak (contoh: 10 untuk 10%)",
    tooltipTaxPercentage:
      "Masukkan persentase pajak (contoh: 10 untuk 10%)",
    tooltipTaxNominal: "Masukkan jumlah nominal pajak",
    tooltipParking: "Masukkan jumlah biaya parkir",
    tooltipDiscount: "Masukkan jumlah diskon ongkir",
    tooltipVoucher: "Masukkan jumlah diskon voucher",
    tooltipAccountName: "Masukkan nama lengkap pemilik rekening",
    tooltipAccountNumber: "Masukkan nomor rekening",
    tooltipBankName:
      "Masukkan nama bank atau e-wallet (contoh: BCA, GoPay)",
    roundTo100: "Bulatkan ke 100",
    tooltipRounding: "Bulatkan tagihan setiap orang ke 100 terdekat",
    rounded: "Dibulatkan",
    notRounded: "Tidak Dibulatkan",
    errorNameRequired: "Nama pemilik rekening wajib diisi",
    errorNameTooShort: "Minimal 2 karakter",
    errorNumberRequired: "Nomor rekening wajib diisi",
    errorNumberTooShort: "Minimal 3 digit",
    errorNumberInvalid: "Hanya boleh berisi angka",
    errorVendorRequired: "Nama Bank/E-Wallet wajib diisi",
    errorVendorTooShort: "Minimal 2 karakter",
    tooltipCalculator: "Toggle widget kalkulator",
    tooltipClock: "Toggle widget jam",
    tooltipPaymentTracker: "Toggle pelacak pembayaran",
    whatsNew: "Yang Baru",
    whatsNewClose: "Mengerti!",
    whatsNewNew: "Baru",
    whatsNewImproved: "Peningkatan",
    whatsNewRemoved: "Dihapus",
    authorLabel: "Pembuat",
    authorContact: "MS Teams",
    authorReach:
      "Ada saran atau menemukan bug? Jangan ragu untuk menghubungi!",
    widgetCalculator: "Kalkulator",
    widgetClock: "Jam",
    widgetPaymentTracker: "Pelacak Pembayaran",
    paymentUnpaid: "Belum Bayar",
    paymentPaid: "Sudah Bayar",
    paymentAllSettled: "Semua sudah lunas!",
    paymentNoPeople: "Belum ada orang yang ditambahkan.",
  },
};
