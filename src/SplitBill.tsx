import { useApp } from "./context";
import { Header } from "./components/Header";
import { BillInfoSection } from "./components/BillInfoSection";
import { OCRZone } from "./components/OCRZone";
import { PeopleSection } from "./components/PeopleSection";
import { ItemsSection } from "./components/ItemsSection";
import { AdditionalCosts } from "./components/AdditionalCosts";
import { PaymentSummary } from "./components/PaymentSummary";
import { StatusNotification } from "./components/StatusNotification";
import { WhatsNewModal } from "./components/WhatsNewModal";
import { BulkInsertModal } from "./components/BulkInsertModal";
import { CalculatorWidget } from "./components/widgets/CalculatorWidget";
import { ClockWidget } from "./components/widgets/ClockWidget";
import { PaymentTrackerWidget } from "./components/widgets/PaymentTrackerWidget";
import { ConfirmModal } from "./components/ConfirmModal";

function SplitBill() {
  const { t, showResetModal, setShowResetModal, resetAllData } = useApp();

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-6 px-3 sm:py-8 sm:px-4 font-sans transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-300 dark:border-gray-700 transition-colors">
          <Header />
          <BillInfoSection />
          <OCRZone />
          <PeopleSection />
          <ItemsSection />
          <AdditionalCosts />
          <PaymentSummary />
          <StatusNotification />
          <WhatsNewModal />
          <BulkInsertModal />
          <ConfirmModal
            isOpen={showResetModal}
            onConfirm={resetAllData}
            onCancel={() => setShowResetModal(false)}
            title={t.resetTitle}
            message={t.resetMessage}
            confirmText={t.reset}
            cancelText={t.cancel}
          />
        </div>
      </div>
      <CalculatorWidget />
      <ClockWidget />
      <PaymentTrackerWidget />
    </div>
  );
}

export default SplitBill;
