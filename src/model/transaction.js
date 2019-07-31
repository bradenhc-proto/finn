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
     * @type {string}
     */
    this.sourceAccount = null;

    /**
     * The account targeted by the transaction.
     * @type {string}
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
   * @param {Account} target The target account.
   * @param {Account} [source] The source account if the transaction is a transfer
   * @throws {Error} When an invalid transaction is processed, such as one that will cause an account balance to become
   * negative.
   */
  execute(target, source) {
    switch (this.type) {
      case TransactionType.INCOME:
        return this._executeIncome(target);
      case TransactionType.EXPENSE:
        return this._executeExpense(target);
      case TransactionType.TRANSFER:
        return this._executeTransfer(source, target);
    }
  }

  _executeIncome(target) {
    target.addIncome(this.unitAmount);
  }

  _executeExpense(target) {
    target.addExpense(this.unitAmount);
  }

  _executeTransfer(source, target) {
    source.addExpense(this.unitAmount);
    target.addIncome(this.unitAmount);
  }
};

module.exports =  Transaction;
