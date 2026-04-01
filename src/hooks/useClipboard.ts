import { useState, useCallback, type RefObject } from "react";
import domtoimage from "dom-to-image";
import type { Translations } from "../translations";

interface UseClipboardInput {
  summaryRef: RefObject<HTMLDivElement | null>;
  darkMode: boolean;
  t: Translations;
}

export function useClipboard({ summaryRef, darkMode, t }: UseClipboardInput) {
  const [captureStatus, setCaptureStatus] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = useCallback(
    async (actionType: "download" | "copy") => {
      if (!summaryRef.current) return;
      setIsCapturing(true);
      if (actionType === "download") setDownloadStatus(t.processing);
      else setCaptureStatus(t.processing);
      try {
        await document.fonts.ready;
        const dataUrl = await domtoimage.toPng(summaryRef.current, {
          quality: 1,
          bgcolor: darkMode ? "#1f2937" : "#ffffff",
          style: {
            transform: "scale(5)",
            transformOrigin: "top left",
            width: summaryRef.current.offsetWidth + "px",
            height: summaryRef.current.offsetHeight + "px",
          },
          width: summaryRef.current.offsetWidth * 5,
          height: summaryRef.current.offsetHeight * 5,
        });
        if (actionType === "download") {
          const link = document.createElement("a");
          link.download = `split-bill-${Date.now()}.png`;
          link.href = dataUrl;
          link.click();
          setDownloadStatus(t.downloaded);
        } else {
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCaptureStatus(t.copied);
          } catch {
            setCaptureStatus(t.failedToCopy);
          }
        }
      } catch {
        if (actionType === "download") setDownloadStatus(t.failedToProcess);
        else setCaptureStatus(t.failedToProcess);
      }
      setTimeout(() => {
        setCaptureStatus("");
        setDownloadStatus("");
        setIsCapturing(false);
      }, 2000);
    },
    [summaryRef, darkMode, t],
  );

  const handlePaymentCopy = useCallback(
    async (
      paymentTrackerRef: RefObject<HTMLDivElement | null>,
      setPaymentCopyStatus: (status: string) => void,
    ) => {
      if (!paymentTrackerRef.current) return;
      setPaymentCopyStatus(t.processing);
      try {
        await document.fonts.ready;
        const el = paymentTrackerRef.current;
        const dataUrl = await domtoimage.toPng(el, {
          quality: 1,
          bgcolor: darkMode ? "#1f2937" : "#ffffff",
          style: {
            transform: "scale(3)",
            transformOrigin: "top left",
            width: el.offsetWidth + "px",
            height: el.offsetHeight + "px",
          },
          width: el.offsetWidth * 3,
          height: el.offsetHeight * 3,
        });
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setPaymentCopyStatus(t.copied);
      } catch {
        setPaymentCopyStatus(t.failedToCopy);
      }
      setTimeout(() => setPaymentCopyStatus(""), 2000);
    },
    [darkMode, t],
  );

  return {
    captureStatus,
    downloadStatus,
    isCapturing,
    handleCapture,
    handlePaymentCopy,
  };
}
