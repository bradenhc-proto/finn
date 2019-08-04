/** @typedef {import('./account')} Account module:model.Account */
const uuid = require('uuid/v4');
const Joi = require('@hapi/joi');
const TransactionType = require('./transaction-type');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');
const checkProperty = require('../utils/check-property');

const JoiSchema = Joi.object().keys({
  id: Joi.strict(),
  type: Joi.string()
    .allow(Object.values(TransactionType))
    .required(),
  details: Joi.string().required(),
  sourceAccountId: Joi.string().allow(null),
  targetAccountId: Joi.string().required(),
  amount: Joi.string(),
  unitAmount: Joi.number().integer(),
  dateCreated: Joi.date(),
  dateUpdated: Joi.date().allow(null),
  isCompleted: Joi.boolean()
});

/**
 * Represents a transaction affecting one or more accounts.
 *
 * Just as with accounts, transactions store their monetary amounts in two parts: whole and remainder. This is to avoid
 * potential errors with floating point arithmatic in hardware.
 *
 * @memberof module:model
 */
class Transaction {
  constructor() {
    /**
     * The UUID of the transaction.
     * @type {string}
     */
    this.id = uuid();

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
    this.sourceAccountId = null;

    /**
     * The account targeted by the transaction.
     * @type {string}
     */
    this.targetAccountId = null;

    /**
     * The string representation of the human readable amount.
     * @type {string}
     */
    this.amount = "0.00";

    /**
     * The amount in the transaction in $0.00001.
     * @type {number}
     */
    this.unitAmount = null;

    /**
     * The UNIX timestamp (UTC) in milliseconds of when the transaction took place.
     * @type {number}
     */
    this.dateCreated = Date.now();

    /**
     * The UNIX timestamp (UTC) in milliseconds of when the transaction information was updated.
     * @type {number}
     */
    this.dateUpdated = null;

    /**
     * Indicates if the transaction has been completed.
     * @type {boolean}
     */
    this.isCompleted = false;
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

  /**
   * Validates an object and, if validation passes, applies the Transaction prototype to the object, essentially
   * "converting" the object to be of type Transaction.
   *
   * @param {object} obj The object to validate and apply the Transaction prototype to.
   * @param {boolean} [isNew] Indicates whether the object represents a new Transaction or an existing one. Defaults
   * to false.
   * @returns {Transaction} The object passed in the parameter with the Transaction prototype applied.
   */
  static convert(obj, isNew = false) {
    let validation = Joi.validate(obj, JoiSchema);
    if (validation.error) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Invalid format for request to create transaction',
        validation.error.details.map(e => e.message)
      );
    }

    // Passed initial schema validation. Perform additional checks.
    checkProperty('id', obj, isNew, uuid);
    checkProperty('dateCreated', obj, isNew, Date.now);
    checkProperty('isCompleted', obj, isNew, () => false);

    obj.__proto__ = Transaction.prototype;

    return obj;
  }
}

module.exports = Transaction;
