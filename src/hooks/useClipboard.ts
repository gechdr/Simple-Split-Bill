import { useState, useCallback, type RefObject } from "react";
import domtoimage from "dom-to-image";
import type { Translations } from "../translations";
import { NOTIFICATION_DURATION_MS, IMAGE_SCALE_SUMMARY, IMAGE_SCALE_TRACKER } from "../utils/constants";

interface UseClipboardInput {
  summaryRef: RefObject<HTMLDivElement | null>;
  paymentTrackerRef: RefObject<HTMLDivElement | null>;
  darkMode: boolean;
  t: Translations;
}

export function useClipboard({ summaryRef, paymentTrackerRef, darkMode, t }: UseClipboardInput) {
  const [captureStatus, setCaptureStatus] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [paymentCopyStatus, setPaymentCopyStatus] = useState("");

  const handleCapture = useCallback(
    async (actionType: "download" | "copy") => {
      if (!summaryRef.current) return;
      setIsCapturing(true);
      if (actionType === "download") setDownloadStatus(t.processing);
      else setCaptureStatus(t.processing);
      try {
        await document.fonts.ready;
        const el = summaryRef.current;
        const dataUrl = await domtoimage.toPng(el, {
          quality: 1,
          bgcolor: darkMode ? "#1f2937" : "#ffffff",
          style: {
            transform: `scale(${IMAGE_SCALE_SUMMARY})`,
            transformOrigin: "top left",
            width: el.offsetWidth + "px",
            height: el.offsetHeight + "px",
          },
          width: el.offsetWidth * IMAGE_SCALE_SUMMARY,
          height: el.offsetHeight * IMAGE_SCALE_SUMMARY,
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
      }, NOTIFICATION_DURATION_MS);
    },
    [summaryRef, darkMode, t],
  );

  const handlePaymentCopy = useCallback(async () => {
    if (!paymentTrackerRef.current) return;
    setPaymentCopyStatus(t.processing);
    try {
      await document.fonts.ready;
      const el = paymentTrackerRef.current;
      const dataUrl = await domtoimage.toPng(el, {
        quality: 1,
        bgcolor: darkMode ? "#1f2937" : "#ffffff",
        style: {
          transform: `scale(${IMAGE_SCALE_TRACKER})`,
          transformOrigin: "top left",
          width: el.offsetWidth + "px",
          height: el.offsetHeight + "px",
        },
        width: el.offsetWidth * IMAGE_SCALE_TRACKER,
        height: el.offsetHeight * IMAGE_SCALE_TRACKER,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      try {
        if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
          throw new Error("Image clipboard API not supported");
        }
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setPaymentCopyStatus(t.copied);
      } catch {
        const link = document.createElement("a");
        link.download = `payment-tracker-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setPaymentCopyStatus(t.downloaded);
      }
    } catch {
      setPaymentCopyStatus(t.failedToProcess);
    }
    setTimeout(() => setPaymentCopyStatus(""), NOTIFICATION_DURATION_MS);
  }, [paymentTrackerRef, darkMode, t]);

  return {
    captureStatus,
    downloadStatus,
    isCapturing,
    paymentCopyStatus,
    handleCapture,
    handlePaymentCopy,
  };
}
