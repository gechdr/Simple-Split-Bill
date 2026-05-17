import React, { useMemo } from "react";
import { useApp } from "../context";
import { Download, Copy, DollarSign, CreditCard } from "../icons";
import { formatMoney } from "../utils/formatters";
import { PersonAccordion } from "./PersonAccordion";

export const PaymentSummary: React.FC = () => {
  const {
    t,
    language,
    placeName,
    persons,
    taxType,
    tax,
    selectedAccount,
    getSelectedAccountName,
    getSelectedAccountVendor,
    getSelectedAccountNumber,
    summaryRef,
    clipboard,
    splitResult,
  } = useApp();

  const { subtotal, taxAmount, totalDiscount, grandTotal, sharedFees } = splitResult;

  const today = useMemo(() => {
    const dateLocale = language === "id" ? "id-ID" : "en-GB";
    return new Date().toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [language]);

  if (subtotal === 0 || persons.length === 0) return null;

  return (
    <>
      <div className="mb-6 overflow-hidden rounded-xl border-2 border-gray-300 dark:border-gray-700 shadow-md smooth-surface">
        <div ref={summaryRef} className="bg-white dark:bg-gray-800 p-5 sm:p-8">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gray-900 dark:bg-gray-700 rounded-full p-1.5">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide leading-none whitespace-nowrap">
                {t.paymentSummary}
              </h2>
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {today}
            </span>
          </div>
          {placeName?.trim() && (
            <div className="mb-5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300 mb-1">
                {t.placeRestoName}
              </p>
              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 break-words">
                {placeName.trim()}
              </p>
            </div>
          )}
          <div className="space-y-3 mb-5 text-sm border-b border-gray-300 dark:border-gray-600 pb-4">
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.orderSubtotal}</span>
              <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">Rp {formatMoney(subtotal)}</span>
            </div>
            {sharedFees > 0 && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.sharedFees}</span>
                <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">Rp {formatMoney(sharedFees)}</span>
              </div>
            )}
            {taxAmount > 0 && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {taxType === "percentage" ? t.taxPercentage : t.taxNominal}
                  {taxType === "percentage" ? ` (${tax}%)` : ""}:
                </span>
                <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">Rp {formatMoney(taxAmount)}</span>
              </div>
            )}
            {totalDiscount > 0 && (
              <div className="flex justify-between items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">{t.totalDiscount}</span>
                <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">- Rp {formatMoney(totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center gap-4 pt-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">{t.total}</span>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">Rp {formatMoney(grandTotal)}</span>
            </div>
          </div>
          {selectedAccount && selectedAccount !== "CUSTOM" && (
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-5 mb-5">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                <CreditCard className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">{t.transferTo} {getSelectedAccountName()}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight whitespace-nowrap">
                {getSelectedAccountVendor()} - {getSelectedAccountNumber()}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-xs uppercase tracking-widest">{t.splitPerPerson}</h3>
            <div className="space-y-2">
              {persons.map((person) => (
                <PersonAccordion key={person} person={person} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => clipboard.handleCapture("download")}
          disabled={!!clipboard.downloadStatus}
          className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-sm smooth-interactive"
          title={t.tooltipDownload}
        >
          <Download className="w-5 h-5 shrink-0" />
          {clipboard.downloadStatus || t.download}
        </button>
        <button
          onClick={() => clipboard.handleCapture("copy")}
          disabled={!!clipboard.captureStatus}
          className="flex-1 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200 dark:shadow-gray-900 smooth-interactive"
          title={t.tooltipCopy}
        >
          <Copy className="w-5 h-5 shrink-0" />
          {clipboard.captureStatus || t.copyImage}
        </button>
      </div>
    </>
  );
};
