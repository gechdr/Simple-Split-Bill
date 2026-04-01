import React from "react";

interface FormattedInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "currency" | "percentage";
  placeholder?: string;
  title?: string;
}

export const FormattedInput: React.FC<FormattedInputProps> = ({
  label,
  value,
  onChange,
  type = "currency",
  placeholder = "0",
  title,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    onChange(rawValue);
  };

  const displayValue = value ? Number(value).toLocaleString("id-ID") : "";

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {type === "currency" && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm font-medium">
              Rp
            </span>
          </div>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2.5 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 text-base sm:text-sm focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
            type === "currency" ? "pl-10 pr-4" : "pl-4 pr-8"
          }`}
          title={
            title ||
            (type === "percentage" ? "Enter percentage" : "Enter amount")
          }
        />
        {type === "percentage" && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 dark:text-gray-400 sm:text-sm font-medium">
              %
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
