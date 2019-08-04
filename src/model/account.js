const uuid = require('uuid/v4');
const Joi = require('@hapi/joi');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');
const AccountType = require('./account-type');
const checkProperty = require('../utils/check-property');
const conversions = require('../utils/conversions');

const JoiSchema = Joi.object().keys({
  id: Joi.string(),
  type: Joi.string().allow(Object.values(AccountType)),
  name: Joi.string().regex(/[a-zA-Z0-9 \-\.]+/),
  description: Joi.string().max(256),
  amount: Joi.string(),
  unitAmount: Joi.number().integer()
});

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
    this.amount = conversions.fromUnitAmount(this.unitAmount);
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
    this.amount = conversions.fromUnitAmount(this.unitAmount);
  }

  /**
   * Converts the provided object to an Account by validating and then setting it's prototype.
   *
   * Validates the provided object and, if it passes validation, applies the Account prototype to the object. This
   * keeps us from incuring the overhead of creating a new object as opposed to validating and applying existing
   * prototype chains.
   *
   * @param {object} obj The object to validate and apply class functions to.
   * @param {boolean} [isNew] Indicates whether the object represents a new account or an existing one. Defaults to
   * false.
   * @returns {Account} The object with the Account prototype.
   * @throws {FinnEror} When validation fails.
   */
  static convert(obj, isNew = false) {
    if (obj) {
      // Make sure the incoming props are valid
      let validationResult = Joi.validate(obj, JoiSchema);
      if (validationResult.error) {
        throw new FinnError(
          HttpStatus.BAD_REQUEST,
          'Invalid format for request on account resource',
          validationResult.error.details.map(e => e.message)
        );
      }

      // Good to go! Simply apply the prototype to the object, adding a default ID if necessary
      checkProperty('id', obj, isNew, uuid);

      obj.__proto__ = Account.prototype;

      return obj;
    }
  }
}

module.exports = Account;
