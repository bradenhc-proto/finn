const proto = (module.exports = {
  CASH: 'cash',
  DEBT: 'debt',

  /**
   * Determines whether the string is a valid account type
   * 
   * @param {string} str the string to validate
   * @returns {string} The passed in string if valid.
   * @throws {Error} When the provided string is not a valid type
   */
  validate: function(str) {
    switch (str) {
      case proto.CASH:
      case proto.DEBT:
        return str;
    }
    throw new Error(`Invalid account type "${str}"`);
  }
});
