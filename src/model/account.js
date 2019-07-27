const uuid = require('uuid/v4');

const AccountType = require('./account-type');

const USD_MAX = 100;

/**
 * Represents information about a financial account, including the amount of money.
 *
 * @class
 * @param {string|undefined} id The ID of the account. If undefined, a new, random UUID will be generated.
 * @memberof module:model
 */
function Account(id) {
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
  this.amountWhole = 0;

  /**
   * @type {number}
   */
  this.amountRemainder = 0;
}

/**
 * Adds an income amount to the account.
 *
 * If the account is a `CASH` account, it will add the money. If it is a `DEBT` account, it will subtract it.
 *
 * @param {number} amountWhole the whole amount (left of decimal) of the monetary amount
 * @param {number} amountRemainder the remainder (left of the decimal) of the monetary amount
 */
Account.prototype.addIncome = function(amountWhole, amountRemainder) {
  if (this.type === AccountType.CASH) {
    let remainder = this.amountRemainder + amountRemainder;
    if (remainder > USD_MAX) {
      this.amountWhole += 1;
      remainder = remainder % USD_MAX;
    }
    this.amountWhole += amountWhole;
    this.amountRemainder += remainder;
  } else {
    let remainder = this.amountRemainder - amountRemainder;
    if (remainder < 0) {
      this.amountWhole -= 1;
      remainder = remainder % USD_MAX;
    }
    this.amountWhole -= amountWhole;
    this.amountRemainder -= remainder;
  }
};

/**
 * Adds an income amount to the account.
 *
 * If the account is a `CASH` account, it will subtract the money. If it is a `DEBT` account, it will add it.
 *
 * @param {number} amountWhole the whole amount (left of decimal) of the monetary amount
 * @param {number} amountRemainder the remainder (left of the decimal) of the monetary amount
 */
Account.prototype.addExpense = function(amountWhole, amountRemainder) {
  if (this.type === AccountType.DEBT) {
    let remainder = this.amountRemainder + amountRemainder;
    if (remainder > USD_MAX) {
      this.amountWhole += 1;
      remainder = remainder % USD_MAX;
    }
    this.amountWhole += amountWhole;
    this.amountRemainder += remainder;
  } else {
    let remainder = this.amountRemainder - amountRemainder;
    if (remainder < 0) {
      this.amountWhole -= 1;
      remainder = remainder % USD_MAX;
    }
    this.amountWhole -= amountWhole;
    this.amountRemainder -= remainder;
  }
};

module.exports = Account;
