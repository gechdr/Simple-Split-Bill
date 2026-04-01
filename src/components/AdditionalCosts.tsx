import React from "react";
import { useApp } from "../context";
import { FormattedInput } from "./FormattedInput";
import { AccountSelector } from "./AccountSelector";
import { Repeat, CreditCard } from "../icons";

export const AdditionalCosts: React.FC = () => {
  const {
    t,
    ongkir,
    setOngkir,
    biayaLayanan,
    setBiayaLayanan,
    tax,
    setTax,
    taxType,
    setTaxType,
    parking,
    setParking,
    diskon,
    setDiskon,
    voucher,
    setVoucher,
    bankAccounts,
    selectedAccount,
    setSelectedAccount,
    customAccountName,
    setCustomAccountName,
    customAccountNumber,
    setCustomAccountNumber,
    customAccountVendor,
    setCustomAccountVendor,
    roundTo100,
    setRoundTo100,
    saveCustomAccount,
    deleteBankAccount,
  } = useApp();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
        <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.additionalCosts}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormattedInput label={t.shipping} value={ongkir} onChange={setOngkir} title={t.tooltipShipping} />
        <FormattedInput label={t.serviceFee} value={biayaLayanan} onChange={setBiayaLayanan} title={t.tooltipServiceFee} />
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
            {taxType === "percentage" ? t.taxPercentage : t.taxNominal}
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <FormattedInput value={tax} onChange={setTax} type={taxType} placeholder="0" title={taxType === "percentage" ? t.tooltipTaxPercentage : t.tooltipTaxNominal} />
            </div>
            <button
              onClick={() => setTaxType(taxType === "percentage" ? "currency" : "percentage")}
              className="px-3 py-2.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg transition border border-gray-300 dark:border-gray-600 text-sm font-medium whitespace-nowrap flex items-center justify-center"
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>
        </div>
        <FormattedInput label={t.parking} value={parking} onChange={setParking} title={t.tooltipParking} />
        <FormattedInput label={t.promoDiscount} value={diskon} onChange={setDiskon} title={t.tooltipDiscount} />
        <FormattedInput label={t.voucher} value={voucher} onChange={setVoucher} title={t.tooltipVoucher} />
        <AccountSelector
          label={t.bankAccount}
          options={bankAccounts}
          selectedValue={selectedAccount}
          onChange={(v) => setSelectedAccount(v)}
          customName={customAccountName}
          customNumber={customAccountNumber}
          customVendor={customAccountVendor}
          onCustomNameChange={setCustomAccountName}
          onCustomNumberChange={setCustomAccountNumber}
          onCustomVendorChange={setCustomAccountVendor}
          onSaveCustomAccount={saveCustomAccount}
          onDeleteAccount={deleteBankAccount}
          t={t}
        />
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">{t.roundTo100}</label>
          <button
            onClick={() => setRoundTo100(!roundTo100)}
            className={`w-full px-4 py-2.5 rounded-lg border transition flex items-center justify-between ${roundTo100 ? "bg-gray-900 dark:bg-gray-600 text-white border-gray-900 dark:border-gray-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
            title={t.tooltipRounding}
          >
            <span className="text-base sm:text-sm font-medium">{roundTo100 ? t.rounded : t.notRounded}</span>
            <div className={`w-10 h-5 rounded-full transition ${roundTo100 ? "bg-white dark:bg-gray-300" : "bg-gray-300 dark:bg-gray-600"} relative`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${roundTo100 ? "right-0.5 bg-gray-900 dark:bg-gray-600" : "left-0.5 bg-white dark:bg-gray-300"}`}></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
