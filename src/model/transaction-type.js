const proto = (module.exports = {
  UNKNOWN: 'unknown',
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
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
