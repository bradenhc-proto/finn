const FinnError = require('./error');
const HttpStatus = require('http-status-codes');

const UNIT_RATIO = 10000;

module.exports = {
  /**
   * Convert a "human-readable" amount (dollars and cents) into unit amounts to avoid floating point errors in
   * calculations.
   *
   * @param {number|string} amount The human-readable amount to convert to a unit amount.
   * @returns {number} The unit amount (in $0.00001)
   * @throws {FinnError} When the amount evaluates to a false value (i.e. it is missing)
   */
  toUnitAmount: function(amount) {
    if (!amount) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Missing monetary amount',
        'Cannot complete conversion to unit amount due to missing amount'
      );
    }
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
   * @returns {string} the "human-readable" amount.
   */
  fromUnitAmount: function(amount) {
    return (Math.floor(amount / UNIT_RATIO) + (amount % UNIT_RATIO) * (1 / UNIT_RATIO)).toFixed(2);
  }
};
