import { useEffect } from "react";
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
import { TypewriterModal } from "./components/TypewriterModal";
import { DataWarningModal } from "./components/DataWarningModal";
import { CalculatorWidget } from "./components/widgets/CalculatorWidget";
import { ClockWidget } from "./components/widgets/ClockWidget";
import { PaymentTrackerWidget } from "./components/widgets/PaymentTrackerWidget";
import { ConfirmModal } from "./components/ConfirmModal";
import { CustomAccountModal } from "./components/CustomAccountModal";

function SplitBill() {
  const { t, showResetModal, setShowResetModal, resetAllData, typewriter } = useApp();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    const syncScrollLock = () => {
      const hasModal = !!document.querySelector(".fixed.inset-0.z-50");
      html.style.overflow = hasModal ? "hidden" : previousHtmlOverflow;
      body.style.overflow = hasModal ? "hidden" : previousBodyOverflow;
    };

    syncScrollLock();

    const observer = new MutationObserver(syncScrollLock);
    observer.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

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
          <TypewriterModal
            isOpen={typewriter.showShareModal}
            shareUrl={typewriter.getShareUrl()}
            onCopy={() => {
              typewriter.copyShareLink();
              typewriter.setShowShareModal(false);
            }}
            onCancel={() => typewriter.setShowShareModal(false)}
            t={t}
          />
          <DataWarningModal
            isOpen={typewriter.showWarningModal}
            stage={typewriter.warningStage}
            onCopyAndProceed={typewriter.copyMyDataAndProceed}
            onProceedWithoutBackup={typewriter.proceedWithoutBackup}
            onFinalConfirm={typewriter.confirmDataOverwrite}
            onCancel={typewriter.cancelWarning}
            t={t}
          />
          <ConfirmModal
            isOpen={showResetModal}
            onConfirm={resetAllData}
            onCancel={() => setShowResetModal(false)}
            title={t.resetTitle}
            message={t.resetMessage}
            confirmText={t.reset}
            cancelText={t.cancel}
          />
          <CustomAccountModal />
        </div>
      </div>
      <CalculatorWidget />
      <ClockWidget />
      <PaymentTrackerWidget />
    </div>
  );
}

export default SplitBill;
