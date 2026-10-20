export function scaleQuantity(quantity: string, factor: number): string {
  if (factor === 1) return quantity;
  return quantity.replace(/(\d+(?:[\.\/]\d+)?)/g, (match) => {
    let value: number;
    if (match.includes("/")) {
      const [num, den] = match.split("/").map(Number);
      if (!den) return match;
      value = num / den;
    } else {
      value = parseFloat(match);
    }
    if (!Number.isFinite(value)) return match;
    const scaled = value * factor;
    const rounded = Math.round(scaled * 100) / 100;
    return String(rounded);
  });
}

/**
 * Display text for an amount. Most quantities already carry their unit ("2 kg",
 * "1 stick"); the ingredient's default unit is only added after a bare number ("2").
 */
export function formatAmount(quantity: string, unit: string | null | undefined): string {
  const bareNumber = !/[^\d\s.,/½¼¾⅓⅔-]/.test(quantity);
  return bareNumber && unit ? `${quantity} ${unit}`.trim() : quantity;
}
