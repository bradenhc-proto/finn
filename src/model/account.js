const uuid = require('uuid/v4');

const AccountType = require('./account-type');

/**
 * Represents information about a financial account, including the amount of money.
 *
 * @class
 * @param {string|undefined} id The ID of the account. If undefined, a new, random UUID will be generated.
 * @memberof module:model
 */
class Account {
  constructor(id) {
    if (id === undefined) {
      id = uuid();
    }
    /**
     * @type {string}
     */
    this.id = id;
    /**
     * @type {string}
     */
    this.type = AccountType.CASH;
    /**
     * @type {string}
     */
    this.name = null;
    /**
     * @type {string}
     */
    this.description = null;
    /**
     * @type {number}
     */
    this.unitAmount = 0;
  }
  /**
   * Adds an income amount to the account.
   *
   * If the account is a `CASH` account, it will add the money. If it is a `DEBT` account, it will subtract it.
   *
   * @param {number} unitAmount the monetary amount in units, where one unit is $0.00001.
   */
  addIncome(unitAmount) {
    switch (this.type) {
      case AccountType.CASH:
        this.unitAmount += unitAmount;
        break;
      case AccountType.DEBT:
        this.unitAmount -= unitAmount;
    }
  }

  /**
   * Adds an income amount to the account.
   *
   * If the account is a `CASH` account, it will subtract the money. If it is a `DEBT` account, it will add it.
   *
   * @param {number} unitAmount the monetary amount in units, where one unit is $0.00001.
   */
  addExpense(unitAmount) {
    switch (this.type) {
      case AccountType.CASH:
        this.unitAmount -= unitAmount;
      case AccountType.DEBT:
        this.unitAmount += unitAmount;
    }
  }
}

module.exports = Account;
