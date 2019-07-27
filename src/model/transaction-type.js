const proto = (module.exports = {
  UNKNOWN: 'unknown',
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',

  /**
   * Determines whether a string is a valid transaction type.
   * 
   * @param {string} str the string to validate.
   */
  validate: function(str) {
    switch (str) {
      case proto.UNKNOWN:
      case proto.INCOME:
      case proto.EXPENSE:
      case proto.TRANSFER:
        return true;
    }
    throw new Error(`Invalid transaction type "${str}"`);
  }
});
