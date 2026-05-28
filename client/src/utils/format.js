/** Format a number as Bangladeshi Taka, e.g. 1450 → "৳1,450". */
export const bdt = (n) => `৳${Number(n || 0).toLocaleString('en-US')}`

/** Whole-percent discount from original → current price (0 if none). */
export const discountPct = (price, originalPrice) =>
  originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0
