import { useState, useEffect, useCallback } from "react";
import { getTypewriterData, loadTypewriterData, setAllStorageData, getAllStorageData } from "../utils/typewriter";
import type { Translations } from "../translations";

interface UseTypewriterProps {
  t: Translations;
  onDataLoaded?: () => void;
}

export function useTypewriter({ t, onDataLoaded }: UseTypewriterProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningStage, setWarningStage] = useState<1 | 2>(1);
  const [copyStatus, setCopyStatus] = useState("");
  const [pendingSharedData, setPendingSharedData] = useState<unknown>(null);

  // Check for shared data in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get("data");

    if (sharedData) {
      // Check if there's existing data in localStorage
      const existingData = getAllStorageData();

      if (existingData && Object.keys(existingData).length > 0) {
        try {
          // Check if there's meaningful data (not just defaults)
          const persons = existingData["splitBillData_persons"] as string[] | undefined;
          const items = existingData["splitBillData_items"] as any[] | undefined;
          const hasExistingData =
            (persons && persons.length > 0) ||
            (items && items.some((item: any) => item.name || item.price));

          if (hasExistingData) {
            // Show warning modal
            const decodedData = loadTypewriterData();
            setPendingSharedData(decodedData);
            setShowWarningModal(true);
            setWarningStage(1);
            return;
          }
        } catch (error) {
          console.error("Error parsing existing data:", error);
        }
      }

      // No existing data or empty data, load directly
      try {
        const decodedData = loadTypewriterData();
        if (decodedData) {
          setAllStorageData(decodedData);
          cleanUrl();
          if (onDataLoaded) {
            onDataLoaded();
          } else {
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Error loading shared data:", error);
      }
    }
  }, [onDataLoaded]);

  const getShareUrl = useCallback(() => {
    const data = getTypewriterData();
    if (!data) return null;
    const fullUrl = `${window.location.origin}${window.location.pathname}?data=${data}`;
    return fullUrl;
  }, []);

  const hasSharedDataInUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has("data");
  }, []);

  const cleanUrl = useCallback(() => {
    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }, []);

  const copyShareLink = useCallback(async () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) {
      setCopyStatus(t.failedToCopy);
      setTimeout(() => setCopyStatus(""), 2000);
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus(t.copied);
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (error) {
      console.error("Clipboard error:", error);
      setCopyStatus(t.failedToCopy);
      setTimeout(() => setCopyStatus(""), 2000);
    }
  }, [getShareUrl, t]);

  const copyMyDataAndProceed = useCallback(async () => {
    const myDataUrl = getShareUrl();
    if (myDataUrl) {
      try {
        await navigator.clipboard.writeText(myDataUrl);
        setCopyStatus(t.copied);
        setTimeout(() => setCopyStatus(""), 2000);
      } catch (error) {
        console.error("Clipboard error:", error);
        setCopyStatus(t.failedToCopy);
        setTimeout(() => setCopyStatus(""), 2000);
      }
    }
    // Move to second stage
    setWarningStage(2);
  }, [getShareUrl, t]);

  const proceedWithoutBackup = useCallback(() => {
    setWarningStage(2);
  }, []);

  const confirmDataOverwrite = useCallback(() => {
    try {
      if (pendingSharedData) {
        setAllStorageData(pendingSharedData as Record<string, unknown>);
        cleanUrl();
        setShowWarningModal(false);
        if (onDataLoaded) {
          onDataLoaded();
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error loading shared data:", error);
      setCopyStatus(t.failedToProcess);
      setTimeout(() => setCopyStatus(""), 2000);
    }
  }, [pendingSharedData, cleanUrl, onDataLoaded, t]);

  const cancelWarning = useCallback(() => {
    setShowWarningModal(false);
    setWarningStage(1);
    setPendingSharedData(null);
    cleanUrl();
    setCopyStatus("Shared data was not loaded. Your current data is safe.");
    setTimeout(() => setCopyStatus(""), 3000);
  }, [cleanUrl]);

  return {
    // State
    showShareModal,
    setShowShareModal,
    showWarningModal,
    setShowWarningModal,
    warningStage,
    setWarningStage,
    copyStatus,
    setCopyStatus,

    // Methods
    getShareUrl,
    hasSharedDataInUrl,
    copyShareLink,
    copyMyDataAndProceed,
    proceedWithoutBackup,
    confirmDataOverwrite,
    cancelWarning,
  };
}
