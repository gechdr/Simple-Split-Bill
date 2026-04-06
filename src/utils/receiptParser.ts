import type { BillItem, ParsedReceipt } from "../types";

export function parseReceiptText(text: string): ParsedReceipt {
  const lines = text.split("\n").filter((l) => l.trim());
  const detectedItems: BillItem[] = [];
  const itemWithQtyPattern =
    /^(\d+)x?\s+(.+?)\s+(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+)/i;
  const pricePattern = /(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/;
  let totalPromoDiscount = 0,
    totalVoucher = 0,
    foundSubtotal = false;
  lines.forEach((line, index) => {
    const cleanLine = line.trim();
    if (cleanLine.match(/^(subtotal|total|grand total)/i)) {
      foundSubtotal = true;
      return;
    }
    if (foundSubtotal) return;
    if (
      cleanLine.match(
        /^(order summary|reorder|terima kasih|thank you|receipt|struk|cutlery|profile|contact|earned|points)/i,
      )
    )
      return;
    if (
      cleanLine
        .toLowerCase()
        .match(/discount|diskon|promo|kota|sobat|voucher/)
    ) {
      const neg = cleanLine.match(/-\s*(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/);
      if (neg) {
        const amt = parseInt(neg[1].replace(/[.,]/g, ""));
        if (cleanLine.toLowerCase().match(/kota|sobat|\d+rb min \d+rb/))
          totalPromoDiscount += amt;
        else totalVoucher += amt;
        return;
      }
      const pos = cleanLine.match(/(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/);
      if (pos) {
        const amt = parseInt(pos[1].replace(/[.,]/g, ""));
        if (amt >= 100) totalPromoDiscount += amt;
      }
      return;
    }
    const qtyMatch = cleanLine.match(itemWithQtyPattern);
    if (qtyMatch) {
      const itemName = qtyMatch[2].trim(),
        totalPrice = qtyMatch[3].replace(/[.,]/g, "");
      if (itemName.length > 2 && totalPrice.length >= 3)
        detectedItems.push({
          id: Date.now() + Math.random() * 1000000 + index * 100,
          name: itemName,
          price: Math.round(
            parseInt(totalPrice) / parseInt(qtyMatch[1]),
          ).toString(),
          persons: {},
          priceType: "unit",
        });
      return;
    }
    const priceMatch = cleanLine.match(pricePattern);
    if (
      priceMatch &&
      !cleanLine.match(/fee|biaya|ongkir|delivery|tax|pajak/i)
    ) {
      const priceStr = priceMatch[1].replace(/[.,]/g, "");
      const itemName = cleanLine
        .substring(0, cleanLine.indexOf(priceMatch[0]))
        .replace(/^\d+x?\s*/, "")
        .trim();
      if (itemName && priceStr && itemName.length > 2 && priceStr.length >= 3)
        detectedItems.push({
          id: Date.now() + Math.random() * 1000000 + index * 100,
          name: itemName,
          price: priceStr,
          persons: {},
          priceType: "unit",
        });
    }
  });
  const taxMatch = text.match(/(?:tax|pajak|ppn|pb1).*?(\d+)%/i);
  const serviceMatch = text.match(
    /(?:service|layanan|order fee|admin).*?(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/i,
  );
  const deliveryMatch = text.match(
    /(?:delivery|ongkir|ongkos kirim|delivery fee).*?(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/i,
  );
  return {
    items: detectedItems,
    tax: taxMatch ? taxMatch[1] : "",
    biayaLayanan: serviceMatch ? serviceMatch[1].replace(/[.,]/g, "") : "",
    ongkir: deliveryMatch ? deliveryMatch[1].replace(/[.,]/g, "") : "",
    diskon: totalPromoDiscount > 0 ? totalPromoDiscount.toString() : "",
    voucher: totalVoucher > 0 ? totalVoucher.toString() : "",
  };
}
