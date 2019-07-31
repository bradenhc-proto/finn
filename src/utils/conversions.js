const UNIT_RATIO = 10000;

module.exports = {
  /**
   * Convert a "human-readable" amount (dollars and cents) into unit amounts to avoid floating point errors in
   * calculations.
   *
   * @param {number|string} amount The human-readable amount to convert to a unit amount.
   * @returns {number} The unit amount (in $0.00001)
   */
  toUnitAmount: function(amount) {
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    return amount * UNIT_RATIO;
  },

  /**
   * Convert a robust unit amount back into a more "human-readable" format (dollars and cents) after completing
   * computations that may result in floating point errors.
   *
   * @param {number} amount The unit amount to convert.
   * @returns {number} the "human-readable" amount.
   */
  fromUnitAmount: function(amount) {
    return Math.floor(amount / UNIT_RATIO) + (amount % UNIT_RATIO) * (1 / UNIT_RATIO);
  }
};
