import { useApp } from "../../context";
import { Copy, ListChecks } from "../../icons";

export function PaymentTrackerWidget() {
  const { t, persons, paymentStatus, togglePayment, clipboard, paymentTrackerRef, dragWidget, splitResult, formatMoneySplit, showPaymentTracker, setShowPaymentTracker } = useApp();
  const { handlePaymentCopy, paymentCopyStatus } = clipboard;
  const { paymentTrackerPos, handleDragStart, resetPaymentTrackerPos } = dragWidget;

  if (!showPaymentTracker) return null;

  return (
    <div
      className="hidden md:block fixed z-40 animate-fade-in"
      style={{
        left: `${paymentTrackerPos.x}px`,
        top: `${paymentTrackerPos.y}px`,
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-64">
        <div ref={paymentTrackerRef}>
          <div
            className="flex items-center justify-between px-4 py-3 cursor-move border-b border-gray-200 dark:border-gray-700 rounded-t-xl"
            onMouseDown={(e) => handleDragStart("payment", e)}
            onDoubleClick={() => resetPaymentTrackerPos()}
          >
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              {t.widgetPaymentTracker}
            </span>
            <button
              onClick={() => setShowPaymentTracker(false)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition text-xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="p-3 max-h-80 overflow-y-auto">
            {persons.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
                {t.paymentNoPeople}
              </p>
            ) : (
              (() => {
                const unpaid = persons.filter((p) => !paymentStatus[p]);
                const paid = persons.filter((p) => paymentStatus[p]);
                return (
                  <>
                    {unpaid.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 px-2 mb-1">
                          {t.paymentUnpaid} ({unpaid.length})
                        </div>
                        {unpaid.map((person) => (
                          <button
                            key={person}
                            onClick={() => togglePayment(person)}
                            className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span
                              className={`flex-1 min-w-0 text-sm font-medium truncate ${paymentStatus[person] ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}`}
                            >
                              {person}
                            </span>
                            <span className="text-xs font-mono shrink-0 whitespace-nowrap text-gray-500 dark:text-gray-400">
                              Rp{" "}
                              {formatMoneySplit(
                                splitResult.personTotals[person] || 0,
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {unpaid.length > 0 && paid.length > 0 && (
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                    )}
                    {paid.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 px-2 mb-1">
                          {t.paymentPaid} ({paid.length})
                        </div>
                        {paid.map((person) => (
                          <button
                            key={person}
                            onClick={() => togglePayment(person)}
                            className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="flex-1 min-w-0 text-sm font-medium truncate text-gray-400 dark:text-gray-500 line-through">
                              {person}
                            </span>
                            <span className="text-xs font-mono shrink-0 whitespace-nowrap text-gray-500 dark:text-gray-400">
                              Rp{" "}
                              {formatMoneySplit(
                                splitResult.personTotals[person] || 0,
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {paid.length > 0 && unpaid.length === 0 && (
                      <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500 font-medium py-1">
                        {t.paymentAllSettled}
                      </div>
                    )}
                  </>
                );
              })()
            )}
          </div>
        </div>
        <div className="px-3 pb-3">
          <button
            onClick={handlePaymentCopy}
            disabled={!!paymentCopyStatus && paymentCopyStatus === t.processing}
            className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 text-sm font-medium"
            title={t.tooltipCopy}
          >
            <Copy className="w-4 h-4" />
            {paymentCopyStatus || t.copyImage}
          </button>
        </div>
      </div>
    </div>
  );
}
