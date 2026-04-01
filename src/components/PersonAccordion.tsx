import React, { useMemo } from "react";
import { useApp } from "../context";
import { ChevronDown } from "../icons";
import { formatMoney, formatMoneySplit, roundToNearest100 } from "../utils/formatters";
import { calculateItemDisplayPrice } from "../utils/calculator";

interface PersonAccordionProps {
  person: string;
}

export const PersonAccordion: React.FC<PersonAccordionProps> = ({ person }) => {
  const {
    t,
    persons,
    openAccordions,
    toggleAccordion,
    getPersonItems,
    splitResult,
    roundTo100,
    voucher,
  } = useApp();

  const { subtotal, taxAmount, sharedFees, personSubtotals, personTotals } = splitResult;
  const isOpen = openAccordions[person] || false;
  const personItems = getPersonItems(person);

  const itemRows = useMemo(
    () =>
      personItems
        .map((item) => {
          const displayPrice = calculateItemDisplayPrice(item, person);
          if (displayPrice === null) return null;
          const quantity = Number(item.persons[person] || 0);
          const totalPortions = Object.values(item.persons).reduce((s, q) => s + (Number(q) || 0), 0);
          return { item, displayPrice, quantity, totalPortions };
        })
        .filter(Boolean),
    [personItems, person],
  );

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div
        className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition"
        title={t.tooltipViewDetails}
        onClick={() => toggleAccordion(person)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="font-medium text-gray-700 dark:text-gray-200 truncate">{person}</span>
          <button
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              toggleAccordion(person);
            }}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
        <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 font-mono whitespace-nowrap shrink-0 ml-4">
          Rp {formatMoneySplit(roundTo100 ? roundToNearest100(personTotals[person] || 0) : personTotals[person] || 0)}
        </span>
      </div>
      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t.orderDetails}</div>
          {itemRows.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">{t.noItems}</p>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                {itemRows.map((row) => {
                  if (!row) return null;
                  const { item, displayPrice, quantity, totalPortions } = row;
                  return (
                    <div key={item.id} className="flex justify-between items-start gap-2 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-700 dark:text-gray-200 truncate">
                          {item.name || t.itemPlaceholder}
                          {quantity > 1 && <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">x{quantity}</span>}
                        </div>
                        {item.priceType === "total" && (
                          <div className="text-gray-400 dark:text-gray-500 text-xs">
                            {t.priceTotal}: Rp {formatMoney(Number(item.price || 0))} ÷ {totalPortions} portions
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap shrink-0">
                        Rp {formatMoney(displayPrice)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Order Subtotal:</span>
                <span className="font-mono font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  Rp {formatMoneySplit(personSubtotals[person] || 0)}
                </span>
              </div>
              {sharedFees > 0 && persons.length > 0 && (
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                  <span>Net Shared:</span>
                  <span className="font-mono whitespace-nowrap">+ Rp {formatMoneySplit(sharedFees / persons.length)}</span>
                </div>
              )}
              {taxAmount > 0 && subtotal > 0 && (
                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                  <span>Tax:</span>
                  <span className="font-mono whitespace-nowrap">+ Rp {formatMoneySplit(taxAmount * (personSubtotals[person] / subtotal))}</span>
                </div>
              )}
              {Number(voucher) > 0 && subtotal > 0 && (
                <div className="flex justify-between items-center text-xs text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span className="font-mono whitespace-nowrap">- Rp {formatMoneySplit(Number(voucher) * (personSubtotals[person] / subtotal))}</span>
                </div>
              )}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900 dark:text-gray-100">{t.total}:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {roundTo100 && (personTotals[person] || 0) !== roundToNearest100(personTotals[person] || 0) ? (
                    <span className="inline-block">
                      <span className="text-gray-400 dark:text-gray-500">Rp {formatMoneySplit(personTotals[person] || 0)}</span>
                      <span className="mx-1 text-gray-400 dark:text-gray-500">&rarr;</span>
                      <span className="text-green-600 dark:text-green-400">Rp {formatMoneySplit(roundToNearest100(personTotals[person] || 0))}</span>
                    </span>
                  ) : (
                    <span>Rp {formatMoneySplit(personTotals[person] || 0)}</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
