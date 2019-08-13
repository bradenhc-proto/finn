const uuid = require('uuid/v4');
const Joi = require('@hapi/joi');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');
const AccountType = require('./account-type');
const conversions = require('../utils/conversions');

const Schema = {
  id: Joi.string(),
  type: Joi.string().allow(Object.values(AccountType)),
  name: Joi.string().regex(/[a-zA-Z0-9 \-\.]+/),
  description: Joi.string().max(256),
  amount: Joi.string(),
  unitAmount: Joi.number().integer(),
  conversionFactor: Joi.number().integer(),
  isDeleted: Joi.boolean()
};

const CreateRequestSchema = {
  type: Schema.type.required(),
  name: Schema.name.required(),
  description: Schema.description.optional()
};

const UpdateRequestSchema = {
  name: Schema.name.required(),
  description: Schema.description.optional()
};

const ReadSchema = Joi.object()
  .keys(Schema)
  .options({ presence: 'required' });

/**
 * Represents information about a financial account, including the amount of money.
 *
 * @memberof module:model
 */
class Account {
  /**
   * Constructs a new account object.
   */
  constructor() {
    /**
     * @type {string}
     */
    this.id = uuid();

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
     * The string representation of the human readable amount.
     * @type {string}
     */
    this.amount = '0.00';

    /**
     * @type {number}
     */
    this.unitAmount = 0;

    /**
     * The conversion factor used for this account.
     * @type {number}
     */
    this.conversionFactor = conversions.CONVERSION_FACTOR;

    /**
     * Indicates whether the account has been "deleted" or not.
     * @type {boolean}
     */
    this.isDeleted = false;
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
    this.amount = conversions.fromUnitAmount(this.unitAmount, this.conversionFactor);
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
    this.amount = conversions.fromUnitAmount(this.unitAmount, this.conversionFactor);
  }

  /**
   * Converts a previously validated object to an Account by setting it's prototype.
   *
   * Applies the Account prototype to the object. This keeps us from incuring the overhead of creating a new object as
   * opposed to validating and applying existing prototype chains.
   *
   * @param {object} obj The object to apply class functions to.
   * @returns {Account} A reference to the object with the Account prototype.
   */
  static convert(obj) {
    obj.__proto__ = Account.prototype;
    return obj;
  }

  /**
   * Validates whether the JSON body in an HTTP request to create a new account conforms to the required schema.
   *
   * @param {object} body The HTTP request body (as JSON) to validate.
   * @throws {FinnEror} When the validation fails (HTTP ERROR 400)
   */
  static validateCreateRequest(body) {
    let result = Joi.validate(body, CreateRequestSchema);
    if (result.error) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Improperly formatted body in request to create an account',
        result.error.details.map(d => d.message)
      );
    }
  }

  /**
   * Validates whether the JSON body in an HTTP request to update account information conforms to the required schema.
   *
   * @param {object} body The HTTP request body (as JSON) to validate.
   * @throws {FinnEror} When the validation fails (HTTP ERROR 400)
   */
  static validateUpdateRequest(body) {
    let result = Joi.validate(body, UpdateRequestSchema);
    if (result.error) {
      throw new FinnError(
        HttpStatus.BAD_REQUEST,
        'Impropery formatted body in request to update an existing account',
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

module.exports = Account;
