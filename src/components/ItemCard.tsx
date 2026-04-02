import React from "react";
import { useApp } from "../context";
import { Trash2, GripVertical } from "../icons";
import { FormattedInput } from "./FormattedInput";
import { formatMoney } from "../utils/formatters";
import type { BillItem } from "../types";

interface ItemCardProps {
  item: BillItem;
  index: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, index }) => {
  const {
    t,
    persons,
    itemPersonSearch,
    setItemPersonSearch,
    updateItem,
    removeItem,
    togglePerson,
    setPersonQuantity,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDragEnd,
    draggedItem,
    dragOverIndex,
  } = useApp();

  return (
    <div
      key={item.id}
      draggable
      onDragStart={(e) => handleItemDragStart(e, index)}
      onDragOver={(e) => handleItemDragOver(e, index)}
      onDragEnd={handleItemDragEnd}
      className={`bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md relative group transition-all ${draggedItem === index ? "opacity-50" : ""} ${dragOverIndex === index && draggedItem !== index ? "border-gray-900 dark:border-gray-300 border-2" : ""}`}
    >
      <div className="flex gap-3 items-start mb-3">
        <button className="hidden sm:block cursor-grab active:cursor-grabbing p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={item.name}
            onChange={(e) => updateItem(item.id, "name", e.target.value)}
            placeholder={`${t.itemPlaceholder}${index + 1}`}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base sm:text-sm"
            title={t.tooltipItemName}
          />
          <FormattedInput
            value={item.price}
            onChange={(val) => updateItem(item.id, "price", val)}
            title={t.tooltipItemPrice}
          />
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition shadow-sm h-11.5 w-11.5 sm:h-10.5 sm:w-10.5 flex items-center justify-center shrink-0"
          title={t.tooltipDeleteItem}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">{t.priceTypeLabel}:</span>
          <div className="flex gap-2">
            <button
              onClick={() => updateItem(item.id, "priceType", "unit")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition border ${item.priceType === "unit" ? "bg-gray-900 dark:bg-gray-600 text-white border-gray-900 dark:border-gray-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              title={t.tooltipPricePerUnit}
            >
              {t.pricePerUnit}
            </button>
            <button
              onClick={() => updateItem(item.id, "priceType", "total")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition border ${item.priceType === "total" ? "bg-gray-900 dark:bg-gray-600 text-white border-gray-900 dark:border-gray-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              title={t.tooltipPriceTotal}
            >
              {t.priceTotal}
            </button>
          </div>
        </div>
        {Object.keys(item.persons).length > 0 && item.price && (
          <span className="text-xs text-gray-400 dark:text-gray-300 break-all">
            {(() => {
              const totalQty = Object.values(item.persons).reduce((s, q) => s + (Number(q) || 0), 0);
              const price = Number(item.price || 0);
              if (totalQty === 0 || price === 0) return "";
              return item.priceType === "unit"
                ? `(${totalQty}x Rp ${formatMoney(price)} = Rp ${formatMoney(price * totalQty)})`
                : `(Rp ${formatMoney(price)} Ã· ${totalQty} = Rp ${formatMoney(price / totalQty)})`;
            })()}
          </span>
        )}
      </div>
      <div className="mt-3">
        {persons.length === 0 ? (
          <span className="text-xs text-gray-400 dark:text-gray-500">{t.addPeopleFirst}</span>
        ) : (
          <>
            <div className="relative mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={itemPersonSearch[item.id] || ""}
                onChange={(e) => setItemPersonSearch((prev) => ({ ...prev, [item.id]: e.target.value }))}
                placeholder={t.searchPeoplePlaceholder}
                className="w-full pl-8 pr-8 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              />
              {itemPersonSearch[item.id] && (
                <button
                  onClick={() => setItemPersonSearch((prev) => ({ ...prev, [item.id]: "" }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {persons
                .filter((p) => (itemPersonSearch[item.id] || "").trim() === "" || p.toLowerCase().includes((itemPersonSearch[item.id] || "").toLowerCase()))
                .map((person) => {
                  const quantity = item.persons[person] || 0;
                  const isSelected = quantity > 0;
                  return (
                    <li key={person} className="flex items-center py-2.5 gap-3">
                      <button
                        onClick={() => togglePerson(item.id, person)}
                        className="flex items-center gap-3 flex-1 text-left min-w-0"
                        title={t.tooltipPersonSelect}
                      >
                        <span className={`w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition ${isSelected ? "bg-gray-900 border-gray-900 dark:bg-gray-500 dark:border-gray-500" : "border-gray-300 dark:border-gray-600"}`}>
                          {isSelected && (
                            <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                            </svg>
                          )}
                        </span>
                        <span className={`inline-flex items-center h-4 text-sm font-medium truncate translate-y-px ${isSelected ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                          {person}
                        </span>
                      </button>
                      <div className={`flex items-center justify-end gap-1 shrink-0 w-[100px] ${isSelected ? "visible" : "invisible"}`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (quantity > 1) setPersonQuantity(item.id, person, quantity - 1);
                          }}
                          disabled={!isSelected}
                          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold text-base disabled:cursor-default"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => {
                            e.stopPropagation();
                            const n = parseInt(e.target.value);
                            if (!isNaN(n) && n >= 1) setPersonQuantity(item.id, person, n);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          disabled={!isSelected}
                          className="w-10 py-0.5 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 rounded text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-default"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPersonQuantity(item.id, person, quantity + 1);
                          }}
                          disabled={!isSelected}
                          className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold text-base disabled:cursor-default"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
