function formatCurrency (cents) {
  const dollars = cents / 100;

  return `$${dollars.toFixed(2)}`;
}

function formatPeriod (period) {
  return Object.entries(period)
    .map(([duration, number]) => `${number} ${duration}`)
    .join(' ');
}

function formatPrice (price, period) {
  return period
    ? `${formatCurrency(price)} per ${formatPeriod(period)}`
    : formatCurrency(price);
}

module.exports = {
  formatCurrency,
  formatPeriod,
  formatPrice,
};
