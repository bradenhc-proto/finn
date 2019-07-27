const proto = (module.exports = {
  CASH: 'cash',
  DEBT: 'debt',

  /**
   * Determines whether the string is a valid account type
   * 
   * @param {string} str the string to validate
   */
  validate: function(str) {
    switch (str) {
      case proto.CASH:
      case proto.DEBT:
        return true;
    }
    throw new Error(`Invalid account type "${str}"`);
  }
});
