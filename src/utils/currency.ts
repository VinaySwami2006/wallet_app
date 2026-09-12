/**
 * Currency helpers — formatted as USD ($) matching reference image.
 */
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatINR = (amount: number): string => usd.format(amount);

export const formatSignedINR = (amount: number, isReceived: boolean): string =>
  `${isReceived ? '+' : '-'}${usd.format(Math.abs(amount))}`;