import React from "react";
import { useApp } from "../context";
import { Plus, DollarSign } from "../icons";
import { ItemCard } from "./ItemCard";

export const ItemsSection: React.FC = () => {
  const { t, items, addItem } = useApp();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
        <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.itemsList}</h2>
      </div>
      <div className="space-y-6">
        {items.map((item, index) => (
          <ItemCard key={item.id} item={item} index={index} />
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full mt-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 py-3 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition flex items-center justify-center gap-2"
        title={t.tooltipAddItem}
      >
        <Plus className="w-5 h-5" />
        {t.addItem}
      </button>
    </div>
  );
};
