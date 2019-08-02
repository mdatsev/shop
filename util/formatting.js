module.exports = {
  formatCurrency (cents) {
    const dollars = cents / 100;

    return `$${dollars.toFixed(2)}`;
  },
};
