import React from "react";
import { useApp } from "../context";
import { changelog } from "../utils/constants";

export const WhatsNewModal: React.FC = () => {
  const { t, language, showWhatsNew, dismissWhatsNew, appVersion } = useApp();

  if (!showWhatsNew) return null;

  const log = changelog[language as keyof typeof changelog];
  if (!log) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-slide-down">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎉</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.whatsNew}</h3>
            <span className="text-lg font-bold text-gray-400 dark:text-gray-500">{appVersion}</span>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          {[
            { key: "new" as const, label: t.whatsNewNew },
            { key: "improved" as const, label: t.whatsNewImproved },
            { key: "removed" as const, label: t.whatsNewRemoved },
          ].map(({ key, label }) => {
            const ci = log[key];
            if (!ci || ci.length === 0) return null;
            return (
              <div key={key}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5 text-gray-400 dark:text-gray-500">{label}</p>
                <ul className="space-y-1.5">
                  {ci.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gray-400 dark:bg-gray-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <button
          onClick={dismissWhatsNew}
          className="w-full px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition font-medium"
        >
          {t.whatsNewClose}
        </button>
      </div>
    </div>
  );
};
