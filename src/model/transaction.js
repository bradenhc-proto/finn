/** @typedef {import('./account')} Account module:model.Account */
const uuid = require('uuid/v4');
const Joi = require('@hapi/joi');
const TransactionType = require('./transaction-type');
const conversions = require('../utils/conversions');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');

const Schema = {
  id: Joi.strict(),
  type: Joi.string().allow(Object.values(TransactionType)),
  details: Joi.string(),
  sourceAccountId: Joi.string().allow(null),
  targetAccountId: Joi.string(),
  amount: Joi.string(),
  unitAmount: Joi.number().integer(),
  conversionFactor: Joi.number().integer(),
  dateApplied: Joi.date(),
  dateCreated: Joi.date(),
  dateUpdated: Joi.date().allow(null),
  isCompleted: Joi.boolean()
};

const CreateRequestSchema = Joi.object().keys({
  type: Schema.type.required(),
  details: Schema.details.required(),
  sourceAccountId: Schema.sourceAccountId.optional(),
  targetAccountId: Schema.targetAccountId.required(),
  amount: Schema.amount.required(),
  dateApplied: Schema.dateApplied.required()
});

const UpdateRequestSchema = Joi.object().keys({
  type: Schema.type.optional(),
  details: Schema.details.optional(),
  sourceAccountId: Schema.sourceAccountId.optional(),
  targetAccountId: Schema.targetAccountId.optional(),
  amount: Schema.amount.optional(),
  dateApplied: Schema.dateApplied.optional()
});

const ReadSchema = Joi.object()
  .keys(Schema)
  .options({ presence: 'required' });

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
    this.amount = '0.00';

    /**
     * The amount in the transaction in $0.00001.
     * @type {number}
     */
    this.unitAmount = null;

    /**
     * The conversion factor used to transform the string amount to a numerical unit amount and visa versa.
     * @type {number}
     */
    this.conversionFactor = conversions.CONVERSION_FACTOR;

    /**
     * The date when the transaction took place.
     */
    this.dateApplied = Date.now();

    /**
     * The UNIX timestamp (UTC) in milliseconds of when the transaction information was created.
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
   * Applies the Transaction prototype to the object, essentially "converting" the object to be of type Transaction.
   *
   * @param {object} obj The object to validate and apply the Transaction prototype to.
   * @returns {Transaction} The object passed in the parameter with the Transaction prototype applied.
   */
  static apply(obj) {
    obj.__proto__ = Transaction.prototype;
    return obj;
  }

  /**
   * Validates whether the JSON body in an HTTP request to create a new transaction conforms to the required schema.
   *
   * @param {object} body The HTTP request body (as JSON) to validate.
   * @throws {FinnEror} When the validation fails (HTTP ERROR 400)
   */
  static validateCreateRequest(body) {
    let result = Joi.validate(body, CreateRequestSchema);
    if (result.error) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Improperly formatted body in request to create a transaction',
        result.error.details.map(d => d.message)
      );
    }
  }

  /**
   * Validates whether the JSON body in an HTTP request to update transaction information conforms to the required schema.
   *
   * @param {object} body The HTTP request body (as JSON) to validate.
   * @throws {FinnEror} When the validation fails (HTTP ERROR 400)
   */
  static validateUpdateRequest(body) {
    let result = Joi.validate(body, UpdateRequestSchema);
    if (result.error) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Impropery formatted body in request to update an existing transaction',
        result.error.details.map(d => d.message)
      );
    }
  }

  /**
   * Validates whether raw data read from the database conforms to the Account schema.
   *
   * @param {object} queryResult The resulting object read from the database that represents account information.
   * @throws {FinnError} When the validation fails and corrupt data is detected (HTTP ERROR 500)
   */
  static validateReadFromDatabase(queryResult) {
    let result = Joi.validate(queryResult, ReadSchema);
    if (result.error) {
      throw new FinnError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Corrupted data detected when reading from database',
        result.error.details.map(d => d.message)
      );
    }
  }
}

module.exports = Transaction;
