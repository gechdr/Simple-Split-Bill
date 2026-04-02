import React from "react";
import type { Translations } from "../translations";

interface TypewriterModalProps {
  isOpen: boolean;
  shareUrl: string | null;
  onCopy: () => void;
  onCancel: () => void;
  t: Translations;
}

export const TypewriterModal: React.FC<TypewriterModalProps> = ({
  isOpen,
  shareUrl,
  onCopy,
  onCancel,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-slide-down">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t.shareTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {shareUrl ? t.shareDescription : t.shareNoData}
        </p>
        {shareUrl && (
          <textarea
            readOnly
            value={shareUrl}
            onClick={(e) => e.currentTarget.select()}
            className="w-full px-3 py-2.5 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono resize-none overflow-auto hide-scrollbar focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-500 cursor-text"
            rows={3}
          />
        )}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
          >
            {t.cancel}
          </button>
          <button
            onClick={onCopy}
            disabled={!shareUrl}
            className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-black dark:hover:bg-gray-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.shareCopyButton}
          </button>
        </div>
      </div>
    </div>
  );
};
