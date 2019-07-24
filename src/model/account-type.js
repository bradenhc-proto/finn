const proto = (module.exports = {
  CASH: 'cash',
  DEBT: 'debt',
  validate: function(str) {
    switch (str) {
      case proto.CASH:
      case proto.DEBT:
        return true;
    }
    throw new Error(`Invalid account type "${str}"`);
  }
});
