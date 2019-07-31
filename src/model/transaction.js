/** @typedef {import('./account')} Account module:model.Account */
const uuid = require('uuid/v4');

const TransactionType = require('./transaction-type');

/**
 * Represents a transaction affecting one or more accounts.
 *
 * Just as with accounts, transactions store their monetary amounts in two parts: whole and remainder. This is to avoid
 * potential errors with floating point arithmatic in hardware.
 * 
 * @memberof module:model
 */
class Transaction {
  constructor(id) {
    if (id === undefined) {
      id = uuid();
    }

    /**
     * The UUID of the transaction.
     * @type {string}
     */
    this.id = id;

    /**
     * The type of transaction. This will determine the behavior of executing the transaction.
     * @type {string}
     */
    this.type = TransactionType.UNKNOWN;

    /**
     * More details associated with the transaction.
     * @type {string} 
     */
    this.details = '';
    
    /**
     * The source account for a transfer. Only valid when the transaction type is `'transfer'`.
     * @type {Account}
     */
    this.sourceAccount = null;

    /**
     * The account targeted by the transaction.
     * @type {Account}
     */
    this.targetAccount = null;

    /**
     * The amount in the transaction in $0.00001.
     * @type {number}
     */
    this.unitAmount = null;

    /**
     * The UNIX timestamp (UTC) in milliseconds of when the transaction took place.
     * @type {number}
     */
    this.datetime = Date.now();
  }

  /**
   * Executes the transaction in a manner based on its type.
   *
   * @throws {Error} When an invalid transaction is processed, such as one that will cause an account balance to become
   * negative.
   */
  execute() {
    switch (this.type) {
      case TransactionType.INCOME:
        return this._executeIncome();
      case TransactionType.EXPENSE:
        return this._executeExpense();
      case TransactionType.TRANSFER:
        return this._executeTransfer();
    }
  }

  _executeIncome() {
    this.targetAccount.addIncome(this.unitAmount);
  }

  _executeExpense() {
    this.targetAccount.addExpense(this.unitAmount);
  }

  _executeTransfer() {
    this.sourceAccount.addExpense(this.unitAmount);
    this.targetAccount.addIncome(this.unitAmount);
  }
};

module.exports =  Transaction;
