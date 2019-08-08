const accountsRepo = require('../data-access/mock/accounts-repo');
const conversions = require('../utils/conversions');
const Account = require('../model/account');
const FinnError = require('../utils/error');
const HttpStatus = require('http-status-codes');

module.exports = {
  /**
   *
   * @param {*} account
   * @returns {Promise<Account>} A promise resolving to the newly created account.
   */
  createNewAccountFromBody: async function(body) {
    let account = Account.convert(body);
    account.unitAmount = conversions.toUnitAmount(account.amount || '0.00');
    await accountsRepo.add(account);
    return account;
  },

  /**
   *
   * @typedef {object} AccountsQueryOptions
   * @property {string} [id] The ID of the account to fetch in the query
   *
   * @param {AccountsQueryOptions} [options] The options used to filter query results
   * @returns {Promise<Account[]>} A promise resolving to an array containing the query results as Account objects.
   */
  queryAccounts: async function(options) {
    let results;
    if (options && options.id) {
      results = [await accountsRepo.get(options.id)];
    } else {
      results = await accountsRepo.all();
    }
    return results;
  },

  /**
   *
   * @param {string} id The ID of the account to update.
   * @param {object} body The unvalidated JSON body (as an object) from the request.
   * @returns {Promise<Account>} A promise resolving to the reference to the updated Account object.
   */
  updateAccountFromBody: async function(id, body) {
    body.id = id;
    body.unitAmount = conversions.toUnitAmount(body.amount);
    let oldAccount = await accountsRepo.get(id);
    if (!oldAccount) {
      throw new FinnError(HttpStatus.NOT_FOUND, 'Failed to find account to update');
    }
    let updatedAccount = Account.convert({ ...oldAccount, ...body });
    await accountsRepo.update(updatedAccount);
    return updatedAccount;
  }
};
