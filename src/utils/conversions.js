const FinnError = require('./error');
const HttpStatus = require('http-status-codes');

module.exports = {
  /**
   * The factor used to convert amounts to unit amounts and visa versa.
   * @type {number}
   */
  CONVERSION_FACTOR: 10000,

  /**
   * Convert a "human-readable" amount (dollars and cents) into unit amounts to avoid floating point errors in
   * calculations.
   *
   * @param {string} amount The human-readable amount to convert to a unit amount.
   * @param {number} factor The converstion factor used to convert the string amount to a numerical unit amount.
   * @returns {number} The unit amount (in $0.00001)
   * @throws {FinnError} When the amount evaluates to a false value (i.e. it is missing)
   */
  toUnitAmount: function(amount, factor) {
    if (!amount) {
      throw new FinnError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Missing monetary amount',
        'Cannot complete conversion to unit amount due to missing amount'
      );
    }
    if(!factor) {
      throw new FinnError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Unit amount conversion failure',
        'Converting to the unit amount requires a factor'
      );
    }
    return parseFloat(amount) * factor;
  },

  /**
   * Convert a robust unit amount back into a more "human-readable" format (dollars and cents) after completing
   * computations that may result in floating point errors.
   *
   * @param {number} amount The unit amount to convert.
   * @param {number} factor The conversion factor used to convert the numerical amount back to a string representation.
   * @returns {string} the "human-readable" amount.
   */
  fromUnitAmount: function(amount, factor) {
    if (!amount) {
      throw new FinnError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Missing monetary amount',
        'Cannot complete conversion to unit amount due to missing amount'
      );
    }
    if(!factor) {
      throw new FinnError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Unit amount conversion failure',
        'Converting to the unit amount requires a factor'
      );
    }
    return (Math.floor(amount / factor) + (amount % factor) * (1 / factor)).toFixed(2);
  }
};
