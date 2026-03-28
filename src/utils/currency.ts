/**
 * Formats a Kwanza amount using the Angolan convention:
 * dot as thousands separator, comma as decimal separator.
 * e.g. formatKwanza(2250) → "Kz 2.250"
 */
export function formatKwanza(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Kz ${formatted}`;
}

/**
 * Formats a Kwanza amount in "mil" (thousands) notation.
 * Divides by 1000 and shows 3 decimal places with dot separator.
 * e.g. formatKwanzaMil(2250) → "Kz 2.250 mil"
 * e.g. formatKwanzaMil(18000) → "Kz 18.000 mil"
 */
export function formatKwanzaMil(amountKz: number): string {
  const inMil = amountKz / 1000;
  // toFixed(3) gives e.g. "2.250", replace decimal dot with Angolan thousands dot
  const formatted = inMil.toFixed(3).replace('.', ',');
  return `Kz ${formatted} mil`;
}

/** Minimum km used to compute the "From" price displayed in the UI. */
export const BASE_KM = 15;

/**
 * Returns the "From Kz X.XXX mil" label for a given price per km.
 * S: 150 × 15 = 2.250 mil ✓
 */
export function fromPrice(pricePerKmKz: number): string {
  return formatKwanzaMil(pricePerKmKz * BASE_KM);
}
